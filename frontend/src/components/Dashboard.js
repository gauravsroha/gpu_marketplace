import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = ({ userId, username }) => {
  const [myListings, setMyListings] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const listingsResponse = await axios.get('http://localhost:8000/api/listings/my_listings/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyListings(listingsResponse.data);

      const bidsResponse = await axios.get('http://localhost:8000/api/listings/my_bids/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Bids response:', bidsResponse.data);
      setMyBids(bidsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again later.');
    }
  };

  const deleteListing = async (listingId) => {
    try {
      await axios.delete(`http://localhost:8000/api/listings/${listingId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyListings(myListings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete listing. Please try again.');
    }
  };

  const deleteBid = async (listingId) => {
    try {
      const listing = myBids.find(l => l.id === listingId);
      if (!listing) {
        setError(`Listing with ID ${listingId} not found.`);
        return;
      }
  
      const userBid = listing.bids.find(bid => bid.bidder === username);
      if (!userBid) {
        setError('Your bid for this listing was not found.');
        return;
      }
  
      await axios.delete(`http://localhost:8000/api/bids/${userBid.id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      // Refresh the dashboard data after successful deletion
      fetchDashboardData();
      
    } catch (error) {
      console.error('Error in deleteBid function:', error);
      setError('Failed to delete bid. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="my-4">Dashboard</h1>
      <Row>
        <Col md={6}>
        <h2>My Listings</h2>
          {myListings.map((listing) => (
            <Card key={listing.id} className="mb-3">
              <Card.Body>
                <Card.Title>{listing.title}</Card.Title>
                <Card.Text>
                  Price: ${listing.price}<br />
                  Current Highest Bid: ${listing.current_highest_bid || 'No bids yet'}
                </Card.Text>
                <Link to={`/update-listing/${listing.id}`}>
                  <Button variant="primary" className="me-2">Update Listing</Button>
                </Link>
                <Button variant="danger" onClick={() => deleteListing(listing.id)}>Delete Listing</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={6}>
        <h2>My Bids</h2>
        {myBids.map((listing) => {
            const myHighestBid = listing.bids
            .filter(bid => bid.bidder === username)  // Change from userId to username
            .reduce((max, bid) => Math.max(max, bid.amount), 0);
            
            return (
            <Card key={listing.id} className="mb-3">
                <Card.Body>
                <Card.Title>{listing.title}</Card.Title>
                <Card.Text>
                    My Highest Bid: ${myHighestBid}<br />
                    Current Highest Bid: ${listing.current_highest_bid || 'No bids yet'}
                </Card.Text>
                <Button 
                    variant="danger" 
                    onClick={() => deleteBid(listing.id)}
                >
                    Delete Bid
                </Button>
                </Card.Body>
            </Card>
            );
        })}
        </Col>

      </Row>
    </Container>
  );
};

export default Dashboard;