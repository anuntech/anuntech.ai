import React from "react";
import { CodeBlock } from "@/components/chat/code-block";

// Função para escapar caracteres HTML
export function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Função para converter texto bruto com marcações do ChatGPT para componentes React
export function formatMessage(text) {
  if (!text) return null;

  // Dividir o texto em partes: código e não-código
  const parts = [];
  let lastIndex = 0;
  const codeBlockRegex = /```([\w]*)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Adicionar texto antes do bloco de código
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex, match.index)
      });
    }
    
    // Adicionar o bloco de código
    parts.push({
      type: "code",
      language: match[1].trim(),
      content: match[2].trim()
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Adicionar o texto restante após o último bloco de código
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(lastIndex)
    });
  }
  
  // Processar cada parte
  return parts.map((part, index) => {
    if (part.type === "code") {
      return <CodeBlock key={index} code={part.content} language={part.language} />;
    } else {
      // Processar texto com Markdown simples
      const formattedText = part.content
        // Negrito
        .replace(/\*\*(.*?)\*\*/g, "<strong style='color:inherit'>$1</strong>")
        // Itálico
        .replace(/\*(.*?)\*/g, "<em style='color:inherit'>$1</em>")
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline" style="color:inherit">$1</a>')
        // Listas
        .replace(/^\s*-\s+(.*)/gm, "<li style='color:inherit'>$1</li>")
        .replace(/(<li.*<\/li>)/gs, "<ul class='list-disc pl-6 my-2' style='color:inherit'>$1</ul>")
        // Quebras de linha
        .replace(/\n/g, "<br />");
      
      return (
        <div
          key={index}
          className="prose prose-sm max-w-none"
          style={{ color: "inherit", "--tw-prose-body": "inherit", "--tw-prose-headings": "inherit", "--tw-prose-lead": "inherit", "--tw-prose-links": "inherit", "--tw-prose-bold": "inherit", "--tw-prose-counters": "inherit", "--tw-prose-bullets": "inherit", "--tw-prose-hr": "inherit", "--tw-prose-quotes": "inherit", "--tw-prose-quote-borders": "inherit", "--tw-prose-captions": "inherit", "--tw-prose-code": "inherit", "--tw-prose-pre-code": "inherit", "--tw-prose-pre-bg": "inherit", "--tw-prose-th-borders": "inherit", "--tw-prose-td-borders": "inherit" }}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    }
  });
} 