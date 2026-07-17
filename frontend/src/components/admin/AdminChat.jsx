import React, { useState, useEffect, useRef } from 'react';
import { trails } from '../../data/trails';
import './AdminChat.css';

// Mock bot logic that searches the database for site names
function generateBotResponse(message) {
  const lowerMsg = message.toLowerCase();
  let foundSite = null;

  for (const trail of trails) {
    for (const site of trail.sites) {
      if (lowerMsg.includes(site.name.toLowerCase())) {
        foundSite = site;
        break;
      }
    }
    if (foundSite) break;
  }

  if (foundSite) {
    return `Found it in the database! **${foundSite.name}** is a ${foundSite.type} built in ${foundSite.built}. Here is the signification data we have: \n\n"${foundSite.signification}"`;
  }

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return 'Hello! I am your Heritage Database Assistant. Ask me about any site (like "Shaniwar Wada" or "Trimbakeshwar Temple") and I will fetch its data for you.';
  }

  return 'I couldn\'t find a specific heritage site matching that in our database. Try asking about a specific site by name, like "Torna Fort" or "Rankala Lake Ghat".';
}

const MOCK_SESSIONS = [
  { id: 1, title: 'Query about Shaniwar Wada', date: 'Today' },
  { id: 2, title: 'Nashik Temples analysis', date: 'Yesterday' },
  { id: 3, title: 'Forts of Pune', date: 'Previous 7 Days' },
];

export default function AdminChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Welcome to the Admin Database Chat! I can help you quickly retrieve information about our approved heritage sites. What are you looking for?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network delay for the bot response
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: generateBotResponse(userMsg.text)
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([{ id: Date.now(), sender: 'bot', text: 'Started a new session. How can I help?' }]);
  };

  const handleSessionClick = (sessionTitle) => {
    setMessages([
      { id: Date.now(), sender: 'user', text: `Can you remind me about ${sessionTitle}?` },
      { id: Date.now() + 1, sender: 'bot', text: `Sure, here is the context from our previous chat about "${sessionTitle}"...` }
    ]);
  };

  return (
    <div className="admin-chat-layout">
      <aside className="admin-chat-sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <span>+</span> New chat
        </button>
        
        <div className="chat-sessions">
          {MOCK_SESSIONS.map((session) => (
            <div key={session.id} className="chat-session-item" onClick={() => handleSessionClick(session.title)}>
              <div className="chat-session-icon">💬</div>
              <div className="chat-session-title">{session.title}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="admin-chat-main">
        <div className="admin-chat-messages" ref={containerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message-row bot-row">
              <div className="chat-bubble bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

        </div>

        <div className="admin-chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              placeholder="Message DB Assistant..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!inputValue.trim()}>
              Send
            </button>
          </form>
          <div className="chat-footer-note">
            Assistant can make mistakes. Verify important data in the Admin Database.
          </div>
        </div>
      </main>
    </div>
  );
}
