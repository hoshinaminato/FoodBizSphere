import React, { useState, useEffect } from 'react';
import { StickyNote, Edit3, Save, X, Image as ImageIcon } from 'lucide-react';
import { Evaluation } from '../../types';
import { ImageUploader } from '../ImageUploader';
import { ImageDisplay } from '../ImageDisplay';
import { cn } from '../../lib/utils';

interface MemoSectionProps {
  memo: { content: string; images: string[] };
  onUpdate: (updates: Partial<Evaluation>) => void;
  onClose: () => void;
}

export const MemoSection: React.FC<MemoSectionProps> = ({
  memo,
  onUpdate,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editing
  const [localContent, setLocalContent] = useState(memo.content);
  const [localImages, setLocalImages] = useState(memo.images);

  // Sync local state when memo changes (e.g. from parent) OR when entering edit mode
  useEffect(() => {
    if (!isEditing) {
      setLocalContent(memo.content);
      setLocalImages(memo.images);
    }
  }, [memo.content, memo.images, isEditing]);

  const handleSave = () => {
    onUpdate({
      memo: {
        content: localContent,
        images: localImages
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalContent(memo.content);
    setLocalImages(memo.images);
    setIsEditing(false);
  };

  return (
    <div id="memo-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-blue-100 space-y-6 scroll-mt-24 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <StickyNote className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">备忘录</h3>
            <p className="text-xs text-neutral-400">记录关于该选址的随手笔记、灵感或现场照片</p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl transition-all"
              >
                <Edit3 size={14} />
                <span className="text-xs font-bold">编辑</span>
              </button>
              <button 
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 rounded-xl transition-all"
                title="收起备忘录"
              >
                <X size={14} />
                <span className="text-xs font-bold">收起</span>
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl transition-all"
              >
                <X size={14} />
                <span className="text-xs font-bold">取消</span>
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-100"
              >
                <Save size={14} />
                <span className="text-xs font-bold">完成</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">笔记内容</label>
            <textarea 
              className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500 transition-all text-neutral-700 leading-relaxed"
              placeholder="在这里输入您的笔记、想法 or 观察..."
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <ImageIcon size={14} className="text-neutral-400" />
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">现场照片</label>
            </div>
            <ImageUploader 
              label="现场照片"
              images={localImages}
              onUpload={(url) => setLocalImages([...localImages, url])}
              onDelete={(url) => setLocalImages(localImages.filter(u => u !== url))}
              hint="上传现场实拍、周边环境等照片"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {memo.content ? (
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
              <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {memo.content}
              </p>
            </div>
          ) : (
            <div className="py-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 no-print">
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">暂无笔记内容</p>
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
              >
                立即添加
              </button>
            </div>
          )}

          {memo.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {memo.images.map((url, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-neutral-100 shadow-sm group relative">
                  <ImageDisplay 
                    imageKey={url} 
                    alt={`现场照片 ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
