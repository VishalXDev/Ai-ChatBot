import React from "react";
import { UserIcon, CpuChipIcon } from "@heroicons/react/24/outline";

interface MessageBubbleProps {
  sender: "user" | "assistant";
  message: string;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message, timestamp }) => {
  const isUser = sender === "user";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-[var(--user-bg)] text-white' 
            : 'bg-[var(--bg-secondary)] border border-[var(--border-light)]'
        }`}>
          {isUser ? (
            <UserIcon className="w-4 h-4" />
          ) : (
            <CpuChipIcon className="w-4 h-4 text-[var(--text-secondary)]" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Sender label */}
          <div className="text-xs text-[var(--text-muted)] mb-1">
            {isUser ? 'You' : 'AI Assistant'}
          </div>
          
          {/* Message */}
          <div className={`px-4 py-3 rounded-2xl max-w-none ${
            isUser
              ? 'bg-[var(--user-bg)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)]'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message}
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-[var(--text-muted)] mt-1">
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};