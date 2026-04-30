import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CATEGORIES = {
  'צלם': { icon: '📸', price: '₪2,200–₪3,500', desc: 'צילום חתונות, בר/בת מצווה ואירועים. עריכה מקצועית.' },
  'מאפרת': { icon: '💄', price: '₪580–₪900', desc: 'איפור ועיצוב שיער לכלות ואירועים. מוצרי פרימיום.' },
  'קייטרינג': { icon: '🍽️', price: '₪110–₪190 לאורח', desc: 'קייטרינג לכל סוגי האירועים. מנות חמות, קינוחים, שירות.' },
  'DJ': { icon: '🎧', price: '₪1,600–₪3,500', desc: 'DJ + הגברה + תאורה. מוזיקה לכל הטעמים.' },
  'פרחים': { icon: '💐', price: '₪1,000–₪2,200', desc: 'עיצוב פרחוני לחתונות. חופות, שולחנות, זרי כלה.' },
  'אולם': { icon: '🏛️', price: '₪7,000–₪18,000', desc: 'אולמות לכל הגדלים. גן חיצוני, חניה, תאורה.' },
  'תכשיטים': { icon: '💍', price: '₪500–₪3,000', desc: 'טבעות נישואין, תכשיטי כלות. זהב, פלטינה, יהלומים.' },
  'הסעות': { icon: '🚌', price: '₪400–₪1,300', desc: 'לימוזינות, מרצדס, אוטובוסים לאורחים.' },
  'עוגות': { icon: '🎂', price: '₪650–₪1,500', desc: 'עוגות חתונה מעוצבות. קאפקייקס, שולחן ממתקים.' },
};

function getBotReply(text, navigate, setMessages) {
  const t = text.toLowerCase().replace(/[💰📸🍽️🎧❓💐🏛️💄💍📝🎂🚌]/g, '').trim();

  // ניווט לדף ספקים
  const categoryMatch = Object.keys(CATEGORIES).find(c =>
    t.includes(c.toLowerCase()) || t.includes(c)
  );

  if (t.includes('הצג') || t.includes('רשימה') || t.includes('כל ה') || t.includes('מצא')) {
    if (categoryMatch) {
      setTimeout(() => navigate(`/?category=${categoryMatch}`), 1000);
      return `${CATEGORIES[categoryMatch].icon} מעביר אותך לרשימת ${categoryMatch}ים... 🔍\n\nתמצא שם את כל הספקים עם דירוגים ומחירים!`;
    }
  }

  if (t.includes('שלום') || t.includes('היי') || t.includes('הי') || t.includes('בוקר') || t.includes('ערב'))
    return 'שלום! 👋 אני EventBot, העוזר החכם של EventPro.\n\nאני יכול לעזור לך:\n• 🔍 למצוא ספקים לפי קטגוריה\n• 💰 להסביר על מחירים\n• 📋 לתת מידע על כל השירותים\n• 🎯 לעזור לתכנן את האירוע שלך\n\nמה תרצה לדעת?';

  if (t.includes('תודה') || t.includes('thanks'))
    return 'בשמחה! 😊 בהצלחה עם האירוע! 🎉\nאם יש עוד שאלות — אני כאן תמיד.';

  if (t.includes('עזרה') || t.includes('help') || t.includes('מה אתה'))
    return 'אני יכול לעזור לך עם:\n\n📸 צלמים\n💄 מאפרות\n🍽️ קייטרינג\n🎧 DJ\n💐 פרחים\n🏛️ אולמות\n💍 תכשיטים\n🚌 הסעות\n🎂 עוגות\n\nפשוט שאל אותי על כל קטגוריה!';

  if (t.includes('חתונה') || t.includes('כלה') || t.includes('חתן'))
    return '💍 לחתונה מושלמת תצטרך:\n\n📸 צלם — ₪2,200–₪3,500\n💄 מאפרת — ₪580–₪900\n🍽️ קייטרינג — ₪110–₪190 לאורח\n🎧 DJ — ₪1,600–₪3,500\n💐 פרחים — ₪1,000–₪2,200\n🏛️ אולם — ₪7,000–₪18,000\n💍 תכשיטים — ₪500–₪3,000\n🚌 הסעות — ₪400–₪1,300\n🎂 עוגה — ₪650–₪1,500\n\nסה"כ משוער: ₪25,000–₪60,000\n\nרוצה שאמצא לך ספקים? 🔍';

  if (t.includes('מחיר') || t.includes('עלות') || t.includes('כמה') || t.includes('תעריף')) {
    if (categoryMatch) {
      const c = CATEGORIES[categoryMatch];
      return `${c.icon} מחירי ${categoryMatch}:\n\n💰 טווח: ${c.price}\n📝 ${c.desc}\n\nרוצה לראות את כל הספקים? כתוב "הצג ${categoryMatch}ים"`;
    }
    return '💰 טווחי מחירים באתר:\n\n' +
      Object.entries(CATEGORIES).map(([k, v]) => `${v.icon} ${k}: ${v.price}`).join('\n');
  }

  if (categoryMatch) {
    const c = CATEGORIES[categoryMatch];
    return `${c.icon} ${categoryMatch}:\n\n💰 מחירים: ${c.price}\n📝 ${c.desc}\n\nיש לנו ספקים מכל רחבי הארץ!\nכתוב "הצג ${categoryMatch}ים" כדי לראות את כולם 🔍`;
  }

  if (t.includes('הרשמ') || t.includes('להירשם') || t.includes('חשבון'))
    return '📝 ההרשמה פשוטה ומהירה!\n1. לחץ "הרשמה" בתפריט\n2. בחר: לקוח או ספק\n3. הכנס אימייל וסיסמה\n\nזה הכל! 🎉';

  if (t.includes('הודעה') || t.includes('ליצור קשר') || t.includes('לפנות'))
    return '💬 לשלוח הודעה לספק:\n1. כנס לפרופיל הספק\n2. לחץ "שלח הודעה"\n3. כתוב את ההודעה\n\n⚠️ צריך להיות מחובר.';

  if (t.includes('המלצה') || t.includes('ביקורת') || t.includes('דירוג'))
    return '⭐ לכתוב המלצה:\n1. כנס לפרופיל הספק\n2. לחץ על "המלצות"\n3. מלא את הטופס\n\n✅ רק לקוחות יכולים לכתוב המלצות.';

  if (t.includes('ספק') || t.includes('להירשם כספק') || t.includes('לפרסם'))
    return '🏢 להצטרף כספק:\n1. הירשם עם "ספק / מפיק"\n2. כנס ללוח הבקרה\n3. מלא פרטי העסק\n4. העלה תמונות לתיק עבודות\n\nהפרופיל שלך יופיע בחיפוש! 🚀';

  if (t.includes('צור קשר') || t.includes('תמיכה') || t.includes('בעיה'))
    return '📬 לתמיכה:\n📧 support@eventpro.co.il\n📞 03-1234567\n🕐 א׳-ה׳ 9:00-18:00\n\nאו לחץ על "צור קשר" בתפריט.';

  return 'אשמח לעזור! 😊\n\nתוכל לשאול אותי על:\n• קטגוריות ספקים\n• מחירים\n• איך להשתמש באתר\n• תכנון האירוע שלך\n\nאו כתוב "הצג [קטגוריה]" כדי לראות ספקים!';
}

