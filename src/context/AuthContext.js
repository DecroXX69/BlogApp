// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI } from '../api/authAPI';
import { getUserProfileAPI, updateUserProfileAPI } from '../api/userAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userFromStorage = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    
    setUser(userFromStorage);
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginAPI(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await registerAPI(name, email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserProfileAPI();
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateUserProfileAPI(userData);
      
      // Update local storage with new user data but keep the token
      const newUserData = { ...updatedUser, token: user.token };
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        getUserProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};