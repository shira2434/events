import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['צלם', 'מאפרת', 'קייטרינג', 'DJ', 'פרחים', 'אולם', 'תכשיטים', 'הסעות', 'עוגות'];
const AREAS = ['תל אביב והמרכז', 'ירושלים והסביבה', 'חיפה והצפון', 'הצפון', 'הדרום', 'השרון', 'המרכז', 'כל הארץ'];

const EMPTY_PROVIDER = { BusinessName: '', Category: '', Description: '', WorkArea: '', PriceFrom: '', Email: '', Password: '' };

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editProvider, setEditProvider] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState(EMPTY_PROVIDER);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const imageInputRef = useRef();
  const multiImageRef = useRef();

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => navigate('/'));
  }, [navigate]);

  useEffect(() => {
    if (tab === 'providers') api.get('/admin/providers').then(r => setProviders(r.data));
    if (tab === 'users') api.get('/admin/users').then(r => setUsers(r.data));
  }, [tab]);

  const openImages = async (provider) => {
    setSelectedProvider(provider);
    const r = await api.get(`/admin/providers/${provider.Id}/images`);
    setImages(r.data);
  };

  const uploadImage = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/admin/providers/${selectedProvider.Id}/images`, formData);
    }
    const r = await api.get(`/admin/providers/${selectedProvider.Id}/images`);
    setImages(r.data);
    api.get('/admin/providers').then(r => setProviders(r.data));
    setUploading(false);
    e.target.value = '';
  };

  const deleteImage = async (imgId) => {
    await api.delete(`/admin/images/${imgId}`);
    setImages(prev => prev.filter(i => i.Id !== imgId));
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
    api.get('/admin/providers').then(r => setProviders(r.data));
  };

  const addProvider = async (e) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);
    try {
      // 1. צור משתמש
      const { data } = await api.post('/auth/register', {
        email: newProvider.Email,
        password: newProvider.Password,
        role: 'Provider'
      });
      // 2. צור פרופיל ספק עם ה-token החדש
      await api.put('/providers/settings', {
        businessName: newProvider.BusinessName,
        category: newProvider.Category,
        description: newProvider.Description,
        workArea: newProvider.WorkArea,
        priceFrom: newProvider.PriceFrom,
      }, { headers: { Authorization: `Bearer ${data.token}` } });
      setNewProvider(EMPTY_PROVIDER);
      setShowAddProvider(false);
      api.get('/admin/providers').then(r => setProviders(r.data));
      api.get('/admin/stats').then(r => setStats(r.data));
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
      if (selectedProvider?.Id === confirmDelete.id) setSelectedProvider(null);
    } else {
      await api.delete(`/admin/users/${confirmDelete.id}`);
      setUsers(prev => prev.filter(u => u.Id !== confirmDelete.id));
    }
    setConfirmDelete(null);
    api.get('/admin/stats').then(r => setStats(r.data));
  };

  const filteredProviders = providers.filter(p =>
    p.BusinessName?.toLowerCase().includes(search.toLowerCase()) ||
    p.Category?.toLowerCase().includes(search.toLowerCase()) ||
    p.Email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      {confirmDelete && (
        <div className="popup-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="popup-box" onClick={e => e.stopPropagation()}>
            <div className="popup-icon">⚠️</div>
            <h3>אישור מחיקה</h3>
            <p>האם למחוק את <strong>{confirmDelete.name}</strong>?<br/>פעולה זו אינה ניתנת לביטול.</p>
            <div className="popup-btns">
              <button className="popup-cancel" onClick={() => setConfirmDelete(null)}>ביטול</button>
              <button className="popup-confirm" onClick={doDelete}>מחק</button>
            </div>
          </div>
        </div>
      )}

      {showAddProvider && (
        <div className="popup-overlay" onClick={() => setShowAddProvider(false)}>
          <div className="popup-box admin-add-popup" onClick={e => e.stopPropagation()}>
            <h3>➕ הוסף ספק חדש</h3>
            {addError && <p className="error">{addError}</p>}
            <form onSubmit={addProvider}>
              <div className="form-row">
                <div><label>אימייל</label><input type="email" placeholder="email@example.com" value={newProvider.Email} onChange={e => setNewProvider({...newProvider, Email: e.target.value})} required /></div>
                <div><label>סיסמה</label><input type="password" placeholder="לפחות 6 תווים" value={newProvider.Password} onChange={e => setNewProvider({...newProvider, Password: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div><label>שם העסק</label><input placeholder="שם העסק" value={newProvider.BusinessName} onChange={e => setNewProvider({...newProvider, BusinessName: e.target.value})} required /></div>
                <div><label>קטגוריה</label>
                  <select value={newProvider.Category} onChange={e => setNewProvider({...newProvider, Category: e.target.value})} required>
                    <option value="">בחר...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div><label>אזור עבודה</label>
                  <select value={newProvider.WorkArea} onChange={e => setNewProvider({...newProvider, WorkArea: e.target.value})}>
                    <option value="">בחר...</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div><label>מחיר התחלתי (₪)</label><input type="number" placeholder="0" value={newProvider.PriceFrom} onChange={e => setNewProvider({...newProvider, PriceFrom: e.target.value})} /></div>
              </div>
              <label>תיאור</label>
              <textarea placeholder="תיאור העסק..." value={newProvider.Description} onChange={e => setNewProvider({...newProvider, Description: e.target.value})} />
              <div className="popup-btns" style={{marginTop:'1rem'}}>
                <button type="button" className="popup-cancel" onClick={() => setShowAddProvider(false)}>ביטול</button>
                <button type="submit" className="btn-primary" disabled={adding}>{adding ? 'יוצר...' : 'צור ספק'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/')}>← חזרה</button>
        <h1>🛡️ לוח ניהול</h1>
        <p>ניהול מלא של האתר</p>
      </div>

      <div className="admin-tabs">
        {[['stats','📊 סטטיסטיקות'],['providers','🏢 ספקים'],['users','👥 משתמשים']].map(([id, label]) => (
          <button key={id} className={`admin-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

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

      {tab === 'providers' && (
        <div className="admin-content">
          <div className="admin-list">
            <div className="admin-search">
              <input placeholder="🔍 חפש ספק..." value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-primary btn-sm" onClick={() => setShowAddProvider(true)}>+ הוסף</button>
            </div>
            <div className="admin-count-bar">{filteredProviders.length} ספקים</div>
            <div className="admin-providers-list">
              {filteredProviders.map(p => (
                <div key={p.Id} className={`admin-provider-item ${editProvider?.Id === p.Id ? 'active' : ''}`}>
                  <div className="admin-provider-info" onClick={() => { setEditProvider({...p}); setSelectedProvider(null); }}>
                    <strong>{p.BusinessName}</strong>
                    <span>{p.Category} • {p.WorkArea}</span>
                    <span className="admin-img-count">🖼️ {p.ImageCount} תמונות • ⭐ {p.AverageRating?.toFixed(1) || '0'}</span>
                  </div>
                  <div className="admin-provider-actions">
                    <button className="admin-btn-img" onClick={() => { setEditProvider({...p}); openImages(p); }} title="ניהול תמונות">🖼️</button>
                    <button className="admin-btn-del" onClick={() => setConfirmDelete({ id: p.Id, name: p.BusinessName, type: 'provider' })} title="מחק">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {editProvider && (
            <div className="admin-edit-panel">
              <h3>✏️ {editProvider.BusinessName}</h3>
              <form onSubmit={saveProvider}>
                <label>שם העסק</label>
                <input value={editProvider.BusinessName || ''} onChange={e => setEditProvider({...editProvider, BusinessName: e.target.value})} />
                <label>קטגוריה</label>
                <select value={editProvider.Category || ''} onChange={e => setEditProvider({...editProvider, Category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label>אזור עבודה</label>
                <select value={editProvider.WorkArea || ''} onChange={e => setEditProvider({...editProvider, WorkArea: e.target.value})}>
                  <option value="">בחר...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <label>מחיר התחלתי (₪)</label>
                <input type="number" value={editProvider.PriceFrom || ''} onChange={e => setEditProvider({...editProvider, PriceFrom: e.target.value})} />
                <label>תיאור</label>
                <textarea value={editProvider.Description || ''} onChange={e => setEditProvider({...editProvider, Description: e.target.value})} />
                <button type="submit" className={`btn-primary ${saved ? 'btn-saved' : ''}`}>
                  {saved ? '✓ נשמר!' : 'שמור שינויים'}
                </button>
              </form>

              <div className="admin-images-section">
                <div className="admin-images-header">
                  <h4>🖼️ תמונות ({selectedProvider?.Id === editProvider.Id ? images.length : '?'})</h4>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <input type="file" accept="image/*" multiple ref={multiImageRef} style={{ display: 'none' }} onChange={uploadImage} />
                    <button className="btn-primary btn-sm" onClick={() => { openImages(editProvider); multiImageRef.current.click(); }} disabled={uploading}>
                      {uploading ? 'מעלה...' : '+ תמונות'}
                    </button>
                    {selectedProvider?.Id !== editProvider.Id && (
                      <button className="admin-btn-img" onClick={() => openImages(editProvider)}>טען תמונות</button>
                    )}
                  </div>
                </div>
                {selectedProvider?.Id === editProvider.Id && (
                  <div className="admin-images-grid">
                    {images.map(img => (
                      <div key={img.Id} className="admin-image-item">
                        <img src={img.FilePath.startsWith('data:') || img.FilePath.startsWith('http') ? img.FilePath : `https://events-szpi.onrender.com${img.FilePath}`} alt="" />
                        <button className="admin-img-delete" onClick={() => deleteImage(img.Id)}>✕</button>
                      </div>
                    ))}
                    {images.length === 0 && <p className="admin-no-images">אין תמונות — לחץ "+ תמונות" להוספה</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-users-table">
          <table>
            <thead>
              <tr><th>ID</th><th>אימייל</th><th>תפקיד</th><th>תאריך</th><th>פעולות</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.Id}>
                  <td>{u.Id}</td>
                  <td>{u.Email}</td>
                  <td><span className={`role-tag role-${u.Role.toLowerCase()}`}>{u.Role}</span></td>
                  <td>{new Date(u.CreatedAt).toLocaleDateString('he-IL')}</td>
                  <td>
                    {u.Role !== 'Admin' && (
                      <button className="admin-btn-del" onClick={() => setConfirmDelete({ id: u.Id, name: u.Email, type: 'user' })}>🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
