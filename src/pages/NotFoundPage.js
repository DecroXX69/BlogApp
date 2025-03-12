// frontend/src/pages/NotFoundPage.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../styles/modules/NotFound.module.css';

const NotFoundPage = () => {
  return (
    <Container className={styles.notFoundContainer}>
      <Row className="justify-content-md-center text-center">
        <Col md={8}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.errorTitle}>Page Not Found</h1>
          <p className={styles.errorMessage}>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className={styles.buttonContainer}>
            <Link to="/">
              <Button variant="primary" className={styles.homeButton}>
                Go to Homepage
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline-primary" className={styles.blogButton}>
                Browse Blogs
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;