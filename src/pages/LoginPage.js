// frontend/src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import styles from '../styles/modules/Form.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in the context
    }
  };
  
  return (
    <Row className="justify-content-md-center my-4">
      <Col md={6}>
        <Card className={styles.formCard}>
          <Card.Body>
            <h1 className="text-center mb-4">Sign In</h1>
            
            {error && <Message variant="danger">{error}</Message>}
            {errorMessage && <Message variant="danger">{errorMessage}</Message>}
            
            {isLoading ? (
              <Loader />
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.formInput}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.formInput}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className={`${styles.submitButton} w-100 mt-3`}
                >
                  Sign In
                </Button>
              </Form>
            )}
            
            <Row className="py-3">
              <Col>
                New user? <Link to="/register" className={styles.formLink}>Register here</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;