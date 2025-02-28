// src/routes/chatRoutes.js
import express from "express";
import { getEmbedding } from "../utils/embeddings.js";
import { getRelevantDocuments } from "../services/documentService.js";
import { callChatGpt, summarizeContext } from "../services/openaiService.js";

const router = express.Router();
const MAX_CONTEXT_LENGTH = 2000;

/**
 * Endpoint de chat que integra o RAG com resumo do contexto se necessário.
 */
router.post("/chat", async (req, res) => {
  try {
    const { conversation } = req.body;
    
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: "Histórico da conversa inválido ou vazio" });
    }

    const lastUserMessage = conversation.filter(msg => msg.role === "user").pop();
    
    if (!lastUserMessage) {
      return res.status(400).json({ error: "Nenhuma mensagem do usuário encontrada" });
    }

    const queryEmbedding = await getEmbedding(lastUserMessage.content);
    const relevantDocs = await getRelevantDocuments(queryEmbedding, 3);
    let contextText = relevantDocs.map(doc => doc.text).join("\n\n---\n\n");

    if (contextText.length > MAX_CONTEXT_LENGTH) {
      contextText = await summarizeContext(contextText);
    }

    const conversationWithContext = [...conversation];
    
    if (contextText.trim() !== "") {
      conversationWithContext.unshift({
        role: "system",
        content: `Utilize as seguintes informações do contexto para responder de forma fundamentada:\n\n${contextText}`
      });
    } else {
      conversationWithContext.unshift({
        role: "system",
        content: "Você é um assistente da Anuntech, projetado para ajudar com dúvidas e informações sobre nossos produtos e serviços. Responda de forma simples e direta, sempre buscando ser útil. Use as informações do nosso banco de dados para garantir que suas respostas sejam precisas e atualizadas. Se não souber a resposta, basta dizer que não tem essa informação agora e sugerir que o usuário entre em contato com nosso suporte."
      });
    }

    const responseData = await callChatGpt(conversationWithContext);
    res.json(responseData);
  } catch (err) {
    console.error("Erro no endpoint /chat:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 