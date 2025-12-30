#!/usr/bin/env node

/**
 * Minimal backend server for testing
 * Provides user management and credit tracking
 */

const http = require('http');
const url = require('url');

// In-memory storage (for development only)
const users = new Map();
let userCounter = 1;

// Generate API key
function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'sk_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Helper function to parse body
  function parseBody(callback) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        callback(data);
      } catch (e) {
        callback({});
      }
    });
  }

  // Helper to get auth
  function getAuth() {
    const auth = req.headers.authorization || '';
    return auth.replace('Bearer ', '');
  }

  // Routes
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'Backend server is running',
      version: '1.0.0'
    }));
    return;
  }

  if (pathname === '/api/users/create' && req.method === 'POST') {
    parseBody((data) => {
      const apiKey = generateApiKey();
      const user = {
        id: `user-${userCounter++}`,
        email: data.email || 'test@example.com',
        apiKey,
        credits: data.initialCredits || 1000,
        totalUsed: 0,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };

      users.set(apiKey, user);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          apiKey: user.apiKey,
          credits: user.credits
        }
      }));
    });
    return;
  }

  if (pathname === '/api/verify-key' && req.method === 'POST') {
    parseBody((data) => {
      const user = users.get(data.apiKey);

      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'API key not found' }));
        return;
      }

      if (user.credits < (data.requiredCredits || 1)) {
        res.writeHead(402);
        res.end(JSON.stringify({ error: 'Insufficient credits' }));
        return;
      }

      user.lastUsed = new Date().toISOString();
      res.writeHead(200);
      res.end(JSON.stringify(user));
    });
    return;
  }

  if (pathname === '/api/user-credits' && req.method === 'GET') {
    const apiKey = getAuth();
    const user = users.get(apiKey);

    if (!user) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({ credits: user.credits }));
    return;
  }

  if (pathname === '/api/deduct-credits' && req.method === 'POST') {
    parseBody((data) => {
      const user = users.get(data.apiKey);

      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      if (user.credits < data.cost) {
        res.writeHead(402);
        res.end(JSON.stringify({ error: 'Insufficient credits' }));
        return;
      }

      user.credits -= data.cost;
      user.totalUsed += data.cost;
      user.lastUsed = new Date().toISOString();

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        remainingCredits: user.credits,
        totalUsed: user.totalUsed
      }));
    });
    return;
  }

  if (pathname === '/api/add-credits' && req.method === 'POST') {
    parseBody((data) => {
      const user = users.get(data.apiKey);

      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      user.credits += data.amount || 0;

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        newBalance: user.credits
      }));
    });
    return;
  }

  if (pathname === '/api/users' && req.method === 'GET') {
    const userList = Array.from(users.values());
    res.writeHead(200);
    res.end(JSON.stringify(userList));
    return;
  }

  // Not found
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              🖥️  BACKEND SERVER RUNNING                         ║
║                                                                ║
║  Server: http://localhost:${PORT}
║  Status: Ready ✅                                              ║
╚════════════════════════════════════════════════════════════════╝

📝 Available Endpoints:

GET  /                          - Health check
POST /api/users/create          - Create new user
POST /api/verify-key            - Verify API key
GET  /api/user-credits          - Get user credits
POST /api/deduct-credits        - Deduct credits
POST /api/add-credits           - Add credits
GET  /api/users                 - Get all users

📖 Example:

Create a user:
  curl -X POST http://localhost:${PORT}/api/users/create \\
    -H "Content-Type: application/json" \\
    -d '{"email":"test@example.com","initialCredits":1000}'

`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`   Try: kill ${PORT} or use a different port`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
