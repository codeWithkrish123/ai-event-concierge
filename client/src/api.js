import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/events",
});

export const generateEvent = (prompt) =>
  API.post("/generate", { prompt });

export const getHistory = () =>
  API.get("/history");
