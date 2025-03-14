// frontend/src/components/Header.js
import React, { useState } from "react";
import { connectWallet } from "../api/blogAPI";

const Header = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      console.log("Connected:", address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please ensure MetaMask is installed and configured.");
    }
  };

  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <h1>Decentralized Blog</h1>
      {walletAddress ? (
        <span>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
      ) : (
        <button onClick={handleConnectWallet}>Connect MetaMask</button>
      )}
    </nav>
  );
};

export default Header;