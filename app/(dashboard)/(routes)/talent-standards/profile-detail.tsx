'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

/**
 * 星形图标组件
 * @param {object} props - 组件属性
 * @param {number} [props.size=24] - 图标大小
 * @param {boolean} [props.filled=false] - 是否填充
 * @returns {React.ReactElement} 星形图标
 */
const StarIcon = (props: { size?: number; filled?: boolean }) => {
  const { size = 24, filled = false } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

/**
 * 星级评分组件
 * @param {object} props - 组件属性
 * @param {number} props.rating - 评分值
 * @param {number} [props.maxRating=5] - 最大评分
 * @returns {React.ReactElement} 星级评分组件
 */
const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= Math.floor(rating);
    const halfFilled = !filled && i <= Math.ceil(rating) && rating % 1 !== 0;

    stars.push(
      <span key={i} className="text-yellow-400">
        {filled ? (
          <StarIcon size={16} filled={true} />
        ) : halfFilled ? (
          <span className="relative">
            <StarIcon size={16} filled={false} />
            <span className="absolute left-0 top-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon size={16} filled={true} />
            </span>
          </span>
        ) : (
          <StarIcon size={16} filled={false} />
        )}
      </span>
    );
  }

  return <div className="flex">{stars}</div>;
};

/**
 * 远景精神内容组件
 * @returns {React.ReactElement} 远景精神内容
 */
export const VisionSpiritContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">精神雷达图</h3>
          <p className="text-gray-500 mb-4">该员工的远景精神评估结果如下：</p>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="flex justify-center items-center my-8">
              <div className="w-full max-w-md aspect-square">
                <svg viewBox="0 0 600 600" width="100%" height="100%">
                  <g transform="translate(300, 300)">
                    {/* 背景层 - 五边形 */}
                    <polygon points="0,-160 152.78,-49.44 98.48,129.44 -98.48,129.44 -152.78,-49.44" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="0,-120 114.59,-37.08 73.86,97.08 -73.86,97.08 -114.59,-37.08" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="0,-80 76.39,-24.72 49.23,64.72 -49.23,64.72 -76.39,-24.72" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="0,-40 38.20,-12.36 24.61,32.36 -24.61,32.36 -38.20,-12.36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

                    {/* 坐标轴 - 五条 */}
                    <line x1="0" y1="0" x2="0" y2="-180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="171.47" y2="-55.44" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="110.11" y2="144.72" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="-110.11" y2="144.72" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="0" x2="-171.47" y2="-55.44" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />

                    {/* 标签文字 - 顺时针五个维度 */}
                    <text x="0" y="-210" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">迎难而上</text>
                    <text x="180" y="-60" textAnchor="start" fontSize="14" fill="#334155" fontWeight="500">求真务实</text>
                    <text x="115" y="170" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">领导力</text>
                    <text x="-115" y="170" textAnchor="middle" fontSize="14" fill="#334155" fontWeight="500">关键价值创造</text>
                    <text x="-180" y="-60" textAnchor="end" fontSize="14" fill="#334155" fontWeight="500">正心正念</text>

                    {/* 刻度文字 */}
                    <text x="0" y="-165" textAnchor="middle" fontSize="12" fill="#64748b">4级</text>
                    <text x="0" y="-125" textAnchor="middle" fontSize="12" fill="#64748b">3级</text>
                    <text x="0" y="-85" textAnchor="middle" fontSize="12" fill="#64748b">2级</text>
                    <text x="0" y="-45" textAnchor="middle" fontSize="12" fill="#64748b">1级</text>

                    {/* 员工数据多边形 - 示例数据 */}
                    <polygon points="0,-40 30,-9.88 15,32.36 -24.61,32.36 -38.20,-12.36" fill="#dbeafe" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2" />

                    {/* 数据点 */}
                    <circle cx="0" cy="-40" r="4" fill="#3b82f6" />
                    <circle cx="30" cy="-9.88" r="4" fill="#3b82f6" />
                    <circle cx="15" cy="32.36" r="4" fill="#3b82f6" />
                    <circle cx="-24.61" cy="32.36" r="4" fill="#3b82f6" />
                    <circle cx="-38.20" cy="-12.36" r="4" fill="#3b82f6" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">精神评价</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">客户导向</h4>
              <div className="flex items-center mt-1">
                <StarRating rating={4} maxRating={5} />
                <span className="ml-2 text-sm text-gray-500">4.0 / 5.0</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                员工表现出良好的客户导向意识，能够理解并优先处理客户需求。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">创造价值</h4>
              <div className="flex items-center mt-1">
                <StarRating rating={4.5} maxRating={5} />
                <span className="ml-2 text-sm text-gray-500">4.5 / 5.0</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                在创造价值方面表现突出，能够主动发现并解决问题，为团队和公司创造实际价值。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">拥抱变化</h4>
              <div className="flex items-center mt-1">
                <StarRating rating={3.5} maxRating={5} />
                <span className="ml-2 text-sm text-gray-500">3.5 / 5.0</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                对变化的适应能力良好，但在快速变化的环境中有时需要更多支持。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 人才九宫格
 * @returns {React.ReactElement} 九宫格图表
 */
