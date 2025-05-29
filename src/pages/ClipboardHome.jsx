// 剪贴板主页面（设计图主界面）
// {JSON.stringify(enterAction, undefined, 2)}
// {"code": "paste", "type": "text", "payload": "Easy剪贴板","from": "main"}
import React, { useEffect } from 'react';

class ClipboardHome extends React.Component {
  state = { clipboardData: {} }

  componentDidMount() {
    // 监听剪贴板变化
    window.clipboardService.onChange(() => {
      console.log('剪贴板变化')
      const data = window.clipboardService.getClipboardData()
      this.setState({ clipboardData: data })
    })
    // 初始化时获取一次
    const data = window.clipboardService.getClipboardData()
    this.setState({ clipboardData: data })
  }

  render() {
    const { enterAction } = this.props;
    const { clipboardData } = this.state
    return (
      <div>
        <h1>剪贴板测试页面</h1>
        <button onClick={() => {
          window.clipboardService.writeClipboardText('测试文本')
        }}>测试按钮</button>
        <p>这是一个测试页面，用于验证基本功能是否正常工作。111</p>
        <pre>
          {JSON.stringify(enterAction, undefined, 2)}
        </pre>
        <div>
          {clipboardData.text && <div>文本：{clipboardData.text}</div>}
          {clipboardData.html && <div dangerouslySetInnerHTML={{ __html: clipboardData.html }} />}
          {clipboardData.image && <img src={clipboardData.image} alt="剪贴板图片" />}
          {/* 其他类型... */}
        </div>
      </div>
    );
  }
}

export default ClipboardHome;
