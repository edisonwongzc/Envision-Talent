'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 应用主题类型
type Theme = 'light' | 'dark';

// 应用状态接口
interface AppState {
  // 主题设置
  theme: Theme;
  // 语言设置
  language: string;
  // 侧边栏状态
  sidebarCollapsed: boolean;
  // 最近访问的页面
  recentPages: string[];
  // 是否显示通知
  showNotifications: boolean;
  // 通知数量
  notificationCount: number;
}

// AppContext 类型
interface AppContextType {
  // 应用状态
  state: AppState;
  // 更新主题
  setTheme: (theme: Theme) => void;
  // 更新语言
  setLanguage: (language: string) => void;
  // 切换侧边栏状态
  toggleSidebar: () => void;
  // 添加最近访问页面
  addRecentPage: (page: string) => void;
  // 切换通知显示状态
  toggleNotifications: () => void;
  // 设置通知数量
  setNotificationCount: (count: number) => void;
}

// 创建 AppContext
const AppContext = createContext<AppContextType | undefined>(undefined);

// 默认应用状态
const defaultAppState: AppState = {
  theme: 'light',
  language: 'zh',
  sidebarCollapsed: false,
  recentPages: [],
  showNotifications: false,
  notificationCount: 0
};

// AppProvider 组件
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultAppState);
  
  const setTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  };
  
  const setLanguage = (language: string) => {
    setState(prev => ({ ...prev, language }));
  };
  
  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };
  
  const addRecentPage = (page: string) => {
    setState(prev => {
      const recentPages = [page, ...prev.recentPages.filter(p => p !== page)].slice(0, 5);
      return { ...prev, recentPages };
    });
  };
  
  const toggleNotifications = () => {
    setState(prev => ({ ...prev, showNotifications: !prev.showNotifications }));
  };
  
  const setNotificationCount = (count: number) => {
    setState(prev => ({ ...prev, notificationCount: count }));
  };

  return (
    <AppContext.Provider value={{
      state,
      setTheme,
      setLanguage,
      toggleSidebar,
      addRecentPage,
      toggleNotifications,
      setNotificationCount
    }}>
      {children}
    </AppContext.Provider>
  );
}

// useAppContext hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
