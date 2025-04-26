'use client';

import React from 'react';

/**
 * 错误显示组件属性接口
 * @interface ErrorDisplayProps
 * @property {Error} error - 错误对象
 * @property {string} [className] - 额外的CSS类名
 */
export interface ErrorDisplayProps {
  error: Error;
  className?: string;
}

/**
 * 错误显示组件
 * @param props 错误显示组件属性
 * @returns 错误显示组件
 */
export function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">出错了</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message || '发生未知错误'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
