import request from 'supertest';
import app from '../server.js';

// Mock do pool de conexão com o banco de dados
jest.mock('../../config/db.js', () => ({
  query: jest.fn().mockResolvedValue([[{ solution: 2 }]]),
  execute: jest.fn().mockResolvedValue([[]]),
  __esModule: true,
  default: {
    query: jest.fn().mockResolvedValue([[{ solution: 2 }]]),
    execute: jest.fn().mockResolvedValue([[]])
  }
}));

describe('Servidor API', () => {
  test('GET /api/health deve retornar status 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('database', 'connected');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('Rota inexistente deve retornar status 404', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Endpoint não encontrado');
  });
}); 