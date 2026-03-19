const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for history
let eventHistory = [];

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("Received prompt:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    // Real Gemini AI call
    console.log("Calling real Gemini AI...");
    
    const result = await model.generateContent(
      `You are an AI Event Concierge. Return ONLY valid JSON with these exact keys: {"venue_name": "...", "location": "...", "estimated_cost": "...", "why_it_fits": "..."}\n\nUser request: ${prompt}`
    );
    const response = await result.response;
    const text = response.text();

    // Parse JSON from Gemini response
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // If response isn't JSON, create structured response
      parsed = {
        venue_name: "AI Generated Venue",
        location: "Based on your request",
        estimated_cost: "Contact for pricing",
        why_it_fits: text.substring(0, 200) + "..."
      };
    }

    // Create event object
    const newEvent = {
      _id: Date.now().toString(),
      prompt,
      response: parsed,
      createdAt: new Date().toISOString()
    };

    // Store in history
    eventHistory.unshift(newEvent); // Add to beginning
    if (eventHistory.length > 50) eventHistory.pop(); // Keep only last 50

    console.log("Gemini response processed. Total events:", eventHistory.length);

    res.json(newEvent);

  } catch (error) {
    console.error("Full Gemini ERROR:", error);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);
    console.error("Error details:", error.errorDetails);
    
    res.status(500).json({ 
      error: "Gemini AI failed",
      message: error.message,
      status: error.status,
      details: error.errorDetails || "Check server console for full error"
    });
  }
});

// Get History
router.get("/history", async (req, res) => {
  try {
    console.log("History requested. Returning", eventHistory.length, "events");
    res.json(eventHistory);
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

module.exports = router;