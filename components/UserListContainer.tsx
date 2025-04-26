'use client';

import React, { useState } from 'react';
import { User } from '@/components/ui/UserList';
import UserGrid from '@/components/ui/UserGrid';
import UserList from '@/components/ui/UserList';
import UserFilter from '@/components/ui/UserFilter';
import { FilterCondition } from '@/components/ui/UserFilter';
import { useUserContext } from '@/contexts/UserContext';

/**
 * 用户列表容器组件属性
 */
interface UserListContainerProps {
  /**
   * 是否使用网格视图
   */
  initialViewMode?: 'grid' | 'list';
  
  /**
   * 是否显示筛选工具栏
   */
  showFilter?: boolean;
  
  /**
   * 是否显示编辑按钮
   */
  showEditButton?: boolean;
  
  /**
   * 是否显示视图切换按钮
   */
  showViewToggle?: boolean;
  
  /**
   * 网格视图的列数
   */
  gridColumns?: 1 | 2 | 3 | 4 | 5 | 6;
  
  /**
   * 自定义CSS类名
   */
  className?: string;
  
  /**
   * 用户点击回调
   */
  onUserClick?: (user: User) => void;
  
  /**
   * 用户编辑回调
   */
  onUserEdit?: (user: User) => void;
}

/**
 * 部门选项
 */
const DEPARTMENT_OPTIONS = [
  { value: '技术部', label: '技术部' },
  { value: '产品部', label: '产品部' },
  { value: '设计部', label: '设计部' },
  { value: '市场部', label: '市场部' },
  { value: '人力资源部', label: '人力资源部' }
];

/**
 * 职位选项
 */
const POSITION_OPTIONS = [
  { value: '工程师', label: '工程师' },
  { value: '经理', label: '经理' },
  { value: '设计师', label: '设计师' },
  { value: '专员', label: '专员' },
  { value: '主管', label: '主管' }
];

/**
 * 筛选字段配置
 */
const FILTER_FIELDS = [
  {
    field: 'department',
    label: '部门',
    options: DEPARTMENT_OPTIONS
  },
  {
    field: 'position',
    label: '职位',
    options: POSITION_OPTIONS
  }
];

/**
 * 用户列表容器组件
 * 
 * 这是一个容器组件，使用UserContext获取数据，并提供视图切换、筛选等功能
 * 
 * @param {UserListContainerProps} props - 组件属性
 * @returns {React.ReactElement} - 用户列表容器
 */
const UserListContainer: React.FC<UserListContainerProps> = ({
  initialViewMode = 'grid',
  showFilter = true,
  showEditButton = false,
  showViewToggle = true,
  gridColumns = 3,
  className = '',
  onUserClick,
  onUserEdit
}) => {
  // 使用Context获取数据
  const {
    filteredUsers,
    isLoading,
    error,
    filters,
    setFilters,
    refreshUsers
  } = useUserContext();
  
  // 视图模式状态
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  
  // 处理筛选条件变化
  const handleFilterChange = (newFilters: FilterCondition) => {
    setFilters(newFilters);
  };
  
  // 处理用户点击
  const handleUserClick = (user: User) => {
    onUserClick?.(user);
  };
  
  // 处理用户编辑
  const handleUserEdit = (user: User) => {
    onUserEdit?.(user);
  };
  
  return (
    <div className={className}>
      {/* 工具栏 */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        {/* 筛选器 */}
        {showFilter && (
          <div className="flex-1">
            <UserFilter
              filterFields={FILTER_FIELDS}
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>
        )}
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {showViewToggle && (
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`px-3 py-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('grid')}
              >
                网格
              </button>
              <button
                className={`px-3 py-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('list')}
              >
                列表
              </button>
            </div>
          )}
          
          <button
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={refreshUsers}
          >
            刷新
          </button>
        </div>
      </div>
      
      {/* 用户列表/网格 */}
      {viewMode === 'grid' ? (
        <UserGrid
          users={filteredUsers}
          onUserClick={handleUserClick}
          onUserEdit={handleUserEdit}
          showEditButton={showEditButton}
          columns={gridColumns}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <UserList
          users={filteredUsers}
          onUserClick={handleUserClick}
          showSearch={false}
          sortableFields={['name', 'department', 'position']}
        />
      )}
    </div>
  );
};

export default UserListContainer; 