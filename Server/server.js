// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load .env from parent folder
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("Checking for API Key...");
if (!process.env.GEMINI_API_KEY) {
  console.error(
    " ERROR: Still not found. Current path searched: " +
      path.join(__dirname, "..", ".env")
  );
} else {
  console.log(
    " Key Found! Starts with:",
    process.env.GEMINI_API_KEY.substring(0, 6)
  );
}

// Load routes AFTER env
const eventRoutes = require("./routes/eventRoutes.js");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static React build
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// API Routes
app.use("/api/events", eventRoutes);

// ✅ FIXED: React fallback route (NO '*')
// 404 + React fallback
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "client", "build", "index.html")
  );
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);