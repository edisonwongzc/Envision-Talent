'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkHistoryContent } from '../../profile-detail';

/**
 * 工作履历页面
 * @returns {React.ReactElement} 工作履历页面
 */
export default function WorkHistoryPage() {
  const router = useRouter();
  
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
        <h1 className="text-2xl font-semibold">工作履历</h1>
      </div>
      
      <WorkHistoryContent />
    </div>
  );
} 