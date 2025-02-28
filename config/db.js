// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Carrega as variáveis do .env
dotenv.config();

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'anuntech_user',
  password: process.env.DB_PASSWORD || 'senha_segura',
  database: process.env.DB_NAME || 'anuntech_ai',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Teste de conexão inicial
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    console.error('Verifique suas configurações no arquivo .env');
    return false;
  }
}

// Executar teste de conexão ao iniciar a aplicação
testConnection();

export { testConnection };
export default pool;
