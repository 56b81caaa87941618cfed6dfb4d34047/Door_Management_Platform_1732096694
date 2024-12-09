
import React from 'react';
import { ethers } from 'ethers';

const DepositHero: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = React.useState<string>('');
  const [balance, setBalance] = React.useState<string>('0');
  const [depositAmount, setDepositAmount] = React.useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const contractAddress = '0x9477e53c4b8a053D45cB588A543Ea6870F79d022';
  const chainId = 17000; // Holesky

  const contractABI = [
    "function deposit() payable",
    "function withdraw(uint256 amount)",
    "function getBalance() view returns (uint256)"
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
            setError('Please switch to the Holesky network');
            return;
          }
        }
        const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);
        setContract(newContract);
        await updateBalance(newContract);
      } catch (error) {
        setError('Failed to connect wallet');
      }
    }
  };

  const updateBalance = async (depositContract: ethers.Contract) => {
    const balance = await depositContract.getBalance();
    setBalance(ethers.utils.formatEther(balance));
  };

  const handleDeposit = async () => {
    if (contract && signer) {
      try {
        const tx = await contract.deposit({ value: ethers.utils.parseEther(depositAmount) });
        await tx.wait();
        await updateBalance(contract);
        setDepositAmount('');
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleWithdraw = async () => {
    if (contract && signer) {
      try {
        const tx = await contract.withdraw(ethers.utils.parseEther(withdrawAmount));
        await tx.wait();
        await updateBalance(contract);
        setWithdrawAmount('');
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="bg-gray-100 py-16 w-full min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Deposit dApp</h1>
        {!signer ? (
          <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">Connected Address: {userAddress}</p>
            <p className="mb-4 text-xl font-semibold text-gray-800">Your Balance: {balance} ETH</p>
            <div className="mb-4">
              <input
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount to deposit (ETH)"
                className="mr-2 p-2 text-gray-700 rounded border border-gray-300"
              />
              <button onClick={handleDeposit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Deposit
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount to withdraw (ETH)"
                className="mr-2 p-2 text-gray-700 rounded border border-gray-300"
              />
              <button onClick={handleWithdraw} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Withdraw
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export { DepositHero as component };
