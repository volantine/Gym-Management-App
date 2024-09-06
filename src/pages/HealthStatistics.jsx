import React, { useState, useEffect } from 'react';
import '../styles/Health.css'; 

function HealthStatistics({ username }) {
  const [healthMetrics, setHealthMetrics] = useState([]);

  const fetchHealthMetrics = async () => {
    const response = await fetch(`http://localhost:3000/health-metrics/${username}`);
    const results = await response.json();

    if (response.ok) {
      setHealthMetrics(results);
    }
  }

  useEffect(() => {
    fetchHealthMetrics();
  }, [username]);

  return (
    <div className="health-statistics-container"> 
      <h2 className="statistics-heading">Health Statistics:</h2> 
      <table className="health-metrics-table"> 
        <thead>
          <tr style={{ color: 'black' }}>
            <th>Entry</th>
            <th>Height</th>
            <th>Weight</th>
            <th>BPM</th>
            <th>Blood Pressure</th>
            <th>Sleep Duration</th>
            <th>Daily Steps</th>
            <th>Calorie Intake</th>
          </tr>
        </thead>
        <tbody style={{ color: 'black' }}>
          {healthMetrics.slice(0, 5).map((metric, index) => (
            <tr key={metric.metric_id}>
              <td>{index === 0 ? 'Latest entry' : index === 1 ? 'Second Latest entry' : index === 2 ? 'Third Latest entry' : index === 3 ? 'Fourth Latest entry' : 'Fifth Latest entry'}</td>
              <td>{metric.height}</td>
              <td>{metric.weight}</td>
              <td>{metric.bpm}</td>
              <td>{metric.blood_pressure}</td>
              <td>{metric.sleep_duration}</td>
              <td>{metric.daily_steps}</td>
              <td>{metric.calorie_intake}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HealthStatistics;
