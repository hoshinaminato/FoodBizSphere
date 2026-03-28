import React from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const WarningPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const sections = [
    {
      title: "🔴 开店动机类",
      items: [
        "吃着好吃自己也想开",
        "看过别人做就觉得自己能做",
        "其他店开得好",
        "好位置没有了只能将就",
        "因为住这里",
        "其他"
      ]
    },
    {
      title: "🔴 选址 & 商圈认知",
      items: [
        "好事怎么会轮到你",
        "人家生意好和你有什么关系？",
        "你这适合开修车店",
        "什么？你要干倒旁边的蜜雪冰城？"
      ]
    },
    {
      title: "🔴 商业本质",
      items: [
        "不要创造需求",
        "不要为了开店而开店",
        "不要教客户吃什么",
        "你是来挣钱还是实现自我价值？"
      ]
    },
    {
      title: "🔴 加盟风险",
      items: [
        "快招公司",
        "样板间≠真实门店",
        "数据真实性"
      ]
    },
    {
      title: "🔴 经营现实（强提醒）",
      items: [
        "你花几十万开店是在给自己找工作",
        "你在给员工发工资",
        "你上辈子欠他们的？",
        "你创造了就业机会",
        "你让资金回流"
      ]
    },
    {
      title: "🔴 产品与菜单逻辑",
      items: [
        "单品分量过大 → 导致顾客只点一个（压制客单价）",
        "套餐逻辑：必须降低单品分量，增加组合感",
        "提供组合选择：必须搭配饮料 / 素菜（高毛利项）",
        "分量 vs 价格：寻找利润平衡点而非单纯低价",
        "套餐组合建议：参考同类成熟门店的成熟模型",
        "警惕季节性：这是否是一门季节性生意？"
      ]
    }
  ];

  return (
    <div className="w-72 mt-4 pointer-events-auto">
      <div 
        className={cn(
          "bg-red-50 border-2 border-red-500 rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
          !isExpanded && "shadow-[0_0_10px_rgba(239,68,68,0.2)]"
        )}
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">避坑指南 / 强力清醒剂</span>
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                {sections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-200 pb-1">
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[11px] text-red-900 font-medium flex items-start gap-1.5">
                          <span className="mt-1 w-1 h-1 bg-red-400 rounded-full shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="pt-2 text-center">
                  <p className="text-[9px] text-red-400 font-bold uppercase tracking-tighter">
                    —— 创业有风险，投资需谨慎 ——
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
