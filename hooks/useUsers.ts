'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { userApi, ApiError } from '@/services/api';
import { User } from '@/components/ui/UserList';

// 缓存配置
interface CacheConfig {
  enabled: boolean;
  ttl: number; // 过期时间(毫秒)
}

// 缓存数据结构
interface CacheData {
  data: User[];
  timestamp: number;
}

// 全局缓存对象
const CACHE: Record<string, CacheData> = {};

/**
 * 清除所有用户数据缓存
 */
export const clearUsersCache = (): void => {
  Object.keys(CACHE).forEach(key => {
    delete CACHE[key];
  });
};

/**
 * 用户数据Hook
 * 
 * 提供用户数据获取、缓存和操作功能
 * 
 * @param {CacheConfig} cacheConfig - 缓存配置
 * @returns {object} 用户数据和操作方法
 */
export function useUsers(cacheConfig: CacheConfig = { enabled: true, ttl: 5 * 60 * 1000 }) {
  // 状态
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | ApiError | null>(null);
  
  // 请求控制
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // 缓存键
  const cacheKey = 'users';
  
  // 加载用户数据
  const fetchUsers = useCallback(async (ignoreCache = false): Promise<void> => {
    const currentRequestId = ++requestIdRef.current;
    
    // 如果有上一个请求，则中断
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 创建新的AbortController
    abortControllerRef.current = new AbortController();
    
    // 检查缓存
    if (cacheConfig.enabled && !ignoreCache && CACHE[cacheKey]) {
      const cachedData = CACHE[cacheKey];
      const now = Date.now();
      
      // 缓存未过期
      if (now - cachedData.timestamp < cacheConfig.ttl) {
        setUsers(cachedData.data);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userApi.fetchUsers();
      
      if (currentRequestId === requestIdRef.current) {
        setUsers(data);
        
        if (cacheConfig.enabled) {
          CACHE[cacheKey] = {
            data,
            timestamp: Date.now()
          };
        }
      }
    } catch (err: unknown) {
      if (currentRequestId === requestIdRef.current) {
        // 类型保护
        type ErrorWithStatus = { status: number };
        
        if (typeof err === 'object' && err && 'status' in err) {
          setError(err as ApiError);
        } else {
          setError(err instanceof Error ? err : new Error('加载用户数据失败'));
        }
        
        console.error('获取用户数据失败:', err);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [cacheConfig.enabled, cacheConfig.ttl]);
  
  // 初始加载
  useEffect(() => {
    fetchUsers();
    
    // 清理函数
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchUsers]);
  
  // 刷新数据
  const refetch = useCallback(() => fetchUsers(true), [fetchUsers]);
  
  // 根据ID获取用户
  const getUserById = useCallback(async (id: string): Promise<User> => {
    try {
      return await userApi.fetchUserById(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取用户数据失败');
      setError(error);
      throw error;
    }
  }, []);
  
  // 创建用户
  const createUser = useCallback(async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
      const newUser = await userApi.createUser(userData);
      await refetch();
      return newUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('创建用户失败');
      setError(error);
      throw error;
    }
  }, [refetch]);
  
  // 更新用户
  const updateUser = useCallback(async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await userApi.updateUser(id, userData);
      await refetch();
      return updatedUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('更新用户失败');
      setError(error);
      throw error;
    }
  }, [refetch]);
  
  // 删除用户
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await userApi.deleteUser(id);
      if (success) {
        await refetch();
      }
      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('删除用户失败');
      setError(error);
      throw error;
    }
  }, [refetch]);
  
  return {
    users,
    isLoading,
    error,
    refetch,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };
}

/**
 * 防抖Hook
 * 
 * @param value 需要防抖的值
 * @param delay 延迟时间(毫秒)
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // 设置定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // 清理函数
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}