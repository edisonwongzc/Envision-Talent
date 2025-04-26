'use client';

import './globals.css';
import { ReactNode } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { AppProvider } from '@/contexts/AppContext';

/**
 * 根布局组件
 * @param props 包含children的属性
 * @returns 应用根布局
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <AppProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AppProvider>
      </body>
    </html>
  );
}
