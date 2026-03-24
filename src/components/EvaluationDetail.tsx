import React, { useState } from 'react';
import { ChevronLeft, Save, Pencil, MapPin, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import { Evaluation, BusinessDistrict } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { InputField } from './ui/InputField';
import { ImageUploader } from './ImageUploader';
import { motion, AnimatePresence } from 'motion/react';

interface EvaluationDetailProps {
  activeEval: Evaluation;
  districts: BusinessDistrict[];
  onUpdate: (updates: Partial<Evaluation>) => void;
  onBack: () => void;
}

export const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ 
  activeEval, 
  districts,
  onUpdate, 
  onBack 
}) => {
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);
  const [isSetupCostHidden, setIsSetupCostHidden] = useState(false);

  const handlePrint = () => {
    // Ensure the window has focus before printing
    window.focus();
    // Small delay to ensure focus and layout are ready
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const isIframe = window.self !== window.top;

  // Calculations
  const setupCost = (
    (activeEval.rent * activeEval.paymentMethod) + 
    activeEval.deposit + 
    activeEval.transferFee + 
    activeEval.franchiseFee + 
    activeEval.renovationFee + 
    activeEval.equipmentFee + 
    activeEval.initialMaterialFee
  );

  const dailyFixedCost = (
    (activeEval.monthlyLabor / 30) + 
    (activeEval.monthlyUtilities / 30) + 
    (activeEval.rent / 30)
  );

  const dailyBreakeven = activeEval.grossMargin > 0 ? dailyFixedCost / activeEval.grossMargin : 0;

  const dailyGrossProfit = activeEval.estimatedDailyRevenue * activeEval.grossMargin;
  const monthlyGrossProfit = dailyGrossProfit * 30;
  const monthlyNetProfit = (dailyGrossProfit - dailyFixedCost) * 30;

  const paybackPeriod = (setupCost > 0 && monthlyNetProfit > 0) ? (setupCost / monthlyNetProfit).toFixed(1) : "无法回本";

  const selectedDistrict = districts.find(d => d.id === activeEval.districtId);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-neutral-500 font-bold flex items-center gap-1">
          <ChevronLeft size={18} /> 返回列表
        </button>
      </div>

      {/* Title Section */}
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
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <p className="text-[10px] md:text-sm text-neutral-400 font-medium whitespace-nowrap">评估创建于 {formatDate(activeEval.createdAt)}</p>
            {selectedDistrict && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg whitespace-nowrap">
                <MapPin size={10} /> {selectedDistrict.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 no-print">
           <div className="flex gap-2">
             <button 
               onClick={handlePrint}
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

      {/* District Selector */}
      <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
          <h3 className="text-lg font-bold">关联商圈</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {districts.map(district => (
            <button 
              key={district.id}
              onClick={() => onUpdate({ districtId: activeEval.districtId === district.id ? undefined : district.id })}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border",
                activeEval.districtId === district.id 
                  ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100" 
                  : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
              )}
            >
              <MapPin size={14} /> {district.name}
            </button>
          ))}
          {districts.length === 0 && (
            <p className="text-sm text-neutral-400 italic">暂无商圈，请先在“商圈与商家”标签页中创建。</p>
          )}
        </div>
      </section>

      {/* Metrics Grid */}
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
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Costs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
              <h3 className="text-lg font-bold">基础信息与建店成本</h3>
            </div>
            <button 
              onClick={() => setIsSetupCostHidden(!isSetupCostHidden)}
              className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors no-print"
            >
              {isSetupCostHidden ? "显示全部" : "隐藏建店数据"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isSetupCostHidden && (
              <InputField 
                label="面积 (平)" 
                value={activeEval.area} 
                onChange={(v) => onUpdate({ area: v })}
                suffix="㎡"
              />
            )}
            <InputField 
              label="房租 (元/月)" 
              value={activeEval.rent} 
              onChange={(v) => onUpdate({ rent: v })}
              suffix="¥"
              tooltip="此项不仅计入首付成本，也会自动均摊到每日固定成本中。"
            />
            {!isSetupCostHidden && (
              <>
                <InputField 
                  label="支付方式 (月)" 
                  value={activeEval.paymentMethod} 
                  onChange={(v) => onUpdate({ paymentMethod: v })}
                  suffix="月"
                  tooltip="指首付几个月的房租，如押一付三则填3"
                />
                <InputField 
                  label="押金 (元)" 
                  value={activeEval.deposit} 
                  onChange={(v) => onUpdate({ deposit: v })}
                  suffix="¥"
                />
                <InputField 
                  label="转让/中介费" 
                  value={activeEval.transferFee} 
                  onChange={(v) => onUpdate({ transferFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="加盟/技术费" 
                  value={activeEval.franchiseFee} 
                  onChange={(v) => onUpdate({ franchiseFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="装修 + 广告" 
                  value={activeEval.renovationFee} 
                  onChange={(v) => onUpdate({ renovationFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="设备费用" 
                  value={activeEval.equipmentFee} 
                  onChange={(v) => onUpdate({ equipmentFee: v })}
                  suffix="¥"
                />
                <InputField 
                  label="首批物料" 
                  value={activeEval.initialMaterialFee} 
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

        {/* Operating Costs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
            <h3 className="text-lg font-bold">运营成本与利润</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField 
              label="每月人工" 
              value={activeEval.monthlyLabor} 
              onChange={(v) => onUpdate({ monthlyLabor: v })}
              suffix="¥"
            />
            <InputField 
              label="水电杂费 (月)" 
              value={activeEval.monthlyUtilities} 
              onChange={(v) => onUpdate({ monthlyUtilities: v })}
              suffix="¥"
            />
            <InputField 
              label="毛利率" 
              value={activeEval.grossMargin * 100} 
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
              value={activeEval.estimatedDailyRevenue} 
              onChange={(v) => onUpdate({ estimatedDailyRevenue: v })}
              suffix="¥"
              tooltip="您预期的每日平均营业额。"
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
      </div>

      {/* Image Upload Section */}
      <section className="space-y-6">
        <div 
          className="flex items-center justify-between cursor-pointer group no-print"
          onClick={() => setIsPhotosExpanded(!isPhotosExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
            <h3 className="text-lg font-bold">实地考察照片</h3>
            <span className="text-xs text-neutral-400 font-medium ml-2">
              {Object.values(activeEval.images).flat().length} 张已上传
            </span>
          </div>
          <div className="p-2 bg-neutral-100 rounded-xl text-neutral-500 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
            {isPhotosExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {(isPhotosExpanded || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                <ImageUploader 
                  label="菜品照片" 
                  images={activeEval.images.dish} 
                  onUpload={(url) => onUpdate({ images: { ...activeEval.images, dish: [...activeEval.images.dish, url] } })}
                  onDelete={(url) => onUpdate({ images: { ...activeEval.images, dish: activeEval.images.dish.filter(u => u !== url) } })}
                />
                <ImageUploader 
                  label="菜单/价目表" 
                  images={activeEval.images.menu} 
                  onUpload={(url) => onUpdate({ images: { ...activeEval.images, menu: [...activeEval.images.menu, url] } })}
                  onDelete={(url) => onUpdate({ images: { ...activeEval.images, menu: activeEval.images.menu.filter(u => u !== url) } })}
                />
                <ImageUploader 
                  label="店铺内部" 
                  images={activeEval.images.interior} 
                  onUpload={(url) => onUpdate({ images: { ...activeEval.images, interior: [...activeEval.images.interior, url] } })}
                  onDelete={(url) => onUpdate({ images: { ...activeEval.images, interior: activeEval.images.interior.filter(u => u !== url) } })}
                />
                <ImageUploader 
                  label="外部环境" 
                  images={activeEval.images.exterior} 
                  onUpload={(url) => onUpdate({ images: { ...activeEval.images, exterior: [...activeEval.images.exterior, url] } })}
                  onDelete={(url) => onUpdate({ images: { ...activeEval.images, exterior: activeEval.images.exterior.filter(u => u !== url) } })}
                />
                <ImageUploader 
                  label="评价/口碑" 
                  images={activeEval.images.reviews} 
                  onUpload={(url) => onUpdate({ images: { ...activeEval.images, reviews: [...activeEval.images.reviews, url] } })}
                  onDelete={(url) => onUpdate({ images: { ...activeEval.images, reviews: activeEval.images.reviews.filter(u => u !== url) } })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </div>
  );
};
