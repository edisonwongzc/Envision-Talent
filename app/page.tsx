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
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleLogin = async () => {
    const success = await login(username, password, selectedRole, selectedSystem);
    if (success) {
      router.push('/talent-standards');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundColor: '#000000',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 黑色遮罩层 */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      )}
      
      {/* 背景图片上传按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-2 rounded-md text-sm transition-all duration-200 border border-gray-600 hover:border-gray-400">
            上传背景图
          </div>
        </label>
      </div>

      <div className="relative z-10 text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Envision Talent System</h1>
        <p className="text-gray-300">专业的人力资源管理解决方案</p>
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-white border-gray-300 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-black">登录系统</CardTitle>
          <CardDescription className="text-gray-600">选择您的角色并输入凭据继续访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="role">
                  用户角色
                </label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger className="bg-gray-100 border-gray-300 text-black">
                    <SelectValue placeholder="选择用户角色" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="employee" className="text-black hover:bg-gray-100">普通员工</SelectItem>
                    <SelectItem value="coe" className="text-black hover:bg-gray-100">干部COE</SelectItem>
                    <SelectItem value="hrbp" className="text-black hover:bg-gray-100">体系HRBP</SelectItem>
                    <SelectItem value="system_leader" className="text-black hover:bg-gray-100">体系负责人</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                          {(selectedRole === 'hrbp' || selectedRole === 'system_leader') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="system">
                    负责体系
                  </label>
                  <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                    <SelectTrigger className="bg-gray-100 border-gray-300 text-black">
                      <SelectValue placeholder="选择负责体系" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="技术体系" className="text-black hover:bg-gray-100">技术体系</SelectItem>
                      <SelectItem value="产品体系" className="text-black hover:bg-gray-100">产品体系</SelectItem>
                      <SelectItem value="销售体系" className="text-black hover:bg-gray-100">销售体系</SelectItem>
                      <SelectItem value="运营体系" className="text-black hover:bg-gray-100">运营体系</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

                          <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="username">
                用户名
              </label>
              <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
                id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                placeholder="输入用户名"
              />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                密码
              </label>
              <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
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
              className="w-full bg-black text-white hover:bg-gray-800 font-medium" 
              onClick={handleLogin}
              disabled={state.isLoading}
            >
              {state.isLoading ? '登录中...' : '登录'}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <p className="mt-6 text-sm text-gray-400 relative z-10">
        演示系统 © {new Date().getFullYear()} | 选择角色并点击"登录"按钮进入系统
      </p>
    </div>
  );
}
