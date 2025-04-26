import React from 'react';
// eslint-disable-next-line
import { StarIcon } from "@/components/icons";

/**
 * 认证布局组件
 * @param {object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @return {React.ReactElement} 认证布局
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <StarIcon size={24} className="text-primary" />
      {children}
    </div>
  );
} 