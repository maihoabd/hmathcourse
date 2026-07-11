'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
  phone?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; unverified?: boolean }>;
  logout: () => void;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; unverified?: boolean }>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendCode: (email: string) => Promise<boolean>;
  updateUserSession: (updatedUser: UserSession) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load session from localStorage on client mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  // Protect admin routes client-side
  useEffect(() => {
    if (!loading) {
      const isAdminRoute = pathname?.startsWith('/admin');
      if (isAdminRoute) {
        if (!user || user.role !== 'admin') {
          router.replace('/login');
        }
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; unverified?: boolean }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.unverified) {
          setLoading(false);
          return { success: false, unverified: true };
        }
        alert(errorData.error || 'Đăng nhập thất bại.');
        setLoading(false);
        return { success: false };
      }

      const loggedInUser: UserSession = await response.json();
      setUser(loggedInUser);
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      setLoading(false);
      
      if (loggedInUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      alert('Kết nối máy chủ thất bại.');
      setLoading(false);
      return { success: false };
    }
  };

  const register = async (name: string, email: string, password?: string, phone?: string): Promise<{ success: boolean; unverified?: boolean }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Đăng ký thất bại.');
        setLoading(false);
        return { success: false };
      }

      const resData = await response.json();
      if (resData.unverified) {
        setLoading(false);
        return { success: true, unverified: true };
      }

      const newUser: UserSession = resData;
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setLoading(false);
      router.push('/dashboard');
      return { success: true };
    } catch (err) {
      console.error(err);
      alert('Kết nối máy chủ thất bại.');
      setLoading(false);
      return { success: false };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Mã xác thực không hợp lệ.');
        setLoading(false);
        return false;
      }

      const loggedInUser: UserSession = await response.json();
      setUser(loggedInUser);
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      setLoading(false);
      router.push('/dashboard');
      return true;
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ.');
      setLoading(false);
      return false;
    }
  };

  const resendCode = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Không thể gửi lại mã xác thực.');
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ.');
      return false;
    }
  };

  const updateUserSession = (updatedUser: UserSession) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyEmail, resendCode, updateUserSession }}>
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
