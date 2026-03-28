import React from 'react';
import { ChevronLeft, Pencil, MapPin, Printer, Save } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Evaluation } from '../../types';

interface EvaluationHeaderProps {
  activeEval: Evaluation;
  districtName?: string;
  onUpdate: (updates: Partial<Evaluation>) => void;
  onBack: () => void;
  onPrint: () => void;
  isIframe: boolean;
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  activeEval,
  districtName,
  onUpdate,
  onBack,
  onPrint,
  isIframe
}) => {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
      <div className="hidden print:block absolute -top-12 left-0 right-0 text-center border-b-2 border-black pb-4 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter">餐饮开店评估报告</h1>
        <p className="text-sm font-bold text-neutral-500 mt-2">PROFESSIONAL RESTAURANT EVALUATION REPORT</p>
      </div>
      <div className="flex-1 group relative min-w-0">
        <div className="flex items-center gap-2 md:gap-3 mb-1 min-w-0">
          <input 
            className="text-2xl md:text-3xl font-black bg-transparent border-none outline-none focus:ring-2 focus:ring-orange-500 rounded-xl px-2 -ml-2 w-full transition-all truncate print:text-black print:px-0 print:ml-0"
            value={activeEval.name ?? ""}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="输入评估名称..."
          />
          <Pencil size={18} className="text-neutral-300 group-hover:text-orange-600 transition-colors flex-shrink-0 md:w-5 md:h-5 no-print" />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <p className="text-[10px] md:text-sm text-neutral-400 font-medium whitespace-nowrap print:text-black">评估创建于 {formatDate(activeEval.createdAt)}</p>
          {districtName && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg whitespace-nowrap print:bg-transparent print:text-black print:border print:border-black">
              <MapPin size={10} /> {districtName}
            </span>
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
