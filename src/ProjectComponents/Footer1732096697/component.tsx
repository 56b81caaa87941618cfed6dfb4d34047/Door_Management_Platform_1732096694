
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
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  const contractAddress = '0x9477e53c4b8a053D45cB588A543Ea6870F79d022';
  const chainId = 17000; // Holesky testnet

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
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: ethers.utils.hexValue(chainId),
                      chainName: 'Holesky',
                      nativeCurrency: {
                        name: 'Holesky ETH',
                        symbol: 'ETH',
                        decimals: 18
                      },
                      rpcUrls: ['https://ethereum-holesky.publicnode.com'],
                      blockExplorerUrls: ['https://holesky.etherscan.io/']
                    },
                  ],
                });
              } catch (addError) {
                console.error('Failed to add the Holesky network:', addError);
              }
            } else {
              console.error('Failed to switch to the Holesky network:', switchError);
            }
          }
        }

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
        updateBalance(contract);
        checkOwner(contract, await signer.getAddress());
        checkPaused(contract);
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

  const checkOwner = async (contract: ethers.Contract, address: string) => {
    try {
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error('Error checking owner:', error);
    }
  };

  const checkPaused = async (contract: ethers.Contract) => {
    try {
      const paused = await contract.paused();
      setIsPaused(paused);
    } catch (error) {
      console.error('Error checking paused state:', error);
    }
  };

  const handleDeposit = async () => {
    if (!contract || !signer) {
      await connectWallet();
      return;
    }
    try {
      const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      updateBalance(contract);
      setAmount('');
    } catch (error: any) {
      console.error('Error during deposit:', error);
      if (error.message.includes('paused')) {
        alert('The contract is currently paused. Deposits are not allowed.');
      }
    }
  };

  const handleWithdraw = async () => {
    if (!contract || !signer) {
      await connectWallet();
      return;
    }
    try {
      const tx = await contract.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      updateBalance(contract);
      setAmount('');
    } catch (error: any) {
      console.error('Error during withdrawal:', error);
      if (error.message.includes('paused')) {
        alert('The contract is currently paused. Withdrawals are not allowed.');
      } else if (error.message.includes('Insufficient balance')) {
        alert('Insufficient balance for withdrawal.');
      }
    }
  };

  const handlePause = async () => {
    if (!contract || !signer || !isOwner) return;
    try {
      const tx = await contract.pause();
      await tx.wait();
      setIsPaused(true);
    } catch (error) {
      console.error('Error pausing contract:', error);
    }
  };

  const handleUnpause = async () => {
    if (!contract || !signer || !isOwner) return;
    try {
      const tx = await contract.unpause();
      await tx.wait();
      setIsPaused(false);
    } catch (error) {
      console.error('Error unpausing contract:', error);
    }
  };

  return (
    <footer className="bg-blue-800 text-white p-5 w-full">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Deposit Contract on Holesky</h3>
            <p className="text-sm text-gray-300">Interact with our smart contract on Holesky testnet</p>
          </div>
          
          <div className="w-full md:w-2/3">
            {!isConnected ? (
              <button onClick={connectWallet} className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100">
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
                  className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-md w-full md:w-auto"
                />
                <button onClick={handleDeposit} className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 w-full md:w-auto" disabled={isPaused}>
                  Deposit
                </button>
                <button onClick={handleWithdraw} className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 w-full md:w-auto" disabled={isPaused}>
                  Withdraw
                </button>
                {isOwner && (
                  <div className="mt-2">
                    <button onClick={handlePause} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 w-full md:w-auto" disabled={isPaused}>
                      Pause Contract
                    </button>
                    <button onClick={handleUnpause} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 w-full md:w-auto ml-2" disabled={!isPaused}>
                      Unpause Contract
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-300">
          © 2023 Deposit Contract. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export { Footer as component };
