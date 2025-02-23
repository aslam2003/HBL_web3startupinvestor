//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract StartupInvestorDApp {
    struct Startup {
        address owner;
        string name;
        string description;
        string domain;
        uint256 estimatedCost;
        bool exists;
    }

    struct Collaboration {
        address startup1;
        address startup2;
        string combinedIdea;
        bool exists;
    }

    mapping(address => Startup) public startups;
    mapping(bytes32 => Collaboration) public collaborations;
    address[] public startupList;

    event StartupRegistered(address indexed owner, string name, string description);
    event CollaborationCreated(address indexed startup1, address indexed startup2, string combinedIdea);
    event InvestmentReceived(address indexed investor, address indexed startup, uint256 amount);

    function registerStartup(string memory _name, string memory _description, string memory _domain, uint256 _estimatedCost) external {
        require(!startups[msg.sender].exists, "Startup already registered");
        startups[msg.sender] = Startup(msg.sender, _name, _description, _domain, _estimatedCost, true);
        startupList.push(msg.sender);
        emit StartupRegistered(msg.sender, _name, _description);
    }

    function getOtherStartups() external view returns (Startup[] memory) {
        uint256 count = startupList.length - 1;
        Startup[] memory otherStartups = new Startup[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < startupList.length; i++) {
            if (startupList[i] != msg.sender) {
                otherStartups[index] = startups[startupList[i]];
                index++;
            }
        }
        return otherStartups;
    }

    function collaborate(address _otherStartup, string memory _combinedIdea) external {
    // require(startups[msg.sender].exists, "You are not a registered startup");
    require(startups[_otherStartup].exists, "The other startup is not registered");
    require(msg.sender != _otherStartup, "Cannot collaborate with yourself");

    bytes32 collaborationKey = keccak256(abi.encodePacked(msg.sender, _otherStartup));
    require(!collaborations[collaborationKey].exists, "Collaboration already exists");

    collaborations[collaborationKey] = Collaboration(msg.sender, _otherStartup, _combinedIdea, true);
    emit CollaborationCreated(msg.sender, _otherStartup, _combinedIdea);
}


    mapping(address => uint256) public investments;

function invest(address _startup) external payable {
    require(startups[_startup].exists, "Startup not registered");
    require(msg.value > 0, "Investment amount must be greater than 0");

    investments[_startup] += msg.value;
    payable(_startup).transfer(msg.value);
    
    emit InvestmentReceived(msg.sender, _startup, msg.value);
}

}
 

