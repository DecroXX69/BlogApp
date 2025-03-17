// frontend/src/components/blog/BlogForm.js
import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { BlogContext } from '../../context/BlogContext';
import Loader from '../common/Loader';
import Message from '../common/Message';
import styles from '../../styles/modules/Form.module.css';
import { testConnectionAPI } from '../../api/blogAPI';

const BlogForm = ({ blog, isEdit, onSubmitSuccess }) => {
  const { loading, error, createBlog, updateBlog, getCategories, categories } = useContext(BlogContext);

  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(blog?.featuredImage || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [category, setCategory] = useState(blog?.category || 'Uncategorized');
  const [published, setPublished] = useState(blog?.published || false);
  const [validationError, setValidationError] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    getCategories().catch(err => {
      console.error('Failed to fetch categories:', err);
    });
  }, [getCategories]);

  const testConnection = async () => {
    try {
      const result = await testConnectionAPI();
      console.log('Connection test successful:', result);
      return result;
    } catch (err) {
      console.error('Connection test failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!title || !content || !excerpt) {
      setValidationError('Title, content, and excerpt are required');
      return;
    }
    
    setValidationError('');
    
    // Create a more detailed blog data object
    const blogData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      featuredImage: featuredImage || '',
      tags: tags || '',
      category: category || 'Uncategorized',
      published: published || false,
    };
    
    console.log("Sending blog data:", blogData);
    
    try {
      if (isEdit) {
        await updateBlog(blog._id, blogData);
      } else {
        await createBlog(blogData);
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error('Error submitting blog:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <h2 className="mb-4">{isEdit ? 'Edit Blog' : 'Create New Blog'}</h2>
        
        {validationError && <Message variant="danger">{validationError}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        
        <Form onSubmit={handleSubmit} className={styles.form}>
          <Form.Group className="mb-3" controlId="blogTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formControl}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="blogExcerpt">
            <Form.Label>Excerpt</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write a short excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={styles.formControl}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="blogContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Write your blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.formControl}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="blogImage">
            <Form.Label>Featured Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className={styles.formControl}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="blogCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.formControl}
            >
              <option value="Uncategorized">Uncategorized</option>
              {categories && categories.length > 0 && 
                categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              }
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="blogTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={styles.formControl}
            />
            <Form.Text className="text-muted">
              Example: technology, programming, web development
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="blogPublished">
            <Form.Check
              type="checkbox"
              label="Publish blog"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className={styles.formCheck}
            />
            {isEdit && blog?.published && (
              <Form.Text className="text-muted">
                Unpublishing your blog will make it inaccessible via shareable links.
              </Form.Text>
            )}
          </Form.Group>
          
          <Button variant="primary" type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
          </Button>

          <Button 
            variant="secondary" 
            onClick={testConnection} 
            className="mt-2 ms-2"
          >
            Test Connection
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BlogForm;