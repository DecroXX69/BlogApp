// frontend/src/api/blogAPI.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all blogs
export const getBlogsAPI = async (keyword = '', pageNumber = 1, publishedOnly = true) => {
  const response = await axios.get(
    `${API_URL}/blogs?keyword=${keyword}&pageNumber=${pageNumber}&published=${publishedOnly}`
  );
  return response.data;
};

// Get blog by ID
export const getBlogByIdAPI = async (id) => {
  const response = await axios.get(`${API_URL}/blogs/${id}`);
  return response.data;
};

// Get blog by slug
export const getBlogBySlugAPI = async (slug) => {
  const response = await axios.get(`${API_URL}/blogs/slug/${slug}`);
  return response.data;
};

// Create blog
export const createBlogAPI = async (blogData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/blogs`, blogData, config);
  return response.data;
};

// Update blog
export const updateBlogAPI = async (id, blogData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, config);
  return response.data;
};

// Delete blog
export const deleteBlogAPI = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/blogs/${id}`, config);
  return response.data;
};

// Get user blogs
export const getUserBlogsAPI = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/blogs/user`, config);
  return response.data;
};