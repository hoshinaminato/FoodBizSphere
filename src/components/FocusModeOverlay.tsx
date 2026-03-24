import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, Timer, Save, Play, Square } from 'lucide-react';
import { Merchant, MerchantRecord } from '../types';
import { MerchantCounter } from './MerchantCounter';
import { cn, getChineseTimePeriod, getDayType } from '../lib/utils';

interface FocusModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  merchants: Merchant[];
  onUpdateMerchant: (id: string, updates: Partial<Merchant>) => void;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ 
  isOpen, 
  onClose, 
  merchants, 
  onUpdateMerchant 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [tempData, setTempData] = useState<Record<string, { dineIn: number; takeout: number }>>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [excludedMerchantIds, setExcludedMerchantIds] = useState<Set<string>>(new Set());

  const toggleExclude = (id: string) => {
    setExcludedMerchantIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    let interval: any;
    if (isRecording && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  const toggleRecording = () => {
    if (!isRecording) {
      // Start Recording
      setStartTime(Date.now());
      setIsRecording(true);
      const initialData: Record<string, { dineIn: number; takeout: number }> = {};
      merchants.forEach(m => {
        if (!excludedMerchantIds.has(m.id)) {
          initialData[m.id] = { dineIn: 0, takeout: 0 };
        }
      });
      setTempData(initialData);
    } else {
      // Stop & Save
      const endTime = Date.now();
      const timePeriod = `${new Date(startTime!).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
      
      merchants.forEach(merchant => {
        if (excludedMerchantIds.has(merchant.id)) return;
        
        const data = tempData[merchant.id] || { dineIn: 0, takeout: 0 };
        const newRecord: MerchantRecord = {
          id: Math.random().toString(36).substr(2, 9),
          date: startTime!,
          startTime: startTime!,
          endTime: endTime,
          dayType: getDayType(new Date(startTime!)),
          timePeriod: getChineseTimePeriod(new Date(startTime!)),
          dineInCustomerInflow: data.dineIn,
          takeoutCustomerInflow: data.takeout,
          averageTransactionValue: merchant.records?.[0]?.averageTransactionValue || 0,
          employeeCount: merchant.records?.[0]?.employeeCount || 0,
        };
        onUpdateMerchant(merchant.id, {
          records: [newRecord, ...(merchant.records || [])]
        });
      });

      setIsRecording(false);
      setStartTime(null);
      setTempData({});
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setStartTime(null);
    setTempData({});
  };

  const updateTempData = (merchantId: string, updates: { dineIn?: number; takeout?: number }) => {
    setTempData(prev => ({
      ...prev,
      [merchantId]: {
        ...prev[merchantId],
        ...updates
      }
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-neutral-950 flex flex-col"
        >
          {/* Header */}
          <header className="px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-800">
            <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
              <div className="p-2 md:p-3 bg-orange-600 rounded-xl md:rounded-2xl text-white shadow-lg shadow-orange-900/20">
                <Maximize2 size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white">专注蹲点模式</h2>
                <p className="text-neutral-500 text-[10px] md:text-sm font-bold uppercase tracking-widest">正在实时记录 {merchants.length} 个商家数据</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {isRecording && (
                <>
                  <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl shrink-0">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 font-black tabular-nums text-sm md:text-base">{formatTime(elapsedTime)}</span>
                  </div>
                  <button 
                    onClick={cancelRecording}
                    className="px-4 md:px-6 py-3 md:py-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl md:rounded-2xl font-black text-xs md:text-base transition-all active:scale-95 shrink-0"
                  >
                    取消
                  </button>
                </>
              )}
              <button 
                onClick={toggleRecording}
                className={cn(
                  "px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shrink-0 text-xs md:text-base flex-1 md:flex-none justify-center",
                  isRecording 
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20" 
                    : "bg-white hover:bg-neutral-100 text-neutral-900 shadow-lg shadow-neutral-900/20"
                )}
              >
                {isRecording ? (
                  <>
                    <Square size={16} className="md:w-5 md:h-5 fill-current" />
                    停止并保存
                  </>
                ) : (
                  <>
                    <Play size={16} className="md:w-5 md:h-5 fill-current" />
                    开始计时记录
                  </>
                )}
              </button>
              <button 
                onClick={onClose}
                className="p-3 md:p-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl md:rounded-2xl transition-all active:scale-95 shrink-0"
              >
                <Minimize2 size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </header>

          {/* Grid */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
              {merchants.map(merchant => (
                <motion.div 
                  key={merchant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MerchantCounter 
                    merchant={merchant} 
                    onUpdate={(updates) => onUpdateMerchant(merchant.id, updates)}
                    isFocusMode
                    isExcluded={excludedMerchantIds.has(merchant.id)}
                    onToggleExclude={() => toggleExclude(merchant.id)}
                    tempData={isRecording ? tempData[merchant.id] : undefined}
                    onTempUpdate={(updates) => updateTempData(merchant.id, updates)}
                  />
                </motion.div>
              ))}
              {merchants.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-32 text-neutral-600">
                  <p className="text-xl font-bold">暂无选中的商家</p>
                  <p className="mt-2">请先在商圈中添加或选择需要蹲点的商家</p>
                </div>
              )}
            </div>
          </main>

          {/* Footer Info */}
          <footer className="px-4 md:px-8 py-4 md:py-6 bg-neutral-900 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center md:text-left">
              {isRecording 
                ? "正在进行实时记录，点击计数器按钮增加次数。点击“停止并保存”将数据持久化。" 
                : "提示：点击“开始计时记录”开始一段新的观察。"}
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
