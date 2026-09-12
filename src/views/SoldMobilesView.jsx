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
  Barcode,
  RefreshCw
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function SoldMobilesView() {
  const { 
    mobiles, 
    setIsAddMobileOpen,
    setIsBarcodeScannerOpen,
    setSelectedMobileForDetails, 
    setSelectedMobileForDelete,
    setBillPreviewData,
    restockMobile 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [restockTargetMobile, setRestockTargetMobile] = useState(null);
  const [restockDescription, setRestockDescription] = useState('');

  // Fixed matching logic to handle uppercase/lowercase states smoothly
  const soldMobiles = mobiles.filter(m => m.status?.toLowerCase() === 'sold');
  
  const filtered = soldMobiles.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.mobileName?.toLowerCase().includes(q) ||
      m.im?.toLowerCase().includes(q) ||
      m.imei?.toLowerCase().includes(q) ||
      m.saleDetails?.customerName?.toLowerCase().includes(q) ||
      m.saleDetails?.customerMobile?.includes(q) ||
      String(m.saleDetails?.sellPrice || '').toLowerCase().includes(q)
    );
  });

  const handleOpenRestockModal = (e, mob) => {
    e.stopPropagation();
    setRestockTargetMobile(mob);
    setRestockDescription(`Restocked identical unit matching legacy IMEI code.`);
  };

  const handleConfirmRestock = async () => {
    if (!restockTargetMobile) return;
    try {
      await restockMobile(restockTargetMobile.id, { description: restockDescription });
      setRestockTargetMobile(null);
      setRestockDescription('');
      alert("Mobile unit restocked into system index successfully!");
    } catch (error) {
      console.error("Restock failed:", error);
      alert("Failed to restock mobile item.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsBarcodeScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm"
          >
            <Barcode className="w-4 h-4 text-indigo-400" />
            <span>Scan Barcode</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 dynamic-active"
          >
            <Smartphone className="w-4 h-4" />
            <span>+ Add Mobile</span>
          </button>
        </div>
        <div className="sm:text-right">
          <div className="flex items-center sm:justify-end gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Sold Mobiles</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Catalog of customer sales & bills ({soldMobiles.length} sold)
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sold records..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4">Mobile Name</th>
                <th className="py-3.5 px-3">Shop IM</th>
                <th className="py-3.5 px-3">IMEI</th>
                <th className="py-3.5 px-3">Customer Info</th>
                <th className="py-3.5 px-3">Sale Date</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filtered.length > 0 ? (
                filtered.map((mob) => {
                  const sale = mob.saleDetails || {};
                  return (
                    <tr key={mob.id} onClick={() => setSelectedMobileForDetails(mob)} className="hover:bg-slate-800/50 cursor-pointer">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-100">
                        {mob.mobileName} <span className="text-slate-400 text-xs">({mob.ram}/{mob.storage})</span>
                      </td>
                      <td className="py-3 px-3 text-indigo-400 font-bold">{mob.im}</td>
                      <td className="py-3 px-3 text-blue-400 font-bold">{mob.imei || 'None'}</td>
                      <td className="py-3 px-3 font-sans text-slate-200">
                        <div>{sale.customerName || 'Walk-in'}</div>
                        <div className="text-[10px] text-slate-400">{sale.customerMobile || ''}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{formatReadableDate(sale.saleDate || mob.inDate)}</td>
                      <td className="py-3 px-3 font-mono font-black text-emerald-400">₹{sale.sellPrice || '0'}</td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" onClick={(e) => handleOpenRestockModal(e, mob)} className="p-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400" title="Restock">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => setBillPreviewData({ mobile: mob, sale })} className="p-1.5 rounded-lg bg-slate-800 text-slate-300" title="Invoice">
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => setSelectedMobileForDelete(mob)} className="p-1.5 rounded-lg bg-red-950 text-red-300" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500 font-sans">No sold records discovered.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {restockTargetMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-400" /> Restock Unit
            </h3>
            <textarea rows="3" value={restockDescription} onChange={(e) => setRestockDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setRestockTargetMobile(null)} className="text-slate-400 text-xs">Cancel</button>
              <button type="button" onClick={handleConfirmRestock} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">Confirm Restock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
