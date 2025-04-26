'use client';

import React, { useState, useEffect } from 'react';
import UserList from '@/components/ui/UserList';
import { useUsers } from '@/hooks/useUsers';

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
 * useUsers Hook示例页面
 * 
 * @returns {React.ReactElement} 示例页面
 */
export default function UserHookExamplePage() {
  // 查询参数状态
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // 使用useUsers Hook获取用户数据
  const { 
    users, 
    total, 
    totalPages, 
    isLoading, 
    error, 
    refresh, 
    clearCache 
  } = useUsers({
    search,
    department,
    page,
    pageSize: 10,
    sortBy,
    sortDirection
  });
  
  // 搜索防抖
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // 重置页码
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput]);
  
  // 部门筛选处理
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
    setPage(1); // 重置页码
  };
  
  // 排序处理
  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setPage(1); // 重置页码
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">useUsers Hook 示例</h1>
        <p className="text-gray-500">
          这个示例展示了如何使用 useUsers Hook 获取和管理用户数据，并结合 UserList 组件展示数据。
        </p>
      </div>
      
      {/* 控制面板 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="搜索用户..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="px-4 py-2 border rounded-md"
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="">所有部门</option>
              {DEPARTMENT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={refresh}
            >
              刷新
            </button>
          </div>
          
          <div>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={clearCache}
            >
              清除缓存
            </button>
          </div>
        </div>
      </div>
      
      {/* 状态信息 */}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-md">
          加载中...
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
          出错了: {error}
        </div>
      )}
      
      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow">
        {/* 表头 */}
        <div className="flex items-center p-4 bg-gray-50 text-sm font-medium text-gray-500">
          <div className="w-10 mr-4"></div>
          <div className="flex-1">
            <button 
              className="flex items-center"
              onClick={() => handleSort('name')}
            >
              姓名
              {sortBy === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          </div>
          <div className="w-40">
            <button 
              className="flex items-center"
              onClick={() => handleSort('department')}
            >
              部门
              {sortBy === 'department' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          </div>
          <div className="w-40">
            <button 
              className="flex items-center"
              onClick={() => handleSort('position')}
            >
              职位
              {sortBy === 'position' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          </div>
        </div>
        
        {/* 列表内容 */}
        <div>
          {users.length > 0 ? (
            users.map(user => (
              <div 
                key={user.id} 
                className="flex items-center p-4 border-b hover:bg-gray-50"
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
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="w-40 text-sm text-gray-500">
                  {user.department}
                </div>
                <div className="w-40 text-sm text-gray-500">
                  {user.position}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              没有找到匹配的用户
            </div>
          )}
        </div>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-gray-500">
              共 {total} 条记录，第 {page}/{totalPages} 页
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                上一页
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // 显示当前页附近的页码
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded text-sm ${
                      page === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border'
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 