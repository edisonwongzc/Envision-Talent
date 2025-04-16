'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";

/**
 * 人才培育页面组件
 * @return {React.ReactElement} 人才培育页面
 */
export default function TalentDevelopmentPage() {
  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-2 bg-[#f4f7fa]">
      <div className="mb-1">
        <h1 className="text-[18px] font-bold text-gray-800">人才培育</h1>
        <p className="text-sm text-gray-500">制定发展计划和管理导师关系</p>
      </div>

      <Tabs defaultValue="map" className="w-full mt-8">
        <TabsList className="w-full flex justify-start space-x-6 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger 
            value="map" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            人才发展地图
          </TabsTrigger>
          <TabsTrigger 
            value="idp" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            个人发展计划
          </TabsTrigger>
          <TabsTrigger 
            value="mentor" 
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3C5E5C] data-[state=active]:font-medium data-[state=active]:text-gray-900 text-gray-500 rounded-none bg-transparent hover:text-gray-900 data-[state=active]:shadow-none"
          >
            导师看板
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">人才发展地图</CardTitle>
              <div className="flex space-x-2">
                <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3 py-1 h-8 rounded-md">
                  筛选
                </Button>
                <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                  <PlusIcon size={14} className="mr-1" />
                  添加路径
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1 text-gray-800">技术岗位发展路径</h3>
                      <div className="text-xs text-gray-500">适用部门: 研发部、产品部、技术部</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">编辑</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center overflow-x-auto py-4">
                    <div className="flex items-center min-w-max">
                      <div className="w-32 px-2 py-3 bg-gray-100 text-center rounded-md text-xs font-medium text-gray-700">
                        初级工程师
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-blue-100 text-center rounded-md text-xs font-medium text-blue-700">
                        中级工程师
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-indigo-100 text-center rounded-md text-xs font-medium text-indigo-700">
                        高级工程师
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-purple-100 text-center rounded-md text-xs font-medium text-purple-700">
                        技术专家
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-violet-100 text-center rounded-md text-xs font-medium text-violet-700">
                        架构师
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1 text-gray-800">管理岗位发展路径</h3>
                      <div className="text-xs text-gray-500">适用部门: 全公司</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">编辑</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center overflow-x-auto py-4">
                    <div className="flex items-center min-w-max">
                      <div className="w-32 px-2 py-3 bg-gray-100 text-center rounded-md text-xs font-medium text-gray-700">
                        主管
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-green-100 text-center rounded-md text-xs font-medium text-green-700">
                        经理
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-emerald-100 text-center rounded-md text-xs font-medium text-emerald-700">
                        高级经理
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-teal-100 text-center rounded-md text-xs font-medium text-teal-700">
                        总监
                      </div>
                      <div className="h-0.5 w-8 bg-gray-300"></div>
                      <div className="w-32 px-2 py-3 bg-cyan-100 text-center rounded-md text-xs font-medium text-cyan-700">
                        副总裁
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="idp" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">个人发展计划</CardTitle>
              <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                <PlusIcon size={14} className="mr-1" />
                创建计划
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1 text-gray-800">李十三 - 高级工程师发展计划</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>计划周期: 2023-06 至 2023-12</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">进行中</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">编辑</Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-medium mb-2 text-gray-700">发展目标</h4>
                    <div className="text-sm text-gray-600 mb-4">晋升至技术专家岗位，提升系统架构设计能力和团队管理能力</div>
                    
                    <h4 className="text-xs font-medium mb-2 text-gray-700">目标完成进度</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-700">战-项目完成进度</span>
                          <span className="text-xs text-gray-500">75%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[75%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-700">训-导师辅导进度</span>
                          <span className="text-xs text-gray-500">50%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[50%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-700">学-学习进度</span>
                          <span className="text-xs text-gray-500">25%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[25%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1 text-gray-800">王五 - 产品经理发展计划</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>计划周期: 2023-07 至 2024-01</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">进行中</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">查看详情</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-[#3C5E5C]">编辑</Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-medium mb-2 text-gray-700">发展目标</h4>
                    <div className="text-sm text-gray-600 mb-4">晋升至高级产品经理岗位，提升产品规划能力和市场分析能力</div>
                    
                    <h4 className="text-xs font-medium mb-2 text-gray-700">目标完成进度</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-700">战-项目完成进度</span>
                          <span className="text-xs text-gray-500">60%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[60%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-700">学-学习进度</span>
                          <span className="text-xs text-gray-500">40%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[40%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mentor" className="space-y-4 mt-6">
          <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
              <CardTitle style={{color: '#3C5E5C'}} className="text-sm font-medium">导师看板</CardTitle>
              <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs px-3 py-1 h-8 rounded-md">
                <PlusIcon size={14} className="mr-1" />
                添加导师
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border border-gray-200">
                <div className="bg-gray-50 p-4 grid grid-cols-6 gap-1 text-xs font-medium text-gray-700">
                  <div>导师信息</div>
                  <div>专长领域</div>
                  <div>辅导学员</div>
                  <div>状态</div>
                  <div>操作</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  <div className="p-4 grid grid-cols-6 gap-1 text-sm hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="张三" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="text-gray-800 font-medium">张三</div>
                        <div className="text-xs text-gray-500">技术总监</div>
                      </div>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">系统架构</span>
                        <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">团队管理</span>
                      </div>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">3人</div>
                    <div className="flex items-center h-full">
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">活跃</span>
                    </div>
                    <div className="flex space-x-5 items-center">
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">查看详情</Button>
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">分配学员</Button>
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">制定活动</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-6 gap-1 text-sm hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="李四" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="text-gray-800 font-medium">李四</div>
                        <div className="text-xs text-gray-500">产品总监</div>
                      </div>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full">产品设计</span>
                        <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full">用户体验</span>
                      </div>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">2人</div>
                    <div className="flex items-center h-full">
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">活跃</span>
                    </div>
                    <div className="flex space-x-5 items-center">
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">查看详情</Button>
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">分配学员</Button>
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">制定活动</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-6 gap-1 text-sm hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="王五" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="text-gray-800 font-medium">王五</div>
                        <div className="text-xs text-gray-500">市场总监</div>
                      </div>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded-full">市场策略</span>
                        <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded-full">品牌营销</span>
                      </div>
                    </div>
                    <div className="text-gray-600 flex items-center h-full">1人</div>
                    <div className="flex items-center h-full">
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">暂停</span>
                    </div>
                    <div className="flex space-x-5 items-center">
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">查看详情</Button>
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">分配学员</Button>
                      <Button variant="link" size="sm" className="text-xs h-7 text-[#3C5E5C] p-0 hover:no-underline">制定活动</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4" style={{color: '#3C5E5C'}}>沟通记录</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">时间</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">导师</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">学员</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">主题</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">完成率</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">评分</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">2023-11-15</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">张三</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">李十三</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">系统架构设计指导</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[85%]"></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-700">85%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">4.5/5</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">2023-11-10</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">李四</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">王五</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">产品规划评审</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[70%]"></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-700">70%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">4.0/5</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">2023-11-05</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">张三</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">钱七</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">团队管理经验分享</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[60%]"></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-700">60%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">3.8/5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
