import React, { useState, useRef, useEffect } from 'react';
import { generateEvent } from '../api';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const simulateStreamingResponse = async (fullResponse) => {
    setIsStreaming(true);
    setStreamedText('');
    
    const words = fullResponse.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setStreamedText(currentText);
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    }
    
    // Add the complete message to messages
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      content: fullResponse,
      timestamp: new Date()
    }]);
    
    setStreamedText('');
    setIsStreaming(false);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateEvent(userMessage.content);
      if (response.data && response.data.plan) {
        // Start streaming the AI response
        await simulateStreamingResponse(response.data.plan);
      }
    } catch (error) {
      setIsTyping(false);
      setIsStreaming(false);
      
      const errorMessage = {
        id: Date.now(),
        type: 'error',
        content: `Sorry, I encountered an error: ${error.response?.data?.details || error.message || 'Unknown error occurred'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="header-content">
          <div className="ai-avatar">
            <span className="avatar-icon">🤖</span>
          </div>
          <div className="header-text">
            <h1>AI Event Concierge</h1>
            <p>Your intelligent travel and event planning assistant</p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !isTyping && !isStreaming && (
          <div className="welcome-message">
            <div className="welcome-content">
              <h2>👋 Welcome to AI Event Concierge!</h2>
              <p>I can help you plan amazing events and travel experiences. Try asking me:</p>
              <div className="example-prompts">
                <div className="prompt-example" onClick={() => setInput("Plan a 3-day trip to Manali for 5 people")}>
                  <span>✈️</span> Plan a 3-day trip to Manali for 5 people
                </div>
                <div className="prompt-example" onClick={() => setInput("Organize a birthday party for 20 people in Delhi")}>
                  <span>🎉</span> Organize a birthday party for 20 people in Delhi
                </div>
                <div className="prompt-example" onClick={() => setInput("Plan a weekend getaway to Goa for a couple")}>
                  <span>🏖️</span> Plan a weekend getaway to Goa for a couple
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && !isStreaming && (
          <div className="message ai-message">
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="message-content">
              <TypingIndicator />
            </div>
          </div>
        )}

        {isStreaming && (
          <div className="message ai-message">
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="message-content streaming">
              <div className="streaming-text">
                {streamedText}
                <span className="typing-cursor">|</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your ideal event or travel plan..."
            className="chat-input"
            disabled={isTyping || isStreaming}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isStreaming}
            className={`send-button ${isTyping || isStreaming ? 'disabled' : ''}`}
          >
            {isTyping || isStreaming ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </div>
        <div className="input-footer">
          <p>Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
