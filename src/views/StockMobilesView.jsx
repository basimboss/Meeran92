import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Boxes, 
  Search, 
  Eye, 
  Edit, 
  RotateCcw, 
  Trash2, 
  Smartphone,
  Barcode
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function StockMobilesView() {
  const { 
    mobiles, 
    setIsAddMobileOpen, 
    setIsBarcodeScannerOpen,
    setSelectedMobileForDetails, 
    setSelectedMobileForEdit, 
    setSelectedMobileForSell, 
    setSelectedMobileForReturn,
    setSelectedMobileForDelete 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');

  const stockMobiles = mobiles.filter(m => m.status === 'Stock');
  const filtered = stockMobiles.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.mobileName?.toLowerCase().includes(q) ||
      m.im?.toLowerCase().includes(q) ||
      m.imei?.toLowerCase().includes(q) ||
      m.contactName?.toLowerCase().includes(q) ||
      m.contactNumber?.includes(q)
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
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Boxes className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Stock Mobiles
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Available in store ready for sale ({stockMobiles.length} in stock)
          </p>
        </div>

      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock by mobile name, IM code, IMEI, contact..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Mobile Cards / Rows */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4">Mobile Name</th>
                <th className="py-3.5 px-3">Shop IM</th>
                <th className="py-3.5 px-3">In Date</th>
                <th className="py-3.5 px-3">RAM / Storage</th>
                <th className="py-3.5 px-3">IMEI Barcode</th>
                <th className="py-3.5 px-3">Seller / Source</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filtered.length > 0 ? (
                filtered.map((mob) => (
                  <tr 
                    key={mob.id} 
                    onClick={() => setSelectedMobileForDetails(mob)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-sans font-semibold text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:border-blue-500 transition-colors">
                          <Smartphone className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate max-w-[200px] group-hover:text-blue-300 transition-colors">
                          {mob.mobileName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                        {mob.im}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      {formatReadableDate(mob.inDate)}
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      {mob.ram} / {mob.storage}
                    </td>

                    <td className="py-3 px-3">
                      {mob.imei ? (
                        <span className="text-blue-400 font-bold tracking-wider">
                          {mob.imei}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">
                          None Attached
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-300 font-sans">
                      <div className="font-medium text-slate-200">{mob.contactName || mob.personName || '-'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{mob.contactNumber || mob.personNumber || '-'}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold border text-[10px] bg-blue-950 text-blue-300 border-blue-800">
                        Stock
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedMobileForSell(mob)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                          title="Sell this Mobile"
                        >
                          Sell
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedMobileForDetails(mob)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedMobileForEdit(mob)}
                          className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-colors"
                          title="Edit Mobile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedMobileForReturn(mob)}
                          className="p-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/60 transition-colors"
                          title="Return Mobile"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                    No mobiles currently available in stock.
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
