import React, { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Evaluation, BusinessDistrict, FranchiseAnalysis } from '../types';
import { EvaluationHeader } from './evaluation/EvaluationHeader';
import { MetricsGrid } from './evaluation/MetricsGrid';
import { CostAnalysisSection } from './evaluation/CostAnalysisSection';
import { OperatingAnalysisSection } from './evaluation/OperatingAnalysisSection';
import { FranchiseAnalysisSection } from './evaluation/FranchiseAnalysisSection';
import { LocationSection } from './evaluation/LocationSection';
import { PhotoSection } from './evaluation/PhotoSection';
import { MemoSection } from './evaluation/MemoSection';
import { FloatingAnchorNav } from './ui/FloatingAnchorNav';

const EVALUATION_ANCHORS = [
  { id: 'evaluation-header', label: '评估概览' },
  { id: 'memo-section', label: '备忘录' },
  { id: 'location-section', label: '地理位置' },
  { id: 'metrics-grid', label: '核心指标' },
  { id: 'cost-analysis', label: '成本分析' },
  { id: 'operating-analysis', label: '经营分析' },
  { id: 'franchise-analysis', label: '加盟分析' },
  { id: 'photo-section', label: '实地照片' },
];

const DEFAULT_FRANCHISE_ANALYSIS: FranchiseAnalysis = {
  enabled: false,
  motivation: '',
  platformSource: '',
  isIntercepted: false,
  visitedHeadquarters: false,
  tasteEvaluation: '',
  supportContent: [],
  hasRealStoreVerification: false,
  franchiseeCount: 0,
  averageRevenue: 0,
  isRecommended: false,
  feeType: 'one-time',
  franchiseFee: 0,
  locationFee: 0,
  materialFee: 0,
  equipmentFee: 0,
  brandType: '',
  locationSupport: false,
  travelExpenses: 0,
  transferFeeIssue: '',
  calculationMethod: '',
  comparisonWithOthers: '',
  paidAmount: 0,
  takeoutManagement: false,
  influencerPromotion: false,
  dailyOperation: false
};

interface EvaluationDetailProps {
  activeEval: Evaluation;
  districts: BusinessDistrict[];
  onUpdate: (updates: Partial<Evaluation>) => void;
  onBack: () => void;
  onJumpToDistrict: (id: string) => void;
}

