// src/services/documentService.js
import { findSimilarDocuments } from "../models/document.js";

/**
 * Obtém documentos relevantes com base em um embedding de consulta
 * @param {Array} queryEmbedding - Embedding da consulta
 * @param {number} limit - Número máximo de documentos a retornar
 * @param {number} minSimilarity - Limite mínimo de similaridade para considerar um documento relevante
 * @returns {Array} - Array de documentos relevantes
 */
export async function getRelevantDocuments(queryEmbedding, limit = 3, minSimilarity = 0.7) {
  if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
    throw new Error("Embedding de consulta inválido");
  }
  
  try {
    const documents = await findSimilarDocuments(queryEmbedding, limit);
    
    if (!documents || documents.length === 0) {
      return [];
    }
    
    const relevantDocs = documents.filter(doc => doc.similarity >= minSimilarity);
    
    return relevantDocs.length > 0 ? relevantDocs : documents;
  } catch (error) {
    console.error("Erro ao obter documentos relevantes:", error);
    return [];
  }
}
  
