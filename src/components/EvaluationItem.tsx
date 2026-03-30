import React, { useState } from 'react';
import { Copy, Trash2, Edit2 } from 'lucide-react';
import { Evaluation } from '../types';
import { cn, formatDate } from '../lib/utils';
import { ConfirmModal } from './ui/ConfirmModal';
import { RenameModal } from './ui/RenameModal';

interface EvaluationItemProps {
  evaluation: Evaluation;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: (e: Evaluation) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export const EvaluationItem: React.FC<EvaluationItemProps> = ({ 
  evaluation, 
  isActive, 
  onClick, 
  onDuplicate, 
  onDelete,
  onRename
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRename, setShowRename] = useState(false);

  if (!evaluation) return null;

  return (
    <>
      <div 
        onClick={onClick}
        className={cn(
          "p-3.5 md:p-4 rounded-2xl border transition-all cursor-pointer group",
          isActive 
            ? "bg-orange-50 border-orange-200 shadow-sm" 
            : "border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50"
        )}
      >
        <div className="flex justify-between items-start mb-1.5 md:mb-2">
          <span className={cn(
            "text-[10px] md:text-xs font-bold uppercase tracking-widest",
            isActive ? "text-orange-600" : "text-neutral-400"
          )}>
            {formatDate(evaluation.createdAt).split(' ')[0]}
          </span>
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(ev) => { ev.stopPropagation(); setShowRename(true); }}
              className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-orange-600"
              title="重命名"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={(ev) => { ev.stopPropagation(); onDuplicate(evaluation); }}
              className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-neutral-600"
              title="复制"
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={(ev) => { ev.stopPropagation(); setShowConfirm(true); }}
              className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-red-500"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <h4 className="text-sm md:text-base font-bold text-neutral-900 truncate">{evaluation.name}</h4>
        <p className="text-[10px] md:text-xs text-neutral-500 mt-1">面积: {evaluation.area}平 | 房租: {evaluation.rent}/月</p>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => onDelete(evaluation.id)}
        title="删除评估项"
        description={`确定要删除评估 "${evaluation.name}" 吗？此操作无法撤销。`}
        confirmText="确认删除"
      />

      <RenameModal 
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        onConfirm={(newName) => onRename(evaluation.id, newName)}
        title="重命名评估"
        initialValue={evaluation.name}
      />
    </>
  );
};
