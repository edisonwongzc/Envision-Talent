'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  VisionSpiritContent, 
  PersonalInfoContent, 
  WorkHistoryContent,
  JobMatchingContent,
  PerformanceContent
} from '../profile-detail';
import ProfileNavTabs from '../components/ProfileNavTabs';
import JobModelContent from '../components/TabContents/JobModelContent';

/**
 * 人才履历详情页面
 * @returns {React.ReactElement} 人才履历详情页面
 */
export default function ProfileDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL查询参数获取初始标签，如果没有默认为"远景精神"
  const initialTab = searchParams?.get('tab') || '远景精神';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // 当URL参数变化时更新活动标签
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  /**
   * 处理返回按钮点击
   */
  const handleBackClick = () => {
    router.back();
  };
  
  /**
   * 处理标签切换
   * @param {string} tab - 标签名称
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // 更新URL查询参数，但不重新加载页面
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };
  
  /**
   * 根据当前活动标签渲染相应内容
   * @returns {React.ReactNode} 内容组件
   */
  const renderContent = () => {
    switch (activeTab) {
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
  
  // 获取当前员工名称（在实际应用中应从API或props获取）
  const employeeName = "李明";
  const employeePosition = "高级工程师";
  
  return (
    <div className="h-full p-6 space-y-4">
      {/* 头部栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{employeeName} - 人才履历</h1>
            <p className="text-sm text-gray-500">{employeePosition}</p>
          </div>
        </div>
      </div>
      
      {/* 导航标签 */}
      <ProfileNavTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* 动态内容区域 */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
} 