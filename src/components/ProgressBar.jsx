import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * ProgressBar 组件 - 显示边缘和射精进度条，带有动画效果
 * 提供美观的界面、炫酷动效、移动端适配和临界反馈机制
 * @param {Object} props - 组件属性
 * @param {number} props.edge - 边缘进度条百分比值 (0-100)
 * @param {number} props.cum - 射精进度条百分比值 (0-100)
 */
const ProgressBar = ({ edge = 0, cum = 0 }) => {
  // 动态颜色调整：根据进度值调整颜色亮度，增加临界反馈
  const edgeColor = edge > 90 ? 'bg-green-400 animate-pulse' : edge > 70 ? 'bg-green-300' : 'bg-green-200';
  const cumColor = cum > 80 ? 'bg-green-100 animate-pulse' : 'bg-green-100';

  // 动画变体 - 进度条平滑填充效果，临界时抖动
  const barVariants = {
    initial: { width: 0 },
    animate: (width) => ({
      width: `${width}%`,
      transition: { duration: 0.6, ease: 'easeOut' },
      ...(width > 90 ? { scale: [1, 1.05, 1], transition: { duration: 0.3, repeat: Infinity } } : {}), // 临界抖动效果
    }),
  };

  return (
    <div className="flex w-full h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-600 shadow-inner sm:h-5 touch-manipulation relative">
      {/* 边缘进度条 - 动态颜色和动画 */}
      <motion.div
        className={`h-full ${edgeColor} border-r border-gray-600 relative z-10`}
        initial="initial"
        animate="animate"
        custom={edge}
        variants={barVariants}
        style={{ minWidth: '1%' }} // 确保即使值为0也能看到边框
      />
      {/* 射精进度条 - 动态颜色和动画 */}
      <motion.div
        className={`h-full ${cumColor} relative z-10`}
        initial="initial"
        animate="animate"
        custom={cum}
        variants={barVariants}
        style={{ minWidth: '1%' }} // 确保即使值为0也能看到边框
      />
      {/* 背景光晕效果 - 进度临界时显示 */}
      {(edge > 90 || cum > 80) && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-10 rounded-full z-0 animate-pulse" />
      )}
    </div>
  );
};

// PropTypes 验证 - 确保传入值的类型和范围
ProgressBar.propTypes = {
  edge: PropTypes.number.isRequired,
  cum: PropTypes.number.isRequired,
};

export default ProgressBar;