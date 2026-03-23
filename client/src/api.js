import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-event-concierge-ikoi.onrender.com" ,
});

export const generateEvent = (prompt) =>
  API.post("/api/events/generate", { prompt });

export const getHistory = () =>
  API.get("/api/events/history");
