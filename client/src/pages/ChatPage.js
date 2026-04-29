import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { targetId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const messagesRef = useRef();
  const navigate = useNavigate();

  const loadConversations = async () => {
    const r = await api.get('/chat');
    setConversations(r.data);
    if (targetId && targetId !== 'undefined') {
      const conv = r.data.find(c => c.OtherUserId === +targetId);
      if (conv) setTargetEmail(conv.Email);
    }
    return r.data;
  };

  useEffect(() => { loadConversations(); }, []); // eslint-disable-line

  useEffect(() => {
    if (!targetId || targetId === 'undefined') return;
    window.scrollTo(0, 0);
    api.get(`/chat/${targetId}`).then(r => setMessages(r.data));
    api.get('/chat').then(r => {
      setConversations(r.data);
      const conv = r.data.find(c => c.OtherUserId === +targetId);
      if (conv) setTargetEmail(conv.Email);
      else {
        // אם אין שיחה עדיין, טען את האימייל לפי user ID
        api.get(`/chat/user/${targetId}`).then(p => {
          if (p.data?.Email) setTargetEmail(p.data.Email);
        }).catch(() => {});
      }
    });
  }, [targetId]); // eslint-disable-line

  // גלילה לתחתית תמיד
  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post('/chat', { receiverId: +targetId, content: text });
    setMessages(prev => [...prev, data]);
    setText('');
    loadConversations();
  };

  const deleteConversation = async (otherId) => {
    if (!window.confirm('למחוק את השיחה?')) return;
    await api.delete(`/chat/${otherId}`).catch(() => {});
    await loadConversations();
    if (+targetId === otherId) navigate('/chat');
  };

  const myId = user?.token ? JSON.parse(atob(user.token.split('.')[1])).id : null;
  const activeConv = conversations.find(c => c.OtherUserId === +targetId);
  const displayName = activeConv?.Email || targetEmail;

  return (
    <div className="chat-layout">
      <aside className="conversations-list">
        <button className="back-btn back-btn-chat" onClick={() => navigate(-1)}>← חזרה</button>
        <h3>💬 שיחות</h3>
        {conversations.map(c => (
          <div key={c.OtherUserId} className={`conv-item ${+targetId === c.OtherUserId ? 'active' : ''}`}>
            <Link to={`/chat/${c.OtherUserId}`} className="conv-item-link">
              <div className="conv-avatar">{c.Email?.[0]?.toUpperCase()}</div>
              <div className="conv-info">
                <span className="conv-email">{c.Email}</span>
                <span className="conv-preview">
                  {c.UnreadCount > 0 ? `${c.UnreadCount} הודעות חדשות` : 'לחץ לפתיחת שיחה'}
                </span>
              </div>
              {c.UnreadCount > 0 && <span className="badge">{c.UnreadCount}</span>}
            </Link>
            <button
              className="conv-delete-btn"
              onClick={() => deleteConversation(c.OtherUserId)}
              title="מחק שיחה"
            >🗑️</button>
          </div>
        ))}
        {conversations.length === 0 && (
          <div className="conv-empty">
            <span>💬</span>
            <p>אין שיחות עדיין</p>
          </div>
        )}
      </aside>

      <div className="chat-window">
        {targetId && targetId !== 'undefined' ? (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">
                {displayName?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="chat-header-name">{displayName || 'טוען...'}</div>
                <div className="chat-header-status">
                  <span className="status-dot-green" /> מחובר
                </div>
              </div>
            </div>

            <div className="messages" ref={messagesRef}>
              {messages.map((m, i) => {
                const isMine = m.SenderId === myId;
                const showAvatar = !isMine && (i === 0 || messages[i-1]?.SenderId !== m.SenderId);
                return (
                  <div key={m.Id || i} className={`message ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && (
                      <div className={`msg-avatar ${showAvatar ? '' : 'msg-avatar-hidden'}`}>
                        {displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="msg-content">
                      <p>{m.Content}</p>
                      <span>{new Date(m.SentAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form className="message-input" onSubmit={sendMessage}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="כתוב הודעה..."
                autoFocus
              />
              <button type="submit" className="send-btn" disabled={!text.trim()}>
                שלח ➤
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <div className="chat-placeholder-icon">💬</div>
            <p>בחר שיחה מהרשימה</p>
            <span>או פנה לספק מדף הפרופיל שלו</span>
          </div>
        )}
      </div>
    </div>
  );
}
