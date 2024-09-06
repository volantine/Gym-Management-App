import React, { useState } from 'react';
import '../styles/HealthMetrics.css';

const HealthMetrics = ({ username }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bpm: '',
    bloodPressure: '',
    sleepDuration: '',
    dailySteps: '',
    calorieIntake: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/health-metrics/${username}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          height: '',
          weight: '',
          bpm: '',
          bloodPressure: '',
          sleepDuration: '',
          dailySteps: '',
          calorieIntake: ''
        });

        setTimeout(() => {
          setSubmitted(false);
        }, 2000); // Set timeout for 2 seconds
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="health-metrics-container">
      <h2>Enter Health Metrics</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Height (in meters):
          <input type="number" name="height" value={formData.height} onChange={handleChange} step="0.01" required />
        </label>
        <br />
        <label>
          Weight (in kilograms):
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} step="0.01" required />
        </label>
        <br />
        <label>
          Heart Rate (bpm):
          <input type="number" name="bpm" value={formData.bpm} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Blood Pressure:
          <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Sleep Duration (in hours):
          <input type="number" name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} step="0.01" required />
        </label>
        <br />
        <label>
          Daily Steps:
          <input type="number" name="dailySteps" value={formData.dailySteps} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Calorie Intake:
          <input type="number" name="calorieIntake" value={formData.calorieIntake} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Submit</button>
        {submitted && <p className="submission-notification">Submitted successfully!</p>}
      </form>
    </div>
  );
};

export default HealthMetrics;
