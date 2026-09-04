import React, { useState, useEffect } from 'react';
import { Bill } from '../types';
import { Repository } from '../db/repository';
import { BarChart3, Download, Calendar, User, Truck, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';

export const Reports: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [reportType, setReportType] = useState<'DAILY' | 'MONTHLY' | 'FARMER' | 'SUPPLIER'>('DAILY');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    const all = await Repository.getAllBills();
    setBills(all);
  }

  // Grouping calculations
  const dailyReport = bills.reduce((acc, bill) => {
    acc[bill.date] = acc[bill.date] || { count: 0, weight: 0, amount: 0 };
    acc[bill.date].count += 1;
    acc[bill.date].weight += bill.totalWeight;
    acc[bill.date].amount += bill.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; weight: number; amount: number }>);

  const monthlyReport = bills.reduce((acc, bill) => {
    const m = bill.date.substring(0, 7);
    acc[m] = acc[m] || { count: 0, weight: 0, amount: 0 };
    acc[m].count += 1;
    acc[m].weight += bill.totalWeight;
    acc[m].amount += bill.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; weight: number; amount: number }>);

  const partyReport = bills.reduce((acc, bill) => {
    const key = reportType === 'FARMER' ? bill.farmerName : (bill.supplierName || 'Unspecified');
    if (!key) return acc;
    acc[key] = acc[key] || { count: 0, weight: 0, amount: 0 };
    acc[key].count += 1;
    acc[key].weight += bill.totalWeight;
    acc[key].amount += bill.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; weight: number; amount: number }>);

  function exportReportPDF() {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(`K.M.S. SEA FOODS - ${reportType} Sales Report`, 14, 20);
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    let startY = 38;

    pdf.setFontSize(11);
    pdf.text('Period / Name', 14, startY);
    pdf.text('Bills Count', 80, startY);
    pdf.text('Total Weight (kg)', 120, startY);
    pdf.text('Total Amount (₹)', 160, startY);
    pdf.line(14, startY + 2, 196, startY + 2);

    startY += 10;

    const data = reportType === 'DAILY' ? dailyReport : reportType === 'MONTHLY' ? monthlyReport : partyReport;

    Object.entries(data).forEach(([key, val]) => {
      if (startY > 270) {
        pdf.addPage();
        startY = 20;
      }
      pdf.text(key, 14, startY);
      pdf.text(val.count.toString(), 80, startY);
      pdf.text(val.weight.toFixed(3), 120, startY);
      pdf.text(`₹ ${val.amount.toLocaleString('en-IN')}`, 160, startY);
      startY += 8;
    });

    pdf.save(`KMS_${reportType}_Report.pdf`);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Business Reports & Analytics</h2>
          <p className="text-sm text-slate-500">
            Track daily sales, monthly totals, and weighment volumes per farmer/supplier
          </p>
        </div>

        <button
          onClick={exportReportPDF}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF Report
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReportType('DAILY')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              reportType === 'DAILY'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Daily Reports
          </button>

          <button
            onClick={() => setReportType('MONTHLY')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              reportType === 'MONTHLY'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Monthly Summaries
          </button>

          <button
            onClick={() => setReportType('FARMER')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              reportType === 'FARMER'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Farmer-wise Totals
          </button>

          <button
            onClick={() => setReportType('SUPPLIER')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              reportType === 'SUPPLIER'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            Supplier-wise Totals
          </button>
        </div>
      </div>

      {/* Report Summary Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex justify-between items-center">
          <span>{reportType} Breakdown</span>
          <span className="text-xs font-normal text-slate-500">Total Records: {bills.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">
                  {reportType === 'DAILY'
                    ? 'Date'
                    : reportType === 'MONTHLY'
                    ? 'Month'
                    : reportType === 'FARMER'
                    ? 'Farmer Name'
                    : 'Supplier Name'}
                </th>
                <th className="p-4 text-center">Bills Count</th>
                <th className="p-4 text-right">Total Weight</th>
                <th className="p-4 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {Object.keys(
                reportType === 'DAILY'
                  ? dailyReport
                  : reportType === 'MONTHLY'
                  ? monthlyReport
                  : partyReport
              ).length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No bill data available yet.
                  </td>
                </tr>
              ) : (
                Object.entries(
                  reportType === 'DAILY'
                    ? dailyReport
                    : reportType === 'MONTHLY'
                    ? monthlyReport
                    : partyReport
                ).map(([key, val]) => (
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{key}</td>
                    <td className="p-4 text-center font-semibold text-slate-600">
                      {val.count} bills
                    </td>
                    <td className="p-4 text-right font-mono font-semibold text-slate-700">
                      {val.weight.toFixed(3)} kg
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-blue-900 text-base">
                      ₹ {val.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
