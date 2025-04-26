'use client';

import { useState, useCallback } from 'react';

/**
 * 切换状态Hook
 * 
 * @param {boolean} initialState - 初始状态
 * @returns {[boolean, () => void, (value: boolean) => void]} - [当前状态, 切换函数, 设置函数]
 */
export function useToggle(initialState: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState<boolean>(initialState);
  
  // 切换状态函数
  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);
  
  // 直接设置状态函数
  const setValue = useCallback((value: boolean) => {
    setState(value);
  }, []);
  
  return [state, toggle, setValue];
}
