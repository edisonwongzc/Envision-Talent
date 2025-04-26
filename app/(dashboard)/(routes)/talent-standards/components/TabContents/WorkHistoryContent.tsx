import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

/**
 * 工作履历标签内容组件
 * @returns {React.ReactElement} 工作履历内容
 */
export default function WorkHistoryContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">工作履历</h2>
      
      {/* 内部工作履历 */}
      <div>
        <h3 className="text-base font-medium mb-3">内部工作履历</h3>
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 当前公司工作经历部分 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">工作经历</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-[#3C5E5C] pl-3 py-1">
                    <p className="text-sm font-medium text-gray-800">部门负责人</p>
                    <p className="text-sm text-gray-500">本公司 (2022 - 至今)</p>
                    <ul className="mt-2 text-xs text-gray-600 list-disc pl-4">
                      <li>负责部门的整体管理与团队建设</li>
                      <li>参与公司战略规划与执行</li>
                      <li>负责重点项目的推进与资源协调</li>
                    </ul>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-3 py-1">
                    <p className="text-sm font-medium text-gray-800">高级开发工程师</p>
                    <p className="text-sm text-gray-500">本公司 (2020 - 2022)</p>
                    <ul className="mt-2 text-xs text-gray-600 list-disc pl-4">
                      <li>负责核心模块的架构设计与实现</li>
                      <li>指导初级开发人员技术成长</li>
                      <li>参与技术评审与技术选型</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 职位详情部分 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">职位详情</h3>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">职级</p>
                      <p className="text-sm font-medium text-gray-800">P8</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">直接上级</p>
                      <p className="text-sm font-medium text-gray-800">李四（副总裁）</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">所属部门</p>
                      <p className="text-sm font-medium text-gray-800">研发部</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">入职时间</p>
                      <p className="text-sm font-medium text-gray-800">2020年5月15日</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">汇报关系</p>
                      <p className="text-sm font-medium text-gray-800">研发部 → 产品技术中心 → 副总裁</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 内部项目经历部分 */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">内部项目经历</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">企业人才管理系统</h4>
                      <p className="text-xs text-gray-500 mt-1">2021年6月 - 2022年9月</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">负责人</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    负责系统架构设计和核心模块实现，包括权限管理、数据安全和性能优化。项目成功上线后提升了公司人才管理效率30%。
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">绩效考核平台</h4>
                      <p className="text-xs text-gray-500 mt-1">2020年6月 - 2021年1月</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">技术负责</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    设计并实现了基于云原生架构的绩效考核系统，采用微服务架构提高了系统稳定性和可扩展性。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 外部工作履历 */}
      <div>
        <h3 className="text-base font-medium mb-3">外部工作履历</h3>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            {/* 过往工作经历 */}
            <h3 className="text-sm font-medium text-gray-500 mb-4">过往工作经历</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <p className="text-sm font-medium text-gray-800">开发工程师</p>
                <p className="text-sm text-gray-500">某科技公司 (2017 - 2020)</p>
                <ul className="mt-2 text-xs text-gray-600 list-disc pl-4">
                  <li>负责产品功能开发和维护</li>
                  <li>参与团队敏捷开发流程</li>
                  <li>解决系统bug和性能问题</li>
                </ul>
              </div>
              
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <p className="text-sm font-medium text-gray-800">初级开发工程师</p>
                <p className="text-sm text-gray-500">某网络科技有限公司 (2015 - 2017)</p>
                <ul className="mt-2 text-xs text-gray-600 list-disc pl-4">
                  <li>参与前端界面开发与维护</li>
                  <li>学习并应用新技术于项目中</li>
                  <li>协助测试团队进行功能测试</li>
                </ul>
              </div>
            </div>

            {/* 专业技能部分 */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">专业技能</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">React</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Node.js</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">微服务架构</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">云原生</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">系统设计</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">项目管理</span>
              </div>
            </div>
            
            {/* 外部项目经历 */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">外部项目经历</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">电商平台重构项目</h4>
                      <p className="text-xs text-gray-500 mt-1">2018年3月 - 2019年12月</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">核心开发</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    参与大型电商平台的技术重构，采用前后端分离架构，提升了系统响应速度和用户体验。
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">CRM客户管理系统</h4>
                      <p className="text-xs text-gray-500 mt-1">2016年5月 - 2017年8月</p>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">开发者</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    参与开发企业级CRM系统，负责客户数据管理和报表模块，提高了销售团队的工作效率。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 