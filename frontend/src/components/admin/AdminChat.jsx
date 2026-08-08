import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession, sendMessage, listMessages } from '../../api/chat';
import { ApiError } from '../../api/client';
import { logout } from '../../api/auth';
import './AdminChat.css';

const SESSIONS_KEY = 'intach_admin_chat_sessions';

function loadSessionIndex() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSessionIndex(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function dateLabel(isoString) {
  const date = new Date(isoString);
  const today = new Date();
  const diffDays = Math.floor((today.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Previous 7 Days';
  return 'Older';
}

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

export default function AdminChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 'welcome', sender: 'bot', text: 'Welcome to the Heritage Database Assistant! Ask me about any approved heritage site and I will look it up for you.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState(loadSessionIndex);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({ fullName: 'Admin User', role: 'Chapter Head' });
  const containerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('intach_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdminUser({
          fullName: parsed.full_name || 'Admin User',
          role: parsed.roles?.[0] || 'Admin',
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const recordSession = (id, title) => {
    setSessions((prev) => {
      if (prev.some((s) => s.id === id)) return prev;
      const next = [{ id, title, date: new Date().toISOString() }, ...prev];
      saveSessionIndex(next);
      return next;
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    setError('');
    const userMsg = { id: `local-${Date.now()}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      let sessionId = currentSessionId;
      if (!sessionId) {
        const session = await startSession();
        sessionId = session.id;
        setCurrentSessionId(sessionId);
        recordSession(sessionId, text.slice(0, 60));
      }

      const reply = await sendMessage(sessionId, text);
      setMessages((prev) => [...prev, { id: reply.id, sender: 'bot', text: reply.content }]);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : 'Something went wrong, please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setError('');
    setMessages([{ id: 'welcome', sender: 'bot', text: 'Started a new session. How can I help?' }]);
    setIsSidebarOpen(false);
  };

  const handleSessionClick = async (session) => {
    setError('');
    setIsSidebarOpen(false);
    setCurrentSessionId(session.id);
    setIsTyping(true);
    try {
      const history = await listMessages(session.id);
      setMessages(
        history.map((m) => ({
          id: m.id,
          sender: m.role === 'assistant' ? 'bot' : 'user',
          text: m.content,
        }))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : 'Something went wrong, please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const groupedSessions = useMemo(() => {
    const filtered = sessions.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    const groups = [];
    for (const session of filtered) {
      const label = dateLabel(session.date);
      let group = groups.find((g) => g.label === label);
      if (!group) {
        group = { label, items: [] };
        groups.push(group);
      }
      group.items.push(session);
    }
    return groups;
  }, [sessions, searchTerm]);

  return (
    <div className="admin-chat-layout w-full h-full">

      {isSidebarOpen && (
        <div className="chat-sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Chat Sessions Sidebar — now on the left, doubling as the escape hatch back to admin */}
      <aside className={`admin-chat-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="chat-sidebar-top">
          <button
            type="button"
            className="chat-back-btn"
            onClick={() => navigate('/admin-dashboard')}
            aria-label="Back to admin dashboard"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="chat-sidebar-brand">
            <span className="chat-sidebar-brand-title">INTACH Pune</span>
            <span className="chat-sidebar-brand-sub">Database Assistant</span>
          </div>
          <button
            type="button"
            className="chat-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close chat history"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button type="button" className="new-chat-btn" onClick={handleNewChat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New chat
        </button>

        <label className="chat-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search chats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search chat history"
          />
        </label>

        <div className="chat-sessions">
          {groupedSessions.length === 0 && (
            <div className="chat-sessions-empty">
              {sessions.length === 0 ? 'No chats yet — send a message to start one.' : `No chats match "${searchTerm}"`}
            </div>
          )}
          {groupedSessions.map((group) => (
            <div key={group.label} className="chat-session-group">
              <div className="chat-session-group-label">{group.label}</div>
              {group.items.map((session) => (
                <button
                  type="button"
                  key={session.id}
                  className={`chat-session-item ${currentSessionId === session.id ? 'active' : ''}`}
                  onClick={() => handleSessionClick(session)}
                >
                  <span className="chat-session-icon"><ChatBubbleIcon /></span>
                  <span className="chat-session-title">{session.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="chat-sidebar-footer">
          <div className="chat-user-chip">
            <div className="chat-user-avatar">{adminUser.fullName.charAt(0)}</div>
            <div className="chat-user-info">
              <p className="chat-user-name">{adminUser.fullName}</p>
              <p className="chat-user-role">{adminUser.role}</p>
            </div>
          </div>
          <button type="button" className="chat-signout-btn" onClick={handleLogout} aria-label="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="admin-chat-main">
        <header className="admin-chat-topbar">
          <button
            type="button"
            className="chat-menu-toggle"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open chat history"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="admin-chat-topbar-titles">
            <h1>Database Assistant</h1>
            <p>Ask about any approved heritage site</p>
          </div>
        </header>

        {error && (
          <div className="mb-2 mx-4 mt-2 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans">
            {error}
          </div>
        )}

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
          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              placeholder="Message DB Assistant..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input-field"
            />
            <button type="submit" className="chat-submit-btn" disabled={!inputValue.trim() || isTyping}>
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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
