function EventCard({ data }) {
  return (
    <div className="card">
      <h2>{data.venue_name}</h2>
      <p>{data.location}</p>
      <p>{data.estimated_cost}</p>
      <p>{data.why_it_fits}</p>
    </div>
  );
}

export default EventCard;
