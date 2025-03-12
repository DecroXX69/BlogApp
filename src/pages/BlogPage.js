// frontend/src/pages/BlogPage.js
import React, { useState } from 'react';
import BlogList from '../components/blog/BlogList';

const BlogPage = () => {
  const [keyword, setKeyword] = useState('');

  return (
    <>
      <h1 className="mb-4">All Blogs</h1>
      <BlogList keyword={keyword} setKeyword={setKeyword} />
    </>
  );
};

export default BlogPage;