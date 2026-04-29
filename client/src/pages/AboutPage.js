import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'שירה כהן', role: 'מייסדת ומנכ"לית', emoji: '👩‍💼' },
  { name: 'יוסי לוי', role: 'מנהל טכנולוגיה', emoji: '👨‍💻' },
  { name: 'מיכל דוד', role: 'מנהלת שיווק', emoji: '👩‍🎨' },
];

const VALUES = [
  { icon: '🤝', title: 'אמינות', desc: 'כל ספק עובר תהליך אימות קפדני לפני הצטרפות לפלטפורמה' },
  { icon: '⭐', title: 'איכות', desc: 'רק הספקים הטובים ביותר עם דירוגים גבוהים נשארים בפלטפורמה' },
  { icon: '💡', title: 'חדשנות', desc: 'אנחנו תמיד מפתחים כלים חדשים שיעזרו לכם לתכנן את האירוע המושלם' },
  { icon: '❤️', title: 'קהילה', desc: 'בנינו קהילה חזקה של ספקים ולקוחות שעוזרים אחד לשני' },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="hero-shapes">
          <div className="shape shape-1" /><div className="shape shape-2" /><div className="shape shape-3" />
        </div>
        <div className="about-hero-content">
          <div className="hero-badge">🎉 הסיפור שלנו</div>
          <h1>אנחנו מחברים בין חלומות<br />למציאות</h1>
          <p>EventPro נוסדה ב-2022 מתוך רצון לפשט את תהליך מציאת ספקים לאירועים בישראל</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {[
          { value: '500+', label: 'ספקים מקצועיים' },
          { value: '2,000+', label: 'אירועים מוצלחים' },
          { value: '4.8★', label: 'דירוג ממוצע' },
          { value: '3', label: 'שנות פעילות' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="about-body">
        {/* Mission */}
        <section className="about-section">
          <h2>המשימה שלנו</h2>
          <p className="about-text">
            EventPro נוצרה כדי לחבר בין אנשים שחולמים על האירוע המושלם לבין הספקים המקצועיים שיכולים להגשים את החלום הזה.
            אנחנו מאמינים שכל אירוע — חתונה, בר מצווה, יום הולדת או כנס עסקי — ראוי לקבל את הטיפול הטוב ביותר.
          </p>
        </section>

        {/* Values */}
        <section className="about-section">
          <h2>הערכים שלנו</h2>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="about-section">
          <h2>הצוות שלנו</h2>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-avatar">{m.emoji}</div>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="about-cta">
          <h2>מוכן להתחיל?</h2>
          <p>הצטרף לאלפי לקוחות וספקים שכבר משתמשים ב-EventPro</p>
          <div className="about-cta-btns">
            <Link to="/register" className="btn-primary">הרשמה חינם</Link>
            <Link to="/" className="btn-outline">גלה ספקים</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
