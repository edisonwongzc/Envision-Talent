'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, EditIcon, XIcon } from "@/components/icons/index";
import { Check as CheckIcon } from "lucide-react";
import { useState, ChangeEvent, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MatchingPage from "./matching-page";
import HorizontalComparisonModal from "./horizontal-comparison-modal";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  VisionSpiritContent,
  BasicInfoContent,
  JobMatchingContent,
  PerformanceContent,
  ReviewContent,
  JobModelContent,
  PersonalInfoContent,
  DevelopmentPlanContent,
  TeamAssessmentContent,
  TalentSummaryContent
} from './profile-detail';
import ProfileNavTabs from './components/ProfileNavTabs';

/**
 * 能力项接口定义
 * @interface AbilityItem
 * @property {number} id - 能力项ID
 * @property {string} name - 能力项名称
 */
interface AbilityItem {
  id: number;
  name: string;
  description: string;
  type: string;
  count: number;
  date: string;
  tags: string[];
  skillItems?: AbilitySkillItem[]; // 添加能力项列表
}

interface AbilitySkillItem {
  id: string;
  code: string;
  name: string;
  level?: string; // 设为可选
  description: string;
  positions: string[];
  createdAt: string;
  levelDescriptions?: { [key: string]: string };
}

interface NewAbility {
  name: string;
  description: string;
  type: string;
  tag?: string;
  code?: string;
  level?: string;
  positions?: string;
  behaviors?: string;
  levelDescriptions?: { [key: string]: string };
}

interface PositionItem {
  id: number;
  name: string;
  description: string;
  type: string;
  count: number;
  date: string;
}

/**
 * 人才标准页面组件
 * @return {React.ReactElement} 人才标准页面
 */
