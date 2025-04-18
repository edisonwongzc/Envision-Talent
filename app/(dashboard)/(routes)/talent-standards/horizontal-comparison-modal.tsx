'use client';

import { XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

// 能力维度接口
interface CapabilityDimension {
  id: string;
  name: string;
  description: string;
}

// 人才能力数据接口
interface TalentCapabilityData {
  employeeName: string;
  capabilities: {
    dimensionId: string;
    matchRate: number;
  }[];
}

interface HorizontalComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: string[];
}

export default function HorizontalComparisonModal({ 
  isOpen, 
  onClose,
  selectedEmployees
}: HorizontalComparisonModalProps) {
  if (!isOpen) return null;

  // 能力维度数据
  const capabilityDimensions: CapabilityDimension[] = [
    { id: "tech", name: "技术能力", description: "包括编程、架构设计等技术相关能力" },
    { id: "comm", name: "沟通能力", description: "与团队成员和利益相关者的沟通效果" },
    { id: "lead", name: "领导力", description: "管理团队和推动项目的能力" },
    { id: "solve", name: "问题解决", description: "分析并解决复杂问题的能力" },
    { id: "innov", name: "创新能力", description: "提出创新解决方案的能力" },
    { id: "learn", name: "学习适应", description: "学习新技术和适应变化的能力" }
  ];

  // 模拟人才能力数据
  const talentCapabilityData: TalentCapabilityData[] = useMemo(() => {
    return selectedEmployees.map(employee => ({
      employeeName: employee,
      capabilities: capabilityDimensions.map(dimension => ({
        dimensionId: dimension.id,
        // 生成65-95之间的随机匹配度
        matchRate: Math.floor(Math.random() * 31) + 65
      }))
    }));
  }, [selectedEmployees]);

  // 获取某人在某维度的匹配度
  const getMatchRate = (employeeName: string, dimensionId: string): number => {
    const employee = talentCapabilityData.find(e => e.employeeName === employeeName);
    if (!employee) return 0;
    
    const capability = employee.capabilities.find(c => c.dimensionId === dimensionId);
    return capability ? capability.matchRate : 0;
  };

  // 获取匹配度单元格的CSS类
  const getMatchRateClass = (rate: number): string => {
    if (rate >= 90) return "bg-green-100 text-green-800";
    if (rate >= 80) return "bg-blue-100 text-blue-800";
    if (rate >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm">
      <div className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">人才横向能力对比结果</h2>
          <button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={onClose}
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium mb-4 text-gray-800">对比员工名单</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEmployees.length > 0 ? (
                  selectedEmployees.map((employee, index) => (
                    <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {employee}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-xs">未选择员工</div>
                )}
              </div>
            </div>
            
            {/* 能力维度对比表格 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 text-gray-800">能力维度对比</h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        能力维度
                      </th>
                      {selectedEmployees.map((employee, index) => (
                        <th key={index} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {employee}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {capabilityDimensions.map((dimension) => (
                      <tr key={dimension.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{dimension.name}</div>
                            <div className="text-xs text-gray-500">{dimension.description}</div>
                          </div>
                        </td>
                        {selectedEmployees.map((employee, index) => {
                          const matchRate = getMatchRate(employee, dimension.id);
                          return (
                            <td key={index} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMatchRateClass(matchRate)}`}>
                                {matchRate}%
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 示意图表区域 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 text-gray-800">能力雷达图对比</h4>
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-gray-500">对比图表区域</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-2 px-4 py-2 rounded text-xs"
              onClick={onClose}
            >
              关闭
            </Button>
            <Button className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white px-4 py-2 rounded text-xs">
              导出对比报告
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 