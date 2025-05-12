'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileNavTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * 人才履历标签导航组件
 * @param {ProfileNavTabsProps} props - 组件属性
 * @param {string} props.activeTab - 当前活动的标签
 * @param {function} props.onTabChange - 标签切换回调函数
 * @returns {React.ReactElement} 标签导航组件
 */
const ProfileNavTabs: React.FC<ProfileNavTabsProps> = ({ activeTab, onTabChange }) => {
  // 标签列表
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

  return (
    <div className="mb-6">
      <nav className="flex w-full space-x-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileNavTabs; 