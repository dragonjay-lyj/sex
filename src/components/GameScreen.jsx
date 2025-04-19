import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';

/**
 * GameScreen 组件 - 管理游戏阶段、进度条和提示信息
 * 提供美观的界面、炫酷动效、移动端适配和趣味性游戏逻辑
 */
const messages = {
  first: [['<small>这是热身环节，现在开始打飞机，然后试着在进度条到达“边缘”区域的尽头时也到达射精的边缘。<br />当进度条到达“射精”区域时，你也应该准备好喷射了。<br />尽可能的接近射精的边缘，这会让接下来的游戏变得更有意思！</small>', 45, 2]],
  go: [
    ['现在你可以打飞机了！', 30, 2],
    ['再用力一点，宝贝，我知道你能行！', 25, 3],
    ['快速而努力地做到这一点！', 15, 4],
    ['撸吧，用力点！', 20, 2.5],
    ['快射了？再忍忍！', 20, 2],
    ['只用两根手指去撸你的龟头！', 25, 2.5],
    ['用你的另一只手，感受不一样！', 20, 2.3],
    ['慢一点，稳一点，感受每一寸...', 30, 1.5]
  ],
  stop: [
    ['别碰它了！平静一下，然后准备下一阶段...', 25],
    ['哎呀，停下，忍住别让我失望！', 20],
    ['立刻把你的手从鸡巴上拿开！', 15],
    ['停下！深呼吸 ;-)', 10],
    ['摸摸你的乳头，别碰下面。', 20],
    ['把手背在脑后，忍住！', 25],
    ['停！别让我生气哦！', 15]
  ],
  finish: [
    ['射吧！现在就射！', 15, 'green', 4],
    ['射吧！别浪费时间了 ;)', 20, 'green', 3],
    ['你只有五秒的时间去射精，否则就算你输了喔！', 6, 'green', 5],
    ['现在射精！让这次成为你射得最多的一次！', 25, 'green', 2.5],
    ['停下！不好意思，这次你不能射了哦！<br />再试一次，也许会有好运呢...', 30, 'red', 2]
  ]
};

