import React from "react";
import { CpuChipIcon } from "@heroicons/react/24/outline";

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-6 animate-fadeIn">
      <div className="max-w-[85%] md:max-w-[70%] flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-light)]">
          <CpuChipIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        </div>

        {/* Typing Content */}
        <div className="flex flex-col items-start">
          {/* Sender label */}
          <div className="text-xs text-[var(--text-muted)] mb-1">
            AI Assistant
          </div>
          
          {/* Typing indicator */}
          <div className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[var(--text-secondary)]">
                Thinking
              </span>
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-typing"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
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