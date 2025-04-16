'use client';

import React from 'react';
import Link from 'next/link';
import { SearchIcon, BellIcon, MenuIcon, PlusIcon } from "@/components/icons/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * 页面头部组件
 * @return {React.ReactElement} 头部组件
 */
export default function Header() {
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

          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-blue-500 text-white text-xs">用户</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="h-px bg-gray-200 w-full"></div>
    </div>
  );
} 