const renderNineGridChart = () => {
  return (
    <div className="h-[420px] p-4">
      <svg width="100%" height="100%" viewBox="0 0 700 400">
        {/* 背景 */}
        <rect x="60" y="20" width="600" height="340" fill="white" stroke="#E5E7EB" strokeWidth="1" />

        {/* 九宫格线条 */}
        <line x1="60" y1="127" x2="660" y2="127" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="60" y1="233" x2="660" y2="233" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="260" y1="20" x2="260" y2="360" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="460" y1="20" x2="460" y2="360" stroke="#E5E7EB" strokeWidth="1" />

        {/* 九宫格标题 */}
        <g className="text-sm font-medium">
          {/* 第一行 */}
          <rect x="60" y="20" width="200" height="107" fill="#4CAF50" fillOpacity="0.8" />
          <text x="160" y="73" textAnchor="middle" fill="white" fontSize="14">Workers</text>
          <text x="160" y="93" textAnchor="middle" fill="white" fontSize="12">工蜂</text>

          <rect x="260" y="20" width="200" height="107" fill="#4CAF50" fillOpacity="0.9" />
          <text x="360" y="73" textAnchor="middle" fill="white" fontSize="14">Contributors</text>
          <text x="360" y="93" textAnchor="middle" fill="white" fontSize="12">贡献者</text>

          <rect x="460" y="20" width="200" height="107" fill="#8BC34A" />
          <text x="560" y="73" textAnchor="middle" fill="white" fontSize="14">Stars</text>
          <text x="560" y="93" textAnchor="middle" fill="white" fontSize="12">明星</text>

          {/* 第二行 */}
          <rect x="60" y="127" width="200" height="106" fill="#9E9E9E" />
          <text x="160" y="180" textAnchor="middle" fill="white" fontSize="14">Blockers</text>
          <text x="160" y="200" textAnchor="middle" fill="white" fontSize="12">阻碍者</text>

          <rect x="260" y="127" width="200" height="106" fill="#4CAF50" />
          <text x="360" y="180" textAnchor="middle" fill="white" fontSize="14">Transitionals</text>
          <text x="360" y="200" textAnchor="middle" fill="white" fontSize="12">过渡者</text>

          <rect x="460" y="127" width="200" height="106" fill="#4CAF50" />
          <text x="560" y="180" textAnchor="middle" fill="white" fontSize="14">Emergers</text>
          <text x="560" y="200" textAnchor="middle" fill="white" fontSize="12">才华初露者</text>

          {/* 第三行 */}
          <rect x="60" y="233" width="200" height="127" fill="#9E9E9E" />
          <text x="160" y="297" textAnchor="middle" fill="white" fontSize="14">Detractors</text>
          <text x="160" y="317" textAnchor="middle" fill="white" fontSize="12">拖木</text>

          <rect x="260" y="233" width="200" height="127" fill="#9E9E9E" />
          <text x="360" y="297" textAnchor="middle" fill="white" fontSize="14">Placeholders</text>
          <text x="360" y="317" textAnchor="middle" fill="white" fontSize="12">占位者</text>

          <rect x="460" y="233" width="200" height="127" fill="#4CAF50" />
          <text x="560" y="297" textAnchor="middle" fill="white" fontSize="14">Latents</text>
          <text x="560" y="317" textAnchor="middle" fill="white" fontSize="12">潜力者</text>
        </g>

        {/* 坐标轴标签 */}
        <text x="680" y="190" fontSize="12" fill="#64748B" transform="rotate(90, 680, 190)">Performance 绩效</text>
        <text x="360" y="390" fontSize="12" fill="#64748B" textAnchor="middle">Potential 潜质</text>

        {/* 坐标轴刻度 */}
        <text x="40" y="73" textAnchor="end" fill="#64748B" fontSize="12">Exceeded优</text>
        <text x="40" y="180" textAnchor="end" fill="#64748B" fontSize="12">Met中</text>
        <text x="40" y="297" textAnchor="end" fill="#64748B" fontSize="12">Below低</text>

        <text x="160" y="380" textAnchor="middle" fill="#64748B" fontSize="12">low低</text>
        <text x="360" y="380" textAnchor="middle" fill="#64748B" fontSize="12">Medium中</text>
        <text x="560" y="380" textAnchor="middle" fill="#64748B" fontSize="12">High高</text>
      </svg>
    </div>
  );
};