const QUICK_SETS = [
  ['📸 צלמים', '💄 מאפרות', '🍽️ קייטרינג', '🎧 DJ', '💐 פרחים'],
  ['🏛️ אולמות', '💍 תכשיטים', '🚌 הסעות', '🎂 עוגות', '💰 מחירים'],
  ['💍 חתונה', '📝 הרשמה', '🏢 להיות ספק', '📬 צור קשר', '❓ עזרה'],
];

export default function ChatBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'שלום! 👋 אני EventBot.\nאיך אוכל לעזור לך למצוא את הספק המושלם?\n\nיש לנו 9 קטגוריות עם עשרות ספקים מקצועיים! 🎉' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [quickSet, setQuickSet] = useState(0);
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef();

  const isOnChatPage = location.pathname.startsWith('/chat');

  useEffect(() => { if (isOnChatPage) setOpen(false); }, [isOnChatPage]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open, typing]);

  if (isOnChatPage) return null;

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getBotReply(msg, navigate, setMessages);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      setQuickSet(q => (q + 1) % QUICK_SETS.length);
    }, 600 + Math.random() * 400);
  };

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <div className="chatbot-name">EventBot</div>
              <div className="chatbot-status">
                <span className="status-dot" /> {typing ? 'מקליד...' : 'מחובר • יודע הכל על הספקים'}
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>
                {m.from === 'bot' && <div className="bot-icon">🤖</div>}
                <div className="chatbot-bubble">{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="chatbot-msg bot">
                <div className="bot-icon">🤖</div>
                <div className="chatbot-bubble typing-bubble"><span /><span /><span /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-quick">
            {QUICK_SETS[quickSet].map(q => (
              <button key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <form className="chatbot-input" onSubmit={e => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={e => {
                setInput(e.target.value);
                clearTimeout(typingTimeoutRef.current);
              }}
              placeholder="שאל אותי כל דבר..."
              disabled={typing}
            />
            <button type="submit" disabled={typing || !input.trim()}>➤</button>
          </form>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '🤖'}
        {!open && <span className="chatbot-fab-label">EventBot</span>}
      </button>
    </div>
  );
}
