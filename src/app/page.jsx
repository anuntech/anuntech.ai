"use client";

import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="flex h-full w-full">
        <Chat />
      </div>
    </main>
  );
} 