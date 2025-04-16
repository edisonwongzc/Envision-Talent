'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/**
 * 人才盘点页面组件
 * @return {React.ReactElement} 人才盘点页面
 */
export default function TalentAssessmentPage() {
  const [scale, setScale] = useState(0.8);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [showSuccessionDialog, setShowSuccessionDialog] = useState(false);
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const moveLeft = () => {
    setPosition(prev => ({ ...prev, x: prev.x + 50 }));
  };
  
  const moveRight = () => {
    setPosition(prev => ({ ...prev, x: prev.x - 50 }));
  };
  
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const renderSingleDimensionChart = () => {
    return (
      <div className="h-[420px] p-4">
        <svg width="100%" height="100%" viewBox="0 0 700 450">
          {/* 柱状图 */}
          <g transform="translate(60, 20)">
            {/* X轴 */}
            <line x1="0" y1="340" x2="600" y2="340" stroke="#94A3B8" strokeWidth="1" />
            <text x="300" y="420" textAnchor="middle" fill="#64748B" fontSize="12">人才等级</text>
            
            {/* Y轴 */}
            <line x1="0" y1="0" x2="0" y2="340" stroke="#94A3B8" strokeWidth="1" />
            <text x="-40" y="170" textAnchor="middle" fill="#64748B" fontSize="12" transform="rotate(-90, -40, 170)">人数</text>
            
            {/* 柱状图数据 - 从左往右排序 */}
            <g>
              <rect x="50" y="220" width="60" height="120" fill="#5ab049" />
              <text x="80" y="90" textAnchor="middle" fill="#64748B" fontSize="12">潜力者</text>
              <text x="80" y="370" textAnchor="middle" fill="#64748B" fontSize="12">8人</text>
              
              <rect x="200" y="180" width="60" height="160" fill="#dcd152" />
              <text x="230" y="90" textAnchor="middle" fill="#64748B" fontSize="12">工蜂</text>
              <text x="230" y="370" textAnchor="middle" fill="#64748B" fontSize="12">10人</text>
              
              <rect x="350" y="140" width="60" height="200" fill="#6930ee" />
              <text x="380" y="90" textAnchor="middle" fill="#64748B" fontSize="12">过渡者</text>
              <text x="380" y="370" textAnchor="middle" fill="#64748B" fontSize="12">12人</text>
              
              <rect x="500" y="100" width="60" height="240" fill="#ec693d" />
              <text x="530" y="90" textAnchor="middle" fill="#64748B" fontSize="12">明星</text>
              <text x="530" y="370" textAnchor="middle" fill="#64748B" fontSize="12">15人</text>
            </g>
          </g>
        </svg>
      </div>
    );
  };

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
        </svg>
      </div>
    );
  };

  const renderSuccessionTree = () => {
    return (
      <div className="w-full h-[500px] relative bg-gray-50 p-8">
        {/* 连接线 */}
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* 上下连接线 */}
          <path
            d="M350,140 L350,220"
            stroke="#94A3B8"
            strokeWidth="2"
            fill="none"
          />
          {/* 左右分支线 */}
          <path
            d="M350,220 C350,220 200,220 200,300"
            stroke="#94A3B8"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M350,220 C350,220 500,220 500,300"
            stroke="#94A3B8"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* 项目经理卡片 */}
        <div className="absolute left-1/2 top-[80px] -translate-x-1/2 w-[280px] bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60" 
                alt="Tea Sidiq"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-base font-medium">Tea Sidiq</div>
              <div className="text-sm text-gray-500">Project Manager</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* UI/UX Designer 卡片 - 左 */}
        <div className="absolute left-[160px] top-[280px] w-[280px] bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" 
                alt="Wildan"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-base font-medium">Wildan</div>
              <div className="text-sm text-gray-500">UI/UX Designer</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* UI/UX Designer 卡片 - 右 */}
        <div className="absolute right-[160px] top-[280px] w-[280px] bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" 
                alt="Adit"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-base font-medium">Adit</div>
              <div className="text-sm text-gray-500">UI/UX Designer</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-full pt-1 px-6 pb-4 space-y-2 bg-[#f4f7fa]">
        <div className="mb-1">
          <h1 className="text-[18px] font-bold text-gray-800">人才盘点</h1>
          <p className="text-sm text-gray-500">进行AT会议和人才评估</p>
        </div>

        <Tabs defaultValue="matrix" className="w-full mt-8">
          <TabsList className="w-full flex justify-start space-x-6 border-b border-gray-200 bg-transparent p-0">
            <TabsTrigger 
              value="matrix" 
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
            >
              九宫格
            </TabsTrigger>
            <TabsTrigger 
              value="meeting" 
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
            >
              AT会议
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
            >
              多人对比分析
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="matrix" className="space-y-4 mt-6">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">人才九宫格</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    className={`px-3 py-1 h-8 rounded-md text-xs hover:bg-[inherit] ${
                      selectedTags.includes('个人绩效') 
                        ? 'bg-[#3C5E5C] text-white hover:bg-[#3C5E5C]' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-white'
                    }`}
                    onClick={() => handleTagClick('个人绩效')}
                  >
                    个人绩效
                  </Button>
                  <Button 
                    className={`px-3 py-1 h-8 rounded-md text-xs hover:bg-[inherit] ${
                      selectedTags.includes('远景精神') 
                        ? 'bg-[#3C5E5C] text-white hover:bg-[#3C5E5C]' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-white'
                    }`}
                    onClick={() => handleTagClick('远景精神')}
                  >
                    远景精神
                  </Button>
                  <Button 
                    className={`px-3 py-1 h-8 rounded-md text-xs hover:bg-[inherit] ${
                      selectedTags.includes('流程绩效') 
                        ? 'bg-[#3C5E5C] text-white hover:bg-[#3C5E5C]' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-white'
                    }`}
                    onClick={() => handleTagClick('流程绩效')}
                  >
                    流程绩效
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {selectedTags.length === 1 ? renderSingleDimensionChart() : selectedTags.length > 1 ? renderNineGridChart() : null}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="meeting" className="space-y-4 mt-6">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">AT会议</CardTitle>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                  <PlusIcon size={14} className="mr-1" />
                  创建会议
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="rounded-md border border-gray-200 p-4">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium mb-1 text-gray-800">2023年Q4研发部AT会议</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>2023-12-10</span>
                          <span>10:00 - 12:00</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">已完成</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看记录</Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">导出报告</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="text-xs text-gray-500">参会人：</div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 border border-white">张</div>
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-700 border border-white">李</div>
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-700 border border-white">王</div>
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-700 border border-white">+2</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border border-gray-200 p-4">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium mb-1 text-gray-800">2023年Q4产品部AT会议</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>2023-12-12</span>
                          <span>14:00 - 16:00</span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">未开始</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">编辑</Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">取消</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="text-xs text-gray-500">参会人：</div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs text-orange-700 border border-white">赵</div>
                        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs text-yellow-700 border border-white">钱</div>
                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs text-teal-700 border border-white">孙</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4 mt-6">
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">多人对比分析</CardTitle>
                <div className="flex space-x-2">
                  <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                    导出报告
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white">
                <div className="mb-6 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex flex-wrap gap-2 items-center">
                      <div className="text-xs text-gray-500 mr-1">已选员工：</div>
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        张三
                        <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        李四
                        <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        王五
                        <svg className="w-3 h-3 ml-1 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button className="flex-shrink-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1 h-8 rounded-md">
                          筛选
                        </Button>
                      <Button className="flex-shrink-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1 h-8 rounded-md">
                        <PlusIcon size={14} className="mr-1" />
                        添加员工
                      </Button>
                        <Button className="flex-shrink-0 bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                        进行对比
                      </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 表格式人才对比视图 */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            头像
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            员工
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            当前职位
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            所在部门
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            工作年限
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            绩效评分
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">张三</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">高级开发工程师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">研发部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">5年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">A</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button 
                              variant="ghost" 
                              className="text-xs h-7 text-[#3C5E5C]"
                              onClick={() => setShowSuccessionDialog(true)}
                            >
                              查看详情
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">李四</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">产品经理</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">产品部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">3年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800 font-medium flex items-center">
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">B</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button 
                              variant="ghost" 
                              className="text-xs h-7 text-[#3C5E5C]"
                              onClick={() => setShowSuccessionDialog(true)}
                            >
                              查看详情
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-md mx-auto">
                              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" alt="员工头像" className="h-10 w-10 object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">王五</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">UI设计师</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">设计部</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800">4年</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-gray-800 font-medium flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">A</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-left">
                            <Button 
                              variant="ghost" 
                              className="text-xs h-7 text-[#3C5E5C]"
                              onClick={() => setShowSuccessionDialog(true)}
                            >
                              查看详情
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2" style={{color: '#3C5E5C'}}>对比维度</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-1 text-gray-800">绩效评分</h4>
                      <div className="h-48 flex items-center justify-center">
                        <p className="text-sm text-gray-500">绩效对比图表</p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-1 text-gray-800">能力评估</h4>
                      <div className="h-48 flex items-center justify-center">
                        <p className="text-sm text-gray-500">能力雷达图</p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-1 text-gray-800">发展潜力</h4>
                      <div className="h-48 flex items-center justify-center">
                        <p className="text-sm text-gray-500">潜力趋势图</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showSuccessionDialog} onOpenChange={setShowSuccessionDialog}>
        <DialogContent className="max-w-4xl p-0">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">继任者沿袭图</h2>
          </div>
          <div className="p-6">
            <div className="relative" style={{ height: '500px' }}>
              {/* 连接线 */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <path
                  d="M350,140 L350,220 M350,220 C350,220 200,220 200,300 M350,220 C350,220 500,220 500,300"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              
              {/* 项目经理卡片 */}
              <div className="absolute left-1/2 top-[80px] -translate-x-1/2 w-[280px] bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60" 
                      alt="Tea Sidiq"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-medium">Tea Sidiq</div>
                    <div className="text-sm text-gray-500">Project Manager</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* UI/UX Designer 卡片 - 左 */}
              <div className="absolute left-[160px] top-[280px] w-[280px] bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" 
                      alt="Wildan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-medium">Wildan</div>
                    <div className="text-sm text-gray-500">UI/UX Designer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* UI/UX Designer 卡片 - 右 */}
              <div className="absolute right-[160px] top-[280px] w-[280px] bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" 
                      alt="Adit"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-medium">Adit</div>
                    <div className="text-sm text-gray-500">UI/UX Designer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 