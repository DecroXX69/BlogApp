// frontend/src/components/blog/BlogSearch.js
import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import styles from '../../styles/modules/Blog.module.css';

const BlogSearch = ({ keyword, setKeyword }) => {
  const [searchTerm, setSearchTerm] = useState(keyword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(searchTerm);
  };

  return (
    <div className={`${styles.searchContainer} mb-4`}>
      <Form onSubmit={handleSubmit} className="d-flex">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Button variant="primary" type="submit" className={styles.searchButton}>
            Search
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default BlogSearch;