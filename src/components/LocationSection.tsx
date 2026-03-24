import React from 'react';
import { MapPin, ExternalLink, Info } from 'lucide-react';
import { LocationData } from '../types';
import { InputField } from './ui/InputField';

interface LocationSectionProps {
  location?: LocationData;
  onUpdate: (location: LocationData) => void;
  title?: string;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ 
  location = {} as LocationData, 
  onUpdate,
  title = "地理位置"
}) => {
  const handleSearch = () => {
    if (!location.address) return;
    const url = `https://www.amap.com/search?query=${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        {location.address && (
          <button 
            onClick={handleSearch}
            className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={14} /> 在高德地图中查看
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField 
            label="详细地址" 
            placeholder="例如：上海市静安区南京西路123号"
            type="text"
            value={location.address || ''} 
            onChange={(v) => onUpdate({ ...location, address: v })}
          />
          
          {/* Map Embed Preview */}
          <div className="aspect-video w-full bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 relative group">
            {location.address ? (
              <iframe
                title="Map Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://m.amap.com/search/mapview/keywords=${encodeURIComponent(location.address)}`}
                className="grayscale-[0.2] contrast-[1.1]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                <MapPin size={32} className="mb-2 opacity-20" />
                <p className="text-xs font-bold">输入地址后自动预览地图</p>
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-neutral-500 shadow-sm pointer-events-none">
              高德地图预览
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="flex items-start gap-2 text-neutral-500">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs leading-relaxed">
                输入地址后上方将自动尝试加载地图预览。如果地图定位不准，请在右侧补充详细的“找店指南”。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">
            位置补充描述 (找店指南)
          </label>
          <textarea 
            className="w-full h-32 bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
            placeholder="例如：地铁2号线5号口出来直走50米，红色大楼背面，瑞幸咖啡旁边..."
            value={location.locationDescription || ''}
            onChange={(e) => onUpdate({ ...location, locationDescription: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-2">
        <InputField 
          label="地图分享链接 (可选)" 
          placeholder="粘贴来自高德/百度地图的分享链接"
          type="text"
          value={location.mapUrl || ''} 
          onChange={(v) => onUpdate({ ...location, mapUrl: v })}
        />
      </div>
    </section>
  );
};
