-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS anuntech_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE anuntech_ai;

-- Criação da tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  embedding JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Criação da tabela de conversas (opcional, para histórico)
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  messages JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_session_id (session_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Criação do usuário (se necessário)
-- NOTA: Altere 'senha_segura' para uma senha forte em produção
CREATE USER IF NOT EXISTS 'anuntech_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON anuntech_ai.* TO 'anuntech_user'@'localhost';
FLUSH PRIVILEGES; 