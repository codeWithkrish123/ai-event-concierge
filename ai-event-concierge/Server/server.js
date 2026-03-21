// server.js
const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require('dotenv');

// ✅ This looks for the .env file ONE FOLDER UP from the Server folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log("Checking for API Key...");
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: Still not found. Current path searched: " + path.join(__dirname, '..', '.env'));
} else {
    console.log("✅ Key Found! Starts with:", process.env.GEMINI_API_KEY.substring(0, 6));
}

// Ensure routes are loaded AFTER the key is found
const eventRoutes = require("./routes/eventRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API Routes
app.use("/api/events", eventRoutes);

// Handle React routing - return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));