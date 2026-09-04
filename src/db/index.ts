import Dexie, { type EntityTable } from 'dexie';
import { Bill, Party, BusinessSettings } from '../types';

class KMSDatabase extends Dexie {
  bills!: EntityTable<Bill, 'id'>;
  parties!: EntityTable<Party, 'id'>;
  settings!: EntityTable<BusinessSettings, 'id'>;

  constructor() {
    super('KMSSeaFoodsDB');

    this.version(1).stores({
      bills: '++id, billNo, date, farmerName, supplierName, totalAmount, createdAt',
      parties: '++id, type, name, phone',
      settings: '++id'
    });
  }
}

export const db = new KMSDatabase();

/**
 * Initializes default database settings if empty.
 */
export async function initializeDatabase() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      businessName: 'K.M.S. SEA FOODS',
      address: 'Sitharamapuram, Bypass Road, TALLAREVU.',
      phone1: '9666618646',
      phone2: '8639505906',
      startingBillNo: 608,
      currentBillNo: 608,
      paperWidth: '80mm',
      leftLogo: '',
      rightLogo: ''
    });
  }

  // Pre-seed sample parties if empty
  const partiesCount = await db.parties.count();
  if (partiesCount === 0) {
    await db.parties.bulkAdd([
      {
        type: 'FARMER',
        name: 'Rambabu (Tallarevu)',
        phone: '9848012345',
        address: 'Tallarevu Village',
        notes: 'Pond No. 4 - White Prawns',
        createdAt: new Date().toISOString()
      },
      {
        type: 'SUPPLIER',
        name: 'Srinivas Sea Traders',
        phone: '9440198765',
        address: 'Kakinada Port Road',
        notes: 'Regular Vannamei Exporter',
        createdAt: new Date().toISOString()
      }
    ]);
  }
}
