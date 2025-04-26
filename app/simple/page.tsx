export default function SimplePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">简单Tailwind测试</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p className="text-gray-800">这是一个段落文本</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          按钮
        </button>
      </div>
    </div>
  );
} 