export default function TalentStandardsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPositions, setShowPositions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ name: string; position: string } | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showSpiritRadarModal, setShowSpiritRadarModal] = useState(false);
  const [showHorizontalComparisonModal, setShowHorizontalComparisonModal] = useState(false);
  const [showCreateAbilityDialog, setShowCreateAbilityDialog] = useState(false);
  const [showCreatePositionDialog, setShowCreatePositionDialog] = useState(false);
  const [newAbility, setNewAbility] = useState<NewAbility & { levelDescriptions?: { [key: string]: string } }>({
    name: "",
    description: "",
    type: "知识技能",
    tag: "",
    code: "",
    positions: "",
    levelDescriptions: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    }
  });
  const [newPosition, setNewPosition] = useState({
    name: "",
    description: "",
    type: "技术"
  });
  const [abilities, setAbilities] = useState<AbilityItem[]>([
    {
      id: 1,
      name: "知识技能类",
      description: "包含专业知识、技术能力、实操技能等关键能力要素",
      type: "知识技能",
      count: 15,
      date: "2025/03/31 02:54",
      tags: [],
      skillItems: [
        {
          id: "1",
          code: "K001",
          name: "财务报表分析",
          level: "T4",
          description: "能运用Python完成数据清洗和可视化分析",
          positions: ["财务岗"],
          createdAt: "2025/03/31 02:54"
        },
        {
          id: "2",
          code: "K002",
          name: "产品设计",
          level: "T3",
          description: "能根据用户需求设计产品原型",
          positions: ["产品岗"],
          createdAt: "2025/03/30 15:42"
        }
      ]
    },
    {
      id: 2,
      name: "素质类",
      description: "包含思维方式、行为特质、价值观等个人素质要素",
      type: "素质",
      count: 32,
      date: "2025/03/30 15:42",
      tags: ["专业素质", "领导力素质", "通用素质"],
      skillItems: [
        {
          id: "1",
          code: "S001",
          name: "团队协作",
          level: "T5",
          description: "能够有效地与团队成员合作完成项目",
          positions: ["所有岗位"],
          createdAt: "2025/03/29 10:28"
        }
      ]
    }
  ]);
  const [positions, setPositions] = useState<PositionItem[]>([
    {
      id: 1,
      name: "技术岗位模型",
      description: "包含技术岗位的专业能力和晋升标准",
      type: "技术",
      count: 12,
      date: "2025/03/28 14:30"
    },
    {
      id: 2,
      name: "管理岗位模型",
      description: "包含管理岗位的领导力要求和决策能力要求",
      type: "管理",
      count: 8,
      date: "2025/03/27 09:15"
    },
    {
      id: 3,
      name: "业务岗位模型",
      description: "包含业务岗位的专业技能和市场洞察能力",
      type: "业务",
      count: 10,
      date: "2025/03/26 16:45"
    }
  ]);
  const [showDownloadTemplateDialog, setShowDownloadTemplateDialog] = useState(false);
  const [templateType, setTemplateType] = useState("知识技能");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadAbilityId, setUploadAbilityId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showCreateKnowledgeDialog, setShowCreateKnowledgeDialog] = useState(false);

  // 移除之前的展开/折叠状态管理，添加选中项状态管理
  const [selectedItem, setSelectedItem] = useState<AbilitySkillItem | null>(null);
  const [showItemDetailDialog, setShowItemDetailDialog] = useState(false);

  // 独立的已选元素数组状态
  const [selectedKnowledgeItems, setSelectedKnowledgeItems] = useState<string[]>([]);
  const [selectedQualityItems, setSelectedQualityItems] = useState<string[]>([]);

  // 移除toggleItemExpand函数，添加打开详情弹窗函数
  const openItemDetail = (item: AbilitySkillItem) => {
    setSelectedItem(item);
    setShowItemDetailDialog(true);
  };

  // 保留格式化日期函数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month < 10 ? '0' + month : month}月${day < 10 ? '0' + day : day}日`;
  };

  const togglePositions = () => {
    if (selectedEmployee) return; // 如果已选择员工，则不允许操作
    setShowPositions(!showPositions);
    setShowEmployeeList(false);
  };

  const selectPosition = (position: string) => {
    if (position === "选择岗位") {
      setSelectedPosition("");
      setShowPositions(false);
      return;
    }
    setSelectedPosition(position);
    setSelectedEmployee(null);
    setShowPositions(false);
  };

  const toggleEmployeeList = () => {
    if (selectedPosition) return; // 如果已选择岗位，则不允许操作
    setShowEmployeeList(!showEmployeeList);
    setShowPositions(false);
  };

  const selectEmployee = (employee: { name: string; position: string } | null) => {
    if (!employee) {
      setSelectedEmployee(null);
      setShowEmployeeList(false);
      return;
    }
    setSelectedEmployee(employee);
    setSelectedPosition("");
    setShowEmployeeList(false);
  };

  const toggleEmployeeSelection = (employeeName: string) => {
    if (selectedEmployees.includes(employeeName)) {
      setSelectedEmployees(selectedEmployees.filter(name => name !== employeeName));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeName]);
    }
  };

  const openComparisonModal = () => {
    if (selectedEmployees.length > 0) {
      setShowComparisonModal(true);
    }
  };

  const closeComparisonModal = () => {
    setShowComparisonModal(false);
  };

  const handleCompare = () => {
    // 这里可以添加对比逻辑
    console.log("Comparing employees:", selectedEmployees);
  };

  const openHorizontalComparisonModal = () => {
    setShowHorizontalComparisonModal(true);
  };

  const closeHorizontalComparisonModal = () => {
    setShowHorizontalComparisonModal(false);
  };

  const handleCreateAbility = () => {
    const newAbilityItem: AbilityItem = {
      id: abilities.length + 1,
      name: newAbility.name,
      description: newAbility.description,
      type: newAbility.type,
      count: 0,
      date: new Date().toLocaleString(),
      tags: newAbility.tag ? [newAbility.tag] : []
    };
    setAbilities([...abilities, newAbilityItem]);
    setNewAbility({ name: "", description: "", type: "知识技能", tag: "" });
    setShowCreateAbilityDialog(false);
  };

  const handleCreatePosition = () => {
    const newPositionItem: PositionItem = {
      id: positions.length + 1,
      name: newPosition.name,
      description: newPosition.description,
      type: newPosition.type,
      count: 0,
      date: new Date().toLocaleString()
    };
    setPositions([...positions, newPositionItem]);
    setNewPosition({ name: "", description: "", type: "技术" });
    setShowCreatePositionDialog(false);
  };

  const handleDeleteAbility = (id: number) => {
    setAbilities(abilities.filter(ability => ability.id !== id));
  };

  const handleDeletePosition = (id: number) => {
    setPositions(positions.filter(position => position.id !== id));
  };

  const handleAbilityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAbility(prev => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPosition(prev => ({ ...prev, [name]: value }));
  };

  // 修改创建能力项函数
  const handleCreateAbilityItem = (abilityId: number) => {
    const ability = abilities.find(a => a.id === abilityId);
    if (!ability) return;

    // 创建新的能力项
    const newSkillItem: AbilitySkillItem = {
      id: Date.now().toString(),
      code: newAbility.code || "",
      name: newAbility.name,
      description: '',
      positions: newAbility.positions ? newAbility.positions.split(',').map(p => p.trim()) : [],
      createdAt: new Date().toLocaleString(),
      levelDescriptions: newAbility.levelDescriptions
    };

    // 更新能力库
    const updatedAbilities = abilities.map(a => {
      if (a.id === abilityId) {
        // 添加新能力项并增加计数
        return {
          ...a,
          count: a.count + 1,
          skillItems: [...(a.skillItems || []), newSkillItem]
        };
      }
      return a;
    });

    setAbilities(updatedAbilities);

    // 显示成功信息
    alert(`成功创建${ability.type}能力项: ${newAbility.name}`);

    // 创建完成后重置表单
    setNewAbility({
      name: "",
      description: "",
      type: ability.type,
      tag: "",
      code: "",
      positions: "",
      levelDescriptions: {
        1: '', 2: '', 3: '', 4: '', 5: ''
      }
    });
  };

  // 处理文件上传的函数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  // 处理文件上传确认
  const handleUploadConfirm = () => {
    if (!uploadFile || !uploadAbilityId) return;

    // 模拟文件上传成功
    setTimeout(() => {
      // 假设这是从文件中解析出的数据
      const newSkillItems: AbilitySkillItem[] = [
        {
          id: `skill-${Date.now()}-1`,
          code: "K003",
          name: "数据分析",
          level: "T3",
          description: "能够使用SQL和数据可视化工具进行数据分析",
          positions: ["数据分析师", "业务分析师"],
          createdAt: new Date().toISOString()
        },
        {
          id: `skill-${Date.now()}-2`,
          code: "K004",
          name: "项目管理",
          level: "T4",
          description: "能够管理中型项目并确保按时交付",
          positions: ["项目经理", "产品经理"],
          createdAt: new Date().toISOString()
        }
      ];

      // 更新能力列表中的技能项
      setAbilities(abilities.map(ability => {
        if (ability.id === uploadAbilityId) {
          // 将新导入的技能项添加到现有技能项列表
          const updatedSkillItems = [
            ...(ability.skillItems || []),
            ...newSkillItems
          ];

          return {
            ...ability,
            skillItems: updatedSkillItems,
            count: updatedSkillItems.length // 更新计数
          };
        }
        return ability;
      }));

      // 显示成功消息
      setUploadSuccess(true);

      // 3秒后关闭成功消息和对话框
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadFile(null);
        setShowUploadDialog(false);
      }, 3000);
    }, 1000);
  };

  // 在组件的state部分添加专业素质相关状态
  const [showCreateProfessionalDialog, setShowCreateProfessionalDialog] = useState(false);
  const [newProfessionalAbility, setNewProfessionalAbility] = useState<NewAbility & {
    level_description?: string;
    related_knowledge?: string;
    related_skills?: string;
    job_sequences?: string[];
    searchSequence?: string;
    levelDescriptions?: { [key: string]: string };
  }>({
    name: "",
    description: "",
    type: "素质类",
    tag: "专业素质",
    code: "",
    level: "",
    positions: "",
    level_description: "",
    related_knowledge: "",
    related_skills: "",
    job_sequences: [],
    searchSequence: "",
    levelDescriptions: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    }
  });

  // 添加处理专业素质表单变更的函数
  const handleProfessionalAbilityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProfessionalAbility({ ...newProfessionalAbility, [name]: value });
  };

  // 添加处理创建专业素质的函数
  const handleCreateProfessionalAbility = () => {
    // 首先检查必填字段是否已填写
    if (!newProfessionalAbility.name) {
      alert("请填写素质名称");
      return;
    }

    if (!newProfessionalAbility.level) {
      alert("请选择等级划分");
      return;
    }

    if (!newProfessionalAbility.level_description) {
      alert("请填写分级行为标准");
      return;
    }

    // 模拟向后端提交数据
    console.log("创建专业素质:", newProfessionalAbility);

    // 找到素质类能力库
    const targetAbilityIndex = abilities.findIndex(a => a.type === "素质");
    if (targetAbilityIndex === -1) {
      alert("未找到素质类能力库");
      return;
    }

    // 创建新的能力项
    const newSkillItem: AbilitySkillItem = {
      id: `skill-${Date.now()}`,
      code: newProfessionalAbility.code || `F-PRO-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      name: newProfessionalAbility.name,
      level: newProfessionalAbility.level || "L4",
      description: newProfessionalAbility.level_description || "",
      positions: newProfessionalAbility.positions ? [newProfessionalAbility.positions] : ["财务经理岗"],
      createdAt: new Date().toISOString(),
      levelDescriptions: newProfessionalAbility.levelDescriptions // 新增字段
    } as any;

    // 更新能力库
    const updatedAbilities = [...abilities];
    const targetAbility = updatedAbilities[targetAbilityIndex];
    if (!targetAbility.skillItems) {
      targetAbility.skillItems = [];
    }
    targetAbility.skillItems = [...targetAbility.skillItems, newSkillItem]; // 保证新项能回显
    targetAbility.count = targetAbility.skillItems.length;

    console.log('newSkillItem', newSkillItem);
    console.log('updatedAbilities', updatedAbilities);
    setAbilities(updatedAbilities);

    // 重置表单和关闭对话框
    setNewProfessionalAbility({
      name: "",
      description: "",
      type: "素质类",
      tag: "专业素质",
      code: "",
      level: "",
      positions: "",
      level_description: "",
      related_knowledge: "",
      related_skills: "",
      job_sequences: [],
      searchSequence: "",
      levelDescriptions: {
        1: '', 2: '', 3: '', 4: '', 5: ''
      }
    });

    setShowCreateProfessionalDialog(false);

    // 显示成功消息
    alert(`成功创建专业素质: ${newProfessionalAbility.name}`);
  };

  // 添加岗位序列数据
  const jobSequenceOptions = [
    { value: "finance", label: "财务序列" },
    { value: "hr", label: "人力资源序列" },
    { value: "tech", label: "技术序列" },
    { value: "operation", label: "运营序列" },
    { value: "sales", label: "销售序列" },
    { value: "marketing", label: "市场序列" },
    { value: "legal", label: "法务序列" },
    { value: "product", label: "产品序列" }
  ];

  // 添加处理岗位序列搜索变更的函数
  const handleSequenceSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewProfessionalAbility({
      ...newProfessionalAbility,
      searchSequence: e.target.value
    });
  };

  // 添加处理岗位序列选择的函数
  const toggleJobSequence = (sequence: string) => {
    const currentSequences = newProfessionalAbility.job_sequences || [];
    const isSelected = currentSequences.includes(sequence);

    if (isSelected) {
      // 移除已选项
      setNewProfessionalAbility({
        ...newProfessionalAbility,
        job_sequences: currentSequences.filter(s => s !== sequence)
      });
    } else {
      // 添加新选项
      setNewProfessionalAbility({
        ...newProfessionalAbility,
        job_sequences: [...currentSequences, sequence]
      });
    }
  };

  // 添加自定义岗位序列的函数
  const addCustomJobSequence = () => {
    if (!newProfessionalAbility.searchSequence) return;

    const currentSequences = newProfessionalAbility.job_sequences || [];
    if (!currentSequences.includes(newProfessionalAbility.searchSequence)) {
      setNewProfessionalAbility({
        ...newProfessionalAbility,
        job_sequences: [...currentSequences, newProfessionalAbility.searchSequence],
        searchSequence: ""
      });
    }
  };

  // 在组件的state部分添加领导力素质相关状态
  const [showCreateLeadershipDialog, setShowCreateLeadershipDialog] = useState(false);
  const [newLeadershipAbility, setNewLeadershipAbility] = useState<NewAbility & {
    level_description?: string;
    applicableLevel?: string;
    coreDefinition?: string;
    strategicAlignment?: string;
    job_sequences?: string[];
    searchSequence?: string;
  }>({
    name: "",
    description: "",
    type: "素质类",
    tag: "领导力素质",
    code: "",
    level: "",
    positions: "",
    level_description: "",
    applicableLevel: "",
    coreDefinition: "",
    strategicAlignment: "",
    job_sequences: [],
    searchSequence: ""
  });

  // 添加处理领导力素质表单变更的函数
  const handleLeadershipAbilityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLeadershipAbility({ ...newLeadershipAbility, [name]: value });
  };

  // 添加处理创建领导力素质的函数
  const handleCreateLeadershipAbility = () => {
    // 首先检查必填字段是否已填写
    if (!newLeadershipAbility.name) {
      alert("请填写素质名称");
      return;
    }

    if (!newLeadershipAbility.level) {
      alert("请选择等级划分");
      return;
    }

    if (!newLeadershipAbility.level_description) {
      alert("请填写分级行为标准");
      return;
    }

    // 模拟向后端提交数据
    console.log("创建领导力素质:", newLeadershipAbility);

    // 找到素质类能力库
    const targetAbilityIndex = abilities.findIndex(a => a.type === "素质");
    if (targetAbilityIndex === -1) {
      alert("未找到素质类能力库");
      return;
    }

    // 创建新的能力项
    const newSkillItem: AbilitySkillItem = {
      id: `skill-${Date.now()}`,
      code: newLeadershipAbility.code || `L-LEAD-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      name: newLeadershipAbility.name,
      level: newLeadershipAbility.level || "L4",
      description: newLeadershipAbility.level_description || "",
      positions: newLeadershipAbility.applicableLevel ? [newLeadershipAbility.applicableLevel] : ["M4（副总裁及以上）"],
      createdAt: new Date().toISOString()
    };

    // 更新能力库
    const updatedAbilities = [...abilities];
    const targetAbility = updatedAbilities[targetAbilityIndex];
    if (!targetAbility.skillItems) {
      targetAbility.skillItems = [];
    }
    targetAbility.skillItems = [...targetAbility.skillItems, newSkillItem];
    targetAbility.count = targetAbility.skillItems.length;

    setAbilities(updatedAbilities);

    // 重置表单和关闭对话框
    setNewLeadershipAbility({
      name: "",
      description: "",
      type: "素质类",
      tag: "领导力素质",
      code: "",
      level: "",
      positions: "",
      level_description: "",
      applicableLevel: "",
      coreDefinition: "",
      strategicAlignment: "",
      job_sequences: [],
      searchSequence: ""
    });

    setShowCreateLeadershipDialog(false);

    // 显示成功消息
    alert(`成功创建领导力素质: ${newLeadershipAbility.name}`);
  };

  // 在组件的state部分添加通用素质相关状态
  const [showCreateGeneralDialog, setShowCreateGeneralDialog] = useState(false);
  const [newGeneralAbility, setNewGeneralAbility] = useState<NewAbility & {
    core_definition?: string;
    level_description?: string;
  }>({
    name: "",
    description: "",
    type: "素质类",
    tag: "通用素质",
    code: "",
    level: "",
    positions: "",
    core_definition: "",
    level_description: ""
  });

  // 添加处理通用素质表单变更的函数
  const handleGeneralAbilityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGeneralAbility({ ...newGeneralAbility, [name]: value });
  };

  // 添加处理创建通用素质的函数
  const handleCreateGeneralAbility = () => {
    // 首先检查必填字段是否已填写
    if (!newGeneralAbility.name) {
      alert("请填写素质名称");
      return;
    }

    if (!newGeneralAbility.level) {
      alert("请选择等级划分");
      return;
    }

    if (!newGeneralAbility.level_description) {
      alert("请填写分级行为标准");
      return;
    }

    // 模拟向后端提交数据
    console.log("创建通用素质:", newGeneralAbility);

    // 找到素质类能力库
    const targetAbilityIndex = abilities.findIndex(a => a.type === "素质");
    if (targetAbilityIndex === -1) {
      alert("未找到素质类能力库");
      return;
    }

    // 创建新的能力项
    const newSkillItem: AbilitySkillItem = {
      id: `skill-${Date.now()}`,
      code: newGeneralAbility.code || `G-COM-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      name: newGeneralAbility.name,
      level: newGeneralAbility.level || "L3",
      description: newGeneralAbility.level_description || "",
      positions: ["所有岗位"],
      createdAt: new Date().toISOString()
    };

    // 更新能力库
    const updatedAbilities = [...abilities];
    const targetAbility = updatedAbilities[targetAbilityIndex];
    if (!targetAbility.skillItems) {
      targetAbility.skillItems = [];
    }
    targetAbility.skillItems = [...targetAbility.skillItems, newSkillItem];
    targetAbility.count = targetAbility.skillItems.length;

    setAbilities(updatedAbilities);

    // 重置表单和关闭对话框
    setNewGeneralAbility({
      name: "",
      description: "",
      type: "素质类",
      tag: "通用素质",
      code: "",
      level: "",
      positions: "",
      core_definition: "",
      level_description: ""
    });

    setShowCreateGeneralDialog(false);

    // 显示成功消息
    alert(`成功创建通用素质: ${newGeneralAbility.name}`);
  };

  // 在state部分添加当前选中的素质类型标签状态
  const [currentQualityTab, setCurrentQualityTab] = useState("professional");

  // 在state部分添加删除确认对话框状态和选中项状态
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AbilitySkillItem | null>(null);
  const [selectedAbilityId, setSelectedAbilityId] = useState<number | null>(null);

  // 添加删除能力项的处理函数
  const handleDeleteAbilityItem = (ability: AbilityItem, itemId: string) => {
    if (!ability || !ability.skillItems) return;

    const updatedAbilities = abilities.map(a => {
      if (a.id === ability.id) {
        const updatedSkillItems = a.skillItems?.filter(item => item.id !== itemId) || [];
        return {
          ...a,
          skillItems: updatedSkillItems,
          count: updatedSkillItems.length
        };
      }
      return a;
    });

    setAbilities(updatedAbilities);
    setShowDeleteConfirmDialog(false);
    setItemToDelete(null);
  };

  // 添加处理全选的函数
  const toggleSelectAll = (ability: AbilityItem, prefix: string, checked: boolean) => {
    if (!ability || !ability.skillItems) return;

    if (checked) {
      const allItemIds = ability.skillItems
        .filter(item => item.code?.startsWith(prefix))
        .map(item => item.id);
      if (ability.type === "知识技能") {
        setSelectedKnowledgeItems([...selectedKnowledgeItems, ...allItemIds]);
      } else {
        setSelectedQualityItems([...selectedQualityItems, ...allItemIds]);
      }
    } else {
      const filterIds = ability.skillItems
        .filter(item => item.code?.startsWith(prefix))
        .map(item => item.id);
      if (ability.type === "知识技能") {
        setSelectedKnowledgeItems(selectedKnowledgeItems.filter(id => !filterIds.includes(id)));
      } else {
        setSelectedQualityItems(selectedQualityItems.filter(id => !filterIds.includes(id)));
      }
    }
  };

  // 添加处理批量删除的函数
  const handleBatchDelete = (ability: AbilityItem) => {
    if (!ability || !ability.skillItems) return;

    const selectedItems = ability.type === "知识技能" ? selectedKnowledgeItems : selectedQualityItems;

    if (selectedItems.length === 0) return;

    const updatedAbilities = abilities.map(a => {
      if (a.id === ability.id) {
        const updatedSkillItems = a.skillItems?.filter(item => !selectedItems.includes(item.id)) || [];
        return {
          ...a,
          skillItems: updatedSkillItems,
          count: updatedSkillItems.length
        };
      }
      return a;
    });

    setAbilities(updatedAbilities);

    if (ability.type === "知识技能") {
      setSelectedKnowledgeItems([]);
    } else {
      setSelectedQualityItems([]);
    }
  };

  // 在state部分添加编辑模式状态
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AbilitySkillItem | null>(null);

  // 添加处理保存编辑的函数
  const handleSaveEdit = () => {
    if (!editingSkill || !selectedKnowledgeSkill) return;

    // 更新能力项数据
    const updatedAbilities = abilities.map(ability => {
      if (ability.skillItems) {
        const updatedSkillItems = ability.skillItems.map(item => {
          if (item.id === selectedKnowledgeSkill.id) {
            return editingSkill;
          }
          return item;
        });

        return {
          ...ability,
          skillItems: updatedSkillItems
        };
      }
      return ability;
    });

    setAbilities(updatedAbilities);
    setSelectedKnowledgeSkill(editingSkill);
    setIsEditing(false);
    setEditingSkill(null);
  };

  // 添加直接下载模板的函数
  const handleDownloadTemplate = (type: string) => {
    // 这里可以添加实际的API调用来下载模板
    console.log(`下载${type}模板...`);
    // 模拟下载成功提示
    alert(`${type}模板下载中...`);

    // 实际对接后台API的代码可以放在这里
    // 例如：
    // fetch(`/api/templates/${type}`)
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `${type}模板.xlsx`;
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   });
  };

  // 在TalentStandardsPage组件中添加状态变量
  const [selectedKnowledgeSkill, setSelectedKnowledgeSkill] = useState<AbilitySkillItem | null>(null);

  // 添加人才履历标签导航状态
  const [activeProfileTab, setActiveProfileTab] = useState('远景精神');

  // 监听URL参数tab，自动切换人才履历子Tab
  useEffect(() => {
    if (!searchParams) return;
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam === 'jobModel') {
        setActiveProfileTab('岗位模型');
      } else if (tabParam === 'baseInfo') {
        setActiveProfileTab('基本信息');
      } else if (tabParam === 'okr') {
        setActiveProfileTab('个人OKR');
      } else if (tabParam === 'review') {
        setActiveProfileTab('评价');
      }
    }
  }, [searchParams]);

  /**
   * 处理人才履历标签切换
   * @param {string} tab - 标签名称
   */
  const handleProfileTabChange = (tab: string) => {
    setActiveProfileTab(tab);
    console.log(`切换到: ${tab}`);
  };

  /**
   * 根据当前活动标签渲染相应内容
   * @returns {React.ReactNode} 内容组件
   */
  const renderProfileContent = () => {
    switch (activeProfileTab) {
      case '基本信息':
        return <BasicInfoContent />;
      case '岗位模型':
        return <JobModelContent />;
      case '远景精神':
        return <VisionSpiritContent />;
      case '个人OKR':
        return <PerformanceContent />;
      case '发展规划':
        return <DevelopmentPlanContent />;
      case '团队盘点':
        return <TeamAssessmentContent />;
      case '人岗匹配':
        return <JobMatchingContent />;
      case '评价':
        return <ReviewContent />;
      case 'Talent摘要简报':
        return <TalentSummaryContent />;
      default:
        return (
          <Card className="p-6">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">该功能正在开发中...</p>
            </div>
          </Card>
        );
    }
  };

  // 移除或修改 navigateToCategory 函数，因为我们不再需要导航到其他页面
  const navigateToCategory = (category: string) => {
    // 现在只是切换标签，而不是导航到新页面
    setActiveProfileTab(category);
    console.log(`切换到: ${category}`);
  };

  // 添加素质类卡片搜索状态
  const [qualitySearchValue, setQualitySearchValue] = useState("");
  const [selectedQualityItem, setSelectedQualityItem] = useState<AbilitySkillItem | null>(null);
  const [isQualityEditing, setIsQualityEditing] = useState(false);

  // 1. 在组件顶部添加selectedPathLevel状态
  const [selectedPathLevel, setSelectedPathLevel] = useState<string>('1');

  // 修改导航标签
  const tabs = [
    '基本信息',
    '岗位模型',
    '远景精神',
    '个人OKR',
    '发展规划',
    '团队盘点',
    '人岗匹配',
    '评价',
    'Talent摘要简报'
  ];

  // 1. 在组件顶部添加示例弹窗相关状态
  /**
   * 素质类示例弹窗Tab类型
   * @typedef {'professional'|'leadership'|'general'} QualityExampleTab
   */
  const [showQualityExampleDialog, setShowQualityExampleDialog] = useState(false);
  const [qualityExampleTab, setQualityExampleTab] = useState<'professional'|'leadership'|'general'>('professional');

  // 4. 在组件顶部添加知识技能类示例弹窗状态
  const [showKnowledgeExampleDialog, setShowKnowledgeExampleDialog] = useState(false);

  // 1. 新增主Tab状态
  const [mainTab, setMainTab] = useState("ability"); // ability/profile/matching

  // 3. 新增：用于外部切换Tab的函数
  const jumpToProfileJobModel = () => {
    setMainTab("profile");
    setActiveProfileTab("岗位模型");
  };

  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-2 bg-[#F3F7FA]">
      <div className="mb-1">
        <h1 className="text-[18px] font-bold text-gray-800">人才标准</h1>
        <p className="text-sm text-gray-500">管理能力库、岗位模型和人才履历</p>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab} defaultValue="ability" className="w-full mt-8">
        <TabsList className="w-full flex justify-start space-x-6 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger
            value="ability"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            能力库
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            人才履历
          </TabsTrigger>
          <TabsTrigger
            value="matching"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            人岗匹配
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ability" className="space-y-6 mt-6">
          {/* 能力库管理模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{ color: '#3C5E5C' }} className="text-sm font-medium">能力库管理</CardTitle>
                <div className="flex space-x-2">
                  {/* 彻底删除原有的 Dialog 示例按钮，只保留其他按钮 */}
                  {/* 其他按钮保留 */}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* 改为垂直布局，移除grid相关类 */}
                <div className="space-y-6">
                  {/* 知识技能类卡片 */}
                  {abilities.filter(ability => ability.type === "知识技能").map((ability) => (
                    <div key={ability.id} className="rounded-lg border border-gray-200 bg-white transition-shadow flex flex-col min-h-[500px]">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-800 mb-2">{ability.name}</h3>
                          <p className="text-sm text-gray-600">{ability.description}</p>
                        </div>
                        {/* 新增：知识技能类示例按钮 */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs ml-2"
                          onClick={() => setShowKnowledgeExampleDialog(true)}
                        >
                          示例
                        </Button>
                      </div>

                      <div className="flex flex-1 h-[calc(100%-80px)]">
                        {/* 左侧：能力列表 */}
                        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                          <div className="p-4 border-b border-gray-100">
                            <div className="relative w-full">
                              <Input
                                placeholder="搜索能力项..."
                                className="h-9 text-sm pl-3 pr-8 py-1 border-gray-200"
                              />
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>

                          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                checked={ability.skillItems?.every(item => selectedKnowledgeItems.includes(item.id)) || false}
                                onChange={(e) => toggleSelectAll(ability, '', e.target.checked)}
                              />
                              <span className="text-xs text-gray-500 ml-2">全选</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {selectedKnowledgeItems.length > 0 && (
                                <button
                                  className="text-xs text-red-600 hover:text-red-800 flex items-center px-2 py-1 border border-red-500 rounded"
                                  onClick={() => handleBatchDelete(ability)}
                                >
                                  <XIcon size={12} className="mr-1" />
                                  <span>删除</span>
                                </button>
                              )}
                              <Dialog
                                open={showCreateAbilityDialog && newAbility.type === ability.type}
                                onOpenChange={(open) => {
                                  setShowCreateAbilityDialog(open);
                                  if (open) setNewAbility({ ...newAbility, type: ability.type });
                                }}
                              >
                                <DialogTrigger asChild>
                                  <button className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded">
                                    <PlusIcon size={12} className="mr-1" />
                                    <span>添加</span>
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>创建{ability.type}能力项</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">能力编码</label>
                                        <Input
                                          name="code"
                                          value={newAbility.code || ""}
                                          onChange={(e) => setNewAbility({ ...newAbility, code: e.target.value })}
                                          placeholder="如 K001（知识类）"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">能力名称</label>
                                        <Input
                                          name="name"
                                          value={newAbility.name}
                                          onChange={handleAbilityChange}
                                          placeholder="如 财务报表分析"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">能力类型</label>
                                        <Input
                                          name="type"
                                          value={newAbility.type === "知识技能" ? "知识技能类" : "素质类"}
                                          disabled
                                          className="bg-gray-50"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">能力定义</label>
                                      <Textarea
                                        name="description"
                                        value={newAbility.description}
                                        onChange={handleAbilityChange}
                                        placeholder="如 能运用Python完成数据清洗和可视化分析"
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">适用岗位</label>
                                      <Input
                                        name="positions"
                                        value={newAbility.positions || ""}
                                        onChange={(e) => setNewAbility({ ...newAbility, positions: e.target.value })}
                                        placeholder="如 财务岗（多个岗位用逗号分隔）"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      {/* 能力等级描述输入 */}
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">能力等级描述</label>
                                        <div className="grid grid-cols-1 gap-2">
                                          {["1","2","3","4","5"].map((level) => (
                                            <div key={level} className="flex items-center gap-2">
                                              <span className="w-14 text-xs font-bold">{level}</span>
                                              <Input
                                                value={newAbility.levelDescriptions?.[level] || ''}
                                                onChange={e => setNewAbility(prev => ({
                                                  ...prev,
                                                  levelDescriptions: {
                                                    ...prev.levelDescriptions,
                                                    [level]: e.target.value
                                                  }
                                                }))}
                                                placeholder={`请输入等级${level}的描述`}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setShowCreateAbilityDialog(false)}>取消</Button>
                                    <Button onClick={() => {
                                      handleCreateAbilityItem(ability.id);
                                      setShowCreateAbilityDialog(false);
                                    }}>确认</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          <div className="space-y-1 p-2">
                            {ability.skillItems && ability.skillItems.map((item) => (
                              <div
                                key={item.id}
                                className={`text-sm text-gray-600 p-2 rounded cursor-pointer transition-colors border ${selectedKnowledgeSkill?.id === item.id
                                  ? 'border-[#3C5E5C] bg-[#3C5E5C]/5'
                                  : 'border-gray-100 hover:bg-gray-50'
                                  }`}
                                onClick={() => setSelectedKnowledgeSkill(item)}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center flex-grow">
                                    <input
                                      type="checkbox"
                                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                      checked={selectedKnowledgeItems.includes(item.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedKnowledgeItems([...selectedKnowledgeItems, item.id]);
                                        } else {
                                          setSelectedKnowledgeItems(selectedKnowledgeItems.filter(id => id !== item.id));
                                        }
                                        e.stopPropagation();
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="truncate">
                                      <span>{item.name}</span>
                                      <span className="mx-1 text-xs text-gray-400">({item.code})</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 右侧：详细内容 - 修改为与添加表单一致的结构 */}
                        <div className="w-2/3 p-6 overflow-y-auto">
                          {selectedKnowledgeSkill ? (
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-800">能力项详情</h3>
                                <div className="flex items-center">
                                  {isEditing ? (
                                    <button
                                      className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                                      onClick={handleSaveEdit}
                                    >
                                      <CheckIcon size={12} className="mr-1" />
                                      <span>完成</span>
                                    </button>
                                  ) : (
                                    <button
                                      className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                                      onClick={() => {
                                        setIsEditing(true);
                                        setEditingSkill({ ...selectedKnowledgeSkill });
                                      }}
                                    >
                                      <EditIcon size={12} className="mr-1" />
                                      <span>编辑</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力编码</label>
                                  <Input
                                    value={isEditing ? editingSkill?.code : selectedKnowledgeSkill.code}
                                    readOnly={!isEditing}
                                    onChange={(e) => setEditingSkill({ ...editingSkill!, code: e.target.value })}
                                    className={isEditing ? "bg-white" : "bg-gray-50"}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力名称</label>
                                  <Input
                                    value={isEditing ? editingSkill?.name : selectedKnowledgeSkill.name}
                                    readOnly={!isEditing}
                                    onChange={(e) => setEditingSkill({ ...editingSkill!, name: e.target.value })}
                                    className={isEditing ? "bg-white" : "bg-gray-50"}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力类型</label>
                                  <Input
                                    value="知识技能类"
                                    readOnly
                                    className="bg-gray-50"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">能力描述</label>
                                <Textarea
                                  value={isEditing ? editingSkill?.description : selectedKnowledgeSkill.description}
                                  readOnly={!isEditing}
                                  onChange={(e) => setEditingSkill({ ...editingSkill!, description: e.target.value })}
                                  className={`min-h-[100px] ${isEditing ? "bg-white" : "bg-gray-50"}`}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">适用岗位</label>
                                <Input
                                  value={isEditing ?
                                    (typeof editingSkill?.positions === 'string' ?
                                      editingSkill.positions :
                                      editingSkill?.positions.join(', ')) :
                                    selectedKnowledgeSkill.positions.join(', ')}
                                  readOnly={!isEditing}
                                  onChange={(e) => setEditingSkill({
                                    ...editingSkill!,
                                    positions: e.target.value.split(',').map(p => p.trim())
                                  })}
                                  className={isEditing ? "bg-white" : "bg-gray-50"}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">创建时间</label>
                                <Input
                                  value={selectedKnowledgeSkill.createdAt}
                                  readOnly
                                  className="bg-gray-50"
                                />
                              </div>

                              <div className="mt-6">
                                <label className="text-sm font-medium">能力发展路径</label>
                                <div className="relative mt-2 p-4 bg-gray-50 rounded-md">
                                  <div className="flex justify-between mb-2">
                                    {["1", "2", "3", "4", "5"].map((level) => (
                                      <div key={level} className="text-center">
                                        <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs cursor-pointer ${selectedPathLevel === level ? 'bg-[#3C5E5C] text-white' : 'bg-gray-200 text-gray-700'}`}
                                          onClick={() => setSelectedPathLevel(level)}
                                        >
                                          {level}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-300 -z-10"></div>
                                  {/* 编辑模式下，统一在下方显示输入框，宽度与背景一致 */}
                                  {isEditing && (
                                    <div className="mt-4">
                                      <Textarea
                                        className="w-full min-h-[120px] rounded-xl border border-gray-400 px-4 py-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C5E5C] focus:border-[#3C5E5C]"
                                        placeholder="请输入能力等级描述"
                                        value={editingSkill?.levelDescriptions?.[selectedPathLevel] || ''}
                                        onChange={e => {
                                          setEditingSkill({
                                            ...editingSkill!,
                                            levelDescriptions: {
                                              ...editingSkill?.levelDescriptions,
                                              [selectedPathLevel]: e.target.value
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                  )}
                                  {/* 仅非编辑模式下展示能力等级描述 */}
                                  {!isEditing && selectedKnowledgeSkill && selectedKnowledgeSkill.levelDescriptions && (
                                    <div className="mt-4 space-y-2">
                                      <label className="text-sm font-medium">能力等级描述</label>
                                      <div className="flex items-center gap-2">
                                        <span className="w-14 text-xs font-bold text-[#3C5E5C]">{selectedPathLevel}</span>
                                        <span className="flex-1 text-sm text-[#3C5E5C]">
                                          {selectedKnowledgeSkill.levelDescriptions?.[selectedPathLevel] || '（未填写）'}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-12 w-12 mx-auto text-gray-300 mb-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a4 4 0 004-4V7a4 4 0 00-4-4H9z"
                                  />
                                </svg>
                                <p className="text-gray-500">从左侧选择一个能力项查看详情</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 p-3">
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <div>
                            <span>共{ability.count}项能力</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                              onClick={() => {
                                setUploadAbilityId(ability.id);
                                setShowUploadDialog(true);
                              }}
                            >
                              <span>上传</span>
                            </button>
                            <button
                              className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                              onClick={() => handleDownloadTemplate("知识技能类")}
                            >
                              下载模板
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 素质类卡片 - 重构为左右布局 */}
                  {abilities.filter(ability => ability.type === "素质").map((ability) => (
                    <div key={ability.id} className="rounded-lg border border-gray-200 bg-white transition-shadow flex flex-col min-h-[500px]">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-800 mb-2">{ability.name}</h3>
                          <p className="text-sm text-gray-600">{ability.description}</p>
                        </div>
                        {/* 新增：示例按钮 */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs ml-2"
                          onClick={() => setShowQualityExampleDialog(true)}
                        >
                          示例
                        </Button>
                      </div>

                      <div className="flex flex-1 h-[calc(100%-80px)]">
                        {/* 左侧：能力项列表（带搜索和标签过滤） */}
                        <div className="w-1/3 border-r border-gray-200 overflow-y-auto flex flex-col">
                          <div className="p-4 border-b border-gray-100">
                            <div className="relative w-full">
                              <Input
                                placeholder={`搜索${{
                                  professional: '专业素质',
                                  leadership: '领导力素质',
                                  general: '通用素质',
                                }[currentQualityTab]}...`}
                                className="h-9 text-sm pl-3 pr-8 py-1 border-gray-200"
                                value={qualitySearchValue}
                                onChange={e => setQualitySearchValue(e.target.value)}
                              />
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                checked={ability.skillItems?.every(item => selectedQualityItems.includes(item.id)) || false}
                                onChange={(e) => toggleSelectAll(ability, '', e.target.checked)}
                              />
                              <span className="text-xs text-gray-500 ml-2">全选</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {selectedQualityItems.length > 0 && (
                                <button
                                  className="text-xs text-red-600 hover:text-red-800 flex items-center px-2 py-1 border border-red-500 rounded"
                                  onClick={() => handleBatchDelete(ability)}
                                >
                                  <XIcon size={12} className="mr-1" />
                                  <span>删除</span>
                                </button>
                              )}
                              <button
                                className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                                onClick={() => {
                                  if (currentQualityTab === 'professional') setShowCreateProfessionalDialog(true);
                                  if (currentQualityTab === 'leadership') setShowCreateLeadershipDialog(true);
                                  if (currentQualityTab === 'general') setShowCreateGeneralDialog(true);
                                }}
                              >
                                <PlusIcon size={12} className="mr-1" />
                                <span>添加</span>
                              </button>
                            </div>
                          </div>
                          <Tabs
                            defaultValue="professional"
                            value={currentQualityTab}
                            className="w-full mt-2"
                            onValueChange={(value) => {
                              setCurrentQualityTab(value);
                              setSelectedQualityItem(null);
                              setIsQualityEditing(false);
                            }}
                          >
                            <TabsList className="w-full flex justify-start space-x-2 bg-gray-50 p-1 rounded">
                              <TabsTrigger value="professional" className="flex-1 data-[state=active]:bg-[#f8fbfc] data-[state=active]:shadow-sm text-xs py-1.5">专业素质</TabsTrigger>
                              <TabsTrigger value="leadership" className="flex-1 data-[state=active]:bg-[#f8fbfc] data-[state=active]:shadow-sm text-xs py-1.5">领导力素质</TabsTrigger>
                              <TabsTrigger value="general" className="flex-1 data-[state=active]:bg-[#f8fbfc] data-[state=active]:shadow-sm text-xs py-1.5">通用素质</TabsTrigger>
                            </TabsList>
                          </Tabs>
                          <div className="space-y-1 p-2 flex-1 overflow-y-auto">
                            {ability.skillItems && ability.skillItems.filter(item => {
                              const prefix = currentQualityTab === 'professional' ? 'F-PRO' : currentQualityTab === 'leadership' ? 'L-LEAD' : 'G-COM';
                              let filter = item.code?.startsWith(prefix);
                              if (qualitySearchValue) {
                                filter = filter && (item.name.includes(qualitySearchValue) || item.code.includes(qualitySearchValue));
                              }
                              return filter;
                            }).map((item) => (
                              <div
                                key={item.id}
                                className={`text-sm text-gray-600 p-2 rounded cursor-pointer transition-colors border ${selectedQualityItem?.id === item.id ? 'border-[#3C5E5C] bg-[#3C5E5C]/5' : 'border-gray-100 hover:bg-gray-50'}`}
                                onClick={() => {
                                  setSelectedQualityItem(item);
                                  setIsQualityEditing(false);
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center flex-grow">
                                    <input
                                      type="checkbox"
                                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                      checked={selectedQualityItems.includes(item.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedQualityItems([...selectedQualityItems, item.id]);
                                        } else {
                                          setSelectedQualityItems(selectedQualityItems.filter(id => id !== item.id));
                                        }
                                        e.stopPropagation();
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="truncate">
                                      <span>{item.name}</span>
                                      <span className="mx-1 text-xs text-gray-400">({item.code})</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* 右侧：能力项详情/编辑表单 */}
                        <div className="w-2/3 p-6 overflow-y-auto">
                          {selectedQualityItem ? (
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-800">能力项详情</h3>
                                <div className="flex items-center">
                                  {isQualityEditing ? (
                                    <button
                                      className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                                      onClick={() => setIsQualityEditing(false)}
                                    >
                                      完成
                                    </button>
                                  ) : (
                                    <button
                                      className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                                      onClick={() => setIsQualityEditing(true)}
                                    >
                                      编辑
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力编码</label>
                                  <Input
                                    value={selectedQualityItem.code}
                                    readOnly={!isQualityEditing}
                                    onChange={e => setSelectedQualityItem({ ...selectedQualityItem, code: e.target.value })}
                                    className={isQualityEditing ? "bg-white" : "bg-gray-50"}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力名称</label>
                                  <Input
                                    value={selectedQualityItem.name}
                                    readOnly={!isQualityEditing}
                                    onChange={e => setSelectedQualityItem({ ...selectedQualityItem, name: e.target.value })}
                                    className={isQualityEditing ? "bg-white" : "bg-gray-50"}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力类型</label>
                                  <Input
                                    value={(() => {
                                      if (selectedQualityItem.code.startsWith('F-PRO')) return '专业素质';
                                      if (selectedQualityItem.code.startsWith('L-LEAD')) return '领导力素质';
                                      if (selectedQualityItem.code.startsWith('G-COM')) return '通用素质';
                                      return '素质类';
                                    })()}
                                    readOnly
                                    className="bg-gray-50"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">能力描述</label>
                                <Textarea
                                  value={selectedQualityItem.description}
                                  readOnly={!isQualityEditing}
                                  onChange={e => setSelectedQualityItem({ ...selectedQualityItem, description: e.target.value })}
                                  className={`min-h-[100px] ${isQualityEditing ? "bg-white" : "bg-gray-50"}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">适用岗位</label>
                                <Input
                                  value={isQualityEditing ? (typeof selectedQualityItem.positions === 'string' ? selectedQualityItem.positions : selectedQualityItem.positions.join(', ')) : selectedQualityItem.positions.join(', ')}
                                  readOnly={!isQualityEditing}
                                  onChange={e => setSelectedQualityItem({ ...selectedQualityItem, positions: e.target.value.split(',').map(p => p.trim()) })}
                                  className={isQualityEditing ? "bg-white" : "bg-gray-50"}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">创建时间</label>
                                <Input value={selectedQualityItem.createdAt} readOnly className="bg-gray-50" />
                              </div>
                              {selectedQualityItem && selectedQualityItem.levelDescriptions && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力等级描述</label>
                                  <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(selectedQualityItem.levelDescriptions).filter(([level]) => ["1","2","3","4","5"].includes(level)).map(([level, desc]) => (
                                      <div key={level} className="flex items-center gap-2">
                                        <span className={`w-14 text-xs font-bold ${selectedQualityItem.level === level ? 'text-[#3C5E5C]' : 'text-gray-500'}`}>{level}</span>
                                        <span className={`flex-1 text-sm ${selectedQualityItem.level === level ? 'text-[#3C5E5C]' : 'text-gray-700'}`}>{desc || '（未填写）'}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-12 w-12 mx-auto text-gray-300 mb-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a4 4 0 004-4V7a4 4 0 00-4-4H9z"
                                  />
                                </svg>
                                <p className="text-gray-500">从左侧选择一个能力项查看详情</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-100 p-3">
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <div>
                            <span>共{ability.count}项能力</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                              onClick={() => {
                                setUploadAbilityId(ability.id);
                                setShowUploadDialog(true);
                              }}
                            >
                              <span>上传</span>
                            </button>
                            <button
                              className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                              onClick={() => handleDownloadTemplate("知识技能类")}
                            >
                              下载模板
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 人才履历模块 */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle style={{ color: '#3C5E5C' }} className="text-sm font-medium">人才履历</CardTitle>
                <div className="flex items-center gap-2">
                  {/* 员工选择器 */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleEmployeeList}
                      className="text-sm border-gray-200 text-gray-700 min-w-[150px] justify-between"
                    >
                      {selectedEmployee ? selectedEmployee.name : "选择员工"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                    {showEmployeeList && (
                      <div className="absolute mt-1 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => selectEmployee(null)}
                        >
                          <span className="text-sm">选择员工</span>
                        </div>
                        <div
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => selectEmployee({ name: "张远景", position: "部门负责人" })}
                        >
                          <span className="text-sm">张远景 (部门负责人)</span>
                        </div>
                        <div
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => selectEmployee({ name: "张华", position: "项目经理" })}
                        >
                          <span className="text-sm">张华 (项目经理)</span>
                        </div>
                        <div
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => selectEmployee({ name: "王芳", position: "产品设计师" })}
                        >
                          <span className="text-sm">王芳 (产品设计师)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {selectedEmployee ? (
                <div className="space-y-6">
                  {/* 员工基本信息 */}
                  <div className="flex items-start gap-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-600">
                        {selectedEmployee.name.substring(0, 1)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-xl font-semibold">{selectedEmployee.name}</h2>
                        <span className="text-sm text-gray-500">{selectedEmployee.position}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>员工ID: HR20210315</span>
                          <span>体系: 氢能装备事业部</span>
                          <span>部门: 机制建设部</span>
                          <span>入职时间: 2021年3月15日</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 导航标签 */}
                  <ProfileNavTabs activeTab={activeProfileTab} onTabChange={handleProfileTabChange} />

                  {/* 动态内容区域 */}
                  <div className="mt-4">
                    {renderProfileContent()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">请选择员工</h3>
                  <p className="text-sm text-gray-500 max-w-md text-center mb-6">
                    选择一名员工来查看其人才履历信息，或选择一个岗位查看相关要求。
                  </p>
                  <Button
                    variant="outline"
                    onClick={toggleEmployeeList}
                    className="text-sm"
                  >
                    选择员工
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 人岗匹配模块 */}
        <TabsContent value="matching" className="mt-6">
          <MatchingPage onJumpToProfileJobModel={jumpToProfileJobModel} />
        </TabsContent>
      </Tabs>

      {/* 上传文件弹窗 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>上传能力项</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!uploadSuccess ? (
              <>
                <p className="text-sm text-gray-600">
                  请选择符合模板格式的Excel文件进行上传，系统将自动解析并导入数据。
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm text-[#3C5E5C] hover:text-[#2A4A48]"
                  >
                    {uploadFile ? (
                      <span>{uploadFile.name}</span>
                    ) : (
                      <span className="flex flex-col items-center">
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span>点击选择文件</span>
                        <span className="text-xs text-gray-500 mt-1">支持 .xlsx, .xls, .csv 格式</span>
                      </span>
                    )}
                  </label>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">导入成功!</h3>
                <p className="text-sm text-gray-600">
                  成功导入能力项数据，系统已自动更新知识技能类能力词贴。
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {!uploadSuccess && (
              <>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>取消</Button>
                <Button
                  onClick={handleUploadConfirm}
                  disabled={!uploadFile}
                >
                  确认
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 能力项详情弹窗 */}
      <Dialog open={showItemDetailDialog} onOpenChange={setShowItemDetailDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>能力项详情</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">能力编码</label>
                  <Input
                    value={selectedItem.code}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">能力名称</label>
                  <Input
                    value={selectedItem.name}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">上传时间</label>
                  <Input
                    value={formatDate(selectedItem.createdAt)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">能力描述</label>
                <Textarea
                  value={selectedItem.description}
                  disabled
                  className="bg-gray-50 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">适用岗位</label>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.positions.map((position, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setShowItemDetailDialog(false)}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 专业素质创建弹窗 */}
      <Dialog open={showCreateProfessionalDialog} onOpenChange={setShowCreateProfessionalDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>创建专业素质</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">素质编码</label>
                <Input
                  name="code"
                  value={newProfessionalAbility.code || "F-PRO-"}
                  onChange={handleProfessionalAbilityChange}
                  placeholder="如 F-PRO-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">素质名称</label>
                <Input
                  name="name"
                  value={newProfessionalAbility.name}
                  onChange={handleProfessionalAbilityChange}
                  placeholder="如 税务筹划能力"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">适用岗位</label>
              <Input
                name="positions"
                value={newProfessionalAbility.positions || ""}
                onChange={handleProfessionalAbilityChange}
                placeholder="如 财务经理岗"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">分级行为标准</label>
              <Textarea
                name="level_description"
                value={newProfessionalAbility.level_description || ""}
                onChange={handleProfessionalAbilityChange}
                placeholder="如 L4：能设计跨区域税收筹划方案"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">关联知识</label>
              <Input
                name="related_knowledge"
                value={newProfessionalAbility.related_knowledge || ""}
                onChange={handleProfessionalAbilityChange}
                placeholder="如 CAS 18号准则"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">关联技能</label>
              <Input
                name="related_skills"
                value={newProfessionalAbility.related_skills || ""}
                onChange={handleProfessionalAbilityChange}
                placeholder="如 税务系统操作（金税三期）"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">相关岗位序列</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="搜索或输入岗位序列"
                    value={newProfessionalAbility.searchSequence || ""}
                    onChange={handleSequenceSearchChange}
                    className="w-full"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      onClick={addCustomJobSequence}
                      className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] p-1"
                      disabled={!newProfessionalAbility.searchSequence}
                    >
                      <PlusIcon size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md max-h-[150px] overflow-y-auto p-2 mt-2">
                <p className="text-xs text-gray-500 mb-2">支持多选</p>
                <div className="space-y-1">
                  {jobSequenceOptions
                    .filter(option =>
                      !newProfessionalAbility.searchSequence ||
                      option.label.toLowerCase().includes((newProfessionalAbility.searchSequence || "").toLowerCase())
                    )
                    .map(option => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`sequence-${option.value}`}
                          checked={newProfessionalAbility.job_sequences?.includes(option.label)}
                          onChange={() => toggleJobSequence(option.label)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                        />
                        <label htmlFor={`sequence-${option.value}`} className="text-sm">{option.label}</label>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {newProfessionalAbility.job_sequences?.map((sequence, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center"
                  >
                    <span>{sequence}</span>
                    <button
                      type="button"
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        const newSequences = [...(newProfessionalAbility.job_sequences || [])];
                        newSequences.splice(index, 1);
                        setNewProfessionalAbility({ ...newProfessionalAbility, job_sequences: newSequences });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* 能力等级描述输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">能力等级描述</label>
              <div className="grid grid-cols-1 gap-2">
                {["1","2","3","4","5"].map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <span className="w-14 text-xs font-bold">{level}</span>
                    <Input
                      value={newProfessionalAbility.levelDescriptions?.[level] || ''}
                      onChange={e => setNewProfessionalAbility(prev => ({
                        ...prev,
                        levelDescriptions: {
                          ...prev.levelDescriptions,
                          [level]: e.target.value
                        }
                      }))}
                      placeholder={`请输入等级${level}的描述`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowCreateProfessionalDialog(false)}>取消</Button>
            <Button onClick={handleCreateProfessionalAbility}>确认</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 领导力素质创建弹窗 */}
      <Dialog open={showCreateLeadershipDialog} onOpenChange={setShowCreateLeadershipDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>创建领导力素质</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">素质编码</label>
                <Input
                  name="code"
                  value={newLeadershipAbility.code || "L-LEAD-"}
                  onChange={handleLeadershipAbilityChange}
                  placeholder="如 L-LEAD-102"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">素质名称</label>
                <Input
                  name="name"
                  value={newLeadershipAbility.name}
                  onChange={handleLeadershipAbilityChange}
                  placeholder="如 战略决策能力"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">适用层级</label>
              <Input
                name="applicableLevel"
                value={newLeadershipAbility.applicableLevel || ""}
                onChange={handleLeadershipAbilityChange}
                placeholder="如 M4（副总裁及以上）"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">核心定义</label>
              <Textarea
                name="coreDefinition"
                value={newLeadershipAbility.coreDefinition || ""}
                onChange={handleLeadershipAbilityChange}
                placeholder="如 在不确定性中做出推动业务突破的决策"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">战略关联</label>
              <Input
                name="strategicAlignment"
                value={newLeadershipAbility.strategicAlignment || ""}
                onChange={handleLeadershipAbilityChange}
                placeholder="如 支撑2025年市场扩张战略"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">素质类型</label>
                <Input
                  name="type"
                  value="领导力素质"
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">等级划分</label>
                <Select
                  value={newLeadershipAbility.level || ""}
                  onValueChange={(value) => setNewLeadershipAbility({ ...newLeadershipAbility, level: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">1级 (L1)</SelectItem>
                    <SelectItem value="L2">2级 (L2)</SelectItem>
                    <SelectItem value="L3">3级 (L3)</SelectItem>
                    <SelectItem value="L4">4级 (L4)</SelectItem>
                    <SelectItem value="L5">5级 (L5)</SelectItem>
                    <SelectItem value="L6">6级 (L6)</SelectItem>
                    <SelectItem value="L7">7级 (L7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">分级行为标准</label>
              <Textarea
                name="level_description"
                value={newLeadershipAbility.level_description || ""}
                onChange={handleLeadershipAbilityChange}
                placeholder="如 L4 能主导制定3-5年战略规划并推动落地"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">相关岗位序列</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="搜索或输入岗位序列"
                    value={newLeadershipAbility.searchSequence || ""}
                    onChange={(e) => setNewLeadershipAbility({
                      ...newLeadershipAbility,
                      searchSequence: e.target.value
                    })}
                    className="w-full"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newLeadershipAbility.searchSequence) return;

                        const currentSequences = newLeadershipAbility.job_sequences || [];
                        if (!currentSequences.includes(newLeadershipAbility.searchSequence)) {
                          setNewLeadershipAbility({
                            ...newLeadershipAbility,
                            job_sequences: [...currentSequences, newLeadershipAbility.searchSequence],
                            searchSequence: ""
                          });
                        }
                      }}
                      className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] p-1"
                      disabled={!newLeadershipAbility.searchSequence}
                    >
                      <PlusIcon size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md max-h-[150px] overflow-y-auto p-2 mt-2">
                <p className="text-xs text-gray-500 mb-2">支持多选</p>
                <div className="space-y-1">
                  {jobSequenceOptions
                    .filter(option =>
                      !newLeadershipAbility.searchSequence ||
                      option.label.toLowerCase().includes((newLeadershipAbility.searchSequence || "").toLowerCase())
                    )
                    .map(option => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`leadership-sequence-${option.value}`}
                          checked={newLeadershipAbility.job_sequences?.includes(option.label)}
                          onChange={() => {
                            const currentSequences = newLeadershipAbility.job_sequences || [];
                            const isSelected = currentSequences.includes(option.label);

                            if (isSelected) {
                              // 移除已选项
                              setNewLeadershipAbility({
                                ...newLeadershipAbility,
                                job_sequences: currentSequences.filter(s => s !== option.label)
                              });
                            } else {
                              // 添加新选项
                              setNewLeadershipAbility({
                                ...newLeadershipAbility,
                                job_sequences: [...currentSequences, option.label]
                              });
                            }
                          }}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                        />
                        <label htmlFor={`leadership-sequence-${option.value}`} className="text-sm">{option.label}</label>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {newLeadershipAbility.job_sequences?.map((sequence, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center"
                  >
                    <span>{sequence}</span>
                    <button
                      type="button"
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        const newSequences = [...(newLeadershipAbility.job_sequences || [])];
                        newSequences.splice(index, 1);
                        setNewLeadershipAbility({ ...newLeadershipAbility, job_sequences: newSequences });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowCreateLeadershipDialog(false)}>取消</Button>
            <Button onClick={handleCreateLeadershipAbility}>确认</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 通用素质创建弹窗 */}
      <Dialog open={showCreateGeneralDialog} onOpenChange={setShowCreateGeneralDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>创建通用素质</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">素质编码</label>
                <Input
                  name="code"
                  value={newGeneralAbility.code || "G-COM-"}
                  onChange={handleGeneralAbilityChange}
                  placeholder="如 G-COM-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">素质名称</label>
                <Input
                  name="name"
                  value={newGeneralAbility.name}
                  onChange={handleGeneralAbilityChange}
                  placeholder="如 沟通协作能力"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">素质类型</label>
              <Input
                name="type"
                value="通用素质"
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">核心定义</label>
              <Input
                name="core_definition"
                value={newGeneralAbility.core_definition || ""}
                onChange={handleGeneralAbilityChange}
                placeholder="如 有效传递信息并协调多方达成共识"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">分级行为标准</label>
              <div className="flex items-center space-x-2 mb-2">
                <Select
                  value={newGeneralAbility.level || ""}
                  onValueChange={(value) => setNewGeneralAbility({ ...newGeneralAbility, level: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="选择等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">1级 (L1)</SelectItem>
                    <SelectItem value="L2">2级 (L2)</SelectItem>
                    <SelectItem value="L3">3级 (L3)</SelectItem>
                    <SelectItem value="L4">4级 (L4)</SelectItem>
                    <SelectItem value="L5">5级 (L5)</SelectItem>
                    <SelectItem value="L6">6级 (L6)</SelectItem>
                    <SelectItem value="L7">7级 (L7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                name="level_description"
                value={newGeneralAbility.level_description || ""}
                onChange={handleGeneralAbilityChange}
                placeholder="如 L3能协调多方意见达成共识"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowCreateGeneralDialog(false)}>取消</Button>
            <Button onClick={handleCreateGeneralAbility}>确认</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加确认删除对话框 */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              确定要删除 "{itemToDelete?.name || '此项'}" 吗？此操作无法撤销。
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>取消</Button>
            <Button
              variant="destructive"
              onClick={() => {
                const ability = abilities.find(a => a.id === selectedAbilityId);
                if (ability && itemToDelete) {
                  handleDeleteAbilityItem(ability, itemToDelete.id);
                }
              }}
            >
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 创建知识技能对话框 */}
      <Dialog open={showCreateKnowledgeDialog} onOpenChange={setShowCreateKnowledgeDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>创建知识技能</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">技能编码</label>
                <Input
                  name="code"
                  value={newAbility.code || ""}
                  onChange={handleAbilityChange}
                  placeholder="如 K001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">技能名称</label>
                <Input
                  name="name"
                  value={newAbility.name}
                  onChange={handleAbilityChange}
                  placeholder="如 数据分析"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">适用岗位</label>
              <Input
                name="positions"
                value={newAbility.positions || ""}
                onChange={handleAbilityChange}
                placeholder="如 数据分析师,业务分析师"
              />
              <p className="text-xs text-gray-500">多个岗位使用逗号分隔</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">技能等级</label>
                <Select
                  name="level"
                  value={newAbility.level || ""}
                  onValueChange={(value) => handleAbilityChange({
                    target: { name: "level", value }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T1">T1 - 入门级</SelectItem>
                    <SelectItem value="T2">T2 - 初级</SelectItem>
                    <SelectItem value="T3">T3 - 中级</SelectItem>
                    <SelectItem value="T4">T4 - 高级</SelectItem>
                    <SelectItem value="T5">T5 - 专家级</SelectItem>
                    <SelectItem value="T6">T6 - 高级专家级</SelectItem>
                    <SelectItem value="T7">T7 - 资深专家级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">技能描述</label>
              <Textarea
                name="description"
                value={newAbility.description}
                onChange={handleAbilityChange}
                placeholder="描述该技能的详细内容和要求"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateKnowledgeDialog(false)}>取消</Button>
            <Button
              onClick={() => {
                if (!newAbility.name) {
                  alert("请填写技能名称");
                  return;
                }
                if (selectedAbilityId) {
                  handleCreateAbilityItem(selectedAbilityId);
                  setShowCreateKnowledgeDialog(false);
                }
              }}
            >
              创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 在页面底部添加素质类示例弹窗 */}
      <Dialog open={showQualityExampleDialog} onOpenChange={setShowQualityExampleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>素质类能力项填写示例</DialogTitle>
          </DialogHeader>
          {/* Tab切换 */}
          <div className="flex space-x-2 mb-4">
            <Button
              variant={qualityExampleTab === 'professional' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQualityExampleTab('professional')}
            >专业素质</Button>
            <Button
              variant={qualityExampleTab === 'leadership' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQualityExampleTab('leadership')}
            >领导力素质</Button>
            <Button
              variant={qualityExampleTab === 'general' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQualityExampleTab('general')}
            >通用素质</Button>
          </div>
          {/* 示例内容渲染 */}
          {qualityExampleTab === 'professional' && (
            <div className="space-y-2 text-sm text-gray-700">
              <div><b>素质编码：</b> F-PRO-001</div>
              <div><b>素质名称：</b> 沟通协作</div>
              <div><b>素质类型：</b> 专业素质</div>
              <div><b>素质定义：</b> 能够有效协调团队成员达成目标</div>
              <div><b>适用岗位：</b> 所有岗位</div>
              <div><b>能力等级描述：</b></div>
              <ul className="pl-5 list-disc text-xs text-gray-600">
                <li><b>1：</b> 能够理解团队目标，参与团队讨论</li>
                <li><b>2：</b> 能主动表达观点，配合他人完成任务</li>
                <li><b>3：</b> 能协调团队成员解决分歧</li>
                <li><b>4：</b> 能带领小组高效协作</li>
                <li><b>5：</b> 能推动跨部门团队达成复杂目标</li>
              </ul>
            </div>
          )}
          {qualityExampleTab === 'leadership' && (
            <div className="space-y-2 text-sm text-gray-700">
              <div><b>素质编码：</b> L-LEAD-102</div>
              <div><b>素质名称：</b> 战略决策能力</div>
              <div><b>素质类型：</b> 领导力素质</div>
              <div><b>核心定义：</b> 能在不确定性中做出推动业务突破的决策</div>
              <div><b>适用层级：</b> M4（副总裁及以上）</div>
              <div><b>能力等级描述：</b></div>
              <ul className="pl-5 list-disc text-xs text-gray-600">
                <li><b>1：</b> 能理解公司战略方向</li>
                <li><b>2：</b> 能参与部门战略讨论</li>
                <li><b>3：</b> 能独立制定本部门发展规划</li>
                <li><b>4：</b> 能主导制定3-5年战略规划并推动落地</li>
                <li><b>5：</b> 能引领公司实现战略性突破</li>
              </ul>
            </div>
          )}
          {qualityExampleTab === 'general' && (
            <div className="space-y-2 text-sm text-gray-700">
              <div><b>素质编码：</b> G-COM-001</div>
              <div><b>素质名称：</b> 沟通能力</div>
              <div><b>素质类型：</b> 通用素质</div>
              <div><b>核心定义：</b> 能有效传递信息并协调多方达成共识</div>
              <div><b>适用岗位：</b> 所有岗位</div>
              <div><b>能力等级描述：</b></div>
              <ul className="pl-5 list-disc text-xs text-gray-600">
                <li><b>1：</b> 能清楚表达基本信息</li>
                <li><b>2：</b> 能主动倾听他人意见</li>
                <li><b>3：</b> 能协调多方意见达成共识</li>
                <li><b>4：</b> 能在复杂场景下高效沟通</li>
                <li><b>5：</b> 能影响和引导他人观点</li>
              </ul>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowQualityExampleDialog(false)}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 在页面底部添加知识技能类示例弹窗 */}
      <Dialog open={showKnowledgeExampleDialog} onOpenChange={setShowKnowledgeExampleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>知识技能类能力项填写示例</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-gray-700">
            <div><b>能力编码：</b> K001</div>
            <div><b>能力名称：</b> 财务报表分析</div>
            <div><b>能力类型：</b> 知识技能类</div>
            <div><b>能力定义：</b> 能运用Python完成数据清洗和可视化分析</div>
            <div><b>适用岗位：</b> 财务岗, 数据分析岗</div>
            <div><b>能力等级描述：</b></div>
            <ul className="pl-5 list-disc text-xs text-gray-600">
              <li><b>1：</b> 能够识别基本财务报表结构</li>
              <li><b>2：</b> 能够独立完成常规财务数据录入</li>
              <li><b>3：</b> 能够分析财务报表并发现异常</li>
              <li><b>4：</b> 能够结合业务场景进行多维度分析</li>
              <li><b>5：</b> 能够设计自动化分析流程并指导他人</li>
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowKnowledgeExampleDialog(false)}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}