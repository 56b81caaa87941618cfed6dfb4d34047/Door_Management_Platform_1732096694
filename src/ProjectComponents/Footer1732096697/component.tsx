
import React from 'react';
import { ethers } from 'ethers';

const contractABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const Footer: React.FC = () => {
  const [userBalance, setUserBalance] = React.useState<string>('0');
  const [amount, setAmount] = React.useState<string>('');
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  const contractAddress = '0x4cA4A8685dC71A87771A82534fC3FA0d946BB403';
  const chainId = 11155111; // Sepolia testnet

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        setIsConnected(true);

        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(chainId) }],
            });
          } catch (switchError) {
            console.error('Failed to switch to the correct network:', switchError);
          }
        }

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
        updateBalance(contract);
      } catch (error) {
        console.error('Failed to connect to the wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const updateBalance = async (contract: ethers.Contract) => {
    try {
      const balance = await contract.getBalance();
      setUserBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleDeposit = async () => {
    if (!contract || !signer) {
      await connectWallet();
    }
    if (contract && signer) {
      try {
        const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        updateBalance(contract);
        setAmount('');
      } catch (error) {
        console.error('Error during deposit:', error);
      }
    }
  };

  const handleWithdraw = async () => {
    if (!contract || !signer) {
      await connectWallet();
    }
    if (contract && signer) {
      try {
        const tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        updateBalance(contract);
        setAmount('');
      } catch (error) {
        console.error('Error during withdrawal:', error);
      }
    }
  };

  return (
    <footer className="bg-green-800 text-white p-5 w-full">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="text-xl font-bold">DoorMaster Deposit Contract</h3>
            <p className="text-sm text-gray-300">Interact with our smart contract on Sepolia testnet</p>
          </div>
          
          <div className="w-full md:w-2/3">
            {!isConnected ? (
              <button onClick={connectWallet} className="bg-white text-green-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100">
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-2">
                <p>Your Balance: {userBalance} ETH</p>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in ETH"
                  className="bg-white text-green-800 px-4 py-2 rounded-lg shadow-md w-full md:w-auto"
                />
                <button onClick={handleDeposit} className="bg-white text-green-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 w-full md:w-auto">
                  Deposit
                </button>
                <button onClick={handleWithdraw} className="bg-white text-green-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 w-full md:w-auto">
                  Withdraw
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-300">
          © 2023 DoorMaster. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export { Footer as component };
