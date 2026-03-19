const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/eventRoutes.js");

dotenv.config();

// ✅ Validate Gemini API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env file");
  process.exit(1);
}

if (process.env.GEMINI_API_KEY.length < 20) {
  console.error("❌ GEMINI_API_KEY appears to be invalid");
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY: Loaded and validated");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("API Running with Gemini 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});