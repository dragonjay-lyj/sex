import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * GameOptions 组件 - 管理游戏选项选择并导航到游戏页面
 * 提供美观的界面、炫酷动效、移动端适配和趣味性反馈机制
 */
const GameOptions = () => {
  const [duration, setDuration] = useState(''); // 持续时间选项
  const [difficulty, setDifficulty] = useState(''); // 难度选项
  const [desire, setDesire] = useState(''); // 射精意愿选项
  const [error, setError] = useState(''); // 错误提示
  const [feedback, setFeedback] = useState(''); // 即时反馈提示
  const [isNavigating, setIsNavigating] = useState(false); // 导航状态，防止重复点击

  /**
   * 处理开始按钮点击事件，验证选项并导航到游戏页面
   */
  const handleStart = useCallback(() => {
    if (isNavigating) return; // 防止重复点击
    if (!duration || !difficulty || !desire) {
      setError('请选择所有选项！');
      return;
    }
    setIsNavigating(true);
    try {
      window.location.href = `/game?duration=${encodeURIComponent(duration)}&difficulty=${encodeURIComponent(difficulty)}&desire=${encodeURIComponent(desire)}`;
    } catch (err) {
      console.error('导航错误:', err);
      setError('发生错误，请重试。');
      setIsNavigating(false);
    }
  }, [duration, difficulty, desire, isNavigating]);

  /**
   * 处理射精意愿选项变化，显示个性化趣味反馈
   */
  const handleDesireChange = (e) => {
    const value = e.target.value;
    setDesire(value);
    // 扩展的即时反馈机制，增加更多趣味性提示
    switch (value) {
      case 'begging':
        setFeedback('哦？这么想要？那就看你的表现咯~');
        break;
      case 'want':
        setFeedback('想让我允许？先证明你的耐力吧！');
        break;
      case 'depends':
        setFeedback('听我的？那就乖乖等着吧~');
        break;
      case 'notReally':
        setFeedback('不太想？那就慢慢玩咯！');
        break;
      case 'no':
        setFeedback('不想要？那就忍着吧！');
        break;
      default:
        setFeedback('');
        break;
    }
  };

  /**
   * 处理持续时间选项变化，显示趣味反馈
   */
  const handleDurationChange = (e) => {
    const value = e.target.value;
    setDuration(value);
    // 增加趣味反馈
    switch (value) {
      case 'quick':
        setFeedback('快枪手？让我们看看你有多快！');
        break;
      case 'veryLong':
        setFeedback('非常长？准备好持久战吧！');
        break;
      default:
        if (value) setFeedback('选好了时间？那就准备开始吧！');
        else setFeedback('');
        break;
    }
  };

  /**
   * 处理难度选项变化，显示趣味反馈
   */
  const handleDifficultyChange = (e) => {
    const value = e.target.value;
    setDifficulty(value);
    // 增加趣味反馈
    switch (value) {
      case 'impossible':
        setFeedback('不可能的难度？你确定能撑住？');
        break;
      case 'boring':
        setFeedback('无聊的难度？那就慢慢享受吧~');
        break;
      default:
        if (value) setFeedback('选好了难度？挑战即将开始！');
        else setFeedback('');
        break;
    }
  };

  // 动画变体 - 容器渐入和缩放效果
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // 动画变体 - 选项项渐入效果
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // 动画变体 - 按钮悬停和点击效果
  const buttonVariants = {
    rest: { scale: 1 },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-purple-900 p-6 rounded-xl shadow-2xl md:max-w-lg sm:p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 错误提示 - 渐入动画 */}
      {error && (
        <motion.div
          className="mb-4 p-3 bg-red-600 text-white rounded-lg border border-red-400 sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
        >
          {error}
        </motion.div>
      )}
      {/* 即时反馈提示 - 左侧滑入动画 */}
      {feedback && (
        <motion.div
          className="mb-4 p-3 bg-purple-700 text-white rounded-lg border border-purple-400 italic sm:text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
        >
          {feedback}
        </motion.div>
      )}
      {/* 持续时间选项 - 渐入动画 */}
      <motion.div className="mb-5 sm:mb-3" variants={itemVariants}>
        <label className="text-white mb-2 block font-medium sm:text-sm">持续时间</label>
        <select
          value={duration}
          onChange={handleDurationChange}
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none border border-gray-600 hover:border-purple-400 transition-colors duration-200 sm:p-2 sm:text-sm touch-manipulation"
        >
          <option value="">请选择</option>
          <option value="quick">快枪手 (1分钟)</option>
          <option value="short">短 (2分钟)</option>
          <option value="normal">普通 (3分钟)</option>
          <option value="long">长 (4分钟)</option>
          <option value="veryLong">非常长 (5分钟)</option>
        </select>
      </motion.div>
      {/* 难度选项 - 渐入动画 */}
      <motion.div className="mb-5 sm:mb-3" variants={itemVariants}>
        <label className="text-white mb-2 block font-medium sm:text-sm">难度</label>
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none border border-gray-600 hover:border-purple-400 transition-colors duration-200 sm:p-2 sm:text-sm touch-manipulation"
        >
          <option value="">请选择</option>
          <option value="boring">无聊的 (超慢)</option>
          <option value="easy">简单 (慢)</option>
          <option value="normal">普通 (适中)</option>
          <option value="hard">困难 (快)</option>
          <option value="impossible">不可能的 (极快)</option>
        </select>
      </motion.div>
      {/* 射精意愿选项 - 渐入动画 */}
      <motion.div className="mb-5 sm:mb-3" variants={itemVariants}>
        <label className="text-white mb-2 block font-medium sm:text-sm">你想射吗？</label>
        <select
          value={desire}
          onChange={handleDesireChange}
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none border border-gray-600 hover:border-purple-400 transition-colors duration-200 sm:p-2 sm:text-sm touch-manipulation"
        >
          <option value="">请选择</option>
          <option value="no">不了，我待会就射吧</option>
          <option value="notReally">不太想射</option>
          <option value="depends">听你的吧</option>
          <option value="want">想让我射吧</option>
          <option value="begging">求求你求求你让我射吧</option>
        </select>
      </motion.div>
      {/* 开始按钮 - 悬停和点击动效 */}
      <motion.button
        onClick={handleStart}
        disabled={isNavigating}
        variants={buttonVariants}
        initial="rest"
        whileHover={!isNavigating ? "hover" : "rest"}
        whileTap={!isNavigating ? "tap" : "rest"}
        className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-bold shadow-md transition-all duration-300 sm:p-3 sm:text-sm ${
          isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-pink-600 hover:shadow-lg'
        }`}
      >
        {isNavigating ? '导航中...' : '开始你的挑战'}
      </motion.button>
    </motion.div>
  );
};

export default GameOptions;