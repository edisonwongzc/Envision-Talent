'use client';

export default function InlinePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'blue', marginBottom: '1rem' }}>
        内联样式测试
      </h1>
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#333' }}>这是一个段落文本</p>
        <button 
          style={{ 
            marginTop: '1rem',
            backgroundColor: 'blue',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => alert('按钮点击!')}
        >
          按钮
        </button>
      </div>
    </div>
  );
} 