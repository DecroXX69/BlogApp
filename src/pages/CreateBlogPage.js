// src/pages/CreateBlogPage.js
import React, { useState, useContext, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../components/blog/BlogForm';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { BlogContext } from '../context/BlogContext';
import styles from '../styles/modules/Blog.module.css';

const CreateBlogPage = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { createBlog, loading } = useContext(BlogContext);
  const navigate = useNavigate();
  
  // Use a ref to prevent multiple submissions
  const isSubmitting = useRef(false);

  const handleCreateBlog = async (blogData) => {
    // Prevent duplicate submissions
    if (isSubmitting.current) return;
    
    try {
      isSubmitting.current = true;
      setError(null);
      
      const newBlog = await createBlog(blogData);
      
      setSuccess(true);
      
      // Add small delay to show success message before redirecting
      setTimeout(() => {
        navigate(`/blogs/${newBlog._id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
      setSuccess(false);
      isSubmitting.current = false;
    }
  };

  return (
    <Container className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Create New Blog</h1>
      
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Blog created successfully! Redirecting...</Message>}
      
      {loading && !success ? (
        <Loader />
      ) : (
        <BlogForm onSubmit={handleCreateBlog} submitButtonText="Publish Blog" />
      )}
    </Container>
  );
};

export default CreateBlogPage;