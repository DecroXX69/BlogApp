// frontend/src/components/blog/BlogCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import styles from '../../styles/modules/Blog.module.css';

const BlogCard = ({ blog }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className={`mb-4 shadow-sm ${styles.blogCard}`}>
      <div className={styles.imageContainer}>
        <Card.Img 
          variant="top" 
          src={blog.featuredImage} 
          alt={blog.title} 
          className={styles.blogImage}
        />
      </div>
      <Card.Body>
        <div className={styles.blogMeta}>
          <small className="text-muted">
            {blog.author?.name || 'Unknown'} • {formatDate(blog.createdAt)}
          </small>
        </div>
        <Card.Title className={styles.blogTitle}>
          <Link to={`/blogs/${blog.slug}`} className={styles.titleLink}>{blog.title}</Link>
        </Card.Title>
        <Card.Text className={styles.blogExcerpt}>{blog.excerpt}</Card.Text>
        <div className={styles.tagContainer}>
          {blog.tags && blog.tags.map((tag, index) => (
            <Badge bg="secondary" key={index} className={styles.tag}>{tag}</Badge>
          ))}
        </div>
        <Link to={`/blogs/${blog.slug}`} className={`btn btn-outline-primary mt-3 ${styles.readMoreBtn}`}>
          Read More
        </Link>
      </Card.Body>
    </Card>
  );
};

export default BlogCard;