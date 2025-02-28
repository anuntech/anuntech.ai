// src/server.js
import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import pool from "../config/db.js"; // Conexão com o MySQL
import chatRoutes from "./routes/chatRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { setupCors, rateLimit, securityHeaders, errorHandler } from "./middleware/security.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Middlewares de segurança
app.use(setupCors);
app.use(securityHeaders);
if (isProd) {
  app.use(rateLimit);
}

// Middleware de compressão
app.use(compression());

// Middlewares padrão
app.use(express.json({ limit: '1mb' }));
app.use(express.static("public")); // Serve arquivos estáticos da pasta public

// Rota de teste para verificar a conexão com o MySQL
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS solution");
    res.json({ 
      status: "ok", 
      database: "connected", 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      status: "error", 
      message: "Database connection failed" 
    });
  }
});

// Registrar as rotas da API
app.use("/api", chatRoutes);
app.use("/api", uploadRoutes);

// Rota para página inicial
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// Rota para a página de upload
app.get("/upload", (req, res) => {
  res.sendFile("upload.html", { root: "public" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});

// Tratamento de erros não capturados
process.on("uncaughtException", (error) => {
  console.error("Erro não tratado:", error);
  // Fechar o servidor graciosamente
  server.close(() => {
    process.exit(1);
  });
  // Se o servidor não fechar em 10 segundos, forçar o encerramento
  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promessa rejeitada não tratada:", reason);
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

export default app;
