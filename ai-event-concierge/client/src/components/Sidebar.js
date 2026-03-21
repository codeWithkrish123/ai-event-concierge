import React from 'react';

const Sidebar = ({ chats, currentChatId, onChatSelect, onNewChat, collapsed, onToggleCollapse, onDeleteChat }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* AI Event Concierge Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">
              <span style={{ 
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--chatgpt-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                A
              </span>
            </div>
            {!collapsed && <span className="logo-text">AI Event Concierge</span>}
          </div>
          <button className="collapse-btn" onClick={onToggleCollapse}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
            </svg>
          </button>
        </div>
        
        {!collapsed && (
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New chat
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Chat History */}
          <div className="chat-history-section">
            <div className="section-header">
              <span>Today</span>
            </div>
            <div className="chat-list">
              {chats.length === 0 ? (
                <div className="no-chats">
                  <span className="no-chats-icon">💬</span>
                  <span className="no-chats-text">No chats yet</span>
                </div>
              ) : (
                chats.map((chat) => (
                  <div key={chat.id} className="chat-item-wrapper">
                    <button
                      className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                      onClick={() => onChatSelect(chat.id)}
                    >
                      <div className="chat-content">
                        <div className="chat-title">{chat.title}</div>
                        <div className="chat-preview">
                          {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + (chat.messages[chat.messages.length - 1].content.length > 50 ? '...' : '') : 'No messages yet'}
                        </div>
                      </div>
                      <div className="chat-time">
                        {new Date(chat.updatedAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </button>
                    <button 
                      className="delete-chat-btn"
                      onClick={() => onDeleteChat(chat.id)}
                      title="Delete chat"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
