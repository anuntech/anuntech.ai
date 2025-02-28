// Configuração global para testes
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: '.env.test' });

// Mock global para fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 