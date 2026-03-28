import React from 'react';
import { Info } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { Tooltip } from '../ui/Tooltip';
import { Evaluation } from '../../types';
import { cn } from '../../lib/utils';

interface CostAnalysisSectionProps {
  evaluation: Evaluation;
  onUpdate: (updates: Partial<Evaluation>) => void;
  setupCost: number;
  isHidden: boolean;
  onToggleHidden: () => void;
}

export const CostAnalysisSection: React.FC<CostAnalysisSectionProps> = ({
  evaluation,
  onUpdate,
  setupCost,
  isHidden,
  onToggleHidden
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
          <h3 className="text-lg font-bold">基础信息与建店成本</h3>
        </div>
        <button 
          onClick={onToggleHidden}
          className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors no-print"
        >
          {isHidden ? "显示全部" : "隐藏建店数据"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isHidden && (
          <>
            <InputField 
              label="面积 (平)" 
              value={evaluation.area} 
              onChange={(v) => onUpdate({ area: v })}
              suffix="㎡"
            />
            <InputField 
              label="外摆面积" 
              value={evaluation.outdoorArea} 
              onChange={(v) => onUpdate({ outdoorArea: v })}
              suffix="㎡"
            />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">油烟</label>
                <Tooltip text="烟道改造费">
                  <Info size={14} className="text-neutral-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
                {[
                  { id: 'none', label: '无' },
                  { id: 'light', label: '轻油' },
                  { id: 'heavy', label: '重' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onUpdate({ fumeType: opt.id as any })}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg transition-all relative",
                      evaluation.fumeType === opt.id 
                        ? "bg-white text-orange-600 shadow-sm border-2 border-orange-600" 
                        : "text-neutral-400 hover:text-neutral-600"
                    )}
                  >
                    {opt.label}
                    {evaluation.fumeType === opt.id && (
                      <div className="hidden print:block absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] shadow-sm">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <InputField 
          label="房租 (元/月)" 
          value={evaluation.rent} 
          onChange={(v) => onUpdate({ rent: v })}
          suffix="¥"
          tooltip="此项不仅计入首付成本，也会自动均摊到每日固定成本中。"
        />
        {!isHidden && (
          <>
            <InputField 
              label="支付方式 (月)" 
              value={evaluation.paymentMethod} 
              onChange={(v) => onUpdate({ paymentMethod: v })}
              suffix="月"
              tooltip="指首付几个月的房租，如押一付三则填3"
            />
            <InputField 
              label="押金 (元)" 
              value={evaluation.deposit} 
              onChange={(v) => onUpdate({ deposit: v })}
              suffix="¥"
            />
            <InputField 
              label="转让/中介费" 
              value={evaluation.transferFee} 
              onChange={(v) => onUpdate({ transferFee: v })}
              suffix="¥"
              tooltip={`- 前身营业额（真？逗逗你的）\n- 转让原因（要会老家了？好店谁转给你）\n- 倒闭原因（是店主没搞好）\n- 小心选址老师从中作梗`}
            />
            <InputField 
              label="加盟/技术费" 
              value={evaluation.franchiseFee} 
              onChange={(v) => onUpdate({ franchiseFee: v })}
              suffix="¥"
            />
            <InputField 
              label="装修 + 广告" 
              value={evaluation.renovationFee} 
              onChange={(v) => onUpdate({ renovationFee: v })}
              suffix="¥"
              tooltip="装修是否需要恢复原样"
            />
            <InputField 
              label="设备费用" 
              value={evaluation.equipmentFee} 
              onChange={(v) => onUpdate({ equipmentFee: v })}
              suffix="¥"
            />
            <InputField 
              label="首批物料" 
              value={evaluation.initialMaterialFee} 
              onChange={(v) => onUpdate({ initialMaterialFee: v })}
              suffix="¥"
            />
            <InputField 
              label="建店总成本" 
              value={setupCost} 
              readOnly
              type="text"
              suffix="¥"
              tooltip="计算公式：(房租 * 支付方式) + 押金 + 转让费 + 加盟费 + 装修 + 设备 + 首批物料"
            />
          </>
        )}
      </div>
    </div>
  );
};
