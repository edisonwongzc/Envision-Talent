'use client';
import '../styles.css';

export default function CssPage() {
  return (
    <div className="container">
      <h1 className="header">普通CSS样式测试</h1>
      
      <div className="card">
        <p>这是一个段落文本</p>
        <button className="button" onClick={() => alert('按钮点击!')}>
          按钮
        </button>
      </div>
    </div>
  );
} 