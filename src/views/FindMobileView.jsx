import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Search, 
  Smartphone, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Barcode
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function FindMobileView() {
  const { 
    mobiles, 
    setIsAddMobileOpen,
    setIsBarcodeScannerOpen,
    setSelectedMobileForDetails, 
    setSelectedMobileForEdit, 
    setSelectedMobileForSell, 
    setSelectedMobileForDelete 
  } = useShop();

  const [form, setForm] = useState({
    mobileName: '',
    ram: '',
    storage: '',
    inDate: '',
    outDate: ''
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);

    const match = mobiles.filter(m => {
      const nameMatch = !form.mobileName.trim() || 
        m.mobileName?.toLowerCase().includes(form.mobileName.trim().toLowerCase());

      const ramMatch = !form.ram || m.ram === form.ram;
      const storageMatch = !form.storage || m.storage === form.storage;

      const inDateMatch = !form.inDate || m.inDate === form.inDate;

      const outDateMatch = !form.outDate || (
        (m.saleDetails?.saleDate === form.outDate) ||
        (m.returnDetails?.outDate === form.outDate)
      );

      return nameMatch && ramMatch && storageMatch && inDateMatch && outDateMatch;
    });

    setResults(match);
  };

  const handleReset = () => {
    setForm({
      mobileName: '',
      ram: '',
      storage: '',
      inDate: '',
      outDate: ''
    });
    setHasSearched(false);
    setResults([]);
  };

  const getBadge = (status) => {
    switch (status) {
      case 'Stock':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'Service':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Sold':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

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
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Search className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Find Mobile
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Advanced multi-parameter lookup by specifications and dates
          </p>
        </div>

      </div>

      {/* Dedicated Search Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Mobile Name */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mobile Name
              </label>
              <input
                type="text"
                name="mobileName"
                value={form.mobileName}
                onChange={handleChange}
                placeholder="e.g. Galaxy S25 / iPhone 15"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* RAM */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                RAM
              </label>
              <select
                name="ram"
                value={form.ram}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              >
                <option value="">Any RAM</option>
                <option value="4GB">4GB</option>
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
                <option value="12GB">12GB</option>
                <option value="16GB">16GB</option>
                <option value="24GB">24GB</option>
              </select>
            </div>

            {/* Storage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Storage
              </label>
              <select
                name="storage"
                value={form.storage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              >
                <option value="">Any Storage</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            {/* In Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                In Date
              </label>
              <input
                type="date"
                name="inDate"
                value={form.inDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Out Date */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Out Date (Sale / Return)
              </label>
              <input
                type="date"
                name="outDate"
                value={form.outDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Find Mobile</span>
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH RESULTS TABLE */}
      {hasSearched && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Matching Records ({results.length} Found)
            </h3>
            <span className="text-xs text-slate-400">Click any row to open details</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                <tr>
                  <th className="py-3.5 px-4">Mobile Name</th>
                  <th className="py-3.5 px-3">RAM / Storage</th>
                  <th className="py-3.5 px-3">Shop IM</th>
                  <th className="py-3.5 px-3">IMEI Barcode</th>
                  <th className="py-3.5 px-3">In Date</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Contact Details</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {results.length > 0 ? (
                  results.map((mob) => (
                    <tr 
                      key={mob.id} 
                      onClick={() => setSelectedMobileForDetails(mob)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-sans font-semibold text-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500 transition-colors">
                            <Smartphone className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-[190px] group-hover:text-indigo-300 transition-colors">{mob.mobileName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {mob.ram} / {mob.storage}
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

                      <td className="py-3 px-3 text-slate-300">
                        {formatReadableDate(mob.inDate)}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getBadge(mob.status)}`}>
                          {mob.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-sans">
                        <div className="font-medium text-slate-200">
                          {mob.saleDetails?.customerName || mob.contactName || mob.personName || '-'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {mob.saleDetails?.customerMobile || mob.contactNumber || mob.personNumber || '-'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
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
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {mob.status === 'Stock' && (
                            <button
                              type="button"
                              onClick={() => setSelectedMobileForSell(mob)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm"
                              title="Sell"
                            >
                              Sell
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedMobileForDelete(mob)}
                            className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/60 transition-colors"
                            title="Delete"
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
                      No mobiles found matching the specified parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
