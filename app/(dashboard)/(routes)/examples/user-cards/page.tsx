'use client';

import React, { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';
import UserGrid from '@/components/ui/UserGrid';
import UserFilter, { FilterCondition } from '@/components/ui/UserFilter';
import { User } from '@/components/ui/UserList';

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
 * 用户卡片示例页面
 * 
 * @returns {React.ReactElement} 示例页面
 */
export default function UserCardsExamplePage() {
  // 筛选条件状态
  const [filters, setFilters] = useState<FilterCondition>({});
  
  // 使用useUsers Hook获取用户数据
  const { users, isLoading, error } = useUsers();
  
  // 根据筛选条件过滤用户
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 搜索过滤
      if (filters.search && !matchesSearch(user, filters.search)) {
        return false;
      }
      
      // 部门过滤
      if (filters.department && user.department !== filters.department) {
        return false;
      }
      
      // 职位过滤
      if (filters.position && user.position !== filters.position) {
        return false;
      }
      
      return true;
    });
  }, [users, filters]);
  
  // 处理用户点击
  const handleUserClick = (user: User) => {
    alert(`查看用户详情: ${user.name}`);
  };
  
  // 处理编辑按钮点击
  const handleUserEdit = (user: User) => {
    alert(`编辑用户: ${user.name}`);
  };
  
  // 处理筛选条件变化
  const handleFilterChange = (newFilters: FilterCondition) => {
    setFilters(newFilters);
  };
  
  // 切换列数
  const [columns, setColumns] = useState<1 | 2 | 3 | 4>(3);
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">用户卡片组件示例</h1>
        <p className="text-gray-500">
          这个示例展示了如何使用 UserCard、UserGrid 和 UserFilter 组件，结合 useUsers Hook 实现用户展示和筛选功能。
        </p>
      </div>
      
      {/* 筛选工具栏 */}
      <div className="mb-6">
        <UserFilter
          filterFields={FILTER_FIELDS}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </div>
      
      {/* 列数控制 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredUsers.length === 0 ? 
            '没有匹配的用户' : 
            `显示 ${filteredUsers.length} 个用户`
          }
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">列数:</span>
          {[1, 2, 3, 4].map(col => (
            <button
              key={col}
              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                columns === col
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setColumns(col as 1 | 2 | 3 | 4)}
            >
              {col}
            </button>
          ))}
        </div>
      </div>
      
      {/* 用户卡片网格 */}
      <UserGrid
        users={filteredUsers}
        onUserClick={handleUserClick}
        onUserEdit={handleUserEdit}
        showEditButton={true}
        columns={columns}
        isLoading={isLoading}
        error={error}
        emptyText="没有找到匹配的用户"
      />
    </div>
  );
}

/**
 * 检查用户是否匹配搜索词
 * 
 * @param {User} user - 用户对象
 * @param {string} search - 搜索词
 * @returns {boolean} 是否匹配
 */
function matchesSearch(user: User, search: string): boolean {
  const searchLower = search.toLowerCase();
  return (
    user.name.toLowerCase().includes(searchLower) ||
    (user.email && user.email.toLowerCase().includes(searchLower)) ||
    (user.department && user.department.toLowerCase().includes(searchLower)) ||
    (user.position && user.position.toLowerCase().includes(searchLower))
  );
} 