import React, { useState, useEffect } from 'react';
import HealthStatistics from './HealthStatistics';
import Routine from './Routine';

function MemberDashboard({ username }) {
  const [completedGoals, setCompletedGoals] = useState([]);

  useEffect(() => {
    fetchCompletedGoals();
  }, []);

  const fetchCompletedGoals = async () => {
    try {
      const response = await fetch(`http://localhost:3000/completed-goals/${username}`);
      if (response.ok) {
        const data = await response.json();
        setCompletedGoals(data.completedGoals);
      } else {
        console.error('Failed to fetch completed goals');
      }
    } catch (error) {
      console.error('Error fetching completed goals:', error);
    }
  };

  return (
    <div style={{ display: 'flex', color: 'white' }}>
      <div style={{ flex: 1, paddingLeft: '20px' }}>
        <h1 style={{ color: '#ff7f7f' }}>{username}'s Dashboard</h1>
        <h1 style={{ paddingTop: '15px' }}>Fitness Achievements:</h1>
        <ul>
          {completedGoals.map((goal) => (
            <li key={goal.goal_id}>{goal.goal}</li>
          ))}
        </ul>
      </div>      
      <div style={{ flex: 1 ,paddingTop: '70px'}}>
        <HealthStatistics username={username} />
      </div>
      <div style={{ flex: 1 ,paddingTop: '70px'}}>
        <Routine username={username} />
      </div>
    </div>
  );
}

export default MemberDashboard;