export const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ 
  activeEval, 
  districts,
  onUpdate, 
  onBack,
  onJumpToDistrict
}) => {
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);
  const [isSetupCostHidden, setIsSetupCostHidden] = useState(false);
  const [isMemoExpanded, setIsMemoExpanded] = useState(false);

  if (!activeEval) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-neutral-400 mb-4">未找到评估方案</p>
        <button onClick={onBack} className="text-orange-600 font-bold">返回列表</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.focus();
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const isIframe = window.self !== window.top;

  // Calculations
  const setupCost = activeEval ? (
    (activeEval.rent * activeEval.paymentMethod) + 
    activeEval.deposit + 
    activeEval.transferFee + 
    activeEval.franchiseFee + 
    activeEval.renovationFee + 
    activeEval.equipmentFee + 
    activeEval.initialMaterialFee
  ) : 0;

  const dailyFixedCost = activeEval ? (
    (activeEval.monthlyLabor / 30) + 
    (activeEval.monthlyUtilities / 30) + 
    (activeEval.rent / 30)
  ) : 0;

  const dailyGrossProfit = activeEval ? (
    (activeEval.dineInEstimatedDailyRevenue * activeEval.dineInGrossMargin) + 
    (activeEval.takeoutEstimatedDailyRevenue * activeEval.takeoutGrossMargin)
  ) : 0;

  const totalDailyRevenue = activeEval ? (activeEval.dineInEstimatedDailyRevenue + activeEval.takeoutEstimatedDailyRevenue) : 0;
  const weightedGrossMargin = totalDailyRevenue > 0 ? dailyGrossProfit / totalDailyRevenue : 0;

  const dailyBreakeven = weightedGrossMargin > 0 ? dailyFixedCost / weightedGrossMargin : 0;
  const dailyNetProfit = dailyGrossProfit - dailyFixedCost;
  const monthlyGrossProfit = dailyGrossProfit * 30;
  const monthlyNetProfit = dailyNetProfit * 30;
  const paybackPeriod = (setupCost > 0 && monthlyNetProfit > 0) ? (setupCost / monthlyNetProfit).toFixed(1) : "无法回本";

  const franchise = activeEval?.franchiseAnalysis || DEFAULT_FRANCHISE_ANALYSIS;

  const memo = useMemo(() => activeEval?.memo || { content: '', images: [] }, [activeEval?.memo]);

  const anchors = useMemo(() => 
    EVALUATION_ANCHORS.filter(a => a.id !== 'memo-section' || isMemoExpanded),
    [isMemoExpanded]
  );

  const updateFranchise = (updates: Partial<FranchiseAnalysis>) => {
    onUpdate({
      franchiseAnalysis: {
        ...franchise,
        ...updates
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 relative">
      <FloatingAnchorNav 
        anchors={anchors} 
      />

      {/* Top Bar for Mobile */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-neutral-500 font-bold flex items-center gap-1">
          <ChevronLeft size={18} /> 返回列表
        </button>
      </div>

      {/* Title Section */}
      <div id="evaluation-header" className="scroll-mt-20">
        <EvaluationHeader 
          activeEval={activeEval}
          districts={districts}
          onUpdate={onUpdate}
          onBack={onBack}
          onPrint={handlePrint}
          onJumpToDistrict={onJumpToDistrict}
          onToggleMemo={() => setIsMemoExpanded(!isMemoExpanded)}
          isIframe={isIframe}
        />
      </div>

      {/* Memo Section */}
      {isMemoExpanded && (
        <MemoSection 
          memo={memo}
          onUpdate={onUpdate}
          onClose={() => setIsMemoExpanded(false)}
        />
      )}

      {/* Location Section */}
      <div id="location-section" className="scroll-mt-20">
        <LocationSection 
          evaluation={activeEval}
          onUpdate={onUpdate}
        />
      </div>

      {/* Metrics Grid */}
      <div id="metrics-grid" className="scroll-mt-20">
        <MetricsGrid 
          setupCost={setupCost}
          dailyFixedCost={dailyFixedCost}
          dailyBreakeven={dailyBreakeven}
          dailyNetProfit={dailyNetProfit}
        />
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div id="cost-analysis" className="scroll-mt-20">
          <CostAnalysisSection 
            evaluation={activeEval}
            onUpdate={onUpdate}
            setupCost={setupCost}
            isHidden={isSetupCostHidden}
            onToggleHidden={() => setIsSetupCostHidden(!isSetupCostHidden)}
          />
        </div>

        <div id="operating-analysis" className="scroll-mt-20">
          <OperatingAnalysisSection 
            evaluation={activeEval}
            onUpdate={onUpdate}
            dailyFixedCost={dailyFixedCost}
            dailyBreakeven={dailyBreakeven}
            dailyGrossProfit={dailyGrossProfit}
            dailyNetProfit={dailyNetProfit}
            monthlyGrossProfit={monthlyGrossProfit}
            monthlyNetProfit={monthlyNetProfit}
            paybackPeriod={paybackPeriod}
          />
        </div>

        <div id="franchise-analysis" className="lg:col-span-2 scroll-mt-20">
          <FranchiseAnalysisSection 
            franchise={franchise}
            onUpdate={updateFranchise}
          />
        </div>
      </div>

      {/* Photos Section */}
      <div id="photo-section" className="scroll-mt-20">
        <PhotoSection 
          photos={activeEval.photos || []}
          onUpdate={(photos) => onUpdate({ photos })}
          isExpanded={isPhotosExpanded}
          onToggle={() => setIsPhotosExpanded(!isPhotosExpanded)}
        />
      </div>
    </div>
  );
};
