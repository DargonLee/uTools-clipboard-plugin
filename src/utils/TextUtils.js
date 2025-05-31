/**
 * 文本工具函数
 * 提供文本处理等公共功能
 */

/**
 * 截断长文本，超出长度显示省略号
 * @param {string} text - 要截断的文本
 * @param {number} maxLength - 最大长度，默认 100
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 统计文本行数
 * @param {string} text - 文本内容
 * @returns {number} 行数
 */
export const countLines = (text) => {
  if (!text) return 0;
  return text.split('\n').length;
};

/**
 * 统计文本字符数
 * @param {string} text - 文本内容
 * @returns {number} 字符数
 */
export const countCharacters = (text) => {
  if (!text) return 0;
  return text.length;
};

/**
 * 统计文本单词数（适用于英文）
 * @param {string} text - 文本内容
 * @returns {number} 单词数
 */
export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * 检查文本是否为链接
 * @param {string} text - 文本内容
 * @returns {boolean} 是否为链接
 */
export const isLink = (text) => {
  if (!text) return false;
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(text.trim());
};

/**
 * 检查文本是否为邮箱
 * @param {string} text - 文本内容
 * @returns {boolean} 是否为邮箱
 */
export const isEmail = (text) => {
  if (!text) return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(text.trim());
};

/**
 * 提取文本中的链接
 * @param {string} text - 文本内容
 * @returns {string[]} 链接数组
 */
export const extractLinks = (text) => {
  if (!text) return [];
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return text.match(urlPattern) || [];
};

/**
 * 清理文本（去除多余空格和换行）
 * @param {string} text - 文本内容
 * @returns {string} 清理后的文本
 */
export const cleanText = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}; 