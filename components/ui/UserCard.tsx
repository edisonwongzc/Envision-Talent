'use client';

import React from 'react';
import { User } from '@/components/ui/UserList';
import { 
  User as UserIcon, 
  Briefcase as BriefcaseIcon,
  Edit as EditIcon
} from "lucide-react";

/**
 * 用户卡片组件属性
 * @interface UserCardProps
 */
interface UserCardProps {
  /**
   * 用户数据
   */
  user: User;
  
  /**
   * 卡片点击事件处理
   */
  onClick?: (user: User) => void;
  
  /**
   * 编辑按钮点击事件处理
   */
  onEdit?: (user: User) => void;
  
  /**
   * 是否显示编辑按钮
   */
  showEditButton?: boolean;
  
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 用户卡片组件
 * 
 * 以卡片形式展示用户信息
 * 
 * @param {UserCardProps} props - 组件属性
 * @returns {React.ReactElement} 用户卡片组件
 */
const UserCard: React.FC<UserCardProps> = ({
  user,
  onClick,
  onEdit,
  showEditButton = false,
  className = ''
}) => {
  // 处理卡片点击
  const handleCardClick = () => {
    onClick?.(user);
  };
  
  // 处理编辑按钮点击
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡到卡片
    onEdit?.(user);
  };
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick ? handleCardClick : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* 卡片头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-20 relative">
        {showEditButton && onEdit && (
          <button
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
            onClick={handleEditClick}
          >
            <EditIcon size={16} className="text-gray-600" />
          </button>
        )}
      </div>
      
      {/* 用户头像 */}
      <div className="flex justify-center -mt-10">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <UserIcon size={32} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      {/* 用户信息 */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
        
        {user.position && (
          <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
            <BriefcaseIcon size={14} className="mr-1" />
            <span>{user.position}</span>
          </div>
        )}
        
        {user.department && (
          <div className="mt-1 text-sm text-gray-500">{user.department}</div>
        )}
        
        {user.email && (
          <div className="mt-3 text-sm text-blue-500 truncate">{user.email}</div>
        )}
      </div>
      
      {/* 底部统计或操作区 */}
      <div className="border-t px-4 py-3 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
        <div>员工ID: {user.id}</div>
        <div className="text-right">
          {/* 可以添加其他信息，如入职时间、绩效等 */}
          {user.joinDate && <span>入职: {user.joinDate}</span>}
        </div>
      </div>
    </div>
  );
};

export default UserCard; 