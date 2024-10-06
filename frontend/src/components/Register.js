import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' }); //Hooks with their initial state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //Adds the value of diff form fields to formData
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //To stop the blank submission of the form
    try {
      await axios.post('http://localhost:8000/api/register/', formData); //Sends data to RegisterView in backend(urls.py) for registration
      navigate('/login'); //If registration gets successful
    } catch (error) {
      setError('Registration failed. Please try again.'); //If registrations fails from the backend
    }
  };

  return (
    <Container>
      <h1 className="my-4">Register</h1>
      {error && <Alert variant="danger">{error}</Alert>}  {/* If any error occurs while load, it shows in the page */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;