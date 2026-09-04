import React, { useRef } from 'react';
import { Bill, BusinessSettings } from '../types';
import { LAKSHMI_LOGO_B64, GANESHA_LOGO_B64 } from './logoBase64';
import { formatIndianRupeesOnly } from '../utils/calculator';
import { triggerPrint, generateBillPDF, shareBillPDF } from '../utils/printHelper';
import { Printer, Download, Share2, ArrowLeft, Edit } from 'lucide-react';

interface BillPreviewProps {
  bill: Bill;
  settings: BusinessSettings;
  onBack?: () => void;
  onEdit?: (bill: Bill) => void;
}

export const BillPreview: React.FC<BillPreviewProps> = ({
  bill,
  settings,
  onBack,
  onEdit
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Pad to 12 total rows to preserve the exact physical slip height and proportions
  const TOTAL_GRID_ROWS = 12;
  const emptyRowsCount = Math.max(0, TOTAL_GRID_ROWS - bill.items.length);
  const emptyRows = Array.from({ length: emptyRowsCount });

  // Format rupees in words string to split cleanly if long
  const wordsText = bill.rupeesInWords.replace(/^Rupees\s+/, '').replace(/\s+Only$/, '');

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <h2 className="text-lg font-bold text-slate-800">Bill #{bill.billNo} Paper Slip Preview</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(bill)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          
          <button
            onClick={() => triggerPrint()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#093563] hover:bg-blue-900 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            PRINT BILL
          </button>

          <button
            onClick={() => generateBillPDF('paper-bill-container', `KMS_Bill_${bill.billNo}.pdf`)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Save as PDF
          </button>

          <button
            onClick={() => shareBillPDF('paper-bill-container', `KMS_Bill_${bill.billNo}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Bill
          </button>
        </div>
      </div>

      {/* Bill Container - Pixel-Matched Replica of K.M.S. SEA FOODS Paper Bill Slip */}
      <div className="flex justify-center bg-slate-200/60 p-4 md:p-8 rounded-xl overflow-x-auto print:p-0 print:bg-white">
        <div
          id="paper-bill-container"
          ref={printRef}
          className="w-[380px] max-w-[380px] md:w-[420px] md:max-w-[420px] print:w-[380px] print:max-w-[380px] bg-white border-[2.5px] border-[#093563] rounded-2xl p-3.5 md:p-4 text-[#093563] font-sans shadow-xl print:shadow-none print:border-[2.5px] print:border-[#093563]"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Header with Authentic Lakshmi & Ganesha Logos */}
          <div className="relative border-b-2 border-[#093563] pb-2 text-center">
            {/* Left Lakshmi Logo */}
            <div className="absolute left-0 top-0.5 w-11 h-13 md:w-12 md:h-14 flex items-center justify-center">
              <img
                src={LAKSHMI_LOGO_B64}
                alt="Lakshmi"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Right Ganesha Logo */}
            <div className="absolute right-0 top-0.5 w-11 h-13 md:w-12 md:h-14 flex items-center justify-center">
              <img
                src={GANESHA_LOGO_B64}
                alt="Ganesha"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Business Header Titles */}
            <div className="px-10">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#093563] uppercase leading-tight font-serif">
                {settings.businessName || 'K.M.S. SEA FOODS'}
              </h1>
              <p className="text-[11px] md:text-xs font-semibold leading-tight mt-1 text-[#093563]">
                Sitharamapuram. Bypass Road,<span className="font-black">TALLAREVU.</span>
              </p>
              <p className="text-[11px] md:text-xs font-bold tracking-tight mt-0.5 text-[#093563]">
                Cell:{settings.phone1 || '9666618646'}, {settings.phone2 || '8639505906'}
              </p>
            </div>
          </div>

          {/* Subheader: No. 608 & Dt, Farmer Name, Supplier Name */}
          <div className="text-xs md:text-sm font-semibold space-y-2 my-2.5">
            <div className="flex justify-between items-baseline">
              <div className="flex items-baseline">
                <span className="text-sm md:text-base font-bold text-[#093563]">No.</span>
                <span className="text-[#c5221f] font-black text-lg md:text-xl ml-3 tracking-wide">
                  {bill.billNo}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-xs md:text-sm font-bold text-[#093563]">Dt.</span>
                <span className="border-b border-dotted border-[#093563] min-w-[100px] text-center font-bold text-[#093563] ml-1">
                  {bill.date}
                </span>
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="whitespace-nowrap text-xs md:text-sm font-bold text-[#093563]">Farmer Name:</span>
              <span className="border-b border-dotted border-[#093563] flex-1 font-bold text-[#093563] ml-1 px-1.5 truncate">
                {bill.farmerName || '...................................................'}
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="whitespace-nowrap text-xs md:text-sm font-bold text-[#093563]">Supplier Name</span>
              <span className="border-b border-dotted border-[#093563] flex-1 font-bold text-[#093563] ml-1 px-1.5 truncate">
                {bill.supplierName || '...................................................'}
              </span>
            </div>
          </div>

          {/* Main Table Grid matching physical format */}
          <div className="border-[2px] border-[#093563] text-[10px] md:text-xs">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 border-b-[2px] border-[#093563] font-bold text-center leading-tight">
              <div className="col-span-3 border-r-[1.5px] border-[#093563] py-1 flex items-center justify-center font-black">
                PARTIC-
                <br />
                ULARES
              </div>
              <div className="col-span-2 border-r-[1.5px] border-[#093563] py-1 flex items-center justify-center font-black">
                COUNT
              </div>
              <div className="col-span-3 border-r-[1.5px] border-[#093563]">
                <div className="border-b-[1.5px] border-[#093563] py-0.5 font-black">QTY</div>
                <div className="grid grid-cols-2 text-[9px] md:text-[10px]">
                  <div className="border-r-[1.5px] border-[#093563] py-0.5 font-bold">Kgs/</div>
                  <div className="py-0.5 font-bold">Gms.</div>
                </div>
              </div>
              <div className="col-span-2 border-r-[1.5px] border-[#093563] py-1 flex items-center justify-center font-black">
                RATE
              </div>
              <div className="col-span-2">
                <div className="border-b-[1.5px] border-[#093563] py-0.5 font-black">AMOUNT</div>
                <div className="grid grid-cols-2 text-[9px] md:text-[10px]">
                  <div className="border-r-[1.5px] border-[#093563] py-0.5 font-bold">Rs.</div>
                  <div className="py-0.5 font-bold">Ps.</div>
                </div>
              </div>
            </div>

            {/* Filled Item Rows */}
            {bill.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="grid grid-cols-12 border-b border-[#093563]/30 min-h-[24px] text-center items-center font-semibold text-[#093563]"
              >
                <div className="col-span-3 border-r-[1.5px] border-[#093563] px-1 text-left truncate font-bold text-[11px]">
                  {item.particulars}
                </div>
                <div className="col-span-2 border-r-[1.5px] border-[#093563] px-0.5 font-mono font-bold">
                  {item.count !== '' ? item.count : ''}
                </div>
                <div className="col-span-3 border-r-[1.5px] border-[#093563] grid grid-cols-2 h-full items-center">
                  <div className="border-r-[1.5px] border-[#093563] px-0.5 text-right font-mono font-bold">
                    {item.kgs !== '' ? item.kgs : ''}
                  </div>
                  <div className="px-0.5 text-right font-mono font-bold">
                    {item.gms !== '' ? item.gms : ''}
                  </div>
                </div>
                <div className="col-span-2 border-r-[1.5px] border-[#093563] px-0.5 text-right font-mono font-bold">
                  {item.rate !== '' ? item.rate : ''}
                </div>
                <div className="col-span-2 grid grid-cols-2 h-full items-center">
                  <div className="border-r-[1.5px] border-[#093563] px-0.5 text-right font-mono font-black">
                    {item.rs > 0 ? formatIndianRupeesOnly(item.rs) : item.rs === 0 && item.amount > 0 ? '0' : ''}
                  </div>
                  <div className="px-0.5 text-right font-mono font-bold">
                    {item.amount > 0 ? (item.ps < 10 ? `0${item.ps}` : item.ps) : ''}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Spacer Rows with continuous vertical grid lines */}
            {emptyRows.map((_, i) => (
              <div
                key={`empty-${i}`}
                className="grid grid-cols-12 border-b border-[#093563]/20 h-6 text-center"
              >
                <div className="col-span-3 border-r-[1.5px] border-[#093563]" />
                <div className="col-span-2 border-r-[1.5px] border-[#093563]" />
                <div className="col-span-3 border-r-[1.5px] border-[#093563] grid grid-cols-2 h-full">
                  <div className="border-r-[1.5px] border-[#093563]" />
                  <div />
                </div>
                <div className="col-span-2 border-r-[1.5px] border-[#093563]" />
                <div className="col-span-2 grid grid-cols-2 h-full">
                  <div className="border-r-[1.5px] border-[#093563]" />
                  <div />
                </div>
              </div>
            ))}

            {/* TOTAL Row */}
            <div className="grid grid-cols-12 border-t-[2px] border-[#093563] font-black text-center bg-blue-50/20">
              <div className="col-span-8 border-r-[1.5px] border-[#093563] py-1.5 text-right pr-4 tracking-widest uppercase text-xs md:text-sm font-black">
                TOTAL
              </div>
              <div className="col-span-4 grid grid-cols-2 h-full items-center">
                <div className="border-r-[1.5px] border-[#093563] py-1.5 px-1 text-right font-mono text-xs md:text-sm font-black">
                  {formatIndianRupeesOnly(bill.totalRs)}
                </div>
                <div className="py-1.5 px-1 text-right font-mono text-xs md:text-sm font-black">
                  {bill.totalPs < 10 ? `0${bill.totalPs}` : bill.totalPs}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-3 text-xs md:text-sm font-semibold space-y-2">
            <div>
              <div className="flex items-baseline">
                <span className="whitespace-nowrap font-bold text-[#093563]">Rupees in words :</span>
                <span className="border-b border-dotted border-[#093563] flex-1 font-bold text-[#093563] ml-1 px-1 text-xs md:text-sm truncate">
                  {wordsText}
                </span>
              </div>
              <div className="flex items-baseline mt-1.5">
                <span className="border-b border-dotted border-[#093563] flex-1"></span>
                <span className="whitespace-nowrap font-bold text-[#093563] ml-1">only)</span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-5 flex justify-end">
              <div className="text-right">
                <p className="font-black text-sm md:text-base text-[#093563] tracking-wide">
                  Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
