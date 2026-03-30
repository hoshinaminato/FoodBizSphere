import React from 'react';
import { formatCurrency } from '../../lib/utils';

interface MetricsGridProps {
  setupCost: number;
  dailyFixedCost: number;
  dailyBreakeven: number;
  dailyNetProfit: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  setupCost,
  dailyFixedCost,
  dailyBreakeven,
  dailyNetProfit
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="bg-neutral-900 text-white p-6 rounded-3xl shadow-xl">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2">建店总成本</p>
        <h3 className="text-3xl font-black">{formatCurrency(setupCost)}</h3>
        <div className="mt-4 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 w-2/3"></div>
        </div>
        <p className="text-[10px] text-neutral-500 mt-2">基于房租、押金、装修、设备等综合计算</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2">每日固定成本</p>
        <h3 className="text-3xl font-black text-neutral-900">{formatCurrency(dailyFixedCost)}</h3>
        <p className="text-[10px] text-neutral-400 mt-2">包含人工、水电、房租的每日均摊</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2">日盈亏平衡点</p>
        <h3 className="text-3xl font-black text-orange-600">{formatCurrency(dailyBreakeven)}</h3>
        <p className="text-[10px] text-neutral-400 mt-2">每日营业额达到此金额即不亏损</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2">每日纯利</p>
        <h3 className="text-3xl font-black text-green-600">{formatCurrency(dailyNetProfit)}</h3>
        <p className="text-[10px] text-neutral-400 mt-2">扣除所有成本后的每日净利润</p>
      </div>
    </div>
  );
};
