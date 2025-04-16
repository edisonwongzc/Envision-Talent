'use client';

import React from 'react';
import Sidebar from '../(dashboard)/components/sidebar';
import Header from '../(dashboard)/components/header';

/**
 * 可复用的仪表盘布局组件，基于Tiimi设计风格
 * @param {object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @return {React.ReactElement} 仪表盘布局
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-[#F3F7FA]">
      <div className="h-[64px] fixed inset-y-0 w-full z-[60]">
        <Header />
      </div>
      <div className="hidden md:flex h-[calc(100%-48px)] w-[200px] flex-col fixed top-[48px] left-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-[200px] pt-[64px] h-full bg-[#F3F7FA]">
        <div className="container mx-auto px-4 py-6 h-full">
          {children}
        </div>
      </main>
    </div>
  );
} 