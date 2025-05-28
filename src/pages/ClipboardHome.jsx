// 剪贴板主页面（设计图主界面）
import React from 'react';

const ClipboardHome = ({ enterAction }) => {
  return (
    <div>
      <h1>剪贴板测试页面</h1>
      <button>测试按钮</button>
      <p>这是一个测试页面，用于验证基本功能是否正常工作。</p>
      <pre>
        {JSON.stringify(enterAction, undefined, 2)}
      </pre>
    </div>
  );
};

export default ClipboardHome;