/**
 * OKR 列表表单组件
 */
interface OKRItem {
  id: number;
  okr1: boolean;
  weight: number;
  challenge: string;
  standard: string;
  action: string;
}

const OKRList: React.FC = () => {
  const [okrList, setOkrList] = useState<OKRItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OKRItem>({
    id: 0,
    okr1: false,
    weight: 0,
    challenge: '',
    standard: '',
    action: '',
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'weight' ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    setForm({ id: Date.now(), okr1: false, weight: 0, challenge: '', standard: '', action: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: OKRItem) => {
    setForm(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setOkrList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setOkrList((prev) => prev.map((item) => (item.id === editingId ? form : item)));
    } else {
      setOkrList((prev) => [...prev, form]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
        <span>OKR</span>
        <Button size="sm" onClick={handleAdd}>
          新增OKR
        </Button>
      </h3>
      <ul className="space-y-4">
        {okrList.map((item) => (
          <li key={item.id} className="border rounded p-4 relative">
            <div className="flex items-center mb-2">
              <input type="checkbox" checked={item.okr1} readOnly className="mr-2" />
              <span className="text-sm text-gray-700 mr-4">横向/兼岗</span>
              <span className="text-sm text-gray-700">权重: {item.weight}%</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">解决的挑战和目标描述：</span>{item.challenge}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">完成的标准及交付物：</span>{item.standard}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">关键举措：</span>{item.action}
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="text-blue-500 hover:underline" onClick={() => handleEdit(item)}>编辑</button>
              <button className="text-red-500 hover:underline" onClick={() => handleDelete(item.id)}>删除</button>
            </div>
          </li>
        ))}
      </ul>
      {showForm && (
        <form className="mt-6 space-y-4 bg-gray-50 p-4 rounded" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="okr1"
              checked={form.okr1}
              onChange={handleChange}
              className="mr-2"
              id="okr1"
            />
            <label htmlFor="okr1" className="text-sm">横向/兼岗</label>
          </div>
          <div>
            <label className="block text-sm mb-1">权重（%）</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">解决的挑战和目标描述</label>
            <textarea
              name="challenge"
              value={form.challenge}
              onChange={handleChange}
              placeholder="示例：通过XX手段实现XX价值"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">完成的标准及交付物</label>
            <textarea
              name="standard"
              value={form.standard}
              onChange={handleChange}
              placeholder="示例：XX时间完成XX动作实现XX结果"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">关键举措</label>
            <textarea
              name="action"
              value={form.action}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">保存</button>
            <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={handleCancel}>取消</button>
          </div>
        </form>
      )}
    </div>
  );
};

/**
 * 信息项属性
 * @typedef {object} InfoItemProps
 * @property {React.ReactNode} icon - 图标
 * @property {string} label - 标签
 * @property {string} value - 值
 */
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

/**
 * 信息项组件
 * @param {InfoItemProps} props - 组件属性
 * @returns {React.ReactElement} 信息项组件
 */
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start mb-4 last:mb-0">
      <div className="text-gray-400 mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

/**
 * 个人信息内容组件
 * @returns {React.ReactElement} 个人信息内容
 */
export const PersonalInfoContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">基本信息</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              label="姓名"
              value="张远景"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              }
              label="邮箱"
              value="zhangyj@example.com"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              }
              label="电话"
              value="+86 13800138000"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">工作信息</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              }
              label="部门"
              value="机制建设部"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              }
              label="职位"
              value="部门负责人"
            />
            <InfoItem
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              }
              label="入职时间"
              value="2020年3月15日"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 工作履历内容组件
 * @returns {React.ReactElement} 工作履历内容
 */
export const WorkHistoryContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">工作经历</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4 space-y-8">
              {/* 工作经历条目 1 */}
              <div className="relative">
                <div className="absolute -left-[34px] bg-white p-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    1
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">远景科技集团</h4>
                      <p className="text-sm text-gray-600">部门负责人</p>
                    </div>
                    <span className="text-sm text-gray-500">2020年3月 - 至今</span>
                  </div>
                  <div className="mt-2">
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">所属部门</p>
                        <p className="text-sm">机制建设部</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">职级</p>
                        <p className="text-sm">P7</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">主要职责</p>
                      <p className="text-sm text-gray-700 mt-1">
                        负责核心系统的设计和开发，带领团队完成关键项目，指导初级工程师成长。
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">主要成就</p>
                      <p className="text-sm text-gray-700 mt-1">
                        主导设计并开发了公司核心业务系统，提高了团队效率30%，获得年度最佳员工奖。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 工作经历条目 2 */}
              <div className="relative">
                <div className="absolute -left-[34px] bg-white p-1">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                    2
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">智能科技有限公司</h4>
                      <p className="text-sm text-gray-600">软件工程师</p>
                    </div>
                    <span className="text-sm text-gray-500">2017年6月 - 2020年2月</span>
                  </div>
                  <div className="mt-2">
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">所属部门</p>
                        <p className="text-sm">技术开发部</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">职级</p>
                        <p className="text-sm">P5</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">主要职责</p>
                      <p className="text-sm text-gray-700 mt-1">
                        负责公司产品的开发和维护，参与系统架构设计，解决技术难题。
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">主要成就</p>
                      <p className="text-sm text-gray-700 mt-1">
                        成功开发了公司核心算法模块，优化了系统性能，获得两次季度优秀员工称号。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">项目经历</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-6">
              {/* 项目经历条目 1 */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">智能人事管理系统</h4>
                    <p className="text-sm text-gray-600">项目负责人</p>
                  </div>
                  <span className="text-sm text-gray-500">2022年1月 - 2022年12月</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">项目描述</p>
                  <p className="text-sm text-gray-700 mt-1">
                    基于AI技术的人事管理系统，集成了员工档案管理、绩效评估、人才发展等功能模块。
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">主要贡献</p>
                  <p className="text-sm text-gray-700 mt-1">
                    负责整体架构设计和团队管理，亲自实现了核心算法模块，使得人才匹配准确率提高40%。
                  </p>
                </div>
              </div>

              {/* 项目经历条目 2 */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">企业数据分析平台</h4>
                    <p className="text-sm text-gray-600">核心开发工程师</p>
                  </div>
                  <span className="text-sm text-gray-500">2021年3月 - 2021年9月</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">项目描述</p>
                  <p className="text-sm text-gray-700 mt-1">
                    企业级数据分析平台，支持多维度数据可视化和智能决策辅助。
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">主要贡献</p>
                  <p className="text-sm text-gray-700 mt-1">
                    负责数据处理模块和可视化引擎的开发，优化了数据处理性能，使得大规模数据分析速度提升3倍。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 人岗匹配内容组件
 * @returns {React.ReactElement} 人岗匹配内容
 */
export const JobMatchingContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">匹配度分析</h3>
          <p className="text-gray-500 mb-4">员工与当前岗位的匹配情况分析</p>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-500 transition-all duration-1000"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                    clip: 'rect(0px, 160px, 160px, 80px)'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">85%</span>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-800">整体匹配度: 优秀</p>
              <p className="text-sm text-gray-600">员工能力与岗位要求高度匹配</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">技术能力</span>
                  <span className="text-sm font-medium text-green-600">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">工作经验</span>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">团队协作</span>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">领导能力</span>
                  <span className="text-sm font-medium text-yellow-600">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">发展建议</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">提升领导能力</h4>
                <p className="text-sm text-gray-600">
                  建议参加领导力培训课程，并在项目中担任更多领导角色，以提升整体领导能力。
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">持续技术学习</h4>
                <p className="text-sm text-gray-600">
                  建议继续深化技术专业知识，保持技术优势，可以考虑参与更复杂的技术项目。
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">晋升通道</h4>
                <p className="text-sm text-gray-600">
                  根据当前匹配情况，有潜力在1-2年内晋升为技术专家或初级管理岗位。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">人才九宫格</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            {renderNineGridChart()}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">OKR 列表</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <OKRList />
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 绩效信息内容组件
 * @returns {React.ReactElement} 绩效信息内容
 */
export const PerformanceContent: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">绩效概览</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px] p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-gray-500">年度绩效评分</h4>
                <div className="mt-2 flex items-baseline">
                  <span className="text-2xl font-bold text-blue-600">A</span>
                  <span className="ml-1 text-sm text-gray-500">优秀</span>
                </div>
              </div>

              <div className="flex-1 min-w-[200px] p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="text-sm font-medium text-gray-500">目标达成率</h4>
                <div className="mt-2 flex items-baseline">
                  <span className="text-2xl font-bold text-green-600">95%</span>
                  <span className="ml-1 text-sm text-gray-500">超出预期</span>
                </div>
              </div>

              <div className="flex-1 min-w-[200px] p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="text-sm font-medium text-gray-500">团队排名</h4>
                <div className="mt-2 flex items-baseline">
                  <span className="text-2xl font-bold text-purple-600">前10%</span>
                  <span className="ml-1 text-sm text-gray-500">卓越表现</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">绩效趋势</h4>
              <div className="h-64 flex items-center justify-center border border-gray-100 rounded-md">
                <p className="text-gray-400">绩效趋势图表区域</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3">历史绩效记录</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      考核周期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      评级
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      目标达成率
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      评语
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      2023年度
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        A
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      95%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      表现优秀，能够主动承担重要任务，高质量完成工作目标。
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      2022年度
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        A
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      90%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      工作表现稳定出色，能够有效解决复杂问题，积极带动团队成员。
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      2021年度
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        B+
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      85%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      整体表现良好，完成了预定目标，在技术方面有显著提升。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * 评价内容组件
 * @returns {React.ReactElement} 评价内容
 */
interface ReviewItem {
  id: number;
  self: string;
  vision: string;
  process: string;
  performance: string;
}

export const ReviewContent: React.FC = () => {
  const [reviews, setReviews] = React.useState<ReviewItem[]>([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<ReviewItem>({
    id: 0,
    self: "",
    vision: "",
    process: "",
    performance: "",
  });

  const handleAdd = () => {
    setForm({ id: Date.now(), self: "", vision: "", process: "", performance: "" });
    setEditingId(null);
    setShowDialog(true);
  };
  const handleEdit = (item: ReviewItem) => {
    setForm(item);
    setEditingId(item.id);
    setShowDialog(true);
  };
  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setReviews((prev) => prev.map((item) => (item.id === editingId ? form : item)));
    } else {
      setReviews((prev) => [...prev, form]);
    }
    setShowDialog(false);
    setEditingId(null);
  };
  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
  };

  return (
    <Card className="p-6">
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
          <span>评价内容</span>
          <Button size="sm" onClick={handleAdd}>
            添加评价
          </Button>
        </h3>
        <ul className="space-y-4">
          {reviews.length === 0 && <li className="text-gray-400">暂无评价</li>}
          {reviews.map((item) => (
            <li key={item.id} className="border rounded p-4 relative">
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">自我评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.self || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">远景精神评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.vision || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">流程角色评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.process || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-medium mr-2">个人绩效评价：</span>
                <span className="text-sm text-gray-600 whitespace-pre-line">{item.performance || '—'}</span>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-blue-500 hover:underline" onClick={() => handleEdit(item)}>编辑</button>
                <button className="text-red-500 hover:underline" onClick={() => handleDelete(item.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h4 className="text-lg font-medium mb-4">{editingId ? "编辑评价" : "添加评价"}</h4>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-1">自我评价</label>
                <textarea
                  name="self"
                  value={form.self}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">远景精神评价</label>
                <textarea
                  name="vision"
                  value={form.vision}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">流程角色评价</label>
                <textarea
                  name="process"
                  value={form.process}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">个人绩效评价</label>
                <textarea
                  name="performance"
                  value={form.performance}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  required
                />
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                <Button size="sm" type="submit">保存</Button>
                <Button size="sm" variant="outline" type="button" onClick={handleCancel}>取消</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};