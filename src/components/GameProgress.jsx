import React, { useState, useEffect, useCallback, useRef } from 'react';

const GameProgress = ({ phase, onComplete, resetTrigger, difficulty = 'normal' }) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [disruption, setDisruption] = useState(null);
  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);
  
  // 难度配置
  const difficultyConfig = {
    easy: { disruptionChance: 0.03, speedMultiplier: 0.8 },
    normal: { disruptionChance: 0.05, speedMultiplier: 1 },
    hard: { disruptionChance: 0.08, speedMultiplier: 1.2 }
  };

  // 动态阶段配置
  const phaseConfig = {
    first: { baseSpeed: 1, color: 'from-green-500 to-lime-300', dangerZone: 75, scoreMultiplier: 1 },
    middle: { baseSpeed: 1.5, color: 'from-amber-400 to-orange-400', dangerZone: 60, scoreMultiplier: 2 },
    final: { baseSpeed: 2, color: 'from-red-600 to-pink-400', dangerZone: 45, scoreMultiplier: 3 }
  };

  // 进度边界提醒动画控制
  useEffect(() => {
    const dangerThreshold = phaseConfig[phase].dangerZone;
    if (progress > dangerThreshold && progress < dangerThreshold + 3) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 1000);
    }
    // 阶段完成时更新积分
    if (progress >= 100) {
      setScore(prev => prev + 100 * phaseConfig[phase].scoreMultiplier);
    }
  }, [progress, phase]);

  // 新增玩法：随机干扰事件
  const triggerDisruption = useCallback(() => {
    const chance = Math.random();
    const disruptionChance = difficultyConfig[difficulty].disruptionChance;
    if (chance < disruptionChance && phase !== 'final') {
      const type = Math.random() < 0.5 ? 'speedUp' : 'slowDown';
      setDisruption({
        type,
        message: type === 'speedUp' ? '⚡ 突然加速！' : '🐢 速度减缓！',
        duration: 3000,
        speedModifier: type === 'speedUp' ? 1.5 : 0.7
      });
      setTimeout(() => setDisruption(null), 3000);
    }
  }, [phase, difficulty]);

  // 重置和进度更新逻辑（平滑过渡）
  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPaused) return;

    const baseSpeed = phaseConfig[phase].baseSpeed * difficultyConfig[difficulty].speedMultiplier;
    const speed = disruption ? baseSpeed * disruption.speedModifier : baseSpeed;
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onComplete(phase);
          return 0;
        }
        return prev + (speed / 10);
      });
      triggerDisruption();
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [phase, resetTrigger, isPaused, disruption, onComplete, triggerDisruption, difficulty]);

  // 优化暂停切换函数
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // 进度条动态样式
  const gradientStyle = `bg-gradient-to-r ${phaseConfig[phase].color}`;
  const dangerClass = progress >= phaseConfig[phase].dangerZone 
    ? 'animate-pulse-shadow animate-flicker bg-red-600/80 backdrop-blur-sm' 
    : 'animate-heartbeat bg-emerald-600/80 backdrop-blur-sm';

  // 新增玩法：速度变化提示
  const SpeedIndicator = () => (
    <div className="absolute -top-8 right-0 text-xs font-bold animate-bounce text-white">
      ⚡ {(disruption ? phaseConfig[phase].baseSpeed * disruption.speedModifier : phaseConfig[phase].baseSpeed).toFixed(1)}x
    </div>
  );

  // 干扰提示
  const DisruptionAlert = () => disruption && (
    <div className="absolute -top-8 left-0 text-xs font-bold text-yellow-300 animate-fade-in-out">
      {disruption.message}
    </div>
  );

  return (
    <div className="w-full md:w-4/5 lg:w-3/4 mx-auto space-y-4 transition-all duration-500 mt-6">
      {/* 阶段状态条 */}
      <div className="flex h-3 bg-gray-800 rounded-full overflow-hidden shadow-lg relative">
        <div 
          className={`${gradientStyle} transition-all duration-200`}
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-0 h-full border-l-2 border-dashed border-white opacity-50"
          style={{ left: `${phaseConfig[phase].dangerZone}%` }}
        />
      </div>

      {/* 动态指示区 */}
      <div className="relative text-center">
        <div className={`text-sm font-bold ${shouldShake ? 'animate-shake' : ''}`}>
          <div className={`inline-block px-4 py-2 rounded-full text-white ${dangerClass}`}>
            {progress >= phaseConfig[phase].dangerZone ? '危机区' : '安全区'}
            <SpeedIndicator />
            <DisruptionAlert />
          </div>
        </div>

        {/* 暂停按钮 */}
        <button
          onClick={togglePause}
          className="mt-4 px-6 py-2 bg-opacity-80 backdrop-blur-sm 
                     hover:scale-105 active:scale-95 transition-all
                     bg-gray-800 text-white rounded-xl shadow-lg
                     hover:shadow-red-500/50 w-full md:w-auto"
        >
          {isPaused ? (
            <>
              <span className="animate-pulse">▶️</span> 继续挑战
            </>
          ) : (
            <>
              ⏸️ 暂停挑战
            </>
          )}
        </button>
      </div>

      {/* 新增玩法：积分显示 */}
      <div className="text-center text-xs text-gray-400 animate-fade-in">
        当前积分: <span className="text-yellow-400 font-bold">{score}</span>
      </div>
    </div>
  );
};

export default GameProgress;