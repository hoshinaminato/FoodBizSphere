import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  title: string;
  initialValue: string;
  placeholder?: string;
}

export const RenameModal: React.FC<RenameModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  initialValue,
  placeholder = "请输入名称"
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setValue(initialValue);
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 block">新名称</label>
          <input 
            autoFocus
            className="w-full px-4 md:px-5 py-3 md:py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-base md:text-lg"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-2xl font-bold transition-colors text-sm md:text-base"
          >
            取消
          </button>
          <button 
            type="submit"
            disabled={!value.trim()}
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-100 text-sm md:text-base"
          >
            保存修改
          </button>
        </div>
      </form>
    </Modal>
  );
};
