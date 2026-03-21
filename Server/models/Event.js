const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  prompt: String,
  response: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
