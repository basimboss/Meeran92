import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Smartphone, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  X,
  LayoutDashboard,
  Layers,
  Boxes,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function Navbar() {
  const { 
    mobiles = [], 
    setSelectedMobileForDetails, 
    setPersonHistoryData,
    findPersonHistory,
    currentScreen,
    setCurrentScreen,
    counts = { total: 0, stock: 0, service: 0, sold: 0, customers: 0 }
  } = useShop();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const query = searchQuery.trim().toLowerCase();
  const matchingMobiles = query ? mobiles.filter(m => {
    return (
      m.mobileName?.toLowerCase().includes(query) ||
      m.ram?.toLowerCase().includes(query) ||
      m.storage?.toLowerCase().includes(query) ||
      m.im?.toLowerCase().includes(query) ||
      m.imei?.toLowerCase().includes(query) ||
      m.contactName?.toLowerCase().includes(query) ||
      m.contactNumber?.toLowerCase().includes(query) ||
      m.description?.toLowerCase().includes(query) ||
      m.saleDetails?.customerName?.toLowerCase().includes(query) ||
      m.saleDetails?.customerMobile?.toLowerCase().includes(query) ||
      m.saleDetails?.sellPrice?.toLowerCase().includes(query) ||
      m.serviceDetails?.serviceReason?.toLowerCase().includes(query) ||
      m.status?.toLowerCase().includes(query)
    );
  }).slice(0, 6) : [];

  const personMatch = (query.length >= 3 && typeof findPersonHistory === 'function') ? findPersonHistory(query) : null;

  const handleSelectMobile = (mob) => {
    setSelectedMobileForDetails(mob);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleSelectPerson = (person) => {
    setPersonHistoryData(person);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query) return;

    if (personMatch) {
      handleSelectPerson(personMatch);
      return;
    }

    if (matchingMobiles.length > 0) {
      handleSelectMobile(matchingMobiles[0]);
    }
  };

  // Safe configuration parameters
  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, count: null },
    { id: 'all-mobiles', label: 'All Mobiles', icon: Layers, count: counts?.total ?? 0 },
    { id: 'stock-mobiles', label: 'Stock Mobiles', icon: Boxes, count: counts?.stock ?? 0 },
    { id: 'service-mobiles', label: 'Service Mobiles', icon: Wrench, count: counts?.service ?? 0 },
    { id: 'sold-mobiles', label: 'Sold Mobiles', icon: CheckCircle2, count: counts?.sold ?? 0 },
    { id: 'customers', label: 'Customers', icon: User, count: counts?.customers ?? 0 },
    { id: 'find-mobile', label: 'Find Mobile', icon: Search, count: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      
      {/* Top Main Row */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="flex items-center justify-between h-18 py-3 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentScreen && setCurrentScreen('dashboard')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold ring-2 ring-indigo-500/30 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-mono">92</span>
                <span className="text-2xl font-black tracking-tight text-indigo-400">Refonic</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full ml-1">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Mobile Shop Management</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search anything…"
                  className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown Result Panel */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                {personMatch && (
                  <div className="p-3 bg-indigo-950/40 hover:bg-indigo-900/50 cursor-pointer transition-colors" onClick={() => handleSelectPerson(personMatch)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-100 text-xs">{personMatch.name}</span>
                          <p className="text-[11px] text-slate-400">{personMatch.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {matchingMobiles.length > 0 ? (
                  <div>
                    {matchingMobiles.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMobile(m)}
                        className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                      >
                        <div>
                          <div className="font-semibold text-white">{m.mobileName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">IM: {m.im}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                ) : !personMatch && (
                  <div className="p-4 text-center text-slate-400 text-xs">No records found matching "{searchQuery}".</div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Area - Live Clock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="h-3 w-px bg-slate-700" />
              <div className="flex items-center gap-1 text-indigo-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Sub-Links Tabs Menu Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-slate-950/80 overflow-x-auto">
        <nav className="flex items-center gap-1 py-1.5 min-w-max">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentScreen && setCurrentScreen(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 
                    item.id === 'stock-mobiles' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                    item.id === 'sold-mobiles' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    item.id === 'service-mobiles' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    </header>
  );
}
