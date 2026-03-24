import React, { useState } from 'react';
import { ChevronLeft, Plus, Pencil, Download } from 'lucide-react';
import { exportToCSV } from '../lib/utils';
import { Project } from '../types';

interface ProjectHeaderProps {
  project: Project;
  onBack: () => void;
  onUpdateName: (name: string) => void;
  onCreateEvaluation: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  onBack, 
  onUpdateName, 
  onCreateEvaluation 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleExportAll = () => {
    const merchants = project.merchants || [];
    const districts = project.districts || [];
    
    const exportData: any[] = [];
    merchants.forEach(m => {
      const records = m.records || [];
      const merchantDistricts = districts.filter(d => d.merchantIds?.includes(m.id)).map(d => d.name).join('; ');
      
      if (records.length === 0) {
        exportData.push({
          '项目': project.name,
          '所属商圈': merchantDistricts,
          '商家名称': m.name,
          '日期': '-',
          '类型': '-',
          '时段': '-',
          '开始时间': '-',
          '结束时间': '-',
          '堂食进客量': 0,
          '外卖进客量': 0,
          '客单价': m.averageTransactionValue || 0,
          '员工数': m.employeeCount || 0,
          '是否刷单': m.isBrushing ? '是' : '否',
          '是否疑似假人': m.isFakeCustomers ? '是' : '否'
        });
      } else {
        records.forEach(r => {
          const dayTypeLabel = r.dayType === 'weekday' ? '周中' : r.dayType === 'weekend' ? '周末' : '节假日';
          exportData.push({
            '项目': project.name,
            '所属商圈': merchantDistricts,
            '商家名称': m.name,
            '日期': new Date(r.date).toLocaleDateString(),
            '类型': dayTypeLabel,
            '时段': r.timePeriod,
            '开始时间': r.startTime ? new Date(r.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
            '结束时间': r.endTime ? new Date(r.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
            '堂食进客量': r.dineInCustomerInflow,
            '外卖进客量': r.takeoutCustomerInflow,
            '客单价': r.averageTransactionValue || 0,
            '员工数': r.employeeCount || 0,
            '是否刷单': m.isBrushing ? '是' : '否',
            '是否疑似假人': m.isFakeCustomers ? '是' : '否'
          });
        });
      }
    });

    exportToCSV(exportData, `${project.name}_全量商家数据导出_${new Date().toLocaleDateString()}`);
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-colors shrink-0"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
        <div className="flex flex-col min-w-0">
          {isEditing ? (
            <input 
              autoFocus
              className="text-lg md:text-xl font-bold bg-neutral-50 px-2 py-1 rounded-lg outline-none ring-2 ring-orange-500 w-full max-w-[160px] md:max-w-[256px]"
              value={project.name ?? ""}
              onChange={(e) => onUpdateName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            />
          ) : (
            <div 
              className="flex items-center gap-2 group cursor-pointer min-w-0"
              onClick={() => setIsEditing(true)}
            >
              <h2 className="text-lg md:text-xl font-bold group-hover:text-orange-600 transition-colors truncate">
                {project.name}
              </h2>
              <Pencil size={14} className="text-neutral-300 group-hover:text-orange-600 transition-colors shrink-0" />
            </div>
          )}
          <p className="text-[8px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-widest truncate">空间管理模式</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2 no-print">
        <button 
          onClick={handleExportAll}
          className="p-2 hover:bg-neutral-100 text-neutral-600 rounded-xl transition-colors shrink-0"
          title="导出全量数据"
        >
          <Download size={20} />
        </button>
        <button 
          onClick={onCreateEvaluation}
          className="bg-neutral-900 text-white px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          <Plus size={16} className="md:w-[18px] md:h-[18px]" /> 
          <span className="hidden sm:inline">新增评估</span>
          <span className="sm:hidden">新增</span>
        </button>
      </div>
    </header>
  );
};
