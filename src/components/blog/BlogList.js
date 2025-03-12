// frontend/src/components/blog/BlogList.js
import React, { useEffect, useContext } from 'react';
import { Row, Col, Pagination } from 'react-bootstrap';
import { BlogContext } from '../../context/BlogContext';
import BlogCard from './BlogCard';
import Loader from '../common/Loader';
import Message from '../common/Message';
import BlogSearch from './BlogSearch';
import styles from '../../styles/modules/Blog.module.css';

const BlogList = ({ keyword = '', setKeyword }) => {
  const { blogs, loading, error, getBlogs, page, pages } = useContext(BlogContext);

  useEffect(() => {
    getBlogs(keyword);
  }, [keyword, getBlogs]);

  return (
    <>
      <BlogSearch keyword={keyword} setKeyword={setKeyword} />
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : blogs.length === 0 ? (
        <Message>No blogs found</Message>
      ) : (
        <>
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
                            onClick={() => getBlogs(keyword, x + 1)}
                          >
                            {x + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          );
        };
        
        export default BlogList;