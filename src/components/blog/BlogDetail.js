import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Card } from 'react-bootstrap';
import { BlogContext } from '../../context/BlogContext';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../common/Loader';
import Message from '../common/Message';
import styles from '../../styles/modules/Blog.module.css';

const BlogDetail = ({ slug }) => {
  const { currentBlog, loading, error, getBlogBySlug, deleteBlog } = useContext(BlogContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLocalLoading(true);
        await getBlogBySlug(slug);
        setLocalError(null);
      } catch (err) {
        setLocalError(err.message || 'Could not fetch blog details');
      } finally {
        setLocalLoading(false);
      }
    };

    fetchBlog();
  }, [slug, getBlogBySlug]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        setLocalLoading(true);
        await deleteBlog(currentBlog._id);
        navigate('/blogs');
      } catch (err) {
        setLocalError(err.message || 'Failed to delete blog');
        setLocalLoading(false);
      }
    }
  };

  const isAuthor = user && currentBlog && user._id === currentBlog.author._id;

  if (localLoading || loading) {
    return <Loader />;
  }

  if (localError || error) {
    return <Message variant="danger">{localError || error}</Message>;
  }

  if (!currentBlog) {
    return <Message>Blog not found</Message>;
  }

  return (
    <div className={styles.blogDetail}>
      <Card className="border-0 shadow-sm">
        {currentBlog.featuredImage && (
          <div className={styles.featuredImageContainer}>
            <Card.Img
              variant="top"
              src={currentBlog.featuredImage}
              alt={currentBlog.title}
              className={styles.featuredImage}
            />
          </div>
        )}
        <Card.Body className="p-4">
          <div className={styles.blogHeader}>
            <h1 className={styles.blogTitle}>{currentBlog.title}</h1>
            <div className={styles.blogMeta}>
              <span className="text-muted">
                By {currentBlog.author.name} • {formatDate(currentBlog.createdAt)}
              </span>
            </div>
            <div className={styles.tagContainer}>
              {currentBlog.tags && currentBlog.tags.map((tag, index) => (
                <Badge bg="secondary" key={index} className={styles.tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div 
            className={styles.blogContent} 
            dangerouslySetInnerHTML={{ __html: currentBlog.content }}
          />
          
          {isAuthor && (
            <div className="d-flex mt-4">
              <Link
                to={`/edit-blog/${currentBlog._id}`}
                className="btn btn-primary me-2"
              >
                Edit
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default BlogDetail;