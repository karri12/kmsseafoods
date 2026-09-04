import { db } from './index';
import { Bill, Party, BusinessSettings } from '../types';

export const Repository = {
  // Settings operations
  async getSettings(): Promise<BusinessSettings> {
    const list = await db.settings.toArray();
    if (list.length > 0) return list[0];
    return {
      businessName: 'K.M.S. SEA FOODS',
      address: 'Sitharamapuram, Bypass Road, TALLAREVU.',
      phone1: '9666618646',
      phone2: '8639505906',
      startingBillNo: 608,
      currentBillNo: 608,
      paperWidth: '80mm',
      leftLogo: '',
      rightLogo: ''
    };
  },

  async updateSettings(settings: Partial<BusinessSettings>): Promise<void> {
    const current = await this.getSettings();
    if (current.id) {
      await db.settings.update(current.id, settings);
    } else {
      await db.settings.add({ ...current, ...settings });
    }
  },

  async getNextBillNumber(): Promise<number> {
    const settings = await this.getSettings();
    const lastBill = await db.bills.orderBy('billNo').last();
    if (lastBill && lastBill.billNo >= settings.currentBillNo) {
      return lastBill.billNo + 1;
    }
    return settings.currentBillNo;
  },

  // Bill operations
  async saveBill(bill: Omit<Bill, 'id'> & { id?: number }): Promise<number> {
    if (bill.id) {
      await db.bills.update(bill.id, {
        ...bill,
        updatedAt: new Date().toISOString()
      });
      return bill.id;
    } else {
      const id = await db.bills.add(bill as Bill);
      // Update current bill counter in settings if higher
      const settings = await this.getSettings();
      if (bill.billNo >= settings.currentBillNo) {
        await this.updateSettings({ currentBillNo: bill.billNo + 1 });
      }
      return id as number;
    }
  },

  async getBillById(id: number): Promise<Bill | undefined> {
    return await db.bills.get(id);
  },

  async deleteBill(id: number): Promise<void> {
    await db.bills.delete(id);
  },

  async getAllBills(): Promise<Bill[]> {
    return await db.bills.orderBy('billNo').reverse().toArray();
  },

  async searchBills(query: string): Promise<Bill[]> {
    const q = query.toLowerCase().trim();
    if (!q) return await this.getAllBills();

    const all = await this.getAllBills();
    return all.filter((b) =>
      b.billNo.toString().includes(q) ||
      b.farmerName.toLowerCase().includes(q) ||
      b.supplierName.toLowerCase().includes(q) ||
      b.date.includes(q)
    );
  },

  // Party operations (Farmers & Suppliers)
  async getAllParties(): Promise<Party[]> {
    return await db.parties.orderBy('name').toArray();
  },

  async getPartiesByType(type: 'FARMER' | 'SUPPLIER'): Promise<Party[]> {
    return await db.parties.where('type').equals(type).toArray();
  },

  async saveParty(party: Omit<Party, 'id'> & { id?: number }): Promise<number> {
    if (party.id) {
      await db.parties.update(party.id, party);
      return party.id;
    } else {
      return (await db.parties.add(party as Party)) as number;
    }
  },

  async deleteParty(id: number): Promise<void> {
    await db.parties.delete(id);
  },

  // Analytics & Reports
  async getDashboardSummary() {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM

    const allBills = await db.bills.toArray();

    const todayBills = allBills.filter((b) => b.date === today);
    const monthlyBills = allBills.filter((b) => b.date.startsWith(currentMonth));

    const todayCount = todayBills.length;
    const todayTotal = todayBills.reduce((acc, b) => acc + b.totalAmount, 0);
    const monthlyTotal = monthlyBills.reduce((acc, b) => acc + b.totalAmount, 0);

    return {
      todayCount,
      todayTotal,
      monthlyTotal
    };
  },

  // Backup & Restore
  async exportBackupJSON(): Promise<string> {
    const bills = await db.bills.toArray();
    const parties = await db.parties.toArray();
    const settings = await this.getSettings();

    const backupPayload = {
      version: 1,
      appName: 'K.M.S. SEA FOODS BILLING',
      exportedAt: new Date().toISOString(),
      data: {
        bills,
        parties,
        settings
      }
    };

    return JSON.stringify(backupPayload, null, 2);
  },

  async importRestoreJSON(jsonString: string): Promise<{ billsCount: number; partiesCount: number }> {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) {
      throw new Error('Invalid backup file format. Missing data object.');
    }

    const { bills = [], parties = [], settings } = parsed.data;

    await db.transaction('rw', db.bills, db.parties, db.settings, async () => {
      // Clear existing records
      await db.bills.clear();
      await db.parties.clear();
      await db.settings.clear();

      // Bulk insert restored records
      if (bills.length > 0) {
        await db.bills.bulkAdd(bills);
      }
      if (parties.length > 0) {
        await db.parties.bulkAdd(parties);
      }
      if (settings) {
        await db.settings.add(settings);
      }
    });

    return {
      billsCount: bills.length,
      partiesCount: parties.length
    };
  }
};
