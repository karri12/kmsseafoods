import React, { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { Repository } from '../db/repository';
import { Save, RefreshCw, Printer, Building, Phone, MapPin, Hash, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
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

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await Repository.getSettings();
    setSettings(data);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await Repository.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  function handleResetDefaults() {
    setSettings({
      businessName: 'K.M.S. SEA FOODS',
      address: 'Sitharamapuram, Bypass Road, TALLAREVU.',
      phone1: '9666618646',
      phone2: '8639505906',
      startingBillNo: 608,
      currentBillNo: settings.currentBillNo || 608,
      paperWidth: '80mm',
      leftLogo: '',
      rightLogo: ''
    });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Application Settings</h2>
          <p className="text-sm text-slate-500">
            Configure header business details, bill counter, and printer paper format
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Header Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Building className="w-5 h-5 text-blue-700" />
            Business Details (Header Information)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm font-bold text-blue-950 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Business Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Primary Mobile Number
              </label>
              <input
                type="text"
                value={settings.phone1}
                onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Secondary Mobile Number
              </label>
              <input
                type="text"
                value={settings.phone2}
                onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bill Counter & Printer Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Printer className="w-5 h-5 text-blue-700" />
            Bill Counter & Thermal Printer Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Starting Bill Sequence Number
              </label>
              <input
                type="number"
                value={settings.startingBillNo}
                onChange={(e) => setSettings({ ...settings, startingBillNo: parseInt(e.target.value) || 608 })}
                className="w-full px-3.5 py-2 text-sm font-bold text-[#d32f2f] bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Default sequence starts at #608</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Paper Width Format
              </label>
              <select
                value={settings.paperWidth}
                onChange={(e) => setSettings({ ...settings, paperWidth: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="80mm">80mm Thermal Receipt (Standard Slip)</option>
                <option value="58mm">58mm Compact Thermal Receipt</option>
                <option value="A4">A4 Full Page Document</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Default K.M.S. SEA FOODS Info
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>

      {/* Backup & Restore Data Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Save className="w-5 h-5 text-blue-700" />
          Backup & Restore Application Data
        </h3>
        <p className="text-xs text-slate-500">
          Export all your bills, farmers, suppliers, and sequence numbers into a secure backup file, or restore from a previous backup.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Backup Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <h4 className="font-bold text-sm text-slate-800">BACKUP DATA</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download all current data (bills, customers, settings) as a single JSON file. Save this to Google Drive, WhatsApp, or your computer for safekeeping.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  const jsonStr = await Repository.exportBackupJSON();
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  const dateStr = new Date().toISOString().split('T')[0];
                  a.href = url;
                  a.download = `KMS_SeaFoods_Backup_${dateStr}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('Backup failed:', err);
                  alert('Failed to generate backup.');
                }
              }}
              className="w-full py-2.5 px-4 bg-[#093563] hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2"
            >
              📥 Download Backup JSON
            </button>
          </div>

          {/* Restore Card */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
            <h4 className="font-bold text-sm text-amber-900">RESTORE DATA</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Upload a previously downloaded JSON backup file. <span className="font-bold text-red-600">Warning:</span> This will replace existing records with the backup file data.
            </p>
            <label className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer">
              📤 Select Backup JSON File
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const confirmed = window.confirm(
                    'Are you sure you want to restore data from this backup file? This will replace current records.'
                  );
                  if (!confirmed) {
                    e.target.value = '';
                    return;
                  }

                  try {
                    const text = await file.text();
                    const res = await Repository.importRestoreJSON(text);
                    alert(`Data successfully restored! Restored ${res.billsCount} bills and ${res.partiesCount} parties.`);
                    window.location.reload();
                  } catch (err: any) {
                    console.error('Restore failed:', err);
                    alert(`Failed to restore data: ${err.message || 'Invalid file.'}`);
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
