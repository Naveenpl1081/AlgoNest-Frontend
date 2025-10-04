import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Lightbulb, Sparkles, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react';
import UserLayout from '../../../layouts/UserLayout';
import { aiAuthService } from '../../../service/AiService';

const AiChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI coding tutor. I'm here to help you with:\n• Understanding algorithms and data structures\n• Building problem-solving logic\n• Debugging and code optimization\n• Explaining coding concepts\n\nWhat would you like to learn today?",
      timestamp: new Date().toISOString(),
      isComplete: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState(null);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  const messagesContainerRef = useRef(null);
  const userScrolledUp = useRef(false);
  const lastScrollTop = useRef(0);

  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop } = messagesContainerRef.current;
    
 
    if (scrollTop < lastScrollTop.current) {
      userScrolledUp.current = true;
    }
    
  
    if (isUserAtBottom()) {
      userScrolledUp.current = false;
    }
    
    lastScrollTop.current = scrollTop;
  };

  useEffect(() => {
    
    if (!userScrolledUp.current && isUserAtBottom()) {
      scrollToBottom();
    }
  }, [messages]);


  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const streamText = (fullText:any, messageId:any, additionalData = {}) => {
    let currentIndex = 0;
    const typingSpeed = 5; 

    setStreamingMessageId(messageId);

    streamingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        const chunk = fullText.slice(0, currentIndex + 1);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: chunk, isComplete: false }
              : msg
          )
        );
        
        currentIndex++;
      } else {
       
        clearInterval(streamingIntervalRef.current);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  content: fullText, 
                  isComplete: true,
                  ...additionalData 
                }
              : msg
          )
        );
        setStreamingMessageId(null);
        setIsTyping(false);
      }
    }, typingSpeed);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      isComplete: true
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setError(null);
    userScrolledUp.current = false; 

 
    const aiMessageId = Date.now() + 1;
    const placeholderMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date().toISOString(),
      isComplete: false
    };
    
    setMessages(prev => [...prev, placeholderMessage]);

    try {
      const conversationHistory = messages
        .filter(msg => msg.isComplete && (msg.type !== 'ai' || msg.id !== 1))
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      const response = await aiAuthService.getAiAnswers({
        message: currentMessage,
        conversationHistory,
        language: 'general',
        topic: undefined
      });

      if (response.success) {
        const fullResponse = response.data.response;
        const additionalData = {
          suggestions: response.data.suggestions,
          relatedTopics: response.data.relatedTopics,
          codeExamples: response.data.codeExamples,
        };

       
        streamText(fullResponse, aiMessageId, additionalData);
      } else {
        throw new Error(response.error?.userMessage || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      
      // Remove placeholder and add error message
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
      
      const errorMessage = {
        id: Date.now() + 2,
        type: 'ai',
        content: "❌ Sorry, I encountered an error. Please try again or rephrase your question.",
        timestamp: new Date().toISOString(),
        isComplete: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    userScrolledUp.current = false;
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Chat cleared! How can I assist you with coding today?",
        timestamp: new Date().toISOString(),
        isComplete: true
      }
    ]);
    setError(null);
    setIsTyping(false);
    setStreamingMessageId(null);
  };

  const handleCopyCode = (content, messageId) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { icon: <Code className="w-4 h-4" />, text: "Explain binary search algorithm" },
    { icon: <Lightbulb className="w-4 h-4" />, text: "How to approach dynamic programming?" },
    { icon: <Sparkles className="w-4 h-4" />, text: "What are data structures?" }
  ];

  const renderMessageContent = (message:any) => {
    const isStreaming = message.id === streamingMessageId;
    
    return (
      <div className="space-y-3">
        <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse"></span>
          )}
        </div>

     
        {message.isComplete && (
          <>
           
            {message.codeExamples && message.codeExamples.length > 0 && (
              <div className="space-y-2 mt-4">
                {message.codeExamples.map((code:any, index:any) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                    <button
                      onClick={() => handleCopyCode(code, `${message.id}-code-${index}`)}
                      className="mt-2 flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {copiedId === `${message.id}-code-${index}` ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

           
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400 font-semibold">💡 Suggestions:</p>
                <ul className="space-y-1">
                  {message.suggestions.map((suggestion:any, index:any) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

      
            {message.relatedTopics && message.relatedTopics.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 font-semibold mb-2">🔗 Related Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {message.relatedTopics.map((topic:any, index:any) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

        
            {message.type === 'ai' && (
              <button
                onClick={() => handleCopyCode(message.content, message.id)}
                className="mt-3 flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                {copiedId === message.id ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy response</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="bg-slate-700/40 border border-slate-600/30 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Coding Tutor</h1>
              <p className="text-xs text-gray-400">Your personal programming assistant</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 rounded-lg transition-colors text-gray-300 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>

       
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

      
        <div className="flex-1 bg-slate-700/20 border border-slate-600/30 rounded-2xl overflow-hidden flex flex-col">
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-3xl ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                 
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.type === 'ai'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-slate-600'
                    }`}
                  >
                    {message.type === 'ai' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>

                 
                  <div
                    className={`rounded-2xl p-4 ${
                      message.type === 'ai'
                        ? 'bg-slate-700/60 border border-slate-600/30'
                        : 'bg-gradient-to-r from-blue-600/40 to-purple-600/40 border border-blue-500/30'
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                </div>
              </div>
            ))}

           
            {isTyping && !streamingMessageId && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-700/60 border border-slate-600/30 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

     
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-400 mb-3">Quick start:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt.text)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/30 rounded-lg transition-colors text-sm text-gray-300"
                  >
                    {prompt.icon}
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

         
          <div className="border-t border-slate-600/30 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1 bg-slate-700/60 border border-slate-600/30 rounded-xl focus-within:border-blue-500/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about coding, algorithms, or problem-solving..."
                  className="w-full bg-transparent text-gray-200 placeholder-gray-500 p-4 resize-none focus:outline-none max-h-32"
                  rows="1"
                  disabled={isTyping}
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/50'
                    : 'bg-slate-600/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AiChatPage;