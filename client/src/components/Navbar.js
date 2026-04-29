import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">🎉</span>
        EventPro
      </Link>

      <div className="nav-center">
        <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>דף הבית</Link>
        <Link to="/about" className={`nav-link ${isActive('/about') ? 'nav-active' : ''}`}>אודות</Link>
        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'nav-active' : ''}`}>צור קשר</Link>
      </div>

      <div className="nav-links">
        {!user && <>
          <Link to="/login" className={`nav-link ${isActive('/login') ? 'nav-active' : ''}`}>התחברות</Link>
          <Link to="/register" className="btn-primary btn-sm">הרשמה חינם</Link>
        </>}

        {user?.role === 'Customer' && <>
          <Link to="/chat" className={`nav-icon-link ${isActive('/chat') ? 'nav-active' : ''}`}>💬 הודעות</Link>
          <Link to="/profile" className={`nav-user ${isActive('/profile') ? 'nav-active' : ''}`}>
            <div className="nav-avatar">{user.email?.[0]?.toUpperCase() || '👤'}</div>
          </Link>
          <button className="nav-logout-btn" onClick={handleLogout}>יציאה</button>
        </>}

        {user?.role === 'Provider' && <>
          <Link to="/dashboard" className={`nav-icon-link ${isActive('/dashboard') ? 'nav-active' : ''}`}>⚙️ לוח בקרה</Link>
          <Link to="/chat" className={`nav-icon-link ${isActive('/chat') ? 'nav-active' : ''}`}>💬 הודעות</Link>
          <Link to="/profile" className={`nav-user ${isActive('/profile') ? 'nav-active' : ''}`}>
            <div className="nav-avatar provider-avatar-color">{user.email?.[0]?.toUpperCase() || '👤'}</div>
          </Link>
          <button className="nav-logout-btn" onClick={handleLogout}>יציאה</button>
        </>}
      </div>
    </nav>
  );
}
