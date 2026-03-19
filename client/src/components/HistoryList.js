function HistoryList({ history }) {
  return (
    <div>
      <h3>History</h3>
      {history.map((item) => (
        <div key={item._id}>
          <p><b>{item.prompt}</b></p>
          <p>{item.response.venue_name}</p>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;
