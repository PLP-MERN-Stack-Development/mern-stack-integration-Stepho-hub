// api.js - API service for making requests to the backend

import axios from 'axios';

// Get API base URL based on environment
const getApiBaseUrl = () => {
  // Check for environment-specific API URL (for Vercel/Render deployments)
  if (import.meta.env.VITE_API_URL) {
    // Ensure it ends with /api for proper API routing
    const baseUrl = import.meta.env.VITE_API_URL;
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  }

  // For development, use the default proxy path
  return '/api';
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Post API services
export const postService = {
  // Get all posts with optional pagination, filters, and search
  getAllPosts: async (page = 1, limit = 10, category = null, search = null, sort = '-createdAt') => {
    let url = `/posts?page=${page}&limit=${limit}&sort=${sort}`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    let data = postData;
    let config = {};

    if (postData.featuredImage && postData.featuredImage instanceof File) {
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        if (key === 'featuredImage') {
          formData.append(key, postData[key]);
        } else {
          formData.append(key, postData[key]);
        }
      });
      data = formData;
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    const response = await api.post('/posts', data, config);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    let data = postData;
    let config = {};

    if (postData.featuredImage && postData.featuredImage instanceof File) {
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        if (key === 'featuredImage') {
          formData.append(key, postData[key]);
        } else {
          formData.append(key, postData[key]);
        }
      });
      data = formData;
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    const response = await api.put(`/posts/${id}`, data, config);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Search posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return response.data;
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
};

// Auth API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api; 