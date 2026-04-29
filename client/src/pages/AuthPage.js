import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'Customer' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data.token, data.role);
      navigate(data.role === 'Provider' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה, נסה שוב');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'התחברות' : 'הרשמה'}</h2>
        {error && <p className="error">{error}</p>}
        <input type="email" placeholder="אימייל" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="סיסמה" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        {mode === 'register' && (
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="Customer">לקוח</option>
            <option value="Provider">ספק / מפיק</option>
          </select>
        )}
        <button type="submit">{mode === 'login' ? 'התחבר' : 'הירשם'}</button>
        {mode === 'login'
          ? <p>אין לך חשבון? <Link to="/register">הירשם</Link></p>
          : <p>יש לך חשבון? <Link to="/login">התחבר</Link></p>}
      </form>
    </div>
  );
}
