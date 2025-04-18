'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon, FileTextIcon, ChevronDownIcon } from "lucide-react";
import HorizontalComparisonModal from './horizontal-comparison-modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * 岗位信息接口定义
 */
interface PositionInfo {
  id: string;
  name: string;
  department: string;
  system: string;
  careerPath: string;
  level: string;
  sequence: string;
  professionalLevel: string;
  description?: string; // 岗位完整描述
  responsibilities?: string[]; // 岗位职责
  requirements?: string[]; // 岗位要求
}

/**
 * 能力要求项接口定义
 */
interface CapabilityRequirement {
  id: string;
  name: string;
  level: string;
  description: string;
  standard: string;
}

interface Position {
  info: PositionInfo;
  hardCapabilities: CapabilityRequirement[];
  softCapabilities: CapabilityRequirement[];
}

/**
 * 岗位匹配人才接口定义
 */
interface MatchedTalent {
  id: string;
  name: string;
  avatar: string;
  education: string;
  employeeId: string;
  position: string;
  department: string;
  workYears: string;
  matchRate: number;
}

const MatchingPage = () => {
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState(['Jay', 'Caicai Yang', 'Anders', 'Anthony']);
  
  // 实际选中进行对比的员工
  const [employeesToCompare, setEmployeesToCompare] = useState<string[]>([]);
  
  // 岗位说明对话框状态
  const [showPositionDetailDialog, setShowPositionDetailDialog] = useState(false);
  
  // 匹配人才数据
  const [talents, setTalents] = useState<MatchedTalent[]>([
    {
      id: "t1",
      name: "Anders Wahlström",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60",
      education: "B.S.",
      employeeId: "-",
      position: "高级开发工程师",
      department: "研发部",
      workYears: "5年",
      matchRate: 90
    },
    {
      id: "t2",
      name: "Anthony Chong",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
      education: "B.A.",
      employeeId: "-",
      position: "系统架构师",
      department: "架构组",
      workYears: "7年",
      matchRate: 85
    },
    {
      id: "t3",
      name: "王五",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60",
      education: "B.A.",
      employeeId: "EMP23",
      position: "技术专家",
      department: "技术部",
      workYears: "6年",
      matchRate: 80
    },
    {
      id: "t4",
      name: "Jay",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60",
      education: "M.S.",
      employeeId: "EMP24",
      position: "产品经理",
      department: "产品部",
      workYears: "4年",
      matchRate: 75
    },
    {
      id: "t5",
      name: "Caicai Yang",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=60",
      education: "Ph.D.",
      employeeId: "EMP25",
      position: "数据分析师",
      department: "数据部",
      workYears: "3年",
      matchRate: 82
    }
  ]);
  
  // 匹配度统计信息
  const [matchingSummary, setMatchingSummary] = useState({
    totalMatched: 168,
    highMatchCount: 47,  // 匹配度≥75%的人数
    matchThreshold: 75,  // 匹配度阈值
    averageMatchRate: 68 // 平均匹配度
  });
  
  // 选中的匹配人才
  const [selectedTalents, setSelectedTalents] = useState<string[]>([]);
  
  // 添加所有岗位信息
  const [positions, setPositions] = useState<Position[]>([
    {
      info: {
        id: "pos1",
        name: "IT开发平台架构师",
        department: "研发部",
        system: "技术体系",
        careerPath: "技术专家路径",
        level: "P7",
        sequence: "技术序列",
        professionalLevel: "高级",
        description: "负责企业级开发平台的整体架构设计与实施，确保平台的可扩展性、安全性和高性能。指导开发团队进行技术选型和最佳实践的应用，推动技术创新和平台持续优化。",
        responsibilities: [
          "设计并落地企业级开发平台架构，解决复杂技术问题",
          "主导技术选型，评估新技术的应用价值",
          "制定技术标准和最佳实践，提升研发效率",
          "培养团队的技术能力，推动技术文化建设",
          "与业务团队紧密合作，确保技术方案符合业务需求"
        ],
        requirements: [
          "8年以上软件开发经验，5年以上架构设计经验",
          "精通至少一种主流编程语言，如Java、Python、Go等",
          "深入理解分布式系统、微服务架构、云原生技术",
          "具备强大的问题解决能力和系统思维",
          "优秀的沟通协调能力和团队领导力"
        ]
      },
      hardCapabilities: [
        {
          id: "H1",
          name: "架构设计能力",
          level: "专家级",
          description: "能够设计复杂系统架构并解决技术难题",
          standard: "能独立设计并落地企业级平台架构，解决跨团队、跨系统集成问题"
        },
        {
          id: "H2",
          name: "技术选型能力",
          level: "高级",
          description: "能够进行合理的技术选型和技术决策",
          standard: "能基于业务需求和技术发展趋势，做出最优技术选型决策"
        },
        {
          id: "H3",
          name: "代码质量控制",
          level: "资深",
          description: "保证代码质量和可维护性",
          standard: "能建立并推行代码规范，构建自动化测试和CI/CD流程"
        },
        {
          id: "H4",
          name: "性能优化",
          level: "专家级",
          description: "优化系统性能和资源利用",
          standard: "能主导大型复杂系统的性能优化，且有可量化的优化效果"
        }
      ],
      softCapabilities: [
        {
          id: "S1",
          name: "团队协作",
          level: "高级",
          description: "有效与团队成员协作完成项目",
          standard: "能协调跨部门团队合作，解决协作中的冲突和问题"
        },
        {
          id: "S2",
          name: "沟通能力",
          level: "资深",
          description: "清晰有效地传达技术方案和想法",
          standard: "能向非技术人员清晰解释复杂技术概念，推动关键决策"
        },
        {
          id: "S3",
          name: "问题解决",
          level: "专家级",
          description: "分析和解决复杂问题的能力",
          standard: "能解决前所未有的技术难题，提出创新性解决方案"
        },
        {
          id: "S4",
          name: "领导力",
          level: "高级",
          description: "带领团队实现目标的能力",
          standard: "能带领技术团队完成战略性项目，培养团队成员成长"
        }
      ]
    },
    {
      info: {
        id: "pos2",
        name: "高级前端工程师",
        department: "前端部",
        system: "技术体系",
        careerPath: "技术专家路径",
        level: "P6",
        sequence: "技术序列",
        professionalLevel: "高级",
        description: "负责公司核心产品的前端架构设计和开发，打造高性能、可扩展的用户界面和交互体验。参与技术选型决策，推动前端技术创新和最佳实践的应用。",
        responsibilities: [
          "设计并实现复杂的前端架构，确保代码质量和性能",
          "优化用户交互和界面体验，提升产品易用性",
          "与产品、设计和后端团队紧密协作，高效实现业务需求",
          "前端技术调研和创新，推动新技术的合理应用",
          "指导和培养初中级前端工程师的技术能力"
        ],
        requirements: [
          "5年以上前端开发经验，2年以上前端架构经验",
          "精通现代前端框架如React、Vue或Angular",
          "深入理解JavaScript、HTML5、CSS3及相关规范",
          "具备良好的架构设计能力和代码优化经验",
          "良好的沟通能力和团队协作精神"
        ]
      },
      hardCapabilities: [
        {
          id: "HF1",
          name: "前端架构设计",
          level: "高级",
          description: "设计高效、可扩展的前端架构",
          standard: "能设计并实现大规模前端应用架构，优化性能和用户体验"
        },
        {
          id: "HF2",
          name: "UI/UX开发",
          level: "专家级",
          description: "实现复杂交互和用户体验",
          standard: "能独立实现复杂的交互设计，并优化用户体验流程"
        },
        {
          id: "HF3",
          name: "前端工程化",
          level: "高级",
          description: "前端工程化和自动化构建",
          standard: "能搭建和优化前端工程化体系，提升开发效率"
        }
      ],
      softCapabilities: [
        {
          id: "SF1",
          name: "产品思维",
          level: "中级",
          description: "理解产品需求并提出改进建议",
          standard: "能从用户角度思考产品设计，提出有效的改进建议"
        },
        {
          id: "SF2",
          name: "团队协作",
          level: "高级",
          description: "与设计师、后端工程师有效协作",
          standard: "能有效协调前后端及设计师的工作，推动项目顺利进行"
        }
      ]
    },
    {
      info: {
        id: "pos3",
        name: "产品经理",
        department: "产品部",
        system: "产品体系",
        careerPath: "产品管理路径",
        level: "P5",
        sequence: "产品序列",
        professionalLevel: "中级",
        description: "负责公司产品的规划、设计和迭代优化，通过深入理解用户需求和市场趋势，制定产品策略和路线图。协调各方资源推动产品落地，确保产品的用户体验和商业价值。",
        responsibilities: [
          "负责产品的需求分析、功能规划和原型设计",
          "制定产品路线图和迭代计划，合理分配资源和优先级",
          "协调研发、设计、测试和运营等团队，推动产品落地",
          "分析用户反馈和产品数据，持续优化产品体验",
          "跟踪行业动态和竞品分析，提出产品创新方向"
        ],
        requirements: [
          "3年以上产品经理经验，熟悉产品全生命周期管理",
          "较强的需求分析能力和用户思维",
          "良好的沟通协调能力和项目管理能力",
          "具备基本的数据分析能力和商业敏感度",
          "善于团队协作，能够有效推动跨部门合作"
        ]
      },
      hardCapabilities: [
        {
          id: "HP1",
          name: "需求分析",
          level: "高级",
          description: "分析并梳理用户需求",
          standard: "能深入分析用户痛点，提炼核心需求并形成产品方案"
        },
        {
          id: "HP2",
          name: "产品规划",
          level: "中级",
          description: "制定产品路线图和规划",
          standard: "能规划产品迭代路线，合理分配资源和优先级"
        },
        {
          id: "HP3",
          name: "数据分析",
          level: "中级",
          description: "通过数据分析优化产品",
          standard: "能利用数据分析工具，进行产品决策和优化"
        }
      ],
      softCapabilities: [
        {
          id: "SP1",
          name: "沟通协调",
          level: "高级",
          description: "与各方沟通协调产品需求",
          standard: "能有效协调多方利益相关者，推动产品顺利落地"
        },
        {
          id: "SP2",
          name: "项目管理",
          level: "中级",
          description: "管理产品开发流程和进度",
          standard: "能合理规划项目进度，及时处理项目风险"
        }
      ]
    }
  ]);
  
  // 当前选择的岗位ID
  const [selectedPositionId, setSelectedPositionId] = useState("pos1");
  
  // 当前显示的岗位信息
  const [currentPosition, setCurrentPosition] = useState<PositionInfo>(positions[0].info);
  const [hardCapabilities, setHardCapabilities] = useState<CapabilityRequirement[]>(positions[0].hardCapabilities);
  const [softCapabilities, setSoftCapabilities] = useState<CapabilityRequirement[]>(positions[0].softCapabilities);
  
  // 切换岗位
  const handlePositionChange = (positionId: string) => {
    setSelectedPositionId(positionId);
    const selectedPosition = positions.find(p => p.info.id === positionId);
    if (selectedPosition) {
      setCurrentPosition(selectedPosition.info);
      setHardCapabilities(selectedPosition.hardCapabilities);
      setSoftCapabilities(selectedPosition.softCapabilities);
    }
  };
  
  // 打开岗位详情对话框
  const openPositionDetail = () => {
    setShowPositionDetailDialog(true);
  };
  
  // 初始加载时设置默认岗位
  useEffect(() => {
    handlePositionChange(selectedPositionId);
  }, []);
  
  const openComparisonModal = () => {
    setShowComparisonModal(true);
  };
  
  const closeComparisonModal = () => {
    setShowComparisonModal(false);
  };
  
  // 选择或取消选择人才
  const toggleTalentSelection = (talentId: string) => {
    setSelectedTalents(prev => {
      if (prev.includes(talentId)) {
        return prev.filter(id => id !== talentId);
      } else {
        return [...prev, talentId];
      }
    });
  };
  
  // 打开人才对比模态框
  const openTalentComparison = () => {
    if (selectedTalents.length > 0) {
      // 根据选中的人才ID获取人才名称
      const compareEmployees = selectedTalents.map(id => {
        const talent = talents.find(t => t.id === id);
        return talent ? talent.name : "";
      }).filter(name => name !== "");
      
      setSelectedEmployees(compareEmployees);
      setShowComparisonModal(true);
    }
  };

  // 切换是否将员工添加到对比
  const toggleEmployeeForComparison = (employeeName: string) => {
    setEmployeesToCompare(prev => {
      if (prev.includes(employeeName)) {
        return prev.filter(name => name !== employeeName);
      } else {
        return [...prev, employeeName];
      }
    });
  };
  
  // 查找员工详细信息
  const findEmployeeDetails = (employeeName: string) => {
    return talents.find(talent => talent.name === employeeName) || null;
  };
  
  return (
    <div className="space-y-4">
      {/* 岗位信息与能力要求综合模块 */}
      <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
          <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">岗位信息</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedPositionId} onValueChange={handlePositionChange}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="选择岗位" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.info.id} value={position.info.id}>
                    {position.info.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* 岗位基本信息部分 */}
            <div>
              <h3 className="text-base font-medium mb-4 text-gray-800">岗位基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">目标岗位</h4>
                  <p className="text-sm font-medium">{currentPosition.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">所属部门</h4>
                  <p className="text-sm font-medium">{currentPosition.department}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">所属体系</h4>
                  <p className="text-sm font-medium">{currentPosition.system}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">发展通道</h4>
                  <p className="text-sm font-medium">{currentPosition.careerPath}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">岗位职级</h4>
                  <p className="text-sm font-medium">{currentPosition.level}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">岗位序列</h4>
                  <p className="text-sm font-medium">{currentPosition.sequence}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">专业任职等级</h4>
                  <p className="text-sm font-medium">{currentPosition.professionalLevel}</p>
                </div>
              </div>
            </div>
            
            {/* 岗位能力要求部分 */}
            <div>
              <h3 className="text-base font-medium mb-4 text-gray-800">岗位能力要求</h3>
              <Tabs defaultValue="hard" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="hard" className="text-sm data-[state=active]:bg-[#f8fbfc]">硬性能力要求</TabsTrigger>
                  <TabsTrigger value="soft" className="text-sm data-[state=active]:bg-[#f8fbfc]">软性能力要求</TabsTrigger>
                </TabsList>
                
                <TabsContent value="hard">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            能力项
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            要求等级
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            能力描述
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            行为标准
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {hardCapabilities.map((capability) => (
                          <tr key={capability.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{capability.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {capability.level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{capability.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{capability.standard}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="soft">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            能力项
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            要求等级
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            能力描述
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            行为标准
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {softCapabilities.map((capability) => (
                          <tr key={capability.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{capability.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {capability.level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{capability.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{capability.standard}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={openPositionDetail}
          >
            <FileTextIcon size={14} />
            查看完整岗位说明
          </Button>
        </CardFooter>
      </Card>

      {/* 岗位完整说明对话框 */}
      <Dialog open={showPositionDetailDialog} onOpenChange={setShowPositionDetailDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{currentPosition.name} - 岗位说明</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {currentPosition.department} · {currentPosition.level} · {currentPosition.professionalLevel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">岗位描述</h3>
              <p className="text-sm text-gray-700">{currentPosition.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">岗位职责</h3>
              <ul className="list-disc pl-5 space-y-1">
                {currentPosition.responsibilities?.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">任职要求</h3>
              <ul className="list-disc pl-5 space-y-1">
                {currentPosition.requirements?.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 岗位匹配人才模块 */}
      <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
          <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">岗位匹配人才</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base text-gray-800">{currentPosition.name}</h3>
              <Button 
                className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                onClick={openTalentComparison}
                disabled={selectedTalents.length === 0}
              >
                人才对比
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">根据岗位能力标准与人才画像，筛选最佳匹配人才，辅助招聘与内部人才调配</p>

            {/* 匹配度统计信息 */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">总匹配人才：</span>
                  <span className="text-sm font-bold ml-1 text-gray-900">{matchingSummary.totalMatched} 人</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">匹配度 ≥ {matchingSummary.matchThreshold}%：</span>
                  <span className="text-sm font-bold ml-1 text-green-600">{matchingSummary.highMatchCount} 人</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">平均匹配度：</span>
                  <span className="text-sm font-bold ml-1 text-blue-600">{matchingSummary.averageMatchRate}%</span>
                </div>
              </div>
            </div>

            {/* 过滤条件区域 */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <span className="text-xs text-gray-600">岗位：全部</span>
                <XIcon size={14} className="ml-2 text-gray-400 cursor-pointer" />
              </div>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <span className="text-xs text-gray-600">部门：全部</span>
                <XIcon size={14} className="ml-2 text-gray-400 cursor-pointer" />
              </div>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <span className="text-xs text-gray-600">匹配度：70%以上</span>
                <XIcon size={14} className="ml-2 text-gray-400 cursor-pointer" />
              </div>
              <Button variant="outline" className="text-xs h-7 border-dashed border-gray-300">
                <PlusIcon size={14} className="mr-1" />
                添加筛选条件
              </Button>
            </div>

            {/* 表格式匹配结果视图 */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      选择
                    </th>
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
                  {talents.map((talent) => (
                    <tr key={talent.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <Checkbox
                          checked={selectedTalents.includes(talent.id)}
                          onCheckedChange={() => toggleTalentSelection(talent.id)}
                          className="mx-auto"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                          <img src={talent.avatar} alt={`${talent.name}头像`} className="h-10 w-10 object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{talent.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{talent.education}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{talent.employeeId}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{talent.position}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{talent.department}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{talent.workYears}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium flex items-center">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">{talent.matchRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-left">
                        <Button variant="ghost" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <button className="text-[#3C5E5C] font-medium hover:underline">查看更多</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 人才横向对比模块 */}
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
                  {selectedEmployees.length > 0 ? (
                    selectedEmployees.map((employee, index) => (
                      <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {employee}
                        <svg 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          onClick={() => {
                            setSelectedEmployees(prev => prev.filter((_, i) => i !== index));
                            setEmployeesToCompare(prev => prev.filter(name => name !== employee));
                          }}
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400">暂无选中员工（可从匹配人才中选择）</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    className="flex-shrink-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1 h-8 rounded-md"
                  >
                    <PlusIcon size={14} className="mr-1" />
                    添加对比员工
                  </Button>
                  <Button 
                    className="flex-shrink-0 bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md"
                    onClick={openComparisonModal}
                    disabled={employeesToCompare.length > 0 ? employeesToCompare.length < 2 : selectedEmployees.length < 2}
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
                      选择
                    </th>
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
                  {selectedEmployees.map((employeeName) => {
                    const employeeDetails = findEmployeeDetails(employeeName);
                    if (!employeeDetails) return null;
                    
                    return (
                      <tr key={employeeDetails.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <Checkbox
                            checked={employeesToCompare.includes(employeeName)}
                            onCheckedChange={() => toggleEmployeeForComparison(employeeName)}
                            className="mx-auto"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                            <img src={employeeDetails.avatar} alt={`${employeeName}头像`} className="h-10 w-10 object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employeeName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{employeeDetails.education}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employeeDetails.employeeId}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employeeDetails.position}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employeeDetails.department}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employeeDetails.workYears}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">{employeeDetails.matchRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-left">
                          <Button 
                            variant="ghost" 
                            className="text-xs h-7 text-[#3C5E5C]"
                            onClick={() => toggleEmployeeForComparison(employeeName)}
                          >
                            {employeesToCompare.includes(employeeName) ? "取消对比" : "选择对比"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <button className="text-[#3C5E5C] font-medium hover:underline">查看更多</button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 水平对比模态框 */}
      <HorizontalComparisonModal 
        isOpen={showComparisonModal} 
        onClose={closeComparisonModal} 
        selectedEmployees={employeesToCompare.length > 0 ? employeesToCompare : selectedEmployees}
      />
    </div>
  );
};

export default MatchingPage; 