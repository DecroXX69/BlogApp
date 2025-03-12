
// frontend/src/pages/EditBlogPage.js
import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import BlogForm from '../components/blog/BlogForm';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, currentBlog, loading, error } = useContext(BlogContext);

  useEffect(() => {
    getBlogById(id);
  }, [id, getBlogById]);

  const handleSubmitSuccess = () => {
    navigate(`/blogs/${currentBlog.slug}`);
  };

  return (
    <>
      <h1 className="mb-4">Edit Blog</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !currentBlog ? (
        <Message>Blog not found</Message>
      ) : (
        <BlogForm blog={currentBlog} isEdit onSubmitSuccess={handleSubmitSuccess} />
      )}
    </>
  );
};

export default EditBlogPage;
