// components/MessageBubble.tsx
import React from "react";
import { ClipboardIcon, CpuChipIcon, UserIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isDarkMode: boolean;
  timestamp?: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  isDarkMode,
  timestamp,
}) => {
  const isUser = role === "user";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
  };

  // Function to escape HTML characters
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const escapedContent = escapeHtml(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm ${
            isDarkMode
              ? "border-gray-700"
              : "border-gray-200 shadow-sm bg-white text-gray-600"
          }`}
        >
          {isUser ? (
            <UserIcon className="w-4 h-4" />
          ) : (
            <CpuChipIcon className="w-4 h-4" />
          )}
        </div>

        {/* Message bubble */}
        <div className="flex flex-col items-start gap-1">
          {/* Sender name and timestamp */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {isUser ? "You" : "ChatGPT"}
            </span>
            {timestamp && (
              <span className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Message content */}
          <div
            className={`whitespace-pre-wrap px-4 py-3 rounded-2xl transition-all relative group ${
              isUser
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-gray-800"
                : isDarkMode
                ? "bg-gray-800 border border-gray-700 text-gray-100"
                : "bg-white border border-gray-200 text-gray-800 shadow-sm"
            }`}
          >
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => (
                  <p className="prose dark:prose-invert prose-sm max-w-none" {...props} />
                ),
              }}
            >
              {escapedContent}
            </ReactMarkdown>

            {/* Copy button */}
            {!isUser && (
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-300/20 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <ClipboardIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};