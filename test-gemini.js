const https = require('https');

const apiKey = 'AIzaSyD1fiv9XO2D928oENLP8GJvjL40LyzFHac';

// Test listing available models
function listModels() {
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1/models?key=${apiKey}`,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e);
  });

  req.end();
}

// Test a simple generation with different models
function testGeneration(modelName) {
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1/models/${modelName}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const postData = JSON.stringify({
    contents: [{ parts: [{ text: "Hello, how are you?" }] }]
  });

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`\n=== Testing ${modelName} ===`);
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Error with ${modelName}:`, e);
  });

  req.write(postData);
  req.end();
}

console.log('Testing Gemini API...\n');

// First list available models
listModels();

// Then test common models
setTimeout(() => {
  testGeneration('gemini-1.5-flash');
}, 1000);

setTimeout(() => {
  testGeneration('gemini-pro');
}, 2000);

setTimeout(() => {
  testGeneration('gemini-1.0-pro');
}, 3000);
