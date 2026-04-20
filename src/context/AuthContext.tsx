import React, { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../lib/appwrite';
import { ID, Models, OAuthProvider } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Try to load user from localStorage for instant UI feedback
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(() => {
    const savedUser = localStorage.getItem('coldtube_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();

    // Re-check when coming back to tab
    const handleFocus = () => checkUserStatus();
    window.addEventListener('focus', handleFocus);
    
    // Set an interval to sync session every 30 seconds (just in case)
    const interval = setInterval(() => checkUserStatus(), 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const checkUserStatus = async (retryCount = 0) => {
    try {
      const sessionUser = await account.get();
      setUser(sessionUser);
      // Cache user data
      localStorage.setItem('coldtube_user', JSON.stringify(sessionUser));
    } catch (error: any) {
      // If unauthorized (401), clear cache only if it wasn't a temporary network glitch
      if (error.code === 401) {
        if (retryCount < 2) {
          // Quick retries for race conditions
          setTimeout(() => checkUserStatus(retryCount + 1), 1500);
          return;
        }
        setUser(null);
        localStorage.removeItem('coldtube_user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    await account.createEmailPasswordSession(email, pass);
    await checkUserStatus();
  };

  const register = async (email: string, pass: string, name: string) => {
    await account.create(ID.unique(), email, pass, name);
    await login(email, pass);
  };

  const loginWithGoogle = () => {
    // We send user to the current origin. 
    // Appwrite will redirect back with cookies set.
    const currentOrigin = window.location.origin;
    account.createOAuth2Session(
      OAuthProvider.Google,
      currentOrigin,
      `${currentOrigin}/login`
    );
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Ignore if session already gone
    }
    setUser(null);
    localStorage.removeItem('coldtube_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
