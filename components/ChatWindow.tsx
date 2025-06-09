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
  CpuChipIcon
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      message: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = { 
        id: generateId(),
        sender: "bot", 
        message: data.reply,
        timestamp: new Date()
      };

      // Simulate realistic typing delay
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: generateId(),
        sender: "bot",
        message: "⚠️ Connection lost. Attempting to reconnect...",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-cyan-500/30 p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <CpuChipIcon className="w-8 h-8 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-[Orbitron]">
                NEXUS AI
              </h1>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-gray-400">
                  {isConnected ? 'Neural Network Active' : 'Reconnecting...'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-cyan-500/30 transition-colors"
            >
              {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-purple-400" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-2 bg-red-900/30 hover:bg-red-800/50 rounded-lg border border-red-500/30 transition-colors"
            >
              <TrashIcon className="w-5 h-5 text-red-400" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full mb-6">
                  <SparklesIcon className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
                  Welcome to NEXUS AI
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Your advanced AI companion is ready. Ask me anything - from complex questions to creative challenges.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                  {[
                    { icon: BoltIcon, text: "Lightning-fast responses", color: "from-yellow-400 to-orange-400" },
                    { icon: CpuChipIcon, text: "Advanced reasoning", color: "from-cyan-400 to-blue-400" },
                    { icon: SparklesIcon, text: "Creative solutions", color: "from-purple-400 to-pink-400" }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                    >
                      <feature.icon className={`w-6 h-6 mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                      <p className="text-sm text-gray-300">{feature.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} sender={msg.sender} message={msg.message} timestamp={msg.timestamp} />
          ))}
          
          {isTyping && <TypingDots />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-cyan-500/30 p-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                className="w-full p-4 pr-12 bg-white/5 border border-cyan-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your message... (Press Enter to send)"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {input.length}/1000
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="p-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-cyan-500/25"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Stats */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{messages.length} messages</span>
            <span>Made by Vishal Dwivedy 🚀</span>
            <span>Powered by GPT</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};