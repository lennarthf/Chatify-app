import { useState, useEffect, useRef } from 'react';
import SideNav from '../SideNav/SideNav';
import DOMPurify from 'dompurify';
import { API_BASE_URL } from '../../utils/api';
import './Chat.css';

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  //Fake chat
  const [fakeChat] = useState([
    {
      text: 'Tja tja, hur mår du?',
      avatar: 'https://i.pravatar.cc/100?img=14',
      username: 'Johnny',
      conversationId: null,
    },
    {
      text: 'Hallå!! Svara då!!',
      avatar: 'https://i.pravatar.cc/100?img=14',
      username: 'Johnny',
      conversationId: null,
    },
    {
      text: 'Sover du eller?!',
      avatar: 'https://i.pravatar.cc/100?img=14',
      username: 'Johnny',
      conversationId: null,
    },
  ]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Kunde inte hämta meddelanden');
      }
    } catch (err) {
      setError('Kunde inte ansluta till servern');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    //Sanitering
    const sanitizedMessage = DOMPurify.sanitize(newMessage.trim());

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          text: sanitizedMessage,
          conversationId: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.latestMessage]);
        setNewMessage('');
      } else {
        setError('Kunde inte skicka meddelande');
      }
    } catch (err) {
      setError('Kunde inte ansluta till servern');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${msgId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== msgId));
      } else {
        setError('Kunde inte radera meddelande');
      }
    } catch (err) {
      setError('Kunde inte ansluta till servern');
    }
  };

  //lägger in fake meddelanden
  const allMessages = [...fakeChat, ...messages];

  if (loading) {
    return (
      <div className='chat-container'>
        <SideNav user={user} onLogout={onLogout} />
        <div className='chat-content'>
          <div className='loading'>Laddar meddelanden...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='chat-container'>
      <SideNav user={user} onLogout={onLogout} />
      <div className='chat-content'>
        <div className='chat-header'>
          <div className='user-info'>
            <img
              src={user.avatar}
              alt={user.username}
              className='avatar-small'
            />
            <span>{user.username}</span>
          </div>
        </div>

        {error && <div className='error-banner'>{error}</div>}

        <div className='messages-container'>
          {allMessages.map((msg, index) => {
            const isOwnMessage = msg.userId === user.userId;
            const messageKey = msg.id || `fake-${index}`;

            return (
              <div
                key={messageKey}
                className={`message ${
                  isOwnMessage ? 'message-right' : 'message-left'
                }`}
              >
                <div className='message-content'>
                  <div className='message-header'>
                    <img
                      src={msg.avatar || user.avatar}
                      alt={msg.username || user.username}
                      className='avatar-tiny'
                    />
                    <span className='message-username'>
                      {msg.username || user.username}
                    </span>
                  </div>
                  <div className='message-text'>{msg.text}</div>
                  {isOwnMessage && msg.id && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className='delete-btn'
                      title='Radera meddelande'
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className='message-form'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Skriv ett meddelande...'
            className='message-input'
          />
          <button type='submit' className='send-btn'>
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
