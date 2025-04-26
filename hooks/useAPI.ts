'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// API错误接口
export interface ApiCallError {
  status?: number;
  message: string;
}

// API调用返回接口
export interface ApiCallResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiCallError | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * API调用Hook
 * 
 * @param {Function} apiCallFn - API调用函数
 * @param {Object} options - 配置选项
 * @param {boolean} options.executeOnMount - 是否在挂载时执行
 * @param {any[]} options.dependencies - 依赖数组
 * @returns {ApiCallResult<T>} - API调用结果
 */
export function useAPI<T>(
  apiCallFn: (...args: any[]) => Promise<T>,
  {
    executeOnMount = false,
    dependencies = []
  }: {
    executeOnMount?: boolean;
    dependencies?: any[];
  } = {}
): ApiCallResult<T> {
  // 状态
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiCallError | null>(null);
  
  // 请求控制
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // 执行API调用
  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    // 增加请求ID，用于处理并发请求
    const currentRequestId = ++requestIdRef.current;
    
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 创建新的AbortController
    abortControllerRef.current = new AbortController();
    
    // 设置加载状态
    setIsLoading(true);
    setError(null);
    
    try {
      // 执行API调用
      const result = await apiCallFn(...args);
      
      // 检查是否是最新请求
      if (currentRequestId === requestIdRef.current) {
        setData(result);
        setIsLoading(false);
        return result;
      }
      return null;
    } catch (err: unknown) {
      // 检查是否是最新请求
      if (currentRequestId === requestIdRef.current) {
        // 错误处理
        if (typeof err === 'object' && err && 'status' in err) {
          setError({
            status: 'status' in err ? (err as any).status : undefined,
            message: 'message' in err ? (err as any).message : '请求失败'
          });
        } else {
          setError({
            message: err instanceof Error ? err.message : '请求失败'
          });
        }
        
        setIsLoading(false);
        console.error('API调用失败:', err);
      }
      return null;
    }
  }, [apiCallFn]);
  
  // 重置状态
  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);
  
  // 在组件挂载或依赖项变化时执行
  useEffect(() => {
    if (executeOnMount) {
      execute();
    }
    
    // 清理函数
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [...dependencies, execute, executeOnMount]);
  
  return { data, isLoading, error, execute, reset };
}