// components/TypingDots.tsx
import React from "react";
import { motion } from "framer-motion";

export const TypingDots = () => {
  return (
    <div className="flex space-x-1 px-4 py-2 bg-gray-800 rounded-2xl w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-purple-400 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};
