import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BOT_RESPONSES = {
  ברירת_מחדל: 'אשמח לעזור! 😊 תוכל לשאול אותי על ספקים, קטגוריות, מחירים, או איך להשתמש באתר.',
  שלום: 'שלום! 👋 אני EventBot, העוזר החכם של EventPro.\nאיך אוכל לעזור לך היום?',
  עזרה: 'אני יכול לעזור לך:\n• 🔍 למצוא ספקים לפי קטגוריה\n• 💰 להבין טווחי מחירים\n• 📸 להסביר על תיק עבודות\n• 💬 לשלוח הודעות לספקים\n• ⭐ לכתוב המלצות',
  צלם: '📸 הצלמים שלנו מתמחים בחתונות, בר/בת מצוות ואירועים עסקיים.\n💰 מחירים: ₪2,800–₪3,500\n\nלחץ על "צלם" בדף הבית לראות את כולם!',
  מאפרת: '💄 המאפרות שלנו מתמחות בכלות, ערב ואירועים.\n💰 מחירים: ₪700–₪800\n\nחפשי בקטגוריה "מאפרת" בדף הבית.',
  קייטרינג: '🍽️ קייטרינג לכל סוגי האירועים.\n💰 מחיר לאורח: ₪120–₪180\n\nחפש "קייטרינג" בדף הבית.',
  dj: '🎧 הדי-ג\'ים שלנו מצוידים במערכות סאונד ותאורה מקצועיות.\n💰 מחירים: ₪2,000–₪2,500\n\nחפש "DJ" בדף הבית.',
  פרחים: '💐 עיצוב פרחוני מרהיב לחתונות ואירועים.\n💰 מחירים: ₪1,500–₪2,000',
  אולם: '🏛️ אולמות ייחודיים לכל סוגי האירועים.\n💰 מחירים: ₪12,000–₪15,000',
  מחיר: '💰 טווחי המחירים באתר:\n\n📸 צלם: ₪2,800–₪3,500\n💄 מאפרת: ₪700–₪800\n🍽️ קייטרינג: ₪120–₪180 לאורח\n🎧 DJ: ₪2,000–₪2,500\n💐 פרחים: ₪1,500–₪2,000\n🏛️ אולם: ₪12,000–₪15,000',
  הרשמה: '📝 ההרשמה פשוטה!\n1. לחץ "הרשמה" בתפריט\n2. בחר: לקוח או ספק\n3. הכנס אימייל וסיסמה',
  הודעה: '💬 לשלוח הודעה לספק:\n1. כנס לפרופיל הספק\n2. לחץ "שלח הודעה"\n3. כתוב את ההודעה',
  המלצה: '⭐ לכתוב המלצה:\n1. כנס לפרופיל הספק\n2. לחץ על "המלצות"\n3. מלא את הטופס',
  חתונה: '💍 לחתונה מושלמת תצטרך:\n📸 צלם, 💄 מאפרת, 🍽️ קייטרינג\n🎧 DJ, 💐 פרחים, 🏛️ אולם\n\nאנחנו יכולים לעזור עם הכל! 🎊',
  תודה: 'בשמחה! 😊 בהצלחה עם האירוע! 🎉',
};

const QUICK_SETS = [
  ['מחירים 💰', 'צלם 📸', 'קייטרינג 🍽️', 'DJ 🎧', 'עזרה ❓'],
  ['פרחים 💐', 'אולם 🏛️', 'מאפרת 💄', 'חתונה 💍', 'הרשמה 📝'],
];

function getBotReply(text) {
  const t = text.toLowerCase().replace(/[💰📸🍽️🎧❓💐🏛️💄💍📝]/g, '').trim();
  if (t.includes('שלום') || t.includes('היי') || t.includes('הי')) return BOT_RESPONSES.שלום;
  if (t.includes('תודה') || t.includes('thanks')) return BOT_RESPONSES.תודה;
  if (t.includes('עזרה') || t.includes('help')) return BOT_RESPONSES.עזרה;
  if (t.includes('חתונה') || t.includes('כלה')) return BOT_RESPONSES.חתונה;
  if (t.includes('צלם') || t.includes('צילום')) return BOT_RESPONSES.צלם;
  if (t.includes('מאפר') || t.includes('איפור')) return BOT_RESPONSES.מאפרת;
  if (t.includes('קייטרינג') || t.includes('אוכל')) return BOT_RESPONSES.קייטרינג;
  if (t.includes('dj') || t.includes('מוזיקה')) return BOT_RESPONSES.dj;
  if (t.includes('פרח') || t.includes('זר')) return BOT_RESPONSES.פרחים;
  if (t.includes('אולם') || t.includes('מקום')) return BOT_RESPONSES.אולם;
  if (t.includes('מחיר') || t.includes('עלות') || t.includes('כמה')) return BOT_RESPONSES.מחיר;
  if (t.includes('הרשמ') || t.includes('חשבון')) return BOT_RESPONSES.הרשמה;
  if (t.includes('הודעה') || t.includes('לפנות')) return BOT_RESPONSES.הודעה;
  if (t.includes('המלצה') || t.includes('דירוג')) return BOT_RESPONSES.המלצה;
  return BOT_RESPONSES.ברירת_מחדל;
}

export default function ChatBot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'שלום! 👋 אני EventBot.\nאיך אוכל לעזור לך למצוא את הספק המושלם?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [quickSet, setQuickSet] = useState(0);
  const bottomRef = useRef();

  const isOnChatPage = location.pathname.startsWith('/chat'); // v2

  useEffect(() => { if (isOnChatPage) setOpen(false); }, [isOnChatPage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  // אל תרנדר בדף הצ'אט
  if (isOnChatPage) return null;

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(msg) }]);
      setQuickSet(q => (q + 1) % QUICK_SETS.length);
    }, 800 + Math.random() * 400);
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
                <span className="status-dot" /> {typing ? 'מקליד...' : 'מחובר'}
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
                <div className="chatbot-bubble typing-bubble">
                  <span /><span /><span />
                </div>
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
              onChange={e => setInput(e.target.value)}
              placeholder="כתוב הודעה..."
              disabled={typing}
            />
            <button type="submit" disabled={typing || !input.trim()}>➤</button>
          </form>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '💬'}
        {!open && <span className="chatbot-fab-label">עזרה</span>}
      </button>
    </div>
  );
}
