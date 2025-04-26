'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { SearchIcon } from '@/components/icons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { UserIcon } from '@/components/icons';

/**
 * 用户数据接口
 * @interface User
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  department?: string;
  position?: string;
  avatar?: string;
  [key: string]: any;
}

/**
 * 用户列表组件属性
 * @interface UserListProps
 */
interface UserListProps {
  /**
   * 用户数据数组
   */
  users: User[];
  
  /**
   * 每页显示的记录数
   */
  pageSize?: number;
  
  /**
   * 自定义渲染用户项的函数
   */
  renderItem?: (user: User) => React.ReactNode;
  
  /**
   * 点击用户项的回调函数
   */
  onUserClick?: (user: User) => void;
  
  /**
   * 是否显示搜索框
   */
  showSearch?: boolean;
  
  /**
   * 可排序的字段
   */
  sortableFields?: string[];
  
  /**
   * 筛选字段
   */
  filterFields?: {
    field: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  
  /**
   * 是否正在加载
   */
  isLoading?: boolean;
  
  /**
   * 错误信息
   */
  error?: Error | null;
}

/**
 * 用户列表组件
 * 
 * 一个可复用的用户列表组件，支持分页、搜索和排序功能
 * 
 * @param {UserListProps} props - 组件属性
 * @returns {React.ReactElement} 用户列表组件
 */
const UserList: React.FC<UserListProps> = ({
  users,
  pageSize = 10,
  renderItem,
  onUserClick,
  showSearch = true,
  sortableFields = ['name'],
  filterFields = [],
  isLoading,
  error
}) => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };
  
  // 处理排序
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // 处理筛选
  const handleFilter = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // 重置到第一页
  };
  
  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // 过滤、排序和分页处理
  const filteredAndSortedUsers = useMemo(() => {
    // 先过滤
    let result = users.filter(user => {
      // 搜索过滤
      if (searchTerm && !Object.values(user).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )) {
        return false;
      }
      
      // 应用所有筛选条件
      for (const [field, value] of Object.entries(filters)) {
        if (value && user[field] !== value) {
          return false;
        }
      }
      
      return true;
    });
    
    // 再排序
    if (sortField) {
      result = [...result].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [users, searchTerm, sortField, sortDirection, filters]);
  
  // 分页处理
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);
  
  // 总页数
  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);
  
  // 默认渲染用户项
  const defaultRenderItem = useCallback((user: User) => (
    <div 
      key={user.id} 
      className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => onUserClick?.(user)}
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-4">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.position || user.email}</div>
      </div>
      <div className="text-sm text-gray-500">
        {user.department}
      </div>
    </div>
  ), [onUserClick]);
  
  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;
  }
  
  if (error) {
    return <ErrorDisplay error={error} retry={onUserClick ? () => {} : undefined} />;
  }
  
  if (!paginatedUsers.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="mb-2">
          <UserIcon size={40} className="mx-auto text-gray-300" />
        </div>
        <p>没有找到用户</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* 搜索和筛选区域 */}
      {(showSearch || filterFields.length > 0) && (
        <div className="p-4 border-b">
          {showSearch && (
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          )}
          
          {filterFields.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {filterFields.map(({ field, label, options }) => (
                <div key={field} className="flex items-center">
                  <span className="mr-2 text-sm">{label}:</span>
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={filters[field] || ''}
                    onChange={(e) => handleFilter(field, e.target.value)}
                  >
                    <option value="">全部</option>
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 用户列表标题栏 */}
      <div className="flex items-center p-4 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="w-10 mr-4"></div>
        <div className="flex-1">
          {sortableFields.includes('name') ? (
            <button 
              className="flex items-center"
              onClick={() => handleSort('name')}
            >
              姓名
              {sortField === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          ) : (
            <span>姓名</span>
          )}
        </div>
        <div>
          部门
        </div>
      </div>
      
      {/* 用户列表 */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => onUserClick?.(user)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-4">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.position || user.email}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.department}
                      </div>
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-500">
            显示 {paginatedUsers.length} 条，共 {filteredAndSortedUsers.length} 条
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              上一页
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'border'
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(UserList); 