'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 权限演示页面
 * 展示不同角色的权限差异
 */
export default function PermissionDemoPage() {
  const { 
    canCreateStandards, 
    canEditStandards, 
    canDeleteStandards,
    canViewAllEmployees,
    canViewSystemEmployees,
    canOnlyViewOwnData,
    getAccessibleSystems,
    currentUser 
  } = usePermissions();

  const { getRoleDisplayName } = useAuth();

  const mockEmployees = [
    { id: '1', name: '张三', system: '技术体系', department: '技术部', role: 'employee' },
    { id: '2', name: '李四', system: '产品体系', department: '产品部', role: 'employee' },
    { id: '3', name: '王五', system: '技术体系', department: '技术部', role: 'employee' },
    { id: '4', name: '赵六', system: '销售体系', department: '销售部', role: 'employee' },
  ];

  const mockStandards = [
    { id: '1', name: 'Python开发能力', system: '技术体系', type: '知识技能' },
    { id: '2', name: '产品设计思维', system: '产品体系', type: '素质' },
    { id: '3', name: '团队协作能力', system: '通用', type: '素质' },
    { id: '4', name: '销售技巧', system: '销售体系', type: '知识技能' },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'employee': return 'bg-blue-500';
      case 'coe': return 'bg-purple-500';
      case 'hrbp': return 'bg-green-500';
      case 'system_leader': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-6 bg-[#F3F7FA]">
      <div className="mb-6">
        <h1 className="text-[18px] font-bold text-gray-800">权限系统演示</h1>
        <p className="text-sm text-gray-500">展示不同角色的权限差异和数据访问范围</p>
      </div>

      {/* 当前用户信息 */}
      {currentUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getRoleColor(currentUser.role)}`}></div>
              <span>当前用户信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">姓名</label>
                <p className="text-sm font-semibold">{currentUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">角色</label>
                <p className="text-sm font-semibold">{getRoleDisplayName(currentUser.role)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">部门</label>
                <p className="text-sm font-semibold">{currentUser.department || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">负责体系</label>
                <p className="text-sm font-semibold">{currentUser.system || '无'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 权限概览 */}
      <Card>
        <CardHeader>
          <CardTitle>权限概览</CardTitle>
          <CardDescription>当前角色的操作权限</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${canCreateStandards() ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">创建标准</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${canEditStandards() ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">编辑标准</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${canDeleteStandards() ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">删除标准</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${canViewAllEmployees() ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">查看所有员工</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据访问范围 */}
      <Card>
        <CardHeader>
          <CardTitle>数据访问范围</CardTitle>
          <CardDescription>根据当前角色可以访问的数据范围</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">可访问的体系</h4>
              <div className="flex flex-wrap gap-2">
                {getAccessibleSystems().map((system) => (
                  <span key={system} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {system}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">员工数据访问权限</h4>
              <p className="text-sm text-gray-600 mb-2">
                {canViewAllEmployees() && '可以查看所有员工的数据'}
                {canViewSystemEmployees() && !canViewAllEmployees() && '可以查看本体系员工的数据'}
                {canOnlyViewOwnData() && '只能查看自己的数据'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 模拟员工列表 */}
      <Card>
        <CardHeader>
          <CardTitle>员工列表（模拟数据）</CardTitle>
          <CardDescription>根据权限过滤后的员工数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockEmployees.map((employee) => {
              // 根据权限判断是否显示该员工
              const canView = canViewAllEmployees() || 
                             (canViewSystemEmployees() && employee.system === currentUser?.system) ||
                             (canOnlyViewOwnData() && employee.id === currentUser?.id);
              
              if (!canView) return null;

              return (
                <div key={employee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{employee.name.slice(-2)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.system} - {employee.department}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled={!canViewAllEmployees() && !canViewSystemEmployees()}>
                    查看详情
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 模拟人才标准列表 */}
      <Card>
        <CardHeader>
          <CardTitle>人才标准列表（模拟数据）</CardTitle>
          <CardDescription>所有角色都可以查看标准，但操作权限不同</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockStandards.map((standard) => (
              <div key={standard.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{standard.name}</p>
                  <p className="text-xs text-gray-500">{standard.system} - {standard.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    查看
                  </Button>
                  {canEditStandards() && (
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                  )}
                  {canDeleteStandards() && (
                    <Button variant="destructive" size="sm">
                      删除
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 角色说明 */}
      <Card>
        <CardHeader>
          <CardTitle>角色权限说明</CardTitle>
          <CardDescription>四种角色的详细权限说明</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="font-medium">普通员工</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 仅限于查看自己的内容</li>
                <li>• 可以查看所有人才标准（学习参考）</li>
                <li>• 无法创建、编辑、删除标准</li>
              </ul>
            </div>

            <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h4 className="font-medium">干部COE</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 查看全部员工的内容</li>
                <li>• 可以创建、编辑、删除所有标准</li>
                <li>• 拥有最高权限</li>
              </ul>
            </div>

            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h4 className="font-medium">体系HRBP</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 查看所负责体系正式员工</li>
                <li>• 可以创建和编辑标准</li>
                <li>• 无法删除标准</li>
              </ul>
            </div>

            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h4 className="font-medium">体系负责人</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 查看所负责体系正式员工</li>
                <li>• 可以创建和编辑标准</li>
                <li>• 无法删除标准</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 