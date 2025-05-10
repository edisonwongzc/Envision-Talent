'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

/**
 * 工作历史内容组件
 * @returns {React.ReactElement} 工作历史内容
 */
const WorkHistoryContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-lg font-medium">工作经历</h2>
        <div className="space-y-4">
          <div className="border-l-2 border-gray-200 pl-4 pb-6 relative">
            <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
            <div className="flex justify-between mb-1">
              <h3 className="font-medium">高级工程师</h3>
              <span className="text-sm text-gray-500">2020年 - 至今</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">某科技有限公司</p>
            <p className="text-sm text-gray-600">负责产品核心模块开发与维护，带领团队完成多个重点项目。</p>
          </div>
          
          <div className="border-l-2 border-gray-200 pl-4 relative">
            <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-[7px] top-1"></div>
            <div className="flex justify-between mb-1">
              <h3 className="font-medium">工程师</h3>
              <span className="text-sm text-gray-500">2017年 - 2020年</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">某软件开发公司</p>
            <p className="text-sm text-gray-600">参与开发多个企业级应用，积累了丰富的项目经验。</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkHistoryContent; 