import React, { useState, useEffect } from 'react';
import { Bill } from '../types';
import { Repository } from '../db/repository';
import { Search, Eye, Edit, Trash2, Printer, Download, Calendar, Filter } from 'lucide-react';
import { generateBillPDF } from '../utils/printHelper';

interface BillHistoryProps {
  onViewBill: (bill: Bill) => void;
  onEditBill: (bill: Bill) => void;
  onNewBill: () => void;
}

export const BillHistory: React.FC<BillHistoryProps> = ({
  onViewBill,
  onEditBill,
  onNewBill
}) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH' | 'CUSTOM'>('ALL');
  const [customDate, setCustomDate] = useState('');

  useEffect(() => {
    loadBills();
  }, [searchQuery, dateFilter, customDate]);

  async function loadBills() {
    setIsLoading(true);
    try {
      let results = await Repository.searchBills(searchQuery);

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);

      const monthStr = todayStr.substring(0, 7);

      if (dateFilter === 'TODAY') {
        results = results.filter((b) => b.date === todayStr);
      } else if (dateFilter === 'YESTERDAY') {
        results = results.filter((b) => b.date === yesterdayStr);
      } else if (dateFilter === 'WEEK') {
        results = results.filter((b) => new Date(b.date) >= oneWeekAgo);
      } else if (dateFilter === 'MONTH') {
        results = results.filter((b) => b.date.startsWith(monthStr));
      } else if (dateFilter === 'CUSTOM' && customDate) {
        results = results.filter((b) => b.date === customDate);
      }

      setBills(results);
    } catch (err) {
      console.error('Error searching bills:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id?: number, billNo?: number) {
    if (!id) return;
    if (!window.confirm(`Are you sure you want to delete Bill #${billNo}?`)) return;

    await Repository.deleteBill(id);
    await loadBills();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Bill & Weighment History</h2>
          <p className="text-sm text-slate-500">
            View, search, edit, or reprint all locally saved seafood weighment slips
          </p>
        </div>

        <button
          onClick={onNewBill}
          className="px-4 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all"
        >
          + Create New Bill
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Bill No, Farmer Name, Supplier Name, or Date (YYYY-MM-DD)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Date Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Date:
          </span>

          {(['ALL', 'TODAY', 'YESTERDAY', 'WEEK', 'MONTH', 'CUSTOM'] as const).map((filter) => {
            const labels = {
              ALL: 'All Time',
              TODAY: 'Today',
              YESTERDAY: 'Yesterday',
              WEEK: 'This Week',
              MONTH: 'This Month',
              CUSTOM: 'Custom Date'
            };
            return (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  dateFilter === filter
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}

          {dateFilter === 'CUSTOM' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="ml-2 px-2.5 py-1 text-xs font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          )}
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading bill history...
          </div>
        ) : bills.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-500 font-semibold">No bills found matching your query.</p>
            <button
              onClick={onNewBill}
              className="px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Generate your first bill
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Bill No</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Farmer Name</th>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4 text-right">Total Weight</th>
                  <th className="p-4 text-right">Total Amount</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Bill No */}
                    <td className="p-4 font-bold text-[#d32f2f] text-base">
                      #{bill.billNo}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-600 font-medium">
                      {bill.date}
                    </td>

                    {/* Farmer */}
                    <td className="p-4 font-bold text-slate-800">
                      {bill.farmerName}
                    </td>

                    {/* Supplier */}
                    <td className="p-4 text-slate-600">
                      {bill.supplierName || '—'}
                    </td>

                    {/* Total Weight */}
                    <td className="p-4 text-right font-mono font-semibold text-slate-700">
                      {bill.totalWeight.toFixed(3)} kg
                    </td>

                    {/* Total Amount */}
                    <td className="p-4 text-right font-mono font-bold text-blue-900">
                      ₹ {bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewBill(bill)}
                          className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View / Print Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditBill(bill)}
                          className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Bill"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(bill.id, bill.billNo)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
