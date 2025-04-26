/**
 * 用户数据服务
 * 
 * 处理用户数据的获取、筛选和处理逻辑
 */

import { User } from '@/components/ui/UserList';
import { FilterCondition } from '@/components/ui/UserFilter';

// 模拟用户数据
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: '张三',
    email: 'zhangsan@example.com',
    department: '技术部',
    position: '工程师',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    joinDate: '2022-01-15'
  },
  {
    id: 'user-2',
    name: '李四',
    email: 'lisi@example.com',
    department: '产品部',
    position: '产品经理',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    joinDate: '2021-03-22'
  },
  {
    id: 'user-3',
    name: '王五',
    email: 'wangwu@example.com',
    department: '设计部',
    position: '设计师',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    joinDate: '2022-05-08'
  },
  {
    id: 'user-4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    department: '市场部',
    position: '市场专员',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    joinDate: '2021-11-30'
  },
  {
    id: 'user-5',
    name: '孙七',
    email: 'sunqi@example.com',
    department: '技术部',
    position: '主管',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    joinDate: '2020-06-18'
  },
  {
    id: 'user-6',
    name: '周八',
    email: 'zhouba@example.com',
    department: '人力资源部',
    position: '专员',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    joinDate: '2022-02-14'
  },
  {
    id: 'user-7',
    name: '吴九',
    email: 'wujiu@example.com',
    department: '财务部',
    position: '会计',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    joinDate: '2021-07-25'
  },
  {
    id: 'user-8',
    name: '郑十',
    email: 'zhengshi@example.com',
    department: '技术部',
    position: '工程师',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    joinDate: '2023-01-05'
  }
];

/**
 * 获取所有用户数据
 * 
 * @returns {Promise<User[]>} 用户数据数组
 */
export const getAllUsers = async (): Promise<User[]> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_USERS];
};

/**
 * 根据ID获取用户
 * 
 * @param {string} id - 用户ID
 * @returns {Promise<User | undefined>} 用户数据或undefined
 */
export const getUserById = async (id: string): Promise<User | undefined> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_USERS.find(user => user.id === id);
};

/**
 * 创建新用户
 * 
 * @param {Omit<User, 'id'>} userData - 不包含ID的用户数据
 * @returns {Promise<User>} 创建的用户数据
 */
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: 'oneTestName',
    ...userData
  };
  
  // 在真实应用中,这里会调用API创建用户
  // 这里仅作为示例，不会真正修改MOCK_USERS数组
  
  return newUser;
};

/**
 * 更新用户数据
 * 
 * @param {string} id - 用户ID
 * @param {Partial<User>} userData - 部分用户数据
 * @returns {Promise<User>} 更新后的用户数据
 */
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = await getUserById(id);
  if (!user) {
    throw new Error(`用户不存在: ${id}`);
  }
  
  const updatedUser: User = {
    ...user,
    ...userData
  };
  
  // 在真实应用中,这里会调用API更新用户
  // 这里仅作为示例，不会真正修改MOCK_USERS数组
  
  return updatedUser;
};

/**
 * 删除用户
 * 
 * @param {string} id - 用户ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 在真实应用中,这里会调用API删除用户
  // 这里仅作为示例，不会真正修改MOCK_USERS数组
  
  return true;
};

/**
 * 检查用户是否匹配搜索词
 * 
 * @param {User} user - 用户对象
 * @param {string} search - 搜索词
 * @returns {boolean} 是否匹配
 */
export const matchesSearch = (user: User, search: string): boolean => {
  const searchLower = search.toLowerCase();
  return (
    user.name.toLowerCase().includes(searchLower) ||
    (user.email && user.email.toLowerCase().includes(searchLower)) ||
    (user.department && user.department.toLowerCase().includes(searchLower)) ||
    (user.position && user.position.toLowerCase().includes(searchLower))
  );
};

/**
 * 筛选用户数据
 * 
 * @param {User[]} users - 用户数据数组
 * @param {FilterCondition} filters - 筛选条件
 * @returns {User[]} 筛选后的用户数据
 */
export const filterUsers = (users: User[], filters: FilterCondition): User[] => {
  return users.filter(user => {
    // 搜索过滤
    if (filters.search && !matchesSearch(user, filters.search)) {
      return false;
    }
    
    // 其他字段过滤
    for (const key in filters) {
      if (key !== 'search' && filters[key]) {
        if (user[key as keyof User] !== filters[key]) {
          return false;
        }
      }
    }
    
    return true;
  });
};

/**
 * 排序用户数据
 * 
 * @param {User[]} users - 用户数据数组
 * @param {keyof User} sortBy - 排序字段
 * @param {'asc' | 'desc'} sortDirection - 排序方向
 * @returns {User[]} 排序后的用户数据
 */
export const sortUsers = (
  users: User[],
  sortBy: keyof User = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): User[] => {
  return [...users].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    // 处理undefined或null
    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === 'asc' ? -1 : 1;
    if (!bValue) return sortDirection === 'asc' ? 1 : -1;
    
    // 字符串比较
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // 数值比较
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
};

/**
 * 分页用户数据
 * 
 * @param {User[]} users - 用户数据数组
 * @param {number} page - 页码,从1开始
 * @param {number} pageSize - 每页数量
 * @returns {{data: User[], total: number, totalPages: number}} 分页结果
 */
export const paginateUsers = (
  users: User[],
  page: number = 1,
  pageSize: number = 10
): { data: User[]; total: number; totalPages: number } => {
  const total = users.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = users.slice(startIndex, endIndex);
  
  return {
    data,
    total,
    totalPages
  };
};

export function FilterIcon({ size = 24, ...props }: IconProps) {
  // ...
}

export function UserIcon({ size = 24, ...props }: IconProps) {
  // ...
}

export function BriefcaseIcon({ size = 24, ...props }: IconProps) {
  // ...
}

export function EnvelopeIcon({ size = 24, ...props }: IconProps) {
  // ...
}

export function IdCardIcon({ size = 24, ...props }: IconProps) {
  // ...
}

export function CalendarIcon({ size = 24, ...props }: IconProps) {
  // ...
} 