'use client';

import React, { useState, useEffect } from 'react';
import { 
  Filter as FilterIcon, 
  Search as SearchIcon, 
  X as XIcon,
  User as UserIcon,
  Briefcase as BriefcaseIcon,
  Mail as EnvelopeIcon,
  CreditCard as IdCardIcon,
  Calendar as CalendarIcon
} from "lucide-react";
import { useDebounce } from '@/hooks/useDebounce'; 

/**
 * 筛选选项接口
 */
interface FilterOption {
  value: string;
  label: string;
}

/**
 * 筛选字段接口
 */
interface FilterField {
  field: string;
  label: string;
  options: FilterOption[];
}

/**
 * 筛选条件接口
 */
export interface FilterCondition {
  search?: string;
  [key: string]: string | undefined;
}

/**
 * 用户筛选组件属性
 * @interface UserFilterProps
 */
interface UserFilterProps {
  /**
   * 筛选字段配置
   */
  filterFields: FilterField[];
  
  /**
   * 是否显示搜索框
   */
  showSearch?: boolean;
  
  /**
   * 筛选条件变化回调
   */
  onFilterChange: (filters: FilterCondition) => void;
  
  /**
   * 初始筛选条件
   */
  initialFilters?: FilterCondition;
  
  /**
   * 自定义CSS类名
   */
  className?: string;
  
  /**
   * 搜索框占位文本
   */
  searchPlaceholder?: string;
}

/**
 * 用户高级筛选组件
 * 
 * 提供搜索和多条件筛选功能
 * 
 * @param {UserFilterProps} props - 组件属性
 * @returns {React.ReactElement} 用户筛选组件
 */
const UserFilter: React.FC<UserFilterProps> = ({
  filterFields,
  showSearch = true,
  onFilterChange,
  initialFilters = {},
  className = '',
  searchPlaceholder = '搜索用户...'
}) => {
  // 筛选状态
  const [filters, setFilters] = useState<FilterCondition>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 新增本地搜索状态，用于防抖
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  // 使用防抖
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // 监听防抖后的搜索词变化
  useEffect(() => {
    const newFilters = { ...filters, search: debouncedSearchTerm || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [debouncedSearchTerm]);
  
  // 处理搜索
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 处理筛选条件变化
  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
    if (!value) {
      delete newFilters[field];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // 重置所有筛选条件
  const handleReset = () => {
    const newFilters = showSearch ? { search: filters.search } : {};
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // 计算已应用的筛选条件数量
  const appliedFiltersCount = Object.keys(filters).filter(key => 
    key !== 'search' && filters[key]
  ).length;
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {/* 搜索框 */}
      {showSearch && (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}
      
      {/* 高级筛选切换 */}
      {filterFields.length > 0 && (
        <div className="mt-4">
          <button
            className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FilterIcon size={14} className="mr-1" />
            高级筛选
            {appliedFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                {appliedFiltersCount}
              </span>
            )}
          </button>
          
          {/* 高级筛选面板 */}
          {isExpanded && (
            <div className="mt-3 p-3 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">筛选条件</h3>
                <button
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={handleReset}
                >
                  重置
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterFields.map(({ field, label, options }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-sm text-gray-600">{label}</label>
                    <select
                      className="w-full border rounded-md px-3 py-1.5 text-sm"
                      value={filters[field] || ''}
                      onChange={(e) => handleFilterChange(field, e.target.value)}
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
            </div>
          )}
        </div>
      )}
      
      {/* 已应用的筛选条件标签 */}
      {appliedFiltersCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.keys(filters).map(key => {
            if (key === 'search' || !filters[key]) return null;
            
            // 查找对应的标签文本
            const field = filterFields.find(f => f.field === key);
            const option = field?.options.find(o => o.value === filters[key]);
            const label = field?.label;
            const value = option?.label || filters[key];
            
            return (
              <div 
                key={key}
                className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
              >
                <span className="font-medium mr-1">{label}:</span>
                <span>{value}</span>
                <button
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => handleFilterChange(key, '')}
                >
                  <XIcon size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(UserFilter); 