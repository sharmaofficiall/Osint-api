#!/usr/bin/env node

/**
 * Simple test script for OSINT API
 * Tests health endpoint and creates a test user
 */

const API_URL = 'http://localhost:8787';
const BACKEND_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 OSINT API Test Suite');
  console.log('========================\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    let response = await fetch(`${API_URL}/`);
    let data = await response.json();
    
    if (data.success) {
      console.log('✅ API is running!\n');
    } else {
      console.log('❌ API health check failed\n');
      return;
    }

    // Test 2: Get services
    console.log('2. Getting available services...');
    response = await fetch(`${API_URL}/api/services`);
    data = await response.json();
    
    if (data.success) {
      console.log('✅ Available services:');
      data.data.services.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.name} (Cost: ${s.cost} credits)`);
      });
      console.log();
    }

    // Test 3: Create test user on backend
    console.log('3. Creating test user on backend...');
    response = await fetch(`${BACKEND_URL}/api/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        initialCredits: 1000
      })
    });

    if (response.status === 404) {
      console.log('⚠️  Backend server not running at', BACKEND_URL);
      console.log('   To start backend: cd server && npm run dev\n');
      console.log('   For now, you can test the health endpoint only.\n');
      showTestCommands('test-api-key-123');
      return;
    }

    data = await response.json();
    
    if (data.success) {
      const apiKey = data.user.apiKey;
      console.log(`✅ Test user created!`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   API Key: ${apiKey}`);
      console.log(`   Credits: ${data.user.credits}\n`);

      // Test 4: Check credits
      console.log('4. Checking credits with API...');
      response = await fetch(`${API_URL}/api/user/credits`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });

      data = await response.json();
      if (data.success) {
        console.log(`✅ Credits verified: ${data.credits}\n`);
      }

      showTestCommands(apiKey);
    } else {
      console.log('❌ Failed to create user:', data.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Worker is running: npm run dev');
    console.log('2. Backend server is running: cd server && npm run dev');
  }
}

function showTestCommands(apiKey) {
  console.log('📝 Example Commands to Test:\n');

  console.log('# Get available services');
  console.log(`curl ${API_URL}/api/services\n`);

  console.log('# Check your credits');
  console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
  console.log(`  "${API_URL}/api/user/credits"\n`);

  console.log('# Test MediaFire (example URL)');
  console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
  console.log(`  "${API_URL}/api/mediafire?url=https://www.mediafire.com/file/example/file.zip"\n`);

  console.log('# Test Vehicle RC (example RC)');
  console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
  console.log(`  "${API_URL}/api/vehicle?rc=DL01AA1234"\n`);

  console.log('# Test MAC Address');
  console.log(`curl -H "Authorization: Bearer ${apiKey}" \\`);
  console.log(`  "${API_URL}/api/mac?mac=98:BA:5F:97:DF:32"\n`);

  console.log('# Add more credits (admin)');
  console.log(`curl -X POST ${BACKEND_URL}/api/add-credits \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "Authorization: Bearer dev-key" \\`);
  console.log(`  -d '{"apiKey":"${apiKey}","amount":500}'\n`);
}

testAPI();
