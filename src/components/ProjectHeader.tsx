import React, { useState } from 'react';
import { ChevronLeft, Plus, Pencil } from 'lucide-react';

interface ProjectHeaderProps {
  projectName: string;
  onBack: () => void;
  onUpdateName: (name: string) => void;
  onCreateEvaluation: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  projectName, 
  onBack, 
  onUpdateName, 
  onCreateEvaluation 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <header className="bg-white border-bottom border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col">
          {isEditing ? (
            <input 
              autoFocus
              className="text-xl font-bold bg-neutral-50 px-2 py-1 rounded-lg outline-none ring-2 ring-orange-500 w-64"
              value={projectName ?? ""}
              onChange={(e) => onUpdateName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            />
          ) : (
            <div 
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <h2 className="text-xl font-bold group-hover:text-orange-600 transition-colors">
                {projectName}
              </h2>
              <Pencil size={16} className="text-neutral-300 group-hover:text-orange-600 transition-colors" />
            </div>
          )}
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">空间管理模式</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onCreateEvaluation}
          className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={18} /> 新增评估
        </button>
      </div>
    </header>
  );
};
