'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SearchIcon, BellIcon, MenuIcon, PlusIcon, LogOutIcon } from "@/components/icons/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * 页面头部组件
 * @return {React.ReactElement} 头部组件
 */
export default function Header() {
  const { state, logout, getRoleDisplayName } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserInitials = (name: string) => {
    return name.slice(-2); // 取姓名的后两个字符
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'employee':
        return 'bg-blue-500';
      case 'coe':
        return 'bg-purple-500';
      case 'hrbp':
        return 'bg-green-500';
      case 'system_leader':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#1D212C]">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-x-4">
          <div className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </div>
          <span className="text-lg">
            <span className="font-extrabold">Envision</span>
            <span className="font-medium"> HR</span>
          </span>
        </div>

        <div className="flex items-center gap-x-6">
          <Button 
            size="icon" 
            className="rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center hover:bg-gray-300"
          >
            <SearchIcon className="h-4 w-4 text-gray-700" />
          </Button>

          <div className="relative">
            <Button 
              size="icon" 
              className="rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center hover:bg-gray-300"
            >
              <BellIcon className="h-4 w-4 text-gray-700" />
            </Button>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>

          {state.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={state.user.avatar} />
                    <AvatarFallback className={`${getRoleColor(state.user.role)} text-white text-xs`}>
                      {getUserInitials(state.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-sm">
                    <div className="font-medium">{state.user.name}</div>
                    <div className="text-gray-500 text-xs">{getRoleDisplayName(state.user.role)}</div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div>
                    <div className="font-medium">{state.user.name}</div>
                    <div className="text-gray-500 text-xs font-normal">
                      {getRoleDisplayName(state.user.role)}
                      {state.user.system && ` - ${state.user.system}`}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="h-px bg-gray-200 w-full"></div>
    </div>
  );
} 