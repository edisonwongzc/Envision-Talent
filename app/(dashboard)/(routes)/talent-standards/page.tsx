'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, EditIcon, XIcon } from "@/components/icons/index";
import { Check as CheckIcon } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MatchingPage from "./matching-page";
import HorizontalComparisonModal from "./horizontal-comparison-modal";
import { useRouter } from 'next/navigation';
import { 
  VisionSpiritContent, 
  WorkHistoryContent,
  JobMatchingContent,
  PerformanceContent
} from './profile-detail';
import { JobModelContent, PersonalInfoContent } from './components/TabContents';
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
  level: string;
  description: string;
  positions: string[];
  createdAt: string;
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
  const [showPositions, setShowPositions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{name: string; position: string} | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showSpiritRadarModal, setShowSpiritRadarModal] = useState(false);
  const [showHorizontalComparisonModal, setShowHorizontalComparisonModal] = useState(false);
  const [showCreateAbilityDialog, setShowCreateAbilityDialog] = useState(false);
  const [showCreatePositionDialog, setShowCreatePositionDialog] = useState(false);
  const [newAbility, setNewAbility] = useState<NewAbility>({
    name: "",
    description: "",
    type: "知识技能",
    tag: ""
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

  const selectEmployee = (employee: {name: string; position: string} | null) => {
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
      level: newAbility.level || "",
      description: newAbility.description,
      positions: newAbility.positions ? newAbility.positions.split(',').map(p => p.trim()) : [],
      createdAt: new Date().toLocaleString()
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
      level: "",
      positions: ""
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
    searchSequence: ""
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
      createdAt: new Date().toISOString()
    };
    
    // 更新能力库
    const updatedAbilities = [...abilities];
    const targetAbility = updatedAbilities[targetAbilityIndex];
    
    if (!targetAbility.skillItems) {
      targetAbility.skillItems = [];
    }
    
    targetAbility.skillItems.push(newSkillItem);
    targetAbility.count = targetAbility.skillItems.length;
    
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
      searchSequence: ""
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
    
    targetAbility.skillItems.push(newSkillItem);
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
    
    targetAbility.skillItems.push(newSkillItem);
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      setSelectedItems([...selectedItems, ...allItemIds]);
    } else {
      const filterIds = ability.skillItems
        .filter(item => item.code?.startsWith(prefix))
        .map(item => item.id);
      setSelectedItems(selectedItems.filter(id => !filterIds.includes(id)));
    }
  };

  // 添加处理批量删除的函数
  const handleBatchDelete = (ability: AbilityItem) => {
    if (!ability || !ability.skillItems || selectedItems.length === 0) return;
    
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
    setSelectedItems([]);
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
      case '远景精神':
        return <VisionSpiritContent />;
      case '个人信息':
        return <PersonalInfoContent />;
      case '岗位模型':
        return <JobModelContent />;
      case '工作履历':
        return <WorkHistoryContent />;
      case '人岗匹配':
        return <JobMatchingContent />;
      case '绩效信息':
        return <PerformanceContent />;
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
  
  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-2 bg-[#F3F7FA]">
      <div className="mb-1">
        <h1 className="text-[18px] font-bold text-gray-800">人才标准</h1>
        <p className="text-sm text-gray-500">管理能力库、岗位模型和人才履历</p>
      </div>

      <Tabs defaultValue="ability" className="w-full mt-8">
        <TabsList className="w-full flex justify-start space-x-6 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger 
            value="ability" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            能力库&能力模型
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
        
          {/* 能力库管理模块 */}
        <TabsContent value="ability" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6">
            {/* 能力库 */}
            {abilities.map(ability => (
              <Card key={ability.id} className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                      <div>
                    <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">{ability.name}</CardTitle>
                    <CardDescription className="text-xs">{ability.description}</CardDescription>
                      </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        setNewAbility({
                          name: "",
                          description: "",
                          type: ability.type,
                          code: "",
                          level: "",
                          positions: ""
                        });
                        setUploadAbilityId(ability.id);
                        setShowUploadDialog(true);
                      }}
                    >
                      批量导入
                    </Button>
                    
                    <Button
                      className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                      onClick={() => {
                        setNewAbility({
                          name: "",
                          description: "",
                          type: ability.type,
                          code: "",
                          level: "",
                          positions: ""
                        });
                        setSelectedAbilityId(ability.id);
                        if (ability.type === "知识技能") {
                          setShowCreateKnowledgeDialog(true);
                        } else if (ability.type === "素质") {
                          setCurrentQualityTab("专业素质");
                          setShowCreateProfessionalDialog(true);
                        }
                      }}
                    >
                      <PlusIcon size={14} className="mr-1" />
                      添加{ability.type === "知识技能" ? "技能" : "素质"}
                    </Button>
                                </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* 标签筛选 - 仅素质类显示标签 */}
                  {ability.type === "素质" && ability.tags && ability.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex space-x-2 mb-2">
                        {ability.tags.map(tag => (
                          <Button
                            key={tag}
                            variant={currentQualityTab === tag ? "default" : "outline"}
                            size="sm"
                            className={`text-xs h-7 ${currentQualityTab === tag ? 'bg-[#3C5E5C] hover:bg-[#2A4A48]' : ''}`}
                            onClick={() => setCurrentQualityTab(tag)}
                          >
                            {tag}
                          </Button>
                                    ))}
                                  </div>
                      <div className="h-px bg-gray-200"></div>
                            </div>
                          )}
                  
                  {/* 技能项表格 */}
                  {ability.skillItems && ability.skillItems.length > 0 ? (
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                  <input
                                    type="checkbox"
                                className="rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                onChange={(e) => {
                                  // 根据能力类型确定前缀
                                  const prefix = ability.type === "知识技能" ? "K" : 
                                    currentQualityTab === "专业素质" ? "F-PRO" : 
                                    currentQualityTab === "领导力素质" ? "L-LEAD" : "G-COM";
                                  toggleSelectAll(ability, prefix, e.target.checked);
                                }}
                              />
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              编码
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              名称
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              等级
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              适用岗位
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ability.skillItems
                            .filter(item => {
                              // 如果是素质类，根据当前选中的标签筛选
                              if (ability.type === "素质") {
                                if (currentQualityTab === "专业素质" && item.code?.startsWith("F-PRO")) return true;
                                if (currentQualityTab === "领导力素质" && item.code?.startsWith("L-LEAD")) return true;
                                if (currentQualityTab === "通用素质" && item.code?.startsWith("G-COM")) return true;
                                return false;
                              }
                              return true;
                            })
                            .map(item => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                          type="checkbox"
                                    className="rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                          checked={selectedItems.includes(item.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedItems([...selectedItems, item.id]);
                                            } else {
                                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                                            }
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.code}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.level}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex flex-wrap gap-1">
                                    {item.positions.map((position, index) => (
                                      <span 
                                        key={index} 
                                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                      >
                                        {position}
                                      </span>
                                    ))}
                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex space-x-3">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs h-7"
                                      onClick={() => {
                                        openItemDetail(item);
                                      }}
                                    >
                                      查看
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs h-7 text-red-600"
                                      onClick={() => {
                                          setItemToDelete(item);
                                          setSelectedAbilityId(ability.id);
                                          setShowDeleteConfirmDialog(true);
                                        }}
                                      >
                                      删除
                                    </Button>
                                    </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                            </div>
                          ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">暂无{ability.type}数据</p>
                      <Button
                        className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                        onClick={() => {
                          setNewAbility({
                            name: "",
                            description: "",
                            type: ability.type,
                            code: "",
                            level: "",
                            positions: ""
                          });
                          setSelectedAbilityId(ability.id);
                          if (ability.type === "知识技能") {
                            setShowCreateKnowledgeDialog(true);
                          } else if (ability.type === "素质") {
                            setCurrentQualityTab("专业素质");
                            setShowCreateProfessionalDialog(true);
                          }
                        }}
                      >
                        <PlusIcon size={14} className="mr-1" />
                        添加{ability.type === "知识技能" ? "技能" : "素质"}
                      </Button>
                                </div>
                              )}
                  
                  {/* 批量操作按钮 */}
                                  {selectedItems.length > 0 && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs h-7"
                                      onClick={() => handleBatchDelete(ability)}
                                    >
                        批量删除 ({selectedItems.length})
                      </Button>
                                </div>
                              )}
                </CardContent>
              </Card>
            ))}
            
            {/* 添加能力库卡片 */}
            <Card className="shadow-sm border-dashed border-gray-300 bg-white rounded-lg overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <PlusIcon size={24} className="text-gray-400" />
                          </div>
                <h3 className="text-base font-medium text-gray-700 mb-2">添加新能力库</h3>
                <p className="text-sm text-gray-500 text-center mb-4 max-w-md">
                  创建新的能力库类别，如专业技能、管理能力等
                </p>
                <Button
                  className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                  onClick={() => setShowCreateAbilityDialog(true)}
                >
                  创建能力库
                </Button>
              </CardContent>
            </Card>
            
            {/* 岗位模型卡片 */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">岗位模型</h2>
              <div className="grid grid-cols-1 gap-6">
                {positions.map(position => (
                  <Card key={position.id} className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                      <div>
                        <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">{position.name}</CardTitle>
                        <CardDescription className="text-xs">{position.description}</CardDescription>
                      </div>
                <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                        >
                          查看详情
                  </Button>
                        <Button
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 text-red-600"
                          onClick={() => handleDeletePosition(position.id)}
                        >
                          删除
                        </Button>
                      </div>
              </CardHeader>
              <CardContent className="p-6">
                      <div className="flex justify-between text-sm">
                      <div>
                          <span className="text-gray-500">模型类型：</span>
                          <span className="text-gray-700">{position.type}</span>
                      </div>
                        <div>
                          <span className="text-gray-500">能力项数量：</span>
                          <span className="text-gray-700">{position.count}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">创建时间：</span>
                          <span className="text-gray-700">{formatDate(position.date)}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
                ))}
                
                {/* 添加岗位模型卡片 */}
                <Card className="shadow-sm border-dashed border-gray-300 bg-white rounded-lg overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <PlusIcon size={24} className="text-gray-400" />
                </div>
                    <h3 className="text-base font-medium text-gray-700 mb-2">添加新岗位模型</h3>
                    <p className="text-sm text-gray-500 text-center mb-4 max-w-md">
                      创建新的岗位模型，定义岗位所需的能力要求
                    </p>
                    <Button
                      className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                      onClick={() => setShowCreatePositionDialog(true)}
                    >
                      创建岗位模型
                    </Button>
              </CardContent>
            </Card>
              </div>
            </div>
          </div>
        </TabsContent>

          {/* 人才履历模块 */}
        <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-gray-100">
                                <div className="flex justify-between items-center">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">人才履历</CardTitle>
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
          <MatchingPage />
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
                  <label className="text-sm font-medium">能力等级</label>
                  <Input
                    value={selectedItem.level}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
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
                  value={newProfessionalAbility.code || ""}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">素质类型</label>
                <Input
                  name="type"
                  value="专业素质"
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">等级划分</label>
                <Select 
                  value={newProfessionalAbility.level || ""} 
                  onValueChange={(value) => setNewProfessionalAbility({...newProfessionalAbility, level: value})}
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">分级行为标准</label>
              <div className="flex items-center space-x-2 mb-2">
                <Select 
                  value={newProfessionalAbility.level || ""} 
                  onValueChange={(value) => setNewProfessionalAbility({...newProfessionalAbility, level: value})}
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
                  </SelectContent>
                </Select>
                <span className="text-xs text-gray-500">选择要添加行为标准的等级</span>
              </div>
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
                        setNewProfessionalAbility({...newProfessionalAbility, job_sequences: newSequences});
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
                  value={newLeadershipAbility.code || ""}
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
                  onValueChange={(value) => setNewLeadershipAbility({...newLeadershipAbility, level: value})}
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">分级行为标准</label>
              <div className="flex items-center space-x-2 mb-2">
                <Select 
                  value={newLeadershipAbility.level || ""} 
                  onValueChange={(value) => setNewLeadershipAbility({...newLeadershipAbility, level: value})}
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
                  </SelectContent>
                </Select>
                <span className="text-xs text-gray-500">选择要添加行为标准的等级</span>
              </div>
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
                        setNewLeadershipAbility({...newLeadershipAbility, job_sequences: newSequences});
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
                  value={newGeneralAbility.code || ""}
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
                  onValueChange={(value) => setNewGeneralAbility({...newGeneralAbility, level: value})}
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
    </div>
  );
} 