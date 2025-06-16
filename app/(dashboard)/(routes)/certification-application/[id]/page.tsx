'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { FileTextIcon, UserIcon, StarIcon, SaveIcon, SendIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// 认证申请表数据接口
interface CertificationApplication {
  id: string;
  applicantName: string; // 申请人姓名
  category: string; // 类
  subCategory: string; // 子类  
  direction: string; // 方向
  position: string; // 职务
  horizontalRole: string; // 横向角色
  system: string; // 体系
  department: string; // 部门
  team: string; // 团队
  currentTechLevel: string; // 当前技术职级（系统默认，不可编辑）
  currentTechLevelCertTime: string; // 当前技术职级认证时间（系统默认，不可编辑）
  applicationPeriod: string; // 申请周期（系统默认，不可编辑）
  applyTechLevel: string; // 申请技术职级（下拉选择）
  knowledgeSkillAssessment: string; // 知识技能鉴定结果（系统默认，不可编辑）
  applicationFormFile?: File; // 申请人申请表文件
  evidenceFiles?: File[]; // 证明材料文件
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected';
  createTime: string;
  submitTime?: string;
  // 审批理由相关字段
  hrbpApprovalComment?: string; // HRBP审批意见
  hrbpApprovalTime?: string; // HRBP审批时间
  hrbpApprover?: string; // HRBP审批人
  systemLeaderApprovalComment?: string; // 体系负责人审批意见
  systemLeaderApprovalTime?: string; // 体系负责人审批时间
  systemLeaderApprover?: string; // 体系负责人审批人
}

/**
 * 认证申请表页面组件
 * @returns 认证申请表页面
 */
