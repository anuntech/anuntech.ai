#!/bin/bash

# Definir variáveis de ambiente
export NODE_ENV=production

# Verificar se o banco de dados está configurado
echo "Verificando conexão com o banco de dados..."
node -e "
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkDb() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'anuntech_user',
      password: process.env.DB_PASSWORD || 'senha_segura',
      database: process.env.DB_NAME || 'anuntech_ai'
    });
    
    await conn.execute('SELECT 1');
    console.log('Conexão com o banco de dados OK!');
    conn.end();
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return false;
  }
}

checkDb().then(success => {
  if (!success) {
    console.error('Verifique suas configurações de banco de dados no arquivo .env');
    process.exit(1);
  }
});
"

# Verificar se a chave da API OpenAI está configurada
if [ -z "$OPENAI_API_KEY" ]; then
  echo "AVISO: A variável de ambiente OPENAI_API_KEY não está definida."
  echo "Certifique-se de que ela está configurada no arquivo .env"
fi

# Construir o frontend Next.js
echo "Construindo o frontend Next.js..."
npm run next:build

# Iniciar o servidor
echo "Iniciando o servidor em modo de produção..."
if command -v pm2 &> /dev/null; then
  # Se o PM2 estiver instalado, usar para gerenciar o processo
  pm2 start npm --name "anuntech-api" -- run start
  pm2 start npm --name "anuntech-next" -- run next:start
  echo "Servidor iniciado com PM2. Use 'pm2 logs' para ver os logs."
else
  # Caso contrário, iniciar diretamente
  echo "PM2 não encontrado. Iniciando diretamente..."
  npm run start & npm run next:start
  echo "Servidor iniciado. Use 'jobs' para ver os processos em execução."
fi 