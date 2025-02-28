"use client";

import React from "react";
import { BrainIcon } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="group relative mb-0">
      <div className="flex items-center mb-1">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#041E40]">
          <BrainIcon className="h-4 w-4 text-[#E3E767]" />
        </div>
        <div className="ml-2 text-sm font-medium">Anuntech Ai</div>
      </div>
      
      <div className="inline-block max-w-[85%] rounded-2xl px-6 py-3 text-left bg-gray-100">
        <div className="typing-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
} 