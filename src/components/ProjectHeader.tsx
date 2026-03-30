import React, { useState } from 'react';
import { ChevronLeft, Plus, Pencil } from 'lucide-react';
import { exportToCSV } from '../lib/utils';
import { Project } from '../types';

interface ProjectHeaderProps {
  project: Project;
  onBack: () => void;
  onUpdateName: (name: string) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  onBack, 
  onUpdateName 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-40 no-print">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-colors shrink-0"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
        <div className="flex flex-col min-w-0">
          {isEditing ? (
            <input 
              autoFocus
              className="text-lg md:text-xl font-bold bg-neutral-50 px-2 py-1 rounded-lg outline-none ring-2 ring-orange-500 w-full max-w-[160px] md:max-w-[256px]"
              value={project.name ?? ""}
              onChange={(e) => onUpdateName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            />
          ) : (
            <div 
              className="flex items-center gap-2 group cursor-pointer min-w-0"
              onClick={() => setIsEditing(true)}
            >
              <h2 className="text-lg md:text-xl font-bold group-hover:text-orange-600 transition-colors truncate">
                {project.name}
              </h2>
              <Pencil size={14} className="text-neutral-300 group-hover:text-orange-600 transition-colors shrink-0" />
            </div>
          )}
          <p className="text-[8px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-widest truncate">空间管理模式</p>
        </div>
      </div>
    </header>
  );
};
