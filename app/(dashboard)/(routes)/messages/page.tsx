'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellIcon, CheckIcon, ClockIcon, UserIcon, FileTextIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// 通知消息接口
interface NotificationMessage {
  id: string;
  title: string;
  content: string;
  type: 'certification' | 'system' | 'reminder';
  isRead: boolean;
  timestamp: string;
  sender: string;
  relatedId?: string; // 关联的流程ID或申请表ID
  recipientId?: string; // 接收人ID，用于过滤消息
}

/**
 * 消息通知页面组件
 * @returns 消息通知页面
 */
export default function MessagesPage() {
  const router = useRouter();
  const { state } = useAuth();
  const [messages, setMessages] = useState<NotificationMessage[]>([]);

  // 全部消息数据（模拟从后端获取）
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
      recipientId: "15" // 吴十的ID
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
      recipientId: "1" // 张三的用户ID
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
      recipientId: "31" // 赵六的ID
    },
    {
      id: "MSG003",
      title: "系统维护通知",
      content: "系统将于本周六凌晨2:00-6:00进行维护升级，届时将暂时无法访问，请合理安排时间。",
      type: "system",
      isRead: true,
      timestamp: "2024-01-13 16:45",
      sender: "系统管理员",
      recipientId: "1" // 张三的用户ID
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
      recipientId: "1" // 李十三的ID，这里也用1作为示例
    },
    // HRBP角色的消息 - 待审批申请
    {
      id: "MSG_HRBP001",
      title: "认证申请待审批",
      content: "员工张三已提交任职资格认证申请，申请职级：P4，申请序列：技术序列，请及时进行审批。",
      type: "certification",
      isRead: false,
      timestamp: "2024-01-15 16:30",
      sender: "张三",
      relatedId: "CERT_APP_005",
      recipientId: "3" // HRBP用户ID
    },
    {
      id: "MSG_HRBP002",
      title: "认证申请待审批",
      content: "员工吴十已提交任职资格认证申请，申请职级：P4，申请序列：技术序列，请及时进行审批。",
      type: "certification",
      isRead: false,
      timestamp: "2024-01-15 14:30",
      sender: "吴十",
      relatedId: "CERT_APP_001",
      recipientId: "3" // HRBP用户ID
    },
    {
      id: "MSG_HRBP003",
      title: "认证申请待审批",
      content: "员工赵六已提交任职资格认证申请，申请职级：P5，申请序列：产品序列，请及时进行审批。",
      type: "certification",
      isRead: false,
      timestamp: "2024-01-14 10:15",
      sender: "赵六",
      relatedId: "CERT_APP_002",
      recipientId: "3" // HRBP用户ID
    }
  ];

  // 根据当前用户过滤消息
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
    const interval = setInterval(loadMessages, 2000); // 每2秒检查一次新消息

    // 清理定时器
    return () => clearInterval(interval);
  }, [state.user]);

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
      // 跳转到认证申请表页面
      router.push(`/certification-application/${message.relatedId}`);
    }
  };

  // 获取消息类型图标
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return <FileTextIcon className="h-5 w-5 text-blue-600" />;
      case 'system':
        return <BellIcon className="h-5 w-5 text-gray-600" />;
      case 'reminder':
        return <ClockIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  // 获取消息类型标签
  const getMessageBadge = (type: string) => {
    switch (type) {
      case 'certification':
        return <Badge variant="default" className="bg-blue-100 text-blue-700">认证通知</Badge>;
      case 'system':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">系统通知</Badge>;
      case 'reminder':
        return <Badge variant="default" className="bg-orange-100 text-orange-700">提醒</Badge>;
      default:
        return <Badge variant="secondary">通知</Badge>;
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="h-full pt-1 px-6 pb-4 space-y-4 bg-[#f4f7fa]">
      <div className="mb-4">
        <h1 className="text-[18px] font-bold text-gray-800">信息接收</h1>
        <p className="text-sm text-gray-500">查看和管理您的消息通知</p>
      </div>

      <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
          <CardTitle className="text-sm font-medium text-[#3C5E5C] flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            消息通知
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-red-100 text-red-700">
                {unreadCount} 条未读
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))}
            className="text-sm"
          >
            全部标记为已读
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !message.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getMessageIcon(message.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 
                        className={`text-sm font-medium cursor-pointer hover:text-[#3C5E5C] ${
                          !message.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          if (message.type === 'certification') {
                            handleCertificationClick(message);
                          } else {
                            markAsRead(message.id);
                          }
                        }}
                      >
                        {message.title}
                        {!message.isRead && (
                          <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                        )}
                      </h3>
                      {getMessageBadge(message.type)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-3 w-3" />
                        <span>发送人：{message.sender}</span>
                      </div>
                      <span>{message.timestamp}</span>
                    </div>
                    
                    {message.type === 'certification' && !message.isRead && (
                      <div className="mt-3">
                        <Button 
                          size="sm" 
                          className="bg-[#3C5E5C] hover:bg-[#2A4A48] text-white text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCertificationClick(message);
                          }}
                        >
                          {state.user?.role === 'hrbp' || state.user?.role === 'system_leader' 
                            ? '查看申请表' 
                            : '填写认证申请表'}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {message.isRead && (
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {messages.length === 0 && (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">暂无消息</h3>
              <p className="text-sm text-gray-500">您目前没有收到任何通知消息</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 