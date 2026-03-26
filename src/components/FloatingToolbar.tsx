import React, { useState, useRef } from 'react';
import { Calculator as CalculatorIcon, GripVertical, X, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator } from './Calculator';
import { cn } from '../lib/utils';

export const FloatingToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        initial={{ x: 20, y: 100 }}
        className="absolute pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="icon"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => {
                if (!isDraggingRef.current) {
                  setIsOpen(true);
                }
              }}
              className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-neutral-800 transition-all active:scale-90 group relative"
            >
              <CalculatorIcon size={20} />
              <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                打开计算器
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="calculator"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative"
            >
              {/* Drag Handle */}
              <div className="absolute -top-10 left-0 right-0 flex justify-center">
                <div className="bg-neutral-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 cursor-move shadow-lg border border-white/10">
                  <GripVertical size={14} className="text-neutral-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">可拖拽工具栏</span>
                </div>
              </div>

              <Calculator onClose={() => setIsOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
