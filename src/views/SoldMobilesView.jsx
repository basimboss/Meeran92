import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle2, 
  Search, 
  Eye, 
  Trash2, 
  Smartphone,
  ArrowRightLeft,
  FileText,
  Barcode
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function SoldMobilesView() {
  const { 
    mobiles, 
    setIsAddMobileOpen,
    setIsBarcodeScannerOpen,
    setSelectedMobileForDetails, 
    setSelectedMobileForDelete,
    setBillPreviewData 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');

  const soldMobiles = mobiles.filter(m => m.status === 'Sold');
  const filtered = soldMobiles.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.mobileName?.toLowerCase().includes(q) ||
      m.im?.toLowerCase().includes(q) ||
      m.imei?.toLowerCase().includes(q) ||
      m.saleDetails?.customerName?.toLowerCase().includes(q) ||
      m.saleDetails?.customerMobile?.includes(q) ||
      m.saleDetails?.sellPrice?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header with Point 1: Left Side Corner Scan Barcode & Add Mobile Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg">
        
        {/* Left Side Corner Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsBarcodeScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <Barcode className="w-4 h-4 text-indigo-400" />
            <span>Scan Barcode</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>+ Add Mobile</span>
          </button>
        </div>

        {/* Title Info */}
        <div className="sm:text-right">
          <div className="flex items-center sm:justify-end gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sold Mobiles
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical catalog of customer sales & bills ({soldMobiles.length} sold)
          </p>
        </div>

      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sold records by customer, phone, mobile name, IM, price..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Sold Mobiles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4">Mobile Name</th>
                <th className="py-3.5 px-3">Shop IM</th>
                <th className="py-3.5 px-3">IMEI</th>
                <th className="py-3.5 px-3">Customer Name</th>
                <th className="py-3.5 px-3">Customer Mobile</th>
                <th className="py-3.5 px-3">Sale Date & Time</th>
                <th className="py-3.5 px-3">Sell Price</th>
                <th className="py-3.5 px-3">Sale Type</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filtered.length > 0 ? (
                filtered.map((mob) => {
                  const sale = mob.saleDetails || {};
                  return (
                    <tr 
                      key={mob.id} 
                      onClick={() => setSelectedMobileForDetails(mob)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-sans font-semibold text-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500 transition-colors">
                            <Smartphone className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="truncate max-w-[170px] group-hover:text-emerald-300 transition-colors">{mob.mobileName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">({mob.ram}/{mob.storage})</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                          {mob.im}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {mob.imei ? (
                          <span className="text-blue-400 font-bold tracking-wider">
                            {mob.imei}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">
                            None
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-sans font-medium text-slate-200">
                        {sale.customerName || mob.contactName || mob.personName || '-'}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        +91 {sale.customerMobile || mob.contactNumber || mob.personNumber || '-'}
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-mono">
                        <div>{formatReadableDate(sale.saleDate || mob.inDate)}</div>
                        <div className="text-[11px] text-slate-400">{sale.saleTime || '-'}</div>
                      </td>

                      <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                        {sale.sellPrice || '₹0'}
                      </td>

                      <td className="py-3 px-3 font-sans">
                        {sale.saleType === 'Exchange' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Exchange</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Sell Directly
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full font-bold border text-[10px] bg-emerald-950 text-emerald-300 border-emerald-800">
                          Sold
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedMobileForDetails(mob)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Mobile Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setBillPreviewData({ mobile: mob, sale })}
                            className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-colors"
                            title="Print / View Invoice Bill"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedMobileForDelete(mob)}
                            className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/60 transition-colors"
                            title="Delete Mobile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400 text-sm">
                    No sold mobiles recorded matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
