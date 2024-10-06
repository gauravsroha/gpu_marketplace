import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/listings/');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchListings();
  }, []);

  return (
    <Container>
      <h1 className="my-4">GPU Listings</h1>
      <Row>
        {listings.map((listing) => (
          <Col key={listing.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{listing.title}</Card.Title>
                <Card.Text>
                  Brand: {listing.brand}<br />
                  Model: {listing.model}<br />
                  Price: ${listing.price}<br />
                  Current Highest Bid: ${listing.current_highest_bid || 'No bids yet'}
                </Card.Text>
                <Link to={`/listing/${listing.id}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;