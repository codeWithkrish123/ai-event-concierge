function EventCard({ data }) {
  return (
    <div className="card" style={{ 
      padding: "20px", 
      border: "1px solid #ddd", 
      borderRadius: "8px", 
      backgroundColor: "#f9f9f9",
      whiteSpace: "pre-wrap"
    }}>
      <h3>🎯 Your Generated Plan</h3>
      <p>{data}</p>
    </div>
  );
}

export default EventCard;
