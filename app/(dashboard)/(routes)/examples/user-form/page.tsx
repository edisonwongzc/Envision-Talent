'use client';

import React, { useState } from 'react';
import UserForm, { UserFormData } from '@/components/ui/UserForm';
import UserCard from '@/components/ui/UserCard';
import { User } from '@/components/ui/UserList';

/**
 * 用户表单示例页面
 * 
 * @returns {React.ReactElement} 示例页面
 */
export default function UserFormExamplePage() {
  // 模拟的用户数据
  const [mockUser, setMockUser] = useState<User | null>(null);
  
  // 表单模式
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 提交结果
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    data?: UserFormData;
  } | null>(null);
  
  // 处理表单提交
  const handleSubmit = (data: UserFormData) => {
    setIsLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const newUser: User = {
        id: data.id || `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        department: data.department,
        position: data.position,
        avatar: data.avatar,
        joinDate: data.joinDate
      };
      
      setMockUser(newUser);
      setSubmitResult({
        success: true,
        message: mode === 'create' ? '用户创建成功' : '用户更新成功',
        data
      });
      
      // 创建成功后重置表单
      if (mode === 'create') {
        setMode('edit');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // 处理取消
  const handleCancel = () => {
    if (mode === 'edit' && !mockUser) {
      setMode('create');
    }
  };
  
  // 切换模式
  const toggleMode = () => {
    setMode(mode === 'create' ? 'edit' : 'create');
    if (mode === 'edit') {
      setMockUser(null);
      setSubmitResult(null);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">用户表单组件示例</h1>
        <p className="text-gray-500">
          这个示例展示了如何使用 UserForm 组件创建和编辑用户信息。表单包含基本验证和提交功能。
        </p>
      </div>
      
      {/* 模式切换 */}
      <div className="mb-6">
        <button
          className={`px-4 py-2 rounded-md mr-2 ${
            mode === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => toggleMode()}
        >
          创建模式
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            mode === 'edit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => toggleMode()}
        >
          编辑模式
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 表单部分 */}
        <div>
          <UserForm
            initialData={mockUser || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            mode={mode}
          />
        </div>
        
        {/* 结果展示部分 */}
        <div>
          {submitResult && (
            <div className={`mb-6 p-4 rounded-md ${
              submitResult.success
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}>
              <h3 className="font-medium">{submitResult.message}</h3>
              {submitResult.data && (
                <pre className="mt-2 p-3 bg-gray-800 text-gray-100 rounded-md text-sm overflow-auto">
                  {JSON.stringify(submitResult.data, null, 2)}
                </pre>
              )}
            </div>
          )}
          
          {mockUser && (
            <div>
              <h3 className="text-lg font-semibold mb-3">用户卡片预览</h3>
              <UserCard
                user={mockUser}
                className="max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 