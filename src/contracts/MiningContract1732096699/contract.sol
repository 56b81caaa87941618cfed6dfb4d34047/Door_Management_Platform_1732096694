
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract MiningContract1732096699 is ERC20, Ownable, ReentrancyGuard {
    struct MinerInfo {
        uint256 contribution;
        uint256 startTime;
        bool isMining;
    }

    mapping(address => MinerInfo) public miners;
    bool public isMiningActive;
    uint256 public rewardRate; // Tokens per second per ETH contributed

    event MiningStarted(address indexed miner, uint256 contribution);
    event MiningStopped(address indexed miner);
    event RewardsClaimed(address indexed miner, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    event MiningToggled(bool isActive);

    constructor() ERC20("MiningToken", "MTK") Ownable() {
        rewardRate = 1e15; // 0.001 tokens per second per ETH by default
        isMiningActive = true;
        _mint(address(this), 1000000 * 10**decimals()); // Mint 1,000,000 tokens to the contract
    }

    function startMining() external payable {
        require(isMiningActive, "Mining is not active");
        require(msg.value > 0, "Contribution required");
        
        if (miners[msg.sender].isMining) {
            claimRewards();
        }
        
        miners[msg.sender] = MinerInfo({
            contribution: msg.value,
            startTime: block.timestamp,
            isMining: true
        });
        
        emit MiningStarted(msg.sender, msg.value);
    }

    function stopMining() external {
        require(miners[msg.sender].isMining, "Not mining");
        claimRewards();
        miners[msg.sender].isMining = false;
        payable(msg.sender).transfer(miners[msg.sender].contribution);
        miners[msg.sender].contribution = 0;
        emit MiningStopped(msg.sender);
    }

    function claimRewards() public nonReentrant {
        require(miners[msg.sender].isMining, "Not mining");
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards to claim");
        
        miners[msg.sender].startTime = block.timestamp;
        _transfer(address(this), msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }

    function calculateReward(address miner) public view returns (uint256) {
        MinerInfo memory minerInfo = miners[miner];
        if (!minerInfo.isMining) return 0;
        
        uint256 duration = block.timestamp - minerInfo.startTime;
        return (minerInfo.contribution * duration * rewardRate) / 1 ether;
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    function toggleMining() external onlyOwner {
        isMiningActive = !isMiningActive;
        emit MiningToggled(isMiningActive);
    }
}
