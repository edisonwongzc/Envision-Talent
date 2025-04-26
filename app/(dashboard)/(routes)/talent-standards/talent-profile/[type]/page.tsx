'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * 处理URL参数类型转化为显示名称
 * @param {string} type - URL中的类型参数
 * @returns {string} 显示名称
 */
const typeToName = (type: string): string => {
  const types: {[key: string]: string} = {
    'vision-spirit': '远景精神',
    'personal-info': '个人信息',
    'job-model': '岗位模型',
    'work-history': '工作履历',
    'job-matching': '人岗匹配',
    'performance': '绩效信息'
  };
  
  return types[type] || type;
};

/**
 * 人才档案类型页面
 * @param {object} params - 页面参数
 * @param {object} params.params - URL参数
 * @param {string} params.params.type - 档案类型
 * @returns {React.ReactElement} 人才档案类型页面
 */
export default function TalentProfileTypePage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const typeName = typeToName(params.type);
  
  /**
   * 处理返回按钮点击
   */
  const handleBackClick = () => {
    router.back();
  };
  
  return (
    <div className="h-full p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackClick}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">{typeName}</h1>
      </div>
      
      <div className="mt-6">
        <p className="text-gray-500">该功能正在开发中...</p>
      </div>
    </div>
  );
} 