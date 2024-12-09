
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract StakingContract1732096698 is ERC20, Ownable {
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingTimestamp;
    
    uint256 public constant REWARD_RATE = 1e15; // 0.001 tokens per second per staked token

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Staking Token", "STK") Ownable() {
        _mint(msg.sender, 1000000 * 10**decimals()); // Mint 1,000,000 tokens to the contract deployer
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);
        
        if (stakedBalance[msg.sender] > 0) {
            uint256 reward = calculateRewards(msg.sender);
            _mint(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }

        stakedBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake 0 tokens");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        uint256 reward = calculateRewards(msg.sender);
        _mint(msg.sender, reward);

        stakedBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);

        stakingTimestamp[msg.sender] = block.timestamp;

        emit Unstaked(msg.sender, amount);
        emit RewardsClaimed(msg.sender, reward);
    }

    function claimRewards() external {
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards to claim");

        _mint(msg.sender, reward);
        stakingTimestamp[msg.sender] = block.timestamp;

        emit RewardsClaimed(msg.sender, reward);
    }

    function calculateRewards(address user) public view returns (uint256) {
        uint256 stakedTime = block.timestamp - stakingTimestamp[user];
        return (stakedBalance[user] * stakedTime * REWARD_RATE) / 1e18;
    }
}
