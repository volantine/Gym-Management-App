import React, { useState, useEffect } from 'react';
import '../styles/Routine.css';

const Routine = () => {
  const [routines, setRoutines] = useState([]);

  const fetchRoutines = async () => {
    const response = await fetch('http://localhost:3000/exercise-routines');
    const results = await response.json();

    if (response.ok) {
      setRoutines(results);
    }
  }

  useEffect(() => {
    fetchRoutines();
  }, []);

  return (
    <div className="routines-container"> 
      <h2 style={{ color: 'white' }}>Exercise Routines</h2>
      <table style={{ color: 'black' }}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Exercise 1</th>
            <th>Exercise 2</th>
            <th>Exercise 3</th>
            <th>Exercise 4</th>
            <th>Exercise 5</th>
          </tr>
        </thead>
        <tbody>
          {routines.map((routine, index) => (
            <tr key={index}>
              <td>{routine.day}</td>
              <td>{routine.exercise_1}</td>
              <td>{routine.exercise_2}</td>
              <td>{routine.exercise_3}</td>
              <td>{routine.exercise_4}</td>
              <td>{routine.exercise_5}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Routine;
