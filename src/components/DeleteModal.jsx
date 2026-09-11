import React from 'react';
import { useShop } from '../context/ShopContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function DeleteModal() {
  const { selectedMobileForDelete, setSelectedMobileForDelete, deleteMobile } = useShop();

  if (!selectedMobileForDelete) return null;

  const handleConfirm = () => {
    deleteMobile(selectedMobileForDelete.id);
    setSelectedMobileForDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={() => setSelectedMobileForDelete(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold text-white">Delete Mobile?</h3>
          <p className="text-sm text-slate-300 mt-2">
            Are you sure you want to permanently delete this mobile from the portal records?
          </p>

          <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Model:</span>
              <span className="font-bold text-white">{selectedMobileForDelete.mobileName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Shop IM:</span>
              <span className="text-indigo-400 font-bold">{selectedMobileForDelete.im}</span>
            </div>
            {selectedMobileForDelete.imei && (
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">IMEI:</span>
                <span className="text-emerald-400">{selectedMobileForDelete.imei}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Status:</span>
              <span className="text-slate-200 font-semibold">{selectedMobileForDelete.status}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setSelectedMobileForDelete(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Mobile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
