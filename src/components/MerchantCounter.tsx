import React, { useState, useEffect } from 'react';
import { Plus, Minus, AlertTriangle, CheckCircle2, Pencil, Users as UsersIcon, ShoppingBag, Store, Calendar, Clock, Trash2, History, X, Play, Square, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import { Merchant, MerchantRecord, DayType } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { ImageUploader } from './ImageUploader';
import { motion, AnimatePresence } from 'motion/react';

interface MerchantCounterProps {
  merchant: Merchant;
  onUpdate: (updates: Partial<Merchant>) => void;
  isFocusMode?: boolean;
}

const DAY_TYPES: { value: DayType; label: string }[] = [
  { value: 'weekday', label: '周中' },
  { value: 'weekend', label: '周末' },
  { value: 'holiday', label: '节假日' },
];

const TIME_PERIODS = ['早市', '午市', '下午茶', '晚市', '夜宵'];

export const MerchantCounter: React.FC<MerchantCounterProps> = ({ merchant, onUpdate, isFocusMode }) => {
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);
  const isSuspicious = merchant.isBrushing || merchant.isFakeCustomers || merchant.isModifiedPOS;

  const records = merchant.records || [];
  const activeRecord = records.find(r => r.id === activeRecordId);

  // Focus Mode Auto-start Record
  useEffect(() => {
    if (isFocusMode && !activeRecordId) {
      const existingActive = records.find(r => r.startTime && !r.endTime);
      if (existingActive) {
        setActiveRecordId(existingActive.id);
      } else {
        handleAddRecord(true); // Start with timer
      }
    }
  }, [isFocusMode]);

  // Timer Update Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRecord?.startTime && !activeRecord?.endTime) {
      interval = setInterval(() => {
        const diff = Date.now() - activeRecord.startTime!;
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else if (activeRecord?.startTime && activeRecord?.endTime) {
      const diff = activeRecord.endTime - activeRecord.startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    } else {
      setElapsedTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [activeRecord?.startTime, activeRecord?.endTime]);

  // Calculate averages for summary (Grouped by Date)
  const summaryData = React.useMemo(() => {
    if (records.length === 0) return {
      customerInflow: merchant.customerInflow,
      orderCount: merchant.orderCount,
      takeoutOrderCount: merchant.takeoutOrderCount || 0,
      averageTransactionValue: merchant.averageTransactionValue || 0,
      employeeCount: merchant.employeeCount || 0,
    };

    // Group by date string
    const dailyGroups: Record<string, MerchantRecord[]> = {};
    records.forEach(r => {
      const dateStr = new Date(r.date).toLocaleDateString();
      if (!dailyGroups[dateStr]) dailyGroups[dateStr] = [];
      dailyGroups[dateStr].push(r);
    });

    const dayCount = Object.keys(dailyGroups).length;
    
    // Sum up each day's totals
    const dailyTotals = Object.values(dailyGroups).map(dayRecords => ({
      customerInflow: dayRecords.reduce((sum, r) => sum + r.customerInflow, 0),
      orderCount: dayRecords.reduce((sum, r) => sum + r.orderCount, 0),
      takeoutOrderCount: dayRecords.reduce((sum, r) => sum + (r.takeoutOrderCount || 0), 0),
      // For transaction value and employee count, we take the average of the day's records
      averageTransactionValue: dayRecords.reduce((sum, r) => sum + (r.averageTransactionValue || 0), 0) / dayRecords.length,
      employeeCount: dayRecords.reduce((sum, r) => sum + (r.employeeCount || 0), 0) / dayRecords.length,
    }));

    // Average across days
    return {
      customerInflow: Math.round(dailyTotals.reduce((sum, d) => sum + d.customerInflow, 0) / dayCount),
      orderCount: Math.round(dailyTotals.reduce((sum, d) => sum + d.orderCount, 0) / dayCount),
      takeoutOrderCount: Math.round(dailyTotals.reduce((sum, d) => sum + d.takeoutOrderCount, 0) / dayCount),
      averageTransactionValue: parseFloat((dailyTotals.reduce((sum, d) => sum + d.averageTransactionValue, 0) / dayCount).toFixed(2)),
      employeeCount: Math.round(dailyTotals.reduce((sum, d) => sum + d.employeeCount, 0) / dayCount),
    };
  }, [records, merchant]);

  // Use active record data if available, otherwise use summary data
  const data = activeRecord || summaryData;
  const isSummary = activeRecordId === null;

  const dailyRevenue = (data.orderCount + (data.takeoutOrderCount || 0)) * (data.averageTransactionValue || 0);
  const monthlyRevenue = dailyRevenue * 30;

  const handleUpdateData = (updates: Partial<MerchantRecord | Merchant>) => {
    if (isSummary) return; // Summary is read-only
    
    if (activeRecordId) {
      onUpdate({
        records: records.map(r => r.id === activeRecordId ? { ...r, ...updates } : r)
      });
    }
  };

  const handleAddRecord = (startTimer: boolean = false) => {
    const now = Date.now();
    const newRecord: MerchantRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: now,
      dayType: 'weekday',
      timePeriod: '午市',
      startTime: startTimer ? now : undefined,
      customerInflow: 0,
      orderCount: 0,
      takeoutOrderCount: 0,
      averageTransactionValue: summaryData.averageTransactionValue || 0,
      employeeCount: summaryData.employeeCount || 0,
    };
    onUpdate({
      records: [newRecord, ...records]
    });
    setActiveRecordId(newRecord.id);
  };

  const handleStartTimer = () => {
    if (activeRecordId) {
      handleUpdateData({ startTime: Date.now(), endTime: undefined });
    }
  };

  const handleStopTimer = () => {
    if (activeRecordId && activeRecord?.startTime) {
      handleUpdateData({ endTime: Date.now() });
    }
  };

  const handleDeleteRecord = (id: string) => {
    onUpdate({
      records: records.filter(r => r.id !== id)
    });
    if (activeRecordId === id) setActiveRecordId(null);
  };

  return (
    <div className={cn(
      "bg-white rounded-3xl border transition-all",
      isFocusMode ? "p-8 shadow-xl border-neutral-100 ring-4 ring-orange-500/10" : "p-5 border-neutral-200",
      isSuspicious && "border-orange-200 bg-orange-50/30"
    )}>
      {/* Focus Mode Header */}
      {isFocusMode && (
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 animate-pulse">
            <Timer size={14} /> 专注蹲点中
          </div>
          <div className="text-7xl font-black text-neutral-900 tabular-nums tracking-tighter mb-2">
            {elapsedTime}
          </div>
          <div className="text-neutral-400 font-bold text-sm">
            已蹲点时长 · {activeRecord?.timePeriod || '实时观察'}
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 group relative">
          <div className="flex items-center gap-2">
            <input 
              className={cn(
                "font-black text-neutral-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-orange-500 rounded-lg px-1 -ml-1 w-full transition-all",
                isFocusMode ? "text-3xl text-center" : "text-lg"
              )}
              value={merchant.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
            {!isFocusMode && <Pencil size={14} className="text-neutral-300 group-hover:text-orange-600 transition-colors flex-shrink-0" />}
          </div>
          <div className={cn("flex items-center gap-2 mt-1", isFocusMode && "justify-center")}>
            {isSuspicious ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                <AlertTriangle size={12} /> 疑似非真实数据
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                <CheckCircle2 size={12} /> 真实度高
              </span>
            )}
          </div>
        </div>
        {!isFocusMode && (
          <button 
            onClick={() => handleAddRecord()}
            className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl text-[10px] font-bold transition-all"
          >
            <Plus size={12} /> 新增记录
          </button>
        )}
      </div>

      {/* Record Selector (Only if records exist) */}
      {!isFocusMode && records.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveRecordId(null)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border",
              isSummary ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-200 text-neutral-400"
            )}
          >
            多日平均汇总
          </button>
          {records.map(record => (
            <div key={record.id} className="relative group/record">
              <button 
                onClick={() => setActiveRecordId(record.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border flex items-center gap-1.5",
                  activeRecordId === record.id ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-neutral-200 text-neutral-400"
                )}
              >
                <History size={10} />
                {new Date(record.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} · {record.timePeriod}
                {record.startTime && !record.endTime && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteRecord(record.id); }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/record:opacity-100 transition-opacity"
              >
                <X size={8} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Record Settings & Timer Controls */}
      {activeRecord && (
        <div className={cn(
          "mb-6 p-4 bg-neutral-50 rounded-2xl grid gap-4",
          isFocusMode ? "grid-cols-1" : "grid-cols-3"
        )}>
          {!isFocusMode && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> 具体日期
                </label>
                <input 
                  type="date"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={new Date(activeRecord.date).toISOString().split('T')[0]}
                  onChange={(e) => handleUpdateData({ date: new Date(e.target.value).getTime() })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> 类型
                </label>
                <select 
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={activeRecord.dayType}
                  onChange={(e) => handleUpdateData({ dayType: e.target.value as DayType })}
                >
                  {DAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> 时间段
                </label>
                <select 
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={activeRecord.timePeriod}
                  onChange={(e) => handleUpdateData({ timePeriod: e.target.value })}
                >
                  {TIME_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Timer Controls */}
          <div className={cn("space-y-2", !isFocusMode && "col-span-3 pt-2 border-t border-neutral-200")}>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <Timer size={12} /> 计时录入
              </label>
              {!isFocusMode && <span className="text-xs font-mono font-bold text-neutral-600">{elapsedTime}</span>}
            </div>
            <div className="flex gap-2">
              {!activeRecord.startTime || activeRecord.endTime ? (
                <button 
                  onClick={handleStartTimer}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Play size={14} /> 开始计时
                </button>
              ) : (
                <button 
                  onClick={handleStopTimer}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Square size={14} /> 停止计时
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Counters and Inputs */}
        <div className={cn("space-y-6", isFocusMode && "md:col-span-2")}>
          {/* Customer Inflow Counter */}
          <div className="space-y-2">
            <label className={cn(
              "text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1",
              isFocusMode && "justify-center"
            )}>
              <UsersIcon size={12} /> {isSummary ? "平均进客量" : "进客量 (实时计数)"}
            </label>
            <div className={cn("flex items-center justify-between p-1.5 rounded-2xl", isSummary ? "bg-neutral-200/50" : "bg-neutral-100")}>
              <button 
                onClick={() => handleUpdateData({ customerInflow: Math.max(0, data.customerInflow - 1) })}
                disabled={isSummary}
                className={cn(
                  "flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-neutral-50 active:scale-95 transition-all text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed",
                  isFocusMode ? "w-24 h-24" : "w-10 h-10"
                )}
              >
                <Minus size={isFocusMode ? 32 : 18} />
              </button>
              <span className={cn("font-black tabular-nums", isFocusMode ? "text-8xl" : "text-xl", isSummary && "text-neutral-500")}>
                {data.customerInflow}
              </span>
              <button 
                onClick={() => handleUpdateData({ customerInflow: data.customerInflow + 1 })}
                disabled={isSummary}
                className={cn(
                  "flex items-center justify-center bg-neutral-900 rounded-xl shadow-sm hover:bg-neutral-800 active:scale-95 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed",
                  isFocusMode ? "w-24 h-24" : "w-10 h-10"
                )}
              >
                <Plus size={isFocusMode ? 32 : 18} />
              </button>
            </div>
          </div>

          {!isFocusMode && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* Order Count */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <Store size={12} /> {isSummary ? "平均堂食单量" : "堂食单量"}
                  </label>
                  <input 
                    type="number"
                    min="0"
                    disabled={isSummary}
                    className={cn(
                      "w-full border border-neutral-200 rounded-xl px-3 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all",
                      isSummary ? "bg-neutral-200/50 text-neutral-500 cursor-not-allowed" : "bg-neutral-50"
                    )}
                    value={data.orderCount}
                    onChange={(e) => handleUpdateData({ orderCount: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Takeout Order Count */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <ShoppingBag size={12} /> {isSummary ? "平均外卖单量" : "外卖单量"}
                  </label>
                  <input 
                    type="number"
                    min="0"
                    disabled={isSummary}
                    className={cn(
                      "w-full border border-neutral-200 rounded-xl px-3 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all",
                      isSummary ? "bg-neutral-200/50 text-neutral-500 cursor-not-allowed" : "bg-neutral-50"
                    )}
                    value={data.takeoutOrderCount || 0}
                    onChange={(e) => handleUpdateData({ takeoutOrderCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Average Transaction Value */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{isSummary ? "平均客单价 (¥)" : "人均客单价 (¥)"}</label>
                  <input 
                    type="number"
                    min="0"
                    disabled={isSummary}
                    className={cn(
                      "w-full border border-neutral-200 rounded-xl px-3 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all",
                      isSummary ? "bg-neutral-200/50 text-neutral-500 cursor-not-allowed" : "bg-neutral-50"
                    )}
                    value={data.averageTransactionValue || 0}
                    onChange={(e) => handleUpdateData({ averageTransactionValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                {/* Employee Count */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{isSummary ? "平均员工数量" : "员工数量"}</label>
                  <input 
                    type="number"
                    min="0"
                    disabled={isSummary}
                    className={cn(
                      "w-full border border-neutral-200 rounded-xl px-3 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all",
                      isSummary ? "bg-neutral-200/50 text-neutral-500 cursor-not-allowed" : "bg-neutral-50"
                    )}
                    value={data.employeeCount || 0}
                    onChange={(e) => handleUpdateData({ employeeCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Revenue Summary */}
        {!isFocusMode && (
          <div className="bg-neutral-900 rounded-2xl p-5 text-white flex flex-col justify-center">
            <div className="mb-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                {isSummary ? "多日平均每日营业额" : "该记录每日营业额"}
              </p>
              <h4 className="text-2xl font-black text-orange-500">{formatCurrency(dailyRevenue)}</h4>
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                {isSummary ? "多日平均每月营业额" : "该记录每月营业额"}
              </p>
              <h4 className="text-2xl font-black text-white">{formatCurrency(monthlyRevenue)}</h4>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <p className="text-[10px] text-neutral-500 italic">
                {isSummary ? `基于 ${records.length} 条记录计算平均值` : `记录日期: ${formatDate(activeRecord.date)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Section */}
      {!isFocusMode && (
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <div 
            className="flex items-center justify-between cursor-pointer group mb-2"
            onClick={() => setIsPhotosExpanded(!isPhotosExpanded)}
          >
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest cursor-pointer">商家照片</label>
              <span className="text-[10px] text-neutral-300 font-bold">
                {merchant.images?.length || 0} 张
              </span>
            </div>
            <div className="p-1 rounded-lg text-neutral-300 group-hover:text-orange-600 transition-all">
              {isPhotosExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isPhotosExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <ImageUploader 
                    label="商家照片" 
                    images={merchant.images || []} 
                    onUpload={(url) => onUpdate({ images: [...(merchant.images || []), url] })}
                    onDelete={(url) => onUpdate({ images: (merchant.images || []).filter(u => u !== url) })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Flags */}
      {!isFocusMode && (
        <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-3 gap-2">
          <button 
            onClick={() => onUpdate({ isBrushing: !merchant.isBrushing })}
            className={cn(
              "py-2 rounded-lg text-[10px] font-bold transition-all border",
              merchant.isBrushing ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-neutral-200 text-neutral-400"
            )}
          >
            刷单
          </button>
          <button 
            onClick={() => onUpdate({ isFakeCustomers: !merchant.isFakeCustomers })}
            className={cn(
              "py-2 rounded-lg text-[10px] font-bold transition-all border",
              merchant.isFakeCustomers ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-neutral-200 text-neutral-400"
            )}
          >
            找人
          </button>
          <button 
            onClick={() => onUpdate({ isModifiedPOS: !merchant.isModifiedPOS })}
            className={cn(
              "py-2 rounded-lg text-[10px] font-bold transition-all border",
              merchant.isModifiedPOS ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-neutral-200 text-neutral-400"
            )}
          >
            改收银
          </button>
        </div>
      )}
    </div>
  );
};
