import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  User, 
  Phone, 
  Clock, 
  Calendar, 
  X, 
  CheckCircle, 
  RotateCcw, 
  Wrench, 
  ArrowRightLeft, 
  ShoppingBag,
  Smartphone,
  Tag,
  Boxes,
  Eye,
  DollarSign
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function PersonHistoryModal() {
  const { 
    personHistoryData, 
    setPersonHistoryData, 
    mobiles, 
    setSelectedMobileForDetails 
  } = useShop();

  const [activeTab, setActiveTab] = useState('mobiles'); // 'mobiles' | 'timeline'

  if (!personHistoryData) return null;

  const handleClose = () => {
    setPersonHistoryData(null);
    setActiveTab('mobiles');
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'SOLD':
        return {
          icon: CheckCircle,
          label: 'PURCHASED / SOLD',
          color: 'bg-emerald-950 text-emerald-300 border-emerald-800'
        };
      case 'EXCHANGE':
        return {
          icon: ArrowRightLeft,
          label: 'EXCHANGE',
          color: 'bg-indigo-950 text-indigo-300 border-indigo-800'
        };
      case 'RETURN':
        return {
          icon: RotateCcw,
          label: 'RETURN',
          color: 'bg-purple-950 text-purple-300 border-purple-800'
        };
      case 'SERVICE':
        return {
          icon: Wrench,
          label: 'SERVICE',
          color: 'bg-amber-950 text-amber-300 border-amber-800'
        };
      case 'BOUGHT':
      case 'INBOUND':
        return {
          icon: ShoppingBag,
          label: 'SUPPLIED TO SHOP',
          color: 'bg-blue-950 text-blue-300 border-blue-800'
        };
      default:
        return {
          icon: Tag,
          label: type || 'TRANSACTION',
          color: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  const handleMobileClick = (mobIdOrIm) => {
    const found = mobiles.find(m => m.id === mobIdOrIm || m.im === mobIdOrIm);
    if (found) {
      setSelectedMobileForDetails(found);
    }
  };

  const boughtCount = personHistoryData.mobilesBought?.length || 0;
  const suppliedCount = personHistoryData.mobilesSupplied?.length || 0;
  const eventsCount = personHistoryData.events?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Person Summary */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">{personHistoryData.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                  {personHistoryData.role || 'Customer / Party'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mt-1 font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>{personHistoryData.phone ? `+91 ${personHistoryData.phone}` : 'No phone recorded'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-950/40 border-b border-slate-800 text-center py-2.5 text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-sans">Purchased Mobiles</span>
            <strong className="text-emerald-400 font-bold text-sm">{boughtCount}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-sans">Supplied to Shop</span>
            <strong className="text-blue-400 font-bold text-sm">{suppliedCount}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-sans">Total Interactions</span>
            <strong className="text-purple-400 font-bold text-sm">{eventsCount}</strong>
          </div>
        </div>

        {/* Sub-Navigation Tabs: [Associated Mobiles] [Full Timeline History] */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('mobiles')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'mobiles'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobiles List ({boughtCount + suppliedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Chronological History Timeline ({eventsCount})</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: Associated Mobiles */}
          {activeTab === 'mobiles' && (
            <div className="space-y-4">
              
              {/* Purchases */}
              {boughtCount > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mobiles Purchased by {personHistoryData.name} ({boughtCount})</span>
                  </h4>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                    {personHistoryData.mobilesBought.map((m, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleMobileClick(m.id || m.im)}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{m.mobileName}</span>
                              <span className="text-xs font-mono text-slate-300">({m.ram}/{m.storage})</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                              <span>IM: <strong className="text-indigo-400">{m.im}</strong></span>
                              {m.imei && <span className="text-emerald-400">IMEI: {m.imei}</span>}
                              <span>Date: {formatReadableDate(m.saleDate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-black text-emerald-400">
                            {m.price}
                          </span>
                          <Eye className="w-4 h-4 text-slate-500 hover:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplied / Intake Mobiles */}
              {suppliedCount > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono mb-2 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Mobiles Supplied / Brought to Shop by {personHistoryData.name} ({suppliedCount})</span>
                  </h4>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                    {personHistoryData.mobilesSupplied.map((m, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleMobileClick(m.id || m.im)}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{m.mobileName}</span>
                              <span className="text-xs font-mono text-slate-300">({m.ram}/{m.storage})</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                              <span>IM: <strong className="text-indigo-400">{m.im}</strong></span>
                              {m.imei && <span className="text-blue-400">IMEI: {m.imei}</span>}
                              <span>In Date: {formatReadableDate(m.inDate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            m.status === 'Stock' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                            m.status === 'Sold' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            'bg-amber-950 text-amber-300 border-amber-800'
                          }`}>
                            {m.status}
                          </span>
                          <Eye className="w-4 h-4 text-slate-500 hover:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {boughtCount === 0 && suppliedCount === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No individual mobile transactions linked yet. Check timeline history below.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Complete Chronological History Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {eventsCount > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                  {personHistoryData.events.map((evt, idx) => {
                    const badge = getEventBadge(evt.type);
                    const BadgeIcon = badge.icon;
                    return (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 flex items-center justify-center group-hover:scale-125 transition-transform" />

                        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 hover:border-slate-700 transition-colors shadow-sm">
                          
                          {/* Date & Time Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-800/80">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="font-semibold text-slate-200">{formatReadableDate(evt.date)}</span>
                              <span className="text-slate-500">—</span>
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-purple-300 font-semibold">{evt.time}</span>
                            </div>

                            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${badge.color}`}>
                              <BadgeIcon className="w-3 h-3" />
                              <span>{badge.label}</span>
                            </span>
                          </div>

                          {/* Mobile Info */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-bold text-white">{evt.mobileName}</span>
                              {evt.im && (
                                <button
                                  type="button"
                                  onClick={() => handleMobileClick(evt.im)}
                                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline font-semibold ml-1"
                                  title="Click to view mobile details"
                                >
                                  [{evt.im}]
                                </button>
                              )}
                            </div>

                            {evt.price && evt.price !== '-' && (
                              <div className="text-sm font-mono font-black text-emerald-400">
                                Price: {evt.price}
                              </div>
                            )}
                          </div>

                          {evt.imei && (
                            <div className="mt-1 text-xs font-mono text-slate-400">
                              IMEI: <span className="text-blue-400">{evt.imei}</span>
                            </div>
                          )}

                          {evt.description && (
                            <p className="mt-2 text-xs text-slate-400 leading-relaxed bg-slate-900/80 p-2 rounded-xl border border-slate-800/60">
                              {evt.description}
                            </p>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No chronological timeline events found.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
