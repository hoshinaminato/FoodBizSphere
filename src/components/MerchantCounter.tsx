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
  isExcluded?: boolean;
  onToggleExclude?: () => void;
  tempData?: { dineIn: number; takeout: number };
  onTempUpdate?: (updates: { dineIn?: number; takeout?: number }) => void;
}

const DAY_TYPES: { value: DayType; label: string }[] = [
  { value: 'weekday', label: '周中' },
  { value: 'weekend', label: '周末' },
  { value: 'holiday', label: '节假日' },
];

const TIME_PERIODS = ['早市', '午市', '下午茶', '晚市', '夜宵'];

export const MerchantCounter: React.FC<MerchantCounterProps> = ({ 
  merchant, 
  onUpdate, 
  isFocusMode,
  isExcluded,
  onToggleExclude,
  tempData,
  onTempUpdate
}) => {
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const isSuspicious = merchant.isBrushing || merchant.isFakeCustomers || merchant.isModifiedPOS;

  const records = merchant.records || [];
  const activeRecord = records.find(r => r.id === activeRecordId);

  // Focus Mode Active Record Sync
  useEffect(() => {
    if (isFocusMode && !activeRecordId) {
      const existingActive = records[0]; 
      if (existingActive) {
        setActiveRecordId(existingActive.id);
      }
    }
  }, [isFocusMode, records, activeRecordId]);

  // Calculate averages for summary (Grouped by Date)
  const summaryData = React.useMemo(() => {
    if (records.length === 0) return {
      dineInCustomerInflow: merchant.dineInCustomerInflow,
      takeoutCustomerInflow: merchant.takeoutCustomerInflow,
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
      dineInCustomerInflow: dayRecords.reduce((sum, r) => sum + r.dineInCustomerInflow, 0),
      takeoutCustomerInflow: dayRecords.reduce((sum, r) => sum + r.takeoutCustomerInflow, 0),
      // For transaction value and employee count, we take the average of the day's records
      averageTransactionValue: dayRecords.reduce((sum, r) => sum + (r.averageTransactionValue || 0), 0) / dayRecords.length,
      employeeCount: dayRecords.reduce((sum, r) => sum + (r.employeeCount || 0), 0) / dayRecords.length,
    }));

    // Average across days
    return {
      dineInCustomerInflow: Math.round(dailyTotals.reduce((sum, d) => sum + d.dineInCustomerInflow, 0) / dayCount),
      takeoutCustomerInflow: Math.round(dailyTotals.reduce((sum, d) => sum + d.takeoutCustomerInflow, 0) / dayCount),
      averageTransactionValue: parseFloat((dailyTotals.reduce((sum, d) => sum + d.averageTransactionValue, 0) / dayCount).toFixed(2)),
      employeeCount: Math.round(dailyTotals.reduce((sum, d) => sum + d.employeeCount, 0) / dayCount),
    };
  }, [records, merchant]);

  // Use active record data if available, otherwise use summary data
  const data = tempData ? { 
    ...summaryData, 
    dineInCustomerInflow: tempData.dineIn, 
    takeoutCustomerInflow: tempData.takeout 
  } : (activeRecord || summaryData);
  
  // In focus mode, if we're not recording (no tempData), we treat it as a summary (read-only)
  const isSummary = isFocusMode ? !tempData : (activeRecordId === null);

  const dailyRevenue = (data.dineInCustomerInflow + data.takeoutCustomerInflow) * (data.averageTransactionValue || 0);
  const monthlyRevenue = dailyRevenue * 30;

  const handleUpdateData = (updates: Partial<MerchantRecord | Merchant>) => {
    if (tempData && onTempUpdate) {
      const tempUpdates: { dineIn?: number; takeout?: number } = {};
      if ('dineInCustomerInflow' in updates) tempUpdates.dineIn = updates.dineInCustomerInflow as number;
      if ('takeoutCustomerInflow' in updates) tempUpdates.takeout = updates.takeoutCustomerInflow as number;
      onTempUpdate(tempUpdates);
      return;
    }

    if (isFocusMode && !tempData) return; // In focus mode, must use the recording session

    if (isSummary) return; // Summary is read-only
    
    let currentActiveId = activeRecordId;
    let currentRecords = records;

    // Lazy Record Creation in Focus Mode
    if (isFocusMode && !currentActiveId) {
      const now = Date.now();
      const newRecord: MerchantRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: now,
        dayType: 'weekday',
        timePeriod: '午市',
        dineInCustomerInflow: 0,
        takeoutCustomerInflow: 0,
        averageTransactionValue: summaryData.averageTransactionValue || 0,
        employeeCount: summaryData.employeeCount || 0,
        ...(updates as Partial<MerchantRecord>)
      };
      onUpdate({
        records: [newRecord, ...records]
      });
      setActiveRecordId(newRecord.id);
      return;
    }

    if (currentActiveId) {
      onUpdate({
        records: currentRecords.map(r => r.id === currentActiveId ? { ...r, ...updates } : r)
      });
    }
  };

  const handleAddRecord = () => {
    const now = Date.now();
    const newRecord: MerchantRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: now,
      dayType: 'weekday',
      timePeriod: '午市',
      dineInCustomerInflow: 0,
      takeoutCustomerInflow: 0,
      averageTransactionValue: summaryData.averageTransactionValue || 0,
      employeeCount: summaryData.employeeCount || 0,
    };
    onUpdate({
      records: [newRecord, ...records]
    });
    setActiveRecordId(newRecord.id);
  };

  const handleDeleteRecord = (id: string) => {
    onUpdate({
      records: records.filter(r => r.id !== id)
    });
    if (activeRecordId === id) setActiveRecordId(null);
  };

  return (
    <div className={cn(
      "bg-white rounded-3xl border transition-all relative",
      isFocusMode ? "p-4 lg:p-8 shadow-xl border-neutral-100 ring-4 ring-orange-500/10" : "p-4 md:p-5 border-neutral-200",
      isSuspicious && "border-orange-200 bg-orange-50/30",
      isExcluded && "opacity-40 grayscale"
    )}>
      {isFocusMode && onToggleExclude && (
        <button 
          onClick={onToggleExclude}
          className={cn(
            "absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10",
            isExcluded 
              ? "bg-orange-600 text-white" 
              : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
          )}
        >
          {isExcluded ? "已排除" : "排除记录"}
        </button>
      )}

      <div className={cn("flex justify-between items-start", isExpanded ? "mb-6" : "mb-0")}>
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-neutral-100 rounded-xl text-neutral-400 hover:text-orange-600 transition-all active:scale-90"
            title={isExpanded ? "收起" : "展开"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <div className="flex-1 group relative">
            <div className="flex items-center gap-2">
              <input 
                className={cn(
                  "font-black text-neutral-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-orange-500 rounded-lg px-1 -ml-1 w-full transition-all",
                  isFocusMode ? "text-xl md:text-3xl text-center" : "text-lg"
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
              {!isExpanded && (
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-2 border-l border-neutral-200 pl-2">
                  {records.length} 条记录 · ¥{formatCurrency(dailyRevenue)}/日
                </span>
              )}
            </div>
          </div>
        </div>
        {!isFocusMode && isExpanded && (
          <button 
            onClick={() => handleAddRecord()}
            className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl text-[10px] font-bold transition-all"
          >
            <Plus size={12} /> 新增记录
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Focus Mode Header - Hidden timer here as it's moved to overlay */}
            {isFocusMode && (
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="text-neutral-400 font-bold text-sm">
                  {tempData ? '正在计时记录' : (activeRecord ? `正在记录 · ${activeRecord.timePeriod}` : '实时观察')}
                </div>
              </div>
            )}

            {/* Records Table (Only if records exist) */}
            {!isFocusMode && records.length > 0 && (
        <div className="mb-6 overflow-x-auto rounded-2xl border border-neutral-100 no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest">日期/时段</th>
                <th className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">堂食</th>
                <th className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">外卖</th>
                <th className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">客单价</th>
                <th className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">员工</th>
                <th className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right no-print">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                onClick={() => setActiveRecordId(null)}
                className={cn(
                  "cursor-pointer transition-colors border-b border-neutral-50 hover:bg-neutral-50/50",
                  isSummary ? "bg-orange-50/50" : ""
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", isSummary ? "bg-orange-500" : "bg-neutral-200")} />
                    <span className="text-xs font-black text-neutral-900">多日平均汇总</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">{summaryData.dineInCustomerInflow}</td>
                <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">{summaryData.takeoutCustomerInflow}</td>
                <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">¥{summaryData.averageTransactionValue}</td>
                <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">{summaryData.employeeCount}</td>
                <td className="px-4 py-3 text-right no-print">
                  <span className="text-[10px] font-bold text-neutral-300 uppercase">汇总</span>
                </td>
              </tr>
              {records.map(record => (
                <tr 
                  key={record.id}
                  onClick={() => setActiveRecordId(record.id)}
                  className={cn(
                    "cursor-pointer transition-colors border-b border-neutral-50 hover:bg-neutral-50/50",
                    activeRecordId === record.id ? "bg-orange-50/50" : ""
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", activeRecordId === record.id ? "bg-orange-500" : "bg-neutral-200")} />
                      <div>
                        <div className="text-xs font-black text-neutral-900">
                          {new Date(record.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} · {record.timePeriod}
                        </div>
                        {record.startTime && record.endTime && (
                          <div className="text-[9px] text-neutral-400 font-bold">
                            {new Date(record.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} - {new Date(record.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">{record.dineInCustomerInflow}</td>
                  <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">{record.takeoutCustomerInflow}</td>
                  <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">¥{record.averageTransactionValue}</td>
                  <td className="px-4 py-3 text-xs font-bold text-neutral-600 text-center">{record.employeeCount}</td>
                  <td className="px-4 py-3 text-right no-print">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteRecord(record.id); }}
                      className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Active Record Settings & Timer Controls */}
      {activeRecord && (
        <div className={cn(
          "mb-6 p-4 bg-neutral-50 rounded-2xl grid gap-4",
          isFocusMode ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"
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
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> 开始时间
                </label>
                <input 
                  type="time"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={activeRecord.startTime ? new Date(activeRecord.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(activeRecord.startTime || activeRecord.date);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    handleUpdateData({ startTime: newDate.getTime() });
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> 结束时间
                </label>
                <input 
                  type="time"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={activeRecord.endTime ? new Date(activeRecord.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(activeRecord.endTime || activeRecord.date);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    handleUpdateData({ endTime: newDate.getTime() });
                  }}
                />
              </div>
            </>
          )}

          {/* Save Controls */}
          <div className={cn("space-y-2", !isFocusMode && "col-span-3 pt-2 border-t border-neutral-200")}>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" /> 实时保存状态
              </label>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                已同步
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Counters and Inputs */}
        <div className={cn("space-y-6", isFocusMode && "md:col-span-2")}>
          {/* Dine-in Customer Inflow Counter */}
          <div className="space-y-2">
            <label className={cn(
              "text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1",
              isFocusMode && "justify-center"
            )}>
              <Store size={12} /> {isFocusMode ? (tempData ? "堂食进客量 (计时中)" : "堂食进客量 (未开始记录)") : (isSummary ? "平均堂食进客量" : "堂食进客量 (实时计数)")}
            </label>
            <div className={cn("flex items-center justify-between p-1.5 rounded-2xl", isSummary ? "bg-neutral-200/50" : "bg-neutral-100")}>
              <button 
                onClick={() => handleUpdateData({ dineInCustomerInflow: Math.max(0, data.dineInCustomerInflow - 1) })}
                disabled={isSummary}
                className={cn(
                  "flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-neutral-50 active:scale-95 transition-all text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed",
                  isFocusMode ? "w-14 h-14 md:w-20 md:h-20" : "w-10 h-10"
                )}
              >
                <Minus size={isFocusMode ? (window.innerWidth < 768 ? 20 : 24) : 18} />
              </button>
              <span className={cn("font-black tabular-nums", isFocusMode ? "text-3xl md:text-7xl" : "text-xl", isSummary && "text-neutral-500")}>
                {data.dineInCustomerInflow}
              </span>
              <button 
                onClick={() => handleUpdateData({ dineInCustomerInflow: data.dineInCustomerInflow + 1 })}
                disabled={isSummary}
                className={cn(
                  "flex items-center justify-center bg-neutral-900 rounded-xl shadow-sm hover:bg-neutral-800 active:scale-95 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed",
                  isFocusMode ? "w-14 h-14 md:w-20 md:h-20" : "w-10 h-10"
                )}
              >
                <Plus size={isFocusMode ? (window.innerWidth < 768 ? 20 : 24) : 18} />
              </button>
            </div>
          </div>

          {/* Takeout Customer Inflow Counter */}
          <div className="space-y-2">
            <label className={cn(
              "text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1",
              isFocusMode && "justify-center"
            )}>
              <ShoppingBag size={12} /> {isFocusMode ? (tempData ? "外卖进客量 (计时中)" : "外卖进客量 (未开始记录)") : (isSummary ? "平均外卖进客量" : "外卖进客量 (实时计数)")}
            </label>
            <div className={cn("flex items-center justify-between p-1.5 rounded-2xl", isSummary ? "bg-neutral-200/50" : "bg-neutral-100")}>
              <button 
                onClick={() => handleUpdateData({ takeoutCustomerInflow: Math.max(0, data.takeoutCustomerInflow - 1) })}
                disabled={isSummary}
                className={cn(
                  "flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-neutral-50 active:scale-95 transition-all text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed",
                  isFocusMode ? "w-14 h-14 md:w-20 md:h-20" : "w-10 h-10"
                )}
              >
                <Minus size={isFocusMode ? (window.innerWidth < 768 ? 20 : 24) : 18} />
              </button>
              <span className={cn("font-black tabular-nums", isFocusMode ? "text-3xl md:text-7xl" : "text-xl", isSummary && "text-neutral-500")}>
                {data.takeoutCustomerInflow}
              </span>
              <button 
                onClick={() => handleUpdateData({ takeoutCustomerInflow: data.takeoutCustomerInflow + 1 })}
                disabled={isSummary}
                className={cn(
                  "flex items-center justify-center bg-neutral-900 rounded-xl shadow-sm hover:bg-neutral-800 active:scale-95 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed",
                  isFocusMode ? "w-14 h-14 md:w-20 md:h-20" : "w-10 h-10"
                )}
              >
                <Plus size={isFocusMode ? (window.innerWidth < 768 ? 20 : 24) : 18} />
              </button>
            </div>
          </div>

          {!isFocusMode && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* Average Transaction Value */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{isSummary ? "平均客单价 (¥)" : "人均客单价 (¥)"}</label>
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
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{isSummary ? "平均员工数量" : "员工数量"}</label>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
