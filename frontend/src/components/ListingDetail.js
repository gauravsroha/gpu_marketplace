import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ListingDetail = ({ isLoggedIn }) => {
  const [listing, setListing] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/listings/${id}/`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };
    fetchListing();
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('You must be logged in to place a bid.');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8000/api/bids/',
        { listing: id, amount: bidAmount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Bid placed successfully!');
      setListing({ ...listing, current_highest_bid: response.data.amount });
      setBidAmount('');
    } catch (error) {
      setError('Failed to place bid. Please try again.');
    }
  };

  if (!listing) return <div>Loading...</div>;

  return (
    <Container>
      <h1 className="my-4">{listing.title}</h1>
      <Card>
        <Card.Body>
          <Card.Text>
            Brand: {listing.brand}<br />
            Model: {listing.model}<br />
            Price: ${listing.price}<br />
            Current Highest Bid: ${listing.current_highest_bid || 'No bids yet'}<br />
            Seller: {listing.seller_name}<br />
            End Time: {new Date(listing.end_time).toLocaleString()}
          </Card.Text>
          {isLoggedIn && (
            <Form onSubmit={handleBid}>
              <Form.Group className="mb-3">
                <Form.Label>Place a Bid</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Place Bid
              </Button>
            </Form>
          )}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListingDetail;