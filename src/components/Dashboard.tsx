import React, { useState, useEffect } from 'react';
import { Repository } from '../db/repository';
import { Bill } from '../types';
import { FilePlus, History, Users, BarChart3, Settings, TrendingUp, Calendar, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: 'NEW_BILL' | 'HISTORY' | 'PARTIES' | 'REPORTS' | 'SETTINGS') => void;
  onViewBill: (bill: Bill) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onViewBill }) => {
  const [summary, setSummary] = useState({
    todayCount: 0,
    todayTotal: 0,
    monthlyTotal: 0
  });

  const [recentBills, setRecentBills] = useState<Bill[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    const sum = await Repository.getDashboardSummary();
    setSummary(sum);

    const all = await Repository.getAllBills();
    setRecentBills(all.slice(0, 5));
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#1e548a] text-white p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">K.M.S. SEA FOODS</h1>
          <p className="text-sm text-blue-100 font-medium">
            Seafood Weighment Slip & Bill Generation Management System
          </p>
        </div>

        <button
          onClick={() => onNavigate('NEW_BILL')}
          className="flex items-center gap-2 px-5 py-3 text-sm font-black text-blue-950 bg-white hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FilePlus className="w-5 h-5 text-blue-700" />
          + CREATE NEW BILL
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Bills Count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Bills</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-800">
            {summary.todayCount} <span className="text-xs font-normal text-slate-500">slips</span>
          </p>
          <p className="text-xs text-slate-500 font-medium">Generated today</p>
        </div>

        {/* Today's Total Amount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            ₹ {summary.todayTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium">Total weighment value today</p>
        </div>

        {/* Monthly Total Amount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Total</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 font-mono">
            ₹ {summary.monthlyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium">Cumulative sales this month</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('NEW_BILL')}
            className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow transition-all text-left space-y-2 group"
          >
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
              <FilePlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">NEW BILL</h3>
              <p className="text-[11px] text-slate-500">Create weighment slip</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('HISTORY')}
            className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow transition-all text-left space-y-2 group"
          >
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">BILL HISTORY</h3>
              <p className="text-[11px] text-slate-500">Search & print slips</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('PARTIES')}
            className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow transition-all text-left space-y-2 group"
          >
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">FARMERS / SUPPLIERS</h3>
              <p className="text-[11px] text-slate-500">Customer directory</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('REPORTS')}
            className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow transition-all text-left space-y-2 group"
          >
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">REPORTS</h3>
              <p className="text-[11px] text-slate-500">Sales & party totals</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('SETTINGS')}
            className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow transition-all text-left space-y-2 group"
          >
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">SETTINGS</h3>
              <p className="text-[11px] text-slate-500">Business & printer</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Weighment Slips</h3>
          <button
            onClick={() => onNavigate('HISTORY')}
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBills.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            No bills created yet. Click "+ CREATE NEW BILL" to start!
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentBills.map((b) => (
              <div
                key={b.id}
                onClick={() => onViewBill(b)}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#d32f2f] text-sm">#{b.billNo}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{b.farmerName}</p>
                    <p className="text-xs text-slate-500">
                      {b.date} • {b.supplierName || 'No supplier'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-blue-900">
                    ₹ {b.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {b.totalWeight.toFixed(3)} kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
