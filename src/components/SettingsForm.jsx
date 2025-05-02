import { useState } from 'react';
import { motion } from 'framer-motion';

const STAGGER_DELAY = 0.15;

// 难度选项配置
const difficulties = [
  { id: 'easy', label: '超级早泄废物', desc: '时间延长50%', color: 'from-green-500 to-emerald-600' },
  { id: 'medium', label: '普通贱狗', desc: '标准挑战', color: 'from-yellow-500 to-amber-600' },
  { id: 'hard', label: '极品贱狗', desc: '时间缩短30%', color: 'from-red-500 to-rose-600' }
];

// 主人角色配置
const ownerRoles = {
  strict: { label: '严厉型主人', emoji: '👿' },
  gentle: { label: '温柔型主人', emoji: '😇' },
  teasing: { label: '戏谑型主人', emoji: '😈' }
};

export default function SettingsForm({ onSettingsChange }) {
  const [formData, setFormData] = useState({
    duration: 5,
    difficulty: 'medium',
    role: 'strict',
    desire: 'yes',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSettingsChange(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-md mx-auto"
    >
      {/* 时长设置 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: STAGGER_DELAY * 2 }}
      >
        <label className="block">
          <span className="text-lg font-medium text-gray-300">挑战时长 (2-60分钟)</span>
          <div className="relative mt-2">
            <input
              type="number"
              name="duration"
              min="2"
              max="60"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-gray-800/70 border border-gray-600 rounded-xl py-4 px-4 text-white 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        hover:bg-gray-800 transition-all"
              required
              aria-label="设置挑战时长"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">分钟</span>
          </div>
        </label>
      </motion.div>

      {/* 难度选择 */}
      <motion.fieldset 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: STAGGER_DELAY * 3 }}
        className="space-y-3"
      >
        <legend className="text-lg font-medium text-gray-300 mb-4">选择下贱程度</legend>
        {difficulties.map((diff, index) => (
          <div
            key={diff.id}
            className={`relative overflow-hidden rounded-xl border-2 transition-all
              ${formData.difficulty === diff.id 
                ? 'border-emerald-500 bg-gradient-to-r ' + diff.color 
                : 'border-gray-700 hover:border-gray-500'}`}
          >
            <label className="flex items-center p-4 cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value={diff.id}
                checked={formData.difficulty === diff.id}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`flex-1 ${formData.difficulty === diff.id ? 'text-white' : 'text-gray-300'}`}>
                <div className="text-lg font-medium">{diff.label}</div>
                <div className="text-sm opacity-80 mt-1">{diff.desc}</div>
              </div>
              {formData.difficulty === diff.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center ml-4"
                >
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </motion.div>
              )}
            </label>
          </div>
        ))}
      </motion.fieldset>

      {/* 主人类型选择 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: STAGGER_DELAY * 4 }}
      >
        <label className="block">
          <span className="text-lg font-medium text-gray-300 mb-2">选择主人类型</span>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(ownerRoles).map(([key, role], index) => (
              <div
                key={key}
                onClick={() => setFormData(p => ({ ...p, role: key }))}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${formData.role === key 
                    ? 'border-emerald-500 bg-gradient-to-b from-emerald-500/10 to-transparent'
                    : 'border-gray-700 hover:border-gray-500'}`}
              >
                <div className="text-2xl mb-1">{role.emoji}</div>
                <div className={`text-sm ${formData.role === key ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {role.label}
                </div>
              </div>
            ))}
          </div>
        </label>
      </motion.div>

      {/* 控制欲望选择 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: STAGGER_DELAY * 5 }}
      >
        <label className="block">
          <span className="text-lg font-medium text-gray-300">控制欲望</span>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div
              onClick={() => setFormData(p => ({ ...p, desire: 'yes' }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                ${formData.desire === 'yes' 
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700 hover:border-gray-500'}`}
            >
              <div className={`text-center ${formData.desire === 'yes' ? 'text-emerald-400' : 'text-gray-400'}`}>
                是的，贱狗想要被控制
              </div>
            </div>
            <div
              onClick={() => setFormData(p => ({ ...p, desire: 'no' }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                ${formData.desire === 'no' 
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700 hover:border-gray-500'}`}
            >
              <div className={`text-center ${formData.desire === 'no' ? 'text-emerald-400' : 'text-gray-400'}`}>
                只是尝试
              </div>
            </div>
          </div>
        </label>
      </motion.div>

      {/* 提交按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: STAGGER_DELAY * 6 }}
      >
        <button
          type="submit"
          className="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 to-green-600 
                    text-white font-bold rounded-xl shadow-lg transform transition-all duration-300
                    hover:scale-[1.02] hover:shadow-emerald-500/20 active:scale-95
                    flex items-center justify-center gap-2"
          aria-label="确认设置并开始游戏"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5" 
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          开启调教之旅
        </button>
      </motion.div>
    </motion.form>
  );
}