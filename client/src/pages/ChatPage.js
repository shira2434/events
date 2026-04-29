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
  const messagesRef = useRef();
  const navigate = useNavigate();

  // שם תמיד מ-localStorage
  const displayName = localStorage.getItem(`chat_name_${targetId}`) || '';

  const loadConversations = async () => {
    const r = await api.get('/chat');
    setConversations(r.data);
    // עדכן localStorage לכל השיחות
    r.data.forEach(c => {
      if (!localStorage.getItem(`chat_name_${c.OtherUserId}`))
        localStorage.setItem(`chat_name_${c.OtherUserId}`, c.Email);
    });
    return r.data;
  };

  useEffect(() => { loadConversations(); }, []); // eslint-disable-line

  useEffect(() => {
    if (!targetId || targetId === 'undefined') return;
    api.get(`/chat/${targetId}`).then(r => setMessages(r.data));
    loadConversations();
  }, [targetId]); // eslint-disable-line

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
    localStorage.removeItem(`chat_name_${otherId}`);
    await loadConversations();
    if (+targetId === otherId) navigate('/chat');
  };

  const myId = user?.token ? JSON.parse(atob(user.token.split('.')[1])).id : null;

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
            <button className="conv-delete-btn" onClick={() => deleteConversation(c.OtherUserId)} title="מחק שיחה">🗑️</button>
          </div>
        ))}
        {conversations.length === 0 && (
          <div className="conv-empty"><span>💬</span><p>אין שיחות עדיין</p></div>
        )}
      </aside>

      <div className="chat-window">
        {targetId && targetId !== 'undefined' ? (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">{displayName?.[0]?.toUpperCase() || '?'}</div>
              <div>
                <div className="chat-header-name">{displayName || '...'}</div>
                <div className="chat-header-status"><span className="status-dot-green" /> מחובר</div>
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
              <input value={text} onChange={e => setText(e.target.value)} placeholder="כתוב הודעה..." autoFocus />
              <button type="submit" className="send-btn" disabled={!text.trim()}>שלח ➤</button>
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
