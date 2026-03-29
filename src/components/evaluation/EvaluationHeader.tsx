import React from 'react';
import { ChevronLeft, Pencil, MapPin, Printer, Save, ExternalLink } from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';
import { Evaluation, BusinessDistrict } from '../../types';

interface EvaluationHeaderProps {
  activeEval: Evaluation;
  districts: BusinessDistrict[];
  onUpdate: (updates: Partial<Evaluation>) => void;
  onBack: () => void;
  onPrint: () => void;
  onJumpToDistrict: (id: string) => void;
  isIframe: boolean;
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  activeEval,
  districts,
  onUpdate,
  onBack,
  onPrint,
  onJumpToDistrict,
  isIframe
}) => {
  const selectedDistrictId = activeEval.districtId;

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="flex-1 group relative min-w-0">
        <div className="flex items-center gap-2 md:gap-3 mb-1 min-w-0">
          <input 
            className="text-2xl md:text-3xl font-black bg-transparent border-none outline-none focus:ring-2 focus:ring-orange-500 rounded-xl px-2 -ml-2 w-full transition-all truncate"
            value={activeEval.name ?? ""}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="输入评估名称..."
          />
          <Pencil size={18} className="text-neutral-300 group-hover:text-orange-600 transition-colors flex-shrink-0 md:w-5 md:h-5" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-[10px] md:text-sm text-neutral-400 font-medium whitespace-nowrap">评估创建于 {formatDate(activeEval.createdAt)}</p>
          
          <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100 no-print">
            <MapPin size={12} className="text-orange-600" />
            <select
              value={selectedDistrictId || ""}
              onChange={(e) => onUpdate({ districtId: e.target.value || undefined })}
              className={cn(
                "bg-transparent border-none outline-none text-[10px] font-bold appearance-none cursor-pointer transition-all pr-4",
                selectedDistrictId ? "text-orange-600" : "text-neutral-400"
              )}
            >
              <option value="">未关联商圈</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {selectedDistrictId && (
              <button 
                onClick={() => onJumpToDistrict(selectedDistrictId)}
                className="text-orange-600 hover:text-orange-700 transition-colors"
                title="查看商圈详情"
              >
                <ExternalLink size={12} />
              </button>
            )}
          </div>

          {/* Print only district display */}
          {selectedDistrictId && (
            <div className="hidden print:flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg whitespace-nowrap">
              <MapPin size={10} /> {districts.find(d => d.id === selectedDistrictId)?.name}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 no-print">
         <div className="flex gap-2">
           <button 
             onClick={onPrint}
             className="flex-1 md:flex-none bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-neutral-50"
           >
             <Printer size={18} /> 打印评估
           </button>
           <button className="flex-1 md:flex-none bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-neutral-50">
             <Save size={18} /> 保存更改
           </button>
         </div>
         {isIframe && (
           <p className="text-[10px] text-neutral-400 text-center md:text-right">
             若打印无反应，请点击右上角“在新标签页中打开”后重试
           </p>
         )}
      </div>
    </section>
  );
};
