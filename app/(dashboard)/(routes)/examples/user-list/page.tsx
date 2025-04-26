'use client';

import React from 'react';
import UserList, { User } from '@/components/ui/UserList';

/**
 * 示例用户数据
 */
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    department: '技术部',
    position: '前端开发工程师',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    department: '产品部',
    position: '产品经理',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    department: '技术部',
    position: '后端开发工程师',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    department: '设计部',
    position: 'UI设计师',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    name: '钱七',
    email: 'qianqi@example.com',
    department: '市场部',
    position: '市场专员',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: '6',
    name: '孙八',
    email: 'sunba@example.com',
    department: '人力资源部',
    position: 'HR专员',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: '7',
    name: '周九',
    email: 'zhoujiu@example.com',
    department: '财务部',
    position: '财务主管',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: '8',
    name: '吴十',
    email: 'wushi@example.com',
    department: '技术部',
    position: '测试工程师',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    id: '9',
    name: '郑十一',
    email: 'zhengshiyi@example.com',
    department: '技术部',
    position: '运维工程师',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
  },
  {
    id: '10',
    name: '王十二',
    email: 'wangshier@example.com',
    department: '产品部',
    position: '产品助理',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
  },
  {
    id: '11',
    name: '李十三',
    email: 'lishisan@example.com',
    department: '销售部',
    position: '销售经理',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    id: '12',
    name: '赵十四',
    email: 'zhaoshisi@example.com',
    department: '销售部',
    position: '销售代表',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  }
];

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
 * UserList组件示例页面
 * 
 * @returns {React.ReactElement} 示例页面
 */
export default function UserListExamplePage() {
  const handleUserClick = (user: User) => {
    alert(`您点击了用户：${user.name}`);
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">用户列表组件示例</h1>
        <p className="text-gray-500">
          这是一个可复用的用户列表组件，支持分页、搜索和排序功能。
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">基本用法</h2>
        <UserList 
          users={DEMO_USERS} 
          pageSize={5}
          onUserClick={handleUserClick}
          sortableFields={['name', 'department', 'position']}
          filterFields={[
            {
              field: 'department',
              label: '部门',
              options: DEPARTMENT_OPTIONS
            }
          ]}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">无搜索框</h2>
        <UserList 
          users={DEMO_USERS.slice(0, 6)} 
          showSearch={false}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">自定义渲染</h2>
        <UserList 
          users={DEMO_USERS.slice(0, 4)} 
          renderItem={(user) => (
            <div key={user.id} className="flex items-center p-4 border-b">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                {user.name[0]}
              </div>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-sm">{user.position} @ {user.department}</div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
} 