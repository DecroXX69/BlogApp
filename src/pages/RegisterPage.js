// frontend/src/pages/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import styles from '../styles/modules/Form.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  
  const { name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register(name, email, password);
    } catch (err) {
      // Error is handled in the context
    }
  };
  
  return (
    <Row className="justify-content-md-center my-4">
      <Col md={6}>
        <Card className={styles.formCard}>
          <Card.Body>
            <h1 className="text-center mb-4">Create Account</h1>
            
            {error && <Message variant="danger">{error}</Message>}
            {errorMessage && <Message variant="danger">{errorMessage}</Message>}
            
            {isLoading ? (
              <Loader />
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className={`${styles.submitButton} w-100 mt-3`}
                >
                  Register
                </Button>
              </Form>
            )}
            
            <Row className="py-3">
              <Col>
                Already have an account? <Link to="/login" className={styles.formLink}>Login</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;