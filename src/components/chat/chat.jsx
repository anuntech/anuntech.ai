"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { ChatForm } from "./chat-form";
import { TypingIndicator } from "./typing-indicator";
import { BrainIcon } from "lucide-react";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Carregar mensagens do localStorage ao iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    }
  }, []);

  // Salvar mensagens no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (message) => {
    // Adicionar mensagem do usuário
    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    
    // Mostrar indicador de digitação
    setIsTyping(true);
    
    try {
      // Enviar mensagem para a API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          conversation: messages.map(m => ({
            role: m.isUser ? "user" : "assistant",
            content: m.content
          })).concat([{ role: "user", content: message }])
        })
      });
      
      const data = await response.json();
      setIsTyping(false);
      
      if (data.choices && data.choices.length > 0) {
        const aiMessage = data.choices[0].message.content.trim();
        setMessages((prev) => [...prev, { content: aiMessage, isUser: false }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { content: `Erro: ${data.error}`, isUser: false }]);
      } else {
        setMessages((prev) => [...prev, { content: "Nenhuma resposta recebida.", isUser: false }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { content: "Erro ao conectar com a API.", isUser: false }]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto w-full"
      >
        <div className="mx-auto w-full max-w-3xl px-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[calc(100vh-120px)] flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#041E40] mb-6">
                  <BrainIcon className="h-8 w-8 text-[#E3E767]" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Bem-vindo a Anuntech Ai</h2>
                <p className="text-xl text-gray-600 max-w-md">
                  Como posso ajudar você hoje? Estou aqui para responder suas perguntas.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.content}
                  isUser={msg.isUser}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>
      </div>
      
      <ChatForm onSubmit={handleSubmit} disabled={isTyping} />
    </div>
  );
} 