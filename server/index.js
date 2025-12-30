// JavaScript version for easier deployment to Render
// This is a compiled version of the TypeScript server

const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// Store users in database (use real DB in production)
const users = new Map();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SERVER_AUTH_KEY = process.env.SERVER_AUTH_KEY || "dev-key";

// Add sample users for testing
const sampleUsers = [
  {
    id: "sample-1",
    email: "user1@example.com",
    apiKey: "sk_sample_1234567890abcdef",
    credits: 1000,
    totalUsed: 50,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  },
  {
    id: "sample-2",
    email: "user2@example.com",
    apiKey: "sk_sample_0987654321fedcba",
    credits: 500,
    totalUsed: 200,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  },
];

sampleUsers.forEach(user => users.set(user.apiKey, user));

// Middleware for auth
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${SERVER_AUTH_KEY}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Create new user
app.post("/api/users/create", (req, res) => {
  const { email, initialCredits = 1000 } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const apiKey = `sk_${uuidv4()}`;
  const user = {
    id: uuidv4(),
    email,
    apiKey,
    credits: initialCredits,
    totalUsed: 0,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  };

  users.set(apiKey, user);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      apiKey: user.apiKey,
      credits: user.credits,
    },
  });
});

// Verify API key
app.post("/api/verify-key", authMiddleware, (req, res) => {
  const { apiKey, requiredCredits = 1 } = req.body;

  const user = users.get(apiKey);
  if (!user) {
    return res.status(404).json({ error: "API key not found" });
  }

  if (user.credits < requiredCredits) {
    return res.status(402).json({ error: "Insufficient credits" });
  }

  user.lastUsed = new Date().toISOString();
  res.json(user);
});

// Get user credits
app.get("/api/user-credits", (req, res) => {
  const apiKey = req.headers.authorization?.replace("Bearer ", "");

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  const user = users.get(apiKey);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ credits: user.credits });
});

// Deduct credits
app.post("/api/deduct-credits", authMiddleware, (req, res) => {
  const { userId, apiKey, service, cost } = req.body;

  const user = users.get(apiKey);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.credits < cost) {
    return res.status(402).json({ error: "Insufficient credits" });
  }

  user.credits -= cost;
  user.totalUsed += cost;
  user.lastUsed = new Date().toISOString();

  // Log usage (store in database)
  console.log(`[${new Date().toISOString()}] User ${userId} used ${cost} credits for ${service}`);

  res.json({
    success: true,
    remainingCredits: user.credits,
    totalUsed: user.totalUsed,
  });
});

// Get all users (for syncing to Cloudflare KV)
app.get("/api/users", authMiddleware, (req, res) => {
  const userList = Array.from(users.values());
  res.json(userList);
});

// Add credits to user
app.post("/api/add-credits", authMiddleware, (req, res) => {
  const { apiKey, amount } = req.body;

  const user = users.get(apiKey);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.credits += amount;

  res.json({
    success: true,
    newBalance: user.credits,
  });
});

// Get user usage stats
app.get("/api/user/:apiKey/stats", authMiddleware, (req, res) => {
  const user = users.get(req.params.apiKey);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    credits: user.credits,
    totalUsed: user.totalUsed,
    createdAt: user.createdAt,
    lastUsed: user.lastUsed,
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log("Endpoints:");
  console.log("  POST /api/users/create - Create new user");
  console.log("  POST /api/verify-key - Verify API key");
  console.log("  GET  /api/user-credits - Get user credits");
  console.log("  POST /api/deduct-credits - Deduct credits");
  console.log("  GET  /api/users - Get all users");
  console.log("  POST /api/add-credits - Add credits");
  console.log("  GET  /api/user/:apiKey/stats - Get user stats");
  console.log("  GET  /health - Health check");
});

module.exports = app;
