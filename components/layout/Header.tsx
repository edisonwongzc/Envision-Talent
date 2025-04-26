'use client';

import { 
  User as UserIcon, 
  Moon as MoonIcon,
  Sun as SunIcon,
  Bell as BellIcon,
} from "lucide-react";
import { useAppContext } from '@/contexts/AppContext';

/**
 * 顶部导航栏组件
 * @returns 页面顶部导航栏
 */
export default function Header() {
  const { state, setTheme, toggleNotifications } = useAppContext();
  
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div className="text-xl font-semibold">用户管理系统</div>
      <div className="flex items-center">
        {/* 主题切换 */}
        <button 
          className="p-2 rounded hover:bg-gray-100 mr-2"
          onClick={() => setTheme(state.theme === 'light' ? 'dark' : 'light')}
        >
          {state.theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
        
        {/* 通知 */}
        <button 
          className="p-2 rounded hover:bg-gray-100 relative mr-4"
          onClick={toggleNotifications}
        >
          <BellIcon size={20} />
          {state.notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {state.notificationCount}
            </span>
          )}
        </button>
        
        {/* 用户头像 */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <UserIcon size={16} />
        </div>
      </div>
    </header>
  );
} 