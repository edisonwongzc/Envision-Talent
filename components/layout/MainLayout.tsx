'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '@/contexts/AppContext';

/**
 * 主布局组件
 * @param props 包含子组件的属性
 * @returns 应用主布局
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  const { state } = useAppContext();
  
  return (
    <div className={`flex h-screen ${state.theme}`}>
      {/* 侧边导航栏 */}
      <Sidebar />
      
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <Header />
        
        {/* 内容区 */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 