import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

/**
 * Realiza uma chamada à API ChatGPT com o histórico de conversas
 * @param {Array} conversation - Array contendo as mensagens da conversa
 * @param {Object} options - Opções adicionais como temperatura e max_tokens
 * @returns {Object} - Resposta da API do OpenAI
 */
export async function callChatGpt(conversation, options = {}) {
  if (!API_KEY) {
    throw new Error("Chave da API OpenAI não encontrada nas variáveis de ambiente");
  }
  
  const defaultOptions = {
    model: "gpt-3.5-turbo",
    max_tokens: 1500,
    temperature: 0.7
  };
  
  const payload = {
    ...defaultOptions,
    ...options,
    messages: conversation
  };
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload),
      timeout: 30000
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na chamada à API ChatGPT:", error);
    throw new Error(`Falha na chamada à API: ${error.message}`);
  }
}

/**
 * Gera um resumo do contexto fornecido
 * @param {string} context - Texto de contexto para resumir
 * @returns {string} - Texto resumido
 */
export async function summarizeContext(context) {
  if (!context || typeof context !== 'string' || context.trim() === '') {
    return '';
  }
  
  const prompt = [
    {
      role: "system",
      content: "Você é um assistente eficiente em resumir textos. Resuma o seguinte contexto de forma concisa, mantendo os pontos-chave e informações relevantes."
    },
    {
      role: "user",
      content: context
    }
  ];
  
  try {
    const response = await callChatGpt(prompt, { 
      max_tokens: 800,
      temperature: 0.3 
    });
    
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    }
    return context;
  } catch (error) {
    console.error("Erro ao resumir contexto:", error);
    return context;
  }
} 