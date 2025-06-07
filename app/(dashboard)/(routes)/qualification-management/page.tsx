'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons/index";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, ChangeEvent, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Check as CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { cn } from "@/lib/utils";

// 临时内联Badge组件实现
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    destructive: "bg-destructive text-destructive-foreground border-transparent",
    outline: "text-foreground"
  };
  
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  );
}

// 添加类型定义
interface ReviewHistoryItem {
  date: string;
  level: string;
  result: string;
  evaluator: string;
}

// 添加其他必要的接口定义
interface KnowledgeItem {
  category: string;
  name: string;
  description: string;
}

interface AbilityItem {
  category: string;
  name: string;
  description: string;
}

interface FeedbackItem {
  category: string;
  name: string;
  date: string;
  content: string;
}

interface StandardDetail {
  id: string;
  title: string;
  type: string;
  updateDate: string;
  description: string;
  category?: string;
  subClass?: string; // 新增：子类
  position?: string;
  role?: string;
  level?: string;
  system?: string;
  department?: string;
  knowledge: KnowledgeItem[];
  abilities: AbilityItem[];
  feedback: FeedbackItem[];
}

// 新增：雷达图员工数据接口
interface RadarEmployee {
  id: string;
  name: string;
  position: string;
  system: string;
  department: string;
  score: number; // 员工当前总分
  class?: string;
  subClass?: string;
  // API接口字段：用于对接后台数据
  // abilityScores?: {
  //   strategicPlanning: number;        // 战略规划
  //   architectureDesign: number;       // 架构/方案设计
  //   implementationExecution: number;  // 方案实施/落地
  //   operationMaintenance: number;     // 运维/运营
  //   problemSolvingOptimization: number; // 问题解决与优化
  // };
}

// 新增：雷达图目标数据接口
interface RadarTarget {
  id: string;
  name: string;
  level: string;
  system: string;
  department: string;
  targetScore: number; // 目标总分
  class?: string;
  subClass?: string;
  // API接口字段：用于对接后台数据
  // standardScores?: {
  //   strategicPlanning: number;        // 战略规划标准分
  //   architectureDesign: number;       // 架构/方案设计标准分
  //   implementationExecution: number;  // 方案实施/落地标准分
  //   operationMaintenance: number;     // 运维/运营标准分
  //   problemSolvingOptimization: number; // 问题解决与优化标准分
  // };
}

/**
 * 任职资格管理页面组件
 * @return {React.ReactElement} 任职资格管理页面
 * 
 * API接口说明：
 * - GET /api/radar/employees - 获取雷达图员工列表（含分数数据）
 * - GET /api/radar/targets - 获取雷达图目标标准列表（含分数数据）
 * - GET /api/radar/comparison/{employeeId}/{targetId} - 获取员工与目标的对比数据
 * 
 * 雷达图维度（满分20分）：
 * - strategicPlanning: 战略规划
 * - architectureDesign: 架构/方案设计
 * - implementationExecution: 方案实施/落地
 * - operationMaintenance: 运维/运营
 * - problemSolvingOptimization: 问题解决与优化
 */

// TODO: API接口函数模板 - 用于后台数据对接
// 获取雷达图员工列表
// const fetchRadarEmployees = async (filters?: Partial<RadarEmployee>): Promise<RadarEmployee[]> => {
//   const response = await fetch('/api/radar/employees', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(filters)
//   });
//   return response.json();
// };

// 获取雷达图目标列表
// const fetchRadarTargets = async (filters?: Partial<RadarTarget>): Promise<RadarTarget[]> => {
//   const response = await fetch('/api/radar/targets', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(filters)
//   });
//   return response.json();
// };

// 获取员工与目标的详细对比数据
// const fetchRadarComparison = async (employeeId: string, targetId: string) => {
//   const response = await fetch(`/api/radar/comparison/${employeeId}/${targetId}`);
//   return response.json();
// };

