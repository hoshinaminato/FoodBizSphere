import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Merchant } from '../types';
import { MerchantCounter } from './MerchantCounter';

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
          <header className="px-8 py-6 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-900/20">
                <Maximize2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">专注蹲点模式</h2>
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">正在实时记录 {merchants.length} 个商家数据</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl transition-all active:scale-95"
            >
              <Minimize2 size={24} />
            </button>
          </header>

          {/* Grid */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
          <footer className="px-8 py-6 bg-neutral-900 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
              提示：所有数据实时保存。点击计数器按钮或直接修改数值。
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
