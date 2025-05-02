import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Game from './Game.jsx';
import SettingsForm from './SettingsForm.jsx';
import SocialShare from './SocialShare.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function GameContainer() {
  const [gameState, setGameState] = useState({
    started: false,
    ended: false,
    settings: null,
    score: 0
  });

  const handleSettingsSubmit = (formData) => {
    setGameState(prev => ({
      ...prev,
      started: true,
      settings: formData
    }));
  };

  const handleGameEnd = (score) => {
    setGameState(prev => ({
      ...prev,
      ended: true,
      score: score || 0
    }));
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-gray-900 to-black/90 p-4 md:p-8 rounded-2xl shadow-2xl 
                border border-gray-700/50 backdrop-blur-sm mx-4 max-w-2xl w-full"
    >
      <AnimatePresence mode="wait">
        {!gameState.started ? (
          <motion.div
            key="settings"
            variants={childVariants}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text 
                        bg-gradient-to-r from-green-400 to-emerald-500 mb-6"
            >
              🎮 设置你的挑战
            </motion.h2>
            <SettingsForm onSettingsChange={handleSettingsSubmit} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            variants={childVariants}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <ErrorBoundary>
              <Game 
                settings={gameState.settings} 
                onGameEnd={handleGameEnd}
              />
            </ErrorBoundary>

            <AnimatePresence>
              {gameState.ended && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
                >
                  <SocialShare 
                  difficulty={gameState.settings?.difficulty} 
                  score={gameState.score}
                  titles={[]} // 确保传递空数组，如果有称号数据则传递实际数据
                />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}