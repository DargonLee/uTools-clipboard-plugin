import React from 'react';

/**
 * 底部提示组件
 * 展示"仅展示最近20条记录"
 */
class BottomTip extends React.Component {
  render() {
    return (
      <div className="text-center text-xs text-gray-400 py-2 select-none">
        仅展示最近20条记录
      </div>
    );
  }
}

export default BottomTip; 