import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    brand: '',
    model: '',
    end_time: ''
  });
  const [error, setError] = useState('');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [currentHighestBid, setCurrentHighestBid] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchListingData();
  }, []);

  const fetchListingData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/listings/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFormData(response.data);
      setOriginalPrice(parseFloat(response.data.price));
      setCurrentHighestBid(response.data.current_highest_bid ? parseFloat(response.data.current_highest_bid) : null);
    } catch (error) {
      console.error('Error fetching listing data:', error);
      setError('Failed to fetch listing data. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPrice = parseFloat(formData.price);

      /* if (newPrice > originalPrice) {
        setError('The new price cannot be higher than the original price.');
        return;
      }
      */

      if (currentHighestBid !== null && newPrice > currentHighestBid) {
        setError('The new price cannot be more than the current highest bid.');
        return;
      }

      await axios.put(`http://localhost:8000/api/listings/${id}/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update listing. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="my-4">Update Listing</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <Form.Text className="text-muted">
            Original price: ${originalPrice}.
            {currentHighestBid !== null 
              ? ` Current highest bid: $${currentHighestBid}. New price must be atmost $${currentHighestBid}.`
              : ' No current bids. You can increase or decrease the price according to you'}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Model</Form.Label>
          <Form.Control
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Listing
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateListing;