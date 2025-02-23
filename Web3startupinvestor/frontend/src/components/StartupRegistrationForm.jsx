import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StartupRegistrationForm.css";
import Contractdata from "../contracts/StartupInvestorDApp.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS";

const StartupRegistrationForm = ({ onRegister }) => {
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [kycDocument, setKycDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) {
        alert("No accounts found. Please connect to MetaMask.");
        return;
      }
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    if (!logo || !kycDocument) {
      alert("Please upload both the Logo and KYC Document.");
      setLoading(false);
      return;
    }
    try {
      const base64Logo = await convertFileToBase64(logo);
      const base64Kyc = await convertFileToBase64(kycDocument);
      const metadata = { name, domain, description, estimatedCost, logo: base64Logo, kycDocument: base64Kyc, walletAddress: account };
      const metadataIpfsHash = await uploadJsonToPinata(metadata);
      await registerStartupOnBlockchain(metadata);
      onRegister(metadataIpfsHash);
      setSuccess(true);
    } catch (error) {
      console.error("Error uploading to Pinata or Blockchain:", error);
    } finally {
      setLoading(false);
    }
  };

  const registerStartupOnBlockchain = async (metadata) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Contractdata.abi, signer);
      const tx = await contract.registerStartup(metadata.name, metadata.description, metadata.domain, ethers.parseEther(metadata.estimatedCost.toString()));
      await tx.wait();
      console.log("Startup registered on blockchain!");
    } catch (error) {
      console.error("Blockchain registration failed:", error);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadJsonToPinata = async (metadata) => {
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_PINATA_JWT`,
        },
      });
      return res.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h2>Startup Registration</h2>
      <p>Connected Wallet: {account ? account : "Not connected"}</p>
      <button type="button" onClick={connectWallet}>Connect Wallet</button>
      <label>Startup Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <label>Domain:</label>
      <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} required />
      <label>Short Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      <label>Estimated Cost (ETH):</label>
      <input type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} required />
      <label>Upload Logo:</label>
      <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} required />
      <label>Upload KYC Document (PDF or Image):</label>
      <input type="file" accept="image/*,application/pdf" onChange={(e) => setKycDocument(e.target.files[0])} required />
      <button type="submit" className="button-style" disabled={loading}>{loading ? "Uploading..." : "Register"}</button>
      {success && <p>✅ Startup registered successfully!</p>}
      <button type="button" className="button-style" onClick={() => navigate("/startups")}>
        List Registered Startups
      </button>
    </form>
  );
};

export default StartupRegistrationForm;
