import React, { useState } from 'react';
import { Store, Trash2, ChevronRight, Pencil, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { formatDate } from '../lib/utils';
import { ConfirmModal } from './ui/ConfirmModal';
import { RenameModal } from './ui/RenameModal';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDelete, onRename, onExport }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRename, setShowRename] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 md:p-3 bg-orange-50 rounded-2xl text-orange-600">
            <Store size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onExport(project.id); }}
              className="p-2 text-neutral-300 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
              title="导出项目"
            >
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowRename(true); }}
              className="p-2 text-neutral-300 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
              title="重命名"
            >
              <Pencil size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="删除"
            >
              <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-1 truncate">{project.name}</h3>
        <p className="text-xs md:text-sm text-neutral-400 mb-4">创建于 {formatDate(project.createdAt)}</p>
        <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
          <span className="text-neutral-500">{project.evaluations.length} 个评估项</span>
          <span className="text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            进入空间 <ChevronRight size={14} className="md:w-4 md:h-4" />
          </span>
        </div>
      </motion.div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => onDelete(project.id)}
        title="删除项目空间"
        description={`确定要删除项目空间 "${project.name}" 吗？此操作将永久删除该空间下的所有评估数据，且无法恢复。`}
        confirmText="确认删除"
      />

      <RenameModal 
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        onConfirm={(newName) => onRename(project.id, newName)}
        title="重命名项目空间"
        initialValue={project.name}
      />
    </>
  );
};
