import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, Users, Maximize2, ChevronRight, ChevronLeft, Store, ChevronDown, ChevronUp } from 'lucide-react';
import { Project, BusinessDistrict, Merchant } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MerchantCounter } from './MerchantCounter';
import { FocusModeOverlay } from './FocusModeOverlay';
import { ImageUploader } from './ImageUploader';
import { ConfirmModal } from './ui/ConfirmModal';
import { RenameModal } from './ui/RenameModal';

interface DistrictManagerProps {
  project: Project;
  onUpdateDistrict: (id: string, updates: Partial<BusinessDistrict>) => void;
  onDeleteDistrict: (id: string) => void;
  onCreateDistrict: (name: string) => void;
  onUpdateMerchant: (id: string, updates: Partial<Merchant>) => void;
  onDeleteMerchant: (id: string) => void;
  onCreateMerchant: (name: string) => string;
}

export const DistrictManager: React.FC<DistrictManagerProps> = ({
  project,
  onUpdateDistrict,
  onDeleteDistrict,
  onCreateDistrict,
  onUpdateMerchant,
  onDeleteMerchant,
  onCreateMerchant
}) => {
  const districts = project.districts || [];
  const merchants = project.merchants || [];
  
  const [activeDistrictId, setActiveDistrictId] = useState<string | null>(districts[0]?.id || null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showRename, setShowRename] = useState<BusinessDistrict | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);

  const activeDistrict = districts.find(d => d.id === activeDistrictId);
  const districtMerchants = merchants.filter(m => activeDistrict?.merchantIds?.includes(m.id));

  const handleDistrictSelect = (id: string) => {
    setActiveDistrictId(id);
    setMobileView('detail');
  };

  const handleAddMerchant = () => {
    if (!activeDistrictId) return;
    const newId = onCreateMerchant("新商家");
    onUpdateDistrict(activeDistrictId, { 
      merchantIds: [...(activeDistrict?.merchantIds || []), newId] 
    });
  };

  const handleAddExistingMerchant = (merchantId: string) => {
    if (!activeDistrictId || activeDistrict?.merchantIds.includes(merchantId)) return;
    onUpdateDistrict(activeDistrictId, { 
      merchantIds: [...(activeDistrict?.merchantIds || []), merchantId] 
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      {/* Sidebar & Main Content Split */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Districts Sidebar */}
        <aside className={cn(
          "w-full md:w-80 bg-white border-r border-neutral-200 flex flex-col transition-all duration-300 z-10",
          mobileView === 'detail' ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">商圈列表</h3>
            <button 
              onClick={() => onCreateDistrict(`新商圈 ${districts.length + 1}`)}
              className="p-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {districts.map(district => (
              <div 
                key={district.id}
                onClick={() => handleDistrictSelect(district.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer group",
                  activeDistrictId === district.id 
                    ? "bg-orange-50 border-orange-200 shadow-sm" 
                    : "border-transparent hover:bg-neutral-50"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className={activeDistrictId === district.id ? "text-orange-600" : "text-neutral-400"} />
                    <span className={cn("font-bold", activeDistrictId === district.id ? "text-neutral-900" : "text-neutral-500")}>
                      {district.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowRename(district); }}
                      className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-orange-600"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(district.id); }}
                      className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {district.merchantIds?.length || 0} 个商家
                  </p>
                  <ChevronRight size={14} className="text-neutral-300 md:hidden" />
                </div>
              </div>
            ))}
            {districts.length === 0 && (
              <div className="py-12 text-center text-neutral-300">
                <MapPin size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">暂无商圈</p>
              </div>
            )}
          </div>
        </aside>

        {/* Merchants Main Area */}
        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300",
          mobileView === 'list' ? "hidden md:block" : "block"
        )}>
          <AnimatePresence mode="wait">
            {activeDistrict ? (
              <motion.div 
                key={activeDistrict.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto"
              >
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setMobileView('list')}
                  className="md:hidden flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-widest mb-6"
                >
                  <ChevronLeft size={16} /> 返回商圈列表
                </button>

                {/* District Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">{activeDistrict.name}</h2>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                        <Users size={14} /> {activeDistrict.merchantIds?.length || 0} 个商家数据
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setIsFocusModeOpen(true)}
                      className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200 active:scale-95"
                    >
                      <Maximize2 size={18} /> 专注蹲点模式
                    </button>
                    <button 
                      onClick={handleAddMerchant}
                      className="px-6 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all active:scale-95"
                    >
                      <Plus size={18} /> 添加新商家
                    </button>
                  </div>
                </div>

                {/* District Images */}
                <div className="mb-12">
                  <div 
                    className="flex items-center justify-between cursor-pointer group mb-4"
                    onClick={() => setIsPhotosExpanded(!isPhotosExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                      <h3 className="text-lg font-bold">商圈实地照片</h3>
                      <span className="text-xs text-neutral-400 font-medium ml-2">
                        {activeDistrict.images?.length || 0} 张已上传
                      </span>
                    </div>
                    <div className="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-500 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                      {isPhotosExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isPhotosExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <ImageUploader 
                            label="商圈实地照片" 
                            images={activeDistrict.images || []} 
                            onUpload={(url) => onUpdateDistrict(activeDistrict.id, { images: [...(activeDistrict.images || []), url] })}
                            onDelete={(url) => onUpdateDistrict(activeDistrict.id, { images: (activeDistrict.images || []).filter(u => u !== url) })}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Merchants Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {districtMerchants.map(merchant => (
                    <div key={merchant.id} className="relative group">
                      <MerchantCounter 
                        merchant={merchant} 
                        onUpdate={(updates) => onUpdateMerchant(merchant.id, updates)} 
                      />
                      <button 
                        onClick={() => onUpdateDistrict(activeDistrict.id, { 
                          merchantIds: activeDistrict.merchantIds?.filter(id => id !== merchant.id) || []
                        })}
                        className="absolute -top-2 -right-2 p-2 bg-white border border-neutral-200 text-neutral-400 hover:text-red-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                        title="从商圈移除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Existing Merchant Suggestion */}
                  {merchants.length > districtMerchants.length && (
                    <div className="col-span-full mt-8 pt-8 border-t border-neutral-200">
                      <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">从项目中选择已有商家</h4>
                      <div className="flex flex-wrap gap-2">
                        {merchants
                          .filter(m => !activeDistrict.merchantIds?.includes(m.id))
                          .map(m => (
                            <button 
                              key={m.id}
                              onClick={() => handleAddExistingMerchant(m.id)}
                              className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:border-orange-500 hover:text-orange-600 transition-all flex items-center gap-2"
                            >
                              <Store size={14} /> {m.name} <Plus size={12} />
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {districtMerchants.length === 0 && (
                    <div className="col-span-full py-32 text-center text-neutral-300">
                      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store size={32} />
                      </div>
                      <p className="text-lg font-bold text-neutral-400">该商圈暂无商家数据</p>
                      <p className="text-sm mt-1">点击上方按钮开始录入周边商家数据</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-300">
                <MapPin size={64} className="opacity-10 mb-4" />
                <p className="text-xl font-bold">请选择或创建一个商圈</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Overlays */}
      <FocusModeOverlay 
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        merchants={districtMerchants}
        onUpdateMerchant={onUpdateMerchant}
      />

      <ConfirmModal 
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && onDeleteDistrict(showDeleteConfirm)}
        title="删除商圈"
        description="确定要删除这个商圈吗？商家数据将保留在项目中，但关联关系将丢失。"
      />

      <RenameModal 
        isOpen={!!showRename}
        onClose={() => setShowRename(null)}
        onConfirm={(newName) => showRename && onUpdateDistrict(showRename.id, { name: newName })}
        title="重命名商圈"
        initialValue={showRename?.name || ""}
      />
    </div>
  );
};
