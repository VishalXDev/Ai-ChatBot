import React from "react";
import { CpuChipIcon } from "@heroicons/react/24/outline";

interface TypingIndicatorProps {
  isDarkMode: boolean;
}

export const TypingIndicator = ({ isDarkMode }: TypingIndicatorProps) => {
  return (
    <div className="flex justify-start mb-6 animate-fadeIn">
      <div className="max-w-[85%] md:max-w-[70%] flex items-start gap-3">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm
          ${isDarkMode 
            ? "bg-gray-800 text-gray-300 border border-gray-600" 
            : "bg-white text-gray-600 border border-gray-200"
          }`}>
          <CpuChipIcon className="w-4 h-4" />
        </div>

        {/* Typing Content */}
        <div className="flex flex-col items-start w-full">
          {/* Sender label */}
          <div className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            ChatGPT
          </div>

          {/* Typing bubble */}
          <div className={`px-4 py-3 border rounded-2xl rounded-bl-md
            ${isDarkMode 
              ? "bg-gray-800 text-gray-100 border-gray-700" 
              : "bg-white text-gray-900 border-gray-200"
            }`}>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Thinking</span>
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full animate-typing 
                      ${isDarkMode ? "bg-gray-500" : "bg-gray-400"}`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
