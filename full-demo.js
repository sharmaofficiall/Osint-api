#!/usr/bin/env node

/**
 * Complete Working Example - OSINT API
 * This shows you exactly how to use the API end-to-end
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║           🎯 OSINT API - Complete Working Example              ║
╚════════════════════════════════════════════════════════════════╝

This script demonstrates the COMPLETE workflow:
1. Create a user
2. Get an API key
3. Make API calls
4. Track credits

`);

const http = require('http');

async function makeRequest(method, path, host = 'localhost:3000', body = null, apiKey = null) {
  return new Promise((resolve, reject) => {
    const [hostname, port] = host.split(':');
    
    const options = {
      hostname,
      port: parseInt(port),
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (apiKey) {
      options.headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function workerRequest(method, path, apiKey = null, body = null) {
  return makeRequest(method, path, 'localhost:8787', body, apiKey);
}

async function backendRequest(method, path, body = null, apiKey = null) {
  return makeRequest(method, path, 'localhost:3000', body, apiKey);
}

async function demo() {
  try {
    console.log('Step 1: Check if backend is running...\n');
    
    try {
      const health = await backendRequest('GET', '/');
      console.log('✅ Backend is running on http://localhost:3000');
    } catch (e) {
      console.log('⚠️  Backend is not running');
      console.log('   Start it with: node dev-backend.js\n');
      console.log('Continuing with worker-only demo...\n');
      workerOnlyDemo();
      return;
    }

    console.log('\nStep 2: Create a new user\n');
    
    const createRes = await backendRequest('POST', '/api/users/create', {
      email: 'demo@example.com',
      initialCredits: 1000
    });

    if (!createRes.data.success) {
      console.log('❌ Failed to create user');
      return;
    }

    const apiKey = createRes.data.user.apiKey;
    console.log(`✅ User created!`);
    console.log(`   Email: ${createRes.data.user.email}`);
    console.log(`   API Key: ${apiKey}`);
    console.log(`   Initial Credits: ${createRes.data.user.credits}`);

    console.log('\nStep 3: Check if worker is running...\n');
    
    try {
      const health = await workerRequest('GET', '/');
      console.log('✅ Worker is running on http://localhost:8787');
    } catch (e) {
      console.log('⚠️  Worker is not running');
      console.log('   Start it with: npm run dev\n');
      return;
    }

    console.log('\nStep 4: Check user credits via API\n');
    
    const creditsRes = await workerRequest('GET', '/api/user/credits', apiKey);
    
    if (!creditsRes.data.success) {
      console.log('❌ Failed to check credits:', creditsRes.data.error);
    } else {
      console.log(`✅ Credits: ${creditsRes.data.credits}`);
    }

    console.log('\nStep 5: Test available services\n');
    
    const servicesRes = await workerRequest('GET', '/api/services');
    console.log('✅ Available services:');
    servicesRes.data.data.services.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name} (Cost: ${s.cost} credits)`);
    });

    console.log('\nStep 6: Example API calls\n');
    
    console.log('Here are some example curl commands you can run:\n');

    console.log(`# Get your credits`);
    console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
    console.log(`  http://localhost:8787/api/user/credits\n`);

    console.log(`# Test MAC address lookup`);
    console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
    console.log(`  "http://localhost:8787/api/mac?mac=98:BA:5F:97:DF:32"\n`);

    console.log(`# Test vehicle lookup`);
    console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
    console.log(`  "http://localhost:8787/api/vehicle?rc=DL01AA1234"\n`);

    console.log(`# Add more credits (for testing)`);
    console.log(`curl -X POST http://localhost:3000/api/add-credits \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "Authorization: Bearer ${apiKey}" \\`);
    console.log(`  -d '{"apiKey":"${apiKey}","amount":500}'\n`);

    console.log('\n✅ Setup complete! You can now:');
    console.log('   1. Use the API key in your applications');
    console.log('   2. Make requests to http://localhost:8787');
    console.log('   3. Track credits and usage');
    console.log('   4. Create more users as needed\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function workerOnlyDemo() {
  console.log('Testing Worker without Backend\n');
  
  try {
    const health = await workerRequest('GET', '/');
    console.log('✅ Worker is running');
    console.log('   Can test public endpoints\n');

    const services = await workerRequest('GET', '/api/services');
    console.log('Available services:');
    services.data.data.services.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name}`);
    });

    console.log('\n📝 To use the API, you need an API key.');
    console.log('   Start the backend with: node dev-backend.js\n');
    console.log('Then create a user and use the returned API key.\n');

  } catch (error) {
    console.error('❌ Worker not running');
    console.log('   Start with: npm run dev\n');
  }
}

demo();
