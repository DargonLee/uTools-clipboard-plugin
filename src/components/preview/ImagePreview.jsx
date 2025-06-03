import React from 'react';
import { FaTimes, FaDownload, FaCopy, FaExpand, FaCompress } from 'react-icons/fa';
import './ImagePreview.css';

/**
 * 图片预览组件
 * 全屏显示图片，支持键盘控制
 * Props:
 *   - isVisible: 是否显示预览
 *   - imageData: 图片数据对象
 *   - onClose: 关闭回调函数
 *   - onCopy: 复制回调函数
 */
class ImagePreview extends React.Component {
  state = {
    isZoomed: false,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    imagePosition: { x: 0, y: 0 },
    scale: 1
  };

  componentDidMount() {
    // 监听键盘事件
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    // 只在预览可见时才禁用页面滚动
    if (this.props.isVisible) {
      this.lockBodyScroll();
    }
  }

  componentWillUnmount() {
    // 清理事件监听器
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    // 恢复页面滚动
    this.unlockBodyScroll();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible && !prevProps.isVisible) {
      // 显示预览时重置状态并禁用滚动
      this.setState({
        isZoomed: false,
        scale: 1,
        imagePosition: { x: 0, y: 0 }
      });
      this.lockBodyScroll();
    } else if (!this.props.isVisible && prevProps.isVisible) {
      // 隐藏预览时恢复滚动
      this.unlockBodyScroll();
    }
  }

  // 键盘事件处理
  handleKeyDown = (e) => {
    if (!this.props.isVisible) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.props.onClose();
        break;
      case ' ':
        e.preventDefault();
        this.props.onClose();
        break;
      case '+':
      case '=':
        e.preventDefault();
        this.zoomIn();
        break;
      case '-':
        e.preventDefault();
        this.zoomOut();
        break;
      case '0':
        e.preventDefault();
        this.resetZoom();
        break;
      default:
        break;
    }
  }

  handleKeyUp = (e) => {
    // 处理按键释放事件
  }

  // 缩放控制
  zoomIn = () => {
    this.setState(prevState => ({
      scale: Math.min(prevState.scale * 1.2, 5),
      isZoomed: true
    }));
  }

  zoomOut = () => {
    this.setState(prevState => ({
      scale: Math.max(prevState.scale / 1.2, 0.1),
      isZoomed: prevState.scale / 1.2 > 1
    }));
  }

  resetZoom = () => {
    this.setState({
      scale: 1,
      isZoomed: false,
      imagePosition: { x: 0, y: 0 }
    });
  }

  // 拖拽功能
  handleMouseDown = (e) => {
    if (this.state.isZoomed) {
      this.setState({
        isDragging: true,
        dragStart: { x: e.clientX, y: e.clientY }
      });
    }
  }

  handleMouseMove = (e) => {
    if (this.state.isDragging && this.state.isZoomed) {
      const deltaX = e.clientX - this.state.dragStart.x;
      const deltaY = e.clientY - this.state.dragStart.y;
      
      this.setState(prevState => ({
        imagePosition: {
          x: prevState.imagePosition.x + deltaX,
          y: prevState.imagePosition.y + deltaY
        },
        dragStart: { x: e.clientX, y: e.clientY }
      }));
    }
  }

  handleMouseUp = () => {
    this.setState({ isDragging: false });
  }

  // 保存图片
  handleSaveImage = () => {
    if (this.props.imageData?.content) {
      try {
        // 通过 fileService 保存图片
        const filePath = window.AppClipboard?.fileService?.writeImageFile(this.props.imageData.content);
        if (filePath) {
          console.log('图片已保存到:', filePath);
          alert(`图片已保存到: ${filePath}`);
        } else {
          alert('保存失败，请重试');
        }
      } catch (error) {
        console.error('保存图片失败:', error);
        alert('保存失败，请重试');
      }
    }
  }

  // 复制图片
  handleCopyImage = () => {
    if (this.props.onCopy && this.props.imageData) {
      this.props.onCopy(this.props.imageData);
    }
  }

  // 阻止事件冒泡
  handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  }

  // 锁定页面滚动
  lockBodyScroll = () => {
    // 避免重复锁定
    if (this.isScrollLocked) return;
    
    // 保存当前滚动位置
    this.scrollPosition = window.pageYOffset;
    // 禁用滚动
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    
    this.isScrollLocked = true;
  }

  // 恢复页面滚动
  unlockBodyScroll = () => {
    // 避免重复解锁
    if (!this.isScrollLocked) return;
    
    // 恢复滚动
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    // 恢复滚动位置
    if (this.scrollPosition !== undefined) {
      window.scrollTo(0, this.scrollPosition);
      this.scrollPosition = undefined;
    }
    
    this.isScrollLocked = false;
  }

  render() {
    const { isVisible, imageData } = this.props;
    const { isZoomed, scale, imagePosition, isDragging } = this.state;

    if (!isVisible || !imageData) {
      return null;
    }

    const imageStyle = {
      transform: `scale(${scale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
      cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
    };

    return (
      <div className="image-preview-overlay" onClick={this.handleBackdropClick}>
        <div className="image-preview-container">
          
          {/* 工具栏 */}
          <div className="preview-toolbar">
            <div className="toolbar-left">
              <span className="preview-title">图片预览</span>
              {imageData.size && (
                <span className="preview-info">
                  {this.formatFileSize(imageData.size)}
                </span>
              )}
            </div>
            
            <div className="toolbar-right">
              <button 
                className="toolbar-btn" 
                onClick={this.handleCopyImage}
                title="复制图片 (Ctrl+C)"
              >
                <FaCopy />
              </button>
              
              <button 
                className="toolbar-btn" 
                onClick={this.handleSaveImage}
                title="保存图片"
              >
                <FaDownload />
              </button>
              
              <button 
                className="toolbar-btn" 
                onClick={isZoomed ? this.resetZoom : this.zoomIn}
                title={isZoomed ? "重置缩放 (0)" : "放大 (+)"}
              >
                {isZoomed ? <FaCompress /> : <FaExpand />}
              </button>
              
              <button 
                className="toolbar-btn close-btn" 
                onClick={this.props.onClose}
                title="关闭 (ESC)"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* 图片容器 */}
          <div 
            className="preview-image-container"
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseUp}
          >
            <img
              src={imageData.content}
              alt="预览图片"
              className="preview-image"
              style={imageStyle}
              onClick={!isZoomed ? this.zoomIn : undefined}
              draggable={false}
            />
          </div>

          {/* 快捷键提示 */}
          <div className="preview-shortcuts">
            <span>ESC / 空格: 关闭</span>
            <span>+/-: 缩放</span>
            <span>0: 重置</span>
            {isZoomed && <span>拖拽: 移动图片</span>}
          </div>
        </div>
      </div>
    );
  }

  // 格式化文件大小
  formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default ImagePreview;