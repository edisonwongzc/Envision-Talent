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

  // 添加评审流程相关状态变量
  const [showReviewSelectionMode, setShowReviewSelectionMode] = useState(false);
  const [employeesToReview, setEmployeesToReview] = useState<string[]>([]);
  const [showReviewConfirmDialog, setShowReviewConfirmDialog] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // 初始化选择所有员工的函数
  const initializeEmployeesToReview = () => {
    // 这里应该是从数据中获取所有员工名称
    const allEmployees = [
      "Anders Wahlström", 
      "Anthony Chong", 
      "王五", 
      "赵六", 
      "林一"
    ];
    setEmployeesToReview(allEmployees);
  };

  // 切换单个员工的评审选择状态
  const toggleEmployeeReviewSelection = (employeeName: string) => {
    if (employeesToReview.includes(employeeName)) {
      setEmployeesToReview(employeesToReview.filter(name => name !== employeeName));
    } else {
      setEmployeesToReview([...employeesToReview, employeeName]);
    }
  };

  // 处理发起评审流程按钮点击
  const handleInitiateReview = () => {
    setShowReviewSelectionMode(true);
    initializeEmployeesToReview();
  };

  // 处理确认发起评审
  const handleConfirmReview = () => {
    // 这里可以添加实际的API调用
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewConfirmDialog(false);
      setShowReviewSelectionMode(false);
    }, 2000);
  };

  // 在TalentStandardsPage组件中添加新的状态变量
  const [selectedKnowledgeSkill, setSelectedKnowledgeSkill] = useState<AbilitySkillItem | null>(null);
  
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
        
        <TabsContent value="ability" className="space-y-6 mt-6">
          {/* 能力库管理模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">能力库管理</CardTitle>
                <div className="flex space-x-2">
                  {/* 移除顶部的创建按钮 */}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* 改为垂直布局，移除grid相关类 */}
                <div className="space-y-6">
                  {/* 知识技能类卡片 */}
                  {abilities.filter(ability => ability.type === "知识技能").map((ability) => (
                    <div key={ability.id} className="rounded-lg border border-gray-200 bg-white transition-shadow flex flex-col min-h-[500px]">
                      <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                            <h3 className="font-semibold text-sm text-gray-800 mb-2">{ability.name}</h3>
                            <p className="text-sm text-gray-600">{ability.description}</p>
                      </div>
                        </div>
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
                                checked={ability.skillItems?.every(item => selectedItems.includes(item.id)) || false}
                                onChange={(e) => toggleSelectAll(ability, '', e.target.checked)}
                              />
                              <span className="text-xs text-gray-500 ml-2">全选</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {selectedItems.length > 0 && (
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
                                  if (open) setNewAbility({...newAbility, type: ability.type});
                                }}
                              >
                                <DialogTrigger asChild>
                                  <button className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded">
                                    <PlusIcon size={12} className="mr-1" />
                                    <span>添加</span>
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px]">
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
                                          onChange={(e) => setNewAbility({...newAbility, code: e.target.value})}
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
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">能力等级</label>
                                        <Select 
                                          value={newAbility.level || ""} 
                                          onValueChange={(value) => setNewAbility({...newAbility, level: value})}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="请选择等级" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="T1">T1</SelectItem>
                                            <SelectItem value="T2">T2</SelectItem>
                                            <SelectItem value="T3">T3</SelectItem>
                                            <SelectItem value="T4">T4</SelectItem>
                                            <SelectItem value="T5">T5</SelectItem>
                                            <SelectItem value="T6">T6</SelectItem>
                                            <SelectItem value="T7">T7</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">能力描述</label>
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
                                        onChange={(e) => setNewAbility({...newAbility, positions: e.target.value})}
                                        placeholder="如 财务岗（多个岗位用逗号分隔）"
                                      />
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
                                className={`text-sm text-gray-600 p-2 rounded cursor-pointer transition-colors border ${
                                  selectedKnowledgeSkill?.id === item.id 
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
                                      checked={selectedItems.includes(item.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedItems([...selectedItems, item.id]);
                                        } else {
                                          setSelectedItems(selectedItems.filter(id => id !== item.id));
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
                                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                    {item.level}
                                  </span>
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
                                        setEditingSkill({...selectedKnowledgeSkill});
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
                                    onChange={(e) => setEditingSkill({...editingSkill!, code: e.target.value})}
                                    className={isEditing ? "bg-white" : "bg-gray-50"}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力名称</label>
                                  <Input
                                    value={isEditing ? editingSkill?.name : selectedKnowledgeSkill.name}
                                    readOnly={!isEditing}
                                    onChange={(e) => setEditingSkill({...editingSkill!, name: e.target.value})}
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
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">能力等级</label>
                                  {isEditing ? (
                                    <Select 
                                      value={editingSkill?.level || ""} 
                                      onValueChange={(value) => setEditingSkill({...editingSkill!, level: value})}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="请选择等级" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="T1">T1</SelectItem>
                                        <SelectItem value="T2">T2</SelectItem>
                                        <SelectItem value="T3">T3</SelectItem>
                                        <SelectItem value="T4">T4</SelectItem>
                                        <SelectItem value="T5">T5</SelectItem>
                                        <SelectItem value="T6">T6</SelectItem>
                                        <SelectItem value="T7">T7</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      value={selectedKnowledgeSkill.level}
                                      readOnly
                                      className="bg-gray-50"
                                    />
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">能力描述</label>
                                <Textarea
                                  value={isEditing ? editingSkill?.description : selectedKnowledgeSkill.description}
                                  readOnly={!isEditing}
                                  onChange={(e) => setEditingSkill({...editingSkill!, description: e.target.value})}
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
                                    {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((level) => (
                                      <div key={level} className="text-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs ${
                                          (isEditing ? editingSkill?.level : selectedKnowledgeSkill.level) === level 
                                            ? 'bg-[#3C5E5C] text-white' 
                                            : 'bg-gray-200 text-gray-700'
                                        }`}>{level}</div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-300 -z-10"></div>
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
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
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

                  {/* 素质类卡片 - 添加内嵌标签页 */}
                  {abilities.filter(ability => ability.type === "素质").map((ability) => (
                    <div key={ability.id} className="rounded-lg border border-gray-200 p-4 bg-white transition-shadow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className="font-semibold text-sm text-gray-800 mb-2">{ability.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{ability.description}</p>
                      </div>
                      </div>

                      {/* 素质类内嵌标签页 */}
                      <Tabs 
                        defaultValue="professional" 
                        className="w-full mt-2"
                        onValueChange={(value) => setCurrentQualityTab(value)}
                      >
                        <TabsList className="w-full flex justify-start space-x-2 bg-gray-50 p-1 rounded">
                          <TabsTrigger 
                            value="professional" 
                            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs py-1.5"
                          >
                            专业素质
                          </TabsTrigger>
                          <TabsTrigger 
                            value="leadership" 
                            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs py-1.5"
                          >
                            领导力素质
                          </TabsTrigger>
                          <TabsTrigger 
                            value="general" 
                            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs py-1.5"
                          >
                            通用素质
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* 专业素质标签内容 */}
                        <TabsContent value="professional" className="mt-4">
                          {ability.skillItems && ability.skillItems.filter(item => item.code?.startsWith('F-PRO')).length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex justify-end mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">全选</span>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                    checked={ability.skillItems?.filter(item => item.code?.startsWith('F-PRO')).every(item => selectedItems.includes(item.id)) || false}
                                    onChange={(e) => toggleSelectAll(ability, 'F-PRO', e.target.checked)}
                                  />
                                  {selectedItems.length > 0 && (
                                    <button 
                                      className="text-xs text-red-600 hover:text-red-800 ml-2"
                                      onClick={() => handleBatchDelete(ability)}
                                    >
                                      删除
                      </button>
                                  )}
                    </div>
                    </div>
                              <div className="grid grid-cols-3 gap-2">
                                {ability.skillItems?.filter(item => item.code?.startsWith('F-PRO')).slice(0, 6).map((item) => (
                                  <div 
                                    key={item.id} 
                                    className="text-sm text-gray-600 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors border border-gray-100"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center flex-grow" onClick={() => openItemDetail(item)}>
                                        <input
                                          type="checkbox"
                                          className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                          checked={selectedItems.includes(item.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedItems([...selectedItems, item.id]);
                                            } else {
                                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                                            }
                                            e.stopPropagation();
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="truncate">
                                          <span>{item.name}</span>
                                          <span className="mx-1 text-xs text-gray-400">({item.code})</span>
                                          <span className="text-gray-500">{item.level}</span>
                  </div>
                                      </div>
                                      <button 
                                        className="text-gray-400 hover:text-red-600 ml-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setItemToDelete(item);
                                          setSelectedAbilityId(ability.id);
                                          setShowDeleteConfirmDialog(true);
                                        }}
                                      >
                                        <XIcon size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {ability.skillItems.filter(item => item.code?.startsWith('F-PRO')).length > 6 && (
                                <div className="text-sm text-[#3C5E5C] mt-2 text-right">
                                  更多 {ability.skillItems.filter(item => item.code?.startsWith('F-PRO')).length - 6} 项...
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-sm text-gray-500 mb-4">暂无专业素质能力项</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        {/* 领导力素质标签内容 */}
                        <TabsContent value="leadership" className="mt-4">
                          {ability.skillItems && ability.skillItems.filter(item => item.code?.startsWith('L-LEAD')).length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex justify-end mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">全选</span>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                    checked={ability.skillItems?.filter(item => item.code?.startsWith('L-LEAD')).every(item => selectedItems.includes(item.id)) || false}
                                    onChange={(e) => toggleSelectAll(ability, 'L-LEAD', e.target.checked)}
                                  />
                                  {selectedItems.length > 0 && (
                                    <button 
                                      className="text-xs text-red-600 hover:text-red-800 ml-2"
                                      onClick={() => handleBatchDelete(ability)}
                                    >
                                      删除
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {ability.skillItems?.filter(item => item.code?.startsWith('L-LEAD')).slice(0, 6).map((item) => (
                                  <div 
                                    key={item.id} 
                                    className="text-sm text-gray-600 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors border border-gray-100"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center flex-grow" onClick={() => openItemDetail(item)}>
                                        <input
                                          type="checkbox"
                                          className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                          checked={selectedItems.includes(item.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedItems([...selectedItems, item.id]);
                                            } else {
                                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                                            }
                                            e.stopPropagation();
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="truncate">
                                          <span>{item.name}</span>
                                          <span className="mx-1 text-xs text-gray-400">({item.code})</span>
                                          <span className="text-gray-500">{item.level}</span>
                                        </div>
                                      </div>
                                      <button 
                                        className="text-gray-400 hover:text-red-600 ml-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setItemToDelete(item);
                                          setSelectedAbilityId(ability.id);
                                          setShowDeleteConfirmDialog(true);
                                        }}
                                      >
                                        <XIcon size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {ability.skillItems.filter(item => item.code?.startsWith('L-LEAD')).length > 6 && (
                                <div className="text-sm text-[#3C5E5C] mt-2 text-right">
                                  更多 {ability.skillItems.filter(item => item.code?.startsWith('L-LEAD')).length - 6} 项...
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-sm text-gray-500 mb-4">暂无领导力素质能力项</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        {/* 通用素质标签内容 */}
                        <TabsContent value="general" className="mt-4">
                          {ability.skillItems && ability.skillItems.filter(item => item.code?.startsWith('G-COM')).length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex justify-end mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">全选</span>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                    checked={ability.skillItems?.filter(item => item.code?.startsWith('G-COM')).every(item => selectedItems.includes(item.id)) || false}
                                    onChange={(e) => toggleSelectAll(ability, 'G-COM', e.target.checked)}
                                  />
                                  {selectedItems.length > 0 && (
                                    <button 
                                      className="text-xs text-red-600 hover:text-red-800 ml-2"
                                      onClick={() => handleBatchDelete(ability)}
                                    >
                                      删除
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {ability.skillItems?.filter(item => item.code?.startsWith('G-COM')).slice(0, 6).map((item) => (
                                  <div 
                                    key={item.id} 
                                    className="text-sm text-gray-600 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors border border-gray-100"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center flex-grow" onClick={() => openItemDetail(item)}>
                                        <input
                                          type="checkbox"
                                          className="mr-2 h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                                          checked={selectedItems.includes(item.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedItems([...selectedItems, item.id]);
                                            } else {
                                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                                            }
                                            e.stopPropagation();
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="truncate">
                                          <span>{item.name}</span>
                                          <span className="mx-1 text-xs text-gray-400">({item.code})</span>
                                          <span className="text-gray-500">{item.level}</span>
                                        </div>
                                      </div>
                                      <button 
                                        className="text-gray-400 hover:text-red-600 ml-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setItemToDelete(item);
                                          setSelectedAbilityId(ability.id);
                                          setShowDeleteConfirmDialog(true);
                                        }}
                                      >
                                        <XIcon size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {ability.skillItems.filter(item => item.code?.startsWith('G-COM')).length > 6 && (
                                <div className="text-sm text-[#3C5E5C] mt-2 text-right">
                                  更多 {ability.skillItems.filter(item => item.code?.startsWith('G-COM')).length - 6} 项...
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-sm text-gray-500 mb-4">暂无通用素质能力项</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>

                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>
                              共
                              {currentQualityTab === "professional" 
                                ? ability.skillItems?.filter(item => item.code?.startsWith('F-PRO')).length || 0 
                                : currentQualityTab === "leadership"
                                  ? ability.skillItems?.filter(item => item.code?.startsWith('L-LEAD')).length || 0
                                  : ability.skillItems?.filter(item => item.code?.startsWith('G-COM')).length || 0
                              }
                              项能力
                            </span>
                            {currentQualityTab === "professional" && (
                              <button 
                                className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center ml-2 px-2 py-1 border border-[#3C5E5C] rounded"
                                onClick={() => setShowCreateProfessionalDialog(true)}
                              >
                                <PlusIcon size={12} className="mr-1" />
                                <span>添加专业素质</span>
                              </button>
                            )}
                            {currentQualityTab === "leadership" && (
                              <button 
                                className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center ml-2 px-2 py-1 border border-[#3C5E5C] rounded"
                                onClick={() => setShowCreateLeadershipDialog(true)}
                              >
                                <PlusIcon size={12} className="mr-1" />
                                <span>添加领导力素质</span>
                              </button>
                            )}
                            {currentQualityTab === "general" && (
                              <button 
                                className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center ml-2 px-2 py-1 border border-[#3C5E5C] rounded"
                                onClick={() => setShowCreateGeneralDialog(true)}
                              >
                                <PlusIcon size={12} className="mr-1" />
                                <span>添加通用素质</span>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                              onClick={() => {
                                // 根据当前选择的标签页设置下载模板的类型
                                const templateTypes = {
                                  professional: "专业素质",
                                  leadership: "领导力素质",
                                  general: "通用素质"
                                };
                                setTemplateType(templateTypes[currentQualityTab as keyof typeof templateTypes]);
                                setShowDownloadTemplateDialog(true);
                              }}
                            >
                              下载模板
                            </button>
                            <button 
                              className="text-xs text-[#3C5E5C] hover:text-[#2A4A48] flex items-center px-2 py-1 border border-[#3C5E5C] rounded"
                              onClick={() => {
                                // 根据当前选择的标签页下载对应模板
                                const templateTypes = {
                                  professional: "专业素质",
                                  leadership: "领导力素质",
                                  general: "通用素质"
                                };
                                handleDownloadTemplate(templateTypes[currentQualityTab as keyof typeof templateTypes]);
                              }}
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

          {/* 岗位模型管理模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">岗位模型管理</CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={showCreatePositionDialog} onOpenChange={setShowCreatePositionDialog}>
                    <DialogTrigger asChild>
                  <Button className="bg-[#426966] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                    <PlusIcon size={14} className="mr-1" />
                    创建
                  </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>创建岗位模型</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">岗位模型名称</label>
                          <Input 
                            name="name"
                            value={newPosition.name}
                            onChange={handlePositionChange}
                            placeholder="请输入岗位模型名称"
                          />
                </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">岗位模型描述</label>
                          <Textarea 
                            name="description"
                            value={newPosition.description}
                            onChange={handlePositionChange}
                            placeholder="请输入岗位模型描述"
                          />
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">岗位类型</label>
                          <select 
                            name="type"
                            value={newPosition.type}
                            onChange={handlePositionChange}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                          >
                            <option value="技术">技术</option>
                            <option value="管理">管理</option>
                            <option value="业务">业务</option>
                          </select>
                    </div>
                    </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreatePositionDialog(false)}>取消</Button>
                        <Button onClick={handleCreatePosition}>创建</Button>
                  </div>
                    </DialogContent>
                  </Dialog>
                      </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {positions.map((position) => (
                    <div key={position.id} className="rounded-lg border border-gray-200 p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                          <h3 className="font-semibold text-sm text-gray-800 mb-2">{position.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                      </div>
                        <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <EditIcon size={14} />
                      </button>
                          <button 
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleDeletePosition(position.id)}
                          >
                            <XIcon size={14} />
                      </button>
                        </div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                        <span>共{position.count}个岗位</span>
                        <span>{position.date}</span>
                    </div>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 岗位图谱模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">岗位图谱</CardTitle>
                <div className="flex space-x-2">
                  <Button className="bg-[#426966] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                    <PlusIcon size={14} className="mr-1" />
                    创建
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-start p-4 border border-gray-200">
                  <p className="text-gray-400">岗位图谱展示区域</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 mt-6">
          {/* 人才履历模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">人才履历</CardTitle>
                <div className="flex space-x-2">
                  <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs py-1 h-8 rounded-md px-3">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    点评
                  </Button>
                  <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs py-1 h-8 rounded-md px-3">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    编辑信息
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-lg p-6 mb-4 bg-white">
                  <div className="flex items-start">
                    <div className="mr-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-[#f0f5f5] border-2 border-white shadow-sm relative">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-800">张三</h3>
                            <span className="px-3 py-1 bg-[#E5EEEE] text-[#3C5E5C] text-xs font-medium rounded-full flex items-center">
                              <span className="mr-1 w-2 h-2 rounded-full bg-[#3C5E5C]"></span>
                              在线
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">高级开发工程师</p>
                        </div>
                        <Button 
                          className="bg-white border border-gray-300 text-[#3C5E5C] hover:bg-gray-50 text-xs py-1 h-8 rounded-md px-3"
                          onClick={() => setShowSpiritRadarModal(true)}
                        >
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2L12 22M2 12H22M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
                          </svg>
                          远景精神雷达图
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 mt-5">
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider">最后登录时间</p>
                          <p className="text-sm text-gray-800 mt-1">几秒前</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider">最后活动时间</p>
                          <p className="text-sm text-gray-800 mt-1">2天前</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider">员工ID</p>
                          <p className="text-sm text-gray-800 mt-1">#EMP07</p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-gray-500 text-xs mb-2">职业发展阶段</p>
                        <div className="flex items-center">
                          <div className="flex-1 relative">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="absolute top-0 left-0 h-2 bg-[#3C5E5C] rounded-full w-2/5"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                              <div className="text-gray-500">入职</div>
                              <div className="text-[#3C5E5C] font-medium -ml-3">胜任</div>
                              <div className="text-gray-500">精通</div>
                              <div className="text-gray-500">专家</div>
                              <div className="text-gray-500">领导者</div>
                            </div>
                          </div>
                          <div className="ml-4 px-3 py-1 rounded-md bg-[#3C5E5C] text-white text-xs">
                            40%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 mb-6">
                    <Button variant="ghost" className="flex-1 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      个人信息
                    </Button>
                    <Button variant="ghost" className="flex-1 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      能力评估
                    </Button>
                    <Button variant="ghost" className="flex-1 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      工作履历
                    </Button>
                    <Button variant="ghost" className="flex-1 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20v-6M6 20V10M18 20V4"></path>
                      </svg>
                      绩效信息
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg p-6 mb-4 bg-white border-t border-gray-200 mt-2">
                  <h3 style={{color: '#3C5E5C'}} className="text-sm font-medium mb-4">个人履历详情</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">教育背景</p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">计算机科学与技术 - 硕士</p>
                            <p className="text-sm text-gray-500">清华大学 (2014 - 2017)</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">软件工程 - 学士</p>
                            <p className="text-sm text-gray-500">北京大学 (2010 - 2014)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">专业证书</p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">高级系统架构师认证</p>
                            <p className="text-sm text-gray-500">2022年获得</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">项目管理专业认证(PMP)</p>
                            <p className="text-sm text-gray-500">2020年获得</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">员工潜力</p>
                        <div className="flex items-center mt-1">
                          <div className="w-32 mr-3">
                            <div className="bg-gray-200 h-2 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#3C5E5C] rounded-full w-[85%]"></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-[#3C5E5C]">高潜力人才</span>
                          <span className="ml-2 px-2 py-0.5 bg-[#E5EEEE] text-[#3C5E5C] text-xs rounded">85%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">推荐晋升路径：技术专家 → 架构师 → 技术总监</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">工作经历</p>
                        <div className="space-y-3">
                          <div className="border-l-2 border-[#3C5E5C] pl-3 py-1">
                            <p className="text-sm font-medium text-gray-800">高级开发工程师</p>
                            <p className="text-sm text-gray-500">本公司 (2020 - 至今)</p>
                          </div>
                          <div className="border-l-2 border-gray-300 pl-3 py-1">
                            <p className="text-sm font-medium text-gray-800">开发工程师</p>
                            <p className="text-sm text-gray-500">某科技公司 (2017 - 2020)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">职位详情</p>
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500">职级</p>
                              <p className="text-sm font-medium text-gray-800">P6</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">直接上级</p>
                              <p className="text-sm font-medium text-gray-800">李四（技术总监）</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500">汇报关系</p>
                              <p className="text-sm font-medium text-gray-800">研发部 → 产品技术中心</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">专业技能</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">React</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Node.js</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">微服务架构</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">云原生</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">系统设计</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg p-6 mb-4 bg-white border-t border-gray-200 mt-2">
                  <h3 style={{color: '#3C5E5C'}} className="text-sm font-medium mb-4">职责与培训</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">主要职责</p>
                      <ul className="list-disc pl-4 text-sm space-y-2 text-gray-700">
                        <li>负责核心模块的架构设计与实现</li>
                        <li>指导初级开发人员技术成长</li>
                        <li>参与技术评审与技术选型</li>
                        <li>负责系统性能优化与稳定性保障</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">培训记录</p>
                      <div className="space-y-3">
                        <div className="flex items-center border-l-2 border-green-500 pl-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">高级管理培训</p>
                            <p className="text-xs text-gray-500">2023年12月</p>
                          </div>
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            90分（优秀）
                          </div>
                        </div>
                        <div className="flex items-center border-l-2 border-green-500 pl-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">微服务架构实践</p>
                            <p className="text-xs text-gray-500">2022年6月</p>
                          </div>
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            95分（优秀）
                          </div>
                        </div>
                        <div className="flex items-center border-l-2 border-blue-500 pl-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">团队领导力</p>
                            <p className="text-xs text-gray-500">2021年3月</p>
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            88分（良好）
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg p-6 mb-4 bg-white border-t border-gray-200 mt-2">
                  <h3 style={{color: '#3C5E5C'}} className="text-sm font-medium mb-4">绩效详情</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium text-gray-700">2023年</div>
                      <div className="flex-1 mr-4 relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="absolute top-0 left-0 h-2 bg-green-500 rounded-full w-[95%]"></div>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold min-w-[36px] text-center">
                        A+
                      </div>
                      <div className="text-xs text-gray-500 ml-2">95%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium text-gray-700">2022年</div>
                      <div className="flex-1 mr-4 relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="absolute top-0 left-0 h-2 bg-green-500 rounded-full w-[85%]"></div>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold min-w-[36px] text-center">
                        A
                      </div>
                      <div className="text-xs text-gray-500 ml-2">85%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium text-gray-700">2021年</div>
                      <div className="flex-1 mr-4 relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full w-[75%]"></div>
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold min-w-[36px] text-center">
                        B+
                      </div>
                      <div className="text-xs text-gray-500 ml-2">75%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 text-sm font-medium text-gray-700">2020年</div>
                      <div className="flex-1 mr-4 relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full w-[70%]"></div>
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold min-w-[36px] text-center">
                        B
                      </div>
                      <div className="text-xs text-gray-500 ml-2">70%</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg p-6 mb-4 bg-white border-t border-gray-200 mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 style={{color: '#3C5E5C'}} className="text-sm font-medium">能力评估与岗位匹配</h3>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <div
                          className={`border border-gray-300 rounded-md px-3 py-1 h-8 flex items-center justify-between text-xs min-w-[120px] cursor-pointer text-gray-800`}
                          onClick={togglePositions}
                        >
                          <span>{selectedPosition || "选择岗位"}</span>
                          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                        {showPositions && (
                          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <ul className="py-1 max-h-[200px] overflow-y-auto">
                              <li
                                className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer text-gray-500 border-b border-gray-100"
                                onClick={() => selectPosition("选择岗位")}
                              >
                                选择岗位
                              </li>
                              {positions.map((position) => (
                                <li 
                                  key={position.id}
                                  className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                                  onClick={() => selectPosition(position.name)}
                                >
                                  {position.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Button 
                        className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md" 
                        onClick={handleCompare}
                      >
                        进行对比
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-3">综合得分</h4>
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <div className="text-3xl font-semibold text-gray-800 mr-3">4.2</div>
                            <div className="flex text-yellow-400">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                            <div className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">
                              优秀
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-4">员工与岗位匹配度达到84%，表现优秀</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-sm text-gray-800">岗位适配度</h4>
                          <div className="text-xs text-gray-500 flex items-center">
                            <div className="flex items-center mr-3">
                              <div className="w-3 h-3 bg-[#4f46e5] mr-1 rounded-sm"></div>
                              <span>张三</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-[#06b6d4] mr-1 rounded-sm"></div>
                              <span>岗位要求</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">沟通能力</span>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">4.0</span>
                                <span className="text-xs text-gray-500 ml-1">/5.0</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-700">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#4f46e5] rounded-full w-[80%]"></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">技术知识</span>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">5.0</span>
                                <span className="text-xs text-gray-500 ml-1">/5.0</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-700">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#4f46e5] rounded-full w-[100%]"></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">团队协作</span>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">3.0</span>
                                <span className="text-xs text-gray-500 ml-1">/5.0</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-700">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#4f46e5] rounded-full w-[60%]"></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">按期交付</span>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">5.0</span>
                                <span className="text-xs text-gray-500 ml-1">/5.0</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-700">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#4f46e5] rounded-full w-[100%]"></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">解决问题</span>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">4.0</span>
                                <span className="text-xs text-gray-500 ml-1">/5.0</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-700">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#4f46e5] rounded-full w-[80%]"></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">远景精神</span>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">5.0</span>
                                <span className="text-xs text-gray-500 ml-1">/5.0</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-700">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full relative">
                              <div className="absolute top-0 left-0 h-2 bg-[#4f46e5] rounded-full w-[100%]"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">分析结果：</span>
                            员工在技术知识、按期交付和远景精神方面表现突出，团队协作需要进一步提升。
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <div className="w-full max-w-[380px] aspect-square relative">
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 500 500" className="w-full h-full">
                            <g transform="translate(250, 250)">
                              {/* 背景网格 - 刻度线 */}
                              <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                              <polygon points="0,-96 83.1,-48 83.1,48 0,96 -83.1,48 -83.1,-48" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                              <polygon points="0,-72 62.4,-36 62.4,36 0,72 -62.4,36 -62.4,-36" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                              <polygon points="0,-48 41.6,-24 41.6,24 0,48 -41.6,24 -41.6,-24" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                              <polygon points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                              
                              {/* 坐标轴 */}
                              <line x1="0" y1="0" x2="0" y2="-120" stroke="#d1d5db" strokeWidth="1" />
                              <line x1="0" y1="0" x2="104" y2="-60" stroke="#d1d5db" strokeWidth="1" />
                              <line x1="0" y1="0" x2="104" y2="60" stroke="#d1d5db" strokeWidth="1" />
                              <line x1="0" y1="0" x2="0" y2="120" stroke="#d1d5db" strokeWidth="1" />
                              <line x1="0" y1="0" x2="-104" y2="60" stroke="#d1d5db" strokeWidth="1" />
                              <line x1="0" y1="0" x2="-104" y2="-60" stroke="#d1d5db" strokeWidth="1" />
                              
                              {/* 岗位要求多边形 */}
                              <path 
                                d="M0,-96 L83.1,-48 L83.1,48 L0,96 L-83.1,48 L-83.1,-48 Z" 
                                fill="#e9c46a" 
                                fillOpacity="0.1" 
                                stroke="#e9c46a" 
                                strokeWidth="2" 
                              />
                              
                              {/* 员工能力多边形 */}
                              <path 
                                d="M0,-96 L83.1,-48 L62.4,36 L0,96 L-83.1,48 L-83.1,-48 Z" 
                                fill="#a8dadc" 
                                fillOpacity="0.2" 
                                stroke="#a8dadc" 
                                strokeWidth="2" 
                              />
                              
                              {/* 标签和数值 */}
                              <g>
                                {/* 沟通能力 */}
                                <text x="0" y="-160" textAnchor="middle" fontSize="14" fill="#4b5563" fontWeight="500">沟通能力</text>
                                <text x="0" y="-140" textAnchor="middle" fontSize="16" fontWeight="bold">
                                  <tspan fill="#4f46e5">4.0</tspan>
                                  <tspan fill="#06b6d4" opacity="0.6">/5.0</tspan>
                                </text>
                                
                                {/* 技术知识 */}
                                <text x="150" y="-60" textAnchor="start" fontSize="14" fill="#4b5563" fontWeight="500">技术知识</text>
                                <text x="150" y="-40" textAnchor="start" fontSize="16" fontWeight="bold">
                                  <tspan fill="#4f46e5">5.0</tspan>
                                  <tspan fill="#06b6d4" opacity="0.6">/5.0</tspan>
                                </text>
                                
                                {/* 团队协作 */}
                                <text x="150" y="70" textAnchor="start" fontSize="14" fill="#4b5563" fontWeight="500">团队协作</text>
                                <text x="150" y="90" textAnchor="start" fontSize="16" fontWeight="bold">
                                  <tspan fill="#4f46e5">3.0</tspan>
                                  <tspan fill="#06b6d4" opacity="0.6">/5.0</tspan>
                                </text>
                                
                                {/* 按期交付 */}
                                <text x="0" y="160" textAnchor="middle" fontSize="14" fill="#4b5563" fontWeight="500">按期交付</text>
                                <text x="0" y="180" textAnchor="middle" fontSize="16" fontWeight="bold">
                                  <tspan fill="#4f46e5">5.0</tspan>
                                  <tspan fill="#06b6d4" opacity="0.6">/5.0</tspan>
                                </text>
                                
                                {/* 解决问题 */}
                                <text x="-150" y="70" textAnchor="end" fontSize="14" fill="#4b5563" fontWeight="500">解决问题</text>
                                <text x="-150" y="90" textAnchor="end" fontSize="16" fontWeight="bold">
                                  <tspan fill="#4f46e5">4.0</tspan>
                                  <tspan fill="#06b6d4" opacity="0.6">/5.0</tspan>
                                </text>
                                
                                {/* 远景精神 */}
                                <text x="-150" y="-60" textAnchor="end" fontSize="14" fill="#4b5563" fontWeight="500">远景精神</text>
                                <text x="-150" y="-40" textAnchor="end" fontSize="16" fontWeight="bold">
                                  <tspan fill="#4f46e5">5.0</tspan>
                                  <tspan fill="#06b6d4" opacity="0.6">/5.0</tspan>
                                </text>
                              </g>
                              
                              {/* 员工能力点 */}
                              <circle cx="0" cy="-96" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="83.1" cy="-48" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="62.4" cy="36" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="0" cy="96" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="-83.1" cy="48" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="-83.1" cy="-48" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                              
                              {/* 岗位要求点 */}
                              <circle cx="0" cy="-96" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="83.1" cy="-48" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="83.1" cy="48" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="0" cy="96" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="-83.1" cy="48" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="-83.1" cy="-48" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                            </g>
                          </svg>
                        </div>
                        
                        {/* 缩放和控制按钮 */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <button className="p-1.5 bg-white rounded-md shadow-md text-gray-600 hover:text-gray-900 transition-colors border border-gray-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M15 3h6v6M14 10l7-7M10 21H3v-7M3 14l7 7" />
                            </svg>
                          </button>
                          <button className="p-1.5 bg-white rounded-md shadow-md text-gray-600 hover:text-gray-900 transition-colors border border-gray-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 8v8M8 12h8" />
                            </svg>
                          </button>
                          <button className="p-1.5 bg-white rounded-md shadow-md text-gray-600 hover:text-gray-900 transition-colors border border-gray-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 12h8" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* 旋转按钮 */}
                        <div className="absolute top-3 right-3">
                          <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-gray-900 transition-colors border border-gray-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 岗位匹配人才模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">岗位匹配人才</CardTitle>
                <div className="flex space-x-2">
                  {showReviewSelectionMode ? (
                    <Button 
                      className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                      onClick={() => setShowReviewConfirmDialog(true)}
                      disabled={employeesToReview.length === 0}
                    >
                      确认选择 ({employeesToReview.length})
                    </Button>
                  ) : (
                    <>
                  <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3 py-1 h-8 rounded-md">
                    筛选条件
                  </Button>
                  <Button 
                    className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                    onClick={openComparisonModal}
                    disabled={selectedEmployees.length === 0}
                  >
                    进行对比 ({selectedEmployees.length})
                  </Button>
                      <Button 
                        className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                        onClick={handleInitiateReview}
                      >
                        发起评审流程
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-3">当前岗位：IT开发平台架构师</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">匹配度 ≥ 75%</span>
                  </div>
                  <div className="text-sm text-gray-500">共找到15名匹配人才</div>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {showReviewSelectionMode && (
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            选择
                          </th>
                        )}
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          头像
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          员工
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          学历
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          员工ID
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          当前岗位
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          所在部门
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          工作年限
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          匹配度
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        {showReviewSelectionMode && (
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("Anders Wahlström")}
                              onChange={() => toggleEmployeeReviewSelection("Anders Wahlström")}
                            />
                          </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Anders Wahlström</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">B.S.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">-</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">高级开发工程师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">研发部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">5年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">90%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("Anthony Chong")}
                              onChange={() => toggleEmployeeReviewSelection("Anthony Chong")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Anthony Chong</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">B.A.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">-</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">系统架构师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">架构组</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">7年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">85%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("王五")}
                              onChange={() => toggleEmployeeReviewSelection("王五")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">王五</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">B.A.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP23</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">技术专家</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">技术部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">6年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">80%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("赵六")}
                              onChange={() => toggleEmployeeReviewSelection("赵六")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">赵六</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">B.A.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP31</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">高级开发工程师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">平台部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">4年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">75%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("林一")}
                              onChange={() => toggleEmployeeReviewSelection("林一")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">林一</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">M.S.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP42</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">前端工程师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">前端组</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">3年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">82%</span>
                            </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("张伟")}
                              onChange={() => toggleEmployeeReviewSelection("张伟")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">张伟</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">Ph.D.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP51</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">算法工程师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">AI研发部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">4年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">88%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("李娜")}
                              onChange={() => toggleEmployeeReviewSelection("李娜")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">李娜</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">M.B.A.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP38</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">产品经理</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">产品部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">5年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">79%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("陈明")}
                              onChange={() => toggleEmployeeReviewSelection("陈明")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">王红</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">M.S.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP56</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">UX设计师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">设计部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">4年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">76%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                      <tr>
                        {showReviewSelectionMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-[#3C5E5C] focus:ring-[#3C5E5C]"
                              checked={employeesToReview.includes("刘强")}
                              onChange={() => toggleEmployeeReviewSelection("刘强")}
                          />
                        </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">刘强</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">B.S.</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">EMP63</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">数据分析师</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">数据部</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">3年</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">77%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">显示 1-10 条，共 15 条</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0 bg-gray-100 flex items-center justify-center">1</Button>
                    <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">2</Button>
                    <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">3</Button>
                    <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">4</Button>
                    <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 员工对比弹窗 */}
          {showComparisonModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm">
              <div className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">员工与岗位匹配度对比</h2>
                  <button 
                    className="text-gray-500 hover:text-gray-700" 
                    onClick={closeComparisonModal}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">目标岗位：IT开发平台架构师</h3>
                    <p className="text-sm text-gray-600">所选员工与目标岗位的匹配情况对比分析</p>
                  </div>
                  
                  {/* 图表区域 */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-white">
                      <p className="text-gray-500">匹配度雷达图展示区域</p>
                    </div>
                  </div>
                  
                  {/* 详细匹配情况表格 */}
                  <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">能力维度</th>
                        {selectedEmployees.includes("Anders Wahlström") && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anders Wahlström</th>
                        )}
                        {selectedEmployees.includes("Anthony Chong") && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anthony Chong</th>
                        )}
                        {selectedEmployees.includes("王五") && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">王五</th>
                        )}
                        {selectedEmployees.includes("赵六") && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">赵六</th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">岗位要求</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">技术专业能力</td>
                        {selectedEmployees.includes("Anders Wahlström") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[95%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">95%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("Anthony Chong") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[90%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">90%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("王五") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">85%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("赵六") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[80%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">80%</span>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">特级（专家级）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">架构设计能力</td>
                        {selectedEmployees.includes("Anders Wahlström") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">85%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("Anthony Chong") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[95%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">95%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("王五") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-yellow-500 h-full w-[75%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">75%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("赵六") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-yellow-500 h-full w-[70%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">70%</span>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">特级（领域级）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">团队管理能力</td>
                        {selectedEmployees.includes("Anders Wahlström") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-yellow-500 h-full w-[75%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">75%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("Anthony Chong") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-yellow-500 h-full w-[70%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">70%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("王五") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[80%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">80%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("赵六") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-red-500 h-full w-[65%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">65%</span>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">高级</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">沟通协作能力</td>
                        {selectedEmployees.includes("Anders Wahlström") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[90%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">90%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("Anthony Chong") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-yellow-500 h-full w-[75%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">75%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("王五") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">85%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("赵六") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">85%</span>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">高级</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">问题解决能力</td>
                        {selectedEmployees.includes("Anders Wahlström") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[95%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">95%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("Anthony Chong") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[90%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">90%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("王五") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">85%</span>
                            </div>
                          </td>
                        )}
                        {selectedEmployees.includes("赵六") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div className="bg-yellow-500 h-full w-[75%]"></div>
                              </div>
                              <span className="text-xs font-medium text-gray-700">75%</span>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">特级</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-2 px-4 py-2 rounded"
                      onClick={closeComparisonModal}
                    >
                      关闭
                    </Button>
                    <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white px-4 py-2 rounded">
                      导出匹配报告
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 人才横向对比模块 */}
          <div className="space-y-4">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">人才横向对比</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-base text-gray-800">人才横向对比</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">对同级或相似岗位的多名员工进行横向能力对比，了解团队差异和互补性</p>
                  
                  <div className="mb-6 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex flex-wrap gap-2 items-center">
                        <div className="text-xs text-gray-500 mr-1">已选员工：</div>
                        <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          Jay
                          <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          Caicai Yang
                          <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          Anders
                          <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          Anthony
                          <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button className="flex-shrink-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1 h-8 rounded-md">
                          <PlusIcon size={14} className="mr-1" />
                          添加对比员工
                        </Button>
                        <Button 
                          className="flex-shrink-0 bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                          onClick={openHorizontalComparisonModal}
                        >
                          进行对比
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 表格式人才对比视图 */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            头像
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            员工
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            学历
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            员工ID
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            当前岗位
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            所在部门
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            工作年限
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            匹配度
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                              </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">Anders Wahlström</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">B.S.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">-</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">高级开发工程师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">研发部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">5年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">90%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                              </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">Anthony Chong</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">B.A.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">-</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">系统架构师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">架构组</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">7年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">85%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">王五</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">B.A.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP23</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">技术专家</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">技术部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">6年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">80%</span>
                              </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                              </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">赵六</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">B.A.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP31</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">高级开发工程师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">平台部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">4年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">75%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">林一</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">M.S.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP42</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">前端工程师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">前端组</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">3年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">82%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">张伟</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">Ph.D.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP51</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">算法工程师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">AI研发部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">4年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">88%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">李娜</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">M.B.A.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP38</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">产品经理</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">产品部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">5年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">79%</span>
                              </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                              </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">陈明</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">B.E.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP47</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">DevOps工程师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">运维部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">6年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">78%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">王红</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">M.S.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP56</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">UX设计师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">设计部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">4年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">76%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">刘强</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">B.S.</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">EMP63</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">数据分析师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">数据部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">3年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">77%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <button className="text-[#3C5E5C] font-medium hover:underline">查看更多</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 人才横向对比弹窗 */}
        {showHorizontalComparisonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm">
            <div className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">人才横向能力对比结果</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700" 
                  onClick={closeHorizontalComparisonModal}
                >
                  <XIcon size={20} />
                </button>
                  </div>
                  
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium mb-4 text-gray-800">对比员工名单</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">Jay</div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">Caicai Yang</div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">Anders</div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">Anthony</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3 text-gray-800">能力维度对比</h4>
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-sm text-gray-500">雷达图展示区域</p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3 text-gray-800">绩效对比</h4>
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-sm text-gray-500">柱状图展示区域</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3 text-gray-800">详细能力对比数据</h4>
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              能力维度
                          </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jay
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Caicai Yang
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Anders
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Anthony
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-3 text-sm text-gray-800">专业技能</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.5</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.2</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.8</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.6</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800">领导力</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">3.8</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.0</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">3.5</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.2</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800">沟通能力</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.2</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.5</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.0</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.3</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800">团队协作</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.3</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.4</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.1</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">4.5</td>
                          </tr>
                        </tbody>
                      </table>
                              </div>
                              </div>
                            </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-2 px-4 py-2 rounded text-xs"
                    onClick={closeHorizontalComparisonModal}
                  >
                    关闭
                  </Button>
                  <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white px-4 py-2 rounded text-xs">
                    导出对比报告
                  </Button>
                              </div>
                            </div>
                              </div>
                              </div>
        )}
      </Tabs>
      
      {/* 远景精神雷达图弹窗 */}
      {showSpiritRadarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg w-11/12 max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">张三的远景精神评估</h2>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={() => setShowSpiritRadarModal(false)}
              >
                <XIcon size={20} />
              </button>
                            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">远景精神雷达图</h3>
                <p className="text-xs text-gray-600 mb-4">
                  对员工四个维度的远景精神评估：求真务实、勇于挑战、干部额外要求、正直博爱
                </p>
                              </div>
              
              {/* 雷达图 */}
              <div className="flex justify-center items-center my-8">
                <div className="w-full max-w-md aspect-square">
                  <svg viewBox="0 0 600 600" width="100%" height="100%">
                    <g transform="translate(300, 300)">
                      {/* 背景层 */}
                      <polygon points="0,-160 160,0 0,160 -160,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      <polygon points="0,-120 120,0 0,120 -120,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      <polygon points="0,-80 80,0 0,80 -80,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      <polygon points="0,-40 40,0 0,40 -40,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      
                      {/* 坐标轴 */}
                      <line x1="0" y1="0" x2="0" y2="-180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                      <line x1="0" y1="0" x2="180" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                      <line x1="0" y1="0" x2="0" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                      <line x1="0" y1="0" x2="-180" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                      
                      {/* 标签文字 - 调整位置防止被切割 */}
                      <text x="0" y="-210" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">求真务实</text>
                      <text x="210" y="0" textAnchor="start" fontSize="14" fill="#334155" fontWeight="500">勇于挑战</text>
                      <text x="0" y="225" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">干部额外要求</text>
                      <text x="-210" y="0" textAnchor="end" fontSize="14" fill="#334155" fontWeight="500">正直博爱</text>
                      
                      {/* 刻度文字 */}
                      <text x="0" y="-165" textAnchor="middle" fontSize="12" fill="#64748b">4级</text>
                      <text x="0" y="-125" textAnchor="middle" fontSize="12" fill="#64748b">3级</text>
                      <text x="0" y="-85" textAnchor="middle" fontSize="12" fill="#64748b">2级</text>
                      <text x="0" y="-45" textAnchor="middle" fontSize="12" fill="#64748b">1级</text>
                      
                      {/* 员工数据多边形 */}
                      <polygon points="0,-40 60,0 0,60 -40,0" fill="#dbeafe" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2" />
                      
                      {/* 数据点 */}
                      <circle cx="0" cy="-40" r="4" fill="#3b82f6" />
                      <circle cx="60" cy="0" r="4" fill="#3b82f6" />
                      <circle cx="0" cy="60" r="4" fill="#3b82f6" />
                      <circle cx="-40" cy="0" r="4" fill="#3b82f6" />
                    </g>
                  </svg>
                            </div>
                  </div>
              
              {/* 评估说明 */}
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-xs font-medium text-blue-800 mb-2">评估结果说明</h4>
                <p className="text-xs text-blue-700">
                  张三在"勇于挑战"方面表现最为突出，达到2级水平；正直博爱和求真务实方面达到1级标准；
                  在干部额外要求方面达到1.5级水平。整体表现良好，符合公司远景精神要求，
                  建议在求真务实和正直博爱方面进一步提升。
                </p>
                </div>
                
              <div className="mt-6 flex justify-end">
                <Button 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 mr-2 px-4 py-2 rounded"
                  onClick={() => setShowSpiritRadarModal(false)}
                >
                  关闭
                </Button>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white px-4 py-2 rounded">
                导出评估报告
                  </Button>
                </div>
          </div>
          </div>
        </div>
      )}

      {/* 下载模板弹窗 */}
      <Dialog open={showDownloadTemplateDialog} onOpenChange={setShowDownloadTemplateDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{templateType}模板</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {templateType === "领导力素质" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质编码</label>
                    <Input
                      value="L-LEAD-102"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质名称</label>
                    <Input
                      value="战略决策能力"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">适用层级</label>
                    <Input
                      value="M4（副总裁及以上）"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质类型</label>
                    <Input
                      value={templateType}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">核心定义</label>
                    <Input
                      value="在不确定性中做出推动业务突破的决策"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">战略关联</label>
                    <Input
                      value="支撑2025年市场扩张战略"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">分级行为标准</label>
                  <Input
                    value="L4 能主导制定3-5年战略规划并推动落地"
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </>
            ) : templateType === "通用素质" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质编码</label>
                    <Input
                      value="G-COM-001"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质名称</label>
                    <Input
                      value="沟通协作能力"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">素质类型</label>
                  <Input
                    value={templateType}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">核心定义</label>
                  <Input
                    value="有效传递信息并协调多方达成共识"
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">分级行为标准</label>
                  <Input
                    value="L3能协调多方意见达成共识"
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质编码</label>
                    <Input
                      value={templateType === "专业素质" ? "F-PRO-001" : "G-COM-001"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质名称</label>
                    <Input
                      value={templateType === "专业素质" ? "税务筹划能力" : "团队协作能力"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">适用岗位</label>
                    <Input
                      value={templateType === "专业素质" ? "财务经理岗" : "全体员工"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">素质类型</label>
                    <Input
                      value={templateType}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">等级划分</label>
                    <Input
                      value="4级 (L4)"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">行为描述</label>
                    <Input
                      value={templateType === "专业素质" ? "L4：能设计跨区域税收筹划方案" : "L4：具备良好沟通能力"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">关联知识</label>
                    <Input
                      value={templateType === "专业素质" ? "CAS 18号准则" : "团队管理理论"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">关联技能</label>
                    <Input
                      value={templateType === "专业素质" ? "税务系统操作（金税三期）" : "沟通技巧"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDownloadTemplateDialog(false)}>取消</Button>
            <Button onClick={() => {
              alert("模板下载成功");
              setShowDownloadTemplateDialog(false);
            }}>下载</Button>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* 评审流程确认对话框 */}
      <Dialog open={showReviewConfirmDialog} onOpenChange={setShowReviewConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{reviewSuccess ? "成功" : "确认发起评审"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {reviewSuccess ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">已成功发起评审流程</p>
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                确认对于勾选的 {employeesToReview.length} 名人员发起评审流程吗？
              </p>
            )}
          </div>
          {!reviewSuccess && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReviewConfirmDialog(false)}>放弃</Button>
              <Button onClick={handleConfirmReview}>确认</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 