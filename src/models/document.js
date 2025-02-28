// src/models/document.js
import pool from "../../config/db.js";

/**
 * Insere um documento e seu embedding no banco de dados
 * @param {string} text - Texto do documento
 * @param {Array} embedding - Vetor de embedding
 * @returns {Object} - Resultado da inserção
 */
export async function insertDocument(text, embedding) {
  if (!text || !embedding || !Array.isArray(embedding)) {
    throw new Error("Texto ou embedding inválidos");
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO documents (text, embedding) VALUES (?, ?)",
      [text, JSON.stringify(embedding)]
    );
    return result;
  } catch (error) {
    console.error("Erro ao inserir documento:", error);
    throw new Error(`Falha ao inserir documento: ${error.message}`);
  }
}

/**
 * Calcula a similaridade de cosseno entre dois vetores
 * @param {Array} a - Primeiro vetor
 * @param {Array} b - Segundo vetor
 * @returns {number} - Valor da similaridade (entre -1 e 1)
 */
function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Busca documentos similares com base em um embedding de consulta
 * @param {Array} queryEmbedding - Embedding da consulta
 * @param {number} limit - Número máximo de resultados
 * @returns {Array} - Documentos similares
 */
export async function findSimilarDocuments(queryEmbedding, limit = 3) {
  if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
    throw new Error("Embedding de consulta inválido");
  }

  try {
    const [documents] = await pool.query("SELECT id, text, embedding FROM documents");
    
    if (!documents || documents.length === 0) {
      return [];
    }

    const documentsWithSimilarity = documents
      .filter(doc => doc.embedding)
      .map(doc => {
        try {
          let embedding;
          
          if (typeof doc.embedding === 'string') {
            embedding = JSON.parse(doc.embedding);
          } else if (typeof doc.embedding === 'object') {
            embedding = doc.embedding;
          } else {
            return null;
          }
          
          if (!Array.isArray(embedding)) {
            return null;
          }
          
          const similarity = cosineSimilarity(queryEmbedding, embedding);
          return {
            id: doc.id,
            text: doc.text,
            similarity
          };
        } catch (parseError) {
          console.error("Erro ao processar embedding:", parseError);
          return null;
        }
      })
      .filter(doc => doc !== null);
    
    return documentsWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  } catch (error) {
    console.error("Erro ao buscar documentos similares:", error);
    throw new Error(`Falha ao buscar documentos: ${error.message}`);
  }
}

/**
 * Retorna todos os documentos armazenados.
 */
export async function getAllDocuments() {
  try {
    const [rows] = await pool.execute("SELECT * FROM documents");
    return rows;
  } catch (error) {
    console.error("Erro ao buscar todos os documentos:", error);
    throw new Error(`Falha ao buscar documentos: ${error.message}`);
  }
}

export async function deleteDocument(id) {
  if (!id) {
    throw new Error("ID do documento não fornecido");
  }
  
  try {
    const [result] = await pool.execute("DELETE FROM documents WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Erro ao excluir documento ${id}:`, error);
    throw new Error(`Falha ao excluir documento: ${error.message}`);
  }
}
