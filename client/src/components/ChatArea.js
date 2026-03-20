import React, { useState, useEffect } from 'react';

const ChatArea = ({ 
  messages, 
  streamedText, 
  isStreaming, 
  isTyping, 
  input, 
  setInput, 
  onSend, 
  onKeyPress, 
  currentChat,
  messagesEndRef 
}) => {
  const [modelDropdown, setModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-flash-lite-preview');
  const [theme, setTheme] = useState('light'); // 'light', 'dark'

  // Your actual Gemini models
  const models = [
    'gemini-3.1-flash-lite-preview',
    'gemini-3-flash-preview', 
    'gemini-2.5-flash'
  ];

  // Apply theme to document
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    // 'light' theme is default (no attribute)
  }, [theme]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-area">
      {/* AI Event Concierge Header with Theme Options */}
      <div className="chat-header">
        <div className="chat-title">
          {currentChat ? currentChat.title : 'AI Event Concierge'}
        </div>
        
        <div className="chat-actions">
          {/* Simple Theme Toggle Switch */}
          <div className="theme-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </div>

          {/* Model Selector with Gemini Models */}
          <div className="model-dropdown">
            <button 
              className="model-selector"
              onClick={() => setModelDropdown(!modelDropdown)}
            >
              <div className="model-icon">G</div>
              <span>{selectedModel}</span>
              <svg className={`dropdown-arrow ${modelDropdown ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-9"/>
              </svg>
            </button>
            
            {modelDropdown && (
              <div className="model-dropdown-menu">
                {models.map(model => (
                  <div
                    key={model}
                    className="model-dropdown-item"
                    onClick={() => {
                      setSelectedModel(model);
                      setModelDropdown(false);
                    }}
                  >
                    <span>{model}</span>
                    {selectedModel === model && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 && !isTyping && !isStreaming && (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon"></div>
              <h1 className="welcome-title">How can I help you today?</h1>
              <p className="welcome-subtitle">Plan trips, organize events, and more…</p>
              
              <div className="example-prompts">
                <div className="example-grid">
                  <div className="example-card" onClick={() => setInput("Plan a 3-day trip to Manali for 5 people")}>
                    <div className="example-icon">✈️</div>
                    <div className="example-text">
                      <div className="example-title">Plan a Trip</div>
                      <div className="example-desc">Plan a 3-day trip to Manali for 5 people</div>
                    </div>
                  </div>
                  
                  <div className="example-card" onClick={() => setInput("Organize a birthday party for 20 people in Delhi")}>
                    <div className="example-icon">🎉</div>
                    <div className="example-text">
                      <div className="example-title">Organize Event</div>
                      <div className="example-desc">Organize a birthday party for 20 people in Delhi</div>
                    </div>
                  </div>
                  
                  <div className="example-card" onClick={() => setInput("Plan a weekend getaway to Goa for a couple")}>
                    <div className="example-icon">🏖️</div>
                    <div className="example-text">
                      <div className="example-title">Weekend Getaway</div>
                      <div className="example-desc">Plan a weekend getaway to Goa for a couple</div>
                    </div>
                  </div>
                  
                  <div className="example-card" onClick={() => setInput("Help me plan a corporate retreat for 50 employees")}>
                    <div className="example-icon">💼</div>
                    <div className="example-text">
                      <div className="example-title">Corporate Event</div>
                      <div className="example-desc">Help me plan a corporate retreat for 50 employees</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}-message`}>
            <div className="message-content">
              <div className="message-avatar">
                {message.type === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-bubble">
                <div className="message-text">
                  {message.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && !isStreaming && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Streaming Message */}
        {isStreaming && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble">
                <div className="message-text streaming">
                  {streamedText}
                  <span className="typing-cursor">|</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI Event Concierge Input Area */}
      <div className="input-area">
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Send a message..."
            className="message-input"
            disabled={isTyping || isStreaming}
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isTyping || isStreaming}
            className="send-button"
          >
            {isTyping || isStreaming ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </div>
        <div className="input-footer">
          <span>AI Event Concierge can make mistakes. Consider checking important information.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
