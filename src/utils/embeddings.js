import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

/**
 * Função para gerar o embedding de uma query ou documento usando a API da OpenAI.
 * @param {string} text - Texto a ser transformado em embedding.
 * @returns {Array} - Vetor de embedding.
 */
export async function getEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error("Texto inválido para geração de embedding");
  }
  
  if (!API_KEY) {
    throw new Error("Chave da API OpenAI não encontrada nas variáveis de ambiente");
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-ada-002"
      }),
      timeout: 30000
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      throw new Error("Resposta da API não contém embedding válido");
    }
    
    return data.data[0].embedding;
  } catch (error) {
    console.error("Erro ao gerar embedding:", error);
    throw new Error(`Falha ao gerar embedding: ${error.message}`);
  }
}

/**
 * Função para dividir um texto em chunks menores.
 * @param {string} text - Texto completo.
 * @param {number} maxLength - Tamanho máximo de cada chunk (em número de caracteres).
 * @returns {Array} - Array de chunks.
 */
export function chunkText(text, maxLength = 500) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const paragraphs = text.split("\n\n");
  const chunks = [];
  let currentChunk = "";
  
  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxLength) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += currentChunk ? "\n\n" + para : para;
    }
  }
  
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
} 