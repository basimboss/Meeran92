import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Barcode, 
  Search, 
  X, 
  Scan, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone,
  Edit,
  Trash2
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function BarcodeScannerModal() {
  const { 
    isBarcodeScannerOpen, 
    setIsBarcodeScannerOpen, 
    setBarcodeScanResult,
    mobiles,
    setSelectedMobileForEdit,
    setSelectedMobileForSell,
    setSelectedMobileForDelete
  } = useShop();

  const [inputImei, setInputImei] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedMobile, setMatchedMobile] = useState(null);

  if (!isBarcodeScannerOpen) return null;

  const handleClose = () => {
    setIsBarcodeScannerOpen(false);
    setInputImei('');
    setSearched(false);
    setMatchedMobile(null);
  };

  const handleLookup = (code) => {
    const cleanCode = (code || inputImei).trim().toLowerCase();
    if (!cleanCode) return;

    setSearched(true);
    setBarcodeScanResult(cleanCode);
    const found = mobiles.find(m => 
      (m.imei && m.imei.toLowerCase() === cleanCode) ||
      (m.im && m.im.toLowerCase() === cleanCode)
    );

    setMatchedMobile(found || null);
  };

  const handlePresetClick = (val) => {
    setInputImei(val);
    handleLookup(val);
  };

  const sampleCodes = mobiles.filter(m => m.imei).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quick Barcode / IMEI Scanner</h2>
              <p className="text-xs text-slate-400">Scan mobile barcode or enter 15-digit IMEI to search records</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Scanner Simulation Box */}
          <div className="relative bg-slate-950 rounded-2xl border-2 border-dashed border-indigo-500/40 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />
            
            <div className="w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 animate-bounce">
              <Scan className="w-8 h-8" />
            </div>
            
            <p className="text-sm font-semibold text-slate-200">
              Aim Barcode Scanner at Mobile IMEI
            </p>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Connect a physical USB/Bluetooth handheld barcode scanner, or type the code below.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 w-full">
              <p className="text-[11px] font-mono text-slate-400 mb-2">
                Quick Test (Click to simulate scanning stored stock barcode):
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {sampleCodes.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handlePresetClick(s.imei)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-indigo-200 transition-colors"
                  >
                    {s.mobileName.split(' ')[0]}: <span className="text-indigo-400">{s.imei}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Barcode className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={inputImei}
                onChange={(e) => setInputImei(e.target.value)}
                placeholder="Enter or scan IMEI / IM number..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-600/30"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Result Area */}
          {searched && (
            <div className="pt-2">
              {matchedMobile ? (
                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Matching Mobile Found in Records</span>
                    </div>
                    {/* Point 9: Sold Green, Stock Blue */}
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      matchedMobile.status === 'Stock' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                      matchedMobile.status === 'Service' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {matchedMobile.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Mobile Name</span>
                      <strong className="text-white font-sans text-sm">{matchedMobile.mobileName}</strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">RAM / Storage</span>
                      <span className="text-slate-200">{matchedMobile.ram} / {matchedMobile.storage}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Shop IM</span>
                      <span className="text-indigo-400 font-bold">{matchedMobile.im}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">IMEI Attached</span>
                      <span className="text-blue-400 font-bold">{matchedMobile.imei || 'None'}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">In Date</span>
                      <span className="text-slate-300">{formatReadableDate(matchedMobile.inDate)}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Contact Name</span>
                      <span className="text-slate-200">{matchedMobile.contactName || matchedMobile.personName || '-'}</span>
                    </div>
                  </div>

                  {/* Actions (Point 12: Sell without $) */}
                  <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        setSelectedMobileForEdit(matchedMobile);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Point 12: Sell without $ */}
                    {matchedMobile.status === 'Stock' && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          setSelectedMobileForSell(matchedMobile);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                      >
                        Sell
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        setSelectedMobileForDelete(matchedMobile);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/60 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/80 border border-red-500/30 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Mobile Not Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    No mobile in the 92 Refonic records matches: "<span className="text-slate-200 font-mono">{inputImei}</span>".
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
