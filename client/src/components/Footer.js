import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="logo">🎉 EventPro</Link>
          <p>הפלטפורמה המובילה לאירועים בישראל.<br />מחברים בין חלומות למציאות.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>ניווט</h4>
            <Link to="/">דף הבית</Link>
            <Link to="/about">אודות</Link>
            <Link to="/contact">צור קשר</Link>
          </div>
          <div className="footer-col">
            <h4>חשבון</h4>
            <Link to="/login">התחברות</Link>
            <Link to="/register">הרשמה</Link>
            <Link to="/dashboard">לוח בקרה</Link>
          </div>
          <div className="footer-col">
            <h4>קטגוריות</h4>
            <Link to="/?category=צלם">צלמים</Link>
            <Link to="/?category=מאפרת">מאפרות</Link>
            <Link to="/?category=קייטרינג">קייטרינג</Link>
            <Link to="/?category=DJ">DJ</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 EventPro. כל הזכויות שמורות.</p>
        <div className="footer-social">
          <span role="img" aria-label="Facebook">📘</span>
          <span role="img" aria-label="Instagram">📸</span>
          <span role="img" aria-label="WhatsApp">💬</span>
        </div>
      </div>
    </footer>
  );
}
