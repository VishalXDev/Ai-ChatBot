// components/TypingDots.tsx
import React from "react";
import { motion } from "framer-motion";
import { CpuChipIcon } from "@heroicons/react/24/outline";

interface TypingDotsProps {
  isDarkMode: boolean;
}

export const TypingDots: React.FC<TypingDotsProps> = ({ isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-[85%] md:max-w-[70%] flex items-start gap-3">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isDarkMode
            ? 'bg-gray-800 border border-gray-600 text-gray-300'
            : 'bg-white border border-gray-200 text-gray-600 shadow-sm'
        }`}>
          <CpuChipIcon className="w-4 h-4" />
        </div>

        {/* Typing Content */}
        <div className="flex flex-col items-start">
          {/* Sender label */}
          <div className={`text-xs mb-1 transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            ChatGPT
          </div>
          
          {/* Typing indicator */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-4 py-3 rounded-2xl rounded-bl-md transition-all ${
              isDarkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};