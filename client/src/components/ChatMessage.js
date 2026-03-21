import React from 'react';

const ChatMessage = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (message.type === 'error') {
    return (
      <div className="message error-message">
        <div className="message-avatar">
          <span>⚠️</span>
        </div>
        <div className="message-content">
          <div className="error-text">{message.content}</div>
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`message ${message.type}-message`}>
      <div className="message-avatar">
        {message.type === 'user' ? (
          <div className="user-avatar">
            <span>👤</span>
          </div>
        ) : (
          <div className="ai-avatar">
            <span>🤖</span>
          </div>
        )}
      </div>
      <div className="message-content">
        <div className="message-text">
          {message.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
