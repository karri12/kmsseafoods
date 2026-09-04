import React, { useState, useEffect } from 'react';
import { Bill, BillItem, Party, BusinessSettings } from '../types';
import { Repository } from '../db/repository';
import { calculateBillTotals } from '../utils/calculator';
import { numberToIndianWords } from '../utils/numberToWords';
import { Plus, Trash2, Save, Eye, RefreshCw, UserPlus } from 'lucide-react';

interface NewBillProps {
  editBill?: Bill | null;
  onSaveSuccess: (bill: Bill, previewNow?: boolean) => void;
  onCancel?: () => void;
}

export const NewBill: React.FC<NewBillProps> = ({ editBill, onSaveSuccess, onCancel }) => {
  const [billNo, setBillNo] = useState<number>(608);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [farmerName, setFarmerName] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');

  const [farmers, setFarmers] = useState<Party[]>([]);
  const [suppliers, setSuppliers] = useState<Party[]>([]);

  const [items, setItems] = useState<BillItem[]>([
    {
      id: '1',
      particulars: '',
      count: '',
      kgs: '',
      gms: '',
      rate: '',
      weight: 0,
      amount: 0,
      rs: 0,
      ps: 0
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [editBill]);

  async function loadInitialData() {
    const farmersList = await Repository.getPartiesByType('FARMER');
    const suppliersList = await Repository.getPartiesByType('SUPPLIER');
    setFarmers(farmersList);
    setSuppliers(suppliersList);

    if (editBill) {
      setBillNo(editBill.billNo);
      setDate(editBill.date);
      setFarmerName(editBill.farmerName);
      setSupplierName(editBill.supplierName);
      setItems(editBill.items);
    } else {
      const nextNo = await Repository.getNextBillNumber();
      setBillNo(nextNo);
      setDate(new Date().toISOString().split('T')[0]);
      setFarmerName('');
      setSupplierName('');
      setItems([
        {
          id: Date.now().toString(),
          particulars: '',
          count: '',
          kgs: '',
          gms: '',
          rate: '',
          weight: 0,
          amount: 0,
          rs: 0,
          ps: 0
        }
      ]);
    }
  }

  // Calculate live totals
  const totals = calculateBillTotals(items);
  const rupeesInWords = numberToIndianWords(totals.totalAmount);

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        id: (Date.now() + Math.random()).toString(),
        particulars: '',
        count: '',
        kgs: '',
        gms: '',
        rate: '',
        weight: 0,
        amount: 0,
        rs: 0,
        ps: 0
      }
    ]);
  }

  function handleRemoveItem(id: string) {
    if (items.length <= 1) {
      alert('A bill must have at least one item row.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleItemChange(
    id: string,
    field: keyof BillItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let updatedValue = value;

        // Prevent negative values for numeric fields
        if (['count', 'kgs', 'gms', 'rate'].includes(field)) {
          if (value === '' || value === null) {
            updatedValue = '';
          } else {
            const num = Number(value);
            updatedValue = isNaN(num) ? '' : Math.max(0, num);
          }
        }

        return {
          ...item,
          [field]: updatedValue
        };
      })
    );
  }

  async function handleSave(previewNow: boolean = false) {
    if (!farmerName.trim()) {
      alert('Please enter or select a Farmer Name.');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    setIsSaving(true);
    try {
      const billData: Omit<Bill, 'id'> & { id?: number } = {
        ...(editBill?.id ? { id: editBill.id } : {}),
        billNo,
        date,
        farmerName: farmerName.trim(),
        supplierName: supplierName.trim(),
        items: totals.items,
        totalWeight: totals.totalWeight,
        totalAmount: totals.totalAmount,
        totalRs: totals.totalRs,
        totalPs: totals.totalPs,
        rupeesInWords,
        createdAt: editBill?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const savedId = await Repository.saveBill(billData);
      const fullBill: Bill = { ...billData, id: savedId };

      onSaveSuccess(fullBill, previewNow);
    } catch (err) {
      console.error('Error saving bill:', err);
      alert('Failed to save bill. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {editBill ? `Edit Bill #${editBill.billNo}` : 'New Weighment Slip / Bill'}
          </h2>
          <p className="text-sm text-slate-500">
            Enter weighment details for seafood batch calculation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadInitialData()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Form"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Bill Meta Data Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bill No */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Bill Number #
            </label>
            <input
              type="number"
              value={billNo}
              onChange={(e) => setBillNo(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-base font-bold text-[#d32f2f] bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Date (Dt)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Farmer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="farmers-list"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="Type or select farmer"
                className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="farmers-list">
                {farmers.map((f) => (
                  <option key={f.id} value={f.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Supplier Name
            </label>
            <div className="relative">
              <input
                type="text"
                list="suppliers-list"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Type or select supplier"
                className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="suppliers-list">
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Line Items Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Weighment Items</h3>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Add Row
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-3">Particulars</th>
                <th className="p-3 w-24">Count</th>
                <th className="p-3 w-28">Kgs</th>
                <th className="p-3 w-24">Gms</th>
                <th className="p-3 w-28">Rate (₹)</th>
                <th className="p-3 w-32 text-right">Weight (Kg)</th>
                <th className="p-3 w-36 text-right">Amount (₹)</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {totals.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  {/* Particulars */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.particulars}
                      onChange={(e) => handleItemChange(item.id, 'particulars', e.target.value)}
                      placeholder="e.g. Vannamei"
                      className="w-full px-2.5 py-1.5 font-medium border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Count */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.count}
                      onChange={(e) => handleItemChange(item.id, 'count', e.target.value)}
                      placeholder="169"
                      className="w-full px-2 py-1.5 font-mono text-center border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Kgs */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.kgs}
                      onChange={(e) => handleItemChange(item.id, 'kgs', e.target.value)}
                      placeholder="1340"
                      className="w-full px-2 py-1.5 font-mono text-right border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Gms */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.gms}
                      onChange={(e) => handleItemChange(item.id, 'gms', e.target.value)}
                      placeholder="200"
                      className="w-full px-2 py-1.5 font-mono text-right border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Rate */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                      placeholder="153"
                      className="w-full px-2 py-1.5 font-mono text-right border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Calculated Weight */}
                  <td className="p-3 text-right font-mono font-bold text-slate-700 bg-slate-50/50">
                    {item.weight > 0 ? `${item.weight.toFixed(3)} kg` : '0.000 kg'}
                  </td>

                  {/* Calculated Amount */}
                  <td className="p-3 text-right font-mono font-bold text-blue-900 bg-blue-50/30">
                    <div>₹ {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Rs. {item.rs.toLocaleString('en-IN')} / Ps. {item.ps < 10 ? `0${item.ps}` : item.ps}
                    </div>
                  </td>

                  {/* Remove Button */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary & Words */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Rupees In Words
            </p>
            <p className="text-sm font-bold text-slate-800 italic leading-relaxed">
              "{rupeesInWords}"
            </p>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-lg border border-blue-200 space-y-2 text-right">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
              <span>Total Weight:</span>
              <span className="font-mono font-bold text-slate-800 text-base">
                {totals.totalWeight.toFixed(3)} kg
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-black text-blue-950 border-t border-blue-200 pt-2">
              <span>Total Amount:</span>
              <span className="font-mono text-xl text-blue-900">
                ₹ {totals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              (Rs. {totals.totalRs.toLocaleString('en-IN')} + Ps. {totals.totalPs})
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          Save Bill
        </button>

        <button
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Eye className="w-4 h-4" />
          Save & Preview Bill
        </button>
      </div>
    </div>
  );
};
