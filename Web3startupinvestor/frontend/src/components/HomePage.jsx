import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './HomePage.css';
import image from '../assets/newbg.jpeg';

const HomePage = ({ onConnectWallet, isConnected }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <div className="homepage">
      <Navbar onConnectWallet={onConnectWallet} />
      {isConnected ? (
        <>
          <div className="connection-success">Connection successful</div>
          {showPopup && (
            <div className="popup">
              <h2>Are you a Startup or Investor?</h2>
              <button onClick={() => navigate('/register')}>Startup</button>
              <button onClick={() => navigate('/investor')}>Investor</button>
            </div>
          )}
        </>
      ) : (
        <div className="image-container">
          <img src={image} alt="FundChain" className="homepage-image" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
