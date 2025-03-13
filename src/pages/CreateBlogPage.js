import React, { useContext, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import BlogForm from '../components/blog/BlogForm';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const CreateBlogPage = () => {
  const { createBlog } = useContext(BlogContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (blogData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Create blog post
      const newBlog = await createBlog(blogData);
      
      // Set success state
      setSuccess(true);
      
      // Navigate after a short delay to ensure state updates complete
      setTimeout(() => {
        navigate(`/blogs/${newBlog.slug}`);
      }, 500);
      
      return newBlog;
    } catch (err) {
      setError(err.message || 'Failed to create blog post');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Card className="mt-4 mb-4">
        <Card.Header as="h1">Create New Blog</Card.Header>
        <Card.Body>
          {submitting ? (
            <Loader />
          ) : success ? (
            <Message variant="success">
              Blog post created successfully! Redirecting...
            </Message>
          ) : (
            <>
              {error && <Message variant="danger">{error}</Message>}
              <BlogForm 
                onSubmit={handleSubmit} 
                submitButtonText="Publish Blog"
              />
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateBlogPage;