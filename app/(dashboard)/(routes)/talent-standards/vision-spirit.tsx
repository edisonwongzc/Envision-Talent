'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

/**
 * 远景精神页面组件
 * @returns {React.ReactElement} 远景精神页面
 */
export default function VisionSpiritPage() {
  const router = useRouter();
  
  /**
   * 处理返回按钮点击
   */
  const handleBackClick = () => {
    router.back();
  };
  
  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 border rounded-full"
            onClick={handleBackClick}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">张三的远景精神评估</h1>
        </div>
        <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white px-4 py-2 rounded">
          导出评估报告
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">远景精神雷达图</CardTitle>
            <p className="text-xs text-gray-600 mt-1">
              对员工四个维度的远景精神评估：求真务实、勇于挑战、干部额外要求、正直博爱
            </p>
          </CardHeader>
          <CardContent>
            {/* 雷达图 */}
            <div className="flex justify-center items-center my-8">
              <div className="w-full max-w-md aspect-square">
                <svg viewBox="0 0 600 600" width="100%" height="100%">
                  <g transform="translate(300, 300)">
                    {/* 背景层 */}
                    <polygon points="0,-160 160,0 0,160 -160,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="0,-120 120,0 0,120 -120,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="0,-80 80,0 0,80 -80,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="0,-40 40,0 0,40 -40,0" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    
                    {/* 坐标轴 */}
                    <line x1="0" y1="0" x2="0" y2="-180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="180" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="0" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="-180" y2="0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    
                    {/* 标签文字 - 调整位置防止被切割 */}
                    <text x="0" y="-210" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">求真务实</text>
                    <text x="210" y="0" textAnchor="start" fontSize="14" fill="#334155" fontWeight="500">勇于挑战</text>
                    <text x="0" y="225" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">干部额外要求</text>
                    <text x="-210" y="0" textAnchor="end" fontSize="14" fill="#334155" fontWeight="500">正直博爱</text>
                    
                    {/* 刻度文字 */}
                    <text x="0" y="-165" textAnchor="middle" fontSize="12" fill="#64748b">4级</text>
                    <text x="0" y="-125" textAnchor="middle" fontSize="12" fill="#64748b">3级</text>
                    <text x="0" y="-85" textAnchor="middle" fontSize="12" fill="#64748b">2级</text>
                    <text x="0" y="-45" textAnchor="middle" fontSize="12" fill="#64748b">1级</text>
                    
                    {/* 员工数据多边形 */}
                    <polygon points="0,-40 60,0 0,60 -40,0" fill="#dbeafe" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2" />
                    
                    {/* 数据点 */}
                    <circle cx="0" cy="-40" r="4" fill="#3b82f6" />
                    <circle cx="60" cy="0" r="4" fill="#3b82f6" />
                    <circle cx="0" cy="60" r="4" fill="#3b82f6" />
                    <circle cx="-40" cy="0" r="4" fill="#3b82f6" />
                  </g>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">评估结果说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">总体评估</h4>
                <p className="text-sm text-blue-700">
                  张三在"勇于挑战"方面表现最为突出，达到2级水平；正直博爱和求真务实方面达到1级标准；
                  在干部额外要求方面达到1.5级水平。整体表现良好，符合公司远景精神要求。
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">各维度详细评估</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 求真务实 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-700">求真务实</h5>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold">1.0</span>
                        <span className="text-xs text-gray-500 ml-1">/4.0</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full relative mb-3">
                      <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full w-[25%]"></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      能够接受事实和数据，但在主动寻求真相方面有待提高。建议加强数据分析能力，提升对复杂问题的剖析能力。
                    </p>
                  </div>
                  
                  {/* 勇于挑战 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-700">勇于挑战</h5>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold">2.0</span>
                        <span className="text-xs text-gray-500 ml-1">/4.0</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full relative mb-3">
                      <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full w-[50%]"></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      在面对困难时展现出良好的韧性，能够提出创新方案解决问题。可以进一步提升在不确定性环境中做决策的能力。
                    </p>
                  </div>
                  
                  {/* 干部额外要求 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-700">干部额外要求</h5>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold">1.5</span>
                        <span className="text-xs text-gray-500 ml-1">/4.0</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full relative mb-3">
                      <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full w-[37.5%]"></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      展现出基本的团队领导能力，能够完成分配的管理任务。需要加强战略思维和团队激励能力，提升影响力。
                    </p>
                  </div>
                  
                  {/* 正直博爱 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-700">正直博爱</h5>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold">1.0</span>
                        <span className="text-xs text-gray-500 ml-1">/4.0</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full relative mb-3">
                      <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full w-[25%]"></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      能够保持诚实守信，遵守公司规范，但在主动关心他人和促进团队合作方面有待提高。建议参与更多团队建设活动。
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">发展建议</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="list-disc pl-5 text-xs text-gray-700 space-y-2">
                    <li>参加公司求真务实专题培训，提升数据分析和问题剖析能力</li>
                    <li>通过参与跨部门项目，锻炼在更广阔领域的挑战能力</li>
                    <li>申请参与管理培训计划，系统学习团队管理和领导力知识</li>
                    <li>主动参与团队建设活动，提升团队协作和人际沟通能力</li>
                    <li>向主管申请每月一次的指导反馈，有针对性地改进不足</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 