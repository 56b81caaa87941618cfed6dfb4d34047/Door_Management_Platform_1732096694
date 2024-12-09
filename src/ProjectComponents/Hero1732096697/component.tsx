
import React from 'react';
import { ethers } from 'ethers';

const StakingHero: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = React.useState<string>('');
  const [balance, setBalance] = React.useState<string>('0');
  const [stakedBalance, setStakedBalance] = React.useState<string>('0');
  const [rewards, setRewards] = React.useState<string>('0');
  const [stakeAmount, setStakeAmount] = React.useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const contractAddress = '0x106e51AEA742b6FC5303457A0faB7eE09B5464B5';
  const chainId = 11155111; // Sepolia

  const contractABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function stakedBalance(address account) view returns (uint256)",
    "function calculateRewards(address user) view returns (uint256)",
    "function stake(uint256 amount)",
    "function unstake(uint256 amount)",
    "function claimRewards()"
  ];

  React.useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
      } else {
        setError('Please install MetaMask to use this dApp');
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const newSigner = provider.getSigner();
        setSigner(newSigner);
        const address = await newSigner.getAddress();
        setUserAddress(address);
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(chainId) }],
            });
          } catch (switchError: any) {
            setError('Please switch to the Sepolia network');
            return;
          }
        }
        const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);
        setContract(newContract);
        await updateBalances(newContract, address);
      } catch (error) {
        setError('Failed to connect wallet');
      }
    }
  };

  const updateBalances = async (stakingContract: ethers.Contract, address: string) => {
    const tokenBalance = await stakingContract.balanceOf(address);
    setBalance(ethers.utils.formatEther(tokenBalance));
    const staked = await stakingContract.stakedBalance(address);
    setStakedBalance(ethers.utils.formatEther(staked));
    const calculatedRewards = await stakingContract.calculateRewards(address);
    setRewards(ethers.utils.formatEther(calculatedRewards));
  };

  const handleStake = async () => {
    if (contract && signer) {
      try {
        const tx = await contract.stake(ethers.utils.parseEther(stakeAmount));
        await tx.wait();
        await updateBalances(contract, await signer.getAddress());
        setStakeAmount('');
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleUnstake = async () => {
    if (contract && signer) {
      try {
        const tx = await contract.unstake(ethers.utils.parseEther(unstakeAmount));
        await tx.wait();
        await updateBalances(contract, await signer.getAddress());
        setUnstakeAmount('');
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleClaimRewards = async () => {
    if (contract && signer) {
      try {
        const tx = await contract.claimRewards();
        await tx.wait();
        await updateBalances(contract, await signer.getAddress());
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="bg-black py-16 text-white w-full min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Staking dApp</h1>
        {!signer ? (
          <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="mb-4">Connected Address: {userAddress}</p>
            <p className="mb-2">Token Balance: {balance} STK</p>
            <p className="mb-2">Staked Balance: {stakedBalance} STK</p>
            <p className="mb-4">Pending Rewards: {rewards} STK</p>
            <div className="mb-4">
              <input
                type="text"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to stake"
                className="mr-2 p-2 text-black rounded"
              />
              <button onClick={handleStake} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Stake
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="Amount to unstake"
                className="mr-2 p-2 text-black rounded"
              />
              <button onClick={handleUnstake} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Unstake
              </button>
            </div>
            <button onClick={handleClaimRewards} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
              Claim Rewards
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export { StakingHero as component };
