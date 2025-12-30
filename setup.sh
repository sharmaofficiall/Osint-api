#!/bin/bash
# Quick setup script for the OSINT API

echo "🚀 OSINT API Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install Wrangler if not installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

echo "✅ Wrangler installed"

# Install project dependencies
echo "📦 Installing Worker dependencies..."
npm install

echo "📦 Installing Server dependencies..."
cd server && npm install && cd ..

echo ""
echo "🔑 Next steps:"
echo ""
echo "1. Create Cloudflare KV namespaces:"
echo "   wrangler kv:namespace create \"CREDITS\""
echo "   wrangler kv:namespace create \"CREDITS-preview\""
echo "   wrangler kv:namespace create \"CACHE\""
echo "   wrangler kv:namespace create \"CACHE-preview\""
echo ""
echo "2. Update wrangler.toml with your KV namespace IDs"
echo ""
echo "3. Set up Cloudflare secrets:"
echo "   wrangler secret put SERVER_URL"
echo "   wrangler secret put SERVER_AUTH_KEY"
echo "   wrangler secret put ADMIN_KEY"
echo ""
echo "4. Configure server/.env with your settings"
echo ""
echo "5. Deploy to Cloudflare:"
echo "   npm run deploy"
echo ""
echo "6. Run local development:"
echo "   npm run dev"
echo ""
echo "✅ Setup complete! See README.md for detailed instructions."
