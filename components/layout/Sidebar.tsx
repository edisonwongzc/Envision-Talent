'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { 
  User as UserIcon, 
  Settings as SettingsIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { useAppContext } from '@/contexts/AppContext';

/**
 * 侧边栏组件
 * @returns 侧边导航栏组件
 */
export default function Sidebar() {
  const { state, toggleSidebar } = useAppContext();
  
  return (
    <div className={`${state.sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white transition-all`}>
      <div className="p-4 flex items-center">
        {!state.sidebarCollapsed && <h1 className="text-2xl font-bold">人力资源系统</h1>}
        <button className="p-2 ml-auto rounded hover:bg-gray-800" onClick={toggleSidebar}>
          <MenuIcon size={20} />
        </button>
      </div>
      <nav className="mt-6">
        <NavItem 
          href="/" 
          icon={<HomeIcon size={20} />} 
          text={state.sidebarCollapsed ? '' : '首页'} 
        />
        <NavItem 
          href="/users" 
          icon={<UserIcon size={20} />} 
          text={state.sidebarCollapsed ? '' : '用户管理'} 
        />
        <NavItem 
          href="/settings" 
          icon={<SettingsIcon size={20} />} 
          text={state.sidebarCollapsed ? '' : '系统设置'} 
        />
      </nav>
    </div>
  );
}

/**
 * 导航项组件
 * @param props 导航项属性
 * @returns 导航项组件
 */
function NavItem({ href, icon, text }: { href: string; icon: ReactNode; text: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
        <span className="mr-3">{icon}</span>
        {text && <span>{text}</span>}
      </div>
    </Link>
  );
} 