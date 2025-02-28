"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatMessage } from "@/lib/format-message";
import { BrainIcon, UserIcon } from "lucide-react";

export function ChatMessage({ message, isUser }) {
  return (
    <div className={cn(
      "group relative mb-4 last:mb-0",
      isUser ? "text-right" : ""
    )}>
      {!isUser && (
        <div className="flex items-center mb-1">
          <div 
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#041E40]"
          >
            <BrainIcon className="h-4 w-4 text-[#E3E767]" />
          </div>
          <div className="ml-2 text-sm font-medium">Anuntech Ai</div>
        </div>
      )}
      
      <div className={cn(
        "inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left",
        isUser 
          ? "bg-[#041E40] text-white" 
          : "bg-gray-100 text-gray-900"
      )}>
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "text-white" : "text-gray-900"
        )}>
          {typeof message === "string" ? formatMessage(message) : message}
        </div>
      </div>
      
      {isUser && (
        <div className="flex items-center justify-end mt-1">
          <div className="mr-2 text-sm font-medium">Você</div>
          <div 
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#041E40]"
          >
            <UserIcon className="h-4 w-4 text-[#E3E767]" />
          </div>
        </div>
      )}
    </div>
  );
} 