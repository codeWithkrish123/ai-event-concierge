function HistoryList({ history }) {
  if (!history || history.length === 0) {
    return <p style={{ color: "#666" }}>No previous plans yet. Generate your first plan above!</p>;
  }

  return (
    <div>
      {history.map((item) => (
        <div key={item.id} style={{ 
          marginBottom: "20px", 
          padding: "15px", 
          border: "1px solid #eee", 
          borderRadius: "5px",
          backgroundColor: "#fafafa"
        }}>
          <p><strong>📝 Prompt:</strong> {item.prompt}</p>
          <p><strong>🤖 Model:</strong> {item.modelUsed || "Unknown"}</p>
          <p><strong>📅 Date:</strong> {new Date(item.timestamp).toLocaleDateString()}</p>
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            backgroundColor: "white", 
            borderRadius: "3px",
            whiteSpace: "pre-wrap"
          }}>
            <strong>📋 Plan:</strong> {item.plan}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;
