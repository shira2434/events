import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCategories } from '../context/CategoriesContext';

const AREAS = ['תל אביב והמרכז', 'ירושלים והסביבה', 'חיפה והצפון', 'הצפון', 'הדרום', 'השרון', 'המרכז', 'כל הארץ'];
const EMPTY_PROVIDER = { BusinessName: '', Category: '', Description: '', WorkArea: '', PriceFrom: '', Email: '', Password: '' };

export default function AdminPage() {
  const navigate = useNavigate();
  const { reload: reloadCategories } = useCategories();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [editProvider, setEditProvider] = useState(null);
  const [images, setImages] = useState({});  // { [providerId]: [...] }
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState(EMPTY_PROVIDER);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [providerCover, setProviderCover] = useState({});
  const [newCat, setNewCat] = useState({ Name: '', Icon: '🏷️' });
  const [catError, setCatError] = useState('');
  const [editCat, setEditCat] = useState(null);
  const multiImageRef = useRef();

  const refreshStats = () => api.get('/admin/stats').then(r => setStats(r.data));
  const refreshProviders = () => api.get('/admin/providers').then(r => setProviders(r.data));
  const refreshCategories = () => api.get('/admin/categories').then(r => setCategories(r.data));

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => navigate('/'));
  }, [navigate]);

  useEffect(() => {
    if (tab === 'providers') {
      refreshProviders().then(() => {});
    }
    if (tab === 'users') api.get('/admin/users').then(r => setUsers(r.data));
    if (tab === 'categories') refreshCategories();
  }, [tab]);

  // Auto-load all images when providers load
  useEffect(() => {
    if (tab === 'providers' && providers.length > 0) {
      providers.forEach(p => {
        if (!images[p.Id]) {
          api.get(`/admin/providers/${p.Id}/images`).then(r => {
            setImages(prev => ({ ...prev, [p.Id]: r.data }));
          });
        }
      });
    }
  }, [providers, tab]);

  const uploadFiles = async (files, providerId) => {
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/admin/providers/${providerId}/images`, formData);
    }
    const r = await api.get(`/admin/providers/${providerId}/images`);
    setImages(prev => ({ ...prev, [providerId]: r.data }));
    refreshProviders();
    setUploading(false);
  };

  const addImageByUrl = async () => {
    if (!urlInput.trim()) return;
    setUrlError('');
    try {
      await api.post(`/admin/providers/${editProvider.Id}/images`, { url: urlInput.trim() });
      const r = await api.get(`/admin/providers/${editProvider.Id}/images`);
      setImages(prev => ({ ...prev, [editProvider.Id]: r.data }));
      setUrlInput('');
      refreshProviders();
    } catch {
      setUrlError('קישור לא תקין');
    }
  };

  const deleteImage = async (imgId, providerId) => {
    await api.delete(`/admin/images/${imgId}`);
    setImages(prev => ({ ...prev, [providerId]: prev[providerId].filter(i => i.Id !== imgId) }));
  };

  const setAdminCover = async (providerId, url) => {
    await api.put(`/admin/providers/${providerId}/cover`, { coverImage: url });
    setProviderCover(prev => ({ ...prev, [providerId]: url }));
    setProviders(prev => prev.map(p => p.Id === providerId ? { ...p, CoverImage: url } : p));
  };

  const saveProvider = async (e) => {
    e.preventDefault();
    await api.put(`/admin/providers/${editProvider.Id}`, {
      businessName: editProvider.BusinessName,
      category: editProvider.Category,
      description: editProvider.Description,
      workArea: editProvider.WorkArea,
      priceFrom: editProvider.PriceFrom,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    refreshProviders();
  };

  const addProvider = async (e) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);
    try {
      const { data } = await api.post('/auth/register', {
        email: newProvider.Email,
        password: newProvider.Password,
        role: 'Provider'
      });
      await api.put('/providers/settings', {
        businessName: newProvider.BusinessName,
        category: newProvider.Category,
        description: newProvider.Description,
        workArea: newProvider.WorkArea,
        priceFrom: newProvider.PriceFrom,
      }, { headers: { Authorization: `Bearer ${data.token}` } });
      setNewProvider(EMPTY_PROVIDER);
      setShowAddProvider(false);
      refreshProviders();
      refreshStats();
    } catch (err) {
      setAddError(err.response?.data?.message || 'שגיאה ביצירת הספק');
    }
    setAdding(false);
  };

  const doDelete = async () => {
    if (confirmDelete.type === 'provider') {
      await api.delete(`/admin/providers/${confirmDelete.id}`);
      setProviders(prev => prev.filter(p => p.Id !== confirmDelete.id));
      if (editProvider?.Id === confirmDelete.id) setEditProvider(null);
    } else if (confirmDelete.type === 'user') {
      await api.delete(`/admin/users/${confirmDelete.id}`);
      setUsers(prev => prev.filter(u => u.Id !== confirmDelete.id));
    } else if (confirmDelete.type === 'category') {
      await api.delete(`/admin/categories/${confirmDelete.id}`);
      setCategories(prev => prev.filter(c => c.Id !== confirmDelete.id));
    }
    setConfirmDelete(null);
    refreshStats();
  };

  const addCategory = async (e) => {
    e.preventDefault();
    setCatError('');
    try {
      // תיקון: שליחת מפתחות באותיות קטנות לטובת השרת
      const payload = {
        name: newCat.Name,
        icon: newCat.Icon
      };

      const r = await api.post('/admin/categories', payload);
      
      // התאמת מבנה האובייקט שחוזר מהשרת למבנה ה-Frontend באותיות גדולות
      const addedCategory = r.data.Id 
        ? r.data 
        : { Id: r.data.id, Name: r.data.name, Icon: r.data.icon };

      setCategories(prev => [...prev, addedCategory]);
      setNewCat({ Name: '', Icon: '🏷️' });
    } catch (err) {
      setCatError(err.response?.data?.message || 'שגיאה ביצירת הקטגוריה');
    }
  };

  const saveCategory = async (cat) => {
    await api.put(`/admin/categories/${cat.Id}`, { name: cat.Name, icon: cat.Icon, bannerUrl: cat.BannerUrl });
    setEditCat(null);
    refreshCategories();
    reloadCategories();
  };

  const filteredProviders = providers.filter(p =>
    p.BusinessName?.toLowerCase().includes(search.toLowerCase()) ||
    p.Category?.toLowerCase().includes(search.toLowerCase()) ||
    p.Email?.toLowerCase().includes(search.toLowerCase())
  );

  const categoryNames = categories.map(c => c.Name);

  return (
    <div className="admin-page">

      {/* Confirm Delete Popup */}
      {confirmDelete && (
        <div className="popup-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="popup-box" onClick={e => e.stopPropagation()}>
            <div className="popup-icon">⚠️</div>
            <h3>אישור מחיקה</h3>
            <p>האם למחוק את <strong>{confirmDelete.name}</strong>?<br />פעולה זו אינה ניתנת לביטול.</p>
            <div className="popup-btns">
              <button className="popup-cancel" onClick={() => setConfirmDelete(null)}>ביטול</button>
              <button className="popup-confirm" onClick={doDelete}>מחק</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Provider Popup */}
      {showAddProvider && (
        <div className="popup-overlay" onClick={() => setShowAddProvider(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>➕ הוסף ספק חדש</h3>
              <button className="admin-modal-close" onClick={() => setShowAddProvider(false)}>✕</button>
            </div>
            {addError && <p className="error" style={{margin:'0 0 1rem'}}>{addError}</p>}
            <form onSubmit={addProvider} className="admin-modal-form">
              <div className="form-row">
                <div className="admin-field">
                  <label>אימייל</label>
                  <input type="email" placeholder="email@example.com" value={newProvider.Email} onChange={e => setNewProvider({...newProvider, Email: e.target.value})} required />
                </div>
                <div className="admin-field">
                  <label>סיסמה</label>
                  <input type="password" placeholder="לפחות 6 תווים" value={newProvider.Password} onChange={e => setNewProvider({...newProvider, Password: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="admin-field">
                  <label>שם העסק</label>
                  <input placeholder="שם העסק" value={newProvider.BusinessName} onChange={e => setNewProvider({...newProvider, BusinessName: e.target.value})} required />
                </div>
                <div className="admin-field">
                  <label>קטגוריה</label>
                  <select value={newProvider.Category} onChange={e => setNewProvider({...newProvider, Category: e.target.value})} required>
                    <option value="">בחר...</option>
                    {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="admin-field">
                  <label>אזור עבודה</label>
                  <select value={newProvider.WorkArea} onChange={e => setNewProvider({...newProvider, WorkArea: e.target.value})}>
                    <option value="">בחר...</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label>מחיר התחלתי (₪)</label>
                  <input type="number" placeholder="0" value={newProvider.PriceFrom} onChange={e => setNewProvider({...newProvider, PriceFrom: e.target.value})} />
                </div>
              </div>
              <div className="admin-field">
                <label>תיאור</label>
                <textarea placeholder="תיאור העסק..." value={newProvider.Description} onChange={e => setNewProvider({...newProvider, Description: e.target.value})} />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="popup-cancel" onClick={() => setShowAddProvider(false)}>ביטול</button>
                <button type="submit" className="btn-primary" disabled={adding}>{adding ? 'יוצר...' : 'צור ספק'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-topbar">
        <button className="back-btn" onClick={() => navigate('/')}>← חזרה</button>
        <div>
          <h1 className="admin-title">🛡️ לוח ניהול</h1>
          <p className="admin-subtitle">ניהול מלא של האתר</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[['stats','📊','סטטיסטיקות'],['providers','🏢','ספקים'],['users','👥','משתמשים'],['categories','🏷️','קטגוריות']].map(([id, icon, label]) => (
          <button key={id} className={`admin-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {tab === 'stats' && stats && (
        <div className="admin-stats-grid">
          {[
            { icon: '👥', label: 'משתמשים', value: stats.users, color: '#7c3aed' },
            { icon: '🏢', label: 'ספקים', value: stats.providers, color: '#ec4899' },
            { icon: '💬', label: 'הודעות', value: stats.messages, color: '#3b82f6' },
            { icon: '⭐', label: 'המלצות', value: stats.reviews, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
              <div className="admin-stat-icon">{s.icon}</div>
              <div className="admin-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Providers */}
      {tab === 'providers' && (
        <div className="admin-content">
          {/* List */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <input className="admin-search-input" placeholder="🔍 חפש ספק..." value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-primary btn-sm" onClick={() => setShowAddProvider(true)}>+ הוסף</button>
            </div>
            <div className="admin-panel-count">{filteredProviders.length} ספקים</div>
            <div className="admin-providers-list">
              {filteredProviders.map(p => (
                <div key={p.Id} className={`admin-provider-row ${editProvider?.Id === p.Id ? 'active' : ''}`} onClick={() => setEditProvider({...p})}>
                  <div className="admin-provider-avatar">{p.BusinessName?.[0] || '?'}</div>
                  <div className="admin-provider-info">
                    <strong>{p.BusinessName}</strong>
                    <span>{p.Category} · {p.WorkArea || 'לא צוין'}</span>
                    <span className="admin-provider-meta">
                      🖼️ {images[p.Id]?.length ?? p.ImageCount} · ⭐ {p.AverageRating?.toFixed(1) || '0'}
                    </span>
                  </div>
                  <button className="admin-del-btn" onClick={e => { e.stopPropagation(); setConfirmDelete({ id: p.Id, name: p.BusinessName, type: 'provider' }); }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Panel */}
          {editProvider && (
            <div className="admin-edit-panel">
              <div className="admin-edit-header">
                <h3>✏️ {editProvider.BusinessName}</h3>
                <button className="admin-modal-close" onClick={() => setEditProvider(null)}>✕</button>
              </div>

              <form onSubmit={saveProvider} className="admin-edit-form">
                <div className="form-row">
                  <div className="admin-field">
                    <label>שם העסק</label>
                    <input value={editProvider.BusinessName || ''} onChange={e => setEditProvider({...editProvider, BusinessName: e.target.value})} />
                  </div>
                  <div className="admin-field">
                    <label>קטגוריה</label>
                    <select value={editProvider.Category || ''} onChange={e => setEditProvider({...editProvider, Category: e.target.value})}>
                      {categoryNames.length ? categoryNames.map(c => <option key={c} value={c}>{c}</option>) : <option value={editProvider.Category}>{editProvider.Category}</option>}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="admin-field">
                    <label>אזור עבודה</label>
                    <select value={editProvider.WorkArea || ''} onChange={e => setEditProvider({...editProvider, WorkArea: e.target.value})}>
                      <option value="">בחר...</option>
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>מחיר התחלתי (₪)</label>
                    <input type="number" value={editProvider.PriceFrom || ''} onChange={e => setEditProvider({...editProvider, PriceFrom: e.target.value})} />
                  </div>
                </div>
                <div className="admin-field">
                  <label>תיאור</label>
                  <textarea value={editProvider.Description || ''} onChange={e => setEditProvider({...editProvider, Description: e.target.value})} />
                </div>
                <button type="submit" className={`btn-primary ${saved ? 'btn-saved' : ''}`} style={{width:'100%'}}>
                  {saved ? '✓ נשמר!' : 'שמור שינויים'}
                </button>
              </form>

              {/* Images Section */}
              <div className="admin-images-section">
                <div className="admin-images-header">
                  <h4>🖼️ תמונות ({images[editProvider.Id]?.length ?? 0})</h4>
                  <div style={{display:'flex', gap:'0.5rem'}}>
                    <input type="file" accept="image/*" multiple ref={multiImageRef} style={{display:'none'}}
                      onChange={e => { uploadFiles(Array.from(e.target.files), editProvider.Id); e.target.value=''; }} />
                    <button className="btn-primary btn-sm" onClick={() => multiImageRef.current.click()} disabled={uploading}>
                      {uploading ? '⏳' : '📁 העלה'}
                    </button>
                  </div>
                </div>

                {/* URL Input */}
                <div className="admin-url-row">
                  <input
                    className="admin-url-input"
                    placeholder="🔗 הדבק קישור לתמונה..."
                    value={urlInput}
                    onChange={e => { setUrlInput(e.target.value); setUrlError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageByUrl())}
                  />
                  <button className="btn-primary btn-sm" onClick={addImageByUrl} disabled={!urlInput.trim()}>הוסף</button>
                </div>
                {urlError && <p className="admin-url-error">{urlError}</p>}

                <div className="admin-images-grid">
                  {(images[editProvider.Id] || []).map(img => (
                    <div key={img.Id} className="admin-image-item">
                      <img src={img.FilePath.startsWith('data:') || img.FilePath.startsWith('http') ? img.FilePath : `https://events-szpi.onrender.com${img.FilePath}`} alt="" />
                      <button className="admin-img-delete" onClick={() => deleteImage(img.Id, editProvider.Id)}>✕</button>
                    </div>
                  ))}
                  {(images[editProvider.Id] || []).length === 0 && (
                    <p className="admin-no-images">אין תמונות עדיין</p>
                  )}
                </div>
              </div>

              {/* Cover Image Picker */}
              {(images[editProvider.Id] || []).length > 0 && (
                <div className="admin-images-section">
                  <div className="admin-images-header">
                    <h4>🌟 תמונת פתיחה</h4>
                  </div>
                  <div className="cover-picker-grid">
                    {(images[editProvider.Id] || []).map(img => {
                      const src = img.FilePath.startsWith('data:') || img.FilePath.startsWith('http') ? img.FilePath : `https://events-szpi.onrender.com${img.FilePath}`;
                      const currentCover = providerCover[editProvider.Id] ?? editProvider.CoverImage;
                      const isSelected = currentCover === src;
                      return (
                        <div
                          key={img.Id}
                          className={`cover-picker-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => setAdminCover(editProvider.Id, isSelected ? null : src)}
                        >
                          <img src={src} alt="" />
                          {isSelected && <div className="cover-picker-check">✓ פעיל</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>אימייל</th><th>תפקיד</th><th>תאריך</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.Id}>
                  <td className="admin-td-muted">#{u.Id}</td>
                  <td>{u.Email}</td>
                  <td><span className={`role-tag role-${u.Role.toLowerCase()}`}>{u.Role}</span></td>
                  <td className="admin-td-muted">{new Date(u.CreatedAt).toLocaleDateString('he-IL')}</td>
                  <td>
                    {u.Role !== 'Admin' && (
                      <button className="admin-del-btn" onClick={() => setConfirmDelete({ id: u.Id, name: u.Email, type: 'user' })}>🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories */}
      {tab === 'categories' && (
        <div className="admin-categories-wrap">
          <div className="admin-panel" style={{maxWidth: 560}}>
            <div className="admin-panel-header" style={{borderBottom:'1px solid #f0f0f0', paddingBottom:'1rem', marginBottom:'1rem'}}>
              <h3 style={{fontWeight:800, fontSize:'1rem'}}>קטגוריות קיימות</h3>
            </div>
            <div className="admin-cat-list">
              {categories.map(cat => (
                <div key={cat.Id} className="admin-cat-row">
                  {editCat?.Id === cat.Id ? (
                    <div style={{flex:1, display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                      <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                        <input className="admin-cat-icon-input" value={editCat.Icon} onChange={e => setEditCat({...editCat, Icon: e.target.value})} maxLength={4} />
                        <input className="admin-cat-name-input" style={{flex:1}} value={editCat.Name} onChange={e => setEditCat({...editCat, Name: e.target.value})} />
                        <button className="admin-save-btn" onClick={() => saveCategory(editCat)}>✓</button>
                        <button className="admin-cancel-btn" onClick={() => setEditCat(null)}>✕</button>
                      </div>
                      <input
                        className="admin-cat-name-input"
                        style={{width:'100%', fontSize:'0.78rem'}}
                        placeholder="🔗 קישור לתמונת באנר..."
                        value={editCat.BannerUrl || ''}
                        onChange={e => setEditCat({...editCat, BannerUrl: e.target.value})}
                      />
                      {editCat.BannerUrl && (
                        <img src={editCat.BannerUrl} alt="" style={{width:'100%', height:60, objectFit:'cover', borderRadius:8, marginTop:2}} />
                      )}
                    </div>
                  ) : (
                    <>
                      <span className="admin-cat-icon">{cat.Icon}</span>
                      <span className="admin-cat-name">{cat.Name}</span>
                      <button className="admin-edit-btn" onClick={() => setEditCat({...cat})}>✏️</button>
                      <button className="admin-del-btn" onClick={() => setConfirmDelete({ id: cat.Id, name: cat.Name, type: 'category' })}>🗑️</button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={addCategory} className="admin-cat-add">
              <h4 style={{fontWeight:700, marginBottom:'0.75rem'}}>+ הוסף קטגוריה</h4>
              {catError && <p className="error" style={{marginBottom:'0.5rem'}}>{catError}</p>}
              <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                <input className="admin-cat-icon-input" placeholder="🏷️" value={newCat.Icon} onChange={e => setNewCat({...newCat, Icon: e.target.value})} maxLength={4} />
                <input className="admin-cat-name-input" style={{flex:1}} placeholder="שם הקטגוריה" value={newCat.Name} onChange={e => setNewCat({...newCat, Name: e.target.value})} required />
                <button type="submit" className="btn-primary btn-sm">הוסף</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}