export default function CertificationApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useAuth();
  const applicationId = (params?.id as string) || "CERT_APP_005";
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 审批相关状态
  const [approvalComment, setApprovalComment] = useState("");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  
  // 检查当前用户角色
  const isHRBP = state.user?.role === 'hrbp';
  const isSystemLeader = state.user?.role === 'system_leader';
  const isEmployee = state.user?.role === 'employee';
  const isApprover = isHRBP || isSystemLeader;
  
  // 初始化申请表数据
  const [application, setApplication] = useState<CertificationApplication>({
    id: applicationId,
    applicantName: "张三",
    category: "技术序列",
    subCategory: "研发",
    direction: "前端开发",
    position: "高级前端工程师",
    horizontalRole: "技术专家",
    system: "技术体系",
    department: "技术部",
    team: "前端团队",
    currentTechLevel: "P3",
    currentTechLevelCertTime: "2023-06-15",
    applicationPeriod: "2024年度",
    applyTechLevel: "P4",
    knowledgeSkillAssessment: "通过",
    status: "submitted",
    createTime: "2024-01-15 14:30"
  });

  useEffect(() => {
    // 根据applicationId模拟不同员工的数据
    const loadApplicationData = () => {
      // 首先尝试从localStorage加载申请数据
      const existingApplications = JSON.parse(localStorage.getItem('certificationApplications') || '{}');
      const savedApplication = existingApplications[applicationId];
      
      let employeeData;
      let defaultStatus = 'draft';
      let defaultSubmitTime;
      
      switch (applicationId) {
        case "CERT_APP_001":
          employeeData = {
            applicantName: "吴十",
            applicantId: "EMP015",
            department: "研发部",
            position: "工程师",
            currentLevel: "P3",
            applyLevel: "P4",
            applySequence: "技术序列",
            applyDirection: "前端开发"
          };
          // 为HRBP测试设置已提交状态
          defaultStatus = 'submitted';
          defaultSubmitTime = '2024-01-15 14:30';
          break;
        case "CERT_APP_005":
          employeeData = {
            applicantName: "张三",
            applicantId: "EMP002",
            department: "研发部",
            position: "工程师",
            currentLevel: "P3",
            applyLevel: "P4",
            applySequence: "技术序列",
            applyDirection: "后端开发"
          };
          // 为HRBP测试设置已提交状态
          defaultStatus = 'submitted';
          defaultSubmitTime = '2024-01-15 16:30';
          break;
        case "CERT_APP_002":
          employeeData = {
            applicantName: "赵六",
            applicantId: "EMP031",
            department: "产品部",
            position: "产品经理",
            currentLevel: "P4",
            applyLevel: "P5",
            applySequence: "产品序列",
            applyDirection: "产品管理"
          };
          // 为HRBP测试设置已提交状态
          defaultStatus = 'submitted';
          defaultSubmitTime = '2024-01-14 10:15';
          break;
        case "CERT_APP_003":
          employeeData = {
            applicantName: "李十三",
            applicantId: "EMP001",
            department: "研发部",
            position: "高级工程师",
            currentLevel: "P5",
            applyLevel: "P6",
            applySequence: "技术序列",
            applyDirection: "后端开发"
          };
          // 为HRBP测试设置审批中状态
          defaultStatus = 'reviewing';
          defaultSubmitTime = '2024-01-12 09:45';
          break;
        default:
          employeeData = {
            applicantName: "张三",
            applicantId: "EMP002",
            department: "研发部",
            position: "工程师",
            currentLevel: "P3",
            applyLevel: "P4",
            applySequence: "技术序列",
            applyDirection: "后端开发"
          };
          // 为HRBP测试设置已提交状态
          defaultStatus = 'submitted';
          defaultSubmitTime = '2024-01-15 16:30';
      }
      
      // 填充基本信息用于演示
      const basicInfo = {
        phone: "13800138000",
        email: `${employeeData.applicantId.toLowerCase()}@company.com`,
        joinDate: "2022-01-15",
        education: "本科",
        major: "计算机科学与技术"
      };
      
      const applicationReason = `我在当前岗位工作了2年多，在技术能力和项目经验方面已经具备了${employeeData.applyLevel}级别的要求。通过多个项目的实践，我在${employeeData.applyDirection}方向积累了丰富的经验，希望能够获得${employeeData.applyLevel}级别的认证。`;
      
      const developmentPlan = `未来3年内，我计划在${employeeData.applyDirection}领域继续深入发展，提升架构设计和团队协作能力，为成为高级技术专家打下坚实基础。`;
      
      // 根据不同状态添加模拟审批理由
      let approvalData = {};
      if (defaultStatus === 'reviewing') {
        approvalData = {
          hrbpApprovalComment: "申请材料完整，申请人技术能力符合P6级别要求，同意提交体系负责人审批。",
          hrbpApprovalTime: "2024-01-13 10:30",
          hrbpApprover: "HRBP张丽"
        };
      } else if (defaultStatus === 'approved') {
        approvalData = {
          hrbpApprovalComment: "申请材料完整，申请人技术能力符合要求，同意提交体系负责人审批。",
          hrbpApprovalTime: "2024-01-13 10:30",
          hrbpApprover: "HRBP张丽",
          systemLeaderApprovalComment: "申请人在项目中表现优秀，技术水平和团队协作能力突出，符合晋升要求，批准晋升申请。",
          systemLeaderApprovalTime: "2024-01-14 15:20",
          systemLeaderApprover: "技术总监王大山"
        };
      } else if (defaultStatus === 'rejected') {
        approvalData = {
          hrbpApprovalComment: "申请人工作经验尚不足以支撑目标职级要求，建议继续积累经验后重新申请。",
          hrbpApprovalTime: "2024-01-13 10:30",
          hrbpApprover: "HRBP张丽"
        };
      }

      // 如果localStorage中有保存的数据，使用保存的数据；否则使用默认数据
      const finalApplication = savedApplication || {
        ...employeeData,
        status: defaultStatus,
        submitTime: defaultSubmitTime,
        basicInfo,
        applicationReason,
        developmentPlan,
        ...approvalData,
        workExperience: [
          {
            company: "当前公司",
            position: employeeData.position,
            duration: "2022-01 至今",
            description: `负责${employeeData.applyDirection}相关工作，参与多个核心项目的设计和开发。`
          }
        ],
        projectExperience: [
          {
            name: "核心业务系统",
            role: "核心开发者",
            duration: "6个月",
            technology: "Java/Spring/MySQL/Redis",
            achievement: "负责系统架构设计，性能提升30%"
          }
        ],
        selfAssessment: {
          technicalAbility: 4,
          communicationAbility: 4,
          leadershipAbility: 3,
          learningAbility: 5,
          problemSolvingAbility: 4
        }
      };
      
      setApplication(prev => ({
        ...prev,
        ...finalApplication
      }));
      
      setLoading(false);
    };
    
    // 模拟加载延迟
    setTimeout(loadApplicationData, 1000);
  }, [applicationId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 可编辑性控制：只有员工在草稿或驳回状态下可编辑
  const isEditable = isEmployee && (application.status === 'draft' || application.status === 'rejected');

  // 更新基本信息
  // 数据更新函数
  const updateField = (field: keyof CertificationApplication, value: string) => {
    setApplication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 文件上传状态
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'application' | 'evidence'>('application');

  // 处理文件上传
  const handleFileUpload = (files: FileList | null, type: 'application' | 'evidence') => {
    if (!files || files.length === 0) return;
    
    if (type === 'application') {
      setApplication(prev => ({
        ...prev,
        applicationFormFile: files[0]
      }));
    } else {
      setApplication(prev => ({
        ...prev,
        evidenceFiles: Array.from(files)
      }));
    }
    setShowUploadDialog(false);
  };

  // 保存草稿
  const handleSave = async () => {
    setSaving(true);
    // 模拟保存
    setTimeout(() => {
      setSaving(false);
      // 显示保存成功提示
    }, 1000);
  };

  // 提交申请
  const handleSubmit = async () => {
    setSubmitting(true);
    
    // 模拟提交
    setTimeout(() => {
      setSubmitting(false);
      setApplication(prev => ({ ...prev, status: 'submitted', submitTime: new Date().toLocaleString('zh-CN') }));
      
      // 发送消息给体系HRBP
      const newMessage = {
        id: `MSG_${Date.now()}`,
        title: "认证申请待审批",
        content: `员工${application.applicantName}已提交任职资格认证申请，申请职级：${application.applyTechLevel}，类别：${application.category}，请及时进行审批。`,
        type: "certification" as const,
        isRead: false,
        timestamp: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-'),
        sender: application.applicantName,
        relatedId: applicationId,
        recipientId: "3" // HRBP用户ID
      };
      
      // 将消息保存到localStorage
      const existingMessages = JSON.parse(localStorage.getItem('hrMessages') || '[]');
      existingMessages.push(newMessage);
      localStorage.setItem('hrMessages', JSON.stringify(existingMessages));
      
      // 保存申请状态到localStorage
      const existingApplications = JSON.parse(localStorage.getItem('certificationApplications') || '{}');
      existingApplications[applicationId] = { 
        ...application, 
        status: 'submitted', 
        submitTime: new Date().toLocaleString('zh-CN') 
      };
      localStorage.setItem('certificationApplications', JSON.stringify(existingApplications));
      
      alert("认证申请表提交成功！体系HRBP将收到审批通知。");
      router.push('/talent-standards');
    }, 1500);
  };

  // 编辑申请
  const handleEdit = () => {
    setApplication(prev => ({ ...prev, status: 'draft' }));
    
    // 保存为草稿状态
    const existingApplications = JSON.parse(localStorage.getItem('certificationApplications') || '{}');
    existingApplications[applicationId] = { ...application, status: 'draft' };
    localStorage.setItem('certificationApplications', JSON.stringify(existingApplications));
    
    alert("已切换为编辑模式，您可以修改申请信息。");
  };

  // 下载材料
  const handleDownload = () => {
    // 创建申请材料内容
          const content = `
任职资格认证申请表

申请人：${application.applicantName}
部门：${application.department}
职务：${application.position}
当前技术职级：${application.currentTechLevel}
申请技术职级：${application.applyTechLevel}
类别：${application.category}
子类：${application.subCategory}
方向：${application.direction}
横向角色：${application.horizontalRole}
体系：${application.system}
团队：${application.team}

认证信息：
当前技术职级认证时间：${application.currentTechLevelCertTime}
申请周期：${application.applicationPeriod}
知识技能鉴定结果：${application.knowledgeSkillAssessment}

申请时间：${application.createTime}
${application.submitTime ? `提交时间：${application.submitTime}` : ''}
    `;
    
    // 创建下载链接
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `认证申请表_${application.applicantName}_${applicationId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // 星级评分组件
  const StarRating = ({ value, onChange, readOnly = false }: { value: number; onChange: (value: number) => void; readOnly?: boolean }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange(star)}
            disabled={readOnly}
            className={`p-1 ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${!readOnly ? 'hover:text-yellow-400' : ''} transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <StarIcon className="h-5 w-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
      </div>
    );
  };

  // 处理审批
  const handleApproval = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  // 确认审批
  const confirmApproval = () => {
    const newMessage = {
      id: `MSG_${Date.now()}`,
      title: approvalAction === 'approve' ? 
        (isHRBP ? "认证申请已通过初审" : "认证申请已通过终审") : 
        "认证申请被驳回",
      content: approvalAction === 'approve' 
        ? (isHRBP 
          ? `您的任职资格认证申请已通过体系HRBP初审，正在流转至体系负责人进行最终审批。${approvalComment ? `审批意见：${approvalComment}` : ''}`
          : `恭喜！您的任职资格认证申请已通过最终审批，职级调整将在下个月生效。${approvalComment ? `审批意见：${approvalComment}` : ''}`)
        : `您的任职资格认证申请被${isHRBP ? '体系HRBP' : '体系负责人'}驳回，请查看驳回原因并重新提交。驳回原因：${approvalComment}`,
      type: "certification" as const,
      isRead: false,
      timestamp: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      sender: isHRBP ? "体系HRBP" : "体系负责人",
      relatedId: applicationId,
      recipientId: "1" // 员工用户ID
    };
    
    let messages = [newMessage];
    
    // 如果是HRBP通过，还要发送消息给体系负责人
    if (approvalAction === 'approve' && isHRBP) {
      const leaderMessage = {
        id: `MSG_${Date.now() + 1}`,
        title: "认证申请待终审",
        content: `员工${application.applicantName}的任职资格认证申请已通过体系HRBP初审，请进行最终审批。申请职级：${application.applyTechLevel}，类别：${application.category}。`,
        type: "certification" as const,
        isRead: false,
        timestamp: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-'),
        sender: "体系HRBP",
        relatedId: applicationId,
        recipientId: "4" // 体系负责人用户ID
      };
      messages.push(leaderMessage);
    }
    
    // 保存消息
    const existingMessages = JSON.parse(localStorage.getItem('hrMessages') || '[]');
    existingMessages.push(...messages);
    localStorage.setItem('hrMessages', JSON.stringify(existingMessages));
    
    // 更新申请状态
    const existingApplications = JSON.parse(localStorage.getItem('certificationApplications') || '{}');
    const newStatus = approvalAction === 'approve' 
      ? (isHRBP ? 'reviewing' : 'approved') 
      : 'rejected';

    // 构建审批理由数据
    const approvalData = isHRBP ? {
      hrbpApprovalComment: approvalComment,
      hrbpApprovalTime: new Date().toLocaleString('zh-CN'),
      hrbpApprover: "体系HRBP"
    } : {
      systemLeaderApprovalComment: approvalComment,
      systemLeaderApprovalTime: new Date().toLocaleString('zh-CN'),
      systemLeaderApprover: "体系负责人"
    };
      
    existingApplications[applicationId] = {
      ...application,
      status: newStatus,
      ...approvalData
    };
    localStorage.setItem('certificationApplications', JSON.stringify(existingApplications));
    
    // 更新本地状态
    setApplication(prev => ({
      ...prev,
      status: newStatus as any,
      ...approvalData
    }));
    
    setShowApprovalDialog(false);
    setApprovalComment("");
    
    const successMessage = approvalAction === 'approve' 
      ? (isHRBP ? "申请已通过，已流转至体系负责人" : "申请已通过终审")
      : "申请已驳回，员工将收到通知";
    alert(successMessage);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C5E5C] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 进度条组件
  const ProgressIndicator = () => {
    const steps = [
      { key: 'draft', label: '草稿阶段', description: '申请人填写申请表' },
      { key: 'submitted', label: 'HRBP审批', description: 'HRBP进行初步审核' },
      { key: 'reviewing', label: '体系负责人审批', description: '体系负责人最终审批' },
      { key: 'completed', label: '审批完成', description: '审批流程结束' }
    ];

    const getCurrentStepIndex = () => {
      switch (application.status) {
        case 'draft': return 0;
        case 'submitted': return 1;
        case 'reviewing': return 2;
        case 'approved':
        case 'rejected': return 3;
        default: return 0;
      }
    };

    const currentStep = getCurrentStepIndex();

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">审批进度</h3>
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {/* 步骤圆圈 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 z-10 ${
                index < currentStep 
                  ? 'bg-[#3C5E5C] text-white' 
                  : index === currentStep 
                    ? application.status === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#3C5E5C] text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              
              {/* 步骤标签 */}
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
                <div className={`text-xs mt-1 ${
                  index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
          
          {/* 连接线 */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 1 }}>
            <div 
              className="h-full bg-[#3C5E5C] transition-all duration-300"
              style={{ 
                width: `${(currentStep / (steps.length - 1)) * 100}%` 
              }}
            />
          </div>
        </div>
        
        {/* 当前状态描述 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm">
            <span className="font-medium text-gray-900">当前状态：</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              application.status === 'draft' ? 'bg-gray-100 text-gray-700' :
              application.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
              application.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
              application.status === 'approved' ? 'bg-green-100 text-green-700' :
              application.status === 'rejected' ? 'bg-red-100 text-red-700' : ''
            }`}>
              {application.status === 'draft' && '草稿'}
              {application.status === 'submitted' && '已提交，等待HRBP审批'}
              {application.status === 'reviewing' && '已通过HRBP审批，等待体系负责人审批'}
              {application.status === 'approved' && '审批通过'}
              {application.status === 'rejected' && '审批驳回'}
            </span>
          </div>
          {application.submitTime && (
            <div className="text-xs text-gray-600 mt-1">
              提交时间：{application.submitTime}
            </div>
          )}
        </div>

        {/* 审批理由信息容器 */}
        {(application.hrbpApprovalComment || application.systemLeaderApprovalComment) && (
          <div className="mt-3 space-y-3">
            {/* HRBP审批理由 */}
            {application.hrbpApprovalComment && (
              <div className={`p-3 rounded-md border-l-4 ${
                application.status === 'rejected' 
                  ? 'bg-red-50 border-red-400' 
                  : 'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    application.status === 'rejected' ? 'bg-red-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        HRBP审批意见
                      </span>
                      <span className="text-xs text-gray-500">
                        {application.hrbpApprover} · {application.hrbpApprovalTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {application.hrbpApprovalComment}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 体系负责人审批理由 */}
            {application.systemLeaderApprovalComment && (
              <div className={`p-3 rounded-md border-l-4 ${
                application.status === 'approved' 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    application.status === 'approved' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        体系负责人审批意见
                      </span>
                      <span className="text-xs text-gray-500">
                        {application.systemLeaderApprover} · {application.systemLeaderApprovalTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {application.systemLeaderApprovalComment}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-4 bg-[#f4f7fa]">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-1"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>返回</span>
          </Button>
          <div>
            <h1 className="text-[18px] font-bold text-gray-800">认证申请表</h1>
            <p className="text-sm text-gray-500">
              申请技术职级：{application.applyTechLevel} | 类别：{application.category}
            </p>
          </div>
        </div>
        

      </div>
      
      {/* 进度条 */}
      <ProgressIndicator />

      <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-gray-100">
          <CardTitle className="text-sm font-medium text-[#3C5E5C] flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            任职资格认证申请表
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-6">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white">基本信息</TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-white">文件上传</TabsTrigger>
            </TabsList>

            {/* 基本信息 */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">申请人姓名 *</Label>
                    <Input 
                      value={application.applicantName}
                      onChange={(e) => updateField('applicantName', e.target.value)}
                      placeholder="请输入申请人姓名"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">类 *</Label>
                    <Input 
                      value={application.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      placeholder="请输入类别"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">子类 *</Label>
                    <Input 
                      value={application.subCategory}
                      onChange={(e) => updateField('subCategory', e.target.value)}
                      placeholder="请输入子类"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">方向 *</Label>
                    <Input 
                      value={application.direction}
                      onChange={(e) => updateField('direction', e.target.value)}
                      placeholder="请输入方向"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">职务 *</Label>
                    <Input 
                      value={application.position}
                      onChange={(e) => updateField('position', e.target.value)}
                      placeholder="请输入职务"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">横向角色 *</Label>
                    <Input 
                      value={application.horizontalRole}
                      onChange={(e) => updateField('horizontalRole', e.target.value)}
                      placeholder="请输入横向角色"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">体系 *</Label>
                    <Input 
                      value={application.system}
                      onChange={(e) => updateField('system', e.target.value)}
                      placeholder="请输入体系"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">部门 *</Label>
                    <Input 
                      value={application.department}
                      onChange={(e) => updateField('department', e.target.value)}
                      placeholder="请输入部门"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">团队 *</Label>
                    <Input 
                      value={application.team}
                      onChange={(e) => updateField('team', e.target.value)}
                      placeholder="请输入团队"
                      readOnly={!isEditable}
                      className={!isEditable ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">当前技术职级</Label>
                    <Input 
                      value={application.currentTechLevel}
                      disabled
                      className="bg-gray-50"
                      placeholder="系统默认带出"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">当前技术职级认证时间</Label>
                    <Input 
                      value={application.currentTechLevelCertTime}
                      disabled
                      className="bg-gray-50"
                      placeholder="系统默认带出"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">申请周期</Label>
                    <Input 
                      value={application.applicationPeriod}
                      disabled
                      className="bg-gray-50"
                      placeholder="系统默认带出"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">申请技术职级 *</Label>
                    <Select value={application.applyTechLevel} onValueChange={(value) => updateField('applyTechLevel', value)} disabled={!isEditable}>
                      <SelectTrigger className={!isEditable ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="请选择申请技术职级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P1">P1</SelectItem>
                        <SelectItem value="P2">P2</SelectItem>
                        <SelectItem value="P3">P3</SelectItem>
                        <SelectItem value="P4">P4</SelectItem>
                        <SelectItem value="P5">P5</SelectItem>
                        <SelectItem value="P6">P6</SelectItem>
                        <SelectItem value="P7">P7</SelectItem>
                        <SelectItem value="P8">P8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">知识技能鉴定结果</Label>
                    <Input 
                      value={application.knowledgeSkillAssessment}
                      disabled
                      className="bg-gray-50"
                      placeholder="系统默认带出"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 文件上传 */}
            <TabsContent value="upload" className="space-y-6">
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">申请人申请表</h3>
                      <p className="text-sm text-gray-600">请上传申请人申请表文件</p>
                    </div>
                    <Button 
                      onClick={() => {
                        setUploadType('application');
                        setShowUploadDialog(true);
                      }}
                      disabled={!isEditable}
                      className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                    >
                      上传申请表
                    </Button>
                  </div>
                  {application.applicationFormFile && (
                    <div className="text-sm text-gray-600">
                      已上传文件：{application.applicationFormFile.name}
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">证明材料</h3>
                      <p className="text-sm text-gray-600">请上传相关证明材料文件</p>
                    </div>
                    <Button 
                      onClick={() => {
                        setUploadType('evidence');
                        setShowUploadDialog(true);
                      }}
                      disabled={!isEditable}
                      className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white"
                    >
                      上传证明材料
                    </Button>
                  </div>
                  {application.evidenceFiles && application.evidenceFiles.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <p>已上传 {application.evidenceFiles.length} 个文件：</p>
                      <ul className="list-disc list-inside mt-2">
                        {application.evidenceFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 文件上传弹窗 */}
          {showUploadDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {uploadType === 'application' ? '上传申请表' : '上传证明材料'}
                </h3>
                
                <div className="mb-4">
                  <input
                    type="file"
                    multiple={uploadType === 'evidence'}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files, uploadType)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3C5E5C] file:text-white hover:file:bg-[#2A4A48]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    支持格式：PDF, DOC, DOCX, JPG, JPEG, PNG
                    {uploadType === 'evidence' && '，可选择多个文件'}
                  </p>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowUploadDialog(false)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {application.status === 'draft' && "申请表将保存为草稿，您可以随时返回编辑"}
              {application.status === 'submitted' && `已于 ${application.submitTime} 提交申请`}
              {application.status === 'reviewing' && "申请正在审批中"}
              {application.status === 'approved' && "申请已通过审批"}
              {application.status === 'rejected' && "申请已被驳回"}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 下载材料按钮 - 所有状态都可下载 */}
              <Button 
                variant="outline"
                onClick={handleDownload}
                className="flex items-center space-x-1"
              >
                <FileTextIcon className="h-4 w-4" />
                <span>下载材料</span>
              </Button>
              
              {/* 审批按钮 - 仅HRBP和体系负责人可见 */}
              {isApprover && (application.status === 'submitted' || application.status === 'reviewing') && (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => handleApproval('reject')}
                    className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <span>驳回</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleApproval('approve')}
                    className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white flex items-center space-x-1"
                  >
                    <span>通过</span>
                  </Button>
                </>
              )}
              
              {/* 编辑按钮 - 员工在已提交或被驳回时可编辑 */}
              {isEmployee && (application.status === 'submitted' || application.status === 'rejected') && (
                <Button 
                  variant="outline"
                  onClick={handleEdit}
                  className="flex items-center space-x-1"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>编辑</span>
                </Button>
              )}
              
              {/* 草稿状态的保存和提交按钮 - 仅员工可见 */}
              {isEmployee && application.status === 'draft' && (
                <>
                  <Button 
                    variant="outline"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-1"
                  >
                    <SaveIcon className="h-4 w-4" />
                    <span>{saving ? "保存中..." : "保存草稿"}</span>
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white flex items-center space-x-1"
                  >
                    <SendIcon className="h-4 w-4" />
                    <span>{submitting ? "提交中..." : "提交申请"}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* 审批对话框 */}
          {showApprovalDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {approvalAction === 'approve' ? '确认通过申请' : '确认驳回申请'}
                </h3>
                
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    {approvalAction === 'approve' ? '审批意见（可选）' : '驳回原因（必填）'}
                  </Label>
                  <Textarea 
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder={approvalAction === 'approve' ? '请输入审批意见...' : '请输入驳回原因...'}
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowApprovalDialog(false);
                      setApprovalComment("");
                    }}
                  >
                    取消
                  </Button>
                  
                  <Button 
                    onClick={confirmApproval}
                    disabled={approvalAction === 'reject' && !approvalComment.trim()}
                    className={approvalAction === 'approve' 
                      ? "bg-[#3C5E5C] hover:bg-[#2A4A48] text-white" 
                      : "bg-red-600 hover:bg-red-700 text-white"
                    }
                  >
                    确认{approvalAction === 'approve' ? '通过' : '驳回'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}