import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  UserIcon,
  CpuChipIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MessageBubbleProps {
  sender: "user" | "bot" | "assistant";
  message: string;
  timestamp: Date;
  isDarkMode: boolean;
  onCopy: () => void;
  senderLabel?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  message,
  timestamp,
  isDarkMode,
  onCopy,
  senderLabel,
}) => {
  const isUser = sender === "user";

  const formattedTime = useMemo(
    () => timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [timestamp]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3 group`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isUser
              ? "bg-emerald-500 text-white shadow-lg"
              : isDarkMode
              ? "bg-gray-800 border border-gray-600 text-gray-300"
              : "bg-white border border-gray-200 text-gray-600 shadow-sm"
          }`}
        >
          {isUser ? (
            <UserIcon className="w-4 h-4" />
          ) : (
            <CpuChipIcon className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`flex flex-col ${
            isUser ? "items-end" : "items-start"
          } w-full`}
        >
          {/* Sender label */}
          <div
            className={`text-xs mb-1 transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isUser ? "You" : senderLabel ?? "ChatGPT"}
          </div>

          {/* Message Container */}
          <div className="relative w-full">
            <div
              className={`px-4 py-3 rounded-2xl transition-all ${
                isUser
                  ? "bg-emerald-500 text-white shadow-lg"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-white text-gray-900 border border-gray-200 shadow-sm"
              } ${isUser ? "rounded-br-md" : "rounded-bl-md"}`}
            >
              <div
                className={`prose prose-sm dark:prose-invert max-w-none ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");

                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            overflowX: "auto",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message}
                </ReactMarkdown>
              </div>
            </div>

            {/* Copy button for bot messages */}
            {!isUser && (
              <button
                className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                onClick={onCopy}
                title="Copy message"
                aria-label="Copy message to clipboard"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs mt-1 transition-colors ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
