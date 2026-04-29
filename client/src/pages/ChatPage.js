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
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesRef = useRef();
  const imageInputRef = useRef();
  const navigate = useNavigate();

  const getName = (id) => localStorage.getItem(`chat_name_${id}`) || '';
  const displayName = getName(targetId);

  const loadConversations = async () => {
    const r = await api.get('/chat');
    setConversations(r.data);
    r.data.forEach(c => {
      if (!localStorage.getItem(`chat_name_${c.OtherUserId}`))
        localStorage.setItem(`chat_name_${c.OtherUserId}`, c.Email);
    });
    return r.data;
  };

  useEffect(() => { loadConversations(); }, []); // eslint-disable-line

  useEffect(() => {
    if (!targetId || targetId === 'undefined') return;
    api.get(`/chat/${targetId}`).then(r => {
      setMessages(r.data);
      // רענן שיחות כדי לאפס unread
      loadConversations();
    });
  }, [targetId]); // eslint-disable-line

  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  // בדוק אם הצד השני מקליד
  useEffect(() => {
    if (!targetId || targetId === 'undefined') return;
    const interval = setInterval(() => {
      api.get(`/chat/typing/${targetId}`).then(r => setOtherTyping(r.data.isTyping)).catch(() => {});
    }, 1500);
    return () => clearInterval(interval);
  }, [targetId]); // eslint-disable-line

  const handleTyping = (val) => {
    setText(val);
    if (!targetId || targetId === 'undefined') return;
    api.post('/chat/typing', { receiverId: +targetId, isTyping: true }).catch(() => {});
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      api.post('/chat/typing', { receiverId: +targetId, isTyping: false }).catch(() => {});
    }, 2000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post('/chat', { receiverId: +targetId, content: text });
    setMessages(prev => [...prev, data]);
    setText('');
    loadConversations();
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('receiverId', targetId);
    const { data } = await api.post('/chat/image', formData);
    setMessages(prev => [...prev, data]);
    loadConversations();
    e.target.value = '';
  };

  const doDelete = async () => {
    const otherId = confirmDelete.id;
    setConfirmDelete(null);
    await api.delete(`/chat/${otherId}`).catch(() => {});
    localStorage.removeItem(`chat_name_${otherId}`);
    await loadConversations();
    if (+targetId === otherId) navigate('/chat');
  };

  const myId = user?.token ? JSON.parse(atob(user.token.split('.')[1])).id : null;

  const renderContent = (m) => {
    if (m.Content?.startsWith('__IMAGE__')) {
      const src = m.Content.replace('__IMAGE__', '');
      return <img src={src} alt="תמונה" className="chat-img" onClick={() => setLightbox(src)} />;
    }
    return <p>{m.Content}</p>;
  };

  return (
    <div className="chat-layout">
      {confirmDelete && (
        <div className="popup-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="popup-box" onClick={e => e.stopPropagation()}>
            <div className="popup-icon">🗑️</div>
            <h3>מחיקת שיחה</h3>
            <p>האם למחוק את השיחה עם <strong>{confirmDelete.name}</strong>?<br/>פעולה זו אינה ניתנת לביטול.</p>
            <div className="popup-btns">
              <button className="popup-cancel" onClick={() => setConfirmDelete(null)}>ביטול</button>
              <button className="popup-confirm" onClick={doDelete}>מחק</button>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <aside className="conversations-list">
        <button className="back-btn back-btn-chat" onClick={() => navigate(-1)}>← חזרה</button>
        <h3>💬 שיחות</h3>
        {conversations.map(c => {
          const name = localStorage.getItem(`chat_name_${c.OtherUserId}`) || c.Email;
          return (
            <div key={c.OtherUserId} className={`conv-item ${+targetId === c.OtherUserId ? 'active' : ''}`}>
              <Link to={`/chat/${c.OtherUserId}`} className="conv-item-link">
                <div className="conv-avatar">{name?.[0]?.toUpperCase()}</div>
                <div className="conv-info">
                  <span className="conv-email">{name}</span>
                  <span className="conv-preview">
                    {c.UnreadCount > 0 ? `${c.UnreadCount} הודעות חדשות` : 'לחץ לפתיחת שיחה'}
                  </span>
                </div>
                {c.UnreadCount > 0 && <span className="badge">{c.UnreadCount}</span>}
              </Link>
              <button className="conv-delete-btn" onClick={() => setConfirmDelete({ id: c.OtherUserId, name })} title="מחק שיחה">🗑️</button>
            </div>
          );
        })}
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
                const isImg = m.Content?.startsWith('__IMAGE__');
                const showAvatar = !isMine && (i === 0 || messages[i-1]?.SenderId !== m.SenderId);
                return (
                  <div key={m.Id || i} className={`message ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && (
                      <div className={`msg-avatar ${showAvatar ? '' : 'msg-avatar-hidden'}`}>
                        {displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="msg-content">
                      <div className={isImg ? 'msg-img-wrap' : ''}>{renderContent(m)}</div>
                      <span>{new Date(m.SentAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
              {otherTyping && (
                <div className="message theirs">
                  <div className="msg-avatar">{displayName?.[0]?.toUpperCase() || '?'}</div>
                  <div className="msg-content">
                    <div className="typing-indicator">
                      <span/><span/><span/>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form className="message-input" onSubmit={sendMessage}>
              <input type="file" accept="image/*" ref={imageInputRef} style={{ display: 'none' }} onChange={sendImage} />
              <button type="button" className="img-btn" onClick={() => imageInputRef.current.click()} title="שלח תמונה">📷</button>
              <input value={text} onChange={e => handleTyping(e.target.value)} placeholder="כתוב הודעה..." autoFocus />
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
