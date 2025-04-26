'use client';

import React, { useState } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import UserListContainer from '@/components/UserListContainer';
import UserDetailView from '@/components/UserDetailView';
import { User } from '@/components/ui/UserList';

/**
 * 用户管理页面
 * 
 * 使用Context提供的数据管理功能，展示用户列表和详情
 * 
 * @returns {React.ReactElement} 用户管理页面
 */
export default function UsersPage() {
  // 视图状态
  const [selectedView, setSelectedView] = useState<'list' | 'detail' | 'both'>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // 处理用户点击
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setSelectedView('both');
  };
  
  // 处理编辑按钮点击
  const handleEditClick = (user: User) => {
    // 实际项目中，可以在这里打开编辑对话框
    alert(`编辑用户: ${user.name}`);
  };
  
  // 处理详情视图关闭
  const handleDetailClose = () => {
    setSelectedView('list');
    setSelectedUser(null);
  };
  
  return (
    <UserProvider>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-gray-500">查看和管理系统用户</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 用户列表部分 */}
          {(selectedView === 'list' || selectedView === 'both') && (
            <div className={selectedView === 'both' ? 'lg:w-2/3' : 'w-full'}>
              <UserListContainer
                initialViewMode="grid"
                showFilter={true}
                showEditButton={true}
                onUserClick={handleUserClick}
                onUserEdit={handleEditClick}
              />
            </div>
          )}
          
          {/* 用户详情部分 */}
          {(selectedView === 'detail' || selectedView === 'both') && (
            <div className={selectedView === 'both' ? 'lg:w-1/3' : 'w-full'}>
              <UserDetailView
                user={selectedUser}
                onEdit={handleEditClick}
                onClose={handleDetailClose}
                showEditButton={true}
                showCloseButton={true}
              />
            </div>
          )}
        </div>
      </div>
    </UserProvider>
  );
} 