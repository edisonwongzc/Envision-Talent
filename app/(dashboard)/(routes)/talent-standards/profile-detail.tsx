'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

/**
 * 星形图标组件
 * @param {object} props - 组件属性
 * @param {number} [props.size=24] - 图标大小
 * @param {boolean} [props.filled=false] - 是否填充
 * @returns {React.ReactElement} 星形图标
 */
const StarIcon = (props: { size?: number; filled?: boolean }) => {
  const { size = 24, filled = false } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

/**
 * 星级评分组件
 * @param {object} props - 组件属性
 * @param {number} props.rating - 评分值
 * @param {number} [props.maxRating=5] - 最大评分
 * @returns {React.ReactElement} 星级评分组件
 */
const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= Math.floor(rating);
    const halfFilled = !filled && i <= Math.ceil(rating) && rating % 1 !== 0;

    stars.push(
      <span key={i} className="text-yellow-400">
        {filled ? (
          <StarIcon size={16} filled={true} />
        ) : halfFilled ? (
          <span className="relative">
            <StarIcon size={16} filled={false} />
            <span className="absolute left-0 top-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon size={16} filled={true} />
            </span>
          </span>
        ) : (
          <StarIcon size={16} filled={false} />
        )}
      </span>
    );
  }

  return <div className="flex">{stars}</div>;
};

/**
 * 远景精神内容组件
 * @returns {React.ReactElement} 远景精神内容
 */
