import { ethers } from "ethers";
import PinataSDK from "@pinata/sdk";

const CONTRACT_ADDRESS = "YOUR_FUJI_CONTRACT_ADDRESS"; // From deployment
const CONTRACT_ABI = [/* ABI from artifacts */];

const pinata = new PinataSDK("YOUR_PINATA_API_KEY", "YOUR_PINATA_SECRET_KEY");

// Initialize provider for Avalanche Fuji
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// Connect wallet function
export const connectWallet = async () => {
  try {
    // Request account access
    await provider.send("eth_requestAccounts", []);

    // Switch to Avalanche Fuji network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa869" }], // Fuji Chain ID in hex (43113)
    });

    const address = await signer.getAddress();
    return { message: "Wallet connected", address };
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added to MetaMask, add it
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xa869",
            chainName: "Avalanche Fuji C-Chain",
            rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.snowtrace.io"],
          },
        ],
      });
      return connectWallet(); // Retry after adding chain
    }
    throw error;
  }
};

// Upload content to IPFS
const uploadToIPFS = async (data) => {
  const result = await pinata.pinJSONToIPFS(data);
  return result.IpfsHash;
};

// Get all blogs
export const getBlogsAPI = async (publishedOnly = true) => {
  const allBlogs = await contract.getAllBlogs();
  return allBlogs.filter(blog => !publishedOnly || blog.published);
};

// Get blog by ID
export const getBlogByIdAPI = async (id) => {
  const blog = await contract.getBlog(id);
  return {
    id: blog.id.toString(),
    author: blog.author,
    title: blog.title,
    excerpt: blog.excerpt,
    contentHash: blog.contentHash,
    featuredImageHash: blog.featuredImageHash,
    tags: blog.tags,
    published: blog.published,
    createdAt: blog.createdAt.toString(),
    publishedAt: blog.publishedAt.toString(),
  };
};

// Create blog
export const createBlogAPI = async (blogData) => {
  const { title, content, excerpt, featuredImage, tags, published } = blogData;

  // Upload content and image to IPFS
  const contentHash = await uploadToIPFS({ content });
  const featuredImageHash = featuredImage ? await uploadToIPFS({ image: featuredImage }) : '';

  const tx = await contract.createBlog(
    title,
    excerpt,
    contentHash,
    featuredImageHash,
    tags.split(',').map(tag => tag.trim()),
    published
  );
  await tx.wait();
  return { id: (await contract.blogCount()).toString() };
};

// Update blog
export const updateBlogAPI = async (id, blogData) => {
  const { title, content, excerpt, featuredImage, tags, published } = blogData;

  const contentHash = await uploadToIPFS({ content });
  const featuredImageHash = featuredImage ? await uploadToIPFS({ image: featuredImage }) : '';

  const tx = await contract.updateBlog(
    id,
    title,
    excerpt,
    contentHash,
    featuredImageHash,
    tags.split(',').map(tag => tag.trim()),
    published
  );
  await tx.wait();
  return { id };
};

// Delete blog
export const deleteBlogAPI = async (id) => {
  const tx = await contract.deleteBlog(id);
  await tx.wait();
  return { message: 'Blog removed' };
};

// Get user blogs
export const getUserBlogsAPI = async () => {
  const address = await signer.getAddress();
  const blogIds = await contract.getUserBlogs(address);
  const blogs = await Promise.all(
    blogIds.map(async (id) => await getBlogByIdAPI(id.toString()))
  );
  return blogs;
};

// Test connection
export const testConnectionAPI = async () => {
  try {
    await provider.send('eth_requestAccounts', []);
    const address = await signer.getAddress();
    console.log('Connected wallet:', address);
    return { message: 'Connected successfully', address };
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
};