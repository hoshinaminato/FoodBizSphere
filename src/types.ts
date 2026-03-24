export type DayType = 'weekday' | 'weekend' | 'holiday';

export interface MerchantRecord {
  id: string;
  date: number;
  dayType: DayType;
  timePeriod: string; // e.g., "11:00-13:00" or "午市"
  startTime?: number; // Timestamp
  endTime?: number; // Timestamp
  customerInflow: number;
  orderCount: number;
  takeoutOrderCount: number;
  averageTransactionValue: number;
  employeeCount: number;
}

export interface LocationData {
  address?: string;
  locationDescription?: string;
  coordinates?: { lat: number; lng: number };
  mapUrl?: string;
}

export interface Merchant {
  id: string;
  name: string;
  images: string[];
  location?: LocationData;
  orderCount: number; // 堂食单量 (Legacy/Summary)
  takeoutOrderCount: number; // 外卖单量 (Legacy/Summary)
  averageTransactionValue: number; // 人均客单价 (Legacy/Summary)
  employeeCount: number; // 员工数量 (Legacy/Summary)
  customerInflow: number; // (Legacy/Summary)
  records: MerchantRecord[];
  isRealData: boolean;
  isBrushing: boolean; // 是否刷单
  isFakeCustomers: boolean; // 是否找人
  isModifiedPOS: boolean; // 是否修改收银
  notes: string;
  projectId: string; // 商家属于项目，可被多个商圈引用
}

export interface BusinessDistrict {
  id: string;
  name: string;
  images: string[];
  location?: LocationData;
  merchantIds: string[]; // 存储商家ID，实现重叠
  createdAt: number;
}

export interface Evaluation {
  id: string;
  name: string;
  createdAt: number;
  districtId?: string; // 关联商圈
  location?: LocationData;
  
  // Basic Info
  area: number;
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
