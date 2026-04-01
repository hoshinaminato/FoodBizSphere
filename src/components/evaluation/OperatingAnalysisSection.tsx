import React from 'react';
import { InputField } from '../ui/InputField';
import { Evaluation } from '../../types';

interface OperatingAnalysisSectionProps {
  evaluation: Evaluation;
  onUpdate: (updates: Partial<Evaluation>) => void;
  dailyFixedCost: number;
  dailyBreakeven: number;
  dailyGrossProfit: number;
  dailyNetProfit: number;
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
  dailyNetProfit,
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
          label="堂食毛利率" 
          value={evaluation.dineInGrossMargin * 100} 
          onChange={(v) => onUpdate({ dineInGrossMargin: v / 100 })}
          suffix="%"
          tooltip="堂食毛利率 = (堂食销售额 - 原材料成本) / 堂食销售额。"
        />
        <InputField 
          label="外卖毛利率" 
          value={evaluation.takeoutGrossMargin * 100} 
          onChange={(v) => onUpdate({ takeoutGrossMargin: v / 100 })}
          suffix="%"
          tooltip="外卖毛利率 = (外卖销售额 - 原材料成本 - 平台抽成) / 外卖销售额。"
        />
        <InputField 
          label="堂食预估每日营业额" 
          value={evaluation.dineInEstimatedDailyRevenue} 
          onChange={(v) => onUpdate({ dineInEstimatedDailyRevenue: v })}
          suffix="¥"
          tooltip="您预期的堂食每日平均营业额。"
        />
        <InputField 
          label="外卖预估每日营业额" 
          value={evaluation.takeoutEstimatedDailyRevenue} 
          onChange={(v) => onUpdate({ takeoutEstimatedDailyRevenue: v })}
          suffix="¥"
          tooltip="您预期的外卖每日平均营业额。"
        />
        <InputField 
          label="每日固定成本" 
          value={dailyFixedCost.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：(每月人工 + 水电杂费 + 实际月房租) / 30。实际月房租会根据淡季/放假月数进行摊销。"
        />
        <InputField 
          label="日盈亏平衡点" 
          value={dailyBreakeven.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：每日固定成本 / 加权平均毛利率。这是每天必须卖到的营业额。"
        />
        <InputField 
          label="每日毛利" 
          value={dailyGrossProfit.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：(堂食营业额 * 堂食毛利) + (外卖营业额 * 外卖毛利)"
        />
        <InputField 
          label="每日纯利" 
          value={dailyNetProfit.toFixed(2)} 
          readOnly
          type="text"
          suffix="¥"
          tooltip="计算公式：每日毛利 - 每日固定成本"
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
          tooltip="计算公式：每日纯利 * 30"
        />
        <InputField 
          label="回本周期 (月)" 
          value={paybackPeriod} 
          readOnly
          type="text"
          suffix="月"
          tooltip="计算公式：建店总成本 / 每月纯利。"
        />
        <InputField 
          label="客单价" 
          value={evaluation.averageTransactionValue} 
          onChange={(v) => onUpdate({ averageTransactionValue: v })}
          suffix="¥"
          tooltip="单纯输入，不参与运算。"
        />
      </div>
    </div>
  );
};
