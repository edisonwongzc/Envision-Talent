import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const TABS = [
  { key: 'basic', label: '基本信息' },
  { key: 'process', label: '流程属性' },
  { key: 'role', label: '角色认知&职责' },
  { key: 'competency', label: '专业任职能力' },
  { key: 'reference', label: '参考' },
];

/**
 * 表单字段组件
 */
const FormField: React.FC<{
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, error, required = false, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

function BasicInfoForm({ form, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="岗位名称" required>
        <Input name="jobName" value={form.jobName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="体系" required>
        <Input name="system" value={form.system} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="部门" required>
        <Input name="department" value={form.department} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位提出人" required>
        <Input name="proposer" value={form.proposer} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="正念认知参与讨论人及核心观点输出" required>
        <Textarea name="discussion" value={form.discussion} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位必要性(为什么需要这个岗位?)" required>
        <Textarea name="necessity" value={form.necessity} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位解决的关键业务挑战（排序，前三项最关键）" required>
        <Textarea name="challenges" value={form.challenges} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位关键能力要求（排序，前三项最关键）" required>
        <Textarea name="keyAbilities" value={form.keyAbilities} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位挑战实践经验（含必备和优先经验Must/Plus)" required>
        <Textarea name="experience" value={form.experience} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="远景精神特质要求（特定岗位选不超过5项）" required>
        <Textarea name="traits" value={form.traits} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="顶尖人才来源(顶尖人才在哪里？)" required>
        <Textarea name="talentSource" value={form.talentSource} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="人才吸引策略(怎么吸引优秀人才？)" required>
        <Textarea name="attractStrategy" value={form.attractStrategy} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="未来岗位发展方向" required>
        <Textarea name="futureDirection" value={form.futureDirection} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位-组织架构" required>
        <Textarea name="orgStructure" value={form.orgStructure} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位称重（挑战级别）" required>
        <Input name="weight" value={form.weight} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位JD - 岗位职责" required>
        <Textarea name="jdDuty" value={form.jdDuty} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位JD - 任职要求Requirements" required>
        <Textarea name="jdRequirement" value={form.jdRequirement} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
    </div>
  );
}

function ProcessForm({ form, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="涉及的流程名称（L1-L2-L3-L4）" required>
        <Input name="processNames" value={form.processNames} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="本岗位在流程中的关键活动" required>
        <Textarea name="keyActivities" value={form.keyActivities} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="岗位在流程中承担的角色" required>
        <Input name="processRole" value={form.processRole} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="角色所在的流程节点是否是关键控制点" required>
        <select name="isKeyControl" value={form.isKeyControl} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="">请选择</option>
          <option value="是">是</option>
          <option value="否">否</option>
        </select>
      </FormField>
      <FormField label="负责的交付物/交付件" required>
        <Textarea name="deliverables" value={form.deliverables} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
    </div>
  );
}

function RoleForm({ form, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="角色认知" required>
        <Textarea name="roleCognition" value={form.roleCognition} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="业务场景" required>
        <Textarea name="businessScenario" value={form.businessScenario} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="关键职责描述" required>
        <Textarea name="keyDutyDesc" value={form.keyDutyDesc} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="业务价值创造/关键KPI" required>
        <Textarea name="kpi" value={form.kpi} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="对应规则" required>
        <Textarea name="rules" value={form.rules} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="涉及的流程名称（L1-L2-L3-L4）" required>
        <Input name="roleProcessNames" value={form.roleProcessNames} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="对应的流程角色" required>
        <Input name="roleProcessRole" value={form.roleProcessRole} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="工具/模板和表单名称" required>
        <Input name="tools" value={form.tools} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="专业任职资格能力" required>
        <Textarea name="roleCompetency" value={form.roleCompetency} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
    </div>
  );
}

function CompetencyForm({ form, onChange }) {
  // 专业任职资格能力为可编辑列表
  const handleListChange = (idx, field, value) => {
    const newList = form.competencyList.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    onChange({ target: { name: 'competencyList', value: newList } });
  };
  const handleAdd = () => {
    const newList = [
      ...form.competencyList,
      { dimension: '', behavior: '', result: '' }
    ];
    onChange({ target: { name: 'competencyList', value: newList } });
  };
  const handleRemove = (idx) => {
    const newList = form.competencyList.filter((_, i) => i !== idx);
    onChange({ target: { name: 'competencyList', value: newList } });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="任职资格等级" required>
        <Input name="level" value={form.level} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="任职定位" required>
        <Input name="positioning" value={form.positioning} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="任职描述" required>
        <Textarea name="description" value={form.description} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="对应岗位" required>
        <Input name="relatedJob" value={form.relatedJob} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="对应挑战级别" required>
        <Input name="challengeLevel" value={form.challengeLevel} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <FormField label="专业知识（要求员工掌握的基本知识）" required>
        <Textarea name="knowledge" value={form.knowledge} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">专业任职资格能力（可添加多项）<span className="text-red-500 ml-1">*</span></label>
        {form.competencyList && form.competencyList.length > 0 ? (
          form.competencyList.map((item, idx) => (
            <div key={idx} className="mb-4 border rounded p-4 relative bg-gray-50">
              <button type="button" onClick={() => handleRemove(idx)} className="absolute top-2 right-2 text-red-500">删除</button>
              <div className="mb-2">
                <Input
                  placeholder="评价维度/举证要求/评审要求"
                  value={item.dimension}
                  onChange={e => handleListChange(idx, 'dimension', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="mb-2">
                <Input
                  placeholder="行为（担任什么角色，做过什么）"
                  value={item.behavior}
                  onChange={e => handleListChange(idx, 'behavior', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <Input
                  placeholder="结果-衡量标准(做成了什么，对业务有什么价值)"
                  value={item.result}
                  onChange={e => handleListChange(idx, 'result', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 mb-2">暂无能力项，请添加</div>
        )}
        <button type="button" onClick={handleAdd} className="px-4 py-1 bg-blue-500 text-white rounded">添加能力项</button>
      </div>
      <FormField label="组织回馈（员工对组织的专业贡献）" required>
        <Textarea name="feedback" value={form.feedback} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </FormField>
    </div>
  );
}

function ReferenceForm() {
  return <div className="text-gray-400 text-center py-10">暂无内容</div>;
}

export default function JobModelContent() {
  const [activeTab, setActiveTab] = useState('basic');
  const [basicForm, setBasicForm] = useState({
    jobName: '', system: '', department: '', proposer: '', discussion: '', necessity: '', challenges: '', keyAbilities: '', experience: '', traits: '', talentSource: '', attractStrategy: '', futureDirection: '', orgStructure: '', weight: '', jdDuty: '', jdRequirement: ''
  });
  const [processForm, setProcessForm] = useState({
    processNames: '', keyActivities: '', processRole: '', isKeyControl: '', deliverables: ''
  });
  const [roleForm, setRoleForm] = useState({
    roleCognition: '', businessScenario: '', keyDutyDesc: '', kpi: '', rules: '', roleProcessNames: '', roleProcessRole: '', tools: '', roleCompetency: ''
  });
  const [competencyForm, setCompetencyForm] = useState({
    level: '', positioning: '', description: '', relatedJob: '', challengeLevel: '', knowledge: '', competencyList: [], feedback: ''
  });

  const handleFormChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  let content;
  if (activeTab === 'basic') {
    content = <BasicInfoForm form={basicForm} onChange={handleFormChange(setBasicForm)} />;
  } else if (activeTab === 'process') {
    content = <ProcessForm form={processForm} onChange={handleFormChange(setProcessForm)} />;
  } else if (activeTab === 'role') {
    content = <RoleForm form={roleForm} onChange={handleFormChange(setRoleForm)} />;
  } else if (activeTab === 'competency') {
    content = <CompetencyForm form={competencyForm} onChange={handleFormChange(setCompetencyForm)} />;
  } else {
    content = <ReferenceForm />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">岗位模型</h2>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex">
            {/* 左侧标签栏 */}
            <div className="w-48 border-r bg-gray-50">
              <nav className="flex flex-col">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`px-6 py-4 text-left border-b hover:bg-blue-50 focus:outline-none ${activeTab === tab.key ? 'bg-white font-bold text-blue-600' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            {/* 右侧内容区域 */}
            <div className="flex-1 p-6">
              {content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}