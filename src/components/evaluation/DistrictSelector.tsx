import React from 'react';
import { MapPin } from 'lucide-react';
import { BusinessDistrict } from '../../types';
import { cn } from '../../lib/utils';

interface DistrictSelectorProps {
  districts: BusinessDistrict[];
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  districts,
  selectedId,
  onSelect
}) => {
  return (
    <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
        <h3 className="text-lg font-bold">关联商圈</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {districts.map(district => (
          <button 
            key={district.id}
            onClick={() => onSelect(selectedId === district.id ? undefined : district.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border relative",
              selectedId === district.id 
                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100" 
                : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
            )}
          >
            <MapPin size={14} /> {district.name}
            {selectedId === district.id && (
              <div className="hidden print:block absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] shadow-sm">
                ✓
              </div>
            )}
          </button>
        ))}
        {districts.length === 0 && (
          <p className="text-sm text-neutral-400 italic">暂无商圈，请先在“商圈与商家”标签页中创建。</p>
        )}
      </div>
    </section>
  );
};
