import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * HR SaaS系统登录页面
 * @return {React.ReactElement} 登录页面
 */
export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">HR SaaS 系统</h1>
        <p className="text-gray-600">专业的人力资源管理解决方案</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登录系统</CardTitle>
          <CardDescription>输入您的凭据继续访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                用户名
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="username"
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
                placeholder="输入密码"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/talent-standards" className="w-full">
            <Button className="w-full">登录</Button>
          </Link>
        </CardFooter>
      </Card>
      
      <p className="mt-6 text-sm text-gray-600">
        演示系统 © {new Date().getFullYear()} | 点击`&quot;`登录`&quot;`按钮直接进入系统
      </p>
    </div>
  );
}
