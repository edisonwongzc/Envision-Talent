import { NextResponse } from 'next/server';

// 示例用户数据（与users路由保持一致）
const users = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "管理员",
    department: "人力资源",
    status: "active",
    avatar: "",
    joinDate: "2023-01-15",
    skills: ["招聘", "培训", "绩效管理"],
    performanceRating: 4.5
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    role: "经理",
    department: "销售",
    status: "active",
    avatar: "",
    joinDate: "2022-05-23",
    skills: ["客户关系", "谈判", "团队管理"],
    performanceRating: 4.8
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    role: "开发者",
    department: "技术",
    status: "active",
    avatar: "",
    joinDate: "2023-03-10",
    skills: ["React", "TypeScript", "Node.js"],
    performanceRating: 4.2
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    role: "设计师",
    department: "产品",
    status: "inactive",
    avatar: "",
    joinDate: "2022-11-05",
    skills: ["UI设计", "UX研究", "原型设计"],
    performanceRating: 3.9
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    role: "分析师",
    department: "财务",
    status: "active",
    avatar: "",
    joinDate: "2023-02-18",
    skills: ["财务分析", "预算规划", "报表"],
    performanceRating: 4.6
  }
];

/**
 * GET处理程序 - 获取指定ID的用户
 * @param {Object} request - 请求对象
 * @param {Object} params - 包含路由参数的对象
 * @return {NextResponse} 用户数据或错误响应
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = users.find(u => u.id === params.id);
  
  if (!user) {
    return NextResponse.json(
      { message: `未找到ID为${params.id}的用户` }, 
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}

/**
 * PUT处理程序 - 更新指定ID的用户
 * @param {Object} request - 请求对象
 * @param {Object} params - 包含路由参数的对象
 * @return {NextResponse} 更新后的用户数据或错误响应
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const userIndex = users.findIndex(u => u.id === params.id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { message: `未找到ID为${params.id}的用户` }, 
        { status: 404 }
      );
    }
    
    // 在实际应用中，这里会更新数据库中的用户
    const updatedUser = { ...users[userIndex], ...body };
    
    return NextResponse.json({ 
      message: "用户更新成功", 
      user: updatedUser 
    });
  } catch (error) {
    return NextResponse.json(
      { message: "更新用户失败" }, 
      { status: 400 }
    );
  }
}

/**
 * DELETE处理程序 - 删除指定ID的用户
 * @param {Object} request - 请求对象
 * @param {Object} params - 包含路由参数的对象
 * @return {NextResponse} 成功或错误响应
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userIndex = users.findIndex(u => u.id === params.id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { message: `未找到ID为${params.id}的用户` }, 
      { status: 404 }
    );
  }
  
  // 在实际应用中，这里会从数据库中删除用户
  return NextResponse.json({ 
    message: "用户删除成功" 
  });
} 