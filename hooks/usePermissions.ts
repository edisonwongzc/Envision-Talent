import { useAuth } from '@/contexts/AuthContext';

/**
 * 权限控制Hook
 * 提供权限检查和数据过滤功能
 */
export function usePermissions() {
  const { state, hasPermission, canViewUserData } = useAuth();

  /**
   * 检查是否可以查看所有员工数据
   */
  const canViewAllEmployees = () => {
    return state.user?.role === 'coe';
  };

  /**
   * 检查是否可以查看体系员工数据
   */
  const canViewSystemEmployees = () => {
    return state.user?.role === 'hrbp' || state.user?.role === 'system_leader';
  };

  /**
   * 检查是否只能查看自己的数据
   */
  const canOnlyViewOwnData = () => {
    return state.user?.role === 'employee';
  };

  /**
   * 根据用户角色过滤员工数据
   * @param employees 员工列表
   * @returns 过滤后的员工列表
   */
  const filterEmployeesByPermission = (employees: any[]) => {
    if (!state.user) return [];

    const { role, id: currentUserId, system } = state.user;

    switch (role) {
      case 'employee':
        // 普通员工只能看到自己
        return employees.filter(emp => emp.id === currentUserId);
      
      case 'coe':
        // 干部COE可以看到所有员工
        return employees;
      
      case 'hrbp':
      case 'system_leader':
        // 体系HRBP和体系负责人只能看到自己体系的员工
        return employees.filter(emp => emp.system === system);
      
      default:
        return [];
    }
  };

  /**
   * 根据用户角色过滤人才标准数据
   * @param standards 人才标准列表
   * @returns 过滤后的人才标准列表
   */
  const filterStandardsByPermission = (standards: any[]) => {
    if (!state.user) return [];

    const { role, system } = state.user;

    switch (role) {
      case 'employee':
        // 普通员工可以查看所有标准（用于学习参考）
        return standards;
      
      case 'coe':
        // 干部COE可以查看所有标准
        return standards;
      
      case 'hrbp':
      case 'system_leader':
        // 体系HRBP和体系负责人主要关注自己体系的标准，但也可以查看其他标准作为参考
        return standards;
      
      default:
        return [];
    }
  };

  /**
   * 检查是否可以编辑人才标准
   */
  const canEditStandards = () => {
    return state.user?.role === 'coe' || state.user?.role === 'system_leader';
  };

  /**
   * 检查是否可以创建人才标准
   */
  const canCreateStandards = () => {
    return state.user?.role === 'coe' || state.user?.role === 'system_leader';
  };

  /**
   * 检查是否可以删除人才标准
   */
  const canDeleteStandards = () => {
    return state.user?.role === 'coe';
  };

  /**
   * 获取用户可访问的体系列表
   */
  const getAccessibleSystems = () => {
    if (!state.user) return [];

    const { role, system } = state.user;

    switch (role) {
      case 'employee':
        // 普通员工可以查看所有体系（用于了解）
        return ['技术体系', '产品体系', '销售体系', '运营体系'];
      
      case 'coe':
        // 干部COE可以访问所有体系
        return ['技术体系', '产品体系', '销售体系', '运营体系'];
      
      case 'hrbp':
      case 'system_leader':
        // 体系HRBP和体系负责人主要关注自己的体系
        return system ? [system] : [];
      
      default:
        return [];
    }
  };

  return {
    // 基础权限检查
    hasPermission,
    canViewUserData,
    
    // 角色特定权限
    canViewAllEmployees,
    canViewSystemEmployees,
    canOnlyViewOwnData,
    
    // 数据过滤
    filterEmployeesByPermission,
    filterStandardsByPermission,
    
    // 操作权限
    canEditStandards,
    canCreateStandards,
    canDeleteStandards,
    
    // 访问范围
    getAccessibleSystems,
    
    // 当前用户信息
    currentUser: state.user
  };
} 