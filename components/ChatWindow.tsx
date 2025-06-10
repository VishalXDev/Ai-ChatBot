// components/ChatWindow.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingDots } from "./TypingDots";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PaperAirplaneIcon, 
  TrashIcon, 
  SunIcon, 
  MoonIcon,
  BoltIcon,
  SparklesIcon,
  CpuChipIcon,
  ClipboardDocumentIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: Date;
}

export const ChatWindow = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { 
      id: generateId(),
      sender: "user", 
      message: input.trim(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.message }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: ChatMessage = { 
        id: generateId(),
        sender: "bot", 
        message: data.reply || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date()
      };

      // Simulate realistic typing delay based on message length
      const typingDelay = Math.min(Math.max(data.reply?.length * 20, 1000), 3000);
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, typingDelay);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: generateId(),
        sender: "bot",
        message: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about AI",
    "Help me debug this code",
    "Plan a healthy meal for today",
    "Explain the latest in technology",
    "Write a professional email"
  ];

  return (
    <div className={`relative h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`relative z-10 backdrop-blur-xl border-b p-4 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <CpuChipIcon className={`w-8 h-8 transition-colors ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold font-[Orbitron] transition-colors ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`}>
                ChatGPT
              </h1>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className={`transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isConnected ? 'GPT-3.5 Turbo' : 'Reconnecting...'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-600'
                  : 'bg-gray-100/50 hover:bg-gray-200/50 border-gray-300'
              }`}
            >
              {isDarkMode ? 
                <SunIcon className="w-5 h-5 text-yellow-400" /> : 
                <MoonIcon className="w-5 h-5 text-gray-600" />
              }
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-2 bg-red-100/50 hover:bg-red-200/50 rounded-lg border border-red-300 transition-colors"
            >
              <TrashIcon className="w-5 h-5 text-red-500" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20' 
                    : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10'
                }`}>
                  <SparklesIcon className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className={`text-3xl font-bold mb-2 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  How can I help you today?
                </h2>
                <p className={`max-w-md mx-auto mb-8 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  I'm here to help with questions, creative projects, analysis, and more.
                </p>
                
                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                  {suggestedPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setInput(prompt)}
                      className={`p-4 rounded-xl border text-left transition-all hover:scale-105 ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300'
                          : 'bg-white/50 border-gray-200 hover:bg-white text-gray-700'
                      }`}
                    >
                      <p className="text-sm">{prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              sender={msg.sender} 
              message={msg.message} 
              timestamp={msg.timestamp}
              isDarkMode={isDarkMode}
              onCopy={() => copyToClipboard(msg.message)}
            />
          ))}
          
          {isTyping && <TypingDots isDarkMode={isDarkMode} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className={`fixed bottom-24 right-8 p-3 rounded-full shadow-lg z-20 transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-900 border'
            }`}
          >
            <ArrowDownIcon className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`relative z-10 backdrop-blur-xl border-t p-4 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                className={`w-full p-4 pr-12 rounded-2xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  isDarkMode
                    ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                }`}
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Message ChatGPT..."
                disabled={isTyping}
                rows={1}
                style={{ minHeight: '56px', maxHeight: '200px' }}
              />
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {input.length > 500 && `${input.length}/4000`}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Footer */}
          <div className={`flex justify-center items-center mt-2 text-xs transition-colors ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <span>ChatGPT can make mistakes. Consider checking important information.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};