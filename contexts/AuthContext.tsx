'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 用户角色类型
export type UserRole = 'employee' | 'coe' | 'hrbp' | 'system_leader';

// 用户信息接口
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  system?: string; // 所负责的体系（适用于HRBP和体系负责人）
  department?: string; // 部门
}

// 鉴权状态接口
interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// AuthContext 类型
interface AuthContextType {
  // 鉴权状态
  state: AuthState;
  // 登录
  login: (username: string, password: string, role: UserRole, system?: string) => Promise<boolean>;
  // 登出
  logout: () => void;
  // 检查权限
  hasPermission: (resource: string, action: string) => boolean;
  // 检查是否可以查看特定用户的数据
  canViewUserData: (targetUserId: string) => boolean;
  // 获取角色显示名称
  getRoleDisplayName: (role: UserRole) => string;
}

// 创建 AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 默认鉴权状态
const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false
};

// 角色显示名称映射
const roleDisplayNames: Record<UserRole, string> = {
  employee: '普通员工',
  coe: '干部COE',
  hrbp: '体系HRBP',
  system_leader: '体系负责人'
};

// 模拟用户数据
const mockUsers: Record<UserRole, Partial<UserInfo>> = {
  employee: { id: '1', name: '张三', role: 'employee', department: '技术部' },
  coe: { id: '2', name: '李经理', role: 'coe', department: 'HR部' },
  hrbp: { id: '3', name: '王HRBP', role: 'hrbp', system: '技术体系', department: 'HR部' },
  system_leader: { id: '4', name: '刘总监', role: 'system_leader', system: '技术体系', department: '技术部' }
};

// AuthProvider 组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultAuthState);

  // 从localStorage恢复登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string, role: UserRole, system?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const baseUser = mockUsers[role];
      const user: UserInfo = {
        id: baseUser.id!,
        name: baseUser.name!,
        role: baseUser.role!,
        avatar: baseUser.avatar,
        system: system || baseUser.system,
        department: baseUser.department
      };
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    setState(defaultAuthState);
    localStorage.removeItem('user');
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!state.user) return false;

    const { role } = state.user;

    switch (role) {
      case 'employee':
        // 普通员工：仅限于查看自己的内容
        return action === 'view' && resource === 'own_data';
      
      case 'coe':
        // 干部COE：查看全部员工的内容
        return action === 'view';
      
      case 'hrbp':
      case 'system_leader':
        // 体系HRBP和体系负责人：所负责体系正式员工
        return action === 'view' && (resource === 'system_employees' || resource === 'own_system');
      
      default:
        return false;
    }
  };

  const canViewUserData = (targetUserId: string): boolean => {
    if (!state.user) return false;

    const { role, id: currentUserId } = state.user;

    switch (role) {
      case 'employee':
        // 普通员工只能查看自己的数据
        return targetUserId === currentUserId;
      
      case 'coe':
        // 干部COE可以查看所有人的数据
        return true;
      
      case 'hrbp':
      case 'system_leader':
        // 体系HRBP和体系负责人可以查看自己体系的员工数据
        // 这里需要根据实际的员工-体系关系来判断
        // 暂时返回true，实际应用中需要查询员工所属体系
        return true;
      
      default:
        return false;
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    return roleDisplayNames[role] || role;
  };

  return (
    <AuthContext.Provider value={{
      state,
      login,
      logout,
      hasPermission,
      canViewUserData,
      getRoleDisplayName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 