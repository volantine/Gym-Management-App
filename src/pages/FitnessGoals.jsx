import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

function FitnessGoalsPage({ username }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  // Fetch existing goals for the user from the server
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`http://localhost:3000/goals/${username}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals);
      } else {
        console.error('Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, goal: newGoal })
      });

      if (response.ok) {
        fetchGoals();
        setNewGoal('');
      } else {
        console.error('Failed to add goal');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleComplete = async (goalId) => {
    try {
      await fetch(`http://localhost:3000/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      fetchGoals();
    } catch (error) {
      console.error('Error marking goal as completed:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="card-custom">
        <Card.Body>
          <Card.Title className="text-center mb-4">Fitness Goals</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formGoal">
              <Form.Label>Add New Goal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your fitness goal"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                required
                className="mb-3"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Goal
            </Button>
          </Form>
          <div className="mt-4">
            <h5>Current Goals:</h5>
            <ul>
              {goals.map((goal) => (
                <li key={goal.goal_id}>
                  {goal.goal}
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleComplete(goal.goal_id)}
                    className="ms-2"
                    disabled={goal.completed} // Disables the button when the goal is completed
                  >
                    Complete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FitnessGoalsPage;
