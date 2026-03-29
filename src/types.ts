export type DayType = 'weekday' | 'weekend' | 'holiday';

export interface MerchantRecord {
  id: string;
  date: number;
  startTime?: number;
  endTime?: number;
  dayType: DayType;
  timePeriod: string; // e.g., "11:00-13:00" or "午市"
  dineInCustomerInflow: number;
  takeoutCustomerInflow: number;
  averageTransactionValue: number;
  employeeCount: number;
}

export interface LocationData {
  country?: string;
  province?: string;
  city?: string;
  address?: string; // This will be the "detail address"
  locationDescription?: string;
  coordinates?: { lat: number; lng: number };
  mapUrl?: string;
}

export interface Merchant {
  id: string;
  name: string;
  images: string[];
  location?: LocationData;
  averageTransactionValue: number; // 人均客单价 (Legacy/Summary)
  employeeCount: number; // 员工数量 (Legacy/Summary)
  dineInCustomerInflow: number; // (Legacy/Summary)
  takeoutCustomerInflow: number; // (Legacy/Summary)
  records: MerchantRecord[];
  isRealData: boolean;
  isBrushing: boolean; // 是否刷单
  isFakeCustomers: boolean; // 是否找人
  isModifiedPOS: boolean; // 是否修改收银
  notes: string;
  projectId: string; // 商家属于项目，可被多个商圈引用
}

export type ConsumerGroupType = 'school' | 'residential' | 'office' | 'other';

export interface ConsumerGroup {
  id: string;
  type: ConsumerGroupType;
  customName?: string;
  description?: string;
  population: number;
  tenantRatio?: number;
}

export interface BusinessDistrict {
  id: string;
  name: string;
  images: string[];
  location?: LocationData;
  merchantIds: string[]; // 存储商家ID，实现重叠
  consumerGroups: ConsumerGroup[];
  createdAt: number;
}

export interface FranchiseAnalysis {
  enabled: boolean;
  motivation: string;
  platformSource: string;
  isIntercepted: boolean;
  visitedHeadquarters: boolean;
  tasteEvaluation: string;
  supportContent: string[];
  hasRealStoreVerification: boolean;
  franchiseeCount: number;
  averageRevenue: number;
  isRecommended: boolean;
  feeType: 'one-time' | 'annual';
  franchiseFee: number;
  locationFee: number;
  materialFee: number;
  equipmentFee: number;
  brandType: string;
  locationSupport: boolean;
  travelExpenses: number;
  transferFeeIssue: string;
  calculationMethod: string;
  comparisonWithOthers: string;
  paidAmount: number;
  takeoutManagement: boolean;
  influencerPromotion: boolean;
  dailyOperation: boolean;
}

export interface Evaluation {
  id: string;
  name: string;
  createdAt: number;
  districtId?: string; // 关联商圈
  location?: LocationData;
  
  // Basic Info
  area: number;
  outdoorArea: number;
  fumeType: 'none' | 'light' | 'heavy';
  rent: number;
  paymentMethod: number; // months
  deposit: number;
  transferFee: number;
  franchiseFee: number;
  renovationFee: number;
  equipmentFee: number;
  initialMaterialFee: number;
  
  // Operating Costs
  monthlyLabor: number;
  monthlyUtilities: number;
  grossMargin: number; // percentage (0-1)
  estimatedDailyRevenue: number;
  averageTransactionValue: number;
  
  // Franchise Analysis
  franchiseAnalysis?: FranchiseAnalysis;
  
  // Images
  images: {
    dish: string[];
    menu: string[];
    interior: string[];
    exterior: string[];
    reviews: string[];
  };
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  evaluations: Evaluation[];
  districts: BusinessDistrict[];
  merchants: Merchant[];
}
