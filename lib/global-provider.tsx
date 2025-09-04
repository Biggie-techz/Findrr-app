import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';

import { getCurrentUser } from './appwrite';
import { useAppwrite } from './useAppwrite';

interface User {
  $id: string;
  name: string;
  email: string;
  avatar?: string; // Make avatar optional
  userType?: 'applicant' | 'recruiter' | null;
  profile?: any; // User profile data from database
}

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    error,
    refetch: originalRefetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLogged = !!user && !error;

  // Create a wrapper function that doesn't require parameters
  const refetch = useCallback(async () => {
    await originalRefetch({} as Record<string, string | number>);
  }, [originalRefetch]);

  const value = useMemo(() => ({
    isLogged,
    user,
    loading,
    error,
    refetch,
  }), [isLogged, user, loading, error, refetch]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error('useGlobalContext must be used within a GlobalProvider');

  return context;
};

export default GlobalProvider;
