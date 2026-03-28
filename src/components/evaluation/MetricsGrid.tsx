import React from 'react';
import { formatCurrency } from '../../lib/utils';

interface MetricsGridProps {
  setupCost: number;
  dailyFixedCost: number;
  dailyBreakeven: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  setupCost,
  dailyFixedCost,
  dailyBreakeven
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
      <div className="bg-neutral-900 text-white p-6 rounded-3xl shadow-xl print:bg-white print:text-black print:border-2 print:border-black print:shadow-none">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2 print:text-black">建店总成本</p>
        <h3 className="text-3xl font-black">{formatCurrency(setupCost)}</h3>
        <div className="mt-4 h-1 bg-neutral-800 rounded-full overflow-hidden print:bg-neutral-200">
          <div className="h-full bg-orange-50 w-2/3 print:bg-black"></div>
        </div>
        <p className="text-[10px] text-neutral-500 mt-2 print:text-black">基于房租、押金、装修、设备等综合计算</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm print:border-black print:border-2 print:shadow-none">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2 print:text-black">每日固定成本</p>
        <h3 className="text-3xl font-black text-neutral-900">{formatCurrency(dailyFixedCost)}</h3>
        <p className="text-[10px] text-neutral-400 mt-2 print:text-black">包含人工、水电、房租的每日均摊</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm print:border-black print:border-2 print:shadow-none">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2 print:text-black">日盈亏平衡点</p>
        <h3 className="text-3xl font-black text-orange-600 print:text-black">{formatCurrency(dailyBreakeven)}</h3>
        <p className="text-[10px] text-neutral-400 mt-2 print:text-black">每日营业额达到此金额即不亏损</p>
      </div>
    </div>
  );
};
