import React from 'react';
import { FaFile, FaFileAlt, FaFileImage, FaFileVideo, FaFileAudio, FaFileArchive, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileCode, FaDownload } from 'react-icons/fa';
import CardHeader from './CardHeader';
import './FileCard.css';

/**
 * 文件卡片组件
 * 展示文件信息，包含复制、收藏、删除等操作
 * Props:
 *   - item: 文件数据对象 { _id, content, time, favorite, type, fileName, fileSize, filePath }
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 */
class FileCard extends React.Component {
  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

  // 根据文件扩展名获取对应的图标
  getFileIcon = (fileName) => {
    if (!fileName) return <FaFile />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      // 图片文件
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return <FaFileImage className="text-green-500" />;
        
      // 视频文件
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <FaFileVideo className="text-red-500" />;
        
      // 音频文件
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
      case 'm4a':
        return <FaFileAudio className="text-purple-500" />;
        
      // 压缩文件
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <FaFileArchive className="text-orange-500" />;
        
      // 文档文件
      case 'pdf':
        return <FaFilePdf className="text-red-600" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-600" />;
        
      // 代码文件
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'html':
      case 'css':
      case 'scss':
      case 'json':
      case 'xml':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'php':
      case 'rb':
      case 'go':
      case 'rs':
        return <FaFileCode className="text-indigo-500" />;
        
      // 文本文件
      case 'txt':
      case 'md':
      case 'rtf':
        return <FaFileAlt className="text-gray-500" />;
        
      default:
        return <FaFile className="text-gray-500" />;
    }
  }

  // 格式化文件大小
  formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '未知大小';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 获取文件类型描述
  getFileTypeDescription = (fileName) => {
    if (!fileName) return '未知文件';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const typeMap = {
      // 图片
      jpg: '图片文件', jpeg: '图片文件', png: '图片文件', gif: '动图文件',
      bmp: '位图文件', svg: '矢量图', webp: '图片文件',
      
      // 视频
      mp4: '视频文件', avi: '视频文件', mov: '视频文件', mkv: '视频文件',
      wmv: '视频文件', flv: '视频文件', webm: '视频文件',
      
      // 音频
      mp3: '音频文件', wav: '音频文件', flac: '无损音频', aac: '音频文件',
      ogg: '音频文件', m4a: '音频文件',
      
      // 压缩
      zip: '压缩文件', rar: '压缩文件', '7z': '压缩文件', tar: '归档文件', gz: '压缩文件',
      
      // 文档
      pdf: 'PDF文档', doc: 'Word文档', docx: 'Word文档',
      xls: 'Excel表格', xlsx: 'Excel表格',
      ppt: 'PowerPoint', pptx: 'PowerPoint',
      
      // 代码
      js: 'JavaScript', jsx: 'React组件', ts: 'TypeScript', tsx: 'React组件',
      html: 'HTML文档', css: '样式文件', scss: '样式文件', json: 'JSON数据',
      xml: 'XML文档', py: 'Python脚本', java: 'Java程序', cpp: 'C++程序',
      c: 'C程序', php: 'PHP脚本', rb: 'Ruby脚本', go: 'Go程序', rs: 'Rust程序',
      
      // 文本
      txt: '文本文件', md: 'Markdown文档', rtf: '富文本文档'
    };
    
    return typeMap[extension] || '文件';
  }

  render() {
    const { item, onCopy, onToggleFavorite, onDelete } = this.props;
    const isDark = this.getCurrentTheme();

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className={`empty-state ${isDark ? 'dark' : ''}`}>
          <div className="empty-state-icon">📁</div>
          <div className="empty-state-title">暂无文件内容</div>
          <div className="empty-state-subtitle">复制文件后会自动出现在这里</div>
        </div>
      );
    }

    // 从item中提取文件信息
    const fileName = item.fileName || item.content?.split('/').pop() || item.content?.split('\\').pop() || '未知文件';
    const fileSize = item.fileSize;
    const filePath = item.filePath || item.content;

    return (
      <div className={`file-card ${isDark ? 'dark' : ''}`}>
        
        {/* 使用 CardHeader 组件 */}
        <CardHeader
          item={item}
          icon={<FaFile />}
          typeName="文件"
          typeColor="orange"
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
        
        {/* 文件内容 */}
        <div className="file-content">
          <div className={`file-preview ${isDark ? 'dark' : ''}`}>
            {/* 文件图标和基本信息 */}
            <div className="file-icon-container">
              <div className="file-icon">
                {this.getFileIcon(fileName)}
              </div>
              <div className="file-info">
                <div className={`file-name ${isDark ? 'dark' : ''}`}>
                  {fileName}
                </div>
                <div className={`file-type ${isDark ? 'dark' : ''}`}>
                  {this.getFileTypeDescription(fileName)}
                </div>
              </div>
            </div>
            
            {/* 文件路径（如果有） */}
            {filePath && (
              <div className={`file-path ${isDark ? 'dark' : ''}`}>
                <span className="path-label">路径:</span>
                <span className="path-text">{filePath}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* 文件统计信息 */}
        <div className={`file-stats ${isDark ? 'dark' : ''}`}>
          <span>{this.getFileTypeDescription(fileName)}</span>
          {fileSize && (
            <span>{this.formatFileSize(fileSize)}</span>
          )}
          <span>{fileName.split('.').pop()?.toUpperCase() || '未知'} 格式</span>
        </div>
      </div>
    );
  }
}

export default FileCard; 