'use client';

import React from 'react';
import { User } from '@/components/ui/UserList';
import { useUserContext } from '@/contexts/UserContext';
import { UserIcon, BriefcaseIcon, EnvelopeIcon, IdCardIcon, CalendarIcon } from '@/components/icons';

/**
 * 用户详情组件属性
 */
interface UserDetailViewProps {
  /**
   * 用户数据 - 可选，如果提供则使用该数据，否则从Context获取
   */
  user?: User | null;
  
  /**
   * 编辑按钮点击回调
   */
  onEdit?: (user: User) => void;
  
  /**
   * 关闭按钮点击回调
   */
  onClose?: () => void;
  
  /**
   * 是否显示编辑按钮
   */
  showEditButton?: boolean;
  
  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;
  
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 信息项组件
 */
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

/**
 * 信息项组件
 */
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start py-3 border-b border-gray-100">
      <div className="text-gray-400 mr-3 mt-1">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
};

/**
 * 用户详情视图组件
 * 
 * 展示用户详细信息，可以从props获取用户数据或从Context中获取
 * 
 * @param {UserDetailViewProps} props - 组件属性
 * @returns {React.ReactElement} 用户详情视图
 */
const UserDetailView: React.FC<UserDetailViewProps> = ({
  user: propUser,
  onEdit,
  onClose,
  showEditButton = true,
  showCloseButton = true,
  className = ''
}) => {
  // 从Context获取数据
  const { selectedUser } = useUserContext();
  
  // 使用props中的用户数据或Context中的用户数据
  const user = propUser || selectedUser;
  
  // 如果没有用户数据，显示空状态
  if (!user) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 text-center ${className}`}>
        <div className="text-gray-500">请选择一个用户查看详情</div>
      </div>
    );
  }
  
  // 处理编辑按钮点击
  const handleEditClick = () => {
    onEdit?.(user);
  };
  
  // 处理关闭按钮点击
  const handleCloseClick = () => {
    onClose?.();
  };
  
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 relative">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <h1 className="text-2xl font-bold">用户详情</h1>
        </div>
        
        {/* 操作按钮 */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {showEditButton && (
            <button
              className="bg-white text-gray-700 p-2 rounded-full shadow hover:bg-gray-100"
              onClick={handleEditClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
          )}
          
          {showCloseButton && (
            <button
              className="bg-white text-gray-700 p-2 rounded-full shadow hover:bg-gray-100"
              onClick={handleCloseClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* 用户头像和姓名 */}
      <div className="flex flex-col items-center -mt-16 mb-4">
        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <UserIcon size={48} className="text-gray-400" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        {user.position && (
          <div className="flex items-center text-gray-600 mt-1">
            <BriefcaseIcon size={16} className="mr-1" />
            <span>{user.position}</span>
          </div>
        )}
        {user.department && (
          <div className="text-gray-500 mt-1">{user.department}</div>
        )}
      </div>
      
      {/* 详细信息 */}
      <div className="px-6 py-4">
        <InfoItem 
          icon={<EnvelopeIcon size={18} />} 
          label="电子邮箱" 
          value={user.email} 
        />
        
        <InfoItem 
          icon={<IdCardIcon size={18} />} 
          label="员工ID" 
          value={user.id} 
        />
        
        <InfoItem 
          icon={<CalendarIcon size={18} />} 
          label="入职日期" 
          value={user.joinDate} 
        />
        
        {/* 可以添加更多字段 */}
      </div>
    </div>
  );
};

export default UserDetailView; 