import React, { useState, useEffect } from 'react';
import { Header, NavView } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { NewBill } from './components/NewBill';
import { BillPreview } from './components/BillPreview';
import { BillHistory } from './components/BillHistory';
import { FarmerSupplier } from './components/FarmerSupplier';
import { Reports } from './components/Reports';
import { SettingsView } from './components/Settings';
import { Bill, BusinessSettings } from './types';
import { initializeDatabase } from './db';
import { Repository } from './db/repository';

export function App() {
  const [currentView, setCurrentView] = useState<NavView | 'PREVIEW'>('DASHBOARD');
  const [activeBill, setActiveBill] = useState<Bill | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [settings, setSettings] = useState<BusinessSettings>({
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

  useEffect(() => {
    async function init() {
      await initializeDatabase();
      const s = await Repository.getSettings();
      setSettings(s);
    }
    init();
  }, []);

  function handleNavigate(view: NavView) {
    if (view === 'NEW_BILL') {
      setEditingBill(null);
    }
    setCurrentView(view);
  }

  function handleSaveBillSuccess(bill: Bill, previewNow?: boolean) {
    setActiveBill(bill);
    const updatedSettings = Repository.getSettings().then(setSettings);

    if (previewNow) {
      setCurrentView('PREVIEW');
    } else {
      setCurrentView('HISTORY');
    }
  }

  function handleViewBill(bill: Bill) {
    setActiveBill(bill);
    setCurrentView('PREVIEW');
  }

  function handleEditBill(bill: Bill) {
    setEditingBill(bill);
    setCurrentView('NEW_BILL');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header
        currentView={currentView === 'PREVIEW' ? 'HISTORY' : currentView}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'DASHBOARD' && (
          <Dashboard
            onNavigate={handleNavigate}
            onViewBill={handleViewBill}
          />
        )}

        {currentView === 'NEW_BILL' && (
          <NewBill
            editBill={editingBill}
            onSaveSuccess={handleSaveBillSuccess}
            onCancel={() => setCurrentView('DASHBOARD')}
          />
        )}

        {currentView === 'PREVIEW' && activeBill && (
          <BillPreview
            bill={activeBill}
            settings={settings}
            onBack={() => setCurrentView('HISTORY')}
            onEdit={handleEditBill}
          />
        )}

        {currentView === 'HISTORY' && (
          <BillHistory
            onViewBill={handleViewBill}
            onEditBill={handleEditBill}
            onNewBill={() => {
              setEditingBill(null);
              setCurrentView('NEW_BILL');
            }}
          />
        )}

        {currentView === 'PARTIES' && <FarmerSupplier />}

        {currentView === 'REPORTS' && <Reports />}

        {currentView === 'SETTINGS' && <SettingsView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-200 border-t border-slate-300 py-4 text-center text-xs text-slate-600 print:hidden">
        <p className="font-bold text-slate-700">K.M.S. SEA FOODS - Weighment Slip Generator</p>
        <p className="mt-0.5">Sitharamapuram, Bypass Road, TALLAREVU. • Cell: 9666618646, 8639505906</p>
      </footer>
    </div>
  );
}
export default App;
