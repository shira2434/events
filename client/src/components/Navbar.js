import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  const prevUnread = useRef(0);

  const playNotif = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  useEffect(() => {
    if (!user) return;
    const check = () => api.get('/chat').then(r => {
      const total = r.data.reduce((s, c) => s + (c.UnreadCount || 0), 0);
      if (total > prevUnread.current) playNotif();
      prevUnread.current = total;
      setUnread(total);
    }).catch(() => {});
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">🎉</span>
        EventPro
      </Link>

      <div className="nav-center">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}>דף הבית</Link>
        <Link to="/about" className={`nav-link ${isActive('/about') ? 'nav-active' : ''}`}>אודות</Link>
        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'nav-active' : ''}`}>צור קשר</Link>
      </div>

      <div className="nav-links">
        {!user && <>
          <Link to="/login" className={`nav-link ${isActive('/login') ? 'nav-active' : ''}`}>התחברות</Link>
          <Link to="/register" className="btn-primary btn-sm">הרשמה חינם</Link>
        </>}

        {user && <>
          {user.role === 'Admin' && (
            <Link to="/admin" className={`nav-icon-link ${isActive('/admin') ? 'nav-active' : ''}`}>🛡️ ניהול</Link>
          )}
          {user.role === 'Provider' && (
            <Link to="/dashboard" className={`nav-icon-link ${isActive('/dashboard') ? 'nav-active' : ''}`}>⚙️ לוח בקרה</Link>
          )}
          <Link to="/chat" className={`nav-icon-link nav-chat-link ${isActive('/chat') ? 'nav-active' : ''}`}>
            💬 הודעות
            {unread > 0 && <span className="nav-unread-badge">{unread}</span>}
          </Link>
          <Link to="/profile" className={`nav-user ${isActive('/profile') ? 'nav-active' : ''}`}>
            <div className={`nav-avatar ${user.role === 'Provider' ? 'provider-avatar-color' : ''}`}>
              {user.email?.[0]?.toUpperCase() || '👤'}
            </div>
          </Link>
          <button className="nav-logout-btn" onClick={handleLogout}>יציאה</button>
        </>}
      </div>
    </nav>
  );
}
