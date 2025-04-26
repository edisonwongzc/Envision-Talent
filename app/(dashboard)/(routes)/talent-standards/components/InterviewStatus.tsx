'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Interview {
  id: number;
  stage: string;
  interviewer?: string;
  date?: string;
  status: 'completed' | 'scheduled' | 'pending';
  score?: number;
}

interface InterviewStatusProps {
  interviewData: {
    interviews?: Interview[];
  } | null;
}

/**
 * 面试状态组件
 * @param {object} props - 组件属性
 * @param {InterviewStatusProps} props.interviewData - 面试数据
 * @returns {React.ReactElement} 面试状态组件
 */
const InterviewStatus: React.FC<InterviewStatusProps> = ({ interviewData }) => {
  // 这里假设数据结构，实际使用时应根据真实数据调整
  const mockInterviews: Interview[] = [
    { id: 1, stage: '技术初筛', interviewer: '张工', date: '2023-11-05', status: 'completed', score: 85 },
    { id: 2, stage: '技术面试', interviewer: '李经理', date: '2023-11-10', status: 'completed', score: 78 },
    { id: 3, stage: 'HR面试', interviewer: '王HR', date: '2023-11-15', status: 'scheduled' },
    { id: 4, stage: '总监面试', interviewer: '赵总监', status: 'pending' }
  ];

  const interviews = interviewData?.interviews || mockInterviews;
  const overallProgress = interviews.filter((i: Interview) => i.status === 'completed').length / interviews.length * 100;

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>面试进度</CardTitle>
          <CardDescription>当前面试流程进度及状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">总体进度</span>
              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="space-y-4">
            {interviews.map((interview: Interview) => (
              <div key={interview.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{interview.stage}</h4>
                  <Badge variant={
                    interview.status === 'completed' ? 'default' : 
                    interview.status === 'scheduled' ? 'secondary' : 'outline'
                  }>
                    {interview.status === 'completed' ? '已完成' : 
                     interview.status === 'scheduled' ? '已安排' : '待安排'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  {interview.interviewer && (
                    <div className="flex flex-col">
                      <span>面试官</span>
                      <span className="font-medium text-gray-700">{interview.interviewer}</span>
                    </div>
                  )}
                  
                  {interview.date && (
                    <div className="flex flex-col">
                      <span>面试日期</span>
                      <span className="font-medium text-gray-700">{interview.date}</span>
                    </div>
                  )}
                  
                  {interview.score && (
                    <div className="flex flex-col col-span-2 mt-2">
                      <span>得分</span>
                      <div className="flex items-center gap-2">
                        <Progress value={interview.score} className="h-2" />
                        <span className="font-medium text-gray-700">{interview.score}/100</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewStatus; 