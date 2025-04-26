'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/components/ui/UserList';

/**
 * 部门选项
 */
const DEPARTMENT_OPTIONS = [
  { value: '技术部', label: '技术部' },
  { value: '产品部', label: '产品部' },
  { value: '设计部', label: '设计部' },
  { value: '市场部', label: '市场部' },
  { value: '人力资源部', label: '人力资源部' },
  { value: '财务部', label: '财务部' },
  { value: '销售部', label: '销售部' }
];

/**
 * 职位选项
 */
const POSITION_OPTIONS = [
  { value: '工程师', label: '工程师' },
  { value: '经理', label: '经理' },
  { value: '设计师', label: '设计师' },
  { value: '专员', label: '专员' },
  { value: '主管', label: '主管' },
  { value: '助理', label: '助理' },
  { value: '总监', label: '总监' }
];

/**
 * 用户表单提交数据
 */
export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
  joinDate?: string;
}

/**
 * 用户表单组件属性
 * @interface UserFormProps
 */
interface UserFormProps {
  /**
   * 初始用户数据（编辑模式）
   */
  initialData?: User;
  
  /**
   * 提交回调
   */
  onSubmit: (data: UserFormData) => void;
  
  /**
   * 取消回调
   */
  onCancel?: () => void;
  
  /**
   * 是否处于加载状态
   */
  isLoading?: boolean;
  
  /**
   * 表单模式
   */
  mode?: 'create' | 'edit';
  
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 表单字段组件
 */
const FormField: React.FC<{
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, error, required = false, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

/**
 * 用户表单组件
 * 
 * 用于创建或编辑用户信息
 * 
 * @param {UserFormProps} props - 组件属性
 * @returns {React.ReactElement} 用户表单组件
 */
const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
  className = ''
}) => {
  // 表单数据状态
  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    department: '',
    position: '',
    avatar: '',
    joinDate: ''
  });
  
  // 错误信息状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 如果提供了初始数据，初始化表单
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        position: initialData.position || '',
        avatar: initialData.avatar || '',
        joinDate: initialData.joinDate || ''
      });
    }
  }, [initialData]);
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.department) {
      newErrors.department = '请选择部门';
    }
    
    if (!formData.position) {
      newErrors.position = '请选择职位';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form 
      className={`bg-white rounded-lg shadow p-6 ${className}`}
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-6">
        {mode === 'create' ? '创建新用户' : '编辑用户信息'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="姓名" error={errors.name} required>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </FormField>
        
        <FormField label="邮箱" error={errors.email} required>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </FormField>
        
        <FormField label="部门" error={errors.department} required>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">请选择</option>
            {DEPARTMENT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        
        <FormField label="职位" error={errors.position} required>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">请选择</option>
            {POSITION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        
        <FormField label="头像URL" error={errors.avatar}>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="https://example.com/avatar.jpg"
          />
        </FormField>
        
        <FormField label="入职日期" error={errors.joinDate}>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </FormField>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            取消
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? '提交中...' : mode === 'create' ? '创建' : '保存'}
        </button>
      </div>
    </form>
  );
};

export default UserForm; 