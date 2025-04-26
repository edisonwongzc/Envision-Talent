'use client';

import React from 'react';
import { User } from '@/components/ui/UserList';
import UserCard from '@/components/ui/UserCard';

/**
 * 用户网格组件属性
 * @interface UserGridProps
 */
interface UserGridProps {
  /**
   * 用户数据数组
   */
  users: User[];
  
  /**
   * 用户卡片点击事件处理
   */
  onUserClick?: (user: User) => void;
  
  /**
   * 用户编辑按钮点击事件处理
   */
  onUserEdit?: (user: User) => void;
  
  /**
   * 是否显示编辑按钮
   */
  showEditButton?: boolean;
  
  /**
   * 每行显示的卡片数量
   */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  
  /**
   * 自定义CSS类名
   */
  className?: string;
  
  /**
   * 加载状态
   */
  isLoading?: boolean;
  
  /**
   * 错误信息
   */
  error?: string | null;
  
  /**
   * 无数据时的提示文本
   */
  emptyText?: string;
}

/**
 * 骨架屏组件
 */
const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-300 h-20"></div>
      <div className="flex justify-center -mt-10">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-300"></div>
      </div>
      <div className="p-4 text-center">
        <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mt-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mt-2"></div>
      </div>
      <div className="border-t p-3 bg-gray-100">
        <div className="h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

/**
 * 用户网格组件
 * 
 * 以网格布局展示多个用户卡片
 * 
 * @param {UserGridProps} props - 组件属性
 * @returns {React.ReactElement} 用户网格组件
 */
const UserGrid: React.FC<UserGridProps> = ({
  users,
  onUserClick,
  onUserEdit,
  showEditButton = false,
  columns = 3,
  className = '',
  isLoading = false,
  error = null,
  emptyText = '没有用户数据'
}) => {
  // 根据columns计算网格类名
  const gridClassName = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }[columns];
  
  // 加载状态
  if (isLoading) {
    return (
      <div className={`grid ${gridClassName} gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  // 错误状态
  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-md">
        出错了: {error}
      </div>
    );
  }
  
  // 无数据状态
  if (users.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-500 p-8 rounded-md text-center">
        {emptyText}
      </div>
    );
  }
  
  // 渲染用户卡片网格
  return (
    <div className={`grid ${gridClassName} gap-6 ${className}`}>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onClick={onUserClick}
          onEdit={onUserEdit}
          showEditButton={showEditButton}
        />
      ))}
    </div>
  );
};

export default UserGrid; 