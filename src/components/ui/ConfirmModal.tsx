import React from 'react';
import { Modal } from './Modal';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "确定", 
  cancelText = "取消",
  variant = 'danger'
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="flex items-start gap-3 md:gap-4 mb-6 md:mb-8">
      <div className={`p-2.5 md:p-3 rounded-2xl ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
        <AlertCircle size={20} className="md:w-6 md:h-6" />
      </div>
      <p className="text-sm md:text-base text-neutral-500 leading-relaxed">{description}</p>
    </div>
    <div className="flex gap-3">
      <button 
        onClick={onClose}
        className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-2xl font-bold transition-colors text-sm md:text-base"
      >
        {cancelText}
      </button>
      <button 
        onClick={() => { onConfirm(); onClose(); }}
        className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 text-white rounded-2xl font-bold transition-all shadow-lg text-sm md:text-base ${
          variant === 'danger' 
            ? 'bg-red-600 hover:bg-red-700 shadow-red-100' 
            : 'bg-orange-600 hover:bg-orange-700 shadow-orange-100'
        }`}
      >
        {confirmText}
      </button>
    </div>
  </Modal>
);
