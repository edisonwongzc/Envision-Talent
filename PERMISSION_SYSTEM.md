# 基于角色的权限管理系统

## 概述

本系统实现了基于角色的权限管理（RBAC），支持四种用户角色，每种角色具有不同的数据访问权限和操作权限。

## 角色定义

### 1. 普通员工 (employee)
- **权限范围**: 仅限于查看自己的内容
- **数据访问**: 只能查看自己的个人数据
- **标准管理**: 可以查看所有人才标准（用于学习参考），但无法创建、编辑、删除
- **头像颜色**: 蓝色 (bg-blue-500)

### 2. 干部COE (coe)
- **权限范围**: 查看全部员工的内容
- **数据访问**: 可以查看所有员工的数据
- **标准管理**: 可以创建、编辑、删除所有人才标准
- **头像颜色**: 紫色 (bg-purple-500)

### 3. 体系HRBP (hrbp)
- **权限范围**: 所负责体系正式员工
- **数据访问**: 可以查看自己负责体系内员工的数据
- **标准管理**: 可以查看所有标准，可以创建和编辑标准，但无法删除
- **头像颜色**: 绿色 (bg-green-500)

### 4. 体系负责人 (system_leader)
- **权限范围**: 所负责体系正式员工
- **数据访问**: 可以查看自己负责体系内员工的数据
- **标准管理**: 可以查看所有标准，可以创建和编辑标准，但无法删除
- **头像颜色**: 橙色 (bg-orange-500)

## 技术实现

### 核心文件结构

```
contexts/
├── AuthContext.tsx          # 鉴权上下文，管理用户登录状态和角色信息
├── AppContext.tsx           # 应用上下文（原有）
└── UserContext.tsx          # 用户数据上下文（原有）

hooks/
└── usePermissions.ts        # 权限控制Hook，提供权限检查和数据过滤功能

components/
├── auth/
│   └── ProtectedRoute.tsx   # 路由保护组件
└── ui/
    └── dropdown-menu.tsx    # 下拉菜单组件（用于用户头像菜单）

app/
├── page.tsx                 # 登录页面（增加角色选择）
├── layout.tsx               # 根布局（添加AuthProvider）
├── (dashboard)/
│   ├── layout.tsx           # 仪表板布局（添加路由保护）
│   ├── components/
│   │   ├── header.tsx       # 头部组件（添加用户头像和角色信息）
│   │   └── sidebar.tsx      # 侧边栏（添加权限演示页面链接）
│   └── (routes)/
│       ├── talent-standards/
│       │   └── page.tsx     # 人才标准页面（添加权限控制）
│       └── permission-demo/
│           └── page.tsx     # 权限演示页面
```

### 关键组件说明

#### 1. AuthContext (contexts/AuthContext.tsx)
- 管理用户登录状态和角色信息
- 提供登录、登出功能
- 基础权限检查方法
- 本地存储用户信息

#### 2. usePermissions Hook (hooks/usePermissions.ts)
- 提供详细的权限检查方法
- 数据过滤功能
- 角色特定权限判断
- 访问范围控制

#### 3. ProtectedRoute (components/auth/ProtectedRoute.tsx)
- 路由保护，确保只有已登录用户可以访问仪表板
- 显示加载状态
- 自动重定向到登录页面

#### 4. Header组件更新
- 显示用户头像（根据角色显示不同颜色）
- 用户信息下拉菜单
- 角色信息展示
- 登出功能

## 使用方法

### 1. 登录系统
1. 访问根路径 `/`
2. 选择用户角色（普通员工、干部COE、体系HRBP、体系负责人）
3. 如果选择体系HRBP或体系负责人，需要选择负责的体系
4. 输入用户名和密码（当前为演示模式，任意输入即可）
5. 点击登录

### 2. 权限演示
- 访问 `/permission-demo` 页面查看当前角色的权限详情
- 页面展示：
  - 当前用户信息
  - 权限概览
  - 数据访问范围
  - 模拟员工列表（根据权限过滤）
  - 模拟人才标准列表（显示不同操作权限）
  - 角色权限说明

### 3. 在组件中使用权限控制

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { 
    canCreateStandards, 
    canEditStandards, 
    canDeleteStandards,
    currentUser 
  } = usePermissions();

  return (
    <div>
      {canCreateStandards() && (
        <Button>创建标准</Button>
      )}
      {canEditStandards() && (
        <Button>编辑</Button>
      )}
      {canDeleteStandards() && (
        <Button>删除</Button>
      )}
    </div>
  );
}
```

## 权限矩阵

| 功能 | 普通员工 | 干部COE | 体系HRBP | 体系负责人 |
|------|----------|---------|----------|------------|
| 查看自己数据 | ✅ | ✅ | ✅ | ✅ |
| 查看体系员工数据 | ❌ | ✅ | ✅ | ✅ |
| 查看所有员工数据 | ❌ | ✅ | ❌ | ❌ |
| 查看人才标准 | ✅ | ✅ | ✅ | ✅ |
| 创建人才标准 | ❌ | ✅ | ✅ | ✅ |
| 编辑人才标准 | ❌ | ✅ | ✅ | ✅ |
| 删除人才标准 | ❌ | ✅ | ❌ | ❌ |

## 扩展说明

### 添加新角色
1. 在 `contexts/AuthContext.tsx` 中的 `UserRole` 类型添加新角色
2. 在 `mockUsers` 中添加新角色的模拟数据
3. 在 `roleDisplayNames` 中添加角色显示名称
4. 在 `usePermissions.ts` 中添加新角色的权限逻辑
5. 在登录页面的角色选择中添加新选项

### 添加新权限
1. 在 `usePermissions.ts` 中添加新的权限检查方法
2. 在需要的组件中使用新的权限方法
3. 更新权限矩阵文档

### 集成真实后端
1. 替换 `AuthContext.tsx` 中的模拟登录逻辑
2. 实现真实的用户认证API
3. 替换模拟用户数据为真实的用户信息
4. 实现JWT或其他认证机制

## 安全考虑

1. **前端权限控制仅用于UI展示**，真实的权限验证必须在后端进行
2. 敏感操作需要后端二次验证
3. 用户信息存储在localStorage中，生产环境建议使用更安全的存储方式
4. 建议实现token过期和刷新机制
5. 添加操作日志记录功能

## 测试建议

1. 测试不同角色的登录流程
2. 验证权限控制是否正确生效
3. 测试路由保护功能
4. 验证用户信息持久化
5. 测试登出功能
6. 跨浏览器兼容性测试 