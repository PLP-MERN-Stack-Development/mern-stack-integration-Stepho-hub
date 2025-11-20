import { useState, useCallback } from 'react';
import { postService, categoryService, authService } from '@/services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<any>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      const data = result?.data || result;
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for different API operations
export const usePosts = () => {
  const getPosts = useApi(postService.getAllPosts);
  const getPost = useApi(postService.getPost);
  const createPost = useApi(postService.createPost);
  const updatePost = useApi(postService.updatePost);
  const deletePost = useApi(postService.deletePost);

  return {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  };
};

export const useCategories = () => {
  const getCategories = useApi(categoryService.getAllCategories);
  const createCategory = useApi(categoryService.createCategory);

  return {
    getCategories,
    createCategory,
  };
};

export const useAuthApi = () => {
  const login = useApi(authService.login);
  const register = useApi(authService.register);

  return {
    login,
    register,
  };
};