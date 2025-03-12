// frontend/src/api/userAPI.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get user profile
export const getUserProfileAPI = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/users/profile`, config);
  return response.data;
};

// Update user profile
export const updateUserProfileAPI = async (userData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/users/profile`, userData, config);
  return response.data;
};
