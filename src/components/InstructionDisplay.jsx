import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InstructionDisplay = ({ instruction, duration, onTimeout, onComboUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [feedback, setFeedback] = useState('');
  const [comboCount, setComboCount] = useState(0);
  const [progress, setProgress] = useState(100);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const intervalRef = useRef(null);

  // 动态样式配置
  const styleConfig = {
    danger: { 
      bg: 'bg-gradient-to-br from-red-600 to-pink-500',
      text: 'text-white',
      ring: 'ring-red-500/30',
      timer: 'text-red-400',
      pulse: 'animate-pulse-danger'
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-400',
      text: 'text-amber-100',
      ring: 'ring-amber-500/30',
      timer: 'text-amber-400',
      pulse: 'animate-pulse-warning'
    },
    normal: {
      bg: 'bg-gradient-to-br from-emerald-600 to-cyan-400',
      text: 'text-gray-100',
      ring: 'ring-emerald-500/30',
      timer: 'text-emerald-400',
      pulse: 'animate-pulse-normal'
    }
  };

  // 指令紧急等级判断
  const urgencyLevel = useMemo(() => {
    if (instruction.includes('射')) return 'danger';
    if (instruction.includes('挑战') || instruction.includes('加速')) return 'warning';
    return 'normal';
  }, [instruction]);

  // 新增玩法：连击倍率加成
  const handleTimeoutResult = (success) => {
    if (success) {
      setComboCount(prev => {
        const newCount = prev + 1;
        const bonusMultiplier = Math.floor(newCount / 5) + 1;
        if (onComboUpdate) onComboUpdate(newCount, bonusMultiplier);
        return newCount;
      });
    } else {
      setComboCount(0);
      setFeedback('失败：未能在规定时间内完成！');
      setTimeout(() => setFeedback(''), 2000); // 2秒后自动消失
      if (onComboUpdate) onComboUpdate(0, 1);
    }
    onTimeout(success);
  };

  // 新增玩法：手动确认指令完成
  const handleConfirm = () => {
    if (!isConfirmed) {
      setIsConfirmed(true);
      handleTimeoutResult(true);
      setTimeLeft(0);
    }
  };

  useEffect(() => {
    setTimeLeft(duration);
    setFeedback('');
    setProgress(100);
    setIsConfirmed(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const totalTicks = duration * 10; // 每100ms更新一次
    const tickInterval = duration > 0 ? (duration * 1000) / totalTicks : 100;
    let tickCount = 0;

    intervalRef.current = setInterval(() => {
      tickCount++;
      setTimeLeft(prev => {
        const newTime = Math.max(0, duration - (tickCount / 10));
        setProgress((newTime / duration) * 100);
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          if (!isConfirmed) {
            const isSuccess = !instruction.includes('射');
            handleTimeoutResult(isSuccess);
          }
          return 0;
        }
        return Math.ceil(newTime);
      });
    }, tickInterval);

    return () => clearInterval(intervalRef.current);
  }, [instruction, duration, isConfirmed]);

  return (
    <div className="mx-4 md:mx-8 mt-6 md:mt-10 perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${instruction}-${duration}`}
          initial={{ opacity: 0, rotateX: 90, scale: 0.8 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          exit={{ opacity: 0, rotateX: -90, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`${styleConfig[urgencyLevel].bg} ${styleConfig[urgencyLevel].text} 
            rounded-2xl p-4 md:p-6 shadow-2xl ring-4 ${styleConfig[urgencyLevel].ring}
            transform-style-preserve-3d max-w-lg w-full ${urgencyLevel === 'danger' ? 'animate-shake' : ''} ${styleConfig[urgencyLevel].pulse}`}
          style={{ transform: urgencyLevel === 'warning' ? 'rotateY(5deg)' : 'rotateY(0deg)' }}
        >
          {/* 指令文本 */}
          <div className="space-y-4 text-center">
            <motion.div
              dangerouslySetInnerHTML={{ __html: instruction }}
              className={`text-xl md:text-3xl font-black ${styleConfig[urgencyLevel].text}
                drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] overflow-hidden text-ellipsis line-clamp-3`}
            />
            
            {/* 环形进度条 */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`${styleConfig[urgencyLevel].timer} transition-all duration-100`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${progress * 2.889} 289`} // 2πr ≈ 289
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center 
                ${styleConfig[urgencyLevel].timer} font-mono font-bold text-lg md:text-xl`}>
                {timeLeft}
              </div>
            </div>

            {/* 连击计数 */}
            <AnimatePresence>
              {comboCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute bottom-2 right-2 flex items-center gap-1"
                >
                  <span className="text-amber-400 text-sm">连击</span>
                  <div className="px-2 py-1 bg-black/30 rounded-full text-amber-400 font-bold text-sm">
                    🔥 ×{comboCount} (+{Math.floor(comboCount / 5)}x)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 时间反馈和手动确认 */}
            <AnimatePresence>
              {timeLeft <= 5 && timeLeft > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-center text-lg md:text-xl font-bold text-red-400"
                >
                  ⚠️ 最后{timeLeft}秒！
                </motion.div>
              )}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-center text-lg md:text-xl font-bold text-red-400"
                >
                  {feedback}
                </motion.div>
              )}
              {instruction.includes('射') && timeLeft > 0 && !isConfirmed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="mt-4 px-6 py-2 bg-white/20 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/50 w-full md:w-auto"
                >
                  确认完成
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InstructionDisplay;