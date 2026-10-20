

function Dashboard({profile,history,onOpenHistory,onGetStarted}) {
 const latest=history[0]
  return (
   <section className="py-5 bg-light" id="dashboard">

    <div className="container">
      <div className="justify-content-between d-flex align-items-end mb-4 flex-wrap gap-2">
        <div className="">
          <h2 className="fw-bold mb-1">Your Dashboard</h2>
          <p className="text-secondary">
            {profile?`Welcome,${profile.name}`:"Set up your profile to start tracking your Health check ins"}
          </p>
        </div>
        <button className="btn-primary btn rounded-pill" type="button" onClick={onGetStarted}>New Check In</button>
      </div>
      <div className="row g-3 mb-4">

      <div className="col-6 col-md-3">
        <div className="dashboard-stat-card">
          <p className="text-secondary small mb-1">check-ins</p>
          <p className="text-primary fs-3 fw-bold mb-0">{history.length}</p>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="dashboard-stat-card">
          <p className="text-secondary small mb-1">last-status</p>
          <p className="text-primary fs-3 fw-bold mb-0">{latest?latest.insight.headline:"no check-ins yet"}</p>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="dashboard-stat-card">
          <p className="text-secondary small mb-1">last-temperature</p>
          <p className="text-primary fs-3 fw-bold mb-0">{latest?`${latest.temperature.toFixed(1)}°C`:"-"}</p>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="dashboard-stat-card">
          <p className="text-secondary small mb-1">last-heart rate</p>
          <p className="text-primary fs-3 fw-bold mb-0">{latest?`${latest.heartRate} bpm`:"-"}</p>
        </div>
      </div>
       </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-secondary small mb-0">recent history</h5>
          <button className="btn-link btn-sm text-decoration-none btn" type="button" onClick={onOpenHistory}>....view all</button>
        </div>
      {history.length===0?(
        <div className="dahsboar-stat-card text-center text-secondary small">

          No History Detected. Tap new check in to get started.
        </div>
      ):(
        <ul className="list-group">
          {
          history.slice(0,4).map(e=>(
            <li 
            key={e.id}
            className={
            `list-group-item d-flex justify-content-between align-items-center border-star border-4 ${
              e.insight.urgency==="urgent"? "border-danger"
              :e.insight.urgency==="caution"? "border-warning"
              :"boder-success"
            }`
            }
            >
<div>
<p className="fw-bold small mb-0">{e.insight.headline}</p>
<p className="text-secondary small mb-0">
  {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} &middot;{' '}
                    {e.temperature.toFixed(1)}°C &middot; {e.heartRate} bpm
</p>

</div>
<span className={
  `badge ${
     e.insight.urgency==="urgent"? "text-bg-danger"
              :e.insight.urgency==="caution"? "text-bg-warning"
              :"text-bg-success"
  }`
}>
  {e.insight.urgency}
</span>
            </li>
          ))
          }
        </ul>
      )}
      </div>
    {/* </div> */}
   </section>
  )
}

export default Dashboard