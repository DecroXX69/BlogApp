// src/components/blog/BlogForm.js
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../common/Message';
import styles from '../../styles/modules/Form.module.css';

const BlogForm = ({ 
  onSubmit, 
  blog = null, 
  submitButtonText = 'Publish Blog' 
}) => {
  // Form data state
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [summary, setSummary] = useState(blog?.summary || '');
  const [coverImage, setCoverImage] = useState(blog?.coverImage || '');
  const [category, setCategory] = useState(blog?.category || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [isPublished, setIsPublished] = useState(blog?.isPublished || false);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submittedOnce, setSubmittedOnce] = useState(false);
  
  // Use a ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Track if the form is dirty (has changed since initial load)
  const [isDirty, setIsDirty] = useState(false);
  
  // Categories list - replace with your actual categories
  const categories = ['Technology', 'Health', 'Business', 'Entertainment', 'Other'];
  
  // Handle form input changes and track dirty state
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (!isDirty) setIsDirty(true);
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    setIsPublished(e.target.checked);
    if (!isDirty) setIsDirty(true);
  };
  
  // Handle form submission with debounce to prevent double-clicks
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setSubmittedOnce(true);
    
    // Validate form
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }
    
    try {
      setFormError(null);
      setIsSubmitting(true);
      
      // Process tags into array
      const processedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Create blog object
      const blogData = {
        title,
        content,
        summary,
        coverImage,
        category,
        tags: processedTags,
        isPublished
      };
      
      // Call the onSubmit prop with the blog data
      await onSubmit(blogData);
      
      // Reset dirty state after successful submission
      setIsDirty(false);
    } catch (err) {
      if (isMounted.current) {
        setFormError(err.message || 'Failed to submit blog');
      }
    } finally {
      if (isMounted.current) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      {formError && submittedOnce && (
        <Message variant="danger">{formError}</Message>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={handleInputChange(setTitle)}
          disabled={isSubmitting}
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Summary</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Brief summary of your blog"
          value={summary}
          onChange={handleInputChange(setSummary)}
          disabled={isSubmitting}
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          placeholder="Write your blog content here..."
          value={content}
          onChange={handleInputChange(setContent)}
          disabled={isSubmitting}
          required
        />
        <Form.Text className="text-muted">
          You can use markdown formatting if needed
        </Form.Text>
      </Form.Group>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Cover Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={coverImage}
              onChange={handleInputChange(setCoverImage)}
              disabled={isSubmitting}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={handleInputChange(setCategory)}
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Tags (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="technology, javascript, react"
          value={tags}
          onChange={handleInputChange(setTags)}
          disabled={isSubmitting}
        />
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Check
          type="checkbox"
          label="Publish immediately"
          checked={isPublished}
          onChange={handleCheckboxChange}
          disabled={isSubmitting}
        />
      </Form.Group>
      
      <div className="d-flex justify-content-end">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Publishing...' : submitButtonText}
        </Button>
      </div>
    </Form>
  );
};

export default BlogForm;