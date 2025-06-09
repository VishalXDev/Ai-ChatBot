// components/MessageBubble.tsx
import React from "react";

interface MessageBubbleProps {
  sender: "user" | "bot";
  message: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message }) => {
  const isUser = sender === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm md:text-base shadow-xl transition-all
        ${isUser ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-800 text-purple-300 rounded-bl-none"}`}
      >
        {message}
      </div>
    </div>
  );
};
