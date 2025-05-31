/**
 * 时间工具函数
 * 提供时间格式化等公共功能
 */

/**
 * 格式化时间显示为相对时间
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return new Date(timestamp).toLocaleDateString();
};

/**
 * 格式化完整日期时间
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 完整的日期时间字符串
 */
export const formatFullDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * 格式化日期（不包含时间）
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 日期字符串
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * 检查是否为今天
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {boolean} 是否为今天
 */
export const isToday = (timestamp) => {
  const today = new Date();
  const date = new Date(timestamp);
  return today.toDateString() === date.toDateString();
};

/**
 * 检查是否为本周
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {boolean} 是否为本周
 */
export const isThisWeek = (timestamp) => {
  const now = Date.now();
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
  return timestamp >= weekAgo;
}; 