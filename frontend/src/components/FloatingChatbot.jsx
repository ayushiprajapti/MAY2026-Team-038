import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { startSession, sendMessage } from '../api/chat';
import { ApiError, getToken } from '../api/client';
import './FloatingChatbot.css';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to the Heritage Atlas! Ask me about any historical site.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    setError('');
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const session = await startSession();
        currentSessionId = session.id;
        setSessionId(currentSessionId);
      }

      const reply = await sendMessage(currentSessionId, text);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply.content }]);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : 'Something went wrong, please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="floating-chatbot-container">
      {isOpen && (
        <div className="floating-chat-window">
          <div className="floating-chat-header">
            <h3>Heritage Assistant</h3>
            <button className="close-chat-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="floating-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                {msg.sender === 'bot' && <div className="message-avatar">🤖</div>}
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble">…</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && <div className="floating-chat-error">{error}</div>}

          {getToken() ? (
            <form className="floating-chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about a site..."
                disabled={isTyping}
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping}>Send</button>
            </form>
          ) : (
            <div className="floating-chat-login-prompt">
              <Link to="/login">Log in</Link> to chat with the Heritage Assistant.
            </div>
          )}
        </div>
      )}

      {!isOpen && (
        <button className="floating-chat-trigger with-text" onClick={() => setIsOpen(true)}>
          <span className="trigger-icon">💬</span> Ask Assistant
        </button>
      )}
    </div>
  );
}
