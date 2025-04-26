'use client';

import React from 'react';

/**
 * 全局加载组件
 * 
 * 在页面或数据加载时显示
 * 
 * @returns {React.ReactElement} 加载界面
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl text-gray-700">加载中...</h2>
      </div>
    </div>
  );
} 