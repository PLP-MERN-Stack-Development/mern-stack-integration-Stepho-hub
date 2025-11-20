import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token and user on app start
    const token = localStorage.getItem('token');
    const userData = authService.getCurrentUser();

    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await authService.register({ name, email, password });
      toast.success('Account created successfully!');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      toast.success('Signed in successfully!');
      window.location.href = '/';
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signOut = async () => {
    authService.logout();
    setUser(null);
    toast.success('Signed out successfully!');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};