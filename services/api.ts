'use client';

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { User } from '@/components/ui/UserList';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 响应接口
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 错误接口
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || '请求失败',
      status: error.response?.status || 500,
    };
    
    // 处理特定错误
    if (error.response) {
      apiError.message = error.response.data.message || apiError.message;
      apiError.errors = error.response.data.errors;
    }
    
    return Promise.reject(apiError);
  }
);

// 用户API
export const userApi = {
  // 获取所有用户
  fetchUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<User[]>>('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取单个用户
  fetchUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 创建用户
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 更新用户
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 删除用户
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await api.delete<ApiResponse<void>>(`/users/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

// 其他API可以按照类似方式添加
// export const otherApi = {...}

export default api;
