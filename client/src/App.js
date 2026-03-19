import { useState, useEffect } from "react";
import { generateEvent, getHistory } from "./api";
import EventCard from "./components/EventCard";
import HistoryList from "./components/HistoryList";
import Loader from "./components/Loader";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateEvent(prompt);
    setResult(res.data.response);
    setLoading(false);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await getHistory();
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Event Concierge</h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your event..."
      />

      <button onClick={handleGenerate}>Generate</button>

      {loading && <Loader />}

      {result && <EventCard data={result} />}

      <HistoryList history={history} />
    </div>
  );
}

export default App;