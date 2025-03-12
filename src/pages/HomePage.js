// frontend/src/pages/HomePage.js
import React, { useEffect, useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import BlogCard from '../components/blog/BlogCard';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import styles from '../styles/modules/Blog.module.css';

const HomePage = () => {
  const { blogs, loading, error, getBlogs } = useContext(BlogContext);

  useEffect(() => {
    // Get only published blogs, first page, limit to 6
    getBlogs('', 1, true);
  }, [getBlogs]);

  return (
    <>
      <div className={styles.hero}>
        <h1>Welcome to Rushikesh's God Tier Knowledgeable Blogs</h1>
        <p>Discover articles on technology, programming, and web development</p>
        <Link to="/blogs" className="btn btn-primary btn-lg">
          Explore Blogs
        </Link>
      </div>

      <h2 className="mb-4">Latest Articles</h2>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : blogs.length === 0 ? (
        <Message>No blogs found</Message>
      ) : (
        <>
          <Row>
            {blogs.slice(0, 6).map((blog) => (
              <Col key={blog._id} md={6} lg={4} className="mb-4">
                <BlogCard blog={blog} />
              </Col>
            ))}
          </Row>
          
          <div className="text-center mt-4">
            <Link to="/blogs" className="btn btn-outline-primary">
              View All Blogs
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;