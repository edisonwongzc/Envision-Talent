'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/icons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * 人才识别页面组件
 * @return {React.ReactElement} 人才识别页面
 */
export default function TalentIdentificationPage() {
  const [showSuccessionDialog, setShowSuccessionDialog] = useState(false);

  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-2 bg-[#f4f7fa]">
      <div className="mb-1">
        <h1 className="text-[18px] font-bold text-gray-800">人才识别</h1>
        <p className="text-sm text-gray-500">识别和管理关键人才和后备人才</p>
      </div>

      <Tabs defaultValue="succession" className="w-full mt-8">
        <TabsList className="w-full flex justify-start space-x-6 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger 
            value="succession" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            继任者计划
          </TabsTrigger>
          <TabsTrigger 
            value="nomination" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            继任者提名
          </TabsTrigger>
          <TabsTrigger 
            value="pool" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            后备人才库
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="succession" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">继任者计划管理</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                  <input 
                    type="text"
                    placeholder="搜索岗位..."
                    className="pl-8 h-8 text-xs rounded-md border border-gray-300 bg-white focus:border-[#3C5E5C] focus:ring-1 focus:ring-[#3C5E5C]"
                  />
                </div>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                  添加计划
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border border-gray-200">
                <div className="bg-gray-50 p-4 grid grid-cols-6 gap-2 text-xs font-medium text-gray-700">
                  <div>岗位名称</div>
                  <div>部门</div>
                  <div>在任者</div>
                  <div>继任者数量</div>
                  <div>继任就绪度</div>
                  <div>继任者状态</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  <div className="p-4 grid grid-cols-6 gap-2 text-xs hover:bg-gray-50">
                    <div className="text-gray-800">技术总监</div>
                    <div className="text-gray-600">研发部</div>
                    <div className="text-gray-800">张三</div>
                    <div className="text-gray-600">2</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[80%]"></div>
                      </div>
                      <span className="text-gray-700 text-xs">80%</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">可在1年内继任</span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-6 gap-2 text-xs hover:bg-gray-50">
                    <div className="text-gray-800">产品总监</div>
                    <div className="text-gray-600">产品部</div>
                    <div className="text-gray-800">李四</div>
                    <div className="text-gray-600">1</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-[50%]"></div>
                      </div>
                      <span className="text-gray-700 text-xs">50%</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">可在2年内继任</span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-6 gap-2 text-xs hover:bg-gray-50">
                    <div className="text-gray-800">财务总监</div>
                    <div className="text-gray-600">财务部</div>
                    <div className="text-gray-800">王五</div>
                    <div className="text-gray-600">0</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-[10%]"></div>
                      </div>
                      <span className="text-gray-700 text-xs">10%</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">尚无合适继任者</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4" style={{color: '#3C5E5C'}}>关键岗位继任计划完成率</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">岗位</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">进度</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800 text-xs">技术总监</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full w-[100%]"></div>
                            </div>
                            <span className="ml-3 text-xs text-gray-700">100%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-600 text-xs">完成</span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800 text-xs">产品总监</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-yellow-500 h-full w-[50%]"></div>
                            </div>
                            <span className="ml-3 text-xs text-gray-700">50%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-600 text-xs">进行中</span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800 text-xs">财务总监</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full w-[10%]"></div>
                            </div>
                            <span className="ml-3 text-xs text-gray-700">10%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-red-600 text-xs">未开始</span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800 text-xs">人力资源总监</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full w-[100%]"></div>
                            </div>
                            <span className="ml-3 text-xs text-gray-700">100%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-600 text-xs">完成</span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800 text-xs">销售总监</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-yellow-500 h-full w-[30%]"></div>
                            </div>
                            <span className="ml-3 text-xs text-gray-700">30%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-600 text-xs">进行中</span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800 text-xs">市场总监</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-gray-400 h-full w-[0%]"></div>
                            </div>
                            <span className="ml-3 text-xs text-gray-700">0%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-xs">计划中</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nomination" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">继任者提名管理</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-md border border-gray-200">
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-medium mb-1 text-gray-800">技术总监 - 继任者提名</h3>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500">当前职位持有人: 张三</div>
                          <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">研发部</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 text-[#3C5E5C]"
                          onClick={() => setShowSuccessionDialog(true)}
                        >
                          查看详情
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">添加提名</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-0">
                    <div className="bg-gray-50 p-3 grid grid-cols-5 gap-2 text-xs font-medium text-gray-700">
                      <div>姓名</div>
                      <div>职位</div>
                      <div>部门</div>
                      <div>就绪度</div>
                      <div>操作</div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 grid grid-cols-5 gap-2 text-xs hover:bg-gray-50">
                        <div className="text-gray-800 flex items-center gap-2">
                          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="赵六" className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium">赵六</span>
                        </div>
                        <div className="text-gray-600 flex items-center h-full">技术经理</div>
                        <div className="text-gray-600 flex items-center h-full">研发部</div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[85%]"></div>
                          </div>
                          <span className="text-gray-700 text-xs">85%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-500 text-xs cursor-pointer">移除</span>
                        </div>
                      </div>
                      
                      <div className="p-3 grid grid-cols-5 gap-2 text-xs hover:bg-gray-50">
                        <div className="text-gray-800 flex items-center gap-2">
                          <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="钱七" className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium">钱七</span>
                        </div>
                        <div className="text-gray-600 flex items-center h-full">高级工程师</div>
                        <div className="text-gray-600 flex items-center h-full">研发部</div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[60%]"></div>
                          </div>
                          <span className="text-gray-700 text-xs">60%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-500 text-xs cursor-pointer">移除</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border border-gray-200">
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-medium mb-1 text-gray-800">产品总监 - 继任者提名</h3>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500">当前职位持有人: 李四</div>
                          <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">产品部</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 text-[#3C5E5C]"
                          onClick={() => setShowSuccessionDialog(true)}
                        >
                          查看详情
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">添加提名</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-0">
                    <div className="bg-gray-50 p-3 grid grid-cols-5 gap-2 text-xs font-medium text-gray-700">
                      <div>姓名</div>
                      <div>职位</div>
                      <div>部门</div>
                      <div>就绪度</div>
                      <div>操作</div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 grid grid-cols-5 gap-2 text-xs hover:bg-gray-50">
                        <div className="text-gray-800 flex items-center gap-2">
                          <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="孙八" className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium">孙八</span>
                        </div>
                        <div className="text-gray-600 flex items-center h-full">产品经理</div>
                        <div className="text-gray-600 flex items-center h-full">产品部</div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[50%]"></div>
                          </div>
                          <span className="text-gray-700 text-xs">50%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-500 text-xs cursor-pointer">移除</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pool" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">后备人才库</CardTitle>
              <div className="flex space-x-2">
                <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3 py-1 h-8 rounded-md">
                  筛选
                </Button>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                  添加人才
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border border-gray-200">
                <div className="bg-gray-50 p-4 grid grid-cols-6 gap-2 text-xs font-medium text-gray-700">
                  <div>姓名</div>
                  <div>当前职位</div>
                  <div>部门</div>
                  <div>后备方向</div>
                  <div>就绪程度</div>
                  <div>操作</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  <div className="p-4 grid grid-cols-6 gap-2 text-xs hover:bg-gray-50">
                    <div className="text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">赵</div>
                      <span>赵六</span>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">技术经理</div>
                    <div className="text-gray-600 flex items-center h-full">研发部</div>
                    <div className="text-gray-800 flex items-center h-full">技术总监</div>
                    <div className="flex items-center gap-2 h-full">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[85%]"></div>
                      </div>
                      <span className="text-gray-700 text-xs">85%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">评估</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-6 gap-2 text-xs hover:bg-gray-50">
                    <div className="text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium">钱</div>
                      <span>钱七</span>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">高级工程师</div>
                    <div className="text-gray-600 flex items-center h-full">研发部</div>
                    <div className="text-gray-800 flex items-center h-full">技术总监</div>
                    <div className="flex items-center gap-2 h-full">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[60%]"></div>
                      </div>
                      <span className="text-gray-700 text-xs">60%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">评估</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-6 gap-2 text-xs hover:bg-gray-50">
                    <div className="text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-medium">孙</div>
                      <span>孙八</span>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">产品经理</div>
                    <div className="text-gray-600 flex items-center h-full">产品部</div>
                    <div className="text-gray-800 flex items-center h-full">产品总监</div>
                    <div className="flex items-center gap-2 h-full">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[50%]"></div>
                      </div>
                      <span className="text-gray-700 text-xs">50%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">评估</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showSuccessionDialog} onOpenChange={setShowSuccessionDialog}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="p-6 border-b border-gray-100 text-lg font-semibold text-gray-900">
            继任者沿袭图
          </DialogTitle>
          <div className="p-6">
            <div className="relative" style={{ height: '500px' }}>
              {/* 连接线 */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <path
                  d="M400,60 L400,180 M400,180 C400,180 200,180 200,310 M400,180 C400,180 600,180 600,310"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              
              {/* 技术总监卡片 */}
              <div className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[320px] bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&auto=format&fit=crop&q=60" 
                      alt="张三"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-medium mb-1">张三</div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">技术总监</div>
                      <div className="text-sm text-gray-500">研发部</div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[100%]"></div>
                        </div>
                        <span className="text-xs text-gray-600">100%</span>
                      </div>
                      <div className="text-xs text-green-600">在任</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 高级工程师卡片 - 左 */}
              <div className="absolute left-[40px] top-[290px] w-[320px] bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60" 
                      alt="李四"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-medium mb-1">李四</div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">高级工程师</div>
                      <div className="text-sm text-gray-500">研发部</div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[85%]"></div>
                        </div>
                        <span className="text-xs text-gray-600">85%</span>
                      </div>
                      <div className="text-xs text-green-600">可在1年内继任</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 高级工程师卡片 - 右 */}
              <div className="absolute right-[40px] top-[290px] w-[320px] bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60" 
                      alt="王五"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-medium mb-1">王五</div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">高级工程师</div>
                      <div className="text-sm text-gray-500">研发部</div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full w-[60%]"></div>
                        </div>
                        <span className="text-xs text-gray-600">60%</span>
                      </div>
                      <div className="text-xs text-yellow-600">可在2年内继任</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 