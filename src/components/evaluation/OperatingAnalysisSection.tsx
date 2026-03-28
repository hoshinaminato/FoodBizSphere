import React from 'react';
import { InputField } from '../ui/InputField';
import { Evaluation } from '../../types';

interface OperatingAnalysisSectionProps {
  evaluation: Evaluation;
  onUpdate: (updates: Partial<Evaluation>) => void;
  dailyFixedCost: number;
  dailyBreakeven: number;
  dailyGrossProfit: number;
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  paybackPeriod: string;
}

export const OperatingAnalysisSection: React.FC<OperatingAnalysisSectionProps> = ({
  evaluation,
  onUpdate,
  dailyFixedCost,
  dailyBreakeven,
  dailyGrossProfit,
  monthlyGrossProfit,
  monthlyNetProfit,
  paybackPeriod
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
        <h3 className="text-lg font-bold">运营成本与利润</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField 
          label="每月人工" 
          value={evaluation.monthlyLabor} 
          onChange={(v) => onUpdate({ monthlyLabor: v })}
          suffix="¥"
        />
        <InputField 
          label="水电杂费 (月)" 
          value={evaluation.monthlyUtilities} 
          onChange={(v) => onUpdate({ monthlyUtilities: v })}
          suffix="¥"
        />
        <InputField 
          label="毛利率" 
          value={evaluation.grossMargin * 100} 
          onChange={(v) => onUpdate({ grossMargin: v / 100 })}
          suffix="%"
          tooltip="毛利率 = (销售额 - 原材料成本) / 销售额。餐饮行业通常在 60% 左右。"
        />
        <InputField 
          label="每日固定成本" 
          value={dailyFixedCost.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：(每月人工 + 水电杂费 + 房租) / 30"
        />
        <InputField 
          label="日盈亏平衡点" 
          value={dailyBreakeven.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：每日固定成本 / 毛利率。这是每天必须卖到的营业额。"
        />
        <InputField 
          label="预估每日营业额" 
          value={evaluation.estimatedDailyRevenue} 
          onChange={(v) => onUpdate({ estimatedDailyRevenue: v })}
          suffix="¥"
          tooltip="您预期的每日平均营业额。"
        />
        <InputField 
          label="客单价" 
          value={evaluation.averageTransactionValue} 
          onChange={(v) => onUpdate({ averageTransactionValue: v })}
          suffix="¥"
          tooltip="单纯输入，不参与运算。"
        />
        <InputField 
          label="每日毛利" 
          value={dailyGrossProfit.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：预估每日营业额 * 毛利率"
        />
        <InputField 
          label="每月毛利" 
          value={monthlyGrossProfit.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：每日毛利 * 30"
        />
        <InputField 
          label="每月纯利" 
          value={monthlyNetProfit.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：(每日毛利 - 每日固定成本) * 30"
        />
        <InputField 
          label="回本周期 (月)" 
          value={paybackPeriod} 
          readOnly
          type="text"
          suffix="月"
          tooltip="计算公式：建店总成本 / 每月纯利。"
        />
      </div>
    </div>
  );
};
