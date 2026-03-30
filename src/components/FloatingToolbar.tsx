import React, { useState, useRef } from 'react';
import { Calculator as CalculatorIcon, GripVertical, X, Minus, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator } from './Calculator';
import { WarningPanel } from './WarningPanel';
import { cn } from '../lib/utils';

export const FloatingToolbar: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'calculator' | 'warning' | null>(null);
  const isDraggingRef = useRef(false);
  const constraintsRef = useRef(null);

  return (
    <div 
      ref={constraintsRef} 
      className="fixed inset-0 pointer-events-none z-[9999] no-print"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        onDragStart={() => { isDraggingRef.current = true; }}
        onDragEnd={() => { 
          // Use a small timeout to ensure the click/tap event has passed
          setTimeout(() => { isDraggingRef.current = false; }, 100);
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-10 left-10 pointer-events-auto flex flex-col items-center gap-3"
      >
        <AnimatePresence mode="popLayout">
          {!activeTool ? (
            <div className="flex flex-col gap-3 items-center">
              {/* Calculator Icon */}
              <motion.button
                key="calc-icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => {
                  if (!isDraggingRef.current) {
                    setActiveTool('calculator');
                  }
                }}
                className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-neutral-800 transition-all active:scale-90 group relative"
              >
                <CalculatorIcon size={20} />
                <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  打开计算器
                </div>
              </motion.button>

              {/* Warning Icon */}
              <motion.button
                key="warning-icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => {
                  if (!isDraggingRef.current) {
                    setActiveTool('warning');
                  }
                }}
                className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-700 transition-all active:scale-90 group relative border-2 border-red-400"
              >
                <AlertTriangle size={20} className="animate-pulse" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  避坑指南
                </div>
              </motion.button>
            </div>
          ) : (
            <motion.div
              key="tool-content"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative flex flex-col items-center"
            >
              {/* Drag Handle */}
              <div className="absolute -top-10 left-0 right-0 flex justify-center">
                <div className="bg-neutral-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 cursor-move shadow-lg border border-white/10">
                  <GripVertical size={14} className="text-neutral-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">可拖拽工具栏</span>
                </div>
              </div>

              {activeTool === 'calculator' ? (
                <Calculator onClose={() => setActiveTool(null)} />
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setActiveTool(null)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-50 border-2 border-white hover:bg-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <WarningPanel />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
