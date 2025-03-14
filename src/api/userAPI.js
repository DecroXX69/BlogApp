import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Get user profile (wallet address)
export const getUserProfileAPI = async () => {
  const address = await signer.getAddress();
  return { address, isAdmin: false }; // No admin concept unless added to smart contract
};

// Update user profile (not applicable in this context, as profile is wallet-based)
export const updateUserProfileAPI = async () => {
  throw new Error('Profile updates not supported in decentralized mode');
};