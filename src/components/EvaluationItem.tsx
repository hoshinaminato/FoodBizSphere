import React, { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { Evaluation } from '../types';
import { cn, formatDate } from '../lib/utils';
import { ConfirmModal } from './ui/ConfirmModal';

interface EvaluationItemProps {
  evaluation: Evaluation;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: (e: Evaluation) => void;
  onDelete: (id: string) => void;
}

export const EvaluationItem: React.FC<EvaluationItemProps> = ({ 
  evaluation, 
  isActive, 
  onClick, 
  onDuplicate, 
  onDelete 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div 
        onClick={onClick}
        className={cn(
          "p-4 rounded-2xl border transition-all cursor-pointer group",
          isActive 
            ? "bg-orange-50 border-orange-200 shadow-sm" 
            : "border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50"
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <span className={cn(
            "text-xs font-bold uppercase tracking-widest",
            isActive ? "text-orange-600" : "text-neutral-400"
          )}>
            {formatDate(evaluation.createdAt).split(' ')[0]}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(ev) => { ev.stopPropagation(); onDuplicate(evaluation); }}
              className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-neutral-600"
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={(ev) => { ev.stopPropagation(); setShowConfirm(true); }}
              className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <h4 className="font-bold text-neutral-900">{evaluation.name}</h4>
        <p className="text-xs text-neutral-500 mt-1">面积: {evaluation.area}平 | 房租: {evaluation.rent}/月</p>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => onDelete(evaluation.id)}
        title="删除评估项"
        description={`确定要删除评估 "${evaluation.name}" 吗？此操作无法撤销。`}
        confirmText="确认删除"
      />
    </>
  );
};
