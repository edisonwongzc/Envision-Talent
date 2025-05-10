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
  knowledge: KnowledgeItem[];
  abilities: AbilityItem[];
  feedback: FeedbackItem[];
}

/**
 * 任职资格管理页面组件
 * @return {React.ReactElement} 任职资格管理页面
 */
export default function QualificationManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSequence, setSelectedSequence] = useState("");
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
    type: "",
    department: "",
    reviewer: "",
    date: ""
  });

  // 添加评审流程相关状态变量
  const [showReviewSelectionMode, setShowReviewSelectionMode] = useState(false);
  const [employeesToReview, setEmployeesToReview] = useState<string[]>([]);
  const [showReviewConfirmDialog, setShowReviewConfirmDialog] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // 模拟数据
  const sequences = ["技术类", "产品类", "管理类"];
  const positions = ["工程师", "产品经理", "项目经理", "架构师"];
  const roles = ["开发", "测试", "运维", "产品", "项目管理"];
  const levels = ["P3", "P4", "P5", "P6", "P7"];
  
  // 模拟员工详情数据
  const employeeData = [
    {
      id: "EMP001",
      name: "李十三",
      avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60",
      sequence: "技术序列",
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
      ]
    },
    {
      id: "EMP031",
      name: "赵六",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
      sequence: "产品序列",
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
      processStatus: "资料审核中", // 流程状态
      reviewHistory: [
        { date: "2022-06-20", level: "P4", result: "通过", evaluator: "产品评审委员会" },
        { date: "2020-05-18", level: "P3", result: "通过", evaluator: "部门评审小组" }
      ]
    },
    {
      id: "EMP015",
      name: "吴十",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
      sequence: "技术序列",
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
      processStatus: "", // 空表示未开始流程
      reviewHistory: [
        { date: "2022-03-10", level: "P3", result: "通过", evaluator: "部门评审小组" }
      ]
    }
  ];

  // 模拟流程数据
  const processList = [
    {
      id: "PROC001",
      name: "2023年上半年技术序列P4认证",
      status: "进行中",
      type: "定期评审",
      department: "研发部",
      createDate: "2023-05-01",
      deadline: "2023-07-15",
      reviewer: "技术委员会",
      candidateCount: 12
    },
    {
      id: "PROC002",
      name: "2023年Q2产品经理晋升评审",
      status: "已完成",
      type: "晋升评审",
      department: "产品部",
      createDate: "2023-04-10",
      deadline: "2023-06-30",
      reviewer: "产品委员会",
      candidateCount: 8
    },
    {
      id: "PROC003",
      name: "2023年新入职P3认证",
      status: "进行中",
      type: "入职认证",
      department: "研发部",
      createDate: "2023-06-15",
      deadline: "2023-08-15",
      reviewer: "部门主管",
      candidateCount: 15
    },
    {
      id: "PROC004",
      name: "2023年上半年项目经理认证",
      status: "计划中",
      type: "定期评审",
      department: "项目管理部",
      createDate: "2023-06-20",
      deadline: "2023-09-01",
      reviewer: "管理委员会",
      candidateCount: 6
    },
    {
      id: "PROC005",
      name: "2023年Q2设计师P5晋升",
      status: "进行中",
      type: "晋升评审",
      department: "设计部",
      createDate: "2023-05-15",
      deadline: "2023-07-30",
      reviewer: "设计委员会",
      candidateCount: 4
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
    setSelectedSequence("");
    setSelectedPosition("");
    setSelectedRole("");
    setSelectedLevel("");
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
    setSelectedProcess(processStatus || "发起评审流程");
    setShowProcessDetail(true);
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

  // 添加标准相关状态
  const [showAddStandardDialog, setShowAddStandardDialog] = useState(false);
  const [standardNavTab, setStandardNavTab] = useState<string>("category");
  const [standardContentTab, setStandardContentTab] = useState<string>("skills");
  
  // 添加标准选项
  const standardCategories = ["技术类", "产品类", "管理类", "设计类", "市场类"];
  const standardDirections = ["前端", "后端", "全栈", "移动端", "数据", "算法", "运维"];
  const standardRoles = ["开发", "测试", "运维", "产品", "设计", "项目管理"];
  
  // 表单状态
  const [formData, setFormData] = useState({
    category: "",
    direction: "",
    role: "",
    positionName: "",
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
              <Button 
                className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                onClick={() => setShowAddStandardDialog(true)}
              >
                <PlusIcon size={14} className="mr-1" />
                添加标准
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {/* 搜索和筛选区域 */}
              <div className="mb-6 flex items-center space-x-2">
                <div className="relative w-64">
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
                
                <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <SelectValue placeholder="岗位序列" className="text-sm" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {sequences.map((sequence) => (
                      <SelectItem key={sequence} value={sequence} className="text-sm">
                        {sequence}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <SelectValue placeholder="岗位名称" className="text-sm" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position} className="text-sm">
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <SelectValue placeholder="横向角色" className="text-sm" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role} className="text-sm">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      <SelectValue placeholder="级别筛选" className="text-sm" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level} className="text-sm">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
                
              {/* 标准列表 */}
              <div className="space-y-0 divide-y divide-gray-200">
                <div className="py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-800">P5 高级工程师</h3>
                      <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-md">技术类</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-1.5">需要5年以上相关经验，具备系统设计能力和团队协作领导力</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">更新于: 2023-06-05</div>
                      <div>
                        <Button size="sm" variant="ghost" className="text-sm h-6 text-[#3C5E5C]"
                          onClick={() => viewStandardDetail({
                            id: "std-001", // 添加id属性
                            title: "P5 高级工程师",
                            type: "技术类",
                            description: "需要5年以上相关经验，具备系统设计能力和团队协作领导力",
                            updateDate: "2023-06-05",
                            knowledge: [
                              { name: "系统设计", description: "能够设计复杂系统架构，并考虑性能、可扩展性和可维护性", category: "系统分析" },
                              { name: "代码质量", description: "能够编写高质量、可维护的代码，并进行代码审查", category: "软件开发" },
                              { name: "技术选型", description: "能够为项目选择合适的技术栈和工具", category: "架构/方案设计" },
                              { name: "测试规范", description: "能够制定测试规范并指导团队成员执行", category: "测试验证" },
                              { name: "资源规划", description: "能够合理规划项目资源并进行风险管理", category: "项目管理" },
                              { name: "应用部署", description: "熟悉不同环境下的应用部署与配置管理", category: "应用实施" }
                            ],
                            abilities: [
                              { name: "问题解决", description: "能够分析并解决复杂技术问题", category: "问题解决与优化" },
                              { name: "团队协作", description: "能够有效地与团队成员协作，共同完成项目目标", category: "方案实施/落地" },
                              { name: "沟通能力", description: "能够清晰地表达技术概念和方案", category: "方案实施/落地" },
                              { name: "技术规划", description: "能够制定中长期技术规划并推动实施", category: "战略规划" },
                              { name: "系统监控", description: "能够设计与实施系统监控与告警机制", category: "运维/运营" }
                            ],
                            feedback: [
                              { name: "技术评审委员会", date: "2023-05-15", content: "技术能力突出，在系统架构和性能优化方面表现尤为突出", category: "知识传承" },
                              { name: "研发部门主管", date: "2023-05-10", content: "具备良好的团队协作和问题解决能力，能够带领团队完成复杂项目", category: "团队建设" },
                              { name: "人力资源部", date: "2023-05-05", content: "积极参与新员工培训与指导，得到团队成员一致好评", category: "人才培养" },
                              { name: "产品部门", date: "2023-04-28", content: "展现了远景公司的创新精神与客户导向价值观", category: "远景精神" }
                            ]
                          })}
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 复制上面的模板，为其他职级添加查看详情功能 */}
                <div className="py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-800">P4 工程师</h3>
                      <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-md">技术类</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-1.5">需要3年以上相关经验，能够独立完成开发任务和技术问题排查</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">更新于: 2023-05-20</div>
                      <div>
                        <Button size="sm" variant="ghost" className="text-sm h-6 text-[#3C5E5C]"
                          onClick={() => viewStandardDetail({
                            id: "std-002", // 添加id属性
                            title: "P4 工程师",
                            type: "技术类",
                            description: "需要3年以上相关经验，能够独立完成开发任务和技术问题排查",
                            updateDate: "2023-05-20",
                            knowledge: [
                              { name: "编程技能", description: "熟练掌握相关编程语言和框架", category: "软件开发" },
                              { name: "调试能力", description: "能够独立排查和解决常见技术问题", category: "问题解决与优化" },
                              { name: "测试方法", description: "了解并实践单元测试和集成测试", category: "测试验证" },
                              { name: "需求分析", description: "能够理解业务需求并转化为技术实现", category: "系统分析" },
                              { name: "部署流程", description: "熟悉应用的部署流程和基本配置", category: "应用实施" }
                            ],
                            abilities: [
                              { name: "独立开发", description: "能够独立完成开发任务", category: "方案实施/落地" },
                              { name: "学习能力", description: "能够快速学习新技术和适应新环境", category: "问题解决与优化" },
                              { name: "时间管理", description: "能够合理规划和管理任务时间", category: "项目管理" },
                              { name: "基础架构", description: "了解基本的系统架构原则", category: "架构/方案设计" },
                              { name: "日常运维", description: "能够处理基本的运维任务", category: "运维/运营" }
                            ],
                            feedback: [
                              { name: "技术评审委员会", date: "2023-04-20", content: "技术基础扎实，能够独立完成开发任务", category: "知识传承" },
                              { name: "项目经理", date: "2023-04-15", content: "工作态度积极，能够按时完成任务，质量良好", category: "团队建设" },
                              { name: "资深工程师", date: "2023-04-10", content: "积极参与技术分享，乐于助人", category: "人才培养" },
                              { name: "团队负责人", date: "2023-04-05", content: "具有公司的核心价值观，关注用户体验", category: "远景精神" }
                            ]
                          })}
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 继续为其他职级添加查看详情功能... */}
                
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
                      <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">
                        头像
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                        申请人工号
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                        申请人姓名
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">
                        近三年挑战级别
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">
                        近三年绩效结果
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">
                        近三年远景精神
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-36">
                        当前职级认证时间
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                        当前技术职级
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                        流程状态
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeData.map((employee) => (
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
                            <img src={employee.avatar} alt={`${employee.name}头像`} className="h-10 w-10 object-cover" />
                  </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.challengeLevels ? employee.challengeLevels.join('/') : ''}
                          </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.performanceResults ? employee.performanceResults.join('/') : ''}
                          </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.visionScores ? employee.visionScores.join('/') : ''}
                </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.certificationDate}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.currentLevel}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                            onClick={() => enterProcess(employee.id, employee.processStatus)}
                          >
                            {employee.processStatus || "发起评审流程"}
                          </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-left">
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                            onClick={() => viewEmployeeDetail(employee.id)}
                          >
                            查看个人详情
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
              <div className="flex items-center gap-2">
                <Button 
                  className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                  onClick={startBatchReview}
                  disabled={selectedProcesses.length === 0}
                >
                  批量发起评审 ({selectedProcesses.length})
                </Button>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                  <PlusIcon size={14} className="mr-1" />
                  创建流程
                </Button>
                  </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* 筛选区域 */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Input 
                      placeholder="输入流程名称..." 
                      value={processFilters.name}
                      onChange={(e) => handleProcessFilterChange('name', e.target.value)}
                      className="h-9 text-sm pl-3 pr-8 py-1 border-gray-200"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <Select 
                    value={processFilters.status} 
                    onValueChange={(value) => handleProcessFilterChange('status', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <SelectValue placeholder="流程状态" className="text-sm" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="进行中" className="text-sm">进行中</SelectItem>
                      <SelectItem value="已完成" className="text-sm">已完成</SelectItem>
                      <SelectItem value="计划中" className="text-sm">计划中</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.type} 
                    onValueChange={(value) => handleProcessFilterChange('type', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <SelectValue placeholder="流程类型" className="text-sm" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="定期评审" className="text-sm">定期评审</SelectItem>
                      <SelectItem value="晋升评审" className="text-sm">晋升评审</SelectItem>
                      <SelectItem value="入职认证" className="text-sm">入职认证</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={processFilters.department}
                    onValueChange={(value) => handleProcessFilterChange('department', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <SelectValue placeholder="所属部门" className="text-sm" />
                      </div>
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
                    value={processFilters.reviewer}
                    onValueChange={(value) => handleProcessFilterChange('reviewer', value)}
                  >
                    <SelectTrigger className="w-auto h-9 text-sm border-gray-200 px-3 py-1">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <SelectValue placeholder="评审组织" className="text-sm" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">全部</SelectItem>
                      <SelectItem value="技术委员会" className="text-sm">技术委员会</SelectItem>
                      <SelectItem value="产品委员会" className="text-sm">产品委员会</SelectItem>
                      <SelectItem value="设计委员会" className="text-sm">设计委员会</SelectItem>
                      <SelectItem value="管理委员会" className="text-sm">管理委员会</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 text-sm"
                    onClick={() => {
                      // 重置所有筛选条件
                      setProcessFilters({
                        name: "",
                        status: "",
                        type: "",
                        department: "",
                        reviewer: "",
                        date: ""
                      });
                    }}
                  >
                    重置
                  </Button>
                </div>
              </div>
              
              {/* 流程列表表格 */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-[1200px] w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">流程名称</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属部门</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止时间</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评审组织</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参与人数</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processList.map((process) => (
                      <tr key={process.id} className="hover:bg-gray-50">
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
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{process.name}</div>
                      </td>
                        <td className="px-3 py-3 whitespace-nowrap">
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
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.type}</div>
                      </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.department}</div>
                      </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.createDate}</div>
                      </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.deadline}</div>
                      </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.reviewer}</div>
                      </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.candidateCount}人</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="text-[#3C5E5C] hover:text-[#2A4A48]">查看</button>
                            <button className="text-[#3C5E5C] hover:text-[#2A4A48]">编辑</button>
                            <button className="text-[#3C5E5C] hover:text-[#2A4A48]">发起评审</button>
                          </div>
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
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">任职资格结果应用</CardTitle>
              <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                导出报告
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-[1200px] w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                          头像
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          员工姓名
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          员工ID
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          所在部门
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          当前岗位
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          认证状态
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                      </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">李十三</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">EMP001</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">研发部</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">高级工程师</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full inline-block">P5 资格认证通过</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-left">
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                            onClick={() => viewEmployeeDetail("EMP001")}
                          >
                            查看个人详情
                          </span>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                    </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">吴十</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">EMP015</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">研发部</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">工程师</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="px-2 py-1 bg-amber-100 text-amber-700 text-sm rounded-full inline-block">P4 资格认证中</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-left">
                          <span 
                            className="text-sm text-[#3C5E5C] cursor-pointer hover:underline"
                            onClick={() => viewEmployeeDetail("EMP015")}
                          >
                            查看个人详情
                          </span>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                  </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">赵六</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">EMP031</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">产品部</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">产品经理</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full inline-block">P4 资格认证未通过</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-left">
                          <span className="text-sm text-[#3C5E5C] cursor-pointer hover:underline">查看个人详情</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium" style={{color: '#3C5E5C'}}>人岗匹配分析</h3>
                    <Button variant="outline" className="text-sm h-8 text-gray-600 border-gray-300 bg-transparent">
                      筛选
                    </Button>
                  </div>
                  <div className="h-[420px] p-4 relative">
                    <div className="absolute right-6 top-6 flex flex-col gap-2 z-10">
                      <button className="w-8 h-8 rounded-md bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-md bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="h-full flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 700 400">
                        <defs>
                          <pattern id="avatar1" patternUnits="userSpaceOnUse" width="40" height="40">
                            <image href="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60" width="40" height="40" />
                          </pattern>
                          <pattern id="avatar2" patternUnits="userSpaceOnUse" width="60" height="60">
                            <image href="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" width="60" height="60" />
                          </pattern>
                          <pattern id="avatar3" patternUnits="userSpaceOnUse" width="80" height="80">
                            <image href="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" width="80" height="80" />
                          </pattern>
                        </defs>

                        {/* 背景和边框 */}
                        <rect x="60" y="20" width="600" height="340" fill="white" stroke="#E5E7EB" strokeWidth="1" />

                        {/* X轴 */}
                        <line x1="60" y1="360" x2="660" y2="360" stroke="#94A3B8" strokeWidth="1" />
                        <text x="680" y="360" fontSize="12" fill="#64748B">挑战者级别</text>
                        
                        {/* X轴刻度 */}
                        <g className="text-xs fill-gray-500">
                          <text x="100" y="380" textAnchor="middle">13</text>
                          <text x="180" y="380" textAnchor="middle">14</text>
                          <text x="260" y="380" textAnchor="middle">15</text>
                          <text x="340" y="380" textAnchor="middle">16</text>
                          <text x="420" y="380" textAnchor="middle">17</text>
                          <text x="500" y="380" textAnchor="middle">18</text>
                          <text x="580" y="380" textAnchor="middle">19+</text>
                        </g>

                        {/* Y轴 */}
                        <line x1="60" y1="20" x2="60" y2="360" stroke="#94A3B8" strokeWidth="1" />
                        <text x="30" y="10" fontSize="12" fill="#64748B">专业任职级别</text>

                        {/* Y轴刻度 */}
                        <g className="text-xs fill-gray-500">
                          <text x="40" y="340" textAnchor="end">T3</text>
                          <text x="40" y="280" textAnchor="end">T4</text>
                          <text x="40" y="220" textAnchor="end">T5</text>
                          <text x="40" y="160" textAnchor="end">T6</text>
                          <text x="40" y="100" textAnchor="end">T7</text>
                        </g>

                        {/* 网格线 */}
                        <g stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4">
                          <line x1="60" y1="340" x2="660" y2="340" />
                          <line x1="60" y1="280" x2="660" y2="280" />
                          <line x1="60" y1="220" x2="660" y2="220" />
                          <line x1="60" y1="160" x2="660" y2="160" />
                          <line x1="60" y1="100" x2="660" y2="100" />
                          
                          <line x1="100" y1="20" x2="100" y2="360" />
                          <line x1="180" y1="20" x2="180" y2="360" />
                          <line x1="260" y1="20" x2="260" y2="360" />
                          <line x1="340" y1="20" x2="340" y2="360" />
                          <line x1="420" y1="20" x2="420" y2="360" />
                          <line x1="500" y1="20" x2="500" y2="360" />
                          <line x1="580" y1="20" x2="580" y2="360" />
                        </g>

                        {/* 气泡 */}
                        <g>
                          {/* T5级别气泡组 */}
                          <circle cx="340" cy="220" r="35" fill="#ec693d" stroke="#ffffff" strokeWidth="2" />
                          <text x="340" y="220" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">12人</text>
                          
                          <circle cx="420" cy="220" r="28" fill="#6930ee" stroke="#ffffff" strokeWidth="2" />
                          <text x="420" y="220" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">8人</text>
                          
                          {/* T4级别气泡组 */}
                          <circle cx="180" cy="280" r="32" fill="#dcd152" stroke="#ffffff" strokeWidth="2" />
                          <text x="180" y="280" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">10人</text>
                          
                          <circle cx="260" cy="280" r="25" fill="#5ab049" stroke="#ffffff" strokeWidth="2" />
                          <text x="260" y="280" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">6人</text>
                          
                          {/* T6级别气泡组 */}
                          <circle cx="500" cy="160" r="30" fill="#c868b5" stroke="#ffffff" strokeWidth="2" />
                          <text x="500" y="160" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">9人</text>
                          
                          {/* T3级别气泡组 */}
                          <circle cx="340" cy="340" r="22" fill="#f1ab64" stroke="#ffffff" strokeWidth="2" />
                          <text x="340" y="340" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">5人</text>
                          
                          {/* T7级别气泡组 */}
                          <circle cx="580" cy="100" r="20" fill="#ec693d" stroke="#ffffff" strokeWidth="2" />
                          <text x="580" y="100" dy="0.3em" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12">4人</text>
                        </g>
                      </svg>
                    </div>
                  </div>
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
                      <p className="text-sm text-gray-500">岗位名称/横向角色</p>
                      <p className="text-sm font-medium">{selectedEmployee.position} / {selectedEmployee.role}</p>
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
                      <p className="text-sm text-gray-500">岗位工程部长</p>
                      <p className="text-sm font-medium">{selectedEmployee.engineeringDirector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">直接上级</p>
                      <p className="text-sm font-medium">{selectedEmployee.directManager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">团队负责人</p>
                      <p className="text-sm font-medium">{selectedEmployee.teamLeader}</p>
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
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">认证等级</th>
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
      <Dialog open={showProcessDetail} onOpenChange={setShowProcessDetail}>
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
                    <div className="w-10 h-10 rounded-full bg-[#3C5E5C] text-white flex items-center justify-center mx-auto">2</div>
                    <div className="text-sm mt-1">资料审核</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#3C5E5C] text-white flex items-center justify-center mx-auto">3</div>
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
                  <div className="h-full bg-[#3C5E5C] w-[60%]"></div>
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
                    <Input className="bg-white" defaultValue="李十三" readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请人部门</label>
                    <Input className="bg-white" defaultValue="研发部" readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请认证职级</label>
                    <Input className="bg-white" defaultValue="P6 资深工程师" readOnly />
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">认证周期</label>
                    <Input className="bg-white" defaultValue="2023年" readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前流程阶段</label>
                    <Input className="bg-white" defaultValue={selectedProcess || "发起评审流程"} readOnly />
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
                  <div className="p-3 border border-gray-200 rounded-md bg-white">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">资料审核</span>
                      <span className="text-sm text-gray-500">2023-10-15 14:30</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">提交的资料齐全，符合申请条件。</p>
                  </div>
                  
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
              <DialogTitle className="text-xl font-semibold">{selectedStandard?.title}</DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-[#3C5E5C]">{selectedStandard?.type}</Badge>
                <span className="text-sm text-gray-500">更新于: {selectedStandard?.updateDate}</span>
              </div>
              <DialogDescription className="mt-2">
                {selectedStandard?.description}
              </DialogDescription>
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
            {/* 岗位名称（顶部） */}
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
            
            {/* 类别、方向和角色选择（中部） */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">类别</label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {standardCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">方向</label>
                <Select value={formData.direction} onValueChange={(value) => updateFormData("direction", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择方向" />
                  </SelectTrigger>
                  <SelectContent>
                    {standardDirections.map(direction => (
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
                  <p className="text-sm text-gray-500">选择该岗位所需的知识技能要求，可多选</p>
                  
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
                  <p className="text-sm text-gray-500">选择该岗位所需的关键能力要求，可多选</p>
                  
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
                  <p className="text-sm text-gray-500">选择该岗位所需的组织回馈要求，可多选</p>
                  
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
    </div>
  );
} 