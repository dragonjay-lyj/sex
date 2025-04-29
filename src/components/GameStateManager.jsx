import React, { useState, useEffect, useCallback } from 'react';
import GameProgress from './GameProgress';
import InstructionDisplay from './InstructionDisplay';
import { AnimatePresence, motion } from 'framer-motion';

const phases = [
  { id: 'first', name: '调教准备', color: 'from-emerald-500 to-cyan-400' },
  { id: 'middle', name: '欲望掌控', color: 'from-amber-500 to-orange-400' },
  { id: 'final', name: '终极释放', color: 'from-rose-600 to-pink-400' }
];

const instructions = {
  first: [
    ['<small>任务开始！<br />贱狗可以开始手淫了，试着当进度走满边缘区时达到极限。<br />当进度走到射精区时，贱狗应该准备好随时射出来。</small>', 45],
    ['现在可以开始撸你的狗鸡巴了', 30],
    ['撸管', 30],
    ['立刻开始撸管', 30]
  ],
  middle: [
    ['立刻用你最快的速度撸管', 15],
    ['慢下来，稳一下', 30],
    ['贱狗接近极限了吗', 20],
    ['贱狗想射吗', 20],
    ['自慰', 25],
    ['撸到底，加速', 10],
    ['停止触摸你的狗鸡巴！等待指令，准备下一轮', 20],
    ['双手抱头', 25],
    ['用手捏爆乳头', 25]
  ],
  final: [
    ['射！贱狗只有五秒钟，否则就憋着', 5],
    ['狗东西可以射了，快！', 10],
    ['贱狗想射吗', 20],
    ['射！马上射出来', 6],
    ['现在就射！让它成为你最爽的高潮', 25]
  ],
};

const achievements = {
  edgeMaster: { name: '边缘大师', icon: '👑', condition: '连续5次成功控制在边缘区', unlocked: false },
  speedDemon: { name: '速度恶魔', icon: '⚡', condition: '完成一次双倍速度挑战', unlocked: false },
  enduranceKing: { name: '耐力之王', icon: '🏋️', condition: '坚持超过5分钟', unlocked: false }
};

