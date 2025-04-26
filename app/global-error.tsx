'use client';

import React, { useEffect } from 'react';

/**
 * 全局根级错误处理组件属性
 * @interface GlobalErrorProps
 * @property {Error} error - 错误对象
 * @property {() => void} reset - 重置/重试函数
 */
interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * 全局根级错误处理组件
 * 
 * 当整个应用出现未捕获错误时显示，包括layout.tsx中的错误
 * 
 * @param {GlobalErrorProps} props - 组件属性
 * @returns {React.ReactElement} 错误处理界面
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 可以在这里记录错误到日志服务
    console.error('全局错误:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
          <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-center text-gray-900">系统错误</h2>
            <p className="mt-4 text-center text-gray-600">
              抱歉，系统发生了严重错误。
            </p>
            <div className="mt-6">
              <button 
                onClick={reset}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              >
                重试
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 