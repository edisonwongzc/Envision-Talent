import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

/**
 * 占位内容组件（用于未完成的标签内容）
 * @param {object} props - 组件属性
 * @param {string} props.tabName - 标签名称
 * @returns {React.ReactElement} 占位内容
 */
export default function PlaceholderContent({ tabName }: { tabName: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">{tabName}内容</h2>
      <Card className="shadow-sm">
        <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <h3 className="text-gray-500 mb-2">"{tabName}"模块正在开发中</h3>
            <p className="text-sm text-gray-400">此功能即将上线，敬请期待</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 