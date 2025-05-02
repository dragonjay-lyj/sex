import { useState, useEffect } from 'react';
import { savePlayerProgress, getPlayerProgress } from '../utils/storage';
import ProgressBar from './ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';

// 常量集中管理
const PHASE_TRANSITION_DURATION = 300;
const PHASES = ['first', 'go', 'stop', 'finish'];

const ownerRoles = {
  strict: {
    name: "严厉主人",
    messages: {
      first: [["任务开始！<br />贱狗可以开始手淫了，尽量接近极限。", 45, 2]],
      go: [
        ["贱狗，马上撸，敢慢就惩罚你！", 15, 4],
        ["立刻用最快的速度撸管", 10, 4],
        ["撸到底，加速", 10, 4],
      ],
      stop: [
        ["停！不许碰，贱狗没资格！", 20, "red", 2],
        ["贱狗无权排精！把手拿开", 25, "red", 2],
      ],
      finish: [
        ["射！贱狗只有5秒，否则憋死你！", 5, "green", 4],
        ["射！马上射出来", 15, "green", 4],
        ["停！不好意思，这次没安排贱狗排精。", 45, "red", 2],
      ],
    },
  },
  gentle: {
    name: "温柔主人",
    messages: {
      first: [["任务开始！<br />狗狗可以开始了，慢慢来哦。", 45, 2]],
      go: [
        ["狗狗，可以开始了，慢慢来哦~", 30, 2],
        ["加速一点，狗狗，主人看着呢。", 15, 3],
      ],
      stop: [
        ["停一下，休息会儿，乖狗狗。", 25, "red", 2],
        ["休息一下，狗狗，别太累。", 20, "red", 2],
      ],
      finish: [
        ["可以射了，狗狗，放松吧~", 10, "green", 3],
        ["停，狗狗，今天不许射哦。", 30, "red", 2],
      ],
    },
  },
  teasing: {
    name: "戏谑主人",
    messages: {
      first: [["任务开始！<br />贱狗，撸吧，看你能坚持多久！", 45, 2]],
      go: [
        ["哈哈，贱狗，撸吧，看你能坚持多久！", 20, 3],
        ["快点，贱狗，别让主人等！", 15, 4],
      ],
      stop: [
        ["停！贱狗，想射？没门！", 15, "red", 2],
        ["停下，贱狗，主人还没玩够呢！", 20, "red", 2],
      ],
      finish: [
        ["射吧，贱狗，给你个小奖励，哈哈！", 8, "green", 3],
        ["停！贱狗，今天不许射，憋着吧！", 30, "red", 2],
      ],
    },
  },
};

const difficultyLevels = {
  easy: { name: "超级早泄废物", timeMultiplier: 1.5 },
  medium: { name: "普通贱狗", timeMultiplier: 1.0 },
  hard: { name: "极品贱狗", timeMultiplier: 0.7 },
};

const statusConfig = {
  'bg-green-800': { label: '可以自慰', icon: '✅', color: 'from-green-500 to-emerald-600' },
  'bg-red-800': { label: '停止', icon: '❎', color: 'from-red-500 to-rose-700' },
  'bg-green-500': { label: '可以射精', icon: '🎉', color: 'from-yellow-400 to-orange-500' }
};

export default function Game({ settings, onGameEnd }) {
  const [phase, setPhase] = useState('initial');
  const [currentMessage, setCurrentMessage] = useState('');
  const [bgColorClass, setBgColorClass] = useState('bg-black');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [gameResult, setGameResult] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const playerProgress = getPlayerProgress();
    // 加载玩家进度和成就
  }, []);

  useEffect(() => {
    if (isRunning && currentMessage) {
      const duration = getAdjustedTime(settings.difficulty, currentMessage.split(',').map(Number)[1] || 30);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setIsRunning(false);
            nextPhase();
            return 0;
          }
          return p + (100 / duration);
        });
        // 每秒增加分数，模拟游戏进展
        setScore((s) => s + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, currentMessage, settings.difficulty]);

  const getAdjustedTime = (difficulty, baseTime) => {
    return baseTime * difficultyLevels[difficulty].timeMultiplier;
  };

  const updateBackground = (phaseType) => {
    const colors = {
      go: 'bg-green-800',
      stop: 'bg-red-800',
      finish: bgColorClass.includes('green') ? 'bg-green-500' : 'bg-red-800',
    };
    setBgColorClass(colors[phaseType] || 'bg-black');
  };

  const startGame = () => {
    setPhase('first');
    setIsRunning(true);
    handlePhase('first');
  };

  const handlePhase = (phaseType) => {
    updateBackground(phaseType);
    const messages = ownerRoles[settings.role].messages[phaseType];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage[0]);
    setCurrentInstruction(randomMessage[0].split('，')[0]);
  };

  const handlePhaseTransition = (nextPhase) => {
    setIsRunning(false);
    setAnimationKey(prev => prev + 1);
    setTimeout(() => {
      setPhase(nextPhase);
      handlePhase(nextPhase);
      setIsRunning(true);
    }, PHASE_TRANSITION_DURATION);
  };

  const nextPhase = () => {
    const currentIndex = PHASES.indexOf(phase);
    if (currentIndex < PHASES.length - 1) {
      handlePhaseTransition(PHASES[currentIndex + 1]);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setPhase('end');
    const result = currentMessage.includes("射") ? "狗东西真乖，射得很棒！" : "贱狗没有被允许射精，再来一次吧！";
    setGameResult(result);
    savePlayerProgress({ completed: true, result });
  };

useEffect(() => {
  if (phase === 'end' && typeof onGameEnd === 'function') {
    onGameEnd(score);
  }
}, [phase, score, onGameEnd]);

  const StatusIndicator = () => {
    const config = statusConfig[bgColorClass] || {};
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center p-3 rounded-lg bg-gradient-to-r ${config.color || 'from-gray-500 to-gray-700'} shadow-lg`}
      >
        <span className="text-xl">{config.icon || '❓'}</span>
        <span className="ml-2 font-bold text-white">{config.label || '未知状态'}</span>
      </motion.div>
    );
  };

  return (
    <div className={`${bgColorClass} min-h-screen p-4 transition-all duration-500`}>
      <div role="region" aria-live="polite" className="max-w-2xl mx-auto text-center">
        <AnimatePresence mode="wait">
          {phase === 'initial' && (
            <motion.div
              key="initial"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-8"
            >
              <button
                onClick={startGame}
                className="text-lg md:text-xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
                aria-label="开始游戏"
              >
                🐾 开始挑战
              </button>
            </motion.div>
          )}

          {phase !== 'initial' && phase !== 'end' && (
            <motion.div
              key={animationKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 md:space-y-8 mt-8 md:mt-12"
            >
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white px-4 py-6 md:py-8 bg-black/30 rounded-xl backdrop-blur-sm shadow-lg"
                role="status"
                aria-label={`当前状态：${currentMessage.includes("射") ? "可以射精" : currentMessage.includes("停") ? "停止" : "可以自慰"}`}
                tabIndex={0}
                dangerouslySetInnerHTML={{ __html: currentMessage }}
              />

              <div className="flex justify-center">
                <StatusIndicator />
              </div>

              <ProgressBar 
                progress={progress} 
                currentInstruction={currentInstruction}
                className="animate-progress-glow"
              />
            </motion.div>
          )}

          {phase === 'end' && (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 p-6 md:p-8 rounded-2xl backdrop-blur-lg shadow-xl mt-8 md:mt-12"
            >
              <div 
                className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"
                dangerouslySetInnerHTML={{ __html: gameResult }}
              />
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
              >
                🔄 再来一次
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}