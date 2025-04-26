'use client';

import React, { ReactNode } from 'react';

/**
 * 信息项组件属性接口
 * @interface InfoItemProps
 * @property {ReactNode} icon - 图标
 * @property {string} label - 标签
 * @property {ReactNode} value - 值
 */
export interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

/**
 * 信息项组件
 * 
 * 用于显示带图标的键值对信息
 * 
 * @param {InfoItemProps} props - 组件属性
 * @returns {React.ReactElement} 信息项组件
 */
export const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start">
      {icon}
      <div className="ml-2">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}; 