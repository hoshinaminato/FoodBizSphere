import React from 'react';
import { liveCases } from '../data/liveCases';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';

interface LiveCasesProps {
  onBack: () => void;
}

export const LiveCases: React.FC<LiveCasesProps> = ({ onBack }) => {
  const getBilibiliEmbedUrl = (url: string) => {
    const bvidMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvidMatch) {
      return `//player.bilibili.com/player.html?bvid=${bvidMatch[0]}&page=1&high_quality=1&danmaku=0`;
    }
    return null;
  };

  const isBilibili = (url: string) => url.includes('bilibili.com');

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft size={18} className="md:w-5 md:h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">直播案例</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8 md:space-y-12">
          {liveCases.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
              {item.title && (
                <div className="px-5 md:px-8 py-4 md:py-6 border-b border-neutral-100 bg-neutral-50/50">
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-800">{item.title}</h2>
                </div>
              )}
              
              <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                {item.links.map((link, index) => {
                  const embedUrl = getBilibiliEmbedUrl(link);
                  
                  return (
                    <div key={index} className="space-y-4">
                      {embedUrl ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-widest">
                            <Play size={14} />
                            <span>视频源 {index + 1} (Bilibili)</span>
                          </div>
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
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest transition-colors"
                          >
                            在 Bilibili 中打开 <ExternalLink size={12} />
                          </a>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            <ExternalLink size={14} />
                            <span>外部链接 {index + 1}</span>
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
          ))}
          
          {liveCases.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-neutral-200 rounded-3xl">
              <p className="text-neutral-400 font-medium">暂无直播案例</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
