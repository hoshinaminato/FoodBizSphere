import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ImageUploader } from '../ImageUploader';
import { cn } from '../../lib/utils';

interface PhotoSectionProps {
  photos: string[];
  onUpdate: (photos: string[]) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  photos,
  onUpdate,
  isExpanded,
  onToggle
}) => {
  return (
    <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm no-print">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
          <h3 className="text-lg font-bold">商圈实地照片</h3>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
            {photos.length} 张
          </span>
        </div>
        {isExpanded ? <ChevronUp className="text-neutral-300 group-hover:text-orange-600" /> : <ChevronDown className="text-neutral-300 group-hover:text-orange-600" />}
      </button>
      
      <div className={cn("overflow-hidden transition-all duration-300", isExpanded ? "mt-6 h-auto opacity-100 overflow-visible" : "h-0 opacity-0")}>
        <ImageUploader 
          label="实地照片"
          hint="建议拍摄：门头、周边客流、竞对门店、内部空间"
          images={photos} 
          onUpload={(url) => onUpdate([...photos, url])}
          onDelete={(url) => onUpdate(photos.filter(p => p !== url))}
        />
      </div>
    </section>
  );
};
