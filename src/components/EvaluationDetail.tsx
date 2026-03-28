import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Evaluation, BusinessDistrict, FranchiseAnalysis } from '../types';
import { EvaluationHeader } from './evaluation/EvaluationHeader';
import { DistrictSelector } from './evaluation/DistrictSelector';
import { MetricsGrid } from './evaluation/MetricsGrid';
import { CostAnalysisSection } from './evaluation/CostAnalysisSection';
import { OperatingAnalysisSection } from './evaluation/OperatingAnalysisSection';
import { FranchiseAnalysisSection } from './evaluation/FranchiseAnalysisSection';
import { PhotoSection } from './evaluation/PhotoSection';

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
}

export const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ 
  activeEval, 
  districts,
  onUpdate, 
  onBack 
}) => {
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);
  const [isSetupCostHidden, setIsSetupCostHidden] = useState(false);

  const handlePrint = () => {
    window.focus();
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const isIframe = window.self !== window.top;

  // Calculations
  const setupCost = (
    (activeEval.rent * activeEval.paymentMethod) + 
    activeEval.deposit + 
    activeEval.transferFee + 
    activeEval.franchiseFee + 
    activeEval.renovationFee + 
    activeEval.equipmentFee + 
    activeEval.initialMaterialFee
  );

  const dailyFixedCost = (
    (activeEval.monthlyLabor / 30) + 
    (activeEval.monthlyUtilities / 30) + 
    (activeEval.rent / 30)
  );

  const dailyBreakeven = activeEval.grossMargin > 0 ? dailyFixedCost / activeEval.grossMargin : 0;
  const dailyGrossProfit = activeEval.estimatedDailyRevenue * activeEval.grossMargin;
  const monthlyGrossProfit = dailyGrossProfit * 30;
  const monthlyNetProfit = (dailyGrossProfit - dailyFixedCost) * 30;
  const paybackPeriod = (setupCost > 0 && monthlyNetProfit > 0) ? (setupCost / monthlyNetProfit).toFixed(1) : "无法回本";

  const selectedDistrict = districts.find(d => d.id === activeEval.districtId);
  const franchise = activeEval.franchiseAnalysis || DEFAULT_FRANCHISE_ANALYSIS;

  const updateFranchise = (updates: Partial<FranchiseAnalysis>) => {
    onUpdate({
      franchiseAnalysis: {
        ...franchise,
        ...updates
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-neutral-500 font-bold flex items-center gap-1">
          <ChevronLeft size={18} /> 返回列表
        </button>
      </div>

      {/* Title Section */}
      <EvaluationHeader 
        activeEval={activeEval}
        districtName={selectedDistrict?.name}
        onUpdate={onUpdate}
        onBack={onBack}
        onPrint={handlePrint}
        isIframe={isIframe}
      />

      {/* District Selector */}
      <DistrictSelector 
        districts={districts}
        selectedId={activeEval.districtId}
        onSelect={(id) => onUpdate({ districtId: id })}
      />

      {/* Metrics Grid */}
      <MetricsGrid 
        setupCost={setupCost}
        dailyFixedCost={dailyFixedCost}
        dailyBreakeven={dailyBreakeven}
      />

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CostAnalysisSection 
          evaluation={activeEval}
          onUpdate={onUpdate}
          setupCost={setupCost}
          isHidden={isSetupCostHidden}
          onToggleHidden={() => setIsSetupCostHidden(!isSetupCostHidden)}
        />

        <OperatingAnalysisSection 
          evaluation={activeEval}
          onUpdate={onUpdate}
          dailyFixedCost={dailyFixedCost}
          dailyBreakeven={dailyBreakeven}
          dailyGrossProfit={dailyGrossProfit}
          monthlyGrossProfit={monthlyGrossProfit}
          monthlyNetProfit={monthlyNetProfit}
          paybackPeriod={paybackPeriod}
        />

        <FranchiseAnalysisSection 
          franchise={franchise}
          onUpdate={updateFranchise}
        />
      </div>

      {/* Photos Section */}
      <PhotoSection 
        photos={activeEval.photos || []}
        onUpdate={(photos) => onUpdate({ photos })}
        isExpanded={isPhotosExpanded}
        onToggle={() => setIsPhotosExpanded(!isPhotosExpanded)}
      />
    </div>
  );
};
