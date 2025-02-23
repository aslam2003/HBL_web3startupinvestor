const { ethers } = require("hardhat");

async function main() {
    const StartupInvestorDApp = await ethers.getContractFactory("StartupInvestorDApp");
    
    console.log("Deploying contract...");
    
    const startupInvestorDApp = await StartupInvestorDApp.deploy(); // ✅ Deploy contract properly
    
    console.log("StartupInvestorDApp deployed to:", startupInvestorDApp.target); // ✅ Use .target instead of .address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
