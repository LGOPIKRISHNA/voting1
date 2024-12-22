import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signUp, signOut, getCurrentUser, getUserProfile } from '../lib/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'admin' | 'voter') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const profile = await getUserProfile(currentUser.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password);
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const profile = await getUserProfile(currentUser.id);
      setUser(profile);
    }
  };

  const handleSignUp = async (email: string, password: string, role: 'admin' | 'voter') => {
    await signUp(email, password, role);
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const profile = await getUserProfile(currentUser.id);
      setUser(profile);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}