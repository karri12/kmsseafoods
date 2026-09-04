import React from 'react';
import { LayoutDashboard, FilePlus, History, Users, BarChart3, Settings, WifiOff } from 'lucide-react';

export type NavView = 'DASHBOARD' | 'NEW_BILL' | 'HISTORY' | 'PARTIES' | 'REPORTS' | 'SETTINGS';

interface HeaderProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="bg-[#0d3b66] text-white shadow-md sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Business Brand & Logo */}
          <div
            onClick={() => onNavigate('DASHBOARD')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-black text-lg text-white border border-white/20 group-hover:bg-white/20 transition-all">
              KMS
            </div>
            <div>
              <h1 className="font-black tracking-wide text-base md:text-lg text-white leading-tight">
                K.M.S. SEA FOODS
              </h1>
              <p className="text-[10px] text-blue-200 tracking-wider uppercase font-semibold">
                Tallarevu Weighment Slips
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('DASHBOARD')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                currentView === 'DASHBOARD'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => onNavigate('NEW_BILL')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                currentView === 'NEW_BILL'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              New Bill
            </button>

            <button
              onClick={() => onNavigate('HISTORY')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                currentView === 'HISTORY'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Bill History
            </button>

            <button
              onClick={() => onNavigate('PARTIES')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                currentView === 'PARTIES'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Farmers/Suppliers
            </button>

            <button
              onClick={() => onNavigate('REPORTS')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                currentView === 'REPORTS'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>

            <button
              onClick={() => onNavigate('SETTINGS')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                currentView === 'SETTINGS'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>

          {/* Offline Badge */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
              <WifiOff className="w-3 h-3" />
              100% Offline Ready
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Touch Nav Bar */}
      <div className="flex md:hidden border-t border-white/10 bg-[#092b4c] px-2 py-1 justify-around text-center">
        <button
          onClick={() => onNavigate('DASHBOARD')}
          className={`p-2 text-[10px] font-bold flex flex-col items-center gap-0.5 ${
            currentView === 'DASHBOARD' ? 'text-white' : 'text-blue-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Home
        </button>

        <button
          onClick={() => onNavigate('NEW_BILL')}
          className={`p-2 text-[10px] font-bold flex flex-col items-center gap-0.5 ${
            currentView === 'NEW_BILL' ? 'text-white' : 'text-blue-300'
          }`}
        >
          <FilePlus className="w-4 h-4" />
          + Bill
        </button>

        <button
          onClick={() => onNavigate('HISTORY')}
          className={`p-2 text-[10px] font-bold flex flex-col items-center gap-0.5 ${
            currentView === 'HISTORY' ? 'text-white' : 'text-blue-300'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>

        <button
          onClick={() => onNavigate('PARTIES')}
          className={`p-2 text-[10px] font-bold flex flex-col items-center gap-0.5 ${
            currentView === 'PARTIES' ? 'text-white' : 'text-blue-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Parties
        </button>

        <button
          onClick={() => onNavigate('REPORTS')}
          className={`p-1.5 text-[10px] font-bold flex flex-col items-center gap-0.5 ${
            currentView === 'REPORTS' ? 'text-white' : 'text-blue-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Reports
        </button>

        <button
          onClick={() => onNavigate('SETTINGS')}
          className={`p-1.5 text-[10px] font-bold flex flex-col items-center gap-0.5 ${
            currentView === 'SETTINGS' ? 'text-white' : 'text-blue-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </header>
  );
};
