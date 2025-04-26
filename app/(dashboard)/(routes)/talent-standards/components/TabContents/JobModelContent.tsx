import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

/**
 * 岗位模型标签内容组件
 * @returns {React.ReactElement} 岗位模型内容
 */
export default function JobModelContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">岗位模型分析</h2>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-base mb-2">当前岗位：高级研发工程师</h3>
              <p className="text-sm text-gray-600">岗位职责：负责公司核心产品的设计开发和技术攻关，解决复杂技术问题</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-base mb-2">核心能力要求</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-2">专业技能</h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">架构设计能力</span>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★</span>
                        <span className="text-gray-300">★</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">算法与数据结构</span>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★</span>
                        <span className="text-gray-300">★</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">代码质量控制</span>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-2">通用能力</h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">团队协作</span>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★</span>
                        <span className="text-gray-300">★</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">沟通表达</span>
                      <div className="flex">
                        <span className="text-yellow-500">★★★</span>
                        <span className="text-gray-300">★★</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">解决问题能力</span>
                      <div className="flex">
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 