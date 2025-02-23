import React from 'react';
import './Navbar.css';

const Navbar = ({ onConnectWallet }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">FundChain</div>
      <h1>Welcome to the Marketplace</h1>
      <button className="connect-wallet-btn" onClick={onConnectWallet}>Connect Wallet</button>
    </nav>
  );
};

export default Navbar;