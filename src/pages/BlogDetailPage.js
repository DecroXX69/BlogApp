// frontend/src/pages/BlogDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import BlogDetail from '../components/blog/BlogDetail';

const BlogDetailPage = () => {
  const { slug } = useParams();

  return <BlogDetail slug={slug} />;
};

export default BlogDetailPage;