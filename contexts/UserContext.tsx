'use client';

import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import * as userService from '@/services/users';
import { User } from '@/components/ui/UserList';
import { useUsers } from '@/hooks/useUsers';

// UserContext 类型
interface UserContextType {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  createUser: (userData: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
}

// 创建 UserContext
export const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider 组件
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { users, isLoading, error, refetch, getUserById, createUser, updateUser, deleteUser } = useUsers();

  return (
    <UserContext.Provider value={{ users, isLoading, error, refetch, getUserById, createUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

// useUserContext hook
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}