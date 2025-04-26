import { NextResponse } from 'next/server';

/**
 * 示例用户数据
 */
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
 * GET处理程序 - 获取所有用户
 * @return {NextResponse} 包含用户数据的响应
 */
export async function GET() {
  return NextResponse.json(users);
}

/**
 * POST处理程序 - 创建新用户（模拟）
 * @return {NextResponse} 成功响应
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 在实际应用中，这里会将用户保存到数据库
    return NextResponse.json({ 
      message: "用户创建成功", 
      user: { id: Math.random().toString(36).substr(2, 9), ...body }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "创建用户失败" }, { status: 400 });
  }
} 