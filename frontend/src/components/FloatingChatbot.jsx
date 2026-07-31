import React, { useState, useRef, useEffect } from 'react';
import { trails } from '../data/trails';
import './FloatingChatbot.css';

// Simple mock bot logic matching the admin chatbot
function generateBotResponse(message) {
  const lowerMsg = message.toLowerCase();
  let foundSite = null;

  for (const trail of trails) {
    for (const site of trail.sites) {
      if (lowerMsg.includes(site.name.toLowerCase())) {
        foundSite = { ...site, trailRegion: trail.region };
        break;
      }
    }
    if (foundSite) break;
  }

  if (foundSite) {
    return `**${foundSite.name}** is a ${foundSite.type} located in ${foundSite.trailRegion}, built in ${foundSite.built}.\n\nSignificance: ${foundSite.signification}`;
  }

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return "Hello! I am the Heritage Assistant. Ask me about any specific site (e.g., 'Tell me about Shaniwar Wada') and I'll look it up in the database!";
  }

  return "I'm sorry, I couldn't find a heritage site matching your query. Try asking about 'Rajgad Fort', 'Shaniwar Wada', or 'Someshwar Temple'.";
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to the Heritage Atlas! Ask me about any historical site.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate network delay for bot response
    setTimeout(() => {
      const botResponse = { sender: 'bot', text: generateBotResponse(userMessage.text) };
      setMessages(prev => [...prev, botResponse]);
    }, 600);
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
            <div ref={messagesEndRef} />
          </div>

          <form className="floating-chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about a site..."
            />
            <button type="submit" disabled={!inputValue.trim()}>Send</button>
          </form>
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
