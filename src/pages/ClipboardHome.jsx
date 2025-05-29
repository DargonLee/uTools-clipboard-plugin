// 剪贴板主页面（设计图主界面）
// {JSON.stringify(enterAction, undefined, 2)}
// {"code": "paste", "type": "text", "payload": "Easy剪贴板","from": "main"}
import React, { useEffect } from 'react';

class ClipboardHome extends React.Component {
  state = {
    history: []
  }

  componentDidMount() {
    // 1. 初始化时获取所有历史内容
    const history = window.AppClipboard.clipboardService.getAllHistory()
    this.setState({ history })

    // 2. 监听新内容追加
    window.AppClipboard.clipboardService.onChange((data) => {
      // console.log('剪贴板变化', data)
      // 只追加新内容（可根据实际需求去重）
      const newHistory = window.AppClipboard.clipboardService.getAllHistory()
      this.setState({ history: newHistory })
    })
  }

  render() {
    const { enterAction } = this.props;
    return (
      <div>
        <h1>剪贴板测试页面</h1>
        <button onClick={() => {
          window.AppClipboard.fileService.writeTextFile('测试文本')
        }}>测试按钮</button>
        <p>这是一个测试页面，用于验证基本功能是否正常工作。111</p>
        <pre>
          {JSON.stringify(enterAction, undefined, 2)}
        </pre>
        <div>
          {this.state.history.map(item => (
            <div key={item._id} className="mb-2 p-2 border rounded">
              {item.type === 'text' && <div>{item.content}</div>}
              {item.type === 'image' && (
                <img
                  src={item.content}
                  alt="剪贴板图片"
                  style={{ maxWidth: 200, maxHeight: 200, display: 'block' }}
                />
              )}
              <div className="text-xs text-gray-400">{new Date(item.time).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ClipboardHome;
