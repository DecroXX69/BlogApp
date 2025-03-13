import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BlogContext } from '../context/BlogContext';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import BlogCard from '../components/blog/BlogCard';
import styles from '../styles/modules/Profile.module.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogsError, setBlogsError] = useState(null);
  
  const { user, updateUserProfile, isLoading, error } = useContext(AuthContext);
  const { getUserBlogs, userBlogs } = useContext(BlogContext);
  
  // Load user blogs with proper error handling
  const loadUserBlogs = useCallback(async () => {
    try {
      setLoadingBlogs(true);
      setBlogsError(null);
      await getUserBlogs();
    } catch (err) {
      setBlogsError(err.message || 'Failed to load your blogs');
    } finally {
      setLoadingBlogs(false);
    }
  }, [getUserBlogs]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        bio: user.bio || ''
      });
      
      // Load user's blogs when switching to the "My Blogs" tab
      if (activeTab === 'blogs') {
        loadUserBlogs();
      }
    }
  }, [user, activeTab, loadUserBlogs]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio
      };
      
      if (formData.password) {
        updatedData.password = formData.password;
      }
      
      await updateUserProfile(updatedData);
      setSuccess(true);
      
      // Clear passwords after update
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      // Error handled in context
    }
  };

  const renderUserBlogs = () => {
    if (loadingBlogs) {
      return <Loader />;
    }
    
    if (blogsError) {
      return <Message variant="danger">{blogsError}</Message>;
    }
    
    if (!userBlogs || userBlogs.length === 0) {
      return (
        <Alert variant="info">
          You haven't created any blog posts yet.
        </Alert>
      );
    }
    
    return (
      <Row>
        {userBlogs.map(blog => (
          <Col md={6} lg={6} key={blog._id} className="mb-4">
            <Card className={styles.blogCard}>
              <Card.Body>
                <h4>{blog.title}</h4>
                <p className="text-muted small">
                  {new Date(blog.createdAt).toLocaleDateString()} • 
                  {blog.isPublished ? (
                    <span className="text-success"> Published</span>
                  ) : (
                    <span className="text-secondary"> Draft</span>
                  )}
                </p>
                <p>{blog.summary || blog.content.substring(0, 100)}...</p>
                <div className="d-flex justify-content-between mt-3">
                  <Link to={`/blogs/${blog.slug}`} className="btn btn-sm btn-outline-primary">
                    View
                  </Link>
                  <Link to={`/edit-blog/${blog._id}`} className="btn btn-sm btn-outline-secondary">
                    Edit
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };
  
  return (
    <Row className="my-4">
      <Col md={3}>
        <Card className={styles.profileNav}>
          <Card.Body>
            <div 
              className={`${styles.profileNavItem} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </div>
            <div 
              className={`${styles.profileNavItem} ${activeTab === 'blogs' ? styles.active : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              My Blogs
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={9}>
        {activeTab === 'profile' ? (
          <Card className={styles.profileCard}>
            <Card.Body>
              <h2 className="mb-4">Profile Settings</h2>
              
              {error && <Message variant="danger">{error}</Message>}
              {errorMessage && <Message variant="danger">{errorMessage}</Message>}
              {success && <Message variant="success">Profile updated successfully!</Message>}
              
              {isLoading ? (
                <Loader />
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="profileName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="profileEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="profileBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </Form.Group>
                  
                  <hr className="my-4" />
                  <h4>Change Password</h4>
                  <p className="text-muted small">Leave blank to keep current password</p>
                  
                  <Form.Group className="mb-3" controlId="profilePassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="profileConfirmPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className={`${styles.submitButton} mt-3`}
                  >
                    Update Profile
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Card className={styles.profileCard}>
            <Card.Body>
              <h2 className="mb-4">My Blog Posts</h2>
              
              {renderUserBlogs()}
              
              <div className="text-center mt-4">
                <Link 
                  to="/create-blog"
                  className={`btn btn-success ${styles.createButton}`}
                >
                  Create New Blog Post
                </Link>
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;