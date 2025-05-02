/**
 * 保存玩家进度到本地存储
 * @param {Object} data - 玩家进度数据
 */
export const savePlayerProgress = (data) => {
  try {
    localStorage.setItem('playerProgress', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存玩家进度失败:', error);
    return false;
  }
};

/**
 * 获取玩家进度数据
 * @returns {Object} 玩家进度数据
 */
export const getPlayerProgress = () => {
  try {
    const progress = localStorage.getItem('playerProgress');
    return progress ? JSON.parse(progress) : { level: 1, titles: [], completedGames: 0 };
  } catch (error) {
    console.error('读取玩家进度失败:', error);
    return { level: 1, titles: [], completedGames: 0 };
  }
};

/**
 * 清除玩家进度数据
 * @returns {boolean} 是否成功清除
 */
export const clearPlayerProgress = () => {
  try {
    localStorage.removeItem('playerProgress');
    return true;
  } catch (error) {
    console.error('清除玩家进度失败:', error);
    return false;
  }
};

/**
 * 更新玩家称号
 * @param {string} title - 新称号
 * @returns {boolean} 是否成功更新
 */
export const addPlayerTitle = (title) => {
  try {
    const progress = getPlayerProgress();
    if (!progress.titles.includes(title)) {
      progress.titles.push(title);
      savePlayerProgress(progress);
    }
    return true;
  } catch (error) {
    console.error('添加玩家称号失败:', error);
    return false;
  }
};