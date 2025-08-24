import { useState, useEffect } from 'react';
import { User, LoginCredentials } from '../types';

const API_BASE = 'https://grievance-backend-9odk.onrender.com';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('grievance_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('grievance_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      // MODIFIED: This is now a single API call.
      // The backend returns the full user object on successful login.
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('grievance_user', JSON.stringify(data.user));
        return true;
      }
      return false;
      
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grievance_user');
  };

  return { user, isLoading, login, logout };
};