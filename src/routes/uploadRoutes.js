// src/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { readFile, unlink } from "fs/promises";
import { getEmbedding, chunkText } from "../utils/embeddings.js";
import { insertDocument, getAllDocuments, deleteDocument } from "../models/document.js";

const router = express.Router();

// Configuração do Multer para uploads (os arquivos serão armazenados temporariamente na pasta "uploads")
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
});

/**
 * Endpoint para upload de arquivo TXT com contexto.
 * O arquivo enviado será processado: lido, dividido em chunks, cada chunk terá seu embedding gerado
 * e os dados serão inseridos na tabela "documents" do MySQL.
 */
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }
    
    const filePath = req.file.path;
    
    try {
      const content = await readFile(filePath, "utf8");
      
      await unlink(filePath);
      
      const chunks = chunkText(content, 500);
      
      if (chunks.length === 0) {
        return res.status(400).json({ error: "Conteúdo do arquivo vazio ou inválido." });
      }
      
      let insertedCount = 0;
      
      for (const chunk of chunks) {
        const embedding = await getEmbedding(chunk);
        await insertDocument(chunk, embedding);
        insertedCount++;
      }
      
      res.json({ 
        message: "Arquivo processado com sucesso.", 
        chunks: insertedCount 
      });
    } catch (readError) {
      await unlink(filePath).catch(() => {});
      throw new Error(`Erro ao processar arquivo: ${readError.message}`);
    }
  } catch (err) {
    console.error("Erro no endpoint /upload:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/documents", async (req, res) => {
  try {
    const documents = await getAllDocuments();
    res.json({ documents });
  } catch (err) {
    console.error("Erro ao buscar documentos:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const success = await deleteDocument(parseInt(id));
    
    if (success) {
      res.json({ message: "Documento excluído com sucesso" });
    } else {
      res.status(404).json({ error: "Documento não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao excluir documento:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 