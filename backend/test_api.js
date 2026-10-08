fetch('http://localhost:5000/api/events?date=2026-12-01')
  .then(res => res.json())
  .then(data => {
    console.log("Returned events count:", data.events.length);
    data.events.forEach(e => console.log(e.title, e.startDate));
  })
  .catch(console.error);
