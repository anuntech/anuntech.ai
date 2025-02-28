import dotenv from 'dotenv';

dotenv.config();

export function setupCors(req, res, next) {
  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3001'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
}

export function rateLimit(req, res, next) {
  const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX) || 100;
  const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000; // 15 minutos
  
  const ip = req.ip || req.connection.remoteAddress;
  
  if (!global.rateLimitMap) {
    global.rateLimitMap = new Map();
  }
  
  const now = Date.now();
  const userRequests = global.rateLimitMap.get(ip) || { count: 0, resetTime: now + WINDOW_MS };
  
  if (now > userRequests.resetTime) {
    userRequests.count = 1;
    userRequests.resetTime = now + WINDOW_MS;
  } else {
    userRequests.count += 1;
  }
  
  global.rateLimitMap.set(ip, userRequests);
  
  if (userRequests.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Muitas requisições. Tente novamente mais tarde.',
      retryAfter: Math.ceil((userRequests.resetTime - now) / 1000)
    });
  }
  
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - userRequests.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(userRequests.resetTime / 1000));
  
  next();
}

export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; connect-src 'self' https://api.openai.com;");
  
  next();
}

export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Erro:`, err);
  
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Erro interno do servidor' : err.message,
    ...(isProd ? {} : { stack: err.stack })
  });
} 