import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const SocialShare = ({ score, titles = [], difficulty }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const shareBaseText = `🔥我在控射小游戏挑战中：\n🎯得分 ${score} | 🎚难度：${
    difficulty === 'easy' ? '超级废物' 
    : difficulty === 'medium' ? '普通贱狗' 
    : '极品贱狗'
  }${titles?.length ? `\n🏅称号：${titles.join('+')}` : ''}`;

  const handleShare = (platform) => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    const text = encodeURIComponent(shareBaseText);
    
    const shareConfig = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=控射小游戏`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
      clipboard: async () => {
        try {
          await navigator.clipboard.writeText(`${shareBaseText}\n\n🔗${window.location.href}`);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch {
          alert('复制失败，请手动复制');
        }
      }
    };

    platform === 'clipboard' ? shareConfig.clipboard() : window.open(shareConfig[platform], '_blank');
  };

  const ShareButton = ({ platform, icon, label, colorClass }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleShare(platform)}
      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl transition-all ${colorClass} hover:shadow-xl min-h-[52px]`}
      aria-label={`分享到${label}`}
    >
      <span className="text-2xl" role="img" aria-hidden="true">{icon}</span>
      <span className="text-sm font-medium hidden xs:inline">{label}</span>
    </motion.button>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-black/80 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 shadow-2xl"
      aria-labelledby="socialShareHeading"
    >
      <div className="text-center mb-8">
        <h2 id="socialShareHeading" className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
          🏆 成就达成！
        </h2>
        <p className="text-gray-400 text-sm">分享你的战绩到社交网络</p>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ShareButton 
          platform="twitter" 
          icon="🐦" 
          label="Twitter"
          colorClass="bg-[#1DA1F2] hover:bg-[#1991db]"
        />
        <ShareButton
          platform="whatsapp"
          icon="📱"
          label="WhatsApp"
          colorClass="bg-[#25D366] hover:bg-[#1EBEA5]"
        />
        <ShareButton
          platform="clipboard"
          icon="📋"
          label="复制链接"
          colorClass="bg-gray-700 hover:bg-gray-600"
        />
      </motion.div>

      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30 text-center"
          >
            <span className="text-emerald-400 text-sm">✅ 已复制到剪贴板</span>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-gray-500 text-xs text-center" aria-live="polite">
        *分享数据为匿名信息，不含用户识别内容
      </p>
    </motion.section>
  );
};

// PropTypes 和 defaultProps
SocialShare.propTypes = {
  score: PropTypes.number.isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired
};

SocialShare.defaultProps = {
  titles: []
};

export default React.memo(SocialShare);