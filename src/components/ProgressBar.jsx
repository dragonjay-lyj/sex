import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, currentInstruction }) => {
  const gradientColors = [
    '#f6e05e', // yellow
    '#f59e0b', // orange
    '#ef4444'  // red
  ];

  return (
    <div className="relative w-full my-4 md:my-6 max-w-lg mx-auto group">
      {/* 进度条容器 */}
      <div 
        className="relative h-6 md:h-7 bg-gray-700 rounded-full overflow-hidden shadow-inner-xl"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {/* 进度填充部分 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            type: 'spring',
            stiffness: 60,
            damping: 15,
            duration: 0.8
          }}
          className="relative h-full rounded-full transition-all duration-500 ease-out"
          style={{
            background: `linear-gradient(90deg, ${gradientColors.join(', ')})`,
            boxShadow: '0 0 15px rgba(245,158,11,0.3)'
          }}
        >
          {/* 当前指令文字 */}
          <motion.span
            key={currentInstruction}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black 
                     text-xs md:text-sm font-bold whitespace-nowrap px-2 py-1 rounded-md
                     backdrop-blur-sm bg-white/30 shadow-sm"
          >
            {currentInstruction}
          </motion.span>
        </motion.div>

        {/* 光晕效果 */}
        {progress >= 85 && (
          <div className="absolute inset-0 animate-pulse-glow bg-amber-400/20 rounded-full" />
        )}
      </div>

      {/* 区域指示标签 */}
      <div className="flex justify-between px-1 mt-3 text-gray-300 text-sm">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-amber-400 rounded-full mr-1" />
          <span className="hidden xs:inline-block">边缘区</span>
        </div>
        <div className="flex items-center">
          <span className="hidden xs:inline-block">射精区</span>
          <div className="w-2 h-2 bg-red-500 rounded-full ml-1" />
        </div>
      </div>

      {/* 当前指针箭头 */}
      <div 
        className="absolute top-full mt-1 h-3 w-px bg-gradient-to-b from-amber-400/80 to-transparent"
        style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  currentInstruction: PropTypes.string.isRequired,
};

export default ProgressBar;