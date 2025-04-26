'use client';

import React from 'react';
import { StarIcon } from '@/components/icons';

/**
 * 星级评分组件属性接口
 * @interface StarRatingProps
 * @property {number} value - 评分值
 * @property {number} [max=5] - 最大星星数量
 * @property {number} [size=16] - 星星图标大小
 */
interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
}

/**
 * 星级评分组件
 * 
 * @param {StarRatingProps} props - 组件属性
 * @returns {React.ReactElement} 星级评分组件
 */
const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  size = 16
}) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon
          key={i}
          size={size}
          className={i < value ? 'text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

export default StarRating; 