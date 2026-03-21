import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-event-concierge-ikoi.onrender.com/api/events/generate",
});

export const generateEvent = (prompt) =>
  API.post("/", { prompt });

export const getHistory = () =>
  API.get("/history");
