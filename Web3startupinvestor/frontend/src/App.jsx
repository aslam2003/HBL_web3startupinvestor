import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import HomePage from "./components/HomePage";
import StartupRegistrationForm from "./components/StartupRegistrationForm";
import StartupList from "./components/StartupList";
import InvestorPage from "./components/InvestorPage";
import Contractdata from "./contracts/StartupInvestorDApp.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x0AcE6B89cC3A91CB9087394329728553fe464923";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [startups, setStartups] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
  
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
  
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
  
          const contractInstance = new web3Instance.eth.Contract(
            Contractdata.abi,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Web3 Initialization Failed:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
  
    initWeb3();
  }, []);
  

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Wallet Connection Failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const client = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      Authorization: `Basic ${btoa(
        "d0a95f93c9f746cd8b0281cd9fb1d9ff:b0b96b49925b497ab4b240130e1399e1"
      )}`,
    },
  });

  const handleRegisterStartup = async (startupData) => {
    try {
      if (!contract || !account) {
        alert("Contract or account not loaded.");
        return;
      }

      const { name, logo, domain, description, estimatedCost } = startupData;

      if (!name || !logo || !domain || !description || !estimatedCost) {
        alert("Please fill all fields.");
        return;
      }

      const jsonData = JSON.stringify({ name, domain, description, estimatedCost });
      const { cid: textCid } = await client.add(jsonData);
      const ipfsTextHash = textCid.toString();

      let ipfsLogoHash = "";
      if (logo instanceof File || logo instanceof Blob) {
        const { cid: logoCid } = await client.add(logo);
        ipfsLogoHash = logoCid.toString();
      }

      await contract.methods
        .registerStartup(name, domain, description, ipfsTextHash, estimatedCost, ipfsLogoHash)
        .send({ from: account });

      alert("Startup registered successfully!");
      fetchStartups();
    } catch (error) {
      console.error("Error registering startup:", error);
      alert("Failed to register startup.");
    }
  };

  const fetchStartups = async () => {
    if (contract) {
      try {
        const startupList = await contract.methods.getOtherStartups().call();
        setStartups(startupList);
      } catch (error) {
        console.error("Error fetching startups:", error);
      }
    }
  };

  useEffect(() => {
    if (contract) {
      fetchStartups();
    }
  }, [contract]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage onConnectWallet={connectWallet} isConnected={isConnected} />} />
          <Route path="/register" element={isConnected ? <StartupRegistrationForm onRegister={handleRegisterStartup} /> : <Navigate to="/" />} />
          <Route path="/startups" element={isConnected ? <StartupList startups={startups} /> : <Navigate to="/" />} />
          <Route path="/investor" element={isConnected ? <InvestorPage startups={startups} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
