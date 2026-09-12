import React from 'react';
import { useShop } from '../context/ShopContext';
import { Printer, X, ArrowRightLeft } from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function BillPreviewModal() {
  const { billPreviewData, setBillPreviewData } = useShop();

  if (!billPreviewData) return null;

  const { mobile, sale } = billPreviewData;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setBillPreviewData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Top Header (Close button only, top-right Done and Print buttons removed as per Point 13) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Sale / Bill Preview (Pre-Print)
            </h3>
          </div>
          
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE BILL CANVAS */}
        <div className="p-6 overflow-y-auto printable-area bg-white text-slate-900 font-sans">
          
          {/* Bill Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-slate-900">92</span>
              <span className="text-3xl font-black text-indigo-700 tracking-tight">REFONIC</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-1 font-mono">
              Mobile Store & Technical Services
            </p>
            <p className="text-[11px] text-slate-500">
              Tax Invoice / Cash Receipt • Customer Copy
            </p>
          </div>

          {/* Invoice Meta Row */}
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200 text-xs font-mono">
            <div>
              <p className="text-slate-500 uppercase text-[10px]">Invoice Ref</p>
              <p className="font-bold text-slate-900">INV-92R-{Date.now().toString().slice(-6)}</p>
              <p className="text-slate-500 uppercase text-[10px] mt-2">Sale Type</p>
              <p className="font-bold text-indigo-700">{sale?.saleType || 'Sell Directly'}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 uppercase text-[10px]">Sale Date & Time</p>
              <p className="font-bold text-slate-900">{formatReadableDate(sale?.saleDate)}</p>
              <p className="text-slate-700">{sale?.saleTime}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="py-3 border-b border-slate-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Name: </span>
                <strong className="text-slate-900">{sale?.customerName || 'Walk-in Customer'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Phone: </span>
                <strong className="text-slate-900 font-mono">+91 {sale?.customerMobile}</strong>
              </div>
            </div>
          </div>

          {/* Sold Mobile Details */}
          <div className="py-3 border-b border-slate-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
              Sold Mobile Specifications
            </h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>{mobile?.mobileName}</span>
                <span className="font-mono text-slate-700">{mobile?.ram} / {mobile?.storage}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-600">
                <span>Shop Internal Code (IM): <strong>{mobile?.im}</strong></span>
                <span>In Date: {formatReadableDate(mobile?.inDate)}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                IMEI Barcode:{' '}
                {mobile?.imei ? (
                  <strong className="text-emerald-700">{mobile.imei}</strong>
                ) : (
                  <span className="text-slate-500 italic">None Attached</span>
                )}
              </div>
            </div>
          </div>

          {/* Exchange Info (if applicable) */}
          {sale?.saleType === 'Exchange' && (
            <div className="py-3 border-b border-slate-200">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1.5 font-mono">
                Exchange Mobile Intake
              </h4>
              <div className="bg-indigo-50/70 rounded-xl p-3 border border-indigo-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-medium">Model: <strong>{sale?.exchangeMobile?.mobileName || sale?.exchangeMobileName || '-'}</strong></span>
                  <span className="font-mono text-indigo-800">Exchange IM: <strong>{sale?.exchangeMobile?.im || sale?.exchangeMobileIm || '-'}</strong></span>
                </div>
                {sale?.exchangeMobile?.imei && (
                  <div className="text-[11px] font-mono text-emerald-700">
                    IMEI Barcode: <strong>{sale.exchangeMobile.imei}</strong> (Added to stock)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes / Description */}
          {sale?.description && (
            <div className="py-2.5 border-b border-slate-200 text-xs text-slate-600">
              <span className="text-slate-400 font-semibold">Sale Note: </span>
              {sale.description}
            </div>
          )}

          {/* Total Amount Block */}
          <div className="py-4 flex justify-between items-center bg-slate-100 px-4 rounded-xl mt-3">
            <span className="text-sm font-bold uppercase text-slate-700 font-mono">Total Net Amount:</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {sale?.sellPrice || '₹0'}
            </span>
          </div>

          {/* Footer Terms */}
          <div className="pt-4 text-center text-[10px] text-slate-400 space-y-0.5">
            <p>Thank you for choosing 92 Refonic! Genuine Mobiles & Certified Quality.</p>
            <p>Goods once sold are subject to store warranty terms. Keep this receipt for verification.</p>
          </div>

        </div>

        {/* Modal Bottom Actions (Print Bill, Print Sticker if exchange, Done) */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3 print:hidden">
          <p className="text-xs text-slate-400 font-mono">
            * Standard invoice pre-configured for printer.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
