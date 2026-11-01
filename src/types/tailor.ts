export interface ShopProfile {
  name: string;
  phone: string;
  address: string;
  currency: string;
  karigarNote: string;
  licensed: boolean;
  activationDate: string;
  licenseKey: string;
}

export interface OrderMeasurements {
  len: string;     // 1. لمبائی (Length)
  bazu: string;    // 2. بازو (Sleeve)
  teera: string;   // 3. تیرا (Shoulder)
  collar: string;  // 4. کالر / بین (Collar/Ban)
  chest: string;   // 5. چھاتی (Chest)
  ghera: string;   // 6. چوڑائی / گھیرا (Ghera)
  shalwar: string; // 7. شلوار (Shalwar length)
  paincha: string; // 8. پائنچہ (Paincha)
  waist?: string;  // کمر (Waist - optional)
  asan?: string;   // آسن (Asan - optional)
}

export type CollarType = 'کالر' | 'فل بین' | 'کٹ بین' | 'ہاف بین';
export type CuffType = 'گول کف' | 'چورس کف' | 'کٹ کف' | 'سادہ آستین';
export type DamanType = 'گول دامن' | 'چورس دامن';
export type PocketType = '2 سائیڈ جیب' | '1 سامنے+2 سائیڈ' | '1 سامنے+1 سائیڈ' | 'شلوار جیب';
export type KajType = 'سادہ کاج' | 'آنکھ کاج' | 'ڈبل کاج';
export type ButtonType = 'ٹچ بٹن' | 'سادہ بٹن' | 'فینسی بٹن' | 'بغیر بٹن';

export interface OrderStyles {
  collar: CollarType;
  cuff: CuffType;
  daman: DamanType;
  pocket: PocketType;
  kaj: KajType;
  button: ButtonType;
}

export type OrderStatus = 'cutting' | 'stitching' | 'ready' | 'delivered';

export interface OrderBill {
  total: number;
  advance: number;
  remaining: number;
  status: 'paid' | 'partial' | 'unpaid';
}

export interface CustomerOrder {
  id: string;
  slipNo: number;
  createdAt: string;
  name: string;
  phone: string;
  deliveryDate: string;
  qty: number;
  clothType?: string;
  fabricColor?: string;
  urgency: 'normal' | 'urgent';
  measurements: OrderMeasurements;
  styles: OrderStyles;
  notes?: string;
  photoUrl?: string;
  bill: OrderBill;
  status: OrderStatus;
  karigarName?: string;
}

export const DEFAULT_SHOP_PROFILE: ShopProfile = {
  name: 'الخیر ٹیلرز ماسٹر (Al-Khair Tailors)',
  phone: '03001234567',
  address: 'مین بازار، نزد جامع مسجد، لاہور',
  currency: 'روپے',
  karigarNote: 'براہ کرم ترپائی اور استری صفائی سے کریں۔ سلائی معیار اعلیٰ ہو۔',
  licensed: true,
  activationDate: new Date().toISOString(),
  licenseKey: 'OBS-VIP'
};

export const SAMPLE_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-101',
    slipNo: 1001,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    name: 'محمد عثمان بٹ',
    phone: '03017654321',
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    qty: 2,
    clothType: 'کاٹن (Cotton)',
    fabricColor: 'آف وائٹ (Off-White)',
    urgency: 'normal',
    measurements: {
      len: '41.5',
      bazu: '23.5',
      teera: '18.5',
      collar: '15.5',
      chest: '22',
      ghera: '24',
      shalwar: '38.5',
      paincha: '8.5',
      waist: '21',
      asan: '16'
    },
    styles: {
      collar: 'کٹ بین',
      cuff: 'گول کف',
      daman: 'گول دامن',
      pocket: '1 سامنے+2 سائیڈ',
      kaj: 'آنکھ کاج',
      button: 'فینسی بٹن'
    },
    notes: 'کلف ہلکا لگائیں، ڈبل سلائی کریں۔',
    bill: {
      total: 3000,
      advance: 1500,
      remaining: 1500,
      status: 'partial'
    },
    status: 'stitching',
    karigarName: 'استاد رشید کاریگر'
  },
  {
    id: 'ord-102',
    slipNo: 1002,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    name: 'چوہدری طارق جاوید',
    phone: '03219876543',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    qty: 1,
    clothType: 'واش اینڈ ویئر (Wash & Wear)',
    fabricColor: 'کالا (Black)',
    urgency: 'urgent',
    measurements: {
      len: '39',
      bazu: '22',
      teera: '17.5',
      collar: '15',
      chest: '21',
      ghera: '22.5',
      shalwar: '37',
      paincha: '8',
      waist: '20',
      asan: '15.5'
    },
    styles: {
      collar: 'کالر',
      cuff: 'چورس کف',
      daman: 'چورس دامن',
      pocket: '2 سائیڈ جیب',
      kaj: 'سادہ کاج',
      button: 'ٹچ بٹن'
    },
    notes: 'کل شام تک ارجنٹ چاہیئے!',
    bill: {
      total: 2000,
      advance: 2000,
      remaining: 0,
      status: 'paid'
    },
    status: 'cutting',
    karigarName: 'اسلم ماسٹر'
  },
  {
    id: 'ord-103',
    slipNo: 1003,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    name: 'حاجی بشیر احمد',
    phone: '03454321098',
    deliveryDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    qty: 3,
    clothType: 'بوسکی (Boski)',
    fabricColor: 'سفید (White)',
    urgency: 'normal',
    measurements: {
      len: '42',
      bazu: '24',
      teera: '19',
      collar: '16',
      chest: '23.5',
      ghera: '25',
      shalwar: '39',
      paincha: '9',
      waist: '23',
      asan: '17'
    },
    styles: {
      collar: 'فل بین',
      cuff: 'سادہ آستین',
      daman: 'گول دامن',
      pocket: '1 سامنے+1 سائیڈ',
      kaj: 'سادہ کاج',
      button: 'سادہ بٹن'
    },
    notes: 'شلوار میں لاسٹک اور جیب بھی لگانی ہے۔',
    bill: {
      total: 4500,
      advance: 2000,
      remaining: 2500,
      status: 'partial'
    },
    status: 'ready',
    karigarName: 'استاد رشید کاریگر'
  }
];
