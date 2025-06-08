'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';

/**
 * HR SaaS系统登录页面
 * @return {React.ReactElement} 登录页面
 */
export default function Home() {
  const router = useRouter();
  const { login, state } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [selectedSystem, setSelectedSystem] = useState('');

  const handleLogin = async () => {
    const success = await login(username, password, selectedRole, selectedSystem);
    if (success) {
      router.push('/talent-standards');
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Envision Talent System</h1>
        <p className="text-gray-600">专业的人力资源管理解决方案</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登录系统</CardTitle>
          <CardDescription>选择您的角色并输入凭据继续访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="role">
                用户角色
              </label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择用户角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">普通员工</SelectItem>
                  <SelectItem value="coe">干部COE</SelectItem>
                  <SelectItem value="hrbp">体系HRBP</SelectItem>
                  <SelectItem value="system_leader">体系负责人</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedRole === 'hrbp' || selectedRole === 'system_leader') && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="system">
                  负责体系
                </label>
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择负责体系" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="技术体系">技术体系</SelectItem>
                    <SelectItem value="产品体系">产品体系</SelectItem>
                    <SelectItem value="销售体系">销售体系</SelectItem>
                    <SelectItem value="运营体系">运营体系</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                用户名
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="输入用户名"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                密码
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={state.isLoading}
            >
              {state.isLoading ? '登录中...' : '登录'}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <p className="mt-6 text-sm text-gray-600">
        演示系统 © {new Date().getFullYear()} | 选择角色并点击"登录"按钮进入系统
      </p>
    </div>
  );
}
