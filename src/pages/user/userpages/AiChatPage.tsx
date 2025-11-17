import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Lightbulb, Sparkles, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react';
import UserLayout from '../../../layouts/UserLayout';
import { aiAuthService } from '../../../service/AiService';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  isComplete: boolean;
  suggestions?: string[];
  relatedTopics?: string[];
  codeExamples?: string[];
}

const AiChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
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
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const lastScrollTop = useRef(0);

  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop } = messagesContainerRef.current;
    
    // User scrolled up
    if (scrollTop < lastScrollTop.current) {
      userScrolledUp.current = true;
    }
    
    // User scrolled to bottom
    if (isUserAtBottom()) {
      userScrolledUp.current = false;
    }
    
    lastScrollTop.current = scrollTop;
  };

  // Auto-scroll during streaming if user hasn't scrolled up
  useEffect(() => {
    if (streamingMessageId && !userScrolledUp.current) {
      scrollToBottom('auto'); // Use 'auto' for instant scroll during streaming
    }
  }, [messages, streamingMessageId]);

  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const streamText = (fullText: string, messageId: number, additionalData = {}) => {
    let currentIndex = 0;
    const typingSpeed = 5; 

    setStreamingMessageId(messageId);
    userScrolledUp.current = false; // Reset scroll lock when starting new stream

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
        // Streaming complete
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
        }
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

    const userMessage: Message = {
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

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Create placeholder message for AI response
    const aiMessageId = Date.now() + 1;
    const placeholderMessage: Message = {
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

        // Start streaming the response
        streamText(fullResponse, aiMessageId, additionalData);
      } else {
        throw new Error(response.error?.userMessage || 'Failed to get response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      
      // Remove placeholder and add error message
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
      
      const errorMsg: Message = {
        id: Date.now() + 2,
        type: 'ai',
        content: "❌ Sorry, I encountered an error. Please try again or rephrase your question.",
        timestamp: new Date().toISOString(),
        isComplete: true
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleCopyCode = (content: string, messageId: string | number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { icon: <Code className="w-4 h-4" />, text: "Explain binary search algorithm" },
    { icon: <Lightbulb className="w-4 h-4" />, text: "How to approach dynamic programming?" },
    { icon: <Sparkles className="w-4 h-4" />, text: "What are data structures?" }
  ];

  const renderMessageContent = (message: Message) => {
    const isStreaming = message.id === streamingMessageId;
    
    return (
      <div className="space-y-3">
        <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse"></span>
          )}
        </div>

        {/* Additional content only shown when message is complete */}
        {message.isComplete && (
          <>
            {/* Code Examples */}
            {message.codeExamples && message.codeExamples.length > 0 && (
              <div className="space-y-2 mt-4">
                {message.codeExamples.map((code, index) => (
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

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400 font-semibold">💡 Suggestions:</p>
                <ul className="space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Topics */}
            {message.relatedTopics && message.relatedTopics.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 font-semibold mb-2">🔗 Related Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {message.relatedTopics.map((topic, index) => (
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

            {/* Copy button for AI messages */}
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
        <div className="bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 border border-slate-600/40 rounded-2xl p-5 mb-4 flex items-center justify-between shadow-lg shadow-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Coding Tutor</h1>
              <p className="text-xs text-gray-400">Your personal programming assistant</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 rounded-lg transition-all duration-200 text-gray-300 text-sm hover:shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-start space-x-2 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 border border-slate-600/40 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 space-y-6"
            style={{ overflowAnchor: 'auto' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-3xl ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                      message.type === 'ai'
                        ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600'
                        : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    }`}
                  >
                    {message.type === 'ai' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 shadow-lg ${
                      message.type === 'ai'
                        ? 'bg-slate-700/70 border border-slate-600/40 backdrop-blur-sm'
                        : 'bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-blue-600/50 border border-blue-500/40 backdrop-blur-sm'
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && !streamingMessageId && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-700/70 border border-slate-600/40 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
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

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-6 pb-4 border-t border-slate-600/30 pt-4">
              <p className="text-sm text-gray-400 mb-3 font-medium">✨ Quick start:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt.text)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/40 rounded-xl transition-all duration-200 text-sm text-gray-300 hover:shadow-md hover:scale-105"
                  >
                    {prompt.icon}
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-600/40 p-4 bg-slate-800/30 backdrop-blur-sm">
            <div className="flex items-end space-x-3">
              <div className="flex-1 bg-slate-700/60 border border-slate-600/40 rounded-xl focus-within:border-blue-500/60 focus-within:shadow-lg focus-within:shadow-blue-500/20 transition-all duration-200">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about coding, algorithms, or problem-solving..."
                  className="w-full bg-transparent text-gray-200 placeholder-gray-500 p-4 resize-none focus:outline-none max-h-32"
                  rows={1}
                  disabled={isTyping}
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50 hover:scale-105'
                    : 'bg-slate-600/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </UserLayout>
  );
};

export default AiChatPage;