import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['צלם', 'מאפרת', 'קייטרינג', 'DJ', 'פרחים', 'אולם', 'תכשיטים', 'הסעות', 'עוגות'];
const CATEGORY_ICONS = { 'צלם': '📸', 'מאפרת': '💄', 'קייטרינג': '🍽️', 'DJ': '🎧', 'פרחים': '💐', 'אולם': '🏛️', 'תכשיטים': '💍', 'הסעות': '🚌', 'עוגות': '🎂' };

export default function DashboardPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ businessName: '', category: '', description: '', workArea: '', priceFrom: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    api.get('/providers/me').then(r => {
      if (r.data) setSettings({
        businessName: r.data.BusinessName || '',
        category: r.data.Category || '',
        description: r.data.Description || '',
        workArea: r.data.WorkArea || '',
        priceFrom: r.data.PriceFrom || '',
      });
    }).catch(() => setIsNew(true));
    return () => previews.forEach(URL.revokeObjectURL); // eslint-disable-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiles = (newFiles) => {
    const arr = Array.from(newFiles);
    setFiles(arr);
    setPreviews(arr.map(f => URL.createObjectURL(f)));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    await api.put('/providers/settings', settings);
    setSaved(true);
    setIsNew(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    await api.post('/portfolio', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setFiles([]);
    setPreviews([]);
    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="dashboard">
      {uploadSuccess && (
        <div className="popup-overlay" onClick={() => setUploadSuccess(false)}>
          <div className="popup-box" onClick={e => e.stopPropagation()}>
            <div className="popup-icon">✅</div>
            <h3>הקבצים הועלו בהצלחה!</h3>
            <p>התמונות נוספו לתיק העבודות שלך</p>
            <div className="popup-btns">
              <button className="popup-cancel" onClick={() => setUploadSuccess(false)}>סגור</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← חזרה</button>
        <h1>⚙️ לוח בקרה</h1>
        <p>נהל את הפרופיל שלך ותיק העבודות</p>
        {isNew && <div className="new-provider-notice">👋 ברוך הבא! מלא את פרטי העסק שלך כדי להופיע בחיפוש</div>}
      </div>

      <section className="dashboard-section">
        <h2>📋 פרטי העסק</h2>
        <form onSubmit={saveSettings}>
          <div className="form-row">
            <input
              placeholder="שם העסק"
              value={settings.businessName}
              onChange={e => setSettings({ ...settings, businessName: e.target.value })}
              required
            />
            <select value={settings.category} onChange={e => setSettings({ ...settings, category: e.target.value })} required>
              <option value="">בחר קטגוריה</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <textarea
            placeholder="תיאור העסק — ספר על עצמך, הניסיון שלך ומה מייחד אותך"
            value={settings.description}
            onChange={e => setSettings({ ...settings, description: e.target.value })}
          />
          <div className="form-row">
            <input
              placeholder="📍 אזור עבודה (למשל: תל אביב והמרכז)"
              value={settings.workArea}
              onChange={e => setSettings({ ...settings, workArea: e.target.value })}
            />
            <input
              type="number"
              placeholder="💰 מחיר התחלתי (₪)"
              value={settings.priceFrom}
              onChange={e => setSettings({ ...settings, priceFrom: e.target.value })}
            />
          </div>
          <button type="submit" className={`btn-primary ${saved ? 'btn-saved' : ''}`}>
            {saved ? '✓ נשמר בהצלחה!' : 'שמור שינויים'}
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>🖼️ תיק עבודות</h2>
        {isNew ? (
          <div className="new-provider-notice">⚠️ שמור תחילה את פרטי העסק למעלה ואז תוכל להעלות תמונות</div>
        ) : (
          <form onSubmit={uploadFiles}>
            <div
              className={`upload-area ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={e => handleFiles(e.target.files)} />
              <div className="upload-icon">📤</div>
              <p>גרור תמונות לכאן או <strong>לחץ לבחירה</strong></p>
              <span>PNG, JPG, MP4 עד 10MB</span>
            </div>

            {previews.length > 0 && (
              <div className="upload-previews">
                {previews.map((src, i) => (
                  <div key={i} className="preview-item">
                    <img src={src} alt="" />
                    <button type="button" className="preview-remove" onClick={() => {
                      setFiles(files.filter((_, j) => j !== i));
                      setPreviews(previews.filter((_, j) => j !== i));
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'מעלה...' : `העלה ${files.length} קבצים`}
              </button>
            )}
          </form>
        )}
      </section>
    </div>
  );
}