export const VisionSpiritContent: React.FC = () => {
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [positionDropdown, setPositionDropdown] = useState(false);
  const [deptDropdown, setDeptDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState('角色');
  const [selectedPosition, setSelectedPosition] = useState('职级');
  const [selectedDept, setSelectedDept] = useState('道场');
  const [showScoreTable, setShowScoreTable] = useState(false);
  
  // 下拉选项数据
  const positions = ['全部', 'P7', 'P6', 'P5', 'P4'];
  const depts = ['全部', '硬件道场', '软件道场', '算法道场', '测试道场'];
  const roles = ['全部', '研发', '产品', '设计', '测试', '项目'];
  
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* 个人平均分 VS 干部群体中位值 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">个人平均分 VS 群体中位值</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="flex justify-end mb-4 space-x-2">
              {/* 道场下拉框 */}
              <div className="relative">
                <button 
                  className="border rounded-md px-4 py-1.5 flex items-center bg-white hover:bg-gray-50"
                  onClick={() => {
                    setDeptDropdown(!deptDropdown);
                    setPositionDropdown(false);
                    setRoleDropdown(false);
                  }}
                >
                  {selectedDept} <svg className={`w-4 h-4 ml-2 transition-transform ${deptDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {deptDropdown && (
                  <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md py-1 border border-gray-200">
                    {depts.map((dept) => (
                      <div 
                        key={dept}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedDept(dept);
                          setDeptDropdown(false);
                        }}
                      >
                        {dept}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 角色下拉框 */}
              <div className="relative">
                <button 
                  className="border rounded-md px-4 py-1.5 flex items-center bg-white hover:bg-gray-50"
                  onClick={() => {
                    setRoleDropdown(!roleDropdown);
                    setPositionDropdown(false);
                    setDeptDropdown(false);
                  }}
                >
                  {selectedRole} <svg className={`w-4 h-4 ml-2 transition-transform ${roleDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {roleDropdown && (
                  <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md py-1 border border-gray-200">
                    {roles.map((role) => (
                      <div 
                        key={role}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedRole(role);
                          setRoleDropdown(false);
                        }}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="border rounded-md p-3">
                <h4 className="text-md font-medium text-gray-800 mb-3">总 分</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">个人:</span>
                    <span className="text-sm font-medium">116</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">20+:</span>
                    <span className="text-sm font-medium">108</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">19:</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">18:</span>
                    <span className="text-sm font-medium">41</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">17及以下:</span>
                    <span className="text-sm font-medium">115.6</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="text-md font-medium text-gray-800 mb-3">正心正念</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">个人:</span>
                    <span className="text-sm font-medium">116</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">20+:</span>
                    <span className="text-sm font-medium">108</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">19:</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">18:</span>
                    <span className="text-sm font-medium">41</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">17及以下:</span>
                    <span className="text-sm font-medium">115.6</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="text-md font-medium text-gray-800 mb-3">迎难而上</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">个人:</span>
                    <span className="text-sm font-medium">116</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">20+:</span>
                    <span className="text-sm font-medium">108</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">19:</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">18:</span>
                    <span className="text-sm font-medium">41</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">17及以下:</span>
                    <span className="text-sm font-medium">115.6</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="text-md font-medium text-gray-800 mb-3">求真务实</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">个人:</span>
                    <span className="text-sm font-medium">116</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">20+:</span>
                    <span className="text-sm font-medium">108</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">19:</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">18:</span>
                    <span className="text-sm font-medium">41</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">17及以下:</span>
                    <span className="text-sm font-medium">115.6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 远景雷达图和远景精神趋势放在同一行 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 远景雷达图 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">远景雷达图</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex justify-center items-center h-60">
                <div className="w-full max-w-md h-full">
                  <svg viewBox="0 0 600 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  <g transform="translate(300, 300)">
                      {/* 背景层 - 三角形 */}
                      <polygon points="0,-200 173.2,100 -173.2,100" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                      <polygon points="0,-150 129.9,75 -129.9,75" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                      <polygon points="0,-100 86.6,50 -86.6,50" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                      <polygon points="0,-50 43.3,25 -43.3,25" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* 坐标轴 - 三条 */}
                      <line x1="0" y1="0" x2="0" y2="-240" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5" />
                      <line x1="0" y1="0" x2="208" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5" />
                      <line x1="0" y1="0" x2="-208" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5" />

                      {/* 标签文字 - 三个维度 */}
                      <text x="0" y="-260" textAnchor="middle" fontSize="24" fill="#334155" fontWeight="500">迎难而上</text>
                      <text x="240" y="140" textAnchor="start" fontSize="24" fill="#334155" fontWeight="500">求真务实</text>
                      <text x="-240" y="140" textAnchor="end" fontSize="24" fill="#334155" fontWeight="500">正心正念</text>

                    {/* 刻度文字 */}
                      <text x="0" y="-205" textAnchor="middle" fontSize="18" fill="#64748b">5分</text>
                      <text x="0" y="-155" textAnchor="middle" fontSize="18" fill="#64748b">4分</text>
                      <text x="0" y="-105" textAnchor="middle" fontSize="18" fill="#64748b">3分</text>
                      <text x="0" y="-55" textAnchor="middle" fontSize="18" fill="#64748b">2分</text>

                      {/* 个人数据三角形 */}
                      <polygon points="0,-160 138.6,80 -138.6,80" fill="#dbeafe" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="3" />

                    {/* 数据点 */}
                      <circle cx="0" cy="-160" r="7" fill="#3b82f6" />
                      <circle cx="138.6" cy="80" r="7" fill="#3b82f6" />
                      <circle cx="-138.6" cy="80" r="7" fill="#3b82f6" />
                      
                      {/* 数据标签 */}
                      <text x="0" y="-160" dy="-12" textAnchor="middle" fill="#3b82f6" fontSize="24" fontWeight="500">4.2</text>
                      <text x="138.6" y="80" dx="20" textAnchor="start" fill="#3b82f6" fontSize="24" fontWeight="500">4.5</text>
                      <text x="-138.6" y="80" dx="-20" textAnchor="end" fill="#3b82f6" fontSize="24" fontWeight="500">4.0</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

          {/* 远景精神趋势 */}
        <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">远景精神趋势</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="h-60">
                {showScoreTable ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="font-medium">总分117.3</span>
                        <span>正心正念 39.2</span>
                        <span>迎难而上 39.0</span>
                        <span>求真务实 39.1</span>
                      </div>
                      <button 
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs flex items-center border border-blue-200 hover:bg-blue-100 transition-colors"
                        onClick={() => setShowScoreTable(false)}
                      >
                        查看折线图
                      </button>
                    </div>
                    <div className="overflow-auto" style={{maxHeight: "calc(100% - 32px)"}}>
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="border p-1 bg-gray-50"></th>
                            <th className="border p-1 bg-gray-50">下级-7人</th>
                            <th className="border p-1 bg-gray-50">平级-6人</th>
                            <th className="border p-1 bg-gray-50">上级-2人</th>
                            <th className="border p-1 bg-gray-50">执委会-3人</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 bg-gray-50">正心正念</td>
                            <td className="border p-1 text-center">40.9</td>
                            <td className="border p-1 text-center">39.6</td>
                            <td className="border p-1 text-center">39.0</td>
                            <td className="border p-1 text-center">34.7</td>
                          </tr>
                          <tr>
                            <td className="border p-1 bg-gray-50">迎难而上</td>
                            <td className="border p-1 text-center">42.0</td>
                            <td className="border p-1 text-center">38.1</td>
                            <td className="border p-1 text-center">39.0</td>
                            <td className="border p-1 text-center">34.0</td>
                          </tr>
                          <tr>
                            <td className="border p-1 bg-gray-50">求真务实</td>
                            <td className="border p-1 text-center">41.6</td>
                            <td className="border p-1 text-center">38.3</td>
                            <td className="border p-1 text-center">38.5</td>
                            <td className="border p-1 text-center">35.3</td>
                          </tr>
                          <tr>
                            <td className="border p-1 bg-gray-50">总分</td>
                            <td className="border p-1 text-center font-medium">124.4</td>
                            <td className="border p-1 text-center font-medium">116.0</td>
                            <td className="border p-1 text-center font-medium">116.5</td>
                            <td className="border p-1 text-center font-medium">104.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-end mb-2">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-gray-800 rounded-full mr-1"></span>
                          <span>执委会 3人</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></span>
                          <span>上级 2人</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                          <span>平级 6人</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-cyan-400 rounded-full mr-1"></span>
                          <span>下级 7人</span>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center border border-blue-200 hover:bg-blue-100 transition-colors"
                            onClick={() => setShowScoreTable(true)}
                          >
                            查看分数
                          </button>
                        </div>
                      </div>
                    </div>
                    <svg width="100%" height="100%" viewBox="0 0 800 300">
                      {/* 背景网格线 */}
                      <line x1="50" y1="50" x2="750" y2="50" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="100" x2="750" y2="100" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="150" x2="750" y2="150" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="200" x2="750" y2="200" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="250" x2="750" y2="250" stroke="#E5E7EB" strokeWidth="1" />
                      
                      {/* X轴标签 */}
                      <text x="150" y="275" textAnchor="middle" fill="#374151" fontSize="14">正心正念</text>
                      <text x="400" y="275" textAnchor="middle" fill="#374151" fontSize="14">迎难而上</text>
                      <text x="650" y="275" textAnchor="middle" fill="#374151" fontSize="14">求真务实</text>
                      
                      {/* 执委会数据线 - 黑色 */}
                      <polyline 
                        points="150,190 400,210 650,195" 
                        fill="none" 
                        stroke="#1F2937" 
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="190" r="4" fill="#1F2937" />
                      <circle cx="400" cy="210" r="4" fill="#1F2937" />
                      <circle cx="650" cy="195" r="4" fill="#1F2937" />
                      <text x="150" y="190" dy="-10" textAnchor="middle" fill="#1F2937" fontSize="12">34.7</text>
                      <text x="400" y="210" dy="-10" textAnchor="middle" fill="#1F2937" fontSize="12">34.0</text>
                      <text x="650" y="195" dy="-10" textAnchor="middle" fill="#1F2937" fontSize="12">35.3</text>
                      
                      {/* 上级数据线 - 紫色 */}
                      <polyline 
                        points="150,135 400,135 650,135" 
                        fill="none" 
                        stroke="#6366F1" 
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="135" r="4" fill="#6366F1" />
                      <circle cx="400" cy="135" r="4" fill="#6366F1" />
                      <circle cx="650" cy="135" r="4" fill="#6366F1" />
                      <text x="150" y="135" dy="-10" textAnchor="middle" fill="#6366F1" fontSize="12">39.0</text>
                      <text x="400" y="135" dy="-10" textAnchor="middle" fill="#6366F1" fontSize="12">39.0</text>
                      <text x="650" y="135" dy="-10" textAnchor="middle" fill="#6366F1" fontSize="12">38.5</text>
                      
                      {/* 平级数据线 - 蓝色 */}
                      <polyline 
                        points="150,135 400,165 650,130" 
                        fill="none" 
                        stroke="#3B82F6" 
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="135" r="4" fill="#3B82F6" />
                      <circle cx="400" cy="165" r="4" fill="#3B82F6" />
                      <circle cx="650" cy="130" r="4" fill="#3B82F6" />
                      <text x="150" y="135" dy="-25" textAnchor="middle" fill="#3B82F6" fontSize="12">39.6</text>
                      <text x="400" y="165" dy="-10" textAnchor="middle" fill="#3B82F6" fontSize="12">38.1</text>
                      <text x="650" y="130" dy="-10" textAnchor="middle" fill="#3B82F6" fontSize="12">38.3</text>
                      
                      {/* 下级数据线 - 青色 */}
                      <polyline 
                        points="150,110 400,90 650,105" 
                        fill="none" 
                        stroke="#22D3EE" 
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="110" r="4" fill="#22D3EE" />
                      <circle cx="400" cy="90" r="4" fill="#22D3EE" />
                      <circle cx="650" cy="105" r="4" fill="#22D3EE" />
                      <text x="150" y="110" dy="-10" textAnchor="middle" fill="#22D3EE" fontSize="12">40.9</text>
                      <text x="400" y="90" dy="-10" textAnchor="middle" fill="#22D3EE" fontSize="12">42.0</text>
                      <text x="650" y="105" dy="-10" textAnchor="middle" fill="#22D3EE" fontSize="12">41.6</text>
                    </svg>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TOP5 标签和 Bottom5 标签 放在同一行 */}
        <div className="grid grid-cols-2 gap-6">
          {/* TOP5 标签 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="overflow-auto" style={{maxHeight: "280px"}}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-2 pr-4 border-b border-gray-200">Top5标签</th>
                      <th className="text-center py-2 border-b border-gray-200 w-16">分数</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">正心正念-带头弘扬远景价值观</td>
                      <td className="text-center py-2 border-b border-gray-100 text-blue-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">正心正念-主动担责，放下我执</td>
                      <td className="text-center py-2 border-b border-gray-100 text-blue-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">求真务实-带头深入问题解决</td>
                      <td className="text-center py-2 border-b border-gray-100 text-blue-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">迎难而上-在逆境和高压下，保持清晰清明</td>
                      <td className="text-center py-2 border-b border-gray-100 text-blue-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">正心正念-时刻以远景价值观来要求提升自己</td>
                      <td className="text-center py-2 border-b border-gray-100 text-blue-600">4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom5 标签 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="overflow-auto" style={{maxHeight: "280px"}}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-2 pr-4 border-b border-gray-200">Bottom5标签</th>
                      <th className="text-center py-2 border-b border-gray-200 w-16">分数</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">求真务实-对技术探索充满热情和好奇心</td>
                      <td className="text-center py-2 border-b border-gray-100 text-amber-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">迎难而上-反求诸己，持续提升自我</td>
                      <td className="text-center py-2 border-b border-gray-100 text-amber-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">迎难而上-有牛犊精神，敢于指出问题</td>
                      <td className="text-center py-2 border-b border-gray-100 text-amber-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">正心正念-重视长期主义，超越短期功利</td>
                      <td className="text-center py-2 border-b border-gray-100 text-amber-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 border-b border-gray-100">正心正念-爱岗尽责，不只做领导关心的事</td>
                      <td className="text-center py-2 border-b border-gray-100 text-amber-600">4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 远景精神 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">远景精神评价</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="grid grid-cols-3 gap-4">
              {/* 正心正念 */}
              <div className="p-4 border rounded-md">
                <h4 className="font-medium text-gray-800 text-center mb-3">正心正念</h4>
          <div className="space-y-4">
            <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">好评：</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                      始终以集体利益为上，实现大我；有群众基础，处处为组织考虑，迅速在团队建立威信推动工作
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">待提升：</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      需要提升系统观，从整体架构、流程全局多做系统性思考；从业务细节中适当抽身，帮助团队成长，提升效率
                    </p>
                  </div>
                </div>
            </div>

              {/* 迎难而上 */}
              <div className="p-4 border rounded-md">
                <h4 className="font-medium text-gray-800 text-center mb-3">迎难而上</h4>
                <div className="space-y-4">
            <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">好评：</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                      敢于迈进无人区域，努力做出成绩；接管LMT团队后带领团队顺利完成过渡，继续在质量管理多个维度做提升，不断做实内部机制建设；同时迅速投入到资产管理的新业务线，取得亮眼成绩
              </p>
                  </div>
                </div>
            </div>

              {/* 求真务实 */}
              <div className="p-4 border rounded-md">
                <h4 className="font-medium text-gray-800 text-center mb-3">求真务实</h4>
                <div className="space-y-4">
            <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">好评：</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                      沉着冷静，从而把握问题关键点扭转局势
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 关键事件记录和远景精神提升报告放在同一行 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 关键事件正负向 */}
          <div className="bg-gray-50 p-4 rounded-md h-full">
            <h3 className="text-lg font-medium mb-3">关键事件记录</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 h-[calc(100%-3rem)]">
              <div className="space-y-5 overflow-auto h-full">
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    项目A关键突破（正向）
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    在项目A关键阶段，主动承担技术难题攻关，经过一周加班加点，成功解决了系统性能瓶颈问题，使项目如期交付，获得客户高度评价。
                  </p>
                  <div className="text-xs text-gray-500 mt-1">2023-10-15 | 记录人: 王经理</div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    技术分享会（正向）
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    主动组织部门技术分享会，系统性地总结了最新技术应用经验，带动团队成员提升技术能力，形成了良好的学习氛围。
                  </p>
                  <div className="text-xs text-gray-500 mt-1">2023-08-24 | 记录人: 李总监</div>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    沟通不畅（负向）
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    在跨部门协作项目中，因沟通不及时导致工作衔接出现问题，造成项目延期3天，需要加强与其他部门的沟通协调能力。
                  </p>
                  <div className="text-xs text-gray-500 mt-1">2023-09-05 | 记录人: 张主管</div>
                </div>
              </div>
            </div>
          </div>

          {/* 远景精神提升报告 */}
          <div className="bg-gray-50 p-4 rounded-md h-full">
            <h3 className="text-lg font-medium mb-3">远景精神提升报告</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 h-[calc(100%-3rem)]">
              <div className="space-y-4 overflow-auto h-full">
                <div>
                  <h4 className="font-medium text-gray-800">综合评估</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    员工在远景精神各维度表现良好，总体评分4.2分，高于部门平均水平。特别在「关键价值创造」和「求真务实」方面表现突出。需要关注「领导力」维度的提升。
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">优势发挥</h4>
                  <div className="pl-4 border-l-2 border-green-500 mt-2">
                    <p className="text-sm text-gray-600">
                      1. 继续发挥在「关键价值创造」方面的优势，可承担更多具有挑战性的任务；
                    </p>
                    <p className="text-sm text-gray-600">
                      2. 将「求真务实」的工作方法分享给团队，形成良好工作氛围；
                    </p>
                    <p className="text-sm text-gray-600">
                      3. 在跨部门合作中担任关键角色，提升影响力。
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">提升计划</h4>
                  <div className="pl-4 border-l-2 border-amber-500 mt-2">
                    <p className="text-sm text-gray-600">
                      1. 参加领导力培训课程，提升团队管理能力；
                    </p>
                    <p className="text-sm text-gray-600">
                      2. 加强与跨部门同事的有效沟通，建立定期沟通机制；
                    </p>
                    <p className="text-sm text-gray-600">
                      3. 学习时间管理技巧，提高工作效率；
                    </p>
                    <p className="text-sm text-gray-600">
                      4. 在高压环境下保持冷静的能力训练，提升压力应对能力。
              </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">期望目标</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    预计在下一评估周期中，「领导力」维度可提升至4.3分以上，整体远景精神评分达到4.5分，所有维度均优于部门平均水平。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 人才九宫格
 * @returns {React.ReactElement} 九宫格图表
 */
const renderNineGridChart = () => {
  return (
    <div className="h-[420px] p-4">
      <svg width="100%" height="100%" viewBox="0 0 700 400">
        {/* 背景 */}
        <rect x="60" y="20" width="600" height="340" fill="white" stroke="#E5E7EB" strokeWidth="1" />

        {/* 九宫格线条 */}
        <line x1="60" y1="127" x2="660" y2="127" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="60" y1="233" x2="660" y2="233" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="260" y1="20" x2="260" y2="360" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="460" y1="20" x2="460" y2="360" stroke="#E5E7EB" strokeWidth="1" />

        {/* 九宫格标题 */}
        <g className="text-sm font-medium">
          {/* 第一行 */}
          <rect x="60" y="20" width="200" height="107" fill="#4CAF50" fillOpacity="0.8" />
          <text x="160" y="73" textAnchor="middle" fill="white" fontSize="14">Workers</text>
          <text x="160" y="93" textAnchor="middle" fill="white" fontSize="12">工蜂</text>

          <rect x="260" y="20" width="200" height="107" fill="#4CAF50" fillOpacity="0.9" />
          <text x="360" y="73" textAnchor="middle" fill="white" fontSize="14">Contributors</text>
          <text x="360" y="93" textAnchor="middle" fill="white" fontSize="12">贡献者</text>

          <rect x="460" y="20" width="200" height="107" fill="#8BC34A" />
          <text x="560" y="73" textAnchor="middle" fill="white" fontSize="14">Stars</text>
          <text x="560" y="93" textAnchor="middle" fill="white" fontSize="12">明星</text>

          {/* 第二行 */}
          <rect x="60" y="127" width="200" height="106" fill="#9E9E9E" />
          <text x="160" y="180" textAnchor="middle" fill="white" fontSize="14">Blockers</text>
          <text x="160" y="200" textAnchor="middle" fill="white" fontSize="12">阻碍者</text>

          <rect x="260" y="127" width="200" height="106" fill="#4CAF50" />
          <text x="360" y="180" textAnchor="middle" fill="white" fontSize="14">Transitionals</text>
          <text x="360" y="200" textAnchor="middle" fill="white" fontSize="12">过渡者</text>

          <rect x="460" y="127" width="200" height="106" fill="#4CAF50" />
          <text x="560" y="180" textAnchor="middle" fill="white" fontSize="14">Emergers</text>
          <text x="560" y="200" textAnchor="middle" fill="white" fontSize="12">才华初露者</text>

          {/* 第三行 */}
          <rect x="60" y="233" width="200" height="127" fill="#9E9E9E" />
          <text x="160" y="297" textAnchor="middle" fill="white" fontSize="14">Detractors</text>
          <text x="160" y="317" textAnchor="middle" fill="white" fontSize="12">拖木</text>

          <rect x="260" y="233" width="200" height="127" fill="#9E9E9E" />
          <text x="360" y="297" textAnchor="middle" fill="white" fontSize="14">Placeholders</text>
          <text x="360" y="317" textAnchor="middle" fill="white" fontSize="12">占位者</text>

          <rect x="460" y="233" width="200" height="127" fill="#4CAF50" />
          <text x="560" y="297" textAnchor="middle" fill="white" fontSize="14">Latents</text>
          <text x="560" y="317" textAnchor="middle" fill="white" fontSize="12">潜力者</text>
        </g>

        {/* 坐标轴标签 */}
        <text x="680" y="190" fontSize="12" fill="#64748B" transform="rotate(90, 680, 190)">Performance 绩效</text>
        <text x="360" y="390" fontSize="12" fill="#64748B" textAnchor="middle">Potential 潜质</text>

        {/* 坐标轴刻度 */}
        <text x="40" y="73" textAnchor="end" fill="#64748B" fontSize="12">Exceeded优</text>
        <text x="40" y="180" textAnchor="end" fill="#64748B" fontSize="12">Met中</text>
        <text x="40" y="297" textAnchor="end" fill="#64748B" fontSize="12">Below低</text>

        <text x="160" y="380" textAnchor="middle" fill="#64748B" fontSize="12">low低</text>
        <text x="360" y="380" textAnchor="middle" fill="#64748B" fontSize="12">Medium中</text>
        <text x="560" y="380" textAnchor="middle" fill="#64748B" fontSize="12">High高</text>

        {/* 团队成员标记（示例数据） */}
        <circle cx="120" cy="80" r="10" fill="#3B82F6" />
        <text x="120" y="80" textAnchor="middle" fill="white" fontSize="10">张三</text>

        <circle cx="320" cy="60" r="10" fill="#3B82F6" />
        <text x="320" y="60" textAnchor="middle" fill="white" fontSize="10">李四</text>

        <circle cx="520" cy="70" r="10" fill="#3B82F6" />
        <text x="520" y="70" textAnchor="middle" fill="white" fontSize="10">王五</text>

        <circle cx="280" cy="150" r="10" fill="#3B82F6" />
        <text x="280" y="150" textAnchor="middle" fill="white" fontSize="10">赵六</text>

        <circle cx="500" cy="170" r="10" fill="#3B82F6" />
        <text x="500" y="170" textAnchor="middle" fill="white" fontSize="10">孙七</text>

        <circle cx="550" cy="280" r="10" fill="#3B82F6" />
        <text x="550" y="280" textAnchor="middle" fill="white" fontSize="10">周八</text>
      </svg>
    </div>
  );
};

/**
 * OKR 列表表单组件
 */
interface OKRItem {
  id: number;
  weight: number;
  objective: string;
  keyResults: string;
  keyActions: string;
  isCross: boolean;
  crossManagerId?: string;
}

const OKRList: React.FC = () => {
  const [okrList, setOkrList] = useState<OKRItem[]>([
    {
      id: 1,
      weight: 40,
      objective: "通过优化产品开发流程，提升团队交付效率",
      keyResults: "1. 将项目交付周期缩短20%\n2. 客户满意度提升至4.5分\n3. 减少30%的返工率",
      keyActions: "1. 实施敏捷开发方法\n2. 优化代码审核流程\n3. 引入自动化测试工具",
      isCross: false,
      crossManagerId: ""
    },
    {
      id: 2,
      weight: 30,
      objective: "提升团队技术能力，解决系统架构扩展性挑战",
      keyResults: "1. 完成新架构设计并获得评审通过\n2. 核心服务性能提升50%\n3. 系统故障率下降40%",
      keyActions: "1. 组织技术培训\n2. 引入新技术栈\n3. 重构关键模块",
      isCross: true,
      crossManagerId: "10086"
    }
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OKRItem>({
    id: 0,
    weight: 0,
    objective: '',
    keyResults: '',
    keyActions: '',
    isCross: false,
    crossManagerId: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [weightError, setWeightError] = useState<string | null>(null);
  // 新增提示弹窗状态
  const [showOkrTip, setShowOkrTip] = useState(false);
  
  // 计算当前权重总和
  const calculateTotalWeight = () => {
    return okrList.reduce((sum, item) => sum + item.weight, 0);
  };
  
  // 当前权重总和
  const totalWeight = calculateTotalWeight();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // 如果修改的是权重，检查是否会导致总和超过100%
    if (name === 'weight') {
      const newWeight = Number(value);
      let potentialTotal;
      
      if (editingId) {
        // 编辑模式 - 计算除当前项外的总和，再加上新权重
        const otherItemsWeight = okrList
          .filter(item => item.id !== editingId)
          .reduce((sum, item) => sum + item.weight, 0);
        
        potentialTotal = otherItemsWeight + newWeight;
      } else {
        // 新增模式
        potentialTotal = totalWeight + newWeight;
      }
      
      if (potentialTotal > 100) {
        setWeightError(`总权重将超过100%(${potentialTotal}%)，请调整`);
      } else {
        setWeightError(null);
      }
    }
    
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               name === 'weight' ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    // 计算剩余可用权重
    const remainingWeight = 100 - totalWeight;
    
    setForm({ 
      id: Date.now(), 
      weight: Math.max(0, remainingWeight), // 默认使用剩余权重，最小为0 
      objective: '', 
      keyResults: '', 
      keyActions: '', 
      isCross: false, 
      crossManagerId: '' 
    });
    
    setEditingId(null);
    setWeightError(null);
    setShowForm(true);
  };

  const handleEdit = (item: OKRItem) => {
    setForm(item);
    setEditingId(item.id);
    setWeightError(null);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("确定要删除此OKR项吗？")) {
    setOkrList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 如果存在权重错误，阻止提交
    if (weightError) {
      alert("请调整权重，确保总和不超过100%");
      return;
    }
    
    // 保存表单
    if (editingId) {
      setOkrList((prev) => prev.map((item) => (item.id === editingId ? form : item)));
    } else {
      setOkrList((prev) => [...prev, form]);
    }
    
    setShowForm(false);
    setEditingId(null);
    setWeightError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setWeightError(null);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <span>个人OKR</span>
          <span className={`ml-4 text-sm ${totalWeight === 100 ? 'text-green-600' : totalWeight > 100 ? 'text-red-600' : 'text-gray-600'}`}>
            当前权重总和: {totalWeight}%
          </span>
          {totalWeight > 100 && (
            <span className="ml-2 text-xs text-red-600 font-medium">
              (超出100%，请调整)
            </span>
          )}
        </div>
      </h3>
      
      {/* 权重警告 */}
      {totalWeight > 100 && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="font-medium">注意：OKR权重总和已超过100%</p>
          <p>为确保OKR评估准确，请调整各项权重使总和为100%</p>
            </div>
      )}
      
      {/* OKR表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">序号</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">权重</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                解决的挑战及目标描述<br />Objective
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                完成的标准及交付件<br />Key Results
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                关键举措<br />Key Actions
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                横向/兼岗<br />（是/否）
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                横向/兼岗<br />主管工号
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {okrList.map((item, index) => (
              <tr key={item.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setShowOkrTip(true)}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border">{index + 1}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border">
                  <span className={totalWeight > 100 ? 'text-red-600 font-medium' : ''}>
                    {item.weight}%
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 border">{item.objective}</td>
                <td className="px-3 py-2 text-sm text-gray-500 border whitespace-pre-line">{item.keyResults}</td>
                <td className="px-3 py-2 text-sm text-gray-500 border whitespace-pre-line">{item.keyActions}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border">{item.isCross ? '是' : '否'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border">{item.isCross ? item.crossManagerId : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OKR表单 */}
      {showForm && (
        <form className="mt-6 space-y-4 bg-gray-50 p-4 rounded" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm mb-1">
                权重（%）
                {editingId ? (
                  <span className="text-xs text-gray-500 ml-2">
                    当前总权重: {okrList.reduce((sum, item) => item.id === editingId ? sum : sum + item.weight, 0)}% + 此项权重
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 ml-2">剩余可分配: {Math.max(0, 100 - totalWeight)}%</span>
                )}
              </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
                min={1}
              max={100}
                className={`w-full border rounded px-2 py-1 ${weightError ? 'border-red-500' : ''}`}
              required
            />
              {weightError && (
                <p className="text-red-500 text-xs mt-1">{weightError}</p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isCross"
                checked={form.isCross}
                onChange={handleChange}
                className="mr-2"
                id="isCross"
              />
              <label htmlFor="isCross" className="text-sm">横向/兼岗</label>
              {form.isCross && (
                <div className="ml-4">
                  <label className="text-sm mr-1">主管工号:</label>
                  <input
                    type="text"
                    name="crossManagerId"
                    value={form.crossManagerId}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-32"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">解决的挑战及目标描述 (Objective)</label>
            <textarea
              name="objective"
              value={form.objective}
              onChange={handleChange}
              placeholder="示例：通过XX手段实现XX价值"
              className="w-full border rounded px-2 py-1"
              rows={2}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">完成的标准及交付件 (Key Results)</label>
            <textarea
              name="keyResults"
              value={form.keyResults}
              onChange={handleChange}
              placeholder="示例：1. XX时间完成XX动作实现XX结果&#10;2. XX指标达到XX水平"
              className="w-full border rounded px-2 py-1"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">关键举措 (Key Actions)</label>
            <textarea
              name="keyActions"
              value={form.keyActions}
              onChange={handleChange}
              placeholder="示例：1. XX措施&#10;2. XX行动"
              className="w-full border rounded px-2 py-1"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!!weightError}
            >
              保存
            </button>
            <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={handleCancel}>取消</button>
          </div>
        </form>
      )}
      {/* OKR点击提示弹窗 */}
      <Dialog open={showOkrTip} onOpenChange={setShowOkrTip}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>提示</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-gray-700 text-base">接口暂未开放</div>
          <div className="flex justify-end">
            <Button onClick={() => setShowOkrTip(false)}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * 信息项属性
 * @typedef {object} InfoItemProps
 * @property {React.ReactNode} icon - 图标
 * @property {string} label - 标签
 * @property {string} value - 值
 */
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

/**
 * 信息项组件
 * @param {InfoItemProps} props - 组件属性
 * @returns {React.ReactElement} 信息项组件
 */
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start mb-4 last:mb-0">
      <div className="text-gray-400 mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

/**
 * 个人信息内容组件
 * @returns {React.ReactElement} 个人信息内容
 */
export const PersonalInfoContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">基本信息</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              label="姓名"
              value="张远景"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              }
              label="邮箱"
              value="zhangyj@example.com"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              }
              label="电话"
              value="+86 13800138000"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">工作信息</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              }
              label="部门"
              value="机制建设部"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              }
              label="职位"
              value="部门负责人"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              }
              label="入职时间"
              value="2020年3月15日"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md md:col-span-2">
          <h3 className="text-lg font-medium mb-3">获奖情况</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              <li>2023年度最佳员工奖</li>
              <li>2022年技术创新奖</li>
              <li>2021年优秀团队奖</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 基础信息内容组件
 * @returns {React.ReactElement} 基础信息内容
 */
export const BasicInfoContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-8 mb-10">
        {/* 内部履历 */}
        <div>
          <h3 className="font-bold text-base mb-4">内部履历</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>2024.11/至今 机械结构事业部 质量运营部</span>
              <span>部门负责人-质量运营部</span>
            </div>
            <div className="flex justify-between">
              <span>2024.01/2024.10 机械结构开发部 机械结构开发部</span>
              <span>团队负责人-大机械LMT团队</span>
            </div>
            <div className="flex justify-between">
              <span>2022.09/2023.12 机械结构开发部 机械结构开发部</span>
              <span>专家-机械结构系统设计</span>
            </div>
            <div className="flex justify-between">
              <span>2019.11/2022.08 机械结构开发部 机械结构开发部</span>
              <span>PE-机舱</span>
            </div>
            <div className="flex justify-between">
              <span>2019.06/2019.10 产品工程体系 转子机舱产品部</span>
              <span>机舱总成SE</span>
            </div>
            <div className="flex justify-between">
              <span>2018.09/2019.05 产品工程体系 转子机舱产品部</span>
              <span>团队负责人-机舱结构</span>
            </div>
            <div className="flex justify-between">
              <span>2017.07/2018.08 产品工程体系 机舱与偏航产品部</span>
              <span>团队负责人-结构件产品</span>
            </div>
          </div>
        </div>
        {/* 外部履历 */}
        <div>
          <h3 className="font-bold text-base mb-4">外部履历</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>2010.10/2017.06 卡特彼勒技术研发有限公司 PDT</span>
              <span>高级工程师</span>
            </div>
            <div className="flex justify-between">
              <span>2010.01/2010.09 三一重工 上海研究院</span>
              <span>结构工程师</span>
            </div>
            <div className="flex justify-between">
              <span>2007.12/2009.12 通玛科 研发部</span>
              <span>研发工程师</span>
            </div>
          </div>
        </div>
      </div>
      {/* 兼岗独占一行，宽度与内部履历一致 */}
      <div className="mb-10" style={{ maxWidth: '50%' }}>
        <h3 className="font-bold text-base mb-4">兼岗</h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>2024.12/至今 机械结构事业部</span>
            <span>团队负责人-机械性能测试</span>
          </div>
        </div>
      </div>
      {/* 近三年考核和横向角色并排一行 */}
      <div className="flex gap-8 mb-10">
        <div className="flex-1">
          <h3 className="font-bold text-base mb-4">近三年考核</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>近三年挑战级别</span>
              <span>18M / 18H / 19L</span>
            </div>
            <div className="flex justify-between">
              <span>近三年绩效</span>
              <span>B+ / B+ / B</span>
            </div>
            <div className="flex justify-between">
              <span>近三年远景精神</span>
              <span>A / A / A</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-4">横向角色</h3>
          <div className="space-y-4 text-sm">
            <span>机舱TBB SE/CBB CE</span>
          </div>
        </div>
      </div>
      {/* 获奖情况 */}
      <div>
        <h3 className="font-bold text-base mb-4">获奖情况</h3>
        <div className="space-y-2 text-sm">
          <div>2023年度最佳员工奖</div>
          <div>2022年技术创新奖</div>
          <div>2021年优秀团队奖</div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 人岗匹配内容组件
 * @returns {React.ReactElement} 人岗匹配内容
 */
export const JobMatchingContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">匹配度分析</h3>
          <p className="text-gray-500 mb-4">员工与当前岗位的匹配情况分析</p>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-500 transition-all duration-1000"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                    clip: 'rect(0px, 160px, 160px, 80px)'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">85%</span>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-800">整体匹配度: 优秀</p>
              <p className="text-sm text-gray-600">员工能力与岗位要求高度匹配</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">技术能力</span>
                  <span className="text-sm font-medium text-green-600">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">工作经验</span>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">团队协作</span>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">领导能力</span>
                  <span className="text-sm font-medium text-yellow-600">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">发展建议</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">提升领导能力</h4>
                <p className="text-sm text-gray-600">
                  建议参加领导力培训课程，并在项目中担任更多领导角色，以提升整体领导能力。
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">持续技术学习</h4>
                <p className="text-sm text-gray-600">
                  建议继续深化技术专业知识，保持技术优势，可以考虑参与更复杂的技术项目。
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">晋升通道</h4>
                <p className="text-sm text-gray-600">
                  根据当前匹配情况，有潜力在1-2年内晋升为技术专家或初级管理岗位。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 个人OKR内容组件
 * @returns {React.ReactElement} 个人OKR内容
 */
export const PerformanceContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <OKRList />
              </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 评价内容组件
 * @returns {React.ReactElement} 评价内容
 */
interface ReviewItem {
  id: number;
  self: string;
  vision: string;
  process: string;
  performance: string;
  positiveEvent?: string;
  negativeEvent?: string;
}

export const ReviewContent: React.FC = () => {
  const [reviews, setReviews] = React.useState<ReviewItem[]>([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<ReviewItem>({
    id: 0,
    self: "",
    vision: "",
    process: "",
    performance: "",
  });

  const handleAdd = () => {
    setForm({ id: Date.now(), self: "", vision: "", process: "", performance: "" });
    setEditingId(null);
    setShowDialog(true);
  };
  const handleEdit = (item: ReviewItem) => {
    setForm(item);
    setEditingId(item.id);
    setShowDialog(true);
  };
  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setReviews((prev) => prev.map((item) => (item.id === editingId ? form : item)));
    } else {
      setReviews((prev) => [...prev, form]);
    }
    setShowDialog(false);
    setEditingId(null);
  };
  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
  };

  return (
    <Card className="p-6">
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
          <span>评价内容</span>
        </h3>
        <ul className="space-y-4">
          {reviews.length === 0 && <li className="text-gray-400">暂无评价</li>}
          {reviews.map((item) => (
            <li key={item.id} className="border rounded p-4 relative">
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">自我评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.self || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">远景精神评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.vision || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">流程角色评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.process || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">个人绩效评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.performance || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-green-700 font-medium mr-2">正项事件：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.positiveEvent || '带领团队完成核心项目交付，获得客户高度评价'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-red-700 font-medium mr-2">负项事件：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.negativeEvent || '跨部门沟通不畅，导致项目延期'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

/**
 * 岗位模型内容组件（带导航Tab）
 * @returns {React.ReactElement} 岗位模型内容
 */
export const JobModelContent: React.FC = () => {
  const [showExpectedPosition, setShowExpectedPosition] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(0); // 当前选择的职位卡片索引
  // 新增导出清单弹窗状态
  const [showExportDialog, setShowExportDialog] = useState(false);

  // 职位数据，包含匹配度
  const positions = [
    {
      id: 1,
      timeRange: "04 2025-至今",
      title: "部门负责人-机械性能测试中心",
      department: "机械结构事业部",
      unit: "机械性能测试中心 韩管明",
      manager: "机械性能测试中心 韩管明",
      matchRate: 92 // 岗位匹配度
    },
    {
      id: 2,
      timeRange: "04 2024-04 2025",
      title: "团队负责人-架构设计",
      department: "技术研发中心",
      unit: "架构设计部 李明",
      manager: "架构设计部 李明",
      matchRate: 85 // 岗位匹配度
    },
    {
      id: 3,
      timeRange: "01 2023-03 2024",
      title: "高级工程师-系统开发",
      department: "研发中心",
      unit: "系统开发部 张三",
      manager: "系统开发部 张三",
      matchRate: 78 // 岗位匹配度
    }
  ];
  
  // 切换下拉菜单显示状态
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // 切换到期望岗位
  const switchToExpectedPosition = () => {
    setShowExpectedPosition(true);
    setDropdownOpen(false);
  };
  
  // 切换到历史履历
  const switchToHistoryPosition = () => {
    setShowExpectedPosition(false);
    setDropdownOpen(false);
  };

  // 选择职位卡片
  const handleSelectPosition = (index: number) => {
    setSelectedPosition(index);
  };

  return (
    <Card className="p-6">
      {/* 履职贡献模块 - 独立放置在导航上方 */}
      <div className="mb-8">
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <h3 className="font-medium text-lg">岗位模型的{showExpectedPosition ? '期望岗位' : '履职贡献'}</h3>
            </div>
            <div className="flex items-center" style={{ gap: '15px' }}>
              {/* 下拉切换按钮 */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={toggleDropdown}
                >
                  {showExpectedPosition ? '期望岗位' : '历史履历'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md py-1 border border-gray-200 z-10">
                    {showExpectedPosition ? (
                      <div
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={switchToHistoryPosition}
                      >
                        历史履历
                      </div>
                    ) : (
                      <div
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={switchToExpectedPosition}
                      >
                        期望岗位
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* 导出清单按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportDialog(true)}
              >
                导出清单
              </Button>
            </div>
          </div>
          
          {showExpectedPosition ? (
            // 期望岗位内容
            <div className="border rounded-md p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-medium w-1/4">期望职位</td>
                    <td className="px-4 py-3">技术总监-机械结构系统设计</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-medium">期望部门</td>
                    <td className="px-4 py-3">产品研发中心</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-medium">期望地点</td>
                    <td className="px-4 py-3">上海</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium">职业规划</td>
                    <td className="px-4 py-3">希望在未来2-3年内，从技术专家向管理岗位发展，专注于机械结构系统设计领域</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            // 历史履历内容 - 三个职位卡片
            <div className="grid grid-cols-3 gap-6">
              {/* 动态生成职位卡片 */}
              {positions.map((position, index) => (
                <div 
                  key={position.id}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedPosition === index 
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-200' 
                      : 'hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectPosition(index)}
                >
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3 bg-gray-50 font-medium">时间</td>
                        <td className="px-4 py-3">{position.timeRange}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 bg-gray-50 font-medium">职位</td>
                        <td className="px-4 py-3">{position.title}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 bg-gray-50 font-medium">体系</td>
                        <td className="px-4 py-3">
                          {position.department}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 bg-gray-50 font-medium">部门</td>
                        <td className="px-4 py-3">{position.unit}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium">上级主管</td>
                        <td className="px-4 py-3">{position.manager}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 导航选项卡 - 不再包含履职贡献 */}
      <Tabs defaultValue="base" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200">
          <TabsList className="flex justify-start space-x-6 bg-transparent p-0">
          <TabsTrigger value="base" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none">基本信息</TabsTrigger>
          <TabsTrigger value="process" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none">流程属性</TabsTrigger>
          <TabsTrigger value="role" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none">角色认知&职责</TabsTrigger>
          <TabsTrigger value="ref" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none">参考</TabsTrigger>
        </TabsList>
          
          {/* 岗位匹配度显示 */}
          {!showExpectedPosition && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">岗位匹配度:</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${positions[selectedPosition].matchRate}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-green-600">{positions[selectedPosition].matchRate}%</span>
            </div>
          )}
        </div>
        
        <TabsContent value="base">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            {/* 岗位模型-基本信息，参考UI表格风格 */}
            {/**
             * 岗位模型-基本信息内容
             * @returns {React.ReactElement} 岗位模型-基本信息内容
             */}
            <table className="min-w-full text-sm border" style={{ tableLayout: 'fixed' }}>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium w-1/5">岗位名称</td>
                  <td className="px-4 py-2">测试中心负责人</td>
                  <td className="px-4 py-2 bg-gray-50 font-medium w-1/5"></td>
                  <td className="px-4 py-2"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">岗位编码</td>
                  <td className="px-4 py-2">/</td>
                  <td className="px-4 py-2 bg-gray-50 font-medium"></td>
                  <td className="px-4 py-2"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">岗位继任人</td>
                  <td className="px-4 py-2" colSpan={3}>体系负责人-叶片事业部/机械结构事业部</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">正念认知与讨论/核心输出</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.通过测试验证体系数据和结论的质量，提升组织的质量感知和质量关注度；<br/>
                    2.2025年推动测试中心体系性降本增效，提升测试验证的质量和效率，推动测试技术革新；<br/>
                    3.2025年推动测试中心体系性降本增效，资源整合、优先导入、效率提升。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">岗位设置性</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.机械性能实验室测试自动高效设备有提升，基于目前高质量实验的分析链，运营带动能量和促使质量效率快速改善；<br/>
                    2.测试中心具备高效的资源整合能力，推动测试验证体系性降本增效，并且能整合资源到测试成效的地方；<br/>
                    3.测试中心具备高效的资源整合能力，推动测试验证体系性降本增效，并且能整合资源到测试成效的地方；<br/>
                    4.在建、调整和优化测试体系，定期梳理流程和标准，推动建立科学严谨的评价标准；<br/>
                    5.测试中心具备高效的资源整合能力，推动测试验证体系性降本增效，效率提升。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">关键业务/业务挑战</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.测试验证的关键业务，进入PPAP网络安全，全部叶片测试台的建设与分炉扩展并开放大叶轮测试的关键瓶颈；<br/>
                    2.测试验证的结构特性实验的建模与分析，进行"新材料""新工艺"验证的效率，帮助前期解决研发问题，同时引导正确质量观；<br/>
                    3.通过EIREC 认证及机械性能实验室100+项无损，覆盖测试中心重要实验项目管理和流程建设，进一步帮助组织提升测试结论利用和数据管理的规范性和权威性，推动叶片及部件综合效能优化，提升产品竞争力。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">关键能力要求</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.测试方案设计和验证的技术理解力；<br/>
                    2.组织资源整合能力，尤其是复杂项目多并发的管理能力；<br/>
                    3.跨部门沟通与团队管理能力；
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">岗位软硬性经验</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.大型实验室/性能中心0~1建设经验；<br/>
                    2.材料/结构/实验室 产品相关经验；<br/>
                    3.5年以上行业管理/团队管理经验。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">运营特殊要求</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.测试验证的核心岗位/团队独立担当能力；<br/>
                    2.具备实验室/测试中心/认证机构相关经验；<br/>
                    3.具备大型实验室/性能中心管理经验；<br/>
                    4.高意愿度，用户一切动作追求结果；<br/>
                    5.善于在技术和管理的实践里完善流程及规范。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">顶尖人才来源</td>
                  <td className="px-4 py-2" colSpan={3}>
                    第一优先级：CGC、DNV（具备EIREC资质的测试运营管理）<br/>
                    第二优先级：SGS、CQC<br/>
                    第三优先级：中认尚高、中科通测
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">人才吸引策略</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.全盘管理叶片测试、机械性能实验室、复合材料实验室全场的各项运营，40人+的执行团队，有机地整合实验设计和测试的前沿技术和资源；<br/>
                    2.与测试行业协会联合办会，又相对独立运作，保有研发创新反馈的独特权力。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">未来岗位发展方向</td>
                  <td className="px-4 py-2" colSpan={3}>该岗位未来可发展为资深管理者、培养方向等</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">岗位-组织架构</td>
                  <td className="px-4 py-2" colSpan={3}>汇报对象：助理体系负责人 团队构成：3人测试中心人员（机械性能实验室&工房/化测测试台&复合材料实验室） 相关接口：EIREC & LMT负责人&PMO，测试技术开发团队&标准，推进者&需求&风控分析相关测试项目的高效运行；相关接口：体系&工艺，能力提升&设计前期的测试验证。</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 bg-gray-50 font-medium">岗位JD</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.测试资源与质量管理，负责叶片测试台、机械性能测试中心、复合材料实验室等测试资源的全流程管理；<br/>
                    2.测试方案设计与验证，推动测试技术创新，提升测试效率和结论的权威性；<br/>
                    3.测试数据分析与报告，输出高质量测试结论，推动测试结论在产品开发、质量改进等环节的落地；<br/>
                    4.团队管理与人才培养，建设高效团队，推动团队成员能力提升；<br/>
                    5.跨部门协作，推动测试结论在产品开发、质量改进等环节的落地，强化组织协同能力；<br/>
                    6.实验室管理与认证，推动实验室资质认证和管理体系建设，完善人员资质及技术评估。
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 bg-gray-50 font-medium">任职要求</td>
                  <td className="px-4 py-2" colSpan={3}>
                    1.硕士及以上学历，材料/结构/管理专业，5年以上经验，风电行业优先；<br/>
                    2.具备大型实验室/性能中心管理经验，熟悉测试流程和标准，具备较强的组织协调能力；<br/>
                    3.具备较强的沟通能力和团队管理能力，具备较强的抗压能力和责任感；<br/>
                    4.具备较强的学习能力和创新能力，具备较强的逻辑思维能力；<br/>
                    5.年龄44岁以下。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="process">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            {/* 流程属性表格，参考UI */}
            <table className="min-w-full text-sm border" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="px-2 py-2 bg-gray-50 font-medium">L1一级流程名称</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">L2二级流程名称</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">L3三级流程名称</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">本岗位在流程中的关键活动</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">岗位在流程中承担的角色</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">关联的其他角色/岗（如流程前后道、流程GPO/BPO/MPO等）</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">角色所在的流程节点是否关键控制点</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">负责的交付物/交付件（有文件交付/交付件一行）</th>
                </tr>
              </thead>
              <tbody>
                {/* 静态示例数据，实际可后续对接接口 */}
                {Array.from({ length: 10 }).map((_, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-2 py-2">EDV</td>
                    <td className="px-2 py-2">1.1及时机制系列开发</td>
                    <td className="px-2 py-2">1.1技术路线规划与更新业务流程</td>
                    <td className="px-2 py-2">测试</td>
                    <td className="px-2 py-2">测试验证ISE</td>
                    <td className="px-2 py-2">测试验证ISE</td>
                    <td className="px-2 py-2">否</td>
                    <td className="px-2 py-2">支持IC专项：TBB/CBBA技术路线规划更新输出（通过流程分阶段对比，规划/更新/验证等多环节通过测试对比，测前/测后即作出模块BCD推进）</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="role">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 overflow-x-auto">
            {/* 角色认知&职责表格，参考UI，支持横向滚动 */}
            <table className="min-w-[1600px] text-sm border" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="px-2 py-2 bg-gray-50 font-medium">角色认知（一句话认知）</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">业务场景</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">关键流程描述</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">业务价值创造/关键KPI</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">对应规则</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">涉及的流程名称（L1-L2-L3-L4）</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">对应的流程角色</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">关联的其他角色/岗（如流程前后道、流程GPO/BPO/MPO等）</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">工具/模板/数据表名称</th>
                  <th className="px-2 py-2 bg-gray-50 font-medium">专业任职资格能力</th>
                </tr>
              </thead>
              <tbody>
                {/* 静态示例数据，实际可后续对接接口 */}
                {Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-2 py-2">安全运营第一责任人</td>
                    <td className="px-2 py-2">测试执行</td>
                    <td className="px-2 py-2">1. 通过各岗位风险识别（LECD）<br/>2. 制定和落实安全管理要求；<br/>3. EHS 相关整改计划；<br/>4. EHS  违规安全评估；</td>
                    <td className="px-2 py-2">医疗以上事故数0；<br/>急病与异常分级列≤1；<br/>未遂事件≤2；</td>
                    <td className="px-2 py-2">EHS一级规则</td>
                    <td className="px-2 py-2">作业安全风险识别与易规管理流程<br/>EHS能力要求和流程管控要求<br/>EHS  违规整改闭环和行动追踪流程<br/>外委人员入厂/场作业EHS管理流程</td>
                    <td className="px-2 py-2">组织负责人</td>
                    <td className="px-2 py-2">测试</td>
                    <td className="px-2 py-2">作业安全风险识别评价表模板、<br/>作业安全专项检查内容及数据跟踪表；<br/>EHS  违规整改计划；<br/>不符合项因分析和行动制定追踪模板</td>
                    <td className="px-2 py-2">L3/L4</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="ref">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            {/* 关键能力对比 */}
            <h3 className="text-lg font-bold mb-2">关键能力对比</h3>
            <table className="min-w-full text-sm border mb-8">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 font-medium text-left" style={{width: '40%'}}>维度</th>
                  <th className="px-4 py-2 bg-gray-50 font-medium text-left">岗位要求</th>
                  <th className="px-4 py-2 bg-gray-50 font-medium text-left">达成级别</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="border-b align-top">
                    <td className="px-4 py-2" style={{width: '40%'}}>
                      <span className="font-bold block mb-1">组织协调</span>
                      <span className="block text-gray-700 leading-relaxed">根据工作目标的需要，合理配置相关资源，协调各方面关系、调动各方面的积极性，并及时处理和解决目标实现过程中各种问题的能力</span>
                    </td>
                    <td className="px-4 py-2">4</td>
                    <td className="px-4 py-2">3</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* 远景精神对比 */}
            <h3 className="text-lg font-bold mb-2">远景精神对比</h3>
            <table className="min-w-full text-sm border">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 font-medium text-left" style={{width: '40%'}}>维度</th>
                  <th className="px-4 py-2 bg-gray-50 font-medium text-left">岗位要求</th>
                  <th className="px-4 py-2 bg-gray-50 font-medium text-left">达成级别</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b align-top">
                    <td className="px-4 py-2" style={{width: '40%'}}>
                      <span className="font-bold block mb-1">正心正念</span>
                      <span className="block text-gray-700 leading-relaxed">时刻以远景价值观要求提升自己</span>
                    </td>
                    <td className="px-4 py-2">4</td>
                    <td className="px-4 py-2">3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
      {/* 导出清单弹窗 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>导出清单</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-gray-700 text-base">导出功能暂未实现</div>
          <div className="flex justify-end">
            <Button onClick={() => setShowExportDialog(false)}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

/**
 * 发展规划内容组件
 * @returns {React.ReactElement} 发展规划内容
 */
export const DevelopmentPlanContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ta对公司价值观和文化的理解 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">Ta对公司价值观和文化的理解</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-2 text-sm text-gray-700">
              <p>员工对公司核心价值观"客户导向"的认同度高，能够将价值观融入到日常工作中。</p>
              <p>对公司"以奋斗者为本"的文化理解深刻，主动承担责任，勇于面对挑战。</p>
              <p>在团队中积极传递公司文化，对新员工有良好的示范作用。</p>
            </div>
          </div>
        </div>

        {/* 个人发展意愿 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">个人发展意愿</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-2 text-sm text-gray-700">
              <p>期望在未来2-3年内，从技术专家向管理岗位发展。</p>
              <p>希望能获得更多跨部门项目的实践机会，增强领导力和项目管理能力。</p>
              <p>计划完成MBA学习，提升综合管理素质。</p>
            </div>
          </div>
        </div>

        {/* Ta是哪些岗位的后备梯队 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">Ta是哪些岗位的后备梯队</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between items-center mb-1 pb-1 border-b">
                <span className="font-medium">岗位</span>
                <span className="font-medium">匹配度</span>
              </div>
              <div className="flex justify-between items-center">
                <span>技术团队负责人</span>
                <span className="text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>产品部门经理</span>
                <span className="text-green-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>技术架构师</span>
                <span className="text-yellow-600">70%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 可接替Ta的后备梯队 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">可接替Ta的后备梯队</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between items-center mb-1 pb-1 border-b">
                <span className="font-medium">姓名</span>
                <span className="font-medium">当前岗位</span>
                <span className="font-medium">匹配度</span>
              </div>
              <div className="flex justify-between items-center">
                <span>李明</span>
                <span>高级工程师</span>
                <span className="text-green-600">82%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>王华</span>
                <span>项目主管</span>
                <span className="text-green-600">76%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>张强</span>
                <span>资深工程师</span>
                <span className="text-yellow-600">65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 具体发展计划(IDP) */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">具体发展计划(IDP)</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">短期目标（6个月内）</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>完成高级项目管理培训</li>
                  <li>带领团队完成核心项目交付</li>
                  <li>参与跨部门协作项目</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">中期目标（1年内）</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>培养3名团队骨干</li>
                  <li>推动部门流程优化</li>
                  <li>完成MBA课程第一阶段学习</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">长期目标（2-3年）</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>晋升为技术团队负责人</li>
                  <li>负责部门战略规划</li>
                  <li>完成MBA学位</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 团队盘点内容组件
 * @returns {React.ReactElement} 团队盘点内容
 */
export const TeamAssessmentContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* 团队盘点九宫格 - 独占一行 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">团队盘点九宫格</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="h-[420px] p-4">
              <svg width="100%" height="100%" viewBox="0 0 700 400">
                {/* 背景 */}
                <rect x="60" y="20" width="600" height="340" fill="white" stroke="#E5E7EB" strokeWidth="1" />

                {/* 九宫格线条 */}
                <line x1="60" y1="127" x2="660" y2="127" stroke="#E5E7EB" strokeWidth="1" />
                <line x1="60" y1="233" x2="660" y2="233" stroke="#E5E7EB" strokeWidth="1" />
                <line x1="260" y1="20" x2="260" y2="360" stroke="#E5E7EB" strokeWidth="1" />
                <line x1="460" y1="20" x2="460" y2="360" stroke="#E5E7EB" strokeWidth="1" />

                {/* 九宫格标题 */}
                <g className="text-sm font-medium">
                  {/* 第一行 */}
                  <rect x="60" y="20" width="200" height="107" fill="#4CAF50" fillOpacity="0.8" />
                  <text x="160" y="73" textAnchor="middle" fill="white" fontSize="14">Workers</text>
                  <text x="160" y="93" textAnchor="middle" fill="white" fontSize="12">工蜂</text>

                  <rect x="260" y="20" width="200" height="107" fill="#4CAF50" fillOpacity="0.9" />
                  <text x="360" y="73" textAnchor="middle" fill="white" fontSize="14">Contributors</text>
                  <text x="360" y="93" textAnchor="middle" fill="white" fontSize="12">贡献者</text>

                  <rect x="460" y="20" width="200" height="107" fill="#8BC34A" />
                  <text x="560" y="73" textAnchor="middle" fill="white" fontSize="14">Stars</text>
                  <text x="560" y="93" textAnchor="middle" fill="white" fontSize="12">明星</text>

                  {/* 第二行 */}
                  <rect x="60" y="127" width="200" height="106" fill="#9E9E9E" />
                  <text x="160" y="180" textAnchor="middle" fill="white" fontSize="14">Blockers</text>
                  <text x="160" y="200" textAnchor="middle" fill="white" fontSize="12">阻碍者</text>

                  <rect x="260" y="127" width="200" height="106" fill="#4CAF50" />
                  <text x="360" y="180" textAnchor="middle" fill="white" fontSize="14">Transitionals</text>
                  <text x="360" y="200" textAnchor="middle" fill="white" fontSize="12">过渡者</text>

                  <rect x="460" y="127" width="200" height="106" fill="#4CAF50" />
                  <text x="560" y="180" textAnchor="middle" fill="white" fontSize="14">Emergers</text>
                  <text x="560" y="200" textAnchor="middle" fill="white" fontSize="12">才华初露者</text>

                  {/* 第三行 */}
                  <rect x="60" y="233" width="200" height="127" fill="#9E9E9E" />
                  <text x="160" y="297" textAnchor="middle" fill="white" fontSize="14">Detractors</text>
                  <text x="160" y="317" textAnchor="middle" fill="white" fontSize="12">拖木</text>

                  <rect x="260" y="233" width="200" height="127" fill="#9E9E9E" />
                  <text x="360" y="297" textAnchor="middle" fill="white" fontSize="14">Placeholders</text>
                  <text x="360" y="317" textAnchor="middle" fill="white" fontSize="12">占位者</text>

                  <rect x="460" y="233" width="200" height="127" fill="#4CAF50" />
                  <text x="560" y="297" textAnchor="middle" fill="white" fontSize="14">Latents</text>
                  <text x="560" y="317" textAnchor="middle" fill="white" fontSize="12">潜力者</text>
                </g>

                {/* 坐标轴标签 */}
                <text x="680" y="190" fontSize="12" fill="#64748B" transform="rotate(90, 680, 190)">Performance 绩效</text>
                <text x="360" y="390" fontSize="12" fill="#64748B" textAnchor="middle">Potential 潜质</text>

                {/* 坐标轴刻度 */}
                <text x="40" y="73" textAnchor="end" fill="#64748B" fontSize="12">Exceeded优</text>
                <text x="40" y="180" textAnchor="end" fill="#64748B" fontSize="12">Met中</text>
                <text x="40" y="297" textAnchor="end" fill="#64748B" fontSize="12">Below低</text>

                <text x="160" y="380" textAnchor="middle" fill="#64748B" fontSize="12">low低</text>
                <text x="360" y="380" textAnchor="middle" fill="#64748B" fontSize="12">Medium中</text>
                <text x="560" y="380" textAnchor="middle" fill="#64748B" fontSize="12">High高</text>

                {/* 团队成员标记（示例数据） */}
                <circle cx="120" cy="80" r="10" fill="#3B82F6" />
                <text x="120" y="80" textAnchor="middle" fill="white" fontSize="10">张三</text>

                <circle cx="320" cy="60" r="10" fill="#3B82F6" />
                <text x="320" y="60" textAnchor="middle" fill="white" fontSize="10">李四</text>

                <circle cx="520" cy="70" r="10" fill="#3B82F6" />
                <text x="520" y="70" textAnchor="middle" fill="white" fontSize="10">王五</text>

                <circle cx="280" cy="150" r="10" fill="#3B82F6" />
                <text x="280" y="150" textAnchor="middle" fill="white" fontSize="10">赵六</text>

                <circle cx="500" cy="170" r="10" fill="#3B82F6" />
                <text x="500" y="170" textAnchor="middle" fill="white" fontSize="10">孙七</text>

                <circle cx="550" cy="280" r="10" fill="#3B82F6" />
                <text x="550" y="280" textAnchor="middle" fill="white" fontSize="10">周八</text>
              </svg>
            </div>
            <div className="bg-gray-50 p-2 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">团队九宫格分析概要</h4>
              <p className="text-sm text-gray-700">
                根据最新绩效和潜力评估，团队中有3名明星员工（15%），5名贡献者（25%），4名过渡者（20%），
                3名才华初露者（15%），2名潜力者（10%），其余3人（15%）需要关注和提升。
                建议重点培养才华初露者和潜力者，关注并改善阻碍者和拖木的表现。
              </p>
            </div>
          </div>
        </div>

        {/* 人才梯队 - 独占一行 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">人才梯队</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">梯队层级</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">团队成员</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">当前职位</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">后备职位</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">就绪度</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关键发展点</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={3}>高管梯队<br/>(N-1)</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">张远景</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">营销总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">营销副总裁</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">1-2年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">全球市场战略规划</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">李明远</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">技术总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">技术副总裁</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">2-3年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">领导力、战略思维</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">王芳</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">人力资源总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">人力资源副总裁</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">1年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">国际人才管理经验</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={4}>中层梯队<br/>(N-2)</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">赵强</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">研发经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">研发总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">1年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">跨部门协作能力</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">孙梅</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">市场经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">市场总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">2年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">市场策略和团队管理</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">周杰</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">财务经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">财务总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">3年以上就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">战略财务规划</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">吴莉</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">产品经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">产品总监</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">1-2年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">产品战略规划、团队领导力</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={3}>基层梯队<br/>(N-3)</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">陈明</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">高级工程师</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">研发经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">1年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">管理技能、领导力培养</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">林楠</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">高级设计师</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">设计经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">2年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">团队协作与管理</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">郑华</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">高级销售</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">销售经理</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">1年内就绪</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">团队激励与战略销售</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-2">梯队分析摘要</h4>
              <p className="text-sm text-gray-700 mb-2">
                团队人才梯队建设总体良好，各层级均有接班人选。高管梯队3人，中层梯队4人，基层梯队3人。
                总计10名后备人才中，4人预计1年内就绪，3人预计1-2年内就绪，2人预计2-3年内就绪，1人需要长期培养。
              </p>
              <p className="text-sm text-gray-700">
                建议重点关注：加强中层梯队培养，特别是财务和市场方向；为高潜人才提供更多跨部门项目经验；
                建立系统化的导师计划支持基层向中层的过渡。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
/**
 * Talent摘要简报内容组件
 * @returns {React.ReactElement} Talent摘要简报内容
 */
export const TalentSummaryContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* 主要信息概览 - 2行3列布局 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 所处人才库 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">所处人才库</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">关键岗位人才库</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium">高潜人才库</span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>入库时间: 2023-06-15</p>
                <p>最近评估: 2024-01-10</p>
              </div>
            </div>
          </div>

          {/* Retention */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Retention</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">风险指数</span>
                <span className="text-sm font-medium text-yellow-600">中等风险</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="grid grid-cols-3 text-xs text-center">
                <div>低风险<br/>0-40%</div>
                <div className="font-bold">中风险<br/>41-70%</div>
                <div>高风险<br/>71-100%</div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>上次变动: 2023-12-05 (↑10%)</p>
              </div>
            </div>
          </div>

          {/* 流失风险 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">流失风险</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">风险指数</span>
                <span className="text-sm font-medium text-green-600">低风险</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="grid grid-cols-3 text-xs text-center">
                <div className="font-bold">低风险<br/>0-30%</div>
                <div>中风险<br/>31-70%</div>
                <div>高风险<br/>71-100%</div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>主要原因: 薪资满意度高、团队氛围良好</p>
              </div>
            </div>
          </div>

          {/* 个人九宫格 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">个人九宫格</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="grid grid-cols-3 grid-rows-3 gap-1 h-48 mb-2">
                {/* 九宫格，用不同颜色标识不同区域 */}
                <div className="bg-green-100 border border-gray-200 flex items-center justify-center text-xs">工蜂</div>
                <div className="bg-green-200 border border-gray-200 flex items-center justify-center text-xs">贡献者</div>
                <div className="bg-green-300 border border-gray-200 flex items-center justify-center text-xs relative">
                  明星
                  {/* 当前位置标记 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs">当前</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-200 border border-gray-200 flex items-center justify-center text-xs">阻碍者</div>
                <div className="bg-green-100 border border-gray-200 flex items-center justify-center text-xs">过渡者</div>
                <div className="bg-green-200 border border-gray-200 flex items-center justify-center text-xs">才华初露者</div>
                <div className="bg-gray-200 border border-gray-200 flex items-center justify-center text-xs">拖木</div>
                <div className="bg-gray-200 border border-gray-200 flex items-center justify-center text-xs">占位者</div>
                <div className="bg-green-100 border border-gray-200 flex items-center justify-center text-xs">潜力者</div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">当前位置: 明星</p>
                <p>上次评估: 2023-12-10</p>
              </div>
            </div>
          </div>

          {/* 继任者结果 */}
          <div className="bg-gray-50 p-4 rounded-md h-full">
            <h3 className="text-lg font-medium mb-3">继任者结果</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 h-[calc(100%-3rem)]">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">当前是以下岗位的继任者:</p>
                  <div className="mt-2 ml-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">技术总监 (李明)</span>
                      <span className="text-sm text-green-600 font-medium">达标</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">部门经理 (王芳)</span>
                      <span className="text-sm text-yellow-600 font-medium">待提升</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 pt-2 border-t">
                  <p>预计就绪时间: 2025年Q2</p>
                  <p>继任评估得分: 85/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* 师徒制 */}
          <div className="bg-gray-50 p-4 rounded-md h-full">
            <h3 className="text-lg font-medium mb-3">师徒制</h3>
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 h-[calc(100%-3rem)]">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">作为导师</h4>
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-sm">学员人数: 3人</p>
                    <div className="mt-1 ml-2 text-xs text-gray-600">
                      <p>张小明 (P5-研发工程师)</p>
                      <p>李梅 (P4-测试工程师)</p>
                      <p>王刚 (P4-产品经理)</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">作为学员</h4>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-sm">导师: 赵总监 (P8-技术总监)</p>
                    <p className="text-sm">辅导重点: 领导力、项目管理</p>
                    <p className="text-sm">开始时间: 2023-08-15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};