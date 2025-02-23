import React, { useState } from 'react';
import { ethers } from 'ethers';
import StartupList from './StartupList';
import './InvestorPage.css';

const InvestorPage = ({ startups }) => {
  const [startupWallet, setStartupWallet] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleInvest = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to proceed.');
      return;
    }
  
    if (!startupWallet || !/^0x[a-fA-F0-9]{40}$/.test(startupWallet)) {
      alert('Enter a valid Ethereum wallet address.');
      return;
    }
  
    if (!investmentAmount || isNaN(investmentAmount) || parseFloat(investmentAmount) <= 0) {
      alert('Enter a valid investment amount in ETH.');
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // Fix this line
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner(); // Fix this line
  
      const transaction = {
        to: startupWallet,
        value: ethers.parseEther(investmentAmount), // Fix this line
      };
  
      const txResponse = await signer.sendTransaction(transaction);
      alert(`Transaction sent! Hash: ${txResponse.hash}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Check console for details.');
    }
  };
  

  return (
    <div className="investor-form">
      <h2>Investor Dashboard</h2>

      <label>Enter Startup Wallet Address:</label>
      <input
        type="text"
        value={startupWallet}
        onChange={(e) => setStartupWallet(e.target.value)}
        placeholder="Enter startup's Ethereum wallet address"
      />

      <label>Enter Investment Amount (ETH):</label>
      <input
        type="number"
        value={investmentAmount}
        onChange={(e) => setInvestmentAmount(e.target.value)}
        placeholder="Enter amount in ETH"
      />

      <button onClick={handleInvest}>Invest</button>

      <StartupList startups={startups} />
    </div>
  );
};

export default InvestorPage;
