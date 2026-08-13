import React, { useState, useRef, useEffect } from 'react';
import { startSession, sendMessage } from '../api/chat';
import { ApiError } from '../api/client';
import './FloatingChatbot.css';

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <path d="M2 13h2M20 13h2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

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
            <button className="close-chat-btn" onClick={() => setIsOpen(false)} aria-label="Close chat"><CloseIcon /></button>
          </div>

          <div className="floating-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                {msg.sender === 'bot' && <div className="message-avatar"><BotIcon /></div>}
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
        </div>
      )}

      {!isOpen && (
        <button className="floating-chat-trigger with-text" onClick={() => setIsOpen(true)}>
          <span className="trigger-icon"><ChatIcon /></span> Ask Assistant
        </button>
      )}
    </div>
  );
}
