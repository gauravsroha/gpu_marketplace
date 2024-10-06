import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchMyBids = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/bids/my-bids/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBids(response.data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    fetchMyBids();
  }, []);

  return (
    <div>
      <h2>My Bids</h2>
      {bids.map((bid) => (
        <div key={bid.id}>
          <p>Listing: {bid.listing}</p>
          <p>Amount: ${bid.amount}</p>
          <p>Date: {new Date(bid.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default MyBids;