const GameScreen = () => {
  const [duration, setDuration] = useState('normal'); // 持续时间选项
  const [difficulty, setDifficulty] = useState('normal'); // 难度选项
  const [desire, setDesire] = useState('depends'); // 射精意愿选项
  const [error, setError] = useState(''); // 错误提示
  const [phase, setPhase] = useState('warmup'); // 游戏阶段
  const [progressEdge, setProgressEdge] = useState(0); // 边缘进度条值
  const [progressCum, setProgressCum] = useState(0); // 射精进度条值
  const [message, setMessage] = useState(messages.first[0]); // 当前提示信息
  const [background, setBackground] = useState('bg-black'); // 背景颜色
  const [timeLeft, setTimeLeft] = useState(message[1] || 0); // 当前阶段剩余时间
  const [totalTime, setTotalTime] = useState(0); // 游戏总剩余时间
  const [isNavigating, setIsNavigating] = useState(false); // 导航状态，防止重复导航
  const [phaseFeedback, setPhaseFeedback] = useState(''); // 阶段变化时的额外反馈
  const [isPaused, setIsPaused] = useState(false); // 游戏暂停状态

  /**
   * 初始化时获取 URL 参数
   */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const newDuration = params.get('duration') || 'normal';
      const newDifficulty = params.get('difficulty') || 'normal';
      const newDesire = params.get('desire') || 'depends';
      setDuration(newDuration);
      setDifficulty(newDifficulty);
      setDesire(newDesire);
    } catch (err) {
      console.error('参数获取错误:', err);
      setError('无法获取游戏参数，使用默认值。');
    }
  }, []);

  /**
   * 游戏主逻辑：管理阶段切换、进度条更新和提示信息
   */
  useEffect(() => {
    if (isPaused) return; // 如果游戏暂停，停止逻辑更新

    const baseSpeed = difficulty === 'impossible' ? 5 : difficulty === 'hard' ? 3 : difficulty === 'normal' ? 2 : difficulty === 'easy' ? 1.5 : 1;
    const totalDuration = duration === 'veryLong' ? 300 : duration === 'long' ? 240 : duration === 'normal' ? 180 : duration === 'short' ? 120 : 60;
    setTotalTime(totalDuration);

    // 动态调整阶段切换概率，基于难度和意愿
    const stopProbability = difficulty === 'impossible' ? 0.2 : difficulty === 'hard' ? 0.15 : 0.1;
    const finishProbability = desire === 'begging' ? 0.1 : desire === 'want' ? 0.07 : 0.05;

    let timer;
    try {
      if (phase === 'warmup') {
        setPhaseFeedback('热身阶段：准备好，慢慢来！');
        timer = setInterval(() => {
          setProgressEdge(prev => {
            if (prev >= 100) {
              setPhase('go');
              const newMsg = messages.go[Math.floor(Math.random() * messages.go.length)];
              setMessage(newMsg);
              setTimeLeft(newMsg[1]);
              setBackground('bg-green-500');
              setPhaseFeedback('进入节奏：现在可以加速了！');
              return 0;
            }
            // 随机波动：增加不可预测性
            const fluctuation = Math.random() * 0.5 - 0.25;
            return Math.min(prev + baseSpeed + fluctuation, 100);
          });
          setTotalTime(prev => Math.max(prev - 1, 0));
        }, 1000);
      } else if (phase === 'go') {
        timer = setInterval(() => {
          setProgressEdge(prev => {
            const newProgress = Math.min(prev + baseSpeed * 1.5, 100);
            if (newProgress >= 80 && Math.random() < stopProbability) {
              setPhase('stop');
              const newMsg = messages.stop[Math.floor(Math.random() * messages.stop.length)];
              setMessage(newMsg);
              setTimeLeft(newMsg[1]);
              setBackground('bg-red-500');
              setPhaseFeedback(['暂停一下：冷静，控制住！', '停下！别让我失望哦！', '冷静一下，别急！'][Math.floor(Math.random() * 3)]);
            }
            if (newProgress >= 100 && Math.random() < finishProbability) {
              setPhase('finish');
              const finishMsg = messages.finish[Math.floor(Math.random() * messages.finish.length)];
              setMessage(finishMsg);
              setTimeLeft(finishMsg[1]);
              setBackground(finishMsg[2] === 'green' ? 'bg-green-300' : 'bg-red-300');
              setPhaseFeedback(finishMsg[2] === 'green' ? ['高潮时刻：尽情释放吧！', '终于到了：射吧，宝贝！', '现在！尽情享受吧！'][Math.floor(Math.random() * 3)] : ['遗憾：这次不行，再试试吧！', '抱歉：这次没机会了！', '不行：忍住，下次再来！'][Math.floor(Math.random() * 3)]);
              setProgressCum(0);
            }
            // 随机波动：增加不可预测性
            const fluctuation = Math.random() * 0.8 - 0.4;
            return Math.min(newProgress + fluctuation, 100);
          });
          setTotalTime(prev => Math.max(prev - 1, 0));
        }, 1000);
      } else if (phase === 'stop') {
        timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setPhase('go');
              const newMsg = messages.go[Math.floor(Math.random() * messages.go.length)];
              setMessage(newMsg);
              setTimeLeft(newMsg[1]);
              setBackground('bg-green-500');
              setPhaseFeedback(['继续：别停下，节奏回来！', '再来：继续努力吧！', '加速：现在可以继续了！'][Math.floor(Math.random() * 3)]);
              return 0;
            }
            return prev - 1;
          });
          setTotalTime(prev => Math.max(prev - 1, 0));
        }, 1000);
      } else if (phase === 'finish') {
        timer = setInterval(() => {
          setProgressCum(prev => {
            const speed = message[3] || 2;
            return Math.min(prev + speed * 2, 100);
          });
          setTimeLeft(prev => {
            if (prev <= 1) {
              setPhase('end');
              return 0;
            }
            return prev - 1;
          });
          setTotalTime(prev => Math.max(prev - 1, 0));
        }, 1000);
      } else if (phase === 'end') {
        timer = setInterval(() => {
          setTotalTime(prev => {
            if (prev <= 1 && !isNavigating) {
              setIsNavigating(true);
              window.location.href = '/';
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('游戏逻辑错误:', error);
    }
    return () => clearInterval(timer);
  }, [phase, difficulty, duration, desire, message, isNavigating, isPaused]);

  /**
   * 处理暂停游戏逻辑（模拟功能，实际可绑定用户交互）
   */
  const togglePause = () => {
    setIsPaused(prev => {
      const newPaused = !prev;
      if (newPaused) {
        setPhaseFeedback('游戏暂停：休息一下吧！');
      } else {
        setPhaseFeedback('游戏继续：准备好再战！');
      }
      return newPaused;
    });
  };

  // 动画变体 - 容器渐入效果
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // 动画变体 - 提示文字淡入淡出效果
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // 动画变体 - 阶段反馈滑入效果
  const feedbackVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  // 动态背景色类 - 使用渐变增强视觉效果
  const backgroundClass = {
    'bg-black': 'bg-gradient-to-br from-black to-gray-800',
    'bg-green-500': 'bg-gradient-to-br from-green-500 to-green-700',
    'bg-red-500': 'bg-gradient-to-br from-red-500 to-red-700',
    'bg-green-300': 'bg-gradient-to-br from-green-300 to-green-500',
    'bg-red-300': 'bg-gradient-to-br from-red-300 to-red-500',
  }[background] || 'bg-gradient-to-br from-black to-gray-800';

  return (
    <motion.div
      className={`min-h-screen ${backgroundClass} flex flex-col items-center justify-center p-6 sm:p-4 transition-colors duration-500`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 错误提示 - 渐入动画 */}
      {error && (
        <motion.div
          className="mb-6 p-3 bg-red-600 text-white rounded-lg border border-red-400 shadow-md sm:text-sm sm:mb-4 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
        >
          {error}
        </motion.div>
      )}
      {/* 阶段反馈提示 - 滑入动画 */}
      {phaseFeedback && (
        <motion.div
          className="mb-4 p-2 bg-opacity-30 bg-black text-white rounded-lg italic sm:text-sm sm:mb-2 max-w-2xl"
          key={phaseFeedback} // 确保每次内容变化时重新触发动画
          variants={feedbackVariants}
          initial="hidden"
          animate="visible"
        >
          {phaseFeedback}
        </motion.div>
      )}
      {/* 剩余时间显示 - 简洁样式 */}
      <p className="text-white text-lg mb-4 sm:text-base sm:mb-2">剩余时间: {totalTime} 秒</p>
      {/* 提示文字 - 淡入淡出动画 */}
      <motion.p
        dangerouslySetInnerHTML={{ __html: message[0] }}
        className="text-white text-2xl text-center mb-8 max-w-3xl sm:text-lg sm:mb-6 px-2"
        key={message[0]} // 确保每次内容变化时重新触发动画
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      />
      {/* 进度条 - 动态宽度，触摸优化 */}
      <div className="w-3/4 max-w-2xl sm:w-11/12 touch-manipulation">
        <ProgressBar edge={progressEdge} cum={progressCum} />
      </div>
      {/* 暂停按钮 - 模拟功能，实际可绑定用户交互 */}
      <button
        onClick={togglePause}
        className="mt-6 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg sm:text-sm sm:mt-4 transition-colors duration-200"
      >
        {isPaused ? '继续游戏' : '暂停游戏'}
      </button>
    </motion.div>
  );
};

export default GameScreen;