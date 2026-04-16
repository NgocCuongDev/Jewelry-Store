// app/(site)/context/AuthContext.js
"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../api/apiUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false); // 🎯 THÊM TRẠNG THÁI INIT

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');

      console.log("🔄 AuthContext - Checking auth:", {
        hasToken: !!token,
        hasSavedUser: !!savedUser
      });

      if (token && savedUser) {
        try {
          const res = await getCurrentUser();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
            console.log("✅ AuthContext - User loaded from API");
          } else {
            setUser(JSON.parse(savedUser));
            console.log("✅ AuthContext - User loaded from localStorage");
          }
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          setUser(JSON.parse(savedUser));
          console.log("✅ AuthContext - User loaded from localStorage (fallback)");
        }
      } else {
        console.log("❌ AuthContext - No user found");
      }

      setLoading(false);
      setInitialized(true);
      console.log("🎯 AuthContext - Initialized completed");
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 🎯 GỌI API LOGOUT NẾU CẦN
      // await axios.post('/api/logout');

      // 🎯 XÓA LOCALSTORAGE
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);

      console.log("🚪 Đã đăng xuất");
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      return Promise.reject(error);
    }
  };

  const updateUserProfile = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    login,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    loading,
    initialized // 🎯 EXPORT TRẠNG THÁI INIT
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};