import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { BusinessDistrict } from '../../types';
import { cn } from '../../lib/utils';

interface DistrictSelectorProps {
  districts: BusinessDistrict[];
  selectedId?: string;
  onSelect: (id?: string) => void;
  onJump?: (id: string) => void;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  districts,
  selectedId,
  onSelect,
  onJump
}) => {
  const selectedDistrict = districts.find(d => d.id === selectedId);

  return (
    <section className="bg-white p-4 md:p-5 rounded-3xl border border-neutral-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
            <h3 className="text-base font-bold">关联商圈</h3>
          </div>
          {selectedId && onJump && (
            <button 
              onClick={() => onJump(selectedId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-bold hover:bg-orange-100 transition-all no-print"
            >
              <ExternalLink size={12} /> 查看商圈详情
            </button>
          )}
        </div>
        
        <div className="relative flex-1 max-w-md">
          <select
            value={selectedId || ""}
            onChange={(e) => onSelect(e.target.value || undefined)}
            className={cn(
              "w-full px-4 py-2 bg-neutral-50 border rounded-xl text-xs font-bold appearance-none cursor-pointer transition-all outline-none",
              selectedId ? "border-orange-200 text-orange-600" : "border-neutral-100 text-neutral-400"
            )}
          >
            <option value="">未关联商圈</option>
            {districts.map(district => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <MapPin size={14} />
          </div>
        </div>
      </div>

      {districts.length === 0 && (
        <p className="text-[10px] text-neutral-400 italic mt-2">暂无商圈，请先在“商圈与商家”标签页中创建。</p>
      )}
      
      {selectedDistrict && (
        <div className="mt-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">当前关联：</span>
              <span className="text-xs font-black text-neutral-900">{selectedDistrict.name}</span>
            </div>
            <span className="text-[9px] font-bold text-neutral-400 bg-white px-2 py-0.5 rounded-lg border border-neutral-100">
              {selectedDistrict.merchantIds?.length || 0} 个商家数据
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
