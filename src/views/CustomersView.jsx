import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Users, 
  Search, 
  Smartphone, 
  Barcode, 
  User, 
  Phone, 
  Calendar, 
  ArrowRight,
  ShoppingBag,
  Clock,
  Filter
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function CustomersView() {
  const { 
    getAllCustomers, 
    openPersonProfile, 
    setIsAddMobileOpen, 
    setIsBarcodeScannerOpen 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const customers = getAllCustomers();

  const filtered = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.mobilesBought?.some(m => m.mobileName?.toLowerCase().includes(q) || m.ram?.toLowerCase().includes(q) || m.storage?.toLowerCase().includes(q)) ||
      c.mobilesSupplied?.some(m => m.mobileName?.toLowerCase().includes(q))
    );

    const matchesRole = roleFilter === 'ALL' || (
      roleFilter === 'DEALER' ? c.role?.toLowerCase().includes('dealer') :
      roleFilter === 'BUYER' ? c.mobilesBought?.length > 0 : true
    );

    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Header with Left Side Corner Action Buttons */}
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
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Customers & Parties Directory
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            All customer profiles, purchase history (Model, RAM, Storage) & supplier records ({customers.length} registered)
          </p>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, phone number, purchased mobile model, RAM, storage..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All Profiles ({customers.length})</option>
            <option value="BUYER">Mobiles Purchased ({customers.filter(c => c.mobilesBought?.length > 0).length})</option>
            <option value="DEALER">Dealers / Suppliers ({customers.filter(c => c.role?.toLowerCase().includes('dealer')).length})</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Registered Customers & Persons ({filtered.length})
            </span>
          </div>
          <span className="text-xs text-slate-400">Click any customer row to view full transaction history</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4">Customer / Person Name</th>
                <th className="py-3.5 px-3">Mobile Number</th>
                <th className="py-3.5 px-3">Mobiles Purchased (Model, RAM, Storage)</th>
                <th className="py-3.5 px-3">Mobiles Supplied / Intake</th>
                <th className="py-3.5 px-3">Role</th>
                <th className="py-3.5 px-3">Last Active</th>
                <th className="py-3.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filtered.length > 0 ? (
                filtered.map((person, idx) => (
                  <tr 
                    key={idx}
                    onClick={() => openPersonProfile(person.phone || person.name)}
                    className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                            {person.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {person.mobilesBought?.length > 0 ? `${person.mobilesBought.length} Purchase(s)` : 'Party'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-3.5 px-3 text-slate-300">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{person.phone ? `+91 ${person.phone}` : 'Not Provided'}</span>
                      </div>
                    </td>

                    {/* Mobiles Purchased: Mobile name, RAM, Storage */}
                    <td className="py-3.5 px-3 font-sans">
                      {person.mobilesBought && person.mobilesBought.length > 0 ? (
                        <div className="space-y-1">
                          {person.mobilesBought.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-950/70 p-1.5 px-2.5 rounded-lg border border-slate-800/80">
                              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-semibold text-white text-xs">{b.mobileName}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {b.ram}/{b.storage}
                              </span>
                              {b.saleDetails?.sellPrice && (
                                <span className="text-[10px] font-mono font-bold text-emerald-400 ml-auto">
                                  {b.saleDetails.sellPrice}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px] font-mono">
                          No purchases yet
                        </span>
                      )}
                    </td>

                    {/* Mobiles Supplied / Intake */}
                    <td className="py-3.5 px-3 font-sans">
                      {person.mobilesSupplied && person.mobilesSupplied.length > 0 ? (
                        <div className="space-y-1">
                          {person.mobilesSupplied.slice(0, 2).map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                              <span className="text-blue-400 font-bold">•</span>
                              <span className="truncate max-w-[140px]">{s.mobileName}</span>
                              <span className="text-[10px] font-mono text-slate-400">({s.ram}/{s.storage})</span>
                            </div>
                          ))}
                          {person.mobilesSupplied.length > 2 && (
                            <span className="text-[10px] text-indigo-400 font-mono">
                              +{person.mobilesSupplied.length - 2} more units
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px] font-mono">
                          None
                        </span>
                      )}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${
                        person.role?.toLowerCase().includes('dealer') 
                          ? 'bg-amber-950 text-amber-300 border-amber-800' 
                          : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                      }`}>
                        {person.role || 'Customer'}
                      </span>
                    </td>

                    {/* Last Active Date */}
                    <td className="py-3.5 px-3 text-slate-300">
                      {formatReadableDate(person.lastActiveDate)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPersonProfile(person.phone || person.name);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 ml-auto shadow-sm active:scale-95 transition-all"
                      >
                        <span>History</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                    No customer records found matching search.
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
