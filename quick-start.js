#!/usr/bin/env node

/**
 * Quick Start - Get OSINT API Running
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║           🚀 OSINT API - Quick Start Setup                      ║
║                                                                ║
║  This script will help you get the API running locally         ║
╚════════════════════════════════════════════════════════════════╝

`);

const steps = [
  {
    num: 1,
    name: 'Worker Ready',
    status: '✅',
    cmd: 'npm run dev',
    desc: 'Start the Cloudflare Worker on http://localhost:8787'
  },
  {
    num: 2,
    name: 'Backend Ready',
    status: '⏳',
    cmd: 'cd server && npm run dev',
    desc: 'Start the Node.js backend on http://localhost:3000'
  },
  {
    num: 3,
    name: 'Test API',
    status: '⏳',
    cmd: 'node test-api.js',
    desc: 'Run the test suite to verify everything works'
  }
];

console.log('📋 Steps:\n');

steps.forEach(step => {
  console.log(`${step.status} Step ${step.num}: ${step.name}`);
  console.log(`   Run: ${step.cmd}`);
  console.log(`   ${step.desc}\n`);
});

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🚀 QUICK START GUIDE                         ║
╚════════════════════════════════════════════════════════════════╝

Option A: Start Everything (Recommended)
─────────────────────────────────────────

Terminal 1 - Start Worker:
  npm run dev

Terminal 2 - Start Backend:
  cd server
  npm install
  npm run dev

Terminal 3 - Run Tests:
  node test-api.js


Option B: Worker Only (No Backend)
──────────────────────────────────

Terminal 1 - Start Worker:
  npm run dev

Then test with this command:
  curl http://localhost:8787/api/services


Option C: Backend Only
──────────────────────

Terminal 1 - Start Backend:
  cd server
  npm install
  npm run dev

Create a test user:
  curl -X POST http://localhost:3000/api/users/create \\
    -H "Content-Type: application/json" \\
    -d '{"email":"test@example.com","initialCredits":1000}'


╔════════════════════════════════════════════════════════════════╗
║                    📝 EXAMPLE REQUESTS                          ║
╚════════════════════════════════════════════════════════════════╝

1. Check API Health
   curl http://localhost:8787/

2. Get Available Services
   curl http://localhost:8787/api/services

3. Create User (Backend must be running)
   curl -X POST http://localhost:3000/api/users/create \\
     -H "Content-Type: application/json" \\
     -d '{"email":"user@example.com","initialCredits":1000}'

4. Use API with API Key (Replace sk_xxx with real key)
   curl -H "Authorization: Bearer sk_xxx" \\
     http://localhost:8787/api/user/credits

5. Try a Service
   curl -H "Authorization: Bearer sk_xxx" \\
     http://localhost:8787/api/mac?mac=98:BA:5F:97:DF:32


╔════════════════════════════════════════════════════════════════╗
║                    🎯 NEXT STEPS                               ║
╚════════════════════════════════════════════════════════════════╝

1. Open two terminal windows
2. In Terminal 1: npm run dev
3. In Terminal 2: cd server && npm run dev
4. Wait for both to start
5. In Terminal 3: node test-api.js
6. Follow the instructions shown by test-api.js

That's it! Your API is running 🎉


╔════════════════════════════════════════════════════════════════╗
║                    💡 TIPS                                     ║
╚════════════════════════════════════════════════════════════════╝

✓ Worker runs on: http://localhost:8787
✓ Backend runs on: http://localhost:3000
✓ You can make requests from any HTTP client
✓ Use the test-api.js script to verify setup
✓ Check logs in the terminal for debugging

For more info, see: README.md or QUICKSTART.md

`);
