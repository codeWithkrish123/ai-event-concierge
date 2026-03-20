// Test Gemini API directly
const https = require('https');

const API_KEY = 'AIzaSyD1fiv9XO2D928oENLP8GJvjL40LyzFHac';

function testGeminiAPI() {
  console.log('Testing Gemini API...');
  
  // Test 1: List available models
  const listOptions = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models?key=${API_KEY}`,
    method: 'GET'
  };

  const listReq = https.request(listOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('\n=== MODELS LIST ===');
      console.log('Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        const models = JSON.parse(data);
        console.log('Available models:');
        models.models.forEach(model => {
          console.log(`  ✓ ${model.name} - ${model.displayName}`);
        });
        
        // Test the first available model
        if (models.models.length > 0) {
          testGeneration(models.models[0].name.split('/').pop());
        }
      } else {
        console.log('Error:', data);
      }
    });
  });

  listReq.on('error', (e) => console.error('List Error:', e));
  listReq.end();
}

function testGeneration(modelName) {
  console.log(`\n=== TESTING GENERATION WITH ${modelName} ===`);
  
  const genOptions = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const postData = JSON.stringify({
    contents: [{ parts: [{ text: "Hello! Please respond with a simple greeting." }] }]
  });

  const genReq = https.request(genOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ SUCCESS! Response:', response.candidates[0].content.parts[0].text);
      } else {
        console.log('❌ Error:', data);
      }
    });
  });

  genReq.on('error', (e) => console.error('Gen Error:', e));
  genReq.write(postData);
  genReq.end();
}

testGeminiAPI();
