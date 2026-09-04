export interface BillItem {
  id: string;
  particulars: string;
  count: number | '';
  kgs: number | '';
  gms: number | '';
  rate: number | '';
  weight: number;   // Calculated: Kgs + (Gms / 1000)
  amount: number;   // Calculated: Weight * Rate
  rs: number;       // Calculated integer Rupees
  ps: number;       // Calculated decimal Paise
}

export interface Bill {
  id?: number;
  billNo: number;
  date: string;
  farmerName: string;
  supplierName: string;
  items: BillItem[];
  totalWeight: number;
  totalAmount: number;
  totalRs: number;
  totalPs: number;
  rupeesInWords: string;
  createdAt: string;
  updatedAt: string;
}

export type PartyType = 'FARMER' | 'SUPPLIER';

export interface Party {
  id?: number;
  type: PartyType;
  name: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface BusinessSettings {
  id?: number;
  businessName: string;
  address: string;
  phone1: string;
  phone2: string;
  startingBillNo: number;
  currentBillNo: number;
  paperWidth: '80mm' | '58mm' | 'A4';
  leftLogo: string;
  rightLogo: string;
}
