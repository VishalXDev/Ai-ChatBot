// components/ChatWindow.tsx
"use client";

import React, { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingDots } from "./TypingDots";

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

export const ChatWindow = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", message: input };
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
      const botMessage: ChatMessage = { sender: "bot", message: data.reply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col p-4">
      <div className="flex-grow overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-purple-700">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} message={msg.message} />
        ))}
        {isTyping && <TypingDots />}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 p-2 rounded-lg bg-gray-900 border border-purple-600 text-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};
