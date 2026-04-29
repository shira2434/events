import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirmPassword) return setError('הסיסמאות אינן תואמות');
    if (form.newPassword.length < 6) return setError('הסיסמה חייבת להכיל לפחות 6 תווים');
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSaved(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בעדכון הסיסמה');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const initial = user?.email?.[0]?.toUpperCase() || '?';
  const isProvider = user?.role === 'Provider';

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className={`profile-avatar-lg ${isProvider ? 'provider-avatar-color' : ''}`}>{initial}</div>
        <div>
          <h1>{user?.email}</h1>
          <span className={`role-badge ${isProvider ? 'role-provider' : 'role-customer'}`}>
            {isProvider ? '🏢 ספק' : '👤 לקוח'}
          </span>
        </div>
      </div>

      <div className="profile-body">
        <div className="dashboard-section">
          <h2>🔒 שינוי סיסמה</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handlePasswordChange}>
            <input
              type="password" placeholder="סיסמה נוכחית"
              value={form.currentPassword}
              onChange={e => setForm({ ...form, currentPassword: e.target.value })}
              required
            />
            <input
              type="password" placeholder="סיסמה חדשה"
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              required
            />
            <input
              type="password" placeholder="אימות סיסמה חדשה"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            <button type="submit" className={`btn-primary ${saved ? 'btn-saved' : ''}`}>
              {saved ? '✓ הסיסמה עודכנה!' : 'עדכן סיסמה'}
            </button>
          </form>
        </div>

        <div className="dashboard-section">
          <h2>⚙️ הגדרות חשבון</h2>
          <div className="account-info">
            <div className="account-info-row">
              <span>אימייל</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="account-info-row">
              <span>סוג חשבון</span>
              <strong>{isProvider ? 'ספק' : 'לקוח'}</strong>
            </div>
          </div>
          {isProvider && (
            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/dashboard')}>
              ⚙️ לוח בקרה ספק
            </button>
          )}
        </div>

        <div className="dashboard-section danger-zone">
          <h2>⚠️ אזור מסוכן</h2>
          <p>יציאה מהחשבון תנתק אותך מכל המכשירים</p>
          <button className="btn-danger" onClick={handleLogout}>התנתק מהחשבון</button>
        </div>
      </div>
    </div>
  );
}
