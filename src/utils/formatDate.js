// frontend/src/utils/formatDate.js
/**
 * Format a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @param {object} options - Options for formatting
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    const date = new Date(dateString);
    
    const defaultOptions = {
      format: 'medium', // 'short', 'medium', 'long', 'full'
      includeTime: false,
      timeFormat: '12h' // '12h', '24h'
    };
    
    const settings = { ...defaultOptions, ...options };
    
    // Format based on specified format
    if (settings.format === 'short') {
      // MM/DD/YY
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
    } else if (settings.format === 'medium') {
      // Jan 1, 2023
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (settings.format === 'long') {
      // January 1, 2023
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (settings.format === 'full') {
      // Monday, January 1, 2023
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    
    // Add time if requested
    if (settings.includeTime) {
      let timeString = '';
      if (settings.timeFormat === '12h') {
        timeString = date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } else {
        timeString = date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      
      if (settings.format === 'short') {
        return `${formatDate(dateString, { format: 'short' })} ${timeString}`;
      } else if (settings.format === 'medium') {
        return `${formatDate(dateString, { format: 'medium' })} at ${timeString}`;
      } else if (settings.format === 'long' || settings.format === 'full') {
        return `${formatDate(dateString, { format: settings.format })} at ${timeString}`;
      }
    }
    
    // Default to medium format
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  /**
   * Get relative time (e.g., "2 days ago", "just now")
   * @param {string} dateString - The date string to compare
   * @returns {string} - Relative time string
   */
  // frontend/src/utils/formatDate.js (continued)
export const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    }
  };
  
  /**
   * Format reading time based on word count
   * @param {string} content - The content to calculate reading time for
   * @returns {string} - Formatted reading time
   */
  export const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return `${readingTime} min read`;
  };
  
  export default {
    formatDate,
    getRelativeTime,
    getReadingTime
  };