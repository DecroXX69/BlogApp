// frontend/src/api/blogAPI.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all blogs
export const getBlogsAPI = async (keyword = '', pageNumber = 1, publishedOnly = true, category = '') => {
  let url = `${API_URL}/blogs?keyword=${keyword}&pageNumber=${pageNumber}&published=${publishedOnly}`;
  
  if (category) {
    url += `&category=${category}`;
  }
  
  const response = await axios.get(url);
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

// Get blog by shareable link
export const getBlogByShareableLinkAPI = async (shareableLink) => {
  const response = await axios.get(`${API_URL}/blogs/share/${shareableLink}`);
  return response.data;
};

// Create blog
export const createBlogAPI = async (blogData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
      throw new Error('No authentication token found');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    console.log('Request URL:', `${API_URL}/blogs`);
    console.log('Request Headers:', config.headers);
    console.log('Request Data:', blogData);

    const response = await axios.post(`${API_URL}/blogs`, blogData, config);
    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
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

// Get categories
export const getCategoriesAPI = async () => {
  const response = await axios.get(`${API_URL}/blogs/categories`);
  return response.data;
};

// Add this to src/api/blogAPI.js
export const testConnectionAPI = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
      throw new Error('No authentication token found');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    
    const response = await axios.post(`${API_URL}/blogs/test-connection`, {}, config);
    console.log('Test connection response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Test connection error:', error);
    throw error;
  }
};