import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, GraduationCap, Home, Building2, HelpCircle } from 'lucide-react';
import { ConsumerGroup, ConsumerGroupType } from '../types';
import { cn } from '../lib/utils';

interface ConsumerGroupManagerProps {
  groups: ConsumerGroup[];
  onUpdate: (groups: ConsumerGroup[]) => void;
}

const GROUP_CONFIG: Record<ConsumerGroupType, { label: string; icon: any; description?: string }> = {
  school: { 
    label: '学校', 
    icon: GraduationCap, 
    description: '走读、可出校门吃饭的学生' 
  },
  residential: { 
    label: '住宅', 
    icon: Home, 
    description: '租户、住家户' 
  },
  office: { 
    label: '写字楼', 
    icon: Building2 
  },
  other: { 
    label: '其他', 
    icon: HelpCircle 
  }
};

export const ConsumerGroupManager: React.FC<ConsumerGroupManagerProps> = ({ groups, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGroupType, setNewGroupType] = useState<ConsumerGroupType>('school');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPopulation, setNewGroupPopulation] = useState<number>(0);

  const handleAdd = () => {
    const newGroup: ConsumerGroup = {
      id: Math.random().toString(36).substr(2, 9),
      type: newGroupType,
      customName: newGroupType === 'other' ? newGroupName : undefined,
      description: GROUP_CONFIG[newGroupType].description,
      population: newGroupPopulation
    };
    onUpdate([...groups, newGroup]);
    setIsAdding(false);
    setNewGroupName('');
    setNewGroupPopulation(0);
  };

  const handleDelete = (id: string) => {
    onUpdate(groups.filter(g => g.id !== id));
  };

  const handleUpdatePopulation = (id: string, population: number) => {
    onUpdate(groups.map(g => g.id === id ? { ...g, population } : g));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-[10px] font-bold hover:bg-neutral-800 transition-all active:scale-95"
        >
          <Plus size={12} /> 添加客群
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-white border border-orange-200 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(GROUP_CONFIG) as ConsumerGroupType[]).map(type => {
              const Icon = GROUP_CONFIG[type].icon;
              return (
                <button
                  key={type}
                  onClick={() => setNewGroupType(type)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                    newGroupType === type 
                      ? "bg-orange-50 border-orange-200 text-orange-600" 
                      : "bg-white border-neutral-100 text-neutral-400 hover:bg-neutral-50"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{GROUP_CONFIG[type].label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newGroupType === 'other' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">客群名称</label>
                <input 
                  type="text"
                  placeholder="输入自定义名称"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">预估人数</label>
              <input 
                type="number"
                placeholder="输入人数"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
                value={newGroupPopulation || ''}
                onChange={(e) => setNewGroupPopulation(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAdd}
              className="flex-1 bg-orange-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-orange-700 transition-all"
            >
              确认添加
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="px-4 bg-neutral-100 text-neutral-600 py-2 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-all"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(group => {
          const config = GROUP_CONFIG[group.type];
          const Icon = config.icon;
          return (
            <div key={group.id} className="p-4 bg-white border border-neutral-200 rounded-2xl group relative hover:border-orange-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-50 rounded-xl text-neutral-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      {group.type === 'other' ? group.customName : config.label}
                    </h4>
                    {group.description && (
                      <p className="text-[10px] text-neutral-400 font-medium">{group.description}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(group.id)}
                  className="p-1.5 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  预估人数
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    className="flex-1 bg-neutral-50 border border-neutral-100 rounded-lg px-2 py-1 text-sm font-black text-neutral-900 outline-none focus:ring-2 focus:ring-orange-500"
                    value={group.population}
                    onChange={(e) => handleUpdatePopulation(group.id, parseInt(e.target.value) || 0)}
                  />
                  <span className="text-xs font-bold text-neutral-400">人</span>
                </div>
              </div>
            </div>
          );
        })}

        {groups.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center bg-neutral-50 border border-dashed border-neutral-200 rounded-3xl">
            <Users size={32} className="mx-auto mb-2 text-neutral-200" />
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">点击右上角添加消费客群分析</p>
          </div>
        )}
      </div>
    </div>
  );
};
