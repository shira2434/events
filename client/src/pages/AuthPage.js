import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const RULES = {
  fullName: v => v.trim().length < 2 ? 'שם חייב להכיל לפחות 2 תווים' : '',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'אימייל לא תקין',
  password: v => v.length < 6 ? 'סיסמה חייבת להכיל לפחות 6 תווים' : '',
  confirmPassword: (v, form) => v !== form.password ? 'הסיסמאות אינן תואמות' : '',
};

export default function AuthPage({ mode }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'Customer' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = (field, value) => {
    if (field === 'confirmPassword') return RULES.confirmPassword(value, form);
    return RULES[field] ? RULES[field](value) : '';
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, value) }));
  };

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validate(field, form[field]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const fields = mode === 'register' ? ['fullName', 'email', 'password', 'confirmPassword'] : ['email', 'password'];
    const newErrors = {};
    fields.forEach(f => { newErrors[f] = validate(f, form[f]); });
    setErrors(newErrors);
    setTouched(fields.reduce((a, f) => ({ ...a, [f]: true }), {}));
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data.token, data.role, data.fullName, data.email || form.email);
      navigate(data.role === 'Provider' ? '/dashboard' : '/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'שגיאה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="logo" style={{ marginBottom: '2rem', display: 'block' }}>🎉 EventPro</Link>
          <h2>הפלטפורמה המובילה<br />לאירועים בישראל</h2>
          <p>מצא את הספק המושלם לאירוע שלך — צלמים, מאפרות, קייטרינג ועוד</p>
          <div className="auth-features">
            {['✅ מעל 500 ספקים מקצועיים', '⭐ דירוגים והמלצות אמיתיות', '💬 צ\'אט ישיר עם ספקים', '🔒 אבטחה מלאה'].map(f => (
              <div key={f} className="auth-feature">{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1>{isLogin ? 'ברוך הבא! 👋' : 'הצטרף אלינו 🎉'}</h1>
            <p>{isLogin ? 'התחבר לחשבון שלך' : 'צור חשבון חדש בחינם'}</p>
          </div>

          {serverError && (
            <div className="auth-error-banner">
              <span>⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className={`auth-field ${touched.fullName && errors.fullName ? 'has-error' : touched.fullName && !errors.fullName ? 'has-success' : ''}`}>
                <label>שם מלא</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="שם פרטי ומשפחה"
                    value={form.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    autoComplete="name"
                  />
                  {touched.fullName && !errors.fullName && form.fullName && <span className="field-check">✓</span>}
                </div>
                {touched.fullName && errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>
            )}

            <div className={`auth-field ${touched.email && errors.email ? 'has-error' : touched.email && !errors.email ? 'has-success' : ''}`}>
              <label>אימייל</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📧</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  autoComplete="email"
                />
                {touched.email && !errors.email && <span className="field-check">✓</span>}
              </div>
              {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className={`auth-field ${touched.password && errors.password ? 'has-error' : touched.password && !errors.password ? 'has-success' : ''}`}>
              <label>סיסמה</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="לפחות 6 תווים"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {touched.password && errors.password && <span className="field-error">{errors.password}</span>}
              {!isLogin && form.password && (
                <div className="password-strength">
                  <div className={`strength-bar ${form.password.length >= 8 ? 'strong' : form.password.length >= 6 ? 'medium' : 'weak'}`} />
                  <span>{form.password.length >= 8 ? 'חזקה' : form.password.length >= 6 ? 'בינונית' : 'חלשה'}</span>
                </div>
              )}
            </div>

            {!isLogin && (
              <>
                <div className={`auth-field ${touched.confirmPassword && errors.confirmPassword ? 'has-error' : touched.confirmPassword && !errors.confirmPassword ? 'has-success' : ''}`}>
                  <label>אימות סיסמה</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="הכנס שוב את הסיסמה"
                      value={form.confirmPassword}
                      onChange={e => handleChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                    />
                    {touched.confirmPassword && !errors.confirmPassword && form.confirmPassword && <span className="field-check">✓</span>}
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </div>

                <div className="auth-field">
                  <label>סוג חשבון</label>
                  <div className="role-picker">
                    <button type="button" className={`role-btn ${form.role === 'Customer' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'Customer' }))}>
                      <span>👤</span>
                      <strong>לקוח</strong>
                      <small>מחפש ספקים לאירוע</small>
                    </button>
                    <button type="button" className={`role-btn ${form.role === 'Provider' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'Provider' }))}>
                      <span>🏢</span>
                      <strong>ספק</strong>
                      <small>מציע שירותים לאירועים</small>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : isLogin ? 'התחבר לחשבון' : 'צור חשבון'}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? 'אין לך חשבון?' : 'יש לך חשבון?'}
            {' '}
            <Link to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'הירשם בחינם' : 'התחבר'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
