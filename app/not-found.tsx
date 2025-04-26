'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * 全局404页面组件
 * 
 * 当访问不存在的路径时显示
 * 
 * @returns {React.ReactElement} 404页面
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">页面未找到</h2>
        <p className="mt-6 text-gray-600">
          抱歉，您要查找的页面不存在或已被移除。
        </p>
        <div className="mt-8">
          <Link href="/" passHref>
            <Button>
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 