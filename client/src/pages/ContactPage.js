import { useState } from 'react';

const TOPICS = ['שאלה כללית', 'בעיה טכנית', 'הצטרפות כספק', 'דיווח על תקלה', 'אחר'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-shapes">
          <div className="shape shape-1" /><div className="shape shape-2" />
        </div>
        <div className="about-hero-content">
          <div className="hero-badge">📬 צור קשר</div>
          <h1>איך נוכל לעזור?</h1>
          <p>הצוות שלנו זמין לכל שאלה ובקשה</p>
        </div>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          {[
            { icon: '📧', title: 'אימייל', value: 'support@eventpro.co.il' },
            { icon: '📞', title: 'טלפון', value: '03-1234567' },
            { icon: '🕐', title: 'שעות פעילות', value: 'א׳-ה׳ 9:00-18:00' },
            { icon: '📍', title: 'כתובת', value: 'תל אביב, ישראל' },
          ].map(i => (
            <div key={i.title} className="contact-info-item">
              <div className="contact-info-icon">{i.icon}</div>
              <div>
                <h4>{i.title}</h4>
                <p>{i.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <div className="success-icon">✅</div>
              <h2>ההודעה נשלחה!</h2>
              <p>נחזור אליך תוך 24 שעות</p>
              <button className="btn-primary" onClick={() => setSent(false)}>שלח הודעה נוספת</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>שלח הודעה</h2>
              <div className="form-row">
                <input placeholder="שם מלא" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder="אימייל" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} required>
                <option value="">בחר נושא</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <textarea
                placeholder="תוכן ההודעה..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary">שלח הודעה ✉️</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
