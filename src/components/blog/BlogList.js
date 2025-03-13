import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Row, Col, Pagination } from 'react-bootstrap';
import { BlogContext } from '../../context/BlogContext';
import BlogCard from './BlogCard';
import Loader from '../common/Loader';
import Message from '../common/Message';
import BlogSearch from './BlogSearch';
import styles from '../../styles/modules/Blog.module.css';

const BlogList = ({ keyword = '', setKeyword }) => {
  const { blogs, loading, error, getBlogs, page, pages } = useContext(BlogContext);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  // Use debounce to prevent too many API calls when changing pages
  const loadBlogs = useCallback(async (searchKeyword, pageNumber = 1) => {
    try {
      setLocalLoading(true);
      await getBlogs(searchKeyword, pageNumber);
      setLocalError(null);
    } catch (err) {
      setLocalError(err.message || 'Failed to load blogs');
    } finally {
      setLocalLoading(false);
    }
  }, [getBlogs]);

  useEffect(() => {
    loadBlogs(keyword);
  }, [keyword, loadBlogs]);

  const handlePageChange = (pageNumber) => {
    loadBlogs(keyword, pageNumber);
  };

  if (localLoading || loading) {
    return <Loader />;
  }

  if (localError || error) {
    return <Message variant="danger">{localError || error}</Message>;
  }

  if (blogs.length === 0) {
    return (
      <>
        <BlogSearch keyword={keyword} setKeyword={setKeyword} />
        <Message>No blogs found</Message>
      </>
    );
  }

  return (
    <>
      <BlogSearch keyword={keyword} setKeyword={setKeyword} />
      
      <Row>
        {blogs.map((blog) => (
          <Col key={blog._id} md={6} lg={4}>
            <BlogCard blog={blog} />
          </Col>
        ))}
      </Row>
      
      {pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className={styles.pagination}>
            {[...Array(pages).keys()].map((x) => (
              <Pagination.Item
                key={x + 1}
                active={x + 1 === page}
                onClick={() => handlePageChange(x + 1)}
              >
                {x + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </>
  );
};

export default BlogList;