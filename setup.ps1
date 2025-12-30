# Windows Setup Script
# Run in PowerShell: .\setup.ps1

Write-Host "🚀 OSINT API Setup Script (Windows)" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Check Node.js
$node = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $node) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node --version) found" -ForegroundColor Green

# Install Wrangler
$wrangler = Get-Command wrangler -ErrorAction SilentlyContinue
if ($null -eq $wrangler) {
    Write-Host "📦 Installing Wrangler CLI..." -ForegroundColor Yellow
    npm install -g wrangler
}

Write-Host "✅ Wrangler installed" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing Worker dependencies..." -ForegroundColor Yellow
npm install

Write-Host "📦 Installing Server dependencies..." -ForegroundColor Yellow
Push-Location server
npm install
Pop-Location

Write-Host ""
Write-Host "🔑 Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Create Cloudflare KV namespaces:" -ForegroundColor Cyan
Write-Host "   wrangler kv:namespace create `"CREDITS`"" -ForegroundColor White
Write-Host "   wrangler kv:namespace create `"CREDITS-preview`"" -ForegroundColor White
Write-Host "   wrangler kv:namespace create `"CACHE`"" -ForegroundColor White
Write-Host "   wrangler kv:namespace create `"CACHE-preview`"" -ForegroundColor White
Write-Host ""
Write-Host "2. Update wrangler.toml with your KV namespace IDs" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Set up Cloudflare secrets:" -ForegroundColor Cyan
Write-Host "   wrangler secret put SERVER_URL" -ForegroundColor White
Write-Host "   wrangler secret put SERVER_AUTH_KEY" -ForegroundColor White
Write-Host "   wrangler secret put ADMIN_KEY" -ForegroundColor White
Write-Host ""
Write-Host "4. Configure server\.env with your settings" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Deploy to Cloudflare:" -ForegroundColor Cyan
Write-Host "   npm run deploy" -ForegroundColor White
Write-Host ""
Write-Host "6. Run local development:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "✅ Setup complete! See README.md for detailed instructions." -ForegroundColor Green
