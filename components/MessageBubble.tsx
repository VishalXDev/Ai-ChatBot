// components/MessageBubble.tsx
import React from "react";
import { motion } from "framer-motion";
import { UserIcon, CpuChipIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

interface MessageBubbleProps {
  sender: "user" | "bot";
  message: string;
  timestamp: Date;
  isDarkMode: boolean;
  onCopy: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  sender, 
  message, 
  timestamp, 
  isDarkMode,
  onCopy 
}) => {
  const isUser = sender === "user";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[85%] md:max-w-[70%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 group`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isUser 
            ? 'bg-emerald-500 text-white shadow-lg' 
            : isDarkMode
              ? 'bg-gray-800 border border-gray-600 text-gray-300'
              : 'bg-white border border-gray-200 text-gray-600 shadow-sm'
        }`}>
          {isUser ? (
            <UserIcon className="w-4 h-4" />
          ) : (
            <CpuChipIcon className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
          {/* Sender label */}
          <div className={`text-xs mb-1 transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {isUser ? 'You' : 'ChatGPT'}
          </div>
          
          {/* Message Container */}
          <div className="relative w-full">
            {/* Message */}
            <div className={`px-4 py-3 rounded-2xl transition-all ${
              isUser
                ? 'bg-emerald-500 text-white shadow-lg'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-100 border border-gray-700'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
            } ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message}
              </div>
            </div>

            {/* Copy button for bot messages */}
            {!isUser && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all group-hover:opacity-100 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                onClick={onCopy}
                title="Copy message"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-1 transition-colors ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};