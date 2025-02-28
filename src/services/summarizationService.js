// src/services/summarizationService.js
import fetch from "node-fetch"; 
import dotenv from "dotenv";
dotenv.config();

/**
 * Recebe um texto longo e retorna um resumo conciso usando a API da OpenAI.
 * Caso ocorra erro, retorna o próprio texto original.
 * 
 * @param {string} contextText - Texto a ser resumido.
 * @returns {string} - Resumo gerado.
 */
export async function summarizeContext(contextText) {
  const API_KEY = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente que resume textos longos de forma concisa." },
        { role: "user", content: `Resuma o seguinte texto de forma concisa:\n\n${contextText}` }
      ],
      max_tokens: 300,
      temperature: 0.5
    })
  });
  const data = await response.json();
  if (data.error) {
    console.error("Erro ao resumir:", data.error);
    return contextText; // Retorna o texto original se houver erro na sumarização
  }
  return data.choices[0].message.content.trim();
}
