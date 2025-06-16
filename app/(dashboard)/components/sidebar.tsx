'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  SettingsIcon, 
  SearchIcon, 
  FilterIcon, 
  BellIcon, 
  BriefcaseIcon, 
  MenuIcon, 
  MoreIcon, 
  PlusIcon 
} from "@/components/icons/index";

/**
 * 侧边栏导航项接口
 * @interface NavItem
 */
interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

/**
 * 侧边栏组件
 * @return {React.ReactElement} 侧边栏
 */
export default function Sidebar() {
  const pathname = usePathname();
  
  const routes: NavItem[] = [
    {
      icon: CalendarIcon,
      label: "人才标准",
      href: "/talent-standards",
    },
    {
      icon: SettingsIcon,
      label: "任职资格管理",
      href: "/qualification-management",
    },
    {
      icon: SearchIcon,
      label: "人才盘点",
      href: "/talent-assessment",
    },
    {
      icon: BriefcaseIcon,
      label: "人才识别",
      href: "/talent-identification",
    },
    {
      icon: MenuIcon,
      label: "人才培育",
      href: "/talent-development",
    },
    {
      icon: FilterIcon,
      label: "权限演示",
      href: "/permission-demo",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1E212B] text-white border-r border-[#2a2f45]">
      <div className="p-4">
      </div>
      
      <div className="flex-1 px-2 py-2">
        <nav className="space-y-1.5">
          {routes.map((route) => {
            const isActive = pathname?.includes(route.href) || false;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center h-8 w-8",
                  isActive ? "text-white" : "text-white/60"
                )}>
                  <route.icon className="h-5 w-5" />
                </div>
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 