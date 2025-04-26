# 组件库和Hooks

本文档概述了我们为HR SaaS系统开发的组件库和Hooks。

## 目录

1. [基础组件](#基础组件)
   - [图标组件](#图标组件)
   - [InfoItem组件](#infoitem组件)
   - [StarRating组件](#starrating组件)
2. [业务组件](#业务组件)
   - [UserList组件](#userlist组件)
   - [UserCard组件](#usercard组件)
   - [UserGrid组件](#usergrid组件)
   - [UserFilter组件](#userfilter组件)
   - [UserForm组件](#userform组件)
3. [Hooks](#hooks)
   - [useUsers Hook](#useusers-hook)
4. [示例页面](#示例页面)
5. [未来扩展](#未来扩展)

## 基础组件

### 图标组件

图标组件位于 `components/icons/index.tsx` 文件中，包含多个SVG图标，可用于整个应用程序。

**使用示例：**

```tsx
import { UserIcon, StarIcon } from '@/components/icons';

function MyComponent() {
  return (
    <div>
      <UserIcon size={24} className="text-blue-500" />
      <StarIcon size={20} className="text-yellow-400" />
    </div>
  );
}
```

### InfoItem组件

InfoItem组件用于显示带图标的键值对信息，位于 `components/ui/InfoItem.tsx`。

**使用示例：**

```tsx
import { InfoItem } from '@/components/ui/InfoItem';
import { UserIcon } from '@/components/icons';

function ProfileInfo() {
  return (
    <InfoItem 
      icon={<UserIcon size={16} className="text-blue-500" />}
      label="姓名"
      value="张三"
    />
  );
}
```

### StarRating组件

StarRating组件显示星级评分，位于 `components/ui/StarRating.tsx`。

**使用示例：**

```tsx
import StarRating from '@/components/ui/StarRating';

function RatingDisplay() {
  return <StarRating value={4} max={5} size={16} />;
}
```

## 业务组件

### UserList组件

UserList是一个可复用的用户列表组件，支持分页、搜索、排序和筛选功能，位于 `components/ui/UserList.tsx`。

**特性：**
- 支持分页
- 搜索功能
- 排序功能
- 筛选功能
- 自定义渲染项

**使用示例：**

```tsx
import UserList, { User } from '@/components/ui/UserList';

// 用户数据
const users: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    department: '技术部',
    position: '前端开发工程师',
    avatar: 'https://example.com/avatar.jpg'
  },
  // 更多用户...
];

// 部门选项
const DEPARTMENT_OPTIONS = [
  { value: '技术部', label: '技术部' },
  { value: '产品部', label: '产品部' },
  // 更多选项...
];

function UsersPage() {
  const handleUserClick = (user: User) => {
    console.log('用户点击:', user);
  };

  return (
    <UserList 
      users={users} 
      pageSize={10}
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
  );
}
```

### UserCard组件

UserCard是一个用户卡片组件，以卡片形式展示单个用户的信息，位于 `components/ui/UserCard.tsx`。

**特性：**
- 头像展示
- 用户基本信息展示
- 可点击交互
- 编辑按钮（可选）

**使用示例：**

```tsx
import UserCard from '@/components/ui/UserCard';
import { User } from '@/components/ui/UserList';

// 用户数据
const user: User = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  department: '技术部',
  position: '前端开发工程师',
  avatar: 'https://example.com/avatar.jpg'
};

function UserCardExample() {
  const handleClick = (user: User) => {
    console.log('卡片点击:', user);
  };
  
  const handleEdit = (user: User) => {
    console.log('编辑用户:', user);
  };

  return (
    <UserCard 
      user={user}
      onClick={handleClick}
      onEdit={handleEdit}
      showEditButton={true}
    />
  );
}
```

### UserGrid组件

UserGrid是一个用户卡片网格组件，以网格形式展示多个用户卡片，位于 `components/ui/UserGrid.tsx`。

**特性：**
- 响应式网格布局
- 可配置列数
- 加载状态和错误处理
- 无数据状态处理

**使用示例：**

```tsx
import UserGrid from '@/components/ui/UserGrid';
import { User } from '@/components/ui/UserList';

// 用户数据数组
const users: User[] = [
  // 用户数据...
];

function UserGridExample() {
  const handleUserClick = (user: User) => {
    console.log('用户点击:', user);
  };
  
  const handleUserEdit = (user: User) => {
    console.log('编辑用户:', user);
  };

  return (
    <UserGrid 
      users={users}
      onUserClick={handleUserClick}
      onUserEdit={handleUserEdit}
      showEditButton={true}
      columns={3}
      isLoading={false}
      error={null}
    />
  );
}
```

### UserFilter组件

UserFilter是一个高级用户筛选组件，提供搜索和多条件筛选功能，位于 `components/ui/UserFilter.tsx`。

**特性：**
- 搜索功能
- 多字段筛选
- 可折叠筛选面板
- 已应用筛选条件标签

**使用示例：**

```tsx
import UserFilter, { FilterCondition } from '@/components/ui/UserFilter';

// 筛选字段配置
const FILTER_FIELDS = [
  {
    field: 'department',
    label: '部门',
    options: [
      { value: '技术部', label: '技术部' },
      { value: '产品部', label: '产品部' },
      // 更多选项...
    ]
  },
  {
    field: 'position',
    label: '职位',
    options: [
      { value: '工程师', label: '工程师' },
      { value: '经理', label: '经理' },
      // 更多选项...
    ]
  }
];

function UserFilterExample() {
  const handleFilterChange = (filters: FilterCondition) => {
    console.log('筛选条件变化:', filters);
    // 根据筛选条件获取数据...
  };

  return (
    <UserFilter 
      filterFields={FILTER_FIELDS}
      onFilterChange={handleFilterChange}
      showSearch={true}
      initialFilters={{ department: '技术部' }}
    />
  );
}
```

### UserForm组件

UserForm是一个用户表单组件，用于创建或编辑用户信息，位于 `components/ui/UserForm.tsx`。

**特性：**
- 创建/编辑两种模式
- 表单验证
- 加载状态处理
- 响应式布局

**使用示例：**

```tsx
import UserForm, { UserFormData } from '@/components/ui/UserForm';
import { User } from '@/components/ui/UserList';

// 用于编辑的用户数据
const user: User = {
  // 用户数据...
};

function UserFormExample() {
  const handleSubmit = (data: UserFormData) => {
    console.log('提交数据:', data);
    // 提交数据到API...
  };
  
  const handleCancel = () => {
    console.log('取消');
  };

  return (
    <UserForm 
      initialData={user} // 编辑模式提供初始数据，创建模式不提供
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={false}
      mode="edit" // 'create' 或 'edit'
    />
  );
}
```

## Hooks

### useUsers Hook

useUsers Hook用于获取、缓存和管理用户数据，位于 `hooks/useUsers.ts`。

**特性：**
- 支持搜索、筛选、排序和分页
- 自动缓存机制，避免重复请求
- 加载状态和错误处理
- 刷新功能

**使用示例：**

```tsx
import { useUsers } from '@/hooks/useUsers';

function UsersPage() {
  const { 
    users, 
    total, 
    totalPages, 
    page,
    isLoading, 
    error, 
    refresh, 
    clearCache 
  } = useUsers({
    search: '张',
    department: '技术部',
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  if (isLoading) return <p>加载中...</p>;
  if (error) return <p>错误: {error}</p>;

  return (
    <div>
      <button onClick={refresh}>刷新</button>
      <button onClick={clearCache}>清除缓存</button>
      
      <p>共 {total} 条记录，第 {page}/{totalPages} 页</p>
      
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.department}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 示例页面

我们创建了多个示例页面来展示组件和Hook的使用：

1. UserList组件示例：`app/(dashboard)/(routes)/examples/user-list/page.tsx`
2. useUsers Hook示例：`app/(dashboard)/(routes)/examples/user-hook/page.tsx`
3. UserCard和UserGrid示例：`app/(dashboard)/(routes)/examples/user-cards/page.tsx`
4. UserForm示例：`app/(dashboard)/(routes)/examples/user-form/page.tsx`

访问这些页面可以看到组件和Hook的实际效果和使用方法。

## 未来扩展

以下是可以考虑的未来扩展和改进：

1. **组件增强**：
   - 添加更多自定义选项
   - 支持更复杂的筛选条件
   - 添加导出功能
   - 增加批量操作功能

2. **新增组件**：
   - UserStats：用户数据统计组件
   - UserImport：用户数据导入组件
   - PermissionControl：权限控制组件
   - TeamManagement：团队管理组件

3. **Hook改进**：
   - 实现实际的API调用
   - 添加WebSocket支持，实现实时更新
   - 集成全局状态管理
   - 添加缓存持久化

4. **测试**：
   - 为组件和Hook添加单元测试
   - 添加集成测试
   - 添加端到端测试

5. **文档**：
   - 创建组件文档网站
   - 添加更多用例和示例
   - 提供API参考文档

## 如何贡献

1. 克隆项目仓库
2. 创建新分支
3. 提交您的更改
4. 提交合并请求

请确保遵循项目的代码风格和命名约定。 