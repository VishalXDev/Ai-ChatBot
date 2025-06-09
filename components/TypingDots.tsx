// components/TypingDots.tsx
import React from "react";
import { motion } from "framer-motion";
import { CpuChipIcon } from "@heroicons/react/24/outline";

export const TypingDots = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex justify-start mb-6"
    >
      <div className="max-w-xs md:max-w-2xl flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-cyan-400/50 shadow-lg">
          <CpuChipIcon className="w-5 h-5 text-white" />
        </div>

        {/* Typing indicator */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-2xl rounded-bl-md shadow-xl"
          >
            {/* Pulsing glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl animate-pulse" />
            
            {/* Typing dots */}
            <div className="relative z-10 flex items-center space-x-2">
              <span className="text-cyan-300 text-sm font-medium">NEXUS is thinking</span>
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
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

            {/* Neural network visualization */}
            <div className="absolute -top-1 -right-1 w-4 h-4">
              <motion.div
                className="w-full h-full border border-cyan-400/40 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Message tail */}
          <div className="absolute top-4 -left-1 w-3 h-3 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-45" />
        </div>
      </div>
    </motion.div>
  );
};