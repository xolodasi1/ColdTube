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
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();

    // Re-check status when window gains focus 
    // (useful when returning from a popup or redirect)
    const handleFocus = () => {
      if (!user) checkUserStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const checkUserStatus = async (retryCount = 0) => {
    try {
      const sessionUser = await account.get();
      setUser(sessionUser);
    } catch (error: any) {
      // If we're unauthorized (401) but just returned from Google, 
      // sometimes a quick retry helps pick up the cookie
      if (error.code === 401 && retryCount < 1) {
        setTimeout(() => checkUserStatus(retryCount + 1), 1000);
        return;
      }
      setUser(null);
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
    const currentOrigin = window.location.origin;
    account.createOAuth2Session(
      OAuthProvider.Google,
      currentOrigin,
      `${currentOrigin}/login`
    );
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
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
