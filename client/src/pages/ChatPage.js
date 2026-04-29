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
  const bottomRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/chat').then(r => setConversations(r.data));
  }, []);

  useEffect(() => {
    if (!targetId) return;
    api.get(`/chat/${targetId}`).then(r => setMessages(r.data));
  }, [targetId]);

  const messagesRef = useRef();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post('/chat', { receiverId: +targetId, content: text });
    setMessages(prev => [...prev, data]);
    setText('');
  };

  const myId = user?.token ? JSON.parse(atob(user.token.split('.')[1])).id : null;
  const activeConv = conversations.find(c => c.OtherUserId === +targetId);

  return (
    <div className="chat-layout">
      <aside className="conversations-list">
        <button className="back-btn back-btn-chat" onClick={() => navigate(-1)}>← חזרה</button>
        <h3>💬 שיחות</h3>
        {conversations.map(c => (
          <Link
            key={c.OtherUserId}
            to={`/chat/${c.OtherUserId}`}
            className={`conv-item ${+targetId === c.OtherUserId ? 'active' : ''}`}
          >
            <div className="conv-avatar">{c.Email?.[0]?.toUpperCase()}</div>
            <div className="conv-info">
              <span className="conv-email">{c.Email}</span>
              <span className="conv-preview">לחץ לפתיחת שיחה</span>
            </div>
            {c.UnreadCount > 0 && <span className="badge">{c.UnreadCount}</span>}
          </Link>
        ))}
        {conversations.length === 0 && (
          <div className="conv-empty">
            <span>💬</span>
            <p>אין שיחות עדיין</p>
          </div>
        )}
      </aside>

      <div className="chat-window">
        {targetId ? (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">{activeConv?.Email?.[0]?.toUpperCase() || '?'}</div>
              <div>
                <div className="chat-header-name">{activeConv?.Email || '...'}</div>
                <div className="chat-header-status"><span className="status-dot-green" /> מחובר</div>
              </div>
            </div>

            <div className="messages" ref={messagesRef}>
              {messages.map((m, i) => {
                const isMine = m.SenderId === myId;
                const showAvatar = !isMine && (i === 0 || messages[i - 1]?.SenderId !== m.SenderId);
                return (
                  <div key={m.Id} className={`message ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && (
                      <div className={`msg-avatar ${showAvatar ? '' : 'msg-avatar-hidden'}`}>
                        {activeConv?.Email?.[0]?.toUpperCase() || '?'}
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
                <span>שלח</span> ➤
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
