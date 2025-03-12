// frontend/src/context/BlogContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getBlogsAPI, 
  getBlogByIdAPI, 
  getBlogBySlugAPI,
  createBlogAPI, 
  updateBlogAPI, 
  deleteBlogAPI,
  getUserBlogsAPI 
} from '../api/blogAPI';
import { AuthContext } from './AuthContext';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  
  const { user } = useContext(AuthContext);

  // Get all blogs
  const getBlogs = async (keyword = '', pageNumber = 1, publishedOnly = true) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogsAPI(keyword, pageNumber, publishedOnly);
      setBlogs(data.blogs);
      setPage(data.page);
      setPages(data.pages);
      setTotalBlogs(data.total);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get blog by ID
  const getBlogById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogByIdAPI(id);
      setCurrentBlog(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get blog by slug
  const getBlogBySlug = async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogBySlugAPI(slug);
      setCurrentBlog(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create blog
  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createBlogAPI(blogData);
      setUserBlogs([data, ...userBlogs]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateBlogAPI(id, blogData);
      
      // Update userBlogs state
      setUserBlogs(userBlogs.map(blog => 
        blog._id === id ? data : blog
      ));
      
      // Update blogs state if the blog exists there
      setBlogs(blogs.map(blog => 
        blog._id === id ? data : blog
      ));
      
      // Update currentBlog if it's the same blog
      if (currentBlog && currentBlog._id === id) {
        setCurrentBlog(data);
      }
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteBlogAPI(id);
      
      // Remove blog from userBlogs state
      setUserBlogs(userBlogs.filter(blog => blog._id !== id));
      
      // Remove blog from blogs state
      setBlogs(blogs.filter(blog => blog._id !== id));
      
      // Clear currentBlog if it's the same blog
      if (currentBlog && currentBlog._id === id) {
        setCurrentBlog(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user blogs
  const getUserBlogs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserBlogsAPI();
      setUserBlogs(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user blogs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear current blog
  const clearCurrentBlog = () => {
    setCurrentBlog(null);
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        userBlogs,
        currentBlog,
        loading,
        error,
        page,
        pages,
        totalBlogs,
        getBlogs,
        getBlogById,
        getBlogBySlug,
        createBlog,
        updateBlog,
        deleteBlog,
        getUserBlogs,
        clearCurrentBlog
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};