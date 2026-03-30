import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { ChevronRight, Hash, Menu, X, List } from 'lucide-react';

interface Anchor {
  id: string;
  label: string;
}

interface FloatingAnchorNavProps {
  anchors: Anchor[];
  className?: string;
}

export const FloatingAnchorNav: React.FC<FloatingAnchorNavProps> = ({ anchors, className }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio to find the most visible one
          const mostVisible = visibleEntries.reduce((prev, current) => 
            (current.intersectionRatio > prev.intersectionRatio) ? current : prev
          );
          
          setActiveId(prev => prev !== mostVisible.target.id ? mostVisible.target.id : prev);
        }
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
        rootMargin: '-5% 0px -65% 0px' 
      }
    );

    const observedElements: HTMLElement[] = [];
    anchors.forEach((anchor) => {
      const element = document.getElementById(anchor.id);
      if (element) {
        observer.observe(element);
        observedElements.push(element);
      }
    });

    return () => {
      observedElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [anchors]);

  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Version (xl and above) */}
      <div 
        className={cn(
          "fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col items-end gap-3 no-print",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {anchors.map((anchor, index) => {
            const isActive = activeId === anchor.id;
            return (
              <motion.button
                key={anchor.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => scrollToAnchor(anchor.id)}
                className="group flex items-center gap-3 outline-none"
              >
                <div className="flex flex-col items-end">
                  <motion.span 
                    animate={{ 
                      opacity: isHovered || isActive ? 1 : 0,
                      x: isHovered || isActive ? 0 : 10,
                      scale: isActive ? 1.05 : 1
                    }}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-colors whitespace-nowrap shadow-sm",
                      isActive 
                        ? "bg-orange-600 text-white" 
                        : "bg-white text-neutral-400 border border-neutral-100 group-hover:text-orange-600"
                    )}
                  >
                    {anchor.label}
                  </motion.span>
                </div>
                
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1.5 : 1,
                      backgroundColor: isActive ? '#ea580c' : '#e5e5e5'
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      isActive ? "bg-orange-600" : "bg-neutral-200 group-hover:bg-orange-300"
                    )}
                  />
                  {isActive && (
                    <motion.div 
                      layoutId="active-dot-ring"
                      className="absolute inset-0 w-4 h-4 -left-1 -top-1 border-2 border-orange-600/20 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        <div className="mt-4 flex flex-col items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
          <div className="w-px h-12 bg-neutral-300" />
          <Hash size={12} className="text-neutral-400" />
        </div>
      </div>

      {/* Mobile/Tablet Version (below xl) */}
      <div className="fixed right-4 bottom-24 z-[100] xl:hidden no-print">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 min-w-[160px] overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {anchors.map((anchor) => {
                  const isActive = activeId === anchor.id;
                  return (
                    <button
                      key={anchor.id}
                      onClick={() => scrollToAnchor(anchor.id)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all",
                        isActive 
                          ? "bg-orange-50 text-orange-600" 
                          : "text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100"
                      )}
                    >
                      <span>{anchor.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-colors",
            isOpen ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 border border-neutral-100"
          )}
        >
          {isOpen ? <X size={20} /> : <List size={20} />}
        </motion.button>
      </div>
    </>
  );
};
