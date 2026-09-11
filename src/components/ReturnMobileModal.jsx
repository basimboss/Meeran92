import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, RotateCcw, Calendar, Smartphone, FileText } from 'lucide-react';
import { getCurrentDateFormatted, formatReadableDate } from '../utils/formatters';

export function ReturnMobileModal() {
  const { selectedMobileForReturn, setSelectedMobileForReturn, returnMobile } = useShop();

  const [outDate, setOutDate] = useState(getCurrentDateFormatted());
  const [description, setDescription] = useState('');

  if (!selectedMobileForReturn) return null;

  const mob = selectedMobileForReturn;

  const handleClose = () => {
    setSelectedMobileForReturn(null);
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a return reason / description');
      return;
    }

    returnMobile(mob.id, {
      outDate,
      description
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Return Mobile</h2>
              <p className="text-xs text-slate-400">Process device return and record transaction in history</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* TOP: Existing Mobile Information (Preserved) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Existing Device Information
            </div>
            <div className="flex items-center justify-between font-bold text-sm text-white">
              <span>{mob.mobileName}</span>
              <span className="font-mono text-indigo-400">[{mob.im}]</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300 pt-1">
              <div>Specs: <strong>{mob.ram} / {mob.storage}</strong></div>
              <div>In Date: <strong>{formatReadableDate(mob.inDate)}</strong></div>
              <div>IMEI: <strong className="text-emerald-400">{mob.imei || 'None'}</strong></div>
            </div>
          </div>

          {/* 1. Out Date (Current date default, calendar picker, manual entry) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>1. Out Date <span className="text-red-400">*</span></span>
              <span className="text-[11px] text-indigo-400 font-mono">Current Date Default</span>
            </label>
            <input
              type="date"
              value={outDate}
              onChange={(e) => setOutDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* 2. Description / Return Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Description / Return Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify the reason for return (e.g. Customer changed mind, display fault inspection, dealer recall, etc.)"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Confirm Return</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
