const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Debug: Check if API key is loaded
console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");


const app = express();

// Security
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ FIXED CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-event-concierge-olive.vercel.app",
  "https://ai-event-concierge-ikoi.onrender.com",
  "https://ai-event-concierge-dqqb4wbgq-codewithkrish123s-projects.vercel.app",
  "https://ai-event-concierge-69ibdkz0k-codewithkrish123s-projects.vercel.app",
  "https://ai-event-concierge-3x48p9gzb-codewithkrish123s-projects.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false); // ✅ important fix
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Favicon endpoint to prevent 404 errors
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.use(express.json({ limit: "10kb" }));

const eventRoutes = require("./routes/eventRoutes.js");
app.use("/api/events", eventRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Better error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
// connectDB();

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();