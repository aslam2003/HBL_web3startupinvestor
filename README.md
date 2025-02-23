# HBL_web3startupinvestor
Blockchain-Based Startup Funding Platform

Welcome to the Blockchain-Based Startup Funding Platform – an open-source decentralized application (DApp) developed by Team Sparks. This platform aims to revolutionize startup funding by leveraging blockchain technology to ensure transparency, efficiency, and global participation.

---
 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact & Acknowledgments](#contact--acknowledgments)

---

Overview

This platform connects startups and investors on a global scale. By eliminating high fees and manual processing, it facilitates:
- Secure registration via MetaMask
- Transparent on-chain records for startup details and funding history
- Automated verification and funding approvals using smart contracts
- Decentralized collaboration between startups
- Reliable media storage using IPFS

---

Problem Statement

Startups often fail due to:
- Insufficient funding and lack of visibility
- Trust issues between investors and startups
- High fees and slow manual verification processes on traditional platforms

These challenges hinder collaboration and growth. Our platform addresses these issues by providing a decentralized, automated, and transparent funding ecosystem.

---

Proposed Solution

The platform offers:

- Decentralized Authentication: Users sign up using MetaMask, ensuring secure and blockchain-native authentication.
- On-Chain Transparency: Startup details, investor profiles, and funding histories are recorded on-chain.
- Smart Contract Automation: Funding approvals, collaboration requests, and milestone-based fund releases are managed via smart contracts.
- Decentralized Storage: Media files (images, videos, documents) are stored on IPFS to ensure scalability and reliability.
- Global Participation: By eliminating registration fees and manual verification, startups and investors worldwide can easily join the platform.

---

## Technologies Used

- Frontend: ReactJS
- Smart Contracts: Solidity
- Blockchain Interaction: ethers.js / web3.js
- Authentication: MetaMask
- Media Storage: IPFS
- Additional Tools: Truffle or Hardhat for deployment

---

## Features

- User Registration & Login:  
  Authenticate using MetaMask; sign messages to prove wallet ownership.
  
- Startup Onboarding:  
  Startups submit key details (name, description, estimated costs, media) with data stored on-chain and on IPFS.

- Investor Interaction:  
  Investors can browse, evaluate, and fund startups using cryptocurrencies.

- Collaboration Mechanism:  
  Startups send and receive collaboration requests managed by smart contracts, with conflict resolution via DAO-based voting or prioritized queues.

- Automated Funding:  
  Funds are locked in escrow and released upon milestone achievements, ensuring accountability.

- Transparent Transaction History:  
  All transactions and collaboration details are permanently recorded on the blockchain.

---
## Setup & Installation

 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MetaMask extension installed in your browser
- Truffle or Hardhat (for smart contract deployment)
- Optional: An IPFS node or access to a public IPFS gateway

### Steps to Get Started

1. Clone the Repository:
   ```bash
   git clone https://github.com/yourusername/startup-funding-platform.git
   cd startup-funding-platform
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Deploy Smart Contracts:
   - Configure deployment settings in `truffle-config.js` or `hardhat.config.js`.
   - Deploy to a test network (e.g., Rinkeby, Mumbai):
     ```bash
     truffle migrate --network rinkeby
     ```
     or
     ```bash
     npx hardhat run scripts/deploy.js --network rinkeby
     ```

4. Start the Frontend:
   ```bash
   npm rundev
  '''
   Open your browser and ensure your MetaMask is connected to the same network as your deployed contracts.

5. Configure IPFS (Optional):
   - If using IPFS for media storage, run a local IPFS node or connect to a public gateway.

---
 ## Usage

- User Registration:  
  Click "Sign In with MetaMask" to authenticate. Your wallet address serves as your unique identifier.

- Submitting Startup Details:  
  Startups fill out forms with details and media uploads, which are then recorded on-chain and stored on IPFS.

- Funding Process:  
  Investors browse through startup profiles and fund them using cryptocurrency. Smart contracts automate fund disbursement based on milestone completion.

- Collaboration Requests:  
  Startups send and receive collaboration requests. Requests are managed through smart contracts and can be prioritized based on criteria like reputation or funding status.

---

## Contributing

Contributions are welcome! If you’d like to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed explanation of your changes.

For major changes, please open an issue first to discuss your ideas.

---

License

This project is licensed under the MIT License.

---

## Contact 

Team Sparks:  
- Mohamed Aslam M  
- Kousick Krishna S  
- Padmapriya B  
  

