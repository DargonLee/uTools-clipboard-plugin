// 剪贴板主页面（设计图主界面）
// {JSON.stringify(enterAction, undefined, 2)}
// {"code": "paste", "type": "text", "payload": "Easy剪贴板","from": "main"}
import React, { useEffect } from 'react';

class ClipboardHome extends React.Component {
  state = {
    history: []
  }

  async componentDidMount() {
    const history = await window.AppClipboard.clipboardService.getAllHistory()
    this.setState({ history })

    window.AppClipboard.clipboardService.onChange(async (data) => {
      const newHistory = await window.AppClipboard.clipboardService.getAllHistory()
      this.setState({ history: newHistory })
    })
  }

  render() {
    const { enterAction } = this.props;
    const history = Array.isArray(this.state.history) ? this.state.history : []
    return (
      <div>
        <h1>剪贴板测试页面</h1>
        <button
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded"
          onClick={async () => {
            await window.AppClipboard.clipboardService.deleteAllHistory();
            const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
            this.setState({ history: newHistory });
          }}
        >清空全部</button>
        <button onClick={() => {
          window.AppClipboard.fileService.writeTextFile('测试文本')
        }}>测试按钮</button>
        <p>这是一个测试页面，用于验证基本功能是否正常工作。111</p>
        <pre>
          {JSON.stringify(enterAction, undefined, 2)}
        </pre>
        <div>
          {history.map(item => (
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
              <button
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                onClick={async () => {
                  await window.AppClipboard.clipboardService.deleteHistoryItem(item._id)
                  const newHistory = await window.AppClipboard.clipboardService.getAllHistory()
                  this.setState({ history: newHistory })
                }}
              >删除</button>
              <button
                className={`ml-2 px-2 py-1 rounded text-xs ${item.favorite ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}
                onClick={async () => {
                  await window.AppClipboard.clipboardService.updateFavorite(item._id, !item.favorite)
                  const newHistory = await window.AppClipboard.clipboardService.getAllHistory()
                  this.setState({ history: newHistory })
                }}
              >{item.favorite ? '取消收藏' : '收藏'}</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ClipboardHome;
