import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws')
    wsRef.current = ws
    ws.onmessage = (e) => setMessages(m => [...m, e.data])
    return () => ws.close()
  }, [])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const send = () => {
    if (!text.trim()) return
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(text)
    }
    setText('')
  }

  return (
<div>
  {/* Chat list */}
  <div className="chat-list">
    <div className="top-bar">
      <div className="ellipse-label" id="ellipseLabel">
        <div className="logo-container">
          <div className="logo-particle" style={{"--i": 1}} />
          <div className="logo-particle" style={{"--i": 2}} />
          <div className="logo-particle" style={{"--i": 3}} />
          <div className="logo-particle" style={{"--i": 4}} />
          <div className="logo-particle" style={{"--i": 5}} />
          <div className="logo-particle" style={{"--i": 6}} />
          <div className="logo-particle" style={{"--i": 7}} />
          <span className="logo-text">ELLIPSE</span>
        </div>
      </div>
      <div className="call-minimized" id="callMinimized">
        <div className="call-info">
          <div className="equalizer">
            <div className="equalizer-bar" />
            <div className="equalizer-bar" />
            <div className="equalizer-bar" />
            <div className="equalizer-bar" />
            <div className="equalizer-bar" />
          </div>
        </div>
        <div className="call-controls">
          <button className="call-btn"><i className="fas fa-video" /></button>
          <button className="call-btn"><i className="fas fa-desktop" /></button>
          <button className="call-btn end-call" id="endCallMinimized"><i className="fas fa-phone-slash" /></button>
        </div>
      </div>
    </div>
    <div className="chat-search">
      <input type="text" className="search-input" placeholder="Search" />
    </div>
    <div className="chat-items">
      <div className="chat-item active">
        <div className="chat-avatar">B</div>
        <div className="chat-info">
          <div className="chat-name">4retojero</div>
          <div className="chat-preview">Last message preview...</div>
        </div>
      </div>
      <div className="chat-item">
        <div className="chat-avatar">A</div>
        <div className="chat-info">
          <div className="chat-name">4retojero2</div>
          <div className="chat-preview">Last message preview...</div>
        </div>
      </div>
      <div className="chat-item">
        <div className="chat-avatar">C</div>
        <div className="chat-info">
          <div className="chat-name">4retojero3</div>
          <div className="chat-preview">Last message preview...</div>
        </div>
      </div>
      <div className="chat-item">
        <div className="chat-avatar">D</div>
        <div className="chat-info">
          <div className="chat-name">4retojero</div>
          <div className="chat-preview">Last message preview...</div>
        </div>
      </div>
    </div>
  </div>
  {/* Main chat area */}
  <div className="main-chat-area" id="mainChatArea">
    {/* Chat header */}
    <div className="chat-header">
      <div className="chat-title">4retojero</div>
      <div className="chat-actions">
        <button className="chat-action-btn" id="startCallBtn"><i className="fas fa-phone" /></button>
        <button className="chat-action-btn"><i className="fas fa-search" /></button>
        <button className="chat-action-btn"><i className="fas fa-ellipsis-h" /></button>
      </div>
    </div>
    {/* Messages container */}
    <div className="messages-container">
      {/* Call in chat */}
      <div className="call-in-chat" id="callInChat">
        <div className="call-info">
          <div className="call-avatar">B</div>
          <div className="call-details">
            <div className="call-name">4retojero</div>
            <div className="call-status">
              <span className="pulse" /> In call
              <div className="call-equalizer">
                <div className="call-equalizer-bar" />
                <div className="call-equalizer-bar" />
                <div className="call-equalizer-bar" />
                <div className="call-equalizer-bar" />
              </div>
            </div>
          </div>
        </div>
        <div className="call-in-chat-controls">
          <button className="call-btn"><i className="fas fa-video" /></button>
          <button className="call-btn"><i className="fas fa-microphone" /></button>
          <button className="call-btn"><i className="fas fa-desktop" /></button>
          <button className="call-btn end-call" id="endCallBtn"><i className="fas fa-phone-slash" /></button>
        </div>
        <div className="resize-handle" id="callResizeHandle" />
      </div>
      {/* Messages */}
      {messages.map((msg,i) => (
        <div className="message" key={i}>
          <div className="message-avatar">U</div>
          <div className="message-content">
            <div className="message-header">
              <div className="message-sender">User</div>
            </div>
            <div className="message-text">{msg}</div>
          </div>
        </div>
      ))}
    </div>
    {/* Message input */}
    <div className="message-input-container">
      <div className="message-input-wrapper">
        <div className="input-actions">
          <button className="input-action-btn" id="attachBtn"><i className="fas fa-plus" /></button>
        </div>
        <textarea className="message-input" placeholder="Message" rows={1} value={text} onChange={e=>setText(e.target.value)} onKeyDown={handleKey} />
        <div className="input-actions">
          <button className="input-action-btn" id="gifBtn"><i className="fas fa-gift" /></button>
          <button className="input-action-btn" id="emojiBtn"><i className="far fa-smile" /></button>
          <button className="input-action-btn"><i className="fas fa-video" /></button>
        </div>
      </div>
    </div>
    {/* Emoji picker */}
    <div className="picker-container" id="emojiPicker">
      <div className="picker-header">
        <div className="picker-title">Emoji</div>
        <button className="picker-close"><i className="fas fa-times" /></button>
      </div>
      <div className="picker-content">
        <div className="emoji-item">😀</div>
        <div className="emoji-item">😂</div>
        <div className="emoji-item">😍</div>
        <div className="emoji-item">🤔</div>
        <div className="emoji-item">😎</div>
        <div className="emoji-item">🥳</div>
        <div className="emoji-item">😱</div>
        <div className="emoji-item">👍</div>
        <div className="emoji-item">❤️</div>
        <div className="emoji-item">🔥</div>
        <div className="emoji-item">🎮</div>
        <div className="emoji-item">👾</div>
        <div className="emoji-item">🤯</div>
        <div className="emoji-item">🤩</div>
        <div className="emoji-item">😇</div>
        <div className="emoji-item">😈</div>
        <div className="emoji-item">👻</div>
        <div className="emoji-item">💀</div>
        <div className="emoji-item">🤖</div>
        <div className="emoji-item">👽</div>
        <div className="emoji-item">👑</div>
        <div className="emoji-item">💎</div>
        <div className="emoji-item">⚡</div>
        <div className="emoji-item">🌈</div>
        <div className="emoji-item">🍕</div>
        <div className="emoji-item">🍔</div>
        <div className="emoji-item">🎉</div>
        <div className="emoji-item">🎯</div>
        <div className="emoji-item">💣</div>
        <div className="emoji-item">🛸</div>
        <div className="emoji-item">🚀</div>
        <div className="emoji-item">👀</div>
      </div>
    </div>
    {/* GIF picker */}
    <div className="picker-container" id="gifPicker">
      <div className="picker-header">
        <div className="picker-title">GIFs</div>
        <button className="picker-close"><i className="fas fa-times" /></button>
      </div>
      <div className="picker-content">
        <div style={{padding: 20, textAlign: 'center', color: 'var(--text-muted)'}}>
          <i className="fas fa-gift" style={{fontSize: 48, marginBottom: 16}} />
          <div>GIF picker would be here</div>
        </div>
      </div>
    </div>
    {/* File picker */}
    <div className="picker-container" id="filePicker">
      <div className="picker-header">
        <div className="picker-title">Attach File</div>
        <button className="picker-close"><i className="fas fa-times" /></button>
      </div>
      <div className="picker-content file-picker-content">
        <div className="file-option">
          <div className="file-icon"><i className="fas fa-folder-open" /></div>
          <div className="file-label">Files</div>
        </div>
        <div className="file-option">
          <div className="file-icon"><i className="fas fa-camera" /></div>
          <div className="file-label">Photo</div>
        </div>
        <div className="file-option">
          <div className="file-icon"><i className="fas fa-video" /></div>
          <div className="file-label">Video</div>
        </div>
        <div className="file-option">
          <div className="file-icon"><i className="fas fa-file-audio" /></div>
          <div className="file-label">Audio</div>
        </div>
        <div className="file-option">
          <div className="file-icon"><i className="fas fa-map-marker-alt" /></div>
          <div className="file-label">Location</div>
        </div>
        <div className="file-option">
          <div className="file-icon"><i className="fas fa-user-circle" /></div>
          <div className="file-label">Contact</div>
        </div>
        <input type="file" id="fileInput" style={{display: 'none'}} multiple />
      </div>
    </div>
  </div>
  {/* Right sidebar */}
  <div className="sidebar collapsed" id="mainSidebar">
    <div className="sidebar-toggle" id="sidebarToggle">
      <div className="toggle-bar">
        <i className="fas fa-chevron-right toggle-icon" />
      </div>
    </div>
    <div className="sidebar-content">
      <div className="sidebar-section attachments-section">
        <div className="attachments-tabs">
          <div className="tab active" data-tab="files">Files</div>
          <div className="tab" data-tab="media">Media</div>
          <div className="tab" data-tab="voice">Voice</div>
        </div>
        <div className="attachments-content">
          <div className="content-section active" id="files">
            <div className="attachment-item">
              <div className="attachment-icon"><i className="fas fa-file-code" /></div>
              <div className="attachment-info">
                <div className="attachment-name">script.js</div>
                <div className="attachment-meta">12 KB · 2 days ago</div>
                <div className="attachment-progress" />
              </div>
              <button className="attachment-download"><i className="fas fa-download" /></button>
            </div>
            <div className="attachment-item">
              <div className="attachment-icon"><i className="fas fa-file-pdf" /></div>
              <div className="attachment-info">
                <div className="attachment-name">document.pdf</div>
                <div className="attachment-meta">1.2 MB · 1 week ago</div>
                <div className="attachment-progress" />
              </div>
              <button className="attachment-download"><i className="fas fa-download" /></button>
            </div>
          </div>
          <div className="content-section" id="media">
            <div className="attachment-item">
              <div className="attachment-icon"><i className="fas fa-file-image" /></div>
              <div className="attachment-info">
                <div className="attachment-name">screenshot.png</div>
                <div className="attachment-meta">450 KB · 3 days ago</div>
                <div className="attachment-progress" />
              </div>
              <button className="attachment-download"><i className="fas fa-download" /></button>
            </div>
          </div>
          <div className="content-section" id="voice">
            <div className="attachment-item">
              <div className="attachment-icon"><i className="fas fa-file-audio" /></div>
              <div className="attachment-info">
                <div className="attachment-name">voice_note.mp3</div>
                <div className="attachment-meta">2.3 MB · Yesterday</div>
                <div className="attachment-progress" />
              </div>
              <button className="attachment-download"><i className="fas fa-download" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-section menu-section">
        <div className="section-title">Social</div>
        <button className="sidebar-btn"><i className="fas fa-user-plus" /> Friend Requests</button>
        <button className="sidebar-btn"><i className="fas fa-users" /> Friends</button>
        <button className="sidebar-btn"><i className="fas fa-server" /> Servers</button>
        <button className="sidebar-btn"><i className="fas fa-plus-circle" /> Create Server</button>
        <div className="section-title">Account</div>
        <button className="sidebar-btn"><i className="fas fa-cog" /> Settings</button>
        <button className="sidebar-btn"><i className="fas fa-user-circle" /> Profile</button>
      </div>
    </div>
  </div>
</div>

  )
}
