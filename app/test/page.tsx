/**
 * Tailwind CSS测试页面
 * 用于验证Tailwind样式是否正确应用
 */
export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Tailwind CSS 样式测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 按钮测试 */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">按钮样式</h2>
          <div className="space-y-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              主要按钮
            </button>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md ml-2">
              次要按钮
            </button>
            <button className="bg-destructive text-white px-4 py-2 rounded-md ml-2">
              警告按钮
            </button>
            <button className="bg-muted text-muted-foreground px-4 py-2 rounded-md ml-2">
              静音按钮
            </button>
          </div>
        </div>
        
        {/* 文本和颜色测试 */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">文本和颜色</h2>
          <p className="text-foreground mb-2">普通文本</p>
          <p className="text-muted-foreground mb-2">静音文本</p>
          <p className="text-primary mb-2">主要颜色文本</p>
          <p className="text-secondary mb-2">次要颜色文本</p>
          <p className="text-accent-foreground mb-2">强调文本</p>
          <p className="font-bold mb-2">粗体文本</p>
          <p className="italic mb-2">斜体文本</p>
          <p className="underline mb-2">下划线文本</p>
        </div>
        
        {/* 边框和圆角 */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">边框和圆角</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-16 h-16 border border-primary rounded-sm bg-muted"></div>
            <div className="w-16 h-16 border border-secondary rounded-md bg-muted"></div>
            <div className="w-16 h-16 border border-destructive rounded-lg bg-muted"></div>
            <div className="w-16 h-16 border border-input rounded-full bg-muted"></div>
          </div>
        </div>
        
        {/* 状态标签 */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">状态标签</h2>
          <div className="space-y-2">
            <span className="status status-open">开放</span>
            <span className="status status-hold ml-2">等待</span>
            <span className="status status-close ml-2">关闭</span>
            <span className="status status-draft ml-2">草稿</span>
          </div>
        </div>
      </div>
    </div>
  );
} 