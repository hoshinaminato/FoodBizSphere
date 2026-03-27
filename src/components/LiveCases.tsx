import React, { useState } from 'react';
import { liveCases } from '../data/liveCases';
import { ArrowLeft, ExternalLink, Play, Volume2, VolumeX } from 'lucide-react';

interface LiveCasesProps {
  onBack: () => void;
}

export const LiveCases: React.FC<LiveCasesProps> = ({ onBack }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeCaseId, setActiveCaseId] = useState(liveCases[0]?.id || '');

  const getBilibiliEmbedUrl = (url: string, muted: boolean) => {
    const bvidMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvidMatch) {
      // Note: Bilibili iframe parameters are limited, but we include muted=1 as a best effort
      // and autoplay=0 to respect user bandwidth.
      return `//player.bilibili.com/player.html?bvid=${bvidMatch[0]}&page=1&high_quality=1&danmaku=0&autoplay=0${muted ? '&muted=1' : ''}`;
    }
    return null;
  };

  const activeCase = liveCases.find(c => c.id === activeCaseId) || liveCases[0];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">直播案例</h1>
          </div>
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors text-sm font-medium"
          >
            {isMuted ? (
              <>
                <VolumeX size={16} />
                <span>已静音</span>
              </>
            ) : (
              <>
                <Volume2 size={16} />
                <span>声音开启</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {activeCase ? (
          <div className="space-y-12">
            {/* Main Player Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="px-5 md:px-8 py-4 md:py-6 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">正在播放</span>
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-800">{activeCase.title}</h2>
                  </div>
                </div>
                
                <div className="p-5 md:p-8">
                  {/* Default to playing the first link as requested */}
                  {activeCase.links.slice(0, 1).map((link, index) => {
                    const embedUrl = getBilibiliEmbedUrl(link, isMuted);
                    
                    return (
                      <div key={index} className="space-y-4">
                        {embedUrl ? (
                          <div className="space-y-3">
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                              <iframe 
                                src={embedUrl}
                                scrolling="no" 
                                border="0" 
                                frameBorder="no" 
                                framespacing="0" 
                                allowFullScreen={true}
                                className="absolute inset-0 w-full h-full"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-widest">
                                <Play size={14} />
                                <span>主视频源</span>
                              </div>
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest transition-colors"
                              >
                                在 Bilibili 中打开 <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                              <ExternalLink size={14} />
                              <span>外部链接</span>
                            </div>
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-neutral-700 hover:text-orange-600 font-medium break-all transition-colors"
                            >
                              {link}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Case Selection List */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-400 uppercase tracking-[0.2em] px-2">更多案例</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveCases.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveCaseId(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left p-5 rounded-3xl border transition-all duration-300 ${
                      activeCaseId === item.id 
                        ? 'bg-orange-50 border-orange-200 ring-4 ring-orange-50' 
                        : 'bg-white border-neutral-200 hover:border-orange-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          activeCaseId === item.id ? 'bg-orange-200 text-orange-800' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          案例 {item.id}
                        </span>
                        {activeCaseId === item.id && <Play size={14} className="text-orange-600 fill-orange-600" />}
                      </div>
                      <h4 className={`font-bold leading-tight ${
                        activeCaseId === item.id ? 'text-orange-900' : 'text-neutral-800'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-neutral-200 rounded-3xl">
            <p className="text-neutral-400 font-medium">暂无直播案例</p>
          </div>
        )}
      </main>
    </div>
  );
};
