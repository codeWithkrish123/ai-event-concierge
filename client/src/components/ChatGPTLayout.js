import React, { useState, useRef, useEffect } from 'react';
import { generateEvent } from '../api';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatGPTLayout = () => {
  // Session management with localStorage
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('currentSessionId');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [messages, setMessages] = useState(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      return session ? session.messages : [];
    }
    return [];
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const messagesEndRef = useRef(null);
  const lastPromptRef = useRef(null);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('currentSessionId', JSON.stringify(currentSessionId));
  }, [currentSessionId]);

  // Load messages when switching sessions
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      setMessages(session ? session.messages : []);
    } else {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText]);

  // Create a new session
  const createNewSession = (title = 'New Chat') => {
    const newSession = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession;
  };

  // Update session title based on first message
  const updateSessionTitle = (sessionId, firstMessage) => {
    const title = firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : firstMessage);
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title, updatedAt: new Date().toISOString() }
        : session
    ));
  };

  // Add message to current session
  const addMessageToSession = (sessionId, message) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            messages: [...session.messages, message],
            updatedAt: new Date().toISOString()
          }
        : session
    ));
  };

  // Enhanced streaming system with ReadableStream
  const simulateStreamingResponse = async (fullResponse) => {
    setIsStreaming(true);
    setStreamedText('');
    setError(null);
    
    const stream = new ReadableStream({
      start(controller) {
        const words = fullResponse.split(' ');
        let index = 0;
        
        const enqueueWord = () => {
          if (index < words.length) {
            const word = words[index] + (index < words.length - 1 ? ' ' : '');
            controller.enqueue(word);
            index++;
            
            const delay = 20 + Math.random() * 80;
            setTimeout(enqueueWord, delay);
          } else {
            controller.close();
          }
        };
        
        enqueueWord();
      }
    });

    const reader = stream.getReader();
    let accumulatedText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        accumulatedText += value;
        setStreamedText(accumulatedText);
      }
    } finally {
      reader.releaseLock();
    }

    const aiMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: fullResponse,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    if (currentSessionId) {
      addMessageToSession(currentSessionId, aiMessage);
    }
    
    setStreamedText('');
    setIsStreaming(false);
    setIsTyping(false);
  };

  // ✅ FIXED: "handleSend" is now safe from event objects
  const handleSend = async (manualPrompt) => {
    // Determine the actual text: manualPrompt (from retry) or input (from state)
    // Wrap in String() and use || "" to ensure it's always a string before .trim()
    const promptToUse = String(
      typeof manualPrompt === 'string' ? manualPrompt : input || ""
    ).trim();

    if (!promptToUse || isTyping || isStreaming) return;

    // Create new session if none exists
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = createNewSession();
      sessionId = newSession.id;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: promptToUse,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    addMessageToSession(sessionId, userMessage);
    
    // Update session title if this is the first message
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.messages.length === 0) {
      updateSessionTitle(sessionId, userMessage.content);
    }
    
    setInput('');
    setIsTyping(true);
    setError(null);
    lastPromptRef.current = promptToUse;

    try {
      const response = await generateEvent(userMessage.content);
      if (response.data && response.data.plan) {
        await simulateStreamingResponse(response.data.plan);
      }
    } catch (err) {
      setIsTyping(false);
      setIsStreaming(false);
      
      const errMsgText = err.response?.data?.details || err.message || 'Unknown error occurred';
      
      const errorMessage = {
        id: Date.now().toString(),
        type: 'error',
        content: `Sorry, I encountered an error: ${errMsgText}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      addMessageToSession(sessionId, errorMessage);
      setError(errMsgText);
    }
  };

  const handleRetry = async () => {
    if (lastPromptRef.current && !isRetrying) {
      setIsRetrying(true);
      setError(null);
      await handleSend(lastPromptRef.current);
      setIsRetrying(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    // Don't allow deletion if this is the current chat
    if (chatId === currentSessionId) {
      return;
    }

    // Remove the chat from sessions
    setSessions(prev => prev.filter(session => session.id !== chatId));
    
    // Update localStorage
    const updatedSessions = sessions.filter(session => session.id !== chatId);
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setIsStreaming(false);
    setStreamedText('');
    setError(null);
    lastPromptRef.current = null;
  };

  const handleSessionSelect = (sessionId) => {
    setCurrentSessionId(sessionId);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(); // ✅ Key press doesn't pass the event to handleSend
    }
  };

  const currentSession = sessions.find(session => session.id === currentSessionId);

  return (
    <div className={`chatgpt-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        chats={sessions}
        currentChatId={currentSessionId}
        onChatSelect={handleSessionSelect}
        onNewChat={handleNewChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onDeleteChat={handleDeleteChat}
      />
      
      <div className="main-content">
        <ChatArea
          messages={messages}
          streamedText={streamedText}
          isStreaming={isStreaming}
          isTyping={isTyping}
          input={input}
          setInput={setInput}
          onSend={() => handleSend()} 
          onKeyPress={handleKeyPress}
          currentChat={currentSession}
          messagesEndRef={messagesEndRef}
        />
        
        {/* Error Card */}
        {error && (
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <div className="error-title">Something went wrong</div>
              <div className="error-message">{error}</div>
            </div>
            <button 
              className="retry-btn"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGPTLayout;