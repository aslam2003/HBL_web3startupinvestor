import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import "./StartupList.css";
import Contractdata from "../contracts/StartupInvestorDApp.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

const StartupList = ({ signer, userAddress }) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collaborating, setCollaborating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await axios.get("https://api.pinata.cloud/data/pinList", {
          headers: {
            pinata_api_key: "YOUR_PINATA_API_KEY",
            pinata_secret_api_key: "YOUR_PINATA_SECRETE_KEY",
          },
        });

        const startupsData = await Promise.all(
          res.data.rows.map(async (item) => {
            const ipfsRes = await axios.get(`https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`);
            return ipfsRes.data;
          })
        );

        setStartups(startupsData);
      } catch (error) {
        console.error("Error fetching data from Pinata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
    const interval = setInterval(fetchStartups, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleFund = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
  
    const amountInEth = prompt("Enter amount to invest (in ETH):");
    if (!amountInEth || isNaN(amountInEth) || parseFloat(amountInEth) <= 0) {
      alert("Invalid investment amount.");
      return;
    }
  
    const startupAddress = prompt("Enter the startup's wallet address:");
    if (!startupAddress || !ethers.isAddress(startupAddress)) {
      alert("Invalid wallet address.");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Contractdata.abi, signer);
  
      const estimatedGas = await contract.estimateGas.invest(startupAddress, {
        value: ethers.parseEther(amountInEth),
      });
  
      const gasPrice = await provider.getGasPrice();
  
      const tx = await contract.invest(startupAddress, {
        value: ethers.parseEther(amountInEth),
        gasLimit: estimatedGas,
        gasPrice: gasPrice,
      });
  
      await tx.wait();
      alert(`Investment of ${amountInEth} ETH to ${startupAddress} successful!`);
    } catch (error) {
      console.error("Error during investment:", error);
      alert("Transaction failed. Check console for details.");
    }
  };
  
  const handleCollaborate = async (startupAddress) => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
  
    const idea = prompt("Enter collaboration idea:");
    if (!idea) {
      alert("Collaboration idea cannot be empty.");
      return;
    }
  
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
  
    setCollaborating(true);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Contractdata.abi, signer);
      
      const tx = await contract.collaborate(startupAddress, idea);
      await tx.wait();
  
      alert("Collaboration request sent successfully!");
      navigate("/register"); // Redirect to /register after collaboration
    } catch (error) {
      navigate("/register");
      console.error("Error during collaboration:", error);
      
    } finally {
      setCollaborating(false);
    }
  };
  
  return (
    <div className="startup-list">
      <h2 className="heading">Registered Startups</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="startup-grid">
          {startups.map((startup, index) => (
            <div key={index} className="startup-card">
              <img className="startup-logo" src={startup.logo} alt={startup.name} />
              <h3>{startup.name}</h3>
              <p><strong>Domain:</strong> {startup.domain}</p>
              <p>{startup.description}</p>
              <p><strong>Estimated Cost:</strong> {startup.estimatedCost} ETH</p>
              <p className="wallet-address"><strong>Address:</strong> {startup.walletAddress}</p>

              {location.pathname === "/investor" && (
                <button className="fund-button" onClick={handleFund}>
                  Fund
                </button>
              )}

              {(location.pathname === "/startups") && (
                <button 
                  className="collaborate-button" 
                  onClick={() => handleCollaborate(startup.walletAddress)} 
                  disabled={collaborating}
                >
                  {collaborating ? "Collaborating..." : "Collaborate"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StartupList;
