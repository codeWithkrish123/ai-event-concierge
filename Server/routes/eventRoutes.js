// routes/eventRoutes.js
const express = require("express");
const router = express.Router();

// In-memory storage for history
let eventHistory = [];

// HELPER: List available models to debug
async function listAvailableModels(apiKey) {
  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (response.ok) {
      console.log(" Available models:");
      data.models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
      return data.models;
    } else {
      console.error(" Failed to list models:", data);
      return [];
    }
  } catch (error) {
    console.error(" Error listing models:", error.message);
    return [];
  }
}

// HELPER: Pause execution for a set time (e.g., to handle rate limits)
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// HELPER: The main generation logic that we can retry with different models
async function attemptGeneration(modelName, prompt, apiKey) {
  // Try different API versions and endpoints
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.warn(`Endpoint ${endpoint} failed:`, data.error?.message);
      }
    } catch (error) {
      console.warn(`Endpoint ${endpoint} error:`, error.message);
    }
  }

  // All endpoints failed
  const error = new Error(`Model ${modelName} not available on any endpoint`);
  throw error;
}

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log("🔑 API Key loaded:", apiKey ? "YES" : "NO");
  console.log("📝 Prompt received:", prompt);
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }
  
  // Update these names! Old 1.5/1.0 models are gone.
  const FREE_MODELS = [
    "gemini-3.1-flash-lite-preview", 
    "gemini-3-flash-preview", 
    "gemini-2.5-flash"
  ];

  let lastError = null;

  for (const modelName of FREE_MODELS) {
    try {
      console.log(`🚀 Attempting: ${modelName}...`);
      
      // Use v1beta as it supports the newest Gemini 3 features
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ Success with ${modelName}`);
        return res.json({ plan: data.candidates[0].content.parts[0].text });
      } else {
        // If it's a 429 (Quota), wait 10 seconds before trying the next model
        if (response.status === 429) {
          console.warn(`🛑 ${modelName} Rate Limited. Waiting...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        lastError = data.error.message;
        console.warn(`❌ ${modelName} failed: ${lastError}`);
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  res.status(500).json({ error: "All 2026 models failed", details: lastError });
});
// List available models (for debugging)
router.get("/models", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const models = await listAvailableModels(apiKey);
    res.json({ models });
  } catch (error) {
    console.error("Models endpoint error:", error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get History
router.get("/history", (req, res) => {
  try {
    console.log("History requested. Returning", eventHistory.length, "events");
    res.json(eventHistory);
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

module.exports = router;