export default function QualificationManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubClass, setSelectedSubClass] = useState("all");
  const [selectedDirection, setSelectedDirection] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    position: false,
    role: false,
    system: false,
    department: false,
    manager: false
  });
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  // 流程列表相关状态
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [showProcessConfirm, setShowProcessConfirm] = useState(false);
  const [processFilters, setProcessFilters] = useState({
    name: "",
    status: "",
    class: "all", // 新增：类筛选
    subClass: "all", // 新增：子类筛选
    sequence: "",
    department: "",
    system: "",
    direction: "",
    position: "",
    role: "",
    level: "",
    cycle: "",
    date: ""
  });

  // 添加评审流程相关状态变量
  const [showReviewSelectionMode, setShowReviewSelectionMode] = useState(false);
  const [employeesToReview, setEmployeesToReview] = useState<string[]>([]);
  const [showReviewConfirmDialog, setShowReviewConfirmDialog] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // 添加标准相关状态
  const [showAddStandardDialog, setShowAddStandardDialog] = useState(false);
  const [standardNavTab, setStandardNavTab] = useState<string>("category");
  const [standardContentTab, setStandardContentTab] = useState<string>("skills");
  
  // 新增：下载模板和上传标准相关状态
  const [showUploadStandardDialog, setShowUploadStandardDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 新增：单个员工发起评审流程二次确认相关状态
  const [showSingleReviewConfirm, setShowSingleReviewConfirm] = useState(false);
  const [selectedEmployeeForReview, setSelectedEmployeeForReview] = useState<any>(null);
  const [singleReviewSuccess, setSingleReviewSuccess] = useState(false);

  // 新增：流程列表批量操作相关状态
  const [showProcessSelectionMode, setShowProcessSelectionMode] = useState(false);
  const [showProcessBatchConfirm, setShowProcessBatchConfirm] = useState(false);
  const [processBatchSuccess, setProcessBatchSuccess] = useState(false);
  
  // 新增：更多筛选展开状态
  const [showMoreProcessFilters, setShowMoreProcessFilters] = useState(false);

  // 模拟数据
  const sequences = ["技术类", "产品类", "管理类"];
  const positions = ["工程师", "产品经理", "项目经理", "架构师"];
  const roles = ["开发", "测试", "运维", "产品", "项目管理"];
  const levels = ["P3", "P4", "P5", "P6", "P7"];
  
  // 认证类型映射
  const certificationTypeMap = {
    "产品类": "P",
    "技术类": "T", 
    "管理类": "M",
    "设计类": "D"
  };
  
  // 模拟员工详情数据
  const employeeData = [
    {
      id: "EMP001",
      name: "李十三",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60",
      sequence: "技术序列",
      category: "技术类",
      subClass: "后端技术",
      position: "高级工程师",
      role: "后端开发",
      system: "研发体系",
      department: "研发部",
      team: "核心后端团队",
      engineeringDirector: "王大山",
      directManager: "张经理",
      teamLeader: "赵组长",
      challengeLevels: ["13H", "14L", "14M"],
      performanceResults: ["A", "A+", "A"],
      visionScores: [4.5, 4.8, 4.6],
      currentLevel: "P5",
      certificationDate: "2022-12-15",
      processStatus: "技术评审中", // 流程状态
      reviewHistory: [
        { date: "2022-12-15", level: "P5", result: "通过", evaluator: "技术评审委员会" },
        { date: "2021-06-10", level: "P4", result: "通过", evaluator: "技术评审委员会" },
        { date: "2020-01-15", level: "P3", result: "通过", evaluator: "部门评审小组" }
      ],
      knowledgeSkillScore: 92,
      keyAbilityScore: 88
    },
    {
      id: "EMP031",
      name: "赵六",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
      sequence: "产品序列",
      category: "产品类",
      subClass: "用户产品",
      position: "产品经理",
      role: "产品管理",
      system: "产品体系",
      department: "产品部",
      team: "用户产品团队",
      engineeringDirector: "李总监",
      directManager: "王经理",
      teamLeader: "陈组长",
      challengeLevels: ["13M", "13H", "14L"],
      performanceResults: ["B+", "A", "B+"],
      visionScores: [4.0, 4.2, 4.1],
      currentLevel: "P4",
      certificationDate: "2022-06-20",
      processStatus: "", // 无流程状态，显示发起评审流程按钮
      reviewHistory: [
        { date: "2022-06-20", level: "P4", result: "通过", evaluator: "产品评审委员会" },
        { date: "2020-05-18", level: "P3", result: "通过", evaluator: "部门评审小组" }
      ],
      knowledgeSkillScore: 85,
      keyAbilityScore: 90
    },
    {
      id: "EMP015",
      name: "吴十",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
      sequence: "技术序列",
      category: "技术类",
      subClass: "前端技术",
      position: "工程师",
      role: "前端开发",
      system: "研发体系",
      department: "研发部",
      team: "用户界面团队",
      engineeringDirector: "王大山",
      directManager: "李经理",
      teamLeader: "刘组长",
      challengeLevels: ["13L", "13M", "13H"],
      performanceResults: ["B", "B+", "B"],
      visionScores: [3.8, 4.0, 3.9],
      currentLevel: "P3",
      certificationDate: "2022-03-10",
      processStatus: undefined, // 无流程状态，显示发起评审流程按钮
      reviewHistory: [
        { date: "2023-01-05", level: "申请四级", result: "已提交", evaluator: "吴十" },
        { date: "2023-01-08", level: "HRBP审核", result: "通过", evaluator: "HRBP王丽" },
        { date: "2023-01-10", level: "直接主管审核", result: "通过", evaluator: "李经理" },
        { date: "2023-01-12", level: "公示", result: "无异议", evaluator: "系统自动" },
        { date: "2023-01-15", level: "评委集中评议", result: "85分，意见良好", evaluator: "评委组" },
        { date: "2023-01-18", level: "平台专委会审核", result: "通过", evaluator: "平台专委会" },
        { date: "2023-01-20", level: "公司人委会审核", result: "通过", evaluator: "公司人委会" },
        { date: "2023-01-22", level: "公示", result: "无异议", evaluator: "系统自动" }
      ],
      knowledgeSkillScore: 78,
      keyAbilityScore: 80
    }
  ];

  // 模拟流程数据
  const processList = [
    {
      id: "PROC001",
      name: "李十三、2023-05-01、P6、T", // 姓名、年月日、职级、认证类型
      status: "进行中",
      applicantName: "李十三",
      applicantId: "EMP001",
      createDate: "2023-05-01",
      class: "技术类",
      subClass: "后端技术",
      sequence: "技术序列",
      direction: "后端开发",
      position: "高级工程师",
      role: "开发",
      system: "研发体系",
      department: "研发部",
      team: "核心后端团队",
      level: "P6"
    },
    {
      id: "PROC002",
      name: "赵六、2023-04-10、P5、P",
      status: "已完成",
      applicantName: "赵六",
      applicantId: "EMP031",
      createDate: "2023-04-10",
      class: "产品类",
      subClass: "用户产品",
      sequence: "产品序列",
      direction: "产品管理",
      position: "产品经理",
      role: "产品",
      system: "产品体系",
      department: "产品部",
      team: "用户产品团队",
      level: "P5"
    },
    {
      id: "PROC003",
      name: "吴十、2023-06-15、P4、T",
      status: "进行中",
      applicantName: "吴十",
      applicantId: "EMP015",
      createDate: "2023-06-15",
      class: "技术类",
      subClass: "前端技术",
      sequence: "技术序列",
      direction: "前端开发",
      position: "工程师",
      role: "开发",
      system: "研发体系",
      department: "研发部",
      team: "用户界面团队",
      level: "P4"
    },
    {
      id: "PROC004",
      name: "张四、2023-06-20、P5、M",
      status: "计划中",
      applicantName: "张四",
      applicantId: "EMP021",
      createDate: "2023-06-20",
      class: "管理类",
      subClass: "项目管理",
      sequence: "管理序列",
      direction: "项目管理",
      position: "项目经理",
      role: "项目管理",
      system: "管理体系",
      department: "项目管理部",
      team: "项目管理团队",
      level: "P5"
    },
    {
      id: "PROC005",
      name: "王五、2023-05-15、P6、D",
      status: "进行中",
      applicantName: "王五",
      applicantId: "EMP025",
      createDate: "2023-05-15",
      class: "设计类",
      subClass: "视觉设计",
      sequence: "设计序列",
      direction: "UI设计",
      position: "高级设计师",
      role: "设计",
      system: "设计体系",
      department: "设计部",
      team: "用户体验团队",
      level: "P6"
    }
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterOptionChange = (option: string) => {
    setFilterOptions({
      ...filterOptions,
      [option]: !filterOptions[option as keyof typeof filterOptions]
    });
  };

  // 添加重置筛选函数
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClass("all");
    setSelectedSubClass("all");
    setSelectedDirection("all");
    setSelectedPosition("");
    setSelectedRole("");
    setSelectedLevel("");
    setSelectedSystem("all");
    setSelectedDepartment("all");
    setSelectedHRBPType("all");
    setFilterOptions({
      position: false,
      role: false,
      system: false,
      department: false,
      manager: false
    });
  };
  
  // 查看员工详情
  const viewEmployeeDetail = (employeeId: string) => {
    const employee = employeeData.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setShowEmployeeDetail(true);
    }
  };

  // 处理流程选择
  const handleProcessSelect = (processId: string) => {
    setSelectedProcesses(prev => {
      if (prev.includes(processId)) {
        return prev.filter(id => id !== processId);
      } else {
        return [...prev, processId];
      }
    });
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProcesses(processList.map(process => process.id));
    } else {
      setSelectedProcesses([]);
    }
  };

  // 批量发起评审
  const startBatchReview = () => {
    setShowProcessConfirm(true);
  };

  // 确认发起评审
  const confirmStartReview = () => {
    setShowReviewConfirmDialog(true);
  };

  // 处理流程筛选
  const handleProcessFilterChange = (field: string, value: string) => {
    setProcessFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理进入流程
  const [showProcessDetail, setShowProcessDetail] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string>("");
  
  const enterProcess = (employeeId: string, processStatus: string) => {
    if (processStatus === "发起评审流程") {
      // 找到对应的员工信息
      const employee = employeeData.find(emp => emp.id === employeeId);
      if (employee) {
        setSelectedEmployeeForReview(employee);
        setShowSingleReviewConfirm(true);
      }
    } else {
    setSelectedProcess(processStatus || "发起评审流程");
    setShowProcessDetail(true);
    }
  };

  // 初始化选择所有员工的函数
  const initializeEmployeesToReview = () => {
    // 从员工数据中获取所有员工ID
    const allEmployeeIds = employeeData.map(emp => emp.id);
    setEmployeesToReview(allEmployeeIds);
  };

  // 切换单个员工的评审选择状态
  const toggleEmployeeReviewSelection = (employeeId: string) => {
    if (employeesToReview.includes(employeeId)) {
      setEmployeesToReview(employeesToReview.filter(id => id !== employeeId));
    } else {
      setEmployeesToReview([...employeesToReview, employeeId]);
    }
  };

  // 处理发起评审流程按钮点击
  const handleInitiateReview = () => {
    setShowReviewSelectionMode(true);
    initializeEmployeesToReview();
  };

  // 处理确认发起评审
  const handleConfirmReview = () => {
    // 模拟发起评审流程
    setReviewSuccess(true);
    
    // 3秒后关闭确认对话框
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewConfirmDialog(false);
      setShowReviewSelectionMode(false);
    }, 3000);
  };

  // 添加查看标准详情的状态
  const [selectedStandard, setSelectedStandard] = useState<StandardDetail | null>(null);
  const [showStandardDetail, setShowStandardDetail] = useState(false);

  // 查看标准详情
  const viewStandardDetail = (standard: StandardDetail) => {
    setSelectedStandard(standard);
    setShowStandardDetail(true);
  };

  // 评审流程相关函数
  const initiateReviewProcess = () => {
    // 默认选中所有员工
    setEmployeesToReview(employeeData.map(emp => emp.id));
    setShowReviewSelectionMode(true);
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setEmployeesToReview(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };
  
  // 添加筛选选项
  const classOptions = ["技术类", "产品类", "管理类", "设计类", "市场类"];
  const subClassOptions: Record<string, string[]> = {
    "技术类": ["前端技术", "后端技术", "移动端技术", "数据技术", "算法技术", "运维技术"],
    "产品类": ["用户产品", "商业产品", "数据产品", "技术产品"],
    "管理类": ["技术管理", "产品管理", "项目管理", "团队管理"],
    "设计类": ["UI设计", "UX设计", "视觉设计", "交互设计"],
    "市场类": ["市场营销", "品牌推广", "渠道管理", "用户增长"]
  };
  const directionOptions: Record<string, string[]> = {
    "技术类": ["前端", "后端", "全栈", "移动端", "数据", "算法", "运维"],
    "产品类": ["C端产品", "B端产品", "平台产品", "数据产品"],
    "管理类": ["人员管理", "项目管理", "战略管理", "运营管理"],
    "设计类": ["用户界面", "用户体验", "视觉创意", "品牌设计"],
    "市场类": ["线上营销", "线下营销", "品牌营销", "内容营销"]
  };
  const systemOptions = ["研发体系", "产品体系", "设计体系", "市场体系", "管理体系"];
  
  // 添加标准选项
  const standardCategories = ["技术类", "产品类", "管理类", "设计类", "市场类"];
  const standardDirections = ["前端", "后端", "全栈", "移动端", "数据", "算法", "运维"];
  const standardRoles = ["开发", "测试", "运维", "产品", "设计", "项目管理"];
  
  // 表单状态
  const [formData, setFormData] = useState({
    category: "",
    subClass: "", // 新增：子类
    direction: "",
    role: "",
    positionName: "",
    position: "", // 新增：职务
    qualificationLevel: "", // 新增：任职资格等级
  });
  
  // 修改表单数据
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 关键能力标签（按类别和级别分组）
  const keyAbilityTags = {
    "商业敏锐": [
      { id: "ba_t1", name: "基础业务理解", level: "T1", description: "能够理解基本的业务概念和团队工作" },
      { id: "ba_t2", name: "业务问题识别", level: "T2", description: "能够识别常见业务问题并提供初步解决方案" },
      { id: "ba_t3", name: "业务机会发现", level: "T3", description: "能够发现业务机会并提出有效改进建议" },
      { id: "ba_t4", name: "业务价值创造", level: "T4", description: "能够创造业务价值并优化业务流程" },
      { id: "ba_t5", name: "市场趋势洞察", level: "T5", description: "能够洞察市场趋势并提出创新业务策略" },
      { id: "ba_t6", name: "商业模式创新", level: "T6", description: "能够推动商业模式创新并影响公司战略" },
      { id: "ba_t7", name: "行业引领", level: "T7", description: "能够引领行业发展方向和商业模式变革" }
    ],
    "技术前瞻": [
      { id: "tp_t1", name: "技术动态关注", level: "T1", description: "关注主流技术动态和发展趋势" },
      { id: "tp_t2", name: "新技术学习", level: "T2", description: "主动学习和尝试新技术" },
      { id: "tp_t3", name: "技术选型建议", level: "T3", description: "能够提出合理的技术选型建议" },
      { id: "tp_t4", name: "技术演进规划", level: "T4", description: "能够规划技术演进路线" },
      { id: "tp_t5", name: "技术创新推动", level: "T5", description: "能够推动技术创新并预判技术发展方向" },
      { id: "tp_t6", name: "技术战略制定", level: "T6", description: "能够制定技术战略并引领技术变革" },
      { id: "tp_t7", name: "技术愿景构建", level: "T7", description: "能够构建技术愿景并引领行业技术发展" }
    ],
    "系统思维": [
      { id: "st_t1", name: "问题分解能力", level: "T1", description: "能够将问题分解为可管理的部分" },
      { id: "st_t2", name: "关联分析能力", level: "T2", description: "能够分析事物间的关联性" },
      { id: "st_t3", name: "全局视角思考", level: "T3", description: "能够从全局视角思考问题" },
      { id: "st_t4", name: "系统性解决方案", level: "T4", description: "能够提出系统性解决方案" },
      { id: "st_t5", name: "复杂系统规划", level: "T5", description: "能够规划和管理复杂系统" },
      { id: "st_t6", name: "系统创新设计", level: "T6", description: "能够进行系统创新设计" },
      { id: "st_t7", name: "战略系统构建", level: "T7", description: "能够构建战略级系统架构" }
    ],
    "执行力": [
      { id: "ex_t1", name: "任务完成", level: "T1", description: "能够按时完成分配的任务" },
      { id: "ex_t2", name: "目标达成", level: "T2", description: "能够持续达成既定目标" },
      { id: "ex_t3", name: "持续改进", level: "T3", description: "能够持续改进工作方法和效率" },
      { id: "ex_t4", name: "障碍突破", level: "T4", description: "能够突破障碍确保目标达成" },
      { id: "ex_t5", name: "高效团队执行", level: "T5", description: "能够带领团队高效执行" },
      { id: "ex_t6", name: "战略落地", level: "T6", description: "能够将战略有效转化为执行计划并落地" },
      { id: "ex_t7", name: "组织执行文化", level: "T7", description: "能够塑造卓越的组织执行文化" }
    ],
    "好学精进": [
      { id: "cl_t1", name: "主动学习", level: "T1", description: "主动学习工作所需知识和技能" },
      { id: "cl_t2", name: "持续学习", level: "T2", description: "保持持续学习的习惯" },
      { id: "cl_t3", name: "知识分享", level: "T3", description: "主动分享知识和经验" },
      { id: "cl_t4", name: "学习引导", level: "T4", description: "引导他人学习成长" },
      { id: "cl_t5", name: "学习氛围营造", level: "T5", description: "营造良好的团队学习氛围" },
      { id: "cl_t6", name: "学习体系构建", level: "T6", description: "构建组织学习体系" },
      { id: "cl_t7", name: "学习型组织", level: "T7", description: "打造学习型组织文化" }
    ],
    "自驱求进": [
      { id: "sd_t1", name: "自我激励", level: "T1", description: "能够自我激励，保持积极态度" },
      { id: "sd_t2", name: "主动担当", level: "T2", description: "主动担当，不需外部督促" },
      { id: "sd_t3", name: "自我挑战", level: "T3", description: "不断挑战自我，突破舒适区" },
      { id: "sd_t4", name: "持续超越", level: "T4", description: "持续超越自我，追求卓越" },
      { id: "sd_t5", name: "激发他人", level: "T5", description: "能够激发他人的内驱力" },
      { id: "sd_t6", name: "团队自驱文化", level: "T6", description: "塑造团队自驱文化" },
      { id: "sd_t7", name: "组织自驱氛围", level: "T7", description: "在组织层面培养自驱氛围" }
    ]
  };
  
  // 组织回馈标签（按类别和级别分组）
  const organizationFeedbackTags = {
    "知识传承": [
      { id: "kt_t1", name: "知识分享", level: "T1", description: "乐于分享自己的知识和经验" },
      { id: "kt_t2", name: "文档记录", level: "T2", description: "做好工作文档记录，便于他人学习" },
      { id: "kt_t3", name: "知识沉淀", level: "T3", description: "能够将经验系统化沉淀为可复用的知识" },
      { id: "kt_t4", name: "经验传授", level: "T4", description: "能够主动传授专业知识和技能" },
      { id: "kt_t5", name: "知识体系构建", level: "T5", description: "构建团队或部门级知识体系" },
      { id: "kt_t6", name: "专业领域指导", level: "T6", description: "成为专业领域导师，培养行业人才" },
      { id: "kt_t7", name: "行业知识传承", level: "T7", description: "推动行业级知识传承与创新" }
    ],
    "人才培养": [
      { id: "td_t1", name: "辅导新人", level: "T1", description: "能够基本指导新人完成工作" },
      { id: "td_t2", name: "技能提升", level: "T2", description: "帮助同事提升特定技能" },
      { id: "td_t3", name: "全面培养", level: "T3", description: "全面培养下属或团队成员" },
      { id: "td_t4", name: "人才发展", level: "T4", description: "识别人才潜力并提供发展机会" },
      { id: "td_t5", name: "人才梯队", level: "T5", description: "建设完整的人才梯队" },
      { id: "td_t6", name: "领导力培养", level: "T6", description: "培养具有领导力的高潜人才" },
      { id: "td_t7", name: "战略人才布局", level: "T7", description: "进行组织级战略人才布局与培养" }
    ],
    "远景精神": [
      { id: "vs_t1", name: "理解愿景", level: "T1", description: "理解团队和公司的愿景使命" },
      { id: "vs_t2", name: "认同愿景", level: "T2", description: "认同并积极传递团队愿景" },
      { id: "vs_t3", name: "贡献愿景", level: "T3", description: "为团队愿景贡献自己的力量" },
      { id: "vs_t4", name: "愿景规划", level: "T4", description: "为团队或业务制定有效的愿景规划" },
      { id: "vs_t5", name: "愿景领导", level: "T5", description: "引领团队成员朝着共同愿景前进" },
      { id: "vs_t6", name: "愿景创新", level: "T6", description: "创新性构建有感召力的组织愿景" },
      { id: "vs_t7", name: "战略愿景", level: "T7", description: "制定并推动实现企业级战略愿景" }
    ],
    "团队建设": [
      { id: "tb_t1", name: "团队合作", level: "T1", description: "积极参与团队协作" },
      { id: "tb_t2", name: "团队融入", level: "T2", description: "良好融入团队并促进团队氛围" },
      { id: "tb_t3", name: "团队贡献", level: "T3", description: "为团队建设做出积极贡献" },
      { id: "tb_t4", name: "团队凝聚", level: "T4", description: "增强团队凝聚力和向心力" },
      { id: "tb_t5", name: "团队文化", level: "T5", description: "塑造积极健康的团队文化" },
      { id: "tb_t6", name: "高效团队", level: "T6", description: "打造高绩效团队" },
      { id: "tb_t7", name: "组织氛围", level: "T7", description: "营造创新和包容的组织氛围" }
    ]
  };
  
  // 已选标签
  const [selectedKnowledgeTags, setSelectedKnowledgeTags] = useState<string[]>([]);
  
  // 切换标签选择状态
  const toggleKnowledgeTag = (id: string) => {
    setSelectedKnowledgeTags(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  // 标签按分类分组
  const groupTagsByCategory = (tags: any[]) => {
    return tags.reduce((groups: {[key: string]: any[]}, tag) => {
      const category = tag.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tag);
      return groups;
    }, {});
  };

  // 添加知识技能标签定义
  const knowledgeSkillTags: Record<string, Array<{id: string; name: string; level: string; description: string; category: string}>> = {
    "系统分析": [
      { id: "sa_t3", name: "需求分析", level: "T3", description: "能够独立完成功能模块的需求分析", category: "系统分析" },
      { id: "sa_t4", name: "系统需求分析", level: "T4", description: "能够进行完整系统的需求分析和规划", category: "系统分析" },
      { id: "sa_t5", name: "复杂需求分析", level: "T5", description: "能够分析复杂业务场景并转化为系统需求", category: "系统分析" }
    ],
    "软件开发": [
      { id: "sd_t3", name: "功能开发", level: "T3", description: "能够开发完整系统功能并处理异常情况", category: "软件开发" },
      { id: "sd_t4", name: "架构设计", level: "T4", description: "能够设计与实现系统架构", category: "软件开发" },
      { id: "sd_t5", name: "复杂系统开发", level: "T5", description: "能够设计与开发复杂系统", category: "软件开发" }
    ],
    "测试验证": [
      { id: "tv_t3", name: "功能测试规划", level: "T3", description: "能够规划功能模块的测试策略", category: "测试验证" },
      { id: "tv_t4", name: "系统测试规划", level: "T4", description: "能够规划整个系统的测试策略", category: "测试验证" },
      { id: "tv_t5", name: "测试架构设计", level: "T5", description: "能够设计测试架构和自动化框架", category: "测试验证" }
    ]
  };

  const [selectedKeyAbilityTags, setSelectedKeyAbilityTags] = useState<string[]>([]);
  const [selectedOrgTags, setSelectedOrgTags] = useState<string[]>([]);
  
  const toggleKeyAbilityTag = (id: string) => {
    setSelectedKeyAbilityTags(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const toggleOrgTag = (id: string) => {
    setSelectedOrgTags(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 1. 在组件顶部添加排序状态
  const [knowledgeSkillSort, setKnowledgeSkillSort] = useState<'desc'|'asc'>('desc');
  const [keyAbilitySort, setKeyAbilitySort] = useState<'desc'|'asc'>('desc');

  // 3. 排序后的数据
  const sortedEmployeeData = [...employeeData].sort((a, b) => {
    if (keyAbilitySort !== knowledgeSkillSort) {
      // 如果点击了关键能力排序，则只按关键能力分数排序
      if (keyAbilitySort === 'desc') {
        return b.keyAbilityScore - a.keyAbilityScore;
      } else {
        return a.keyAbilityScore - b.keyAbilityScore;
      }
    } else {
      // 否则只按知识技能分数排序
      if (knowledgeSkillSort === 'desc') {
        return b.knowledgeSkillScore - a.knowledgeSkillScore;
      } else {
        return a.knowledgeSkillScore - b.knowledgeSkillScore;
      }
    }
  });
  // 组件顶部添加切换显示类型状态
  /**
   * 能力分数人数占比显示类型
   * @type {"count"|"percent"}
   */
  const [abilityBarType, setAbilityBarType] = useState<'count'|'percent'>('count');

  // 能力分数段渲染内容提前声明，避免JSX中IIFE导致类型错误
  const abilityRanges = [
    { label: '90及以上', min: 90, max: 100 },
    { label: '80-89', min: 80, max: 89 },
    { label: '70-79', min: 70, max: 79 },
    { label: '60-69', min: 60, max: 69 },
    { label: '60以下', min: 0, max: 59 }
  ];

  // 1. 新增能力和体系筛选状态
  const [selectedAbility, setSelectedAbility] = useState<string>("all");
  const [selectedSystem, setSelectedSystem] = useState<string>("all");

  // 2. 提取能力选项
  const abilityOptions = Object.keys(keyAbilityTags); // 如"商业敏锐" "技术前瞻"等

  // 3. 根据筛选项过滤员工数据
  const filteredEmployeeData = employeeData.filter(emp => {
    // 体系筛选
    const systemMatch = selectedSystem === 'all' ? true : emp.system === selectedSystem;
    // 能力筛选，仅用 role 字段演示
    let abilityMatch = true;
    if (selectedAbility !== 'all') {
      abilityMatch = emp.role === selectedAbility;
    }
    return systemMatch && abilityMatch;
  });

  // 4. 能力分数段统计也用筛选后的数据
  const totalEmployee = filteredEmployeeData.length;
  const abilityBarList = abilityRanges.map(range => {
    const count = filteredEmployeeData.filter(emp => emp.keyAbilityScore >= range.min && emp.keyAbilityScore <= range.max).length;
    const percent = totalEmployee > 0 ? (count / totalEmployee) : 0;
    return (
      <div key={range.label} className="mb-7">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">{range.label}</span>
          <div className="flex-1 mx-3">
            <div className="w-full h-5 bg-gray-200 rounded overflow-hidden flex items-center">
              <div
                className="h-5 bg-gray-800 rounded"
                style={{ width: `${Math.round(percent * 100)}%`, minWidth: count > 0 ? 24 : 0 }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 w-12 text-right flex-shrink-0">
            {abilityBarType === 'count'
              ? `${count}人`
              : `${(percent * 100).toFixed(1)}%`}
          </span>
        </div>
      </div>
    );
  });

  // 5. 右侧列表也用筛选后的数据
  // 排序后的结果数据
  const sortedResultEmployeeData = [...filteredEmployeeData];

  // 新增：处理下载模板
  const handleDownloadTemplate = () => {
    console.log("下载任职资格标准模板");
    // 这里实现下载模板的逻辑
    // 可以创建一个Excel模板并触发下载
    alert("任职资格标准模板下载中...");
    
    // 模拟下载 - 实际项目中这里会调用API或生成Excel文件
    const link = document.createElement('a');
    link.href = '#'; // 这里应该是模板文件的URL
    link.download = '任职资格标准模板.xlsx';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  // 新增：处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  // 新增：处理上传确认
  const handleUploadConfirm = () => {
    if (!uploadFile) return;

    // 模拟文件上传成功
    setTimeout(() => {
      setUploadSuccess(true);
      
      // 3秒后关闭成功消息和对话框
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadFile(null);
        setShowUploadStandardDialog(false);
      }, 3000);
    }, 1000);
  };

  // 新增：职务选项（按类别分组）
  const positionOptions: Record<string, string[]> = {
    "技术类": ["软件工程师", "高级工程师", "资深工程师", "架构师", "技术专家"],
    "产品类": ["产品助理", "产品经理", "高级产品经理", "产品总监"],
    "管理类": ["团队负责人", "部门经理", "总监", "VP"],
    "设计类": ["UI设计师", "UX设计师", "高级设计师", "设计总监"],
    "市场类": ["市场专员", "市场经理", "高级市场经理", "市场总监"]
  };

  // 新增：任职资格等级选项
  const qualificationLevels = ["P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

  // 新增：库选择相关状态
  const [showKnowledgeLibrary, setShowKnowledgeLibrary] = useState(false);
  const [showAbilityLibrary, setShowAbilityLibrary] = useState(false);
  const [showFeedbackLibrary, setShowFeedbackLibrary] = useState(false);

  // 新增：库选择项状态
  const [selectedKnowledgeLibraryItems, setSelectedKnowledgeLibraryItems] = useState<string[]>([]);
  const [selectedAbilityLibraryItems, setSelectedAbilityLibraryItems] = useState<string[]>([]);
  const [selectedFeedbackLibraryItems, setSelectedFeedbackLibraryItems] = useState<string[]>([]);

  // 新增：库数据
  const knowledgeLibraryData = {
    "编程技能": [
      { name: "JavaScript基础", description: "掌握JavaScript基本语法和特性", level: "基础" },
      { name: "React框架", description: "熟练使用React进行前端开发", level: "中级" },
      { name: "Node.js开发", description: "具备Node.js后端开发能力", level: "中级" },
      { name: "TypeScript", description: "能够使用TypeScript进行类型安全开发", level: "高级" }
    ],
    "数据库技能": [
      { name: "MySQL", description: "熟练使用MySQL进行数据库设计和查询", level: "中级" },
      { name: "MongoDB", description: "掌握NoSQL数据库的使用", level: "中级" },
      { name: "Redis", description: "了解缓存技术的应用", level: "基础" }
    ],
    "系统设计": [
      { name: "微服务架构", description: "理解微服务架构设计原则", level: "高级" },
      { name: "分布式系统", description: "具备分布式系统设计能力", level: "专家" }
    ]
  };

  const abilityLibraryData = {
    "沟通协作": [
      { name: "团队协作", description: "能够有效与团队成员协作完成项目", level: "基础" },
      { name: "跨部门沟通", description: "具备良好的跨部门沟通协调能力", level: "中级" },
      { name: "客户沟通", description: "能够与客户进行有效沟通", level: "中级" }
    ],
    "问题解决": [
      { name: "分析思维", description: "具备强的逻辑分析和问题分解能力", level: "中级" },
      { name: "创新思维", description: "能够提出创新性的解决方案", level: "高级" },
      { name: "决策能力", description: "在复杂情况下做出正确决策", level: "高级" }
    ],
    "学习能力": [
      { name: "快速学习", description: "能够快速掌握新技术和知识", level: "中级" },
      { name: "知识转化", description: "能够将学到的知识应用到实践中", level: "中级" }
    ]
  };

  const feedbackLibraryData = {
    "绩效管理": [
      { name: "目标设定", description: "能够设定清晰的工作目标", level: "基础" },
      { name: "进度跟踪", description: "定期跟踪和报告工作进度", level: "基础" },
      { name: "结果评估", description: "客观评估工作成果和质量", level: "中级" }
    ],
    "团队建设": [
      { name: "团队激励", description: "能够激发团队成员的工作积极性", level: "中级" },
      { name: "冲突管理", description: "妥善处理团队内部冲突", level: "高级" },
      { name: "人才培养", description: "注重团队成员的成长和发展", level: "高级" }
    ],
    "组织发展": [
      { name: "流程优化", description: "持续优化工作流程和方法", level: "中级" },
      { name: "文化建设", description: "推动积极的组织文化建设", level: "高级" }
    ]
  };

  // 库选择项切换函数
  const toggleKnowledgeLibraryItem = (itemId: string, item: any) => {
    setSelectedKnowledgeLibraryItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const toggleAbilityLibraryItem = (itemId: string, item: any) => {
    setSelectedAbilityLibraryItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const toggleFeedbackLibraryItem = (itemId: string, item: any) => {
    setSelectedFeedbackLibraryItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // 添加标准编辑相关状态
  const [showEditStandardDialog, setShowEditStandardDialog] = useState(false);
  const [editingStandard, setEditingStandard] = useState<StandardDetail | null>(null);

  // 添加HRBP类型筛选状态
  const [selectedHRBPType, setSelectedHRBPType] = useState<string>("all");

  // 添加部门筛选状态
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // 模拟标准列表数据
  const standardsList = [
    {
      id: "std-001",
      title: "P5 高级工程师",
      type: "技术类",
      description: "需要5年以上相关经验，具备系统设计能力和团队协作领导力",
      updateDate: "2023-06-05",
      category: "技术类",
      position: "高级工程师",
      role: "开发",
      level: "P5",
      system: "研发体系",
      department: "研发部",
      knowledge: [
        { name: "系统设计", description: "能够设计复杂系统架构，并考虑性能、可扩展性和可维护性", category: "系统分析" },
        { name: "代码质量", description: "能够编写高质量、可维护的代码，并进行代码审查", category: "软件开发" }
      ],
      abilities: [
        { name: "问题解决", description: "能够分析并解决复杂技术问题", category: "问题解决与优化" },
        { name: "团队协作", description: "能够有效地与团队成员协作，共同完成项目目标", category: "方案实施/落地" }
      ],
      feedback: [
        { name: "技术评审委员会", date: "2023-05-15", content: "技术能力突出，在系统架构和性能优化方面表现尤为突出。", category: "知识传承" }
      ]
    },
    {
      id: "std-002",
      title: "P4 工程师", 
      type: "技术类",
      description: "需要3年以上相关经验，能够独立完成开发任务和技术问题排查",
      updateDate: "2023-05-20",
      category: "技术类",
      position: "工程师",
      role: "开发",
      level: "P4",
      system: "研发体系",
      department: "研发部",
      knowledge: [],
      abilities: [],
      feedback: []
    },
    {
      id: "std-003",
      title: "P6 资深工程师",
      type: "技术类", 
      description: "需要7年以上相关经验，具备技术领导力和系统架构设计能力",
      updateDate: "2023-04-15",
      category: "技术类",
      position: "资深工程师",
      role: "架构",
      level: "P6",
      system: "研发体系",
      department: "研发部",
      knowledge: [],
      abilities: [],
      feedback: []
    },
    {
      id: "std-004",
      title: "P4 产品经理",
      type: "产品类",
      description: "需要3年以上产品经验，具备产品规划和用户调研能力", 
      updateDate: "2023-03-20",
      category: "产品类",
      position: "产品经理",
      role: "产品",
      level: "P4",
      system: "产品体系",
      department: "产品部",
      knowledge: [],
      abilities: [],
      feedback: []
    },
    {
      id: "std-005",
      title: "P5 高级产品经理",
      type: "产品类",
      description: "需要5年以上产品经验，具备产品战略规划和团队管理能力",
      updateDate: "2023-02-10",
      category: "产品类", 
      position: "高级产品经理",
      role: "产品",
      level: "P5",
      system: "产品体系",
      department: "产品部",
      knowledge: [],
      abilities: [],
      feedback: []
    }
  ];

  // 筛选标准列表
  const filteredStandardsList = standardsList.filter(standard => {
    const searchMatch = !searchTerm || 
      standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const systemMatch = selectedSystem === 'all' ? true : standard.system === selectedSystem;
    const departmentMatch = selectedDepartment === 'all' ? true : standard.department === selectedDepartment;
    const classMatch = selectedClass === "all" || standard.category === selectedClass;
    const subClassMatch = selectedSubClass === "all" || true; // 暂时设为true，实际需要根据数据结构调整
    const directionMatch = selectedDirection === "all" || true; // 暂时设为true，实际需要根据数据结构调整
    const positionMatch = !selectedPosition || standard.position === selectedPosition; 
    const roleMatch = !selectedRole || standard.role === selectedRole;
    const levelMatch = !selectedLevel || standard.level === selectedLevel;
    const hrbpMatch = selectedHRBPType === 'all' ? true : 
      (selectedHRBPType === 'multi' && filterOptions.manager) ||
      (selectedHRBPType === 'single' && filterOptions.system);
    
    return searchMatch && systemMatch && departmentMatch && classMatch && subClassMatch && directionMatch && positionMatch && roleMatch && levelMatch && hrbpMatch;
  });

  // 编辑标准功能
  const editStandardDetail = (standard: StandardDetail) => {
    setEditingStandard(standard);
    setShowStandardDetail(false);
    setShowEditStandardDialog(true);
  };

  // 处理单个员工发起评审流程确认
  const handleSingleReviewConfirm = () => {
    // 设置流程状态为"资料填写中"或其他初始状态
    setSelectedProcess("资料填写中");
    
    // 关闭确认对话框
    setShowSingleReviewConfirm(false);
    // 注意：不清空selectedEmployeeForReview，因为流程详情页面需要使用
    
    // 直接进入流程详情页面
    setShowProcessDetail(true);
  };

  // 处理流程列表批量发起评审
  const handleProcessBatchReview = () => {
    if (showProcessSelectionMode) {
      // 如果已经在选择模式，显示确认对话框
      setShowProcessBatchConfirm(true);
    } else {
      // 进入选择模式
      setShowProcessSelectionMode(true);
      setSelectedProcesses([]); // 清空之前的选择
    }
  };

  // 处理流程批量确认
  const handleProcessBatchConfirm = () => {
    // 模拟批量发起评审流程
    setProcessBatchSuccess(true);
    
    // 3秒后关闭确认对话框
    setTimeout(() => {
      setProcessBatchSuccess(false);
      setShowProcessBatchConfirm(false);
      setShowProcessSelectionMode(false);
      setSelectedProcesses([]);
    }, 3000);
  };

  // 清除流程选择
  const clearProcessSelection = () => {
    setSelectedProcesses([]);
  };

  // 取消流程批量操作
  const cancelProcessBatchOperation = () => {
    setShowProcessSelectionMode(false);
    setSelectedProcesses([]);
  };

  // 查看流程详情
  const viewProcessDetail = (processId: string) => {
    const process = processList.find(p => p.id === processId);
    if (process) {
      // 这里可以跳转到流程详情页面或显示详情弹窗
      // 暂时复用现有的流程详情弹窗
      setSelectedProcess("流程详情");
      setShowProcessDetail(true);
    }
  };

  // 雷达图相关状态
  const [selectedRadarEmployee, setSelectedRadarEmployee] = useState<string>("");
  const [selectedRadarTarget, setSelectedRadarTarget] = useState<string>("");
  const [radarFilters, setRadarFilters] = useState({
    class: "all",
    subClass: "all",
    system: "all",
    department: "all", 
    direction: "all",
    position: "all",
    challengeLevel: "all"
  });
  
  // 新增：雷达图状态
  const [showRadarChart, setShowRadarChart] = useState(false);

  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-2 bg-[#f4f7fa]">
      <div className="mb-1">
        <h1 className="text-[18px] font-bold text-gray-800">任职资格管理</h1>
        <p className="text-sm text-gray-500">定义和管理岗位任职资格标准</p>
      </div>

      <Tabs defaultValue="standard" className="w-full mt-8">
        <TabsList className="w-full flex justify-start space-x-6 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger 
            value="standard" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            任职资格标准
          </TabsTrigger>
          <TabsTrigger 
            value="process" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            认证对象
          </TabsTrigger>
          <TabsTrigger 
            value="process-list" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            流程列表
          </TabsTrigger>
          <TabsTrigger 
            value="result" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            结果应用
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">任职资格标准管理</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  className="text-[#3C5E5C] border-[#3C5E5C] hover:bg-[#3C5E5C] hover:text-white text-xs px-3 py-1 h-8 rounded-md"
                  onClick={handleDownloadTemplate}
                >
                  下载模板
                </Button>
                <Button 
                  variant="outline"
                  className="text-[#3C5E5C] border-[#3C5E5C] hover:bg-[#3C5E5C] hover:text-white text-xs px-3 py-1 h-8 rounded-md"
                  onClick={() => setShowUploadStandardDialog(true)}
                >
                  上传标准
                </Button>
              <Button 
                className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                onClick={() => setShowAddStandardDialog(true)}
              >
                <PlusIcon size={14} className="mr-1" />
                添加标准
              </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* 搜索和筛选区域 */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <div className="relative w-48">
                  <Input
                    placeholder="搜索任职资格标准..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-9 text-sm pl-3 pr-8 py-1 border-gray-200"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                  
                  <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="体系" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">体系</SelectItem>
                      {systemOptions.map((system) => (
                        <SelectItem key={system} value={system} className="text-sm">
                          {system}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="部门" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">部门</SelectItem>
                      <SelectItem value="研发部" className="text-sm">研发部</SelectItem>
                      <SelectItem value="产品部" className="text-sm">产品部</SelectItem>
                      <SelectItem value="设计部" className="text-sm">设计部</SelectItem>
                      <SelectItem value="市场部" className="text-sm">市场部</SelectItem>
                      <SelectItem value="人力资源部" className="text-sm">人力资源部</SelectItem>
                      <SelectItem value="财务部" className="text-sm">财务部</SelectItem>
                    </SelectContent>
                  </Select>
                
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="类" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all" className="text-sm">类</SelectItem>
                      {classOptions.map((cls) => (
                        <SelectItem key={cls} value={cls} className="text-sm">
                          {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSubClass} onValueChange={setSelectedSubClass}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="子类" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all" className="text-sm">子类</SelectItem>
                      {selectedClass && selectedClass !== "all" && subClassOptions[selectedClass]?.map((subClass) => (
                        <SelectItem key={subClass} value={subClass} className="text-sm">
                          {subClass}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="方向" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all" className="text-sm">方向</SelectItem>
                      {selectedClass && selectedClass !== "all" && directionOptions[selectedClass]?.map((direction) => (
                        <SelectItem key={direction} value={direction} className="text-sm">
                          {direction}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="职务" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all" className="text-sm">职务</SelectItem>
                      {selectedClass && selectedClass !== "all" && positionOptions[selectedClass]?.map((position) => (
                      <SelectItem key={position} value={position} className="text-sm">
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="横向角色" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent>
                      {standardRoles.map((role) => (
                      <SelectItem key={role} value={role} className="text-sm">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="任职资格等级" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent>
                      {qualificationLevels.map((level) => (
                      <SelectItem key={level} value={level} className="text-sm">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                  <Select value={selectedHRBPType} onValueChange={setSelectedHRBPType}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="HRBP类型" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">HRBP</SelectItem>
                      <SelectItem value="multi" className="text-sm">多体系HRBP</SelectItem>
                      <SelectItem value="single" className="text-sm">单体系HRBP</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-9 text-sm"
                  >
                    重置
                        </Button>
                  </div>
                </div>
                
              {/* 标准列表 */}
              <div className="space-y-0 divide-y divide-gray-200">
                {filteredStandardsList.map((standard) => (
                  <div key={standard.id} className="py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-800">{standard.title}</h3>
                        <div className={`px-2 py-0.5 text-sm rounded-md ${
                          standard.type === "技术类" ? "bg-blue-100 text-blue-700" :
                          standard.type === "产品类" ? "bg-green-100 text-green-700" :
                          standard.type === "管理类" ? "bg-purple-100 text-purple-700" :
                          standard.type === "设计类" ? "bg-pink-100 text-pink-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {standard.type}
                    </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mb-1.5">{standard.description}</p>
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">更新于: {standard.updateDate}</div>
                      <div>
                        <Button size="sm" variant="ghost" className="text-sm h-6 text-[#3C5E5C]"
                            onClick={() => viewStandardDetail(standard)}
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
                
                {filteredStandardsList.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <p>暂无符合条件的任职资格标准</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">认证对象管理</CardTitle>
              {showReviewSelectionMode ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">已选择 {employeesToReview.length} 名员工</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEmployeesToReview([])}
                    className="text-xs h-7"
                  >
                    清除
                  </Button>
                  <Button 
                    className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                    onClick={() => setShowReviewConfirmDialog(true)}
                    disabled={employeesToReview.length === 0}
                  >
                    确认
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowReviewSelectionMode(false)}
                    className="text-xs h-7"
                  >
                    取消
                  </Button>
                </div>
              ) : (
                <Button 
                  className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                  onClick={initiateReviewProcess}
                >
                  发起评审流程
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {/* 当前认证周期与筛选区域合并 */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">当前认证周期：</span>
                  <Select defaultValue="2023">
                    <SelectTrigger className="w-32 h-9 text-sm border-gray-200">
                      <SelectValue placeholder="选择周期" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="2024">2024年</SelectItem>
                      <SelectItem value="2024-Q1">2024年 Q1</SelectItem>
                      <SelectItem value="2024-Q2">2024年 Q2</SelectItem>
                      <SelectItem value="2024-Q3">2024年 Q3</SelectItem>
                      <SelectItem value="2024-Q4">2024年 Q4</SelectItem>
                      <SelectItem value="2023">2023年</SelectItem>
                      <SelectItem value="2023-Q1">2023年 Q1</SelectItem>
                      <SelectItem value="2023-Q2">2023年 Q2</SelectItem>
                      <SelectItem value="2023-Q3">2023年 Q3</SelectItem>
                      <SelectItem value="2023-Q4">2023年 Q4</SelectItem>
                      <SelectItem value="2022">2022年</SelectItem>
                      <SelectItem value="2022-Q1">2022年 Q1</SelectItem>
                      <SelectItem value="2022-Q2">2022年 Q2</SelectItem>
                      <SelectItem value="2022-Q3">2022年 Q3</SelectItem>
                      <SelectItem value="2022-Q4">2022年 Q4</SelectItem>
                      <SelectItem value="2021">2021年</SelectItem>
                      <SelectItem value="2021-Q1">2021年 Q1</SelectItem>
                      <SelectItem value="2021-Q2">2021年 Q2</SelectItem>
                      <SelectItem value="2021-Q3">2021年 Q3</SelectItem>
                      <SelectItem value="2021-Q4">2021年 Q4</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  
                  <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="体系" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">体系</SelectItem>
                      {systemOptions.map((system) => (
                        <SelectItem key={system} value={system} className="text-sm">
                          {system}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="部门" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">部门</SelectItem>
                      <SelectItem value="研发部" className="text-sm">研发部</SelectItem>
                      <SelectItem value="产品部" className="text-sm">产品部</SelectItem>
                      <SelectItem value="设计部" className="text-sm">设计部</SelectItem>
                      <SelectItem value="市场部" className="text-sm">市场部</SelectItem>
                      <SelectItem value="人力资源部" className="text-sm">人力资源部</SelectItem>
                      <SelectItem value="财务部" className="text-sm">财务部</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="类" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">类</SelectItem>
                      {classOptions.map((cls) => (
                        <SelectItem key={cls} value={cls} className="text-sm">
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSubClass} onValueChange={setSelectedSubClass}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="子类" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">子类</SelectItem>
                      {selectedClass && selectedClass !== "all" && subClassOptions[selectedClass]?.map((subClass) => (
                        <SelectItem key={subClass} value={subClass} className="text-sm">
                          {subClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="方向" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">方向</SelectItem>
                      {selectedClass && selectedClass !== "all" && directionOptions[selectedClass]?.map((direction) => (
                        <SelectItem key={direction} value={direction} className="text-sm">
                          {direction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="职务" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">职务</SelectItem>
                      {selectedClass && selectedClass !== "all" && positionOptions[selectedClass]?.map((position) => (
                        <SelectItem key={position} value={position} className="text-sm">
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="横向角色" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardRoles.map((role) => (
                        <SelectItem key={role} value={role} className="text-sm">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="任职资格等级" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationLevels.map((level) => (
                        <SelectItem key={level} value={level} className="text-sm">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-9 text-sm"
                  >
                    重置
                  </Button>
                </div>
              </div>

              {/* 表格数据 */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-[1200px] w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {showReviewSelectionMode && (
                        <th scope="col" className="pl-4 py-3 text-left whitespace-nowrap w-16">
                          <span 
                            className="text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none flex items-center"
                            onClick={() => employeesToReview.length === employeeData.length 
                              ? setEmployeesToReview([]) 
                              : setEmployeesToReview(employeeData.map(emp => emp.id))}
                          >
                            <div className={`flex items-center justify-center w-4 h-4 rounded border ${
                              employeesToReview.length === employeeData.length
                                ? "bg-[#3C5E5C] border-[#3C5E5C] text-white" 
                                : "border-gray-300 text-transparent"
                            } mr-2`}>
                              {employeesToReview.length === employeeData.length && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                            全选
                          </span>
                        </th>
                      )}
                      <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">头像</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">申请人姓名</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">职务</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">申请人工号</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">体系</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">部门</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">评审流程</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">当前技术职级</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">查看详情</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedEmployeeData.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        {showReviewSelectionMode && (
                          <td className="pl-4 py-3 whitespace-nowrap">
                            <div 
                              className={`flex items-center justify-center w-4 h-4 rounded border ${
                                employeesToReview.includes(employee.id) 
                                  ? "bg-[#3C5E5C] border-[#3C5E5C] text-white" 
                                  : "border-gray-300 text-transparent"
                              } cursor-pointer`}
                              onClick={() => toggleEmployeeReviewSelection(employee.id)}
                            >
                              {employeesToReview.includes(employee.id) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                        </div>
                      </td>
                        )}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src={employee.avatar} alt="员工头像" className="h-10 w-10 object-cover" />
                  </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.system}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.department}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.processStatus ? (
                              <span className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                                    onClick={() => enterProcess(employee.id, employee.processStatus)}>
                                {employee.processStatus === "技术评审中" ? "技术评审" : employee.processStatus}
                              </span>
                            ) : (
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                                onClick={() => enterProcess(employee.id, "发起评审流程")}
                          >
                                发起评审流程
                          </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.currentLevel}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-left">
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                            onClick={() => viewEmployeeDetail(employee.id)}
                          >
                            查看详情
                          </span>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process-list" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">任职资格流程列表</CardTitle>
              <div className="flex space-x-2">
                {showProcessSelectionMode ? (
                  <>
                    <span className="text-sm text-gray-600 flex items-center">
                      已选择 {selectedProcesses.length} 名员工
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs px-3 py-1 h-8"
                      onClick={clearProcessSelection}
                    >
                      清除
                    </Button>
                <Button 
                  className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                      onClick={handleProcessBatchReview}
                  disabled={selectedProcesses.length === 0}
                >
                      确认
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs px-3 py-1 h-8"
                      onClick={cancelProcessBatchOperation}
                    >
                      取消
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                      onClick={handleProcessBatchReview}
                    >
                      发起批量评审
                </Button>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                  <PlusIcon size={14} className="mr-1" />
                  创建流程
                </Button>
                  </>
                )}
                  </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* 筛选区域 */}
              <div className="mb-6 space-y-3">
                {/* 第一行：搜索框和常用筛选 */}
                <div className="flex items-center space-x-3">
                  <div className="relative w-48">
                    <Input 
                      placeholder="输入流程名称或人名..." 
                      value={processFilters.name}
                      onChange={(e) => handleProcessFilterChange('name', e.target.value)}
                      className="h-9 text-sm pl-3 pr-8 py-1 border-gray-200"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <Select 
                    value={processFilters.class}
                    onValueChange={(value) => handleProcessFilterChange('class', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="类" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">类</SelectItem>
                      {classOptions.map((cls) => (
                        <SelectItem key={cls} value={cls} className="text-sm">{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.subClass}
                    onValueChange={(value) => handleProcessFilterChange('subClass', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="子类" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">子类</SelectItem>
                      {processFilters.class && processFilters.class !== "all" && subClassOptions[processFilters.class]?.map((subClass) => (
                        <SelectItem key={subClass} value={subClass} className="text-sm">{subClass}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.cycle} 
                    onValueChange={(value) => handleProcessFilterChange('cycle', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="周期" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="2024年Q1" className="text-sm">2024年Q1</SelectItem>
                      <SelectItem value="2024年Q2" className="text-sm">2024年Q2</SelectItem>
                      <SelectItem value="2024年Q3" className="text-sm">2024年Q3</SelectItem>
                      <SelectItem value="2024年Q4" className="text-sm">2024年Q4</SelectItem>
                      <SelectItem value="2023年Q1" className="text-sm">2023年Q1</SelectItem>
                      <SelectItem value="2023年Q2" className="text-sm">2023年Q2</SelectItem>
                      <SelectItem value="2023年Q3" className="text-sm">2023年Q3</SelectItem>
                      <SelectItem value="2023年Q4" className="text-sm">2023年Q4</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.system}
                    onValueChange={(value) => handleProcessFilterChange('system', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="体系" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="研发体系" className="text-sm">研发体系</SelectItem>
                      <SelectItem value="产品体系" className="text-sm">产品体系</SelectItem>
                      <SelectItem value="设计体系" className="text-sm">设计体系</SelectItem>
                      <SelectItem value="管理体系" className="text-sm">管理体系</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.department}
                    onValueChange={(value) => handleProcessFilterChange('department', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="部门" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="研发部" className="text-sm">研发部</SelectItem>
                      <SelectItem value="产品部" className="text-sm">产品部</SelectItem>
                      <SelectItem value="设计部" className="text-sm">设计部</SelectItem>
                      <SelectItem value="项目管理部" className="text-sm">项目管理部</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.sequence} 
                    onValueChange={(value) => handleProcessFilterChange('sequence', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="序列" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="技术序列" className="text-sm">技术序列</SelectItem>
                      <SelectItem value="产品序列" className="text-sm">产品序列</SelectItem>
                      <SelectItem value="设计序列" className="text-sm">设计序列</SelectItem>
                      <SelectItem value="管理序列" className="text-sm">管理序列</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={processFilters.direction} 
                    onValueChange={(value) => handleProcessFilterChange('direction', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="方向" className="text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="前端开发" className="text-sm">前端开发</SelectItem>
                      <SelectItem value="后端开发" className="text-sm">后端开发</SelectItem>
                      <SelectItem value="全栈开发" className="text-sm">全栈开发</SelectItem>
                      <SelectItem value="产品管理" className="text-sm">产品管理</SelectItem>
                      <SelectItem value="UI设计" className="text-sm">UI设计</SelectItem>
                      <SelectItem value="项目管理" className="text-sm">项目管理</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 text-sm"
                    onClick={() => setShowMoreProcessFilters(!showMoreProcessFilters)}
                  >
                    {showMoreProcessFilters ? '收起筛选' : '更多筛选'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 text-sm"
                    onClick={() => {
                      // 重置所有筛选条件
                      setProcessFilters({
                        name: "",
                        status: "",
                        class: "all",
                        subClass: "all",
                        sequence: "",
                        department: "",
                        system: "",
                        direction: "",
                        position: "",
                        role: "",
                        level: "",
                        cycle: "",
                        date: ""
                      });
                    }}
                  >
                    重置
                  </Button>
                </div>
                
                                 {/* 第二行：更多筛选（可折叠） */}
                 {showMoreProcessFilters && (
                   <div className="flex items-center space-x-3" style={{ marginLeft: '204px' }}>
                     <Select 
                       value={processFilters.position} 
                       onValueChange={(value) => handleProcessFilterChange('position', value)}
                     >
                       <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                         <SelectValue placeholder="职务" className="text-sm" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all" className="text-sm">全部</SelectItem>
                         <SelectItem value="工程师" className="text-sm">工程师</SelectItem>
                         <SelectItem value="高级工程师" className="text-sm">高级工程师</SelectItem>
                         <SelectItem value="产品经理" className="text-sm">产品经理</SelectItem>
                         <SelectItem value="项目经理" className="text-sm">项目经理</SelectItem>
                         <SelectItem value="设计师" className="text-sm">设计师</SelectItem>
                         <SelectItem value="高级设计师" className="text-sm">高级设计师</SelectItem>
                       </SelectContent>
                     </Select>

                     <Select 
                       value={processFilters.level} 
                       onValueChange={(value) => handleProcessFilterChange('level', value)}
                     >
                       <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                         <SelectValue placeholder="职级" className="text-sm" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all" className="text-sm">全部</SelectItem>
                         <SelectItem value="P3" className="text-sm">P3</SelectItem>
                         <SelectItem value="P4" className="text-sm">P4</SelectItem>
                         <SelectItem value="P5" className="text-sm">P5</SelectItem>
                         <SelectItem value="P6" className="text-sm">P6</SelectItem>
                         <SelectItem value="P7" className="text-sm">P7</SelectItem>
                         <SelectItem value="P8" className="text-sm">P8</SelectItem>
                       </SelectContent>
                     </Select>

                     <Select 
                       value={processFilters.role} 
                       onValueChange={(value) => handleProcessFilterChange('role', value)}
                     >
                       <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                         <SelectValue placeholder="角色" className="text-sm" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all" className="text-sm">全部</SelectItem>
                         <SelectItem value="开发" className="text-sm">开发</SelectItem>
                         <SelectItem value="产品" className="text-sm">产品</SelectItem>
                         <SelectItem value="设计" className="text-sm">设计</SelectItem>
                         <SelectItem value="项目管理" className="text-sm">项目管理</SelectItem>
                         <SelectItem value="架构师" className="text-sm">架构师</SelectItem>
                         <SelectItem value="技术专家" className="text-sm">技术专家</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 )}
              </div>
              
              {/* 流程列表表格 */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-[1600px] w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {showProcessSelectionMode && (
                      <th scope="col" className="pl-4 py-3 text-left">
                        <span 
                          className="text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none flex items-center"
                          onClick={() => handleSelectAll(selectedProcesses.length !== processList.length || processList.length === 0)}
                        >
                          <div className={`flex items-center justify-center w-4 h-4 rounded border ${
                            selectedProcesses.length === processList.length && processList.length > 0
                              ? "bg-[#3C5E5C] border-[#3C5E5C] text-white" 
                              : "border-gray-300 text-transparent"
                          } mr-2`}>
                            {selectedProcesses.length === processList.length && processList.length > 0 && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                          全选
                        </span>
                      </th>
                      )}
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">流程名称</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">流程状态</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">申请人姓名</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">申请人工号</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">创建时间</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">岗位序列</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">方向</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">职务</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">横向角色</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">体系</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">部门</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">团队</th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processList.map((process) => (
                      <tr key={process.id} className="hover:bg-gray-50">
                        {showProcessSelectionMode && (
                        <td className="pl-4 py-3 whitespace-nowrap">
                          <div 
                            className={`flex items-center justify-center w-4 h-4 rounded border ${
                              selectedProcesses.includes(process.id) 
                                ? "bg-[#3C5E5C] border-[#3C5E5C] text-white" 
                                : "border-gray-300 text-transparent"
                            } cursor-pointer`}
                            onClick={() => handleProcessSelect(process.id)}
                          >
                            {selectedProcesses.includes(process.id) && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                  </div>
                      </td>
                        )}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.name}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            process.status === "进行中" 
                              ? "bg-blue-100 text-blue-700" 
                              : process.status === "已完成"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                          }`}>
                            {process.status}
                          </span>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.applicantName}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.applicantId}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.createDate}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.sequence}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.direction}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.position}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.role}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.system}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.department}</div>
                      </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.team}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                            onClick={() => viewProcessDetail(process.id)}
                          >
                            查看详情
                          </span>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="result" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden w-full">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <div className="flex items-center gap-4 w-full justify-between">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">任职资格结果应用</CardTitle>
                <div className="flex items-center gap-3">
                  {/* 能力下拉框 */}
                  <Select value={selectedAbility} onValueChange={setSelectedAbility}>
                    <SelectTrigger className="w-32 h-8 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="选择能力" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {abilityOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* 体系下拉框 */}
                  <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                    <SelectTrigger className="w-32 h-8 text-sm border-gray-200 px-3 py-1">
                      <SelectValue placeholder="选择体系" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {systemOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                    导出报告
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-3 w-full items-start">
                {/* 左侧 能力分数人数占比 38% */}
                <div className="w-[38%] min-w-[260px] flex flex-col justify-between h-full">
                  <div>
                    {/* 统计每个关键能力分数段人数 */}
                    {abilityBarList}
                  </div>
                  <div className="flex flex-row items-center justify-start mt-6">
                    <Select
                      value={abilityBarType}
                      onValueChange={value => setAbilityBarType(value as 'count' | 'percent')}
                    >
                      <SelectTrigger className="w-24 h-8 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="显示类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="count">人数</SelectItem>
                        <SelectItem value="percent">百分比</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* 右侧 任职资格结果应用 62% */}
                <div className="w-[62%] flex flex-col h-full">
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">排名</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">头像</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">申请人工号</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">申请人姓名</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">分数</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedResultEmployeeData.map((emp, idx) => (
                          <tr key={emp.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-center font-bold">{idx + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                                <img src={emp.avatar} alt="员工头像" className="h-10 w-10 object-cover" />
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{emp.id}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center font-bold">
                              {emp.knowledgeSkillScore + emp.keyAbilityScore}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-left">
                              <span 
                                className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                                onClick={() => viewEmployeeDetail(emp.id)}
                              >
                                查看个人详情
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="text-xs text-gray-500">总人数：{employeeData.length}人</div>
                  </div>
                </div>
              </div>
              
              {/* 能力雷达图模块 */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{color: '#3C5E5C'}} className="text-sm font-medium">能力雷达图对比</h3>
                  <div className="text-sm text-gray-500">选择员工和目标进行能力对比分析</div>
                </div>
                
                {/* 筛选区域 */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 flex-wrap">
                    <Select 
                      value={radarFilters.class}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, class: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="类" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">类</SelectItem>
                        {classOptions.map((cls) => (
                          <SelectItem key={cls} value={cls} className="text-sm">{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={radarFilters.subClass}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, subClass: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="子类" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">子类</SelectItem>
                        {radarFilters.class && radarFilters.class !== "all" && subClassOptions[radarFilters.class]?.map((subClass) => (
                          <SelectItem key={subClass} value={subClass} className="text-sm">{subClass}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={radarFilters.system}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, system: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="体系" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">体系</SelectItem>
                        <SelectItem value="研发体系" className="text-sm">研发体系</SelectItem>
                        <SelectItem value="产品体系" className="text-sm">产品体系</SelectItem>
                        <SelectItem value="设计体系" className="text-sm">设计体系</SelectItem>
                        <SelectItem value="管理体系" className="text-sm">管理体系</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={radarFilters.department}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, department: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="部门" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">部门</SelectItem>
                        <SelectItem value="研发部" className="text-sm">研发部</SelectItem>
                        <SelectItem value="产品部" className="text-sm">产品部</SelectItem>
                        <SelectItem value="设计部" className="text-sm">设计部</SelectItem>
                        <SelectItem value="项目管理部" className="text-sm">项目管理部</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={radarFilters.direction}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, direction: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="方向" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">方向</SelectItem>
                        <SelectItem value="前端开发" className="text-sm">前端开发</SelectItem>
                        <SelectItem value="后端开发" className="text-sm">后端开发</SelectItem>
                        <SelectItem value="全栈开发" className="text-sm">全栈开发</SelectItem>
                        <SelectItem value="产品管理" className="text-sm">产品管理</SelectItem>
                        <SelectItem value="UI设计" className="text-sm">UI设计</SelectItem>
                        <SelectItem value="项目管理" className="text-sm">项目管理</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={radarFilters.position}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, position: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="职务" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">职务</SelectItem>
                        <SelectItem value="工程师" className="text-sm">工程师</SelectItem>
                        <SelectItem value="高级工程师" className="text-sm">高级工程师</SelectItem>
                        <SelectItem value="产品经理" className="text-sm">产品经理</SelectItem>
                        <SelectItem value="项目经理" className="text-sm">项目经理</SelectItem>
                        <SelectItem value="设计师" className="text-sm">设计师</SelectItem>
                        <SelectItem value="高级设计师" className="text-sm">高级设计师</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={radarFilters.challengeLevel}
                      onValueChange={(value) => setRadarFilters(prev => ({...prev, challengeLevel: value}))}
                    >
                      <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                        <SelectValue placeholder="挑战者级别" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">级别</SelectItem>
                        <SelectItem value="13L" className="text-sm">13L</SelectItem>
                        <SelectItem value="13M" className="text-sm">13M</SelectItem>
                        <SelectItem value="13H" className="text-sm">13H</SelectItem>
                        <SelectItem value="14L" className="text-sm">14L</SelectItem>
                        <SelectItem value="14M" className="text-sm">14M</SelectItem>
                        <SelectItem value="14H" className="text-sm">14H</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-sm px-3"
                      onClick={() => {
                        setRadarFilters({
                          class: "all",
                          subClass: "all",
                          system: "all",
                          department: "all", 
                          direction: "all",
                          position: "all",
                          challengeLevel: "all"
                        });
                      }}
                    >
                      重置
                    </Button>
                  </div>
                </div>
                
                {/* 选择区域 - 左右布局 */}
                <div className="flex gap-6 w-full mb-6">
                  {/* 左侧：员工选择区域 */}
                  <div className="w-[50%] border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">选择员工</h4>
                    <div className="text-xs text-gray-500 mb-3">请选择一名员工进行能力分析</div>
                    <div className="border border-gray-200 rounded-lg max-h-[320px] overflow-hidden">
                      <div className="overflow-y-auto max-h-[320px]">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th scope="col" className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-12">选择</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">姓名</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">职务</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">体系</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">部门</th>
                              <th scope="col" className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">分数</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* TODO: 对接后台API - GET /api/radar/employees */}
                            {[
                              { id: "EMP001", name: "李十三", position: "高级工程师", system: "研发体系", department: "研发部", score: 85 },
                              { id: "EMP002", name: "张小明", position: "产品经理", system: "产品体系", department: "产品部", score: 92 },
                              { id: "EMP003", name: "王五", position: "高级设计师", system: "设计体系", department: "设计部", score: 88 },
                              { id: "EMP004", name: "赵六", position: "项目经理", system: "管理体系", department: "项目管理部", score: 91 },
                              { id: "EMP005", name: "刘七", position: "工程师", system: "研发体系", department: "研发部", score: 79 },
                              { id: "EMP006", name: "陈八", position: "设计师", system: "设计体系", department: "设计部", score: 83 }
                            ].map((employee) => (
                              <tr 
                                key={employee.id} 
                                className={`cursor-pointer transition-colors ${
                                  selectedRadarEmployee === employee.id 
                                    ? "bg-[#3C5E5C]/10" 
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => setSelectedRadarEmployee(employee.id)}
                              >
                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                  <input 
                                    type="radio" 
                                    name="employee-selection"
                                    checked={selectedRadarEmployee === employee.id}
                                    onChange={() => setSelectedRadarEmployee(employee.id)}
                                    className="w-4 h-4 text-[#3C5E5C] border-gray-300 focus:ring-[#3C5E5C]"
                                  />
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{employee.position}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{employee.system}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{employee.department}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    employee.score >= 90 
                                      ? "bg-green-100 text-green-800" 
                                      : employee.score >= 80 
                                      ? "bg-yellow-100 text-yellow-800" 
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {employee.score}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  {/* 右侧：目标选择区域 */}
                  <div className="w-[50%] border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">选择对比目标</h4>
                    <div className="text-xs text-gray-500 mb-3">请选择任职资格标准作为对比目标</div>
                    <div className="border border-gray-200 rounded-lg max-h-[320px] overflow-hidden">
                      <div className="overflow-y-auto max-h-[320px]">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th scope="col" className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-12">选择</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">标准名称</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">级别</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">体系</th>
                              <th scope="col" className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">部门</th>
                              <th scope="col" className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">分数</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* TODO: 对接后台API - GET /api/radar/targets */}
                            {[
                              { id: "TARGET001", name: "前端开发P5标准", level: "P5", system: "研发体系", department: "研发部", targetScore: 90 },
                              { id: "TARGET002", name: "后端开发P6标准", level: "P6", system: "研发体系", department: "研发部", targetScore: 95 },
                              { id: "TARGET003", name: "产品经理P5标准", level: "P5", system: "产品体系", department: "产品部", targetScore: 88 },
                              { id: "TARGET004", name: "UI设计师P4标准", level: "P4", system: "设计体系", department: "设计部", targetScore: 85 },
                              { id: "TARGET005", name: "项目经理P5标准", level: "P5", system: "管理体系", department: "项目管理部", targetScore: 92 },
                              { id: "TARGET006", name: "全栈开发P6标准", level: "P6", system: "研发体系", department: "研发部", targetScore: 93 }
                            ].map((target) => (
                              <tr 
                                key={target.id} 
                                className={`cursor-pointer transition-colors ${
                                  selectedRadarTarget === target.id 
                                    ? "bg-[#3C5E5C]/10" 
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => setSelectedRadarTarget(target.id)}
                              >
                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                  <input 
                                    type="radio" 
                                    name="target-selection"
                                    checked={selectedRadarTarget === target.id}
                                    onChange={() => setSelectedRadarTarget(target.id)}
                                    className="w-4 h-4 text-[#3C5E5C] border-gray-300 focus:ring-[#3C5E5C]"
                                  />
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{target.name}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{target.level}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{target.system}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{target.department}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    target.targetScore >= 90 
                                      ? "bg-blue-100 text-blue-800" 
                                      : target.targetScore >= 85 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {target.targetScore}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 对比按钮 */}
                <div className="mb-6">
                  <Button 
                    className="w-full bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                    disabled={!selectedRadarEmployee || !selectedRadarTarget}
                    onClick={() => setShowRadarChart(true)}
                  >
                    开始对比分析
                  </Button>
                  <div className="text-xs text-gray-400 text-center mt-2">
                    {selectedRadarEmployee && selectedRadarTarget 
                      ? "点击开始分析能力差距" 
                      : "请先选择员工和目标"
                    }
                  </div>
                </div>
                
                {/* 能力雷达图显示区域 */}
                <div className="w-full">
                  {showRadarChart ? (
                    <div className="border border-gray-200 rounded-lg p-6 bg-white min-h-[900px]">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-medium text-gray-900">能力雷达图对比分析</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowRadarChart(false)}
                          className="text-gray-600"
                        >
                          重新选择
                        </Button>
                      </div>
                      
                      {/* 雷达图图表区域 */}
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[900px] h-[700px] relative mx-auto overflow-visible">
                          {/* SVG雷达图 */}
                          <svg width="800" height="700" viewBox="0 0 800 700" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                            {/* 背景网格 */}
                            <g transform="translate(400, 350)">
                              {/* 5个同心圆 - 20分制 */}
                              {[50, 100, 150, 200, 250].map((radius, index) => (
                                <circle
                                  key={index}
                                  cx={0}
                                  cy={0}
                                  r={radius}
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth={1}
                                />
                              ))}
                              
                              {/* 分数刻度标注 */}
                              {[4, 8, 12, 16, 20].map((score, index) => (
                                <text
                                  key={`scale-${index}`}
                                  x={50 + index * 50}
                                  y={-5}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-400"
                                >
                                  {score}
                                </text>
                              ))}
                              
                              {/* 5条放射线 */}
                              {[0, 72, 144, 216, 288].map((angle, index) => {
                                const x = Math.cos((angle - 90) * Math.PI / 180) * 250;
                                const y = Math.sin((angle - 90) * Math.PI / 180) * 250;
                                return (
                                  <line
                                    key={index}
                                    x1={0}
                                    y1={0}
                                    x2={x}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeWidth={1}
                                  />
                                );
                              })}
                              
                              {/* 员工数据多边形 */}
                              <polygon
                                points={[
                                  [0, 72, 144, 216, 288].map((angle, index) => {
                                    const values = [10, 14, 16, 12, 15]; // 员工能力值（20分制）
                                    const radius = (values[index] / 20) * 250;
                                    const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                                    const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                                    return `${x},${y}`;
                                  }).join(' ')
                                ][0]}
                                fill="rgba(59, 94, 92, 0.3)"
                                stroke="#3C5E5C"
                                strokeWidth={2}
                              />
                              
                              {/* 目标标准多边形 - 浅绿色 */}
                              <polygon
                                points={[
                                  [0, 72, 144, 216, 288].map((angle, index) => {
                                    const values = [18, 16, 17, 18, 19]; // 目标标准值（20分制）
                                    const radius = (values[index] / 20) * 250;
                                    const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                                    const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                                    return `${x},${y}`;
                                  }).join(' ')
                                ][0]}
                                fill="rgba(34, 197, 94, 0.3)"
                                stroke="#22c55e"
                                strokeWidth={2}
                              />
                              
                              {/* 员工数据点 */}
                              {[0, 72, 144, 216, 288].map((angle, index) => {
                                const values = [10, 14, 16, 12, 15];
                                const radius = (values[index] / 20) * 250;
                                const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                                const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                                return (
                                  <circle
                                    key={`employee-${index}`}
                                    cx={x}
                                    cy={y}
                                    r={4}
                                    fill="#3C5E5C"
                                  />
                                );
                              })}
                              
                              {/* 目标数据点 */}
                              {[0, 72, 144, 216, 288].map((angle, index) => {
                                const values = [18, 16, 17, 18, 19];
                                const radius = (values[index] / 20) * 250;
                                const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                                const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                                return (
                                  <circle
                                    key={`target-${index}`}
                                    cx={x}
                                    cy={y}
                                    r={4}
                                    fill="#22c55e"
                                  />
                                );
                              })}
                            </g>
                            
                            {/* 维度标签 */}
                            {[
                              { label: '战略规划', short: '战略规划' },
                              { label: '架构/方案设计', short: '架构设计' },
                              { label: '方案实施/落地', short: '方案实施' },
                              { label: '运维/运营', short: '运维运营' },
                              { label: '问题解决与优化', short: '问题解决' }
                            ].map((item, index) => {
                              const angle = [0, 72, 144, 216, 288][index];
                              const radius = 280; // 缩短标签距离
                              const x = 400 + Math.cos((angle - 90) * Math.PI / 180) * radius;
                              const y = 350 + Math.sin((angle - 90) * Math.PI / 180) * radius;
                              
                              // 根据角度调整文本锚点，避免标签被裁剪
                              let textAnchor = "middle";
                              if (x < 400) textAnchor = "end";
                              else if (x > 400) textAnchor = "start";
                              
                              return (
                                <g key={index}>
                                  {/* 完整标签 */}
                                  <text
                                    x={x}
                                    y={y - 5}
                                    textAnchor={textAnchor}
                                    dominantBaseline="middle"
                                    className="text-sm font-medium fill-gray-700"
                                  >
                                    {item.label}
                                  </text>
                                  {/* 分数显示位置预留 */}
                                  <text
                                    x={x}
                                    y={y + 12}
                                    textAnchor={textAnchor}
                                    dominantBaseline="middle"
                                    className="text-xs fill-gray-500"
                                  >
                                    {/* 这里可以显示具体分数 */}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        
                        {/* 图例 */}
                        <div className="flex items-center space-x-6 mt-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-[#3C5E5C] rounded"></div>
                            <span className="text-sm text-gray-600">当前员工能力</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600">目标标准要求</span>
                          </div>
                        </div>
                        
                        {/* 数据表格 */}
                        <div className="mt-6 w-full max-w-2xl">
                          <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">能力维度</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">员工当前</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">目标标准</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">差距</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {[
                                { dimension: '战略规划', employee: 10, target: 18, gap: -8 },
                                { dimension: '架构/方案设计', employee: 14, target: 16, gap: -2 },
                                { dimension: '方案实施/落地', employee: 16, target: 17, gap: -1 },
                                { dimension: '运维/运营', employee: 12, target: 18, gap: -6 },
                                { dimension: '问题解决与优化', employee: 15, target: 19, gap: -4 }
                              ].map((row, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.dimension}</td>
                                  <td className="px-4 py-3 text-center text-sm text-gray-900">{row.employee}</td>
                                  <td className="px-4 py-3 text-center text-sm text-gray-900">{row.target}</td>
                                  <td className="px-4 py-3 text-center text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      row.gap >= 0 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-red-100 text-red-700"
                                    }`}>
                                      {row.gap >= 0 ? `+${row.gap}` : row.gap}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[500px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-lg font-medium">雷达图显示区域</p>
                        <p className="text-sm mt-2">请选择员工和目标后点击对比</p>
                        <p className="text-xs text-gray-400 mt-1">雷达图将显示能力差距分析</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 员工详情对话框 */}
      <Dialog open={showEmployeeDetail} onOpenChange={setShowEmployeeDetail}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                <img src={selectedEmployee?.avatar} alt="员工头像" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-gray-800">{selectedEmployee?.name}</span>
                <span className="text-gray-500 text-base ml-2">({selectedEmployee?.id})</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 border-b pb-2">基本信息</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">岗位序列</p>
                      <p className="text-sm font-medium">{selectedEmployee.sequence}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">类</p>
                      <p className="text-sm font-medium">{selectedEmployee.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">子类</p>
                      <p className="text-sm font-medium">{selectedEmployee.subClass}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">岗位名称</p>
                      <p className="text-sm font-medium">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">横向角色</p>
                      <p className="text-sm font-medium">{selectedEmployee.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">体系</p>
                      <p className="text-sm font-medium">{selectedEmployee.system}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">部门</p>
                      <p className="text-sm font-medium">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">团队</p>
                      <p className="text-sm font-medium">{selectedEmployee.team}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">直接上级</p>
                      <p className="text-sm font-medium">{selectedEmployee.directManager}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 border-b pb-2">个人OKR</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">近三年挑战级别</p>
                      <p className="text-sm font-medium">{selectedEmployee.challengeLevels.join(' / ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">近三年绩效结果</p>
                      <p className="text-sm font-medium">{selectedEmployee.performanceResults.join(' / ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">近三年远景精神</p>
                      <p className="text-sm font-medium">{selectedEmployee.visionScores.join(' / ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">当前技术职级</p>
                      <p className="text-sm font-medium">{selectedEmployee.currentLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">当前技术职级认证时间</p>
                      <p className="text-sm font-medium">{selectedEmployee.certificationDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 评审历史时间轴 */}
              <div className="mt-8">
                <h3 className="text-md font-medium text-gray-700 border-b pb-2 mb-4">评审历史</h3>
                
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">认证时间</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">认证状态</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">认证结果</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评审组织</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedEmployee.reviewHistory.map((review: ReviewHistoryItem, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{review.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{review.level}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              review.result === "通过" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {review.result}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{review.evaluator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 时间轴显示 */}
                <div className="mt-6 pl-4">
                  <div className="border-l-2 border-[#3C5E5C] pl-6 space-y-6">
                    {selectedEmployee.reviewHistory.map((review: ReviewHistoryItem, index: number) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-[#3C5E5C] flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-white"></div>
                        </div>
                        <div className="pb-6">
                          <div className="text-sm font-medium text-gray-900">{review.date}</div>
                          <div className="mt-1 flex items-center">
                            <div className="text-sm text-gray-700">完成 {review.level} 级别认证</div>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                              review.result === "通过" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {review.result}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">由 {review.evaluator} 评审</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 批量发起评审确认对话框 */}
      <Dialog open={showProcessConfirm} onOpenChange={setShowProcessConfirm}>
        <DialogContent className="bg-white max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">确认批量发起评审</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-700 mb-4">您已选择 {selectedProcesses.length} 个流程进行批量评审，确认后将立即发起所有选中流程的评审。</p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
              {processList
                .filter(process => selectedProcesses.includes(process.id))
                .map(process => (
                  <div key={process.id} className="text-sm flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium">{process.name}</span>
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                      process.status === "进行中" 
                        ? "bg-blue-100 text-blue-700" 
                        : process.status === "已完成"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                    }`}>
                      {process.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowProcessConfirm(false)}
              className="text-sm"
            >
              取消
            </Button>
            <Button 
              className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-sm"
              onClick={confirmStartReview}
            >
              确认发起评审
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加流程详情对话框 */}
      <Dialog open={showProcessDetail} onOpenChange={(open) => {
        setShowProcessDetail(open);
        if (!open) {
          // 关闭流程详情页面时清空员工信息
          setSelectedEmployeeForReview(null);
        }
      }}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedProcess} 流程详情
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 流程进度条 */}
            <div className="w-full py-4">
              <div className="relative">
                <div className="flex justify-between mb-2">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#3C5E5C] text-white flex items-center justify-center mx-auto">1</div>
                    <div className="text-sm mt-1">资料填写</div>
                  </div>
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-full ${selectedProcess === "资料填写中" ? "bg-gray-300 text-gray-600" : "bg-[#3C5E5C] text-white"} flex items-center justify-center mx-auto`}>2</div>
                    <div className="text-sm mt-1">资料审核</div>
                  </div>
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-full ${selectedProcess === "资料填写中" || selectedProcess === "资料审核中" ? "bg-gray-300 text-gray-600" : "bg-[#3C5E5C] text-white"} flex items-center justify-center mx-auto`}>3</div>
                    <div className="text-sm mt-1">技术评审</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mx-auto">4</div>
                    <div className="text-sm mt-1">综合评估</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mx-auto">5</div>
                    <div className="text-sm mt-1">流程结束</div>
                  </div>
                </div>
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div className={`h-full bg-[#3C5E5C] ${
                    selectedProcess === "资料填写中" ? "w-[0%]" :
                    selectedProcess === "资料审核中" ? "w-[25%]" :
                    selectedProcess === "技术评审中" ? "w-[50%]" :
                    "w-[60%]"
                  }`}></div>
                </div>
              </div>
            </div>
            
            {/* 流程表单 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">任职资格评审流程表</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请人姓名</label>
                    <Input className="bg-white" defaultValue={selectedEmployeeForReview?.name || "李十三"} readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请人部门</label>
                    <Input className="bg-white" defaultValue={selectedEmployeeForReview?.department || "研发部"} readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请认证职级</label>
                    <Input className="bg-white" defaultValue={selectedEmployeeForReview ? `${selectedEmployeeForReview.currentLevel} ${selectedEmployeeForReview.position}` : "P6 资深工程师"} readOnly />
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">认证周期</label>
                    <Input className="bg-white" defaultValue="2023年" readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前流程阶段</label>
                    <Input className="bg-white" defaultValue={selectedProcess || "资料填写中"} readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">预计完成时间</label>
                    <Input className="bg-white" defaultValue="2023-12-31" readOnly />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">技术评审委员会意见</label>
                <div className="rounded-md border border-gray-300 p-3 bg-white min-h-[100px]">
                  {selectedProcess === "技术评审中" ? (
                    <p className="text-sm text-gray-600">技术能力突出，在系统架构和性能优化方面表现尤为突出。后续建议加强团队协作与项目管理能力的培养。</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">暂无评审意见</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                {selectedProcess === "" ? (
                  <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white">
                    发起评审流程
                  </Button>
                ) : (
                  <>
                    <Button variant="outline">
                      查看详细流程
                    </Button>
                    <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white">
                      进入下一阶段
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* 流程记录 */}
            {selectedProcess !== "" && (
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">流程记录</h3>
                <div className="space-y-3">
                  {selectedProcess === "资料填写中" && (
                    <div className="p-3 border border-gray-200 rounded-md bg-white">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">流程发起</span>
                        <span className="text-sm text-gray-500">{new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">评审流程已成功发起，请申请人完善资料填写。</p>
                    </div>
                  )}
                  
                  {selectedProcess !== "资料填写中" && (
                  <div className="p-3 border border-gray-200 rounded-md bg-white">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">资料审核</span>
                      <span className="text-sm text-gray-500">2023-10-15 14:30</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">提交的资料齐全，符合申请条件。</p>
                  </div>
                  )}
                  
                  {selectedProcess === "技术评审中" && (
                    <div className="p-3 border border-gray-200 rounded-md bg-white">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">技术评审</span>
                        <span className="text-sm text-gray-500">2023-10-20 10:15</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">技术答辩表现良好，对问题的解答思路清晰。</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 确认发起评审对话框 */}
      {showReviewConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 max-w-md">
            {reviewSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">评审流程已发起</h3>
                <p className="text-sm text-gray-500">已成功发起评审流程</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">确认发起评审流程</h3>
                  <p className="text-sm text-gray-500">确认对于勾选人员发起评审流程吗？</p>
                  <div className="mt-3 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded text-sm">
                    {employeeData
                      .filter(emp => employeesToReview.includes(emp.id))
                      .map((emp, index) => (
                        <div key={index} className="py-1">{emp.name}</div>
                      ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewConfirmDialog(false)}
                    className="text-xs h-8"
                  >
                    取消
                  </Button>
                  <Button 
                    className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                    onClick={handleConfirmReview}
                  >
                    确认发起
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 任职资格标准详情弹窗 */}
      {showStandardDetail && selectedStandard && (
        <Dialog open={showStandardDetail} onOpenChange={setShowStandardDetail}>
          <DialogContent className="bg-white max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">{selectedStandard?.title}</DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-[#3C5E5C]">{selectedStandard?.type}</Badge>
                <span className="text-sm text-gray-500">更新于: {selectedStandard?.updateDate}</span>
              </div>
              <DialogDescription className="mt-2">
                {selectedStandard?.description}
              </DialogDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => editStandardDetail(selectedStandard)}
                  className="text-[#3C5E5C] border-[#3C5E5C] hover:bg-[#3C5E5C] hover:text-white ml-4"
                >
                  编辑
                </Button>
              </div>
            </DialogHeader>
            <Tabs defaultValue="knowledge" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger 
                  value="knowledge"
                  className="data-[state=active]:bg-[#f8fbfc]"
                >
                  知识技能
                </TabsTrigger>
                <TabsTrigger 
                  value="abilities"
                  className="data-[state=active]:bg-[#f8fbfc]"
                >
                  关键能力
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback"
                  className="data-[state=active]:bg-[#f8fbfc]"
                >
                  组织回馈
                </TabsTrigger>
              </TabsList>
              <TabsContent value="knowledge" className="mt-4 max-h-[50vh] overflow-y-auto pr-2 bg-white border rounded-md p-4">
                {selectedStandard?.knowledge && selectedStandard.knowledge.length > 0 ? (
                  <div className="space-y-4">
                    {/* 系统分析 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">系统分析</h3>
                      <div className="space-y-2">
                        {selectedStandard.knowledge
                          .filter(item => item.category === "系统分析")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 软件开发 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">软件开发</h3>
                      <div className="space-y-2">
                        {selectedStandard.knowledge
                          .filter(item => item.category === "软件开发")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 应用实施 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">应用实施</h3>
                      <div className="space-y-2">
                        {selectedStandard.knowledge
                          .filter(item => item.category === "应用实施")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 测试验证 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">测试验证</h3>
                      <div className="space-y-2">
                        {selectedStandard.knowledge
                          .filter(item => item.category === "测试验证")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 项目管理 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">项目管理</h3>
                      <div className="space-y-2">
                        {selectedStandard.knowledge
                          .filter(item => item.category === "项目管理")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">暂无知识技能数据</div>
                )}
              </TabsContent>
              <TabsContent value="abilities" className="mt-4 max-h-[50vh] overflow-y-auto pr-2 bg-white border rounded-md p-4">
                {selectedStandard?.abilities && selectedStandard.abilities.length > 0 ? (
                  <div className="space-y-4">
                    {/* 战略规划 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">战略规划</h3>
                      <div className="space-y-2">
                        {selectedStandard.abilities
                          .filter(item => item.category === "战略规划")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 架构/方案设计 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">架构/方案设计</h3>
                      <div className="space-y-2">
                        {selectedStandard.abilities
                          .filter(item => item.category === "架构/方案设计")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 方案实施/落地 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">方案实施/落地</h3>
                      <div className="space-y-2">
                        {selectedStandard.abilities
                          .filter(item => item.category === "方案实施/落地")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 运维/运营 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">运维/运营</h3>
                      <div className="space-y-2">
                        {selectedStandard.abilities
                          .filter(item => item.category === "运维/运营")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 问题解决与优化 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">问题解决与优化</h3>
                      <div className="space-y-2">
                        {selectedStandard.abilities
                          .filter(item => item.category === "问题解决与优化")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">暂无关键能力数据</div>
                )}
              </TabsContent>
              <TabsContent value="feedback" className="mt-4 max-h-[50vh] overflow-y-auto pr-2 bg-white border rounded-md p-4">
                {selectedStandard?.feedback && selectedStandard.feedback.length > 0 ? (
                  <div className="space-y-4">
                    {/* 知识传承 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">知识传承</h3>
                      <div className="space-y-2">
                        {selectedStandard.feedback
                          .filter(item => item.category === "知识传承")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.date}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">{item.content}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 人才培养 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">人才培养</h3>
                      <div className="space-y-2">
                        {selectedStandard.feedback
                          .filter(item => item.category === "人才培养")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.date}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">{item.content}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 远景精神 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">远景精神</h3>
                      <div className="space-y-2">
                        {selectedStandard.feedback
                          .filter(item => item.category === "远景精神")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.date}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">{item.content}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* 团队建设 */}
                    <div>
                      <h3 className="font-medium text-[#3C5E5C] mb-2">团队建设</h3>
                      <div className="space-y-2">
                        {selectedStandard.feedback
                          .filter(item => item.category === "团队建设")
                          .map((item, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.date}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">{item.content}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">暂无组织回馈数据</div>
                )}
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStandardDetail(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 添加标准弹窗 */}
      <Dialog open={showAddStandardDialog} onOpenChange={setShowAddStandardDialog}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">添加任职资格标准</DialogTitle>
            <DialogDescription>
              设置新的任职资格标准，包括岗位名称、类别、方向、角色和能力要求等信息
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* 岗位名称和任职资格等级（顶部） */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">岗位名称</label>
              <Input 
                value={formData.positionName}
                onChange={(e) => updateFormData("positionName", e.target.value)}
                placeholder="输入岗位名称..." 
                className="w-full"
              />
              <p className="text-xs text-gray-500">请输入符合公司规范的岗位名称</p>
            </div>
            
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">任职资格等级</label>
                <Select value={formData.qualificationLevel} onValueChange={(value) => updateFormData("qualificationLevel", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择任职资格等级" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 类、子类、职务、方向和角色选择（中部） */}
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">类</label>
                <Select value={formData.category} onValueChange={(value) => {
                  updateFormData("category", value);
                  updateFormData("subClass", ""); // 重置子类选择
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择类" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">子类</label>
                <Select 
                  value={formData.subClass} 
                  onValueChange={(value) => updateFormData("subClass", value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择子类" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && subClassOptions[formData.category]?.map(subClass => (
                      <SelectItem key={subClass} value={subClass}>{subClass}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">职务</label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => updateFormData("position", value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择职务" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && positionOptions[formData.category]?.map(position => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">方向</label>
                <Select 
                  value={formData.direction} 
                  onValueChange={(value) => updateFormData("direction", value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择方向" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && directionOptions[formData.category]?.map(direction => (
                      <SelectItem key={direction} value={direction}>{direction}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">横向角色</label>
                <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {standardRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 添加标准内容区域 */}
            <div className="mt-4">
              <Tabs defaultValue="knowledge" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger 
                    value="knowledge" 
                    className="data-[state=active]:bg-[#f8fbfc]"
                  >
                    知识技能要求
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ability"
                    className="data-[state=active]:bg-[#f8fbfc]"
                  >
                    关键能力要求
                  </TabsTrigger>
                  <TabsTrigger 
                    value="feedback"
                    className="data-[state=active]:bg-[#f8fbfc]"
                  >
                    组织回馈要求
                  </TabsTrigger>
                </TabsList>
                
                {/* 知识技能要求 Tab */}
                <TabsContent value="knowledge" className="space-y-4 py-4 bg-white border rounded-md p-4">
                  <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">选择该岗位所需的知识技能要求，可多选</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowAddStandardDialog(false);
                        setShowKnowledgeLibrary(true);
                      }}
                      className="text-[#3C5E5C] border-[#3C5E5C] hover:bg-[#3C5E5C] hover:text-white"
                    >
                      从库里选择
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {Object.entries(knowledgeSkillTags).map(([category, tags]) => (
                      <div key={category} className="border rounded-md p-4">
                        <h4 className="font-medium text-[#3C5E5C] mb-3">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tags.map(tag => (
                            <div
                              key={tag.id}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedKnowledgeTags.includes(tag.id)
                                  ? "border-[#3C5E5C] bg-[#3C5E5C]/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => toggleKnowledgeTag(tag.id)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{tag.name}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  selectedKnowledgeTags.includes(tag.id)
                                    ? "bg-[#3C5E5C] text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {tag.level}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* 关键能力要求 Tab */}
                <TabsContent value="ability" className="space-y-4 py-4 bg-white border rounded-md p-4">
                  <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">选择该岗位所需的关键能力要求，可多选</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowAddStandardDialog(false);
                        setShowAbilityLibrary(true);
                      }}
                      className="text-[#3C5E5C] border-[#3C5E5C] hover:bg-[#3C5E5C] hover:text-white"
                    >
                      从库里选择
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {Object.entries(keyAbilityTags).map(([category, tags]) => (
                      <div key={category} className="border rounded-md p-4">
                        <h4 className="font-medium text-[#3C5E5C] mb-3">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tags.map(tag => (
                            <div
                              key={tag.id}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedKeyAbilityTags.includes(tag.id)
                                  ? "border-[#3C5E5C] bg-[#3C5E5C]/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => toggleKeyAbilityTag(tag.id)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{tag.name}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  selectedKeyAbilityTags.includes(tag.id)
                                    ? "bg-[#3C5E5C] text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {tag.level}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* 组织回馈要求 Tab */}
                <TabsContent value="feedback" className="space-y-4 py-4 bg-white border rounded-md p-4">
                  <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">选择该岗位所需的组织回馈要求，可多选</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowAddStandardDialog(false);
                        setShowFeedbackLibrary(true);
                      }}
                      className="text-[#3C5E5C] border-[#3C5E5C] hover:bg-[#3C5E5C] hover:text-white"
                    >
                      从库里选择
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {Object.entries(organizationFeedbackTags).map(([category, tags]) => (
                      <div key={category} className="border rounded-md p-4">
                        <h4 className="font-medium text-[#3C5E5C] mb-3">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tags.map(tag => (
                            <div
                              key={tag.id}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedOrgTags.includes(tag.id)
                                  ? "border-[#3C5E5C] bg-[#3C5E5C]/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => toggleOrgTag(tag.id)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{tag.name}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  selectedOrgTags.includes(tag.id)
                                    ? "bg-[#3C5E5C] text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {tag.level}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAddStandardDialog(false)}>取消</Button>
            <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white">保存标准</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 上传标准弹窗 */}
      <Dialog open={showUploadStandardDialog} onOpenChange={setShowUploadStandardDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>上传任职资格标准</DialogTitle>
            <DialogDescription>
              请选择符合模板格式的Excel文件进行上传，系统将自动解析任职资格标准数据。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!uploadSuccess ? (
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="standard-file-upload"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="standard-file-upload"
                    className="cursor-pointer text-sm text-[#3C5E5C] hover:text-[#2A4A48]"
                  >
                    {uploadFile ? (
                      <span className="flex flex-col items-center">
                        <svg className="w-10 h-10 mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">{uploadFile.name}</span>
                        <span className="text-xs text-gray-500 mt-1">文件已选择</span>
                      </span>
                    ) : (
                      <span className="flex flex-col items-center">
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span className="font-medium">点击选择文件</span>
                        <span className="text-xs text-gray-500 mt-1">支持 .xlsx, .xls, .csv 格式</span>
                      </span>
                    )}
                  </label>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">上传说明：</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>请使用标准模板格式的Excel文件</li>
                        <li>确保包含类、子类、方向、职务、岗位编码等必填字段</li>
                        <li>知识技能要求、关键能力要求、组织回馈要求可为空</li>
                        <li>系统将自动解析并验证数据格式</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">上传成功!</h3>
                <p className="text-sm text-gray-600">
                  任职资格标准数据已成功解析并导入，请在标准列表中查看。
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {!uploadSuccess && (
              <>
                <Button variant="outline" onClick={() => setShowUploadStandardDialog(false)}>
                  取消
                </Button>
                <Button
                  onClick={handleUploadConfirm}
                  disabled={!uploadFile}
                  className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                >
                  确认上传
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 知识技能库选择弹窗 */}
      <Dialog open={showKnowledgeLibrary} onOpenChange={setShowKnowledgeLibrary}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowKnowledgeLibrary(false);
                  setShowAddStandardDialog(true);
                }}
                className="p-1 h-8 w-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
              <div>
                <DialogTitle>从知识技能库选择</DialogTitle>
                <DialogDescription>
                  请从下方列表中选择该岗位所需的知识技能要求，支持多选。
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-0">
            {Object.entries(knowledgeLibraryData).map(([category, items]) => (
              <div key={category} className="border rounded-md p-4">
                <h4 className="font-medium text-[#3C5E5C] mb-3 flex items-center">
                  <span>{category}</span>
                  <span className="ml-2 text-xs text-gray-500">({items.length}项)</span>
                </h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={`${category}-${index}`} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`knowledge-${category}-${index}`}
                        checked={selectedKnowledgeLibraryItems.includes(`${category}-${index}`)}
                        onChange={() => toggleKnowledgeLibraryItem(`${category}-${index}`, item)}
                        className="mt-1 h-4 w-4 text-[#3C5E5C] border-gray-300 rounded focus:ring-[#3C5E5C]"
                      />
                      <label htmlFor={`knowledge-${category}-${index}`} className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {item.level}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => {
              setShowKnowledgeLibrary(false);
              setShowAddStandardDialog(true);
            }}>返回</Button>
            <Button 
              className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
              onClick={() => {
                // 这里处理选中的知识技能项
                setShowKnowledgeLibrary(false);
                setShowAddStandardDialog(true);
              }}
            >
              确认选择 ({selectedKnowledgeLibraryItems.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 关键能力库选择弹窗 */}
      <Dialog open={showAbilityLibrary} onOpenChange={setShowAbilityLibrary}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAbilityLibrary(false);
                  setShowAddStandardDialog(true);
                }}
                className="p-1 h-8 w-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
              <div>
                <DialogTitle>从关键能力库选择</DialogTitle>
                <DialogDescription>
                  请从下方列表中选择该岗位所需的关键能力要求，支持多选。
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-0">
            {Object.entries(abilityLibraryData).map(([category, items]) => (
              <div key={category} className="border rounded-md p-4">
                <h4 className="font-medium text-[#3C5E5C] mb-3 flex items-center">
                  <span>{category}</span>
                  <span className="ml-2 text-xs text-gray-500">({items.length}项)</span>
                </h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={`${category}-${index}`} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`ability-${category}-${index}`}
                        checked={selectedAbilityLibraryItems.includes(`${category}-${index}`)}
                        onChange={() => toggleAbilityLibraryItem(`${category}-${index}`, item)}
                        className="mt-1 h-4 w-4 text-[#3C5E5C] border-gray-300 rounded focus:ring-[#3C5E5C]"
                      />
                      <label htmlFor={`ability-${category}-${index}`} className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            {item.level}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => {
              setShowAbilityLibrary(false);
              setShowAddStandardDialog(true);
            }}>返回</Button>
            <Button 
              className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
              onClick={() => {
                // 这里处理选中的关键能力项
                setShowAbilityLibrary(false);
                setShowAddStandardDialog(true);
              }}
            >
              确认选择 ({selectedAbilityLibraryItems.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 组织回馈库选择弹窗 */}
      <Dialog open={showFeedbackLibrary} onOpenChange={setShowFeedbackLibrary}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowFeedbackLibrary(false);
                  setShowAddStandardDialog(true);
                }}
                className="p-1 h-8 w-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
              <div>
                <DialogTitle>从组织回馈库选择</DialogTitle>
                <DialogDescription>
                  请从下方列表中选择该岗位所需的组织回馈要求，支持多选。
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-0">
            {Object.entries(feedbackLibraryData).map(([category, items]) => (
              <div key={category} className="border rounded-md p-4">
                <h4 className="font-medium text-[#3C5E5C] mb-3 flex items-center">
                  <span>{category}</span>
                  <span className="ml-2 text-xs text-gray-500">({items.length}项)</span>
                </h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={`${category}-${index}`} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`feedback-${category}-${index}`}
                        checked={selectedFeedbackLibraryItems.includes(`${category}-${index}`)}
                        onChange={() => toggleFeedbackLibraryItem(`${category}-${index}`, item)}
                        className="mt-1 h-4 w-4 text-[#3C5E5C] border-gray-300 rounded focus:ring-[#3C5E5C]"
                      />
                      <label htmlFor={`feedback-${category}-${index}`} className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            {item.level}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => {
              setShowFeedbackLibrary(false);
              setShowAddStandardDialog(true);
            }}>返回</Button>
            <Button 
              className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
              onClick={() => {
                // 这里处理选中的组织回馈项
                setShowFeedbackLibrary(false);
                setShowAddStandardDialog(true);
              }}
            >
              确认选择 ({selectedFeedbackLibraryItems.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑标准弹窗 */}
      <Dialog open={showEditStandardDialog} onOpenChange={setShowEditStandardDialog}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">编辑任职资格标准</DialogTitle>
            <DialogDescription>
              修改任职资格标准信息，包括岗位名称、类别、方向、角色和能力要求等
            </DialogDescription>
          </DialogHeader>
          
          {editingStandard && (
            <div className="space-y-6 mt-4">
              {/* 岗位名称和任职资格等级（顶部） */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">岗位名称</label>
                  <Input 
                    defaultValue={editingStandard.title}
                    placeholder="输入岗位名称..." 
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">请输入符合公司规范的岗位名称</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">任职资格等级</label>
                  <Select defaultValue={editingStandard.level || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择任职资格等级" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* 类、子类、职务、方向和角色选择（中部） */}
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">类</label>
                  <Select defaultValue={editingStandard.category || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择类" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">子类</label>
                  <Select defaultValue={editingStandard.subClass || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择子类" />
                    </SelectTrigger>
                    <SelectContent>
                      {editingStandard.category && subClassOptions[editingStandard.category]?.map(subClass => (
                        <SelectItem key={subClass} value={subClass}>{subClass}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">职务</label>
                  <Select defaultValue={editingStandard.position || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择职务" />
                    </SelectTrigger>
                    <SelectContent>
                      {editingStandard.category && positionOptions[editingStandard.category]?.map(position => (
                        <SelectItem key={position} value={position}>{position}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">方向</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择方向" />
                    </SelectTrigger>
                    <SelectContent>
                      {editingStandard.category && directionOptions[editingStandard.category]?.map(direction => (
                        <SelectItem key={direction} value={direction}>{direction}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">横向角色</label>
                  <Select defaultValue={editingStandard.role || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* 描述 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">标准描述</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-md resize-none" 
                  rows={3}
                  defaultValue={editingStandard.description}
                  placeholder="请输入任职资格标准的详细描述..."
                />
              </div>
              
              {/* 编辑标准内容区域 */}
              <div className="mt-4">
                <Tabs defaultValue="knowledge" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger 
                      value="knowledge" 
                      className="data-[state=active]:bg-[#f8fbfc]"
                    >
                      知识技能要求
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ability"
                      className="data-[state=active]:bg-[#f8fbfc]"
                    >
                      关键能力要求
                    </TabsTrigger>
                    <TabsTrigger 
                      value="feedback"
                      className="data-[state=active]:bg-[#f8fbfc]"
                    >
                      组织回馈要求
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="knowledge" className="space-y-4 py-4 bg-white border rounded-md p-4">
                    <div className="text-sm text-gray-600">
                      当前已设置的知识技能要求：
                    </div>
                    {editingStandard.knowledge && editingStandard.knowledge.length > 0 ? (
                      <div className="space-y-2">
                        {editingStandard.knowledge.map((item, index) => (
                          <div key={index} className="p-3 border rounded-md bg-gray-50">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">暂无知识技能要求</div>
                    )}
                    <Button variant="outline" size="sm" className="text-[#3C5E5C] border-[#3C5E5C]">
                      添加/修改知识技能要求
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="ability" className="space-y-4 py-4 bg-white border rounded-md p-4">
                    <div className="text-sm text-gray-600">
                      当前已设置的关键能力要求：
                    </div>
                    {editingStandard.abilities && editingStandard.abilities.length > 0 ? (
                      <div className="space-y-2">
                        {editingStandard.abilities.map((item, index) => (
                          <div key={index} className="p-3 border rounded-md bg-gray-50">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">暂无关键能力要求</div>
                    )}
                    <Button variant="outline" size="sm" className="text-[#3C5E5C] border-[#3C5E5C]">
                      添加/修改关键能力要求
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="feedback" className="space-y-4 py-4 bg-white border rounded-md p-4">
                    <div className="text-sm text-gray-600">
                      当前已设置的组织回馈要求：
                    </div>
                    {editingStandard.feedback && editingStandard.feedback.length > 0 ? (
                      <div className="space-y-2">
                        {editingStandard.feedback.map((item, index) => (
                          <div key={index} className="p-3 border rounded-md bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.date}</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">{item.content}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">暂无组织回馈要求</div>
                    )}
                    <Button variant="outline" size="sm" className="text-[#3C5E5C] border-[#3C5E5C]">
                      添加/修改组织回馈要求
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowEditStandardDialog(false)}>取消</Button>
            <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white">保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 单个员工发起评审流程二次确认弹窗 */}
      {showSingleReviewConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 max-w-md">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">确认发起评审流程</h3>
              <p className="text-sm text-gray-500 mb-3">
                确认要针对员工 <span className="font-medium text-gray-700">{selectedEmployeeForReview?.name}</span> 发起评审流程吗？
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={selectedEmployeeForReview?.avatar} alt="员工头像" className="h-10 w-10 object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{selectedEmployeeForReview?.name}</div>
                    <div className="text-sm text-gray-500">{selectedEmployeeForReview?.position} - {selectedEmployeeForReview?.department}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowSingleReviewConfirm(false)}
                className="text-xs h-8"
              >
                取消
              </Button>
              <Button 
                className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                onClick={handleSingleReviewConfirm}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 流程批量操作二次确认弹窗 */}
      {showProcessBatchConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 max-w-md">
            {processBatchSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">批量评审流程已发起</h3>
                <p className="text-sm text-gray-500">已成功为 {selectedProcesses.length} 个流程发起批量评审</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">确认发起批量评审</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    确认要为选中的 <span className="font-medium text-gray-700">{selectedProcesses.length}</span> 个流程发起批量评审吗？
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProcessBatchConfirm(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                    size="sm"
                    onClick={handleProcessBatchConfirm}
                  >
                    确定
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 