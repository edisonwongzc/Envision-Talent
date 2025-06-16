'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, BellIcon, MenuIcon, PlusIcon, LogOutIcon, FilterIcon, UserIcon } from "@/components/icons/index";
import { FileTextIcon, ClockIcon, CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// 通知消息接口
interface NotificationMessage {
  id: string;
  title: string;
  content: string;
  type: 'certification' | 'system' | 'reminder';
  isRead: boolean;
  timestamp: string;
  sender: string;
  relatedId?: string;
  recipientId?: string;
}

/**
 * 页面头部组件
 * @return {React.ReactElement} 头部组件
 */
export default function Header() {
  const { state, logout, getRoleDisplayName } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<NotificationMessage[]>([]);

  // 静态消息数据
  const allMessages: NotificationMessage[] = [
    {
      id: "MSG001",
      title: "认证流程评审通知",
      content: "您的任职资格认证申请已开始评审流程，请及时填写并提交认证申请表。申请职级：P4，申请序列：技术序列。",
      type: "certification",
      isRead: false,
      timestamp: "2024-01-15 09:00",
      sender: "HRBP张丽",
      relatedId: "CERT_APP_001",
      recipientId: "15"
    },
    {
      id: "MSG005",
      title: "认证流程评审通知",
      content: "您的任职资格认证申请已开始评审流程，请及时填写并提交认证申请表。申请职级：P4，申请序列：技术序列。",
      type: "certification",
      isRead: false,
      timestamp: "2024-01-15 10:15",
      sender: "HRBP张丽",
      relatedId: "CERT_APP_005",
      recipientId: "1"
    },
    {
      id: "MSG002", 
      title: "认证资料补充通知",
      content: "您的P5级别认证申请资料需要补充完善，请登录系统完善相关信息。",
      type: "certification",
      isRead: true,
      timestamp: "2024-01-14 09:15",
      sender: "系统通知",
      relatedId: "CERT_APP_002",
      recipientId: "31"
    },
    {
      id: "MSG003",
      title: "系统维护通知",
      content: "系统将于本周六凌晨2:00-6:00进行维护升级，届时将暂时无法访问，请合理安排时间。",
      type: "system",
      isRead: true,
      timestamp: "2024-01-13 16:45",
      sender: "系统管理员",
      recipientId: "1"
    },
    {
      id: "MSG004",
      title: "认证流程评审通知", 
      content: "您的任职资格认证申请已开始评审流程，请及时填写并提交认证申请表。申请职级：P6，申请序列：技术序列。",
      type: "certification",
      isRead: false,
      timestamp: "2024-01-12 11:20",
      sender: "HRBP李华",
      relatedId: "CERT_APP_003",
      recipientId: "1"
    }
  ];

  // 加载消息
  useEffect(() => {
    const loadMessages = () => {
      if (state.user) {
        // 从localStorage获取动态生成的消息
        const dynamicMessages = JSON.parse(localStorage.getItem('hrMessages') || '[]');
        
        // 合并静态消息和动态消息
        const combinedMessages = [...allMessages, ...dynamicMessages];
        
        // 根据当前用户过滤消息
        const userMessages = combinedMessages.filter(msg => 
          msg.recipientId === state.user?.id || !msg.recipientId
        );
        
        // 按时间戳排序（最新的在前）
        userMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setMessages(userMessages);
      }
    };

    // 初始加载
    loadMessages();

    // 定时刷新消息
    const interval = setInterval(loadMessages, 2000);

    // 清理定时器
    return () => clearInterval(interval);
  }, [state.user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserInitials = (name: string) => {
    return name.slice(-2);
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

  // 标记消息为已读
  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  // 处理点击认证通知，跳转到认证申请表
  const handleCertificationClick = (message: NotificationMessage) => {
    markAsRead(message.id);
    if (message.relatedId) {
      router.push(`/certification-application/${message.relatedId}`);
    }
  };

  // 获取消息类型图标
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return <FileTextIcon size={16} className="text-blue-600" />;
      case 'system':
        return <BellIcon size={16} className="text-gray-600" />;
      case 'reminder':
        return <ClockIcon size={16} className="text-orange-600" />;
      default:
        return <BellIcon size={16} className="text-gray-600" />;
    }
  };

  // 获取消息类型标签
  const getMessageBadge = (type: string) => {
    switch (type) {
      case 'certification':
        return <Badge variant="default" className="bg-blue-100 text-blue-700 text-xs">认证通知</Badge>;
      case 'system':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">系统通知</Badge>;
      case 'reminder':
        return <Badge variant="default" className="bg-orange-100 text-orange-700 text-xs">提醒</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">通知</Badge>;
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

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

          {/* 消息通知下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                className="relative rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center hover:bg-gray-300"
              >
                <BellIcon className="h-4 w-4 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellIcon size={16} />
                    <span>消息通知</span>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="bg-red-100 text-red-700 text-xs">
                        {unreadCount} 条未读
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))}
                    className="text-xs h-6"
                  >
                    全部已读
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <BellIcon size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">暂无消息</p>
                </div>
              ) : (
                messages.map((message) => (
                  <DropdownMenuItem 
                    key={message.id}
                    className={`flex-col items-start p-4 cursor-pointer ${
                      !message.isRead ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => {
                      if (message.type === 'certification') {
                        handleCertificationClick(message);
                      } else {
                        markAsRead(message.id);
                      }
                    }}
                  >
                    <div className="w-full">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMessageIcon(message.type)}
                          <h4 className={`text-sm font-medium ${
                            !message.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {message.title}
                            {!message.isRead && (
                              <span className="ml-2 w-1.5 h-1.5 bg-blue-600 rounded-full inline-block"></span>
                            )}
                          </h4>
                        </div>
                        {getMessageBadge(message.type)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {message.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <UserIcon size={12} />
                          <span>{message.sender}</span>
                        </div>
                        <span>{message.timestamp}</span>
                      </div>
                      
                      {message.type === 'certification' && !message.isRead && (
                        <div className="mt-2">
                          <div 
                            className="inline-flex items-center px-3 py-1 bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs rounded cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCertificationClick(message);
                            }}
                          >
                            {state.user?.role === 'hrbp' || state.user?.role === 'system_leader' 
                              ? '查看申请表' 
                              : '填写认证申请表'}
                          </div>
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {state.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 border-none bg-transparent">
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
                </button>
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