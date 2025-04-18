'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AbilityItemDetail {
  id: string;
  code: string;
  name: string;
  type: string;
  level: string;
  description: string;
  positions: string[];
  createdAt: string;
}

interface AbilityTypeData {
  id: number;
  name: string;
  type: string;
  description: string;
  items: AbilityItemDetail[];
}

export default function AbilityTypePage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const type = decodeURIComponent(params.type);
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAbility, setNewAbility] = useState({
    code: "",
    name: "",
    type: type === "知识技能类" ? "知识技能类" : "素质类",
    level: "",
    description: "",
    position: ""
  });
  
  const [abilityData, setAbilityData] = useState<AbilityTypeData>({
    id: 1,
    name: type,
    type: type === "知识技能类" ? "知识技能" : "素质",
    description: type === "知识技能类" 
      ? "包含专业知识、技术能力、实操技能等关键能力要素" 
      : "包含思维方式、行为特质、价值观等个人素质要素",
    items: type === "知识技能类" ? [
      {
        id: "1",
        code: "K001",
        name: "财务报表分析",
        type: "知识技能类",
        level: "4级 (L4)",
        description: "能运用Python完成数据清洗和可视化分析",
        positions: ["财务岗"],
        createdAt: "2025/03/31 02:54"
      }
    ] : []
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAbility({ ...newAbility, [name]: value });
  };
  
  const handleCreateAbility = () => {
    const newItem: AbilityItemDetail = {
      id: Date.now().toString(),
      code: newAbility.code,
      name: newAbility.name,
      type: newAbility.type,
      level: newAbility.level,
      description: newAbility.description,
      positions: newAbility.position.split(',').map(item => item.trim()),
      createdAt: new Date().toLocaleString()
    };
    
    setAbilityData({
      ...abilityData,
      items: [...abilityData.items, newItem]
    });
    
    setNewAbility({
      code: "",
      name: "",
      type: type === "知识技能类" ? "知识技能类" : "素质类",
      level: "",
      description: "",
      position: ""
    });
    
    setShowCreateDialog(false);
  };
  
  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-4 bg-[#F3F7FA]">
      <div className="flex items-center space-x-2 mb-4">
        <Link href="/talent-standards" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-[18px] font-bold text-gray-800">{abilityData.name}</h1>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{abilityData.description}</p>
        <Button 
          className="bg-[#426966] hover:bg-[#2A4A48] text-white" 
          onClick={() => setShowCreateDialog(true)}
        >
          <PlusIcon size={16} className="mr-2" />
          创建
        </Button>
      </div>
      
      <Card className="shadow-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
          <CardTitle className="text-sm font-medium" style={{color: '#3C5E5C'}}>
            能力项列表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">能力编码</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">能力名称</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">能力类型</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">能力等级</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">能力描述</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">适用岗位</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {abilityData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{item.code}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.level}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.positions.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{item.createdAt}</td>
                </tr>
              ))}
              {abilityData.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    暂无数据，请点击"创建"按钮添加能力项
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>创建{abilityData.name}能力项</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">能力编码</label>
                <Input
                  name="code"
                  value={newAbility.code}
                  onChange={handleInputChange}
                  placeholder="如 K001（知识类）"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">能力名称</label>
                <Input
                  name="name"
                  value={newAbility.name}
                  onChange={handleInputChange}
                  placeholder="如 财务报表分析"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">能力类型</label>
                <Input
                  name="type"
                  value={newAbility.type}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">能力等级</label>
                <Input
                  name="level"
                  value={newAbility.level}
                  onChange={handleInputChange}
                  placeholder="如 4级 (L4)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">能力描述</label>
              <Textarea
                name="description"
                value={newAbility.description}
                onChange={handleInputChange}
                placeholder="如 能运用Python完成数据清洗和可视化分析"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">适用岗位</label>
              <Input
                name="position"
                value={newAbility.position}
                onChange={handleInputChange}
                placeholder="如 财务岗（多个岗位用逗号分隔）"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateAbility}>
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 