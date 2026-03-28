import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FranchiseAnalysis } from '../../types';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';
import { InputField } from '../ui/InputField';
import { SelectionField, ToggleField } from './Fields';

interface FranchiseAnalysisSectionProps {
  franchise: FranchiseAnalysis;
  onUpdate: (updates: Partial<FranchiseAnalysis>) => void;
}

export const FranchiseAnalysisSection: React.FC<FranchiseAnalysisSectionProps> = ({
  franchise,
  onUpdate
}) => {
  return (
    <div className={cn(
      "bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 space-y-8",
      !franchise.enabled && "print:hidden"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">加盟分析</h3>
            <p className="text-xs text-neutral-400">针对加盟品牌的深度评估</p>
          </div>
        </div>
        <button
          onClick={() => onUpdate({ enabled: !franchise.enabled })}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold transition-all no-print",
            franchise.enabled 
              ? "bg-orange-600 text-white shadow-lg shadow-orange-200" 
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          )}
        >
          {franchise.enabled ? "已开启" : "开启分析"}
        </button>
      </div>

      <AnimatePresence>
        {franchise.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-8 pt-4 border-t border-neutral-50"
          >
            {/* Motivation & Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectionField 
                label="加盟动机"
                value={franchise.motivation}
                onChange={(v) => onUpdate({ motivation: v })}
                options={[
                  { id: 'brand', label: '品牌力' },
                  { id: 'supply', label: '供应链' },
                  { id: 'support', label: '运营支持' },
                  { id: 'roi', label: '投资回报' },
                  { id: 'other', label: '其他' }
                ]}
                tooltip="为什么要加盟该品牌？"
              />
              <SelectionField 
                label="平台来源"
                value={franchise.platformSource}
                onChange={(v) => onUpdate({ platformSource: v })}
                options={[
                  { id: 'baidu', label: '百度' },
                  { id: 'douyin', label: '抖音' },
                  { id: 'xhs', label: '小红书' },
                  { id: 'friend', label: '朋友介绍' },
                  { id: 'other', label: '其他' }
                ]}
                tooltip="从哪个渠道了解到该品牌？"
              />
              <ToggleField 
                label="是否截流"
                value={franchise.isIntercepted}
                onChange={(v) => onUpdate({ isIntercepted: v })}
                tooltip="是否存在截流竞品流量的情况？"
              />
              <SelectionField 
                label="品牌判断"
                value={franchise.brandType}
                onChange={(v) => onUpdate({ brandType: v })}
                options={[
                  { id: 'local', label: '本土' },
                  { id: 'small', label: '小品牌' },
                  { id: 'national', label: '全国品牌' }
                ]}
              />
            </div>

            {/* Field Inspection */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                实地考察
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ToggleField 
                  label="是否去过总部"
                  value={franchise.visitedHeadquarters}
                  onChange={(v) => onUpdate({ visitedHeadquarters: v })}
                />
                <SelectionField 
                  label="味道评价"
                  value={franchise.tasteEvaluation}
                  onChange={(v) => onUpdate({ tasteEvaluation: v })}
                  options={[
                    { id: 'excellent', label: '优秀' },
                    { id: 'good', label: '良好' },
                    { id: 'fair', label: '一般' },
                    { id: 'poor', label: '较差' }
                  ]}
                />
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">考察扶持内容</label>
                    <Tooltip text="具体操作（多少钱、多久、多少、谁出、没效果怎么办）">
                      <Info size={14} className="text-neutral-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'site', label: '选址扶持' },
                      { id: 'train', label: '培训支持' },
                      { id: 'supply', label: '物料供应' },
                      { id: 'marketing', label: '营销策划' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const current = franchise.supportContent || [];
                          const next = current.includes(item.id)
                            ? current.filter(i => i !== item.id)
                            : [...current, item.id];
                          onUpdate({ supportContent: next });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border relative",
                          (franchise.supportContent || []).includes(item.id)
                            ? "bg-orange-50 border-orange-200 text-orange-600"
                            : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300"
                        )}
                      >
                        {item.label}
                        {(franchise.supportContent || []).includes(item.id) && (
                          <div className="hidden print:block absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <ToggleField 
                  label="真实门店验证"
                  value={franchise.hasRealStoreVerification}
                  onChange={(v) => onUpdate({ hasRealStoreVerification: v })}
                  tooltip="是否实地考察过正在营业的加盟店？要在路边、商场的，不要在公司里的样板房"
                />
                <ToggleField 
                  label="是否推荐"
                  value={franchise.isRecommended}
                  onChange={(v) => onUpdate({ isRecommended: v })}
                />
                <InputField 
                  label="加盟商数量"
                  value={franchise.franchiseeCount}
                  onChange={(v) => onUpdate({ franchiseeCount: v })}
                  suffix="家"
                />
                <InputField 
                  label="平均营业额"
                  value={franchise.averageRevenue}
                  onChange={(v) => onUpdate({ averageRevenue: v })}
                  suffix="¥"
                />
              </div>
            </div>

            {/* Fee Structure */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                费用结构
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectionField 
                  label="费用周期"
                  value={franchise.feeType}
                  onChange={(v) => onUpdate({ feeType: v as any })}
                  options={[
                    { id: 'one-time', label: '一次性' },
                    { id: 'annual', label: '年费' }
                  ]}
                />
                <InputField 
                  label="加盟费"
                  value={franchise.franchiseFee}
                  onChange={(v) => onUpdate({ franchiseFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="选址费"
                  value={franchise.locationFee}
                  onChange={(v) => onUpdate({ locationFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="物料费"
                  value={franchise.materialFee}
                  onChange={(v) => onUpdate({ materialFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="设备费"
                  value={franchise.equipmentFee}
                  onChange={(v) => onUpdate({ equipmentFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="已支付金额"
                  value={franchise.paidAmount}
                  onChange={(v) => onUpdate({ paidAmount: v })}
                  suffix="¥"
                  tooltip="目前已经给品牌方交了多少钱？"
                />
              </div>
            </div>

            {/* Support & Profit */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                扶持与盈利
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ToggleField 
                  label="选址支持"
                  value={franchise.locationSupport}
                  onChange={(v) => onUpdate({ locationSupport: v })}
                />
                <InputField 
                  label="差旅费用"
                  value={franchise.travelExpenses}
                  onChange={(v) => onUpdate({ travelExpenses: v })}
                  suffix="¥"
                />
                <SelectionField 
                  label="转让费问题"
                  value={franchise.transferFeeIssue}
                  onChange={(v) => onUpdate({ transferFeeIssue: v })}
                  options={[
                    { id: 'help', label: '协助谈价' },
                    { id: 'suggest', label: '仅建议' },
                    { id: 'none', label: '不参与' }
                  ]}
                  tooltip="小心选址老师从中作梗"
                />
                <SelectionField 
                  label="盈利推算方式"
                  value={franchise.calculationMethod}
                  onChange={(v) => onUpdate({ calculationMethod: v })}
                  options={[
                    { id: 'traffic', label: '人数推算' },
                    { id: 'comp', label: '竞对对比' },
                    { id: 'brand', label: '品牌提供' },
                    { id: 'other', label: '其他' }
                  ]}
                />
                <SelectionField 
                  label="门店对比"
                  value={franchise.comparisonWithOthers}
                  onChange={(v) => onUpdate({ comparisonWithOthers: v })}
                  options={[
                    { id: 'better', label: '优于平均' },
                    { id: 'average', label: '处于平均' },
                    { id: 'worse', label: '低于平均' }
                  ]}
                />
              </div>
            </div>

            {/* Operational Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                运营支持
                <Tooltip text="核心关注：这些支持的钱谁出？（品牌方还是加盟商）">
                  <Info size={14} className="text-neutral-400 cursor-help no-print" />
                </Tooltip>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'takeout', label: '外卖代运营', key: 'takeoutManagement' },
                  { id: 'influencer', label: '达人推广', key: 'influencerPromotion' },
                  { id: 'daily', label: '日常带店', key: 'dailyOperation' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-100 relative">
                    <span className="text-xs font-bold text-neutral-600">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUpdate({ [item.key]: !franchise[item.key as keyof FranchiseAnalysis] })}
                        className={cn(
                          "w-10 h-6 rounded-full transition-all relative no-print",
                          franchise[item.key as keyof FranchiseAnalysis] ? "bg-orange-600" : "bg-neutral-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          franchise[item.key as keyof FranchiseAnalysis] ? "left-5" : "left-1"
                        )} />
                      </button>
                      <span className="hidden print:inline text-xs font-bold text-orange-600">
                        {franchise[item.key as keyof FranchiseAnalysis] ? '是' : '否'}
                      </span>
                      {franchise[item.key as keyof FranchiseAnalysis] && (
                        <div className="hidden print:block absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] shadow-sm">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
