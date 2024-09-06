import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

function Login({setIsLoggedIn}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [account_type, setAccountType] = useState('member');
  const [isLogin, setLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': username, 'password': password, 'account_type': account_type, 'isLogin': isLogin})
    });

    if (response.ok) {
      if (isLogin) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('account_type', account_type);
        setIsLoggedIn(true);
      } else {
        alert("Account created");
        window.location.reload(true);
      }
    } else {
      const data = await response.text();
      alert(data);
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="card-custom">
        <Card.Body>
          <Card.Title className="text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="username" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className='mb-3'
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className='mb-3'
              />
            </Form.Group>

            <Form.Group controlId="formAccountType" className='mb-3'>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Member"
                  value="member"
                  checked={account_type === 'member'}
                  onChange={() => setAccountType('member')}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Trainer"
                  value="trainer"
                  checked={account_type === 'trainer'}
                  onChange={() => setAccountType('trainer')}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Admin"
                  value="admin"
                  checked={account_type === 'admin'}
                  onChange={() => setAccountType('admin')}
                />
              </div>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>

            <p 
              className='mt-3 mb-0 text-center' style={{color: 'blue', cursor: 'pointer'}}
              onClick={() => setLogin(!isLogin)}
            >
              {isLogin ? 'Don\'t have an account? ': 'Have an account? '}
              <span style={{textDecoration: 'underline'}}>
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;