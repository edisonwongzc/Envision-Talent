import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

/**
 * 个人信息标签内容组件
 * @returns {React.ReactElement} 个人信息内容
 */
export default function PersonalInfoContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">个人基本信息</h2>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&dpr=2&q=80" 
                alt="员工头像"
                className="w-full h-full object-cover"
              />
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">张远景</h3>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">研发部</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">工号</p>
                  <p className="text-sm font-medium">EMP10086</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">入职时间</p>
                  <p className="text-sm font-medium">2020-05-15</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">职位</p>
                  <p className="text-sm font-medium">部门负责人</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">上级主管</p>
                  <p className="text-sm font-medium">李四（副总裁）</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="text-sm font-medium">138****6666</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">电子邮箱</p>
                  <p className="text-sm font-medium">zhangsan@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-base font-medium mb-4">教育背景</h3>
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium">清华大学</p>
                <p className="text-sm text-gray-600">计算机科学与技术</p>
                <p className="text-sm text-gray-500">硕士学位</p>
              </div>
              <div className="text-sm text-gray-500">
                2016 - 2019
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">北京大学</p>
                <p className="text-sm text-gray-600">软件工程</p>
                <p className="text-sm text-gray-500">学士学位</p>
              </div>
              <div className="text-sm text-gray-500">
                2012 - 2016
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 