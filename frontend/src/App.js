import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ListingDetail from './components/ListingDetail';
import Dashboard from './components/Dashboard';
import CreateListing from './components/CreateListing';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLoggedIn(true);
      setUsername(response.data.username);
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching user info:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            <Login 
              setIsLoggedIn={setIsLoggedIn} 
              setUsername={setUsername} 
              setUserId={setUserId}
            />
          } 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<ListingDetail isLoggedIn={isLoggedIn} />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard userId={userId} username={username} /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-listing"
          element={isLoggedIn ? <CreateListing /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;