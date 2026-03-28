import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, X, ZoomIn, HelpCircle } from 'lucide-react';
import { saveImage, loadImage, deleteImage } from '../lib/storage';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/Tooltip';

export const ImageUploader = ({ 
  label, 
  hint,
  images, 
  onUpload, 
  onDelete 
}: { 
  label: string; 
  hint?: string;
  images: string[]; 
  onUpload: (url: string) => void; 
  onDelete: (url: string) => void;
}) => {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    images.forEach(async (key) => {
      if (!previews[key]) {
        const url = await loadImage(key);
        if (url) setPreviews(prev => ({ ...prev, [key]: url }));
      }
    });
  }, [images]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const key = await saveImage(Math.random().toString(36), file);
        onUpload(key);
      }
      // Reset input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  return (
    <>
      <div className="bg-white p-4 md:p-5 rounded-3xl border border-neutral-200 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-xs md:text-sm font-bold text-neutral-500 uppercase tracking-widest">{label}</h4>
            {hint && (
              <Tooltip text={hint}>
                <HelpCircle size={14} className="text-neutral-300 cursor-help hover:text-orange-500 transition-colors" />
              </Tooltip>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors text-neutral-600"
          >
            <Camera size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFile} 
            accept="image/*" 
            multiple 
          />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 mt-auto">
          {images.map(key => (
            <div 
              key={key} 
              className="relative aspect-square rounded-2xl overflow-hidden group border border-neutral-100 cursor-zoom-in"
              onClick={() => previews[key] && setZoomedImage(previews[key])}
            >
              {previews[key] ? (
                <>
                  <img src={previews[key]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white" size={20} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-neutral-100 animate-pulse" />
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); deleteImage(key); onDelete(key); }}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-square border-2 border-dashed border-neutral-100 rounded-2xl flex flex-col items-center justify-center text-neutral-300 hover:border-neutral-200 hover:text-neutral-400 cursor-pointer transition-all",
              images.length === 0 && "col-span-full py-8 aspect-auto"
            )}
          >
            <ImageIcon size={24} />
            <span className="text-[10px] font-bold mt-1">添加照片</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={zoomedImage} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
