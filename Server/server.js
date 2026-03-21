const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load .env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();

// ✅ Security Headers
app.use(helmet());

// ✅ Rate Limiting (prevent brute-force / spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP
  message: "Too many requests, try again later.",
});
app.use(limiter);

// ✅ CORS (restrict access)
app.use(
  cors({
    origin: [
      "https://ai-event-concierge-olive.vercel.app",
      "https://ai-event-concierge-da658txjw-codewithkrish123s-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Body parser with limit (prevent large payload attacks)
app.use(express.json({ limit: "10kb" }));

// ❌ REMOVE this (since frontend is on Vercel)
// app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Routes
const eventRoutes = require("./routes/eventRoutes.js");
app.use("/api/events", eventRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);