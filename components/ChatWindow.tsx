// components/ChatWindow.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
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
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
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
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) setIsDarkMode(savedTheme === "true");
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      sender: "user",
      message: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const conversationHistory = [...messages, userMessage].slice(-10);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.message,
          conversationHistory: conversationHistory.map((msg) => ({
            sender: msg.sender,
            message: msg.message,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      const reply = data.reply?.trim();

      if (!reply) {
        throw new Error("No reply from assistant.");
      }

      const botMessage: ChatMessage = {
        id: generateId(),
        sender: "assistant",
        message: reply,
        timestamp: new Date(),
      };

      const typingDelay = Math.min(Math.max(reply.length * 20, 1000), 3000);
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, typingDelay);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Unexpected error occurred.");
      const errorMessage: ChatMessage = {
        id: generateId(),
        sender: "assistant",
        message:
          "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const clearChat = () => setMessages([]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
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
    "Write a professional email",
  ];

  const recommendedPrompts = [
    "Summarize this article...",
    "Translate to French...",
    "Give me a workout plan",
    "Generate a resume bullet point",
    "Create a roadmap to learn Next.js",
    "Suggest a book to read this weekend",
  ];

  return (
    <div
      className={`relative h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Messages Section */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
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
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20"
                      : "bg-gradient-to-r from-emerald-500/10 to-blue-500/10"
                  }`}
                >
                  <SparklesIcon className="w-10 h-10 text-emerald-500" />
                </div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  How can I help you today?
                </h2>
                <p
                  className={`max-w-md mx-auto mb-8 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  I'm here to help with questions, creative projects, analysis,
                  and more.
                </p>

                {/* Suggested Prompts */}
                <div className="mb-6">
                  <h3
                    className={`text-sm mb-2 font-semibold ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Suggested
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {suggestedPrompts.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setInput(prompt)}
                        className={`p-4 rounded-xl border text-left transition-all hover:scale-105 ${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300"
                            : "bg-white/50 border-gray-200 hover:bg-white text-gray-700"
                        }`}
                      >
                        <p className="text-sm">{prompt}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Recommended Prompts */}
                <div>
                  <h3
                    className={`text-sm mb-2 font-semibold ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Recommended
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recommendedPrompts.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 + 0.3 }}
                        onClick={() => setInput(prompt)}
                        className={`p-4 rounded-xl border text-left transition-all hover:scale-105 ${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300"
                            : "bg-white/50 border-gray-200 hover:bg-white text-gray-700"
                        }`}
                      >
                        <p className="text-sm">{prompt}</p>
                      </motion.button>
                    ))}
                  </div>
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

          {isTyping && <TypingIndicator isDarkMode={isDarkMode} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className={`text-center text-sm px-4 py-2 ${
            isDarkMode ? "text-red-400" : "text-red-500"
          }`}
        >
          {error}
        </div>
      )}

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className={`fixed bottom-24 right-8 p-3 rounded-full shadow-lg z-20 ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-white hover:bg-gray-50 text-gray-900 border"
          }`}
        >
          <ArrowDownIcon className="w-5 h-5" />
        </motion.button>
      )}

      {/* Input Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`relative z-10 backdrop-blur-xl border-t p-4 ${
          isDarkMode
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                className={`w-full p-4 pr-12 rounded-2xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                }`}
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Message ChatGPT..."
                disabled={isTyping}
                rows={1}
                style={{ minHeight: "56px", maxHeight: "200px" }}
              />
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {input.length > 500 && `${input.length}/4000`}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </motion.button>
          </div>
          <div
            className={`flex justify-center items-center mt-2 text-xs ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <span>
              ChatGPT can make mistakes. Consider checking important
              information.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