const GameStateManager = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(instructions.first[0][0]);
  const [duration, setDuration] = useState(instructions.first[0][1]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [edgeCount, setEdgeCount] = useState(0);
  const [achievementsState, setAchievementsState] = useState(achievements);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [showStageTransition, setShowStageTransition] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');

  const triggerStageTransition = useCallback(async () => {
    setShowStageTransition(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowStageTransition(false);
  }, []);

  const triggerAchievementNotification = useCallback((achievementId) => {
    setShowAchievement(achievementId);
    setTimeout(() => setShowAchievement(null), 3000);
  }, []);

  const handlePhaseComplete = useCallback(async (completedPhase) => {
    if (completedPhase === 'final') {
      setScore(prev => prev + 500);
      await triggerStageTransition();
      setGameOver(true);
    } else {
      await triggerStageTransition();
      setPhaseIndex(prev => prev + 1);
      setResetTrigger(prev => prev + 1);
      setScore(prev => prev + 200);
    }
  }, [triggerStageTransition]);

  const handleTimeout = useCallback((success) => {
    if (!success && phases[phaseIndex].id === 'final') {
      setGameOver(true);
    } else {
      if (success && !currentInstruction.includes('射') && !currentInstruction.includes('挑战')) {
        setEdgeCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5 && !achievementsState.edgeMaster.unlocked) {
            setAchievementsState(prevState => ({
              ...prevState,
              edgeMaster: { ...prevState.edgeMaster, unlocked: true }
            }));
            triggerAchievementNotification('edgeMaster');
          }
          return newCount;
        });
        setScore(prev => prev + 50);
      }
      if (success && currentInstruction.includes('挑战') && !achievementsState.speedDemon.unlocked) {
        setAchievementsState(prevState => ({
          ...prevState,
          speedDemon: { ...prevState.speedDemon, unlocked: true }
        }));
        triggerAchievementNotification('speedDemon');
        setScore(prev => prev + 100);
      }
      updateInstruction();
    }
    // 耐力成就检查
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // 转为分钟
    if (elapsedTime >= 5 && !achievementsState.enduranceKing.unlocked) {
      setAchievementsState(prevState => ({
        ...prevState,
        enduranceKing: { ...prevState.enduranceKing, unlocked: true }
      }));
      triggerAchievementNotification('enduranceKing');
      setScore(prev => prev + 300);
    }
  }, [phaseIndex, currentInstruction, achievementsState, startTime, triggerAchievementNotification]);

  const updateInstruction = useCallback(() => {
    const currentPhase = phases[phaseIndex].id;
    const instructionSet = instructions[currentPhase];
    const randomIndex = Math.floor(Math.random() * instructionSet.length);
    setCurrentInstruction(instructionSet[randomIndex][0]);
    setDuration(instructionSet[randomIndex][1]);

    const randomEventChance = Math.random();
    if (randomEventChance < 0.2 && currentPhase !== 'final') {
      const specialChallenges = [
        ['随机事件：双倍速度挑战！5秒内加速！', 5],
        ['随机事件：交替快慢速！10秒内完成3次切换！', 10],
        ['随机事件：停止触摸！保持5秒不动！', 5]
      ];
      const challengeIndex = Math.floor(Math.random() * specialChallenges.length);
      setCurrentInstruction(specialChallenges[challengeIndex][0]);
      setDuration(specialChallenges[challengeIndex][1]);
    }
  }, [phaseIndex]);

  useEffect(() => {
    updateInstruction();
  }, [phaseIndex, updateInstruction]);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // 新增玩法：连击计数器
  const ComboCounter = () => (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: edgeCount > 0 ? 1 : 0 }}
      className="absolute top-4 right-4 bg-black/50 p-3 rounded-full backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <span className="text-rose-400 text-xl">🔥</span>
        <span className="text-white font-bold">{edgeCount}连击</span>
        <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-500"
            style={{ width: `${(edgeCount % 5) * 20}%` }}
          />
        </div>
      </div>
    </motion.div>
  );

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900/95 backdrop-blur-2xl flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-rose-400 mb-4">游戏结束</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-rose-100 text-lg">最终得分：</span>
              <span className="text-amber-400 font-bold text-2xl">{score}</span>
            </div>
            <div className="h-px bg-gray-700" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-rose-100">获得成就：</h3>
              {Object.values(achievementsState).map(ach => (
                <motion.div
                  key={ach.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${ach.unlocked ? 'bg-gray-800/50 text-green-400' : 'bg-gray-800/30 text-gray-500'}`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <div className={ach.unlocked ? 'text-amber-400' : 'text-gray-400'}>{ach.name}</div>
                    <div className="text-xs text-gray-400">{ach.condition}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setPhaseIndex(0);
                setGameOver(false);
                setResetTrigger(prev => prev + 1);
                setEdgeCount(0);
                setScore(0);
                setStartTime(Date.now());
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl font-bold text-white shadow-lg hover:shadow-amber-500/50"
            >
              重新挑战 💪
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <AnimatePresence>
        {showStageTransition && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed inset-0 bg-gradient-to-br from-amber-400/20 to-rose-400/20 backdrop-blur-2xl z-50 flex items-center justify-center"
          >
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse">
              {phases[phaseIndex].name.toUpperCase()}
            </h2>
          </motion.div>
        )}
        {showAchievement && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-4 left-4 bg-black/80 p-4 rounded-lg backdrop-blur-sm z-50 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{achievementsState[showAchievement]?.icon}</span>
              <div>
                <div className="text-amber-400 font-bold text-lg">{achievementsState[showAchievement]?.name}</div>
                <div className="text-sm text-gray-400">{achievementsState[showAchievement]?.condition}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
            极限控射挑战
          </h1>
          <div className="mt-2 text-rose-100/80 font-medium text-sm md:text-base">
            当前阶段：<span className={`bg-gradient-to-r ${phases[phaseIndex].color} bg-clip-text text-transparent`}>{phases[phaseIndex].name}</span> | 得分：<span className="text-amber-400">{score}</span>
          </div>
        </motion.header>

        <GameProgress
          phase={phases[phaseIndex].id}
          onComplete={handlePhaseComplete}
          resetTrigger={resetTrigger}
          difficulty={difficulty}
        />

        <InstructionDisplay
          instruction={currentInstruction}
          duration={duration}
          onTimeout={handleTimeout}
        />

        <ComboCounter />

        {/* 难度选择（自定义选项） */}
        <div className="absolute top-4 left-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDifficulty('easy')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${difficulty === 'easy' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            简单
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDifficulty('normal')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${difficulty === 'normal' ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            普通
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDifficulty('hard')}
            className={`px-3 py-1 rounded-md text-xs font-medium ${difficulty === 'hard' ? 'bg-rose-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            困难
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GameStateManager;