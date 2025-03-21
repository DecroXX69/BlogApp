import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { 
  getBlogsAPI, 
  getBlogByIdAPI, 
  getBlogBySlugAPI,
  getBlogByShareableLinkAPI,
  createBlogAPI, 
  updateBlogAPI, 
  deleteBlogAPI,
  getUserBlogsAPI,
  getCategoriesAPI
} from '../api/blogAPI';
import { AuthContext } from './AuthContext';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  
  const { user } = useContext(AuthContext);

  // Get all blogs - using useCallback to prevent unnecessary recreation
  const getBlogs = useCallback(async (keyword = '', pageNumber = 1, publishedOnly = true, category = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogsAPI(keyword, pageNumber, publishedOnly, category);
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
  }, []);

  // Get blog by ID
  const getBlogById = useCallback(async (id) => {
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
  }, []);

  // Get blog by slug
  const getBlogBySlug = useCallback(async (slug) => {
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
  }, []);

  // Get blog by shareable link
  const getBlogByShareableLink = useCallback(async (shareableLink) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogByShareableLinkAPI(shareableLink);
      setCurrentBlog(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all categories
  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategoriesAPI();
      setCategories(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create blog
  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("BlogData being sent:", blogData); // Log the data
      const data = await createBlogAPI(blogData);
      console.log("Response received:", data); // Log the response
      
      // Update userBlogs in a way that prevents state race conditions
      setUserBlogs(prevUserBlogs => [data, ...prevUserBlogs]);
      
      return data;
    } catch (err) {
      console.error("Full error object:", err); // Log the complete error
      setError(err.response?.data?.message || 'Failed to create blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update blog
  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateBlogAPI(id, blogData);
      
      // Update userBlogs state using functional updates to prevent race conditions
      setUserBlogs(prevUserBlogs => 
        prevUserBlogs.map(blog => blog._id === id ? data : blog)
      );
      
      // Update blogs state using functional updates
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => blog._id === id ? data : blog)
      );
      
      // Update currentBlog if it's the same blog
      setCurrentBlog(prevCurrentBlog => 
        prevCurrentBlog && prevCurrentBlog._id === id ? data : prevCurrentBlog
      );
      
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
      
      // Remove blog from userBlogs state using functional updates
      setUserBlogs(prevUserBlogs => 
        prevUserBlogs.filter(blog => blog._id !== id)
      );
      
      // Remove blog from blogs state
      setBlogs(prevBlogs => 
        prevBlogs.filter(blog => blog._id !== id)
      );
      
      // Clear currentBlog if it's the same blog
      setCurrentBlog(prevCurrentBlog => 
        prevCurrentBlog && prevCurrentBlog._id === id ? null : prevCurrentBlog
      );
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user blogs
  const getUserBlogs = useCallback(async () => {
    if (!user) return [];
    
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
  }, [user]);

  // Copy blog shareable link to clipboard
  const copyShareableLink = (blog) => {
    if (!blog || !blog.shareableLink) {
      setError('No shareable link available');
      return false;
    }
    
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/blogs/share/${blog.shareableLink}`;
    
    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        // You might want to show a success message here
        return true;
      })
      .catch(err => {
        setError('Failed to copy link to clipboard');
        console.error('Failed to copy link:', err);
        return false;
      });
  };

  // Clear current blog
  const clearCurrentBlog = () => {
    setCurrentBlog(null);
  };

  // Load user blogs when user changes
  useEffect(() => {
    if (user) {
      getUserBlogs().catch(err => {
        console.error('Failed to load user blogs:', err);
      });
    } else {
      setUserBlogs([]);
    }
  }, [user, getUserBlogs]);

  // Load categories on initial render
  useEffect(() => {
    getCategories().catch(err => {
      console.error('Failed to load categories:', err);
    });
  }, [getCategories]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        userBlogs,
        currentBlog,
        categories,
        loading,
        error,
        page,
        pages,
        totalBlogs,
        getBlogs,
        getBlogById,
        getBlogBySlug,
        getBlogByShareableLink,
        getCategories,
        createBlog,
        updateBlog,
        deleteBlog,
        getUserBlogs,
        copyShareableLink,
        clearCurrentBlog
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};