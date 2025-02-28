"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon } from "lucide-react";

export function ChatForm({ onSubmit, disabled }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSubmit(message);
    setMessage("");
  };

  return (
    <div className="w-full bg-white py-3">
      <div className="mx-auto max-w-3xl px-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <div className="relative flex items-center w-full overflow-hidden rounded-2xl border shadow-sm">
            <Input
              type="text"
              placeholder="Escreva sua mensagem aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 py-5 px-4"
            />
            
            <div className="flex items-center gap-2 pr-2">
              {message.trim() && (
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={disabled || !message.trim()}
                  className="h-9 w-9 rounded-xl bg-[#041E40] hover:bg-[#0a2d5c] transition-colors"
                >
                  <ArrowUpIcon className="h-5 w-5 text-white" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 