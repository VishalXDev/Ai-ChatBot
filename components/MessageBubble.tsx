// components/MessageBubble.tsx
import React from "react";
import { motion } from "framer-motion";
import { UserIcon, CpuChipIcon } from "@heroicons/react/24/outline";

interface MessageBubbleProps {
  sender: "user" | "bot";
  message: string;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message, timestamp }) => {
  const isUser = sender === "user";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div className={`max-w-xs md:max-w-2xl flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start space-x-3 ${isUser ? "space-x-reverse" : ""}`}>
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            isUser 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400/50" 
              : "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400/50"
          } shadow-lg`}
        >
          {isUser ? (
            <UserIcon className="w-5 h-5 text-white" />
          ) : (
            <CpuChipIcon className="w-5 h-5 text-white" />
          )}
        </motion.div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          {/* Message Bubble */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`relative px-6 py-4 rounded-2xl shadow-xl backdrop-blur-sm border transition-all group hover:shadow-2xl ${
              isUser
                ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 border-purple-400/30 text-white rounded-br-md"
                : "bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-cyan-400/30 text-cyan-50 rounded-bl-md"
            }`}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isUser 
                ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"
                : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl"
            }`} />
            
            {/* Message text */}
            <div className="relative z-10">
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                {message}
              </p>
            </div>

            {/* Message tail */}
            <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
              isUser 
                ? "-right-1 bg-gradient-to-br from-purple-600 to-pink-600"
                : "-left-1 bg-gradient-to-br from-gray-800 to-gray-900"
            }`} />
          </motion.div>

          {/* Timestamp */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`mt-1 px-2 text-xs text-gray-400 ${isUser ? "text-right" : "text-left"}`}
          >
            {formatTime(timestamp)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};