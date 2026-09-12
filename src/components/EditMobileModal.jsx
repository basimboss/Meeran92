import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Edit, 
  Barcode, 
  CheckCircle2, 
  Trash2, 
  RefreshCw, 
  Save,
  Check
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function EditMobileModal() {
  const { selectedMobileForEdit, setSelectedMobileForEdit, updateMobile } = useShop();

  const [formData, setFormData] = useState(null);
  const [barcodeInputManual, setBarcodeInputManual] = useState('');

  useEffect(() => {
    if (selectedMobileForEdit) {
      setFormData({ ...selectedMobileForEdit });
      setBarcodeInputManual('');
    }
  }, [selectedMobileForEdit]);

  if (!selectedMobileForEdit || !formData) return null;

  const handleClose = () => {
    setSelectedMobileForEdit(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttachBarcode = (code) => {
    const finalCode = (code || barcodeInputManual).trim();
    if (!finalCode) return;
    setFormData(prev => ({ ...prev, imei: finalCode }));
    setBarcodeInputManual('');
  };

  const handleRemoveBarcode = () => {
    setFormData(prev => ({ ...prev, imei: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMobile(formData.id, formData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Mobile</h2>
              <p className="text-xs text-slate-400">Update specifications, IM code, or attached IMEI barcode</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Mobile Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mobile Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="mobileName"
              value={formData.mobileName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>

          {/* RAM & Storage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                RAM
              </label>
              <input
                list="edit-mobile-ram-options"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <datalist id="edit-mobile-ram-options"><option value="4GB" /><option value="6GB" /><option value="8GB" /><option value="12GB" /><option value="16GB" /><option value="24GB" /></datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Storage
              </label>
              <input
                list="edit-mobile-storage-options"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <datalist id="edit-mobile-storage-options"><option value="64GB" /><option value="128GB" /><option value="256GB" /><option value="512GB" /><option value="1TB" /></datalist>
            </div>
          </div>

          {/* In Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              In Date
            </label>
            <input
              type="date"
              name="inDate"
              value={formData.inDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Dealer / Exchange */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Source: Dealer / Exchange
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sourceType: 'Dealer' }))}
                className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
                  formData.sourceType === 'Dealer'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Dealer
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sourceType: 'Exchange' }))}
                className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
                  formData.sourceType === 'Exchange'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Exchange
              </button>
            </div>
          </div>

          {/* Name & Mobile Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* IM (Shop Internal Code) */}
          <div className="p-3.5 bg-indigo-950/20 border border-indigo-800/40 rounded-xl">
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
              Shop Internal IM Code
            </label>
            <input
              type="text"
              name="im"
              value={formData.im}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-slate-800 border border-indigo-500/50 rounded-xl text-sm text-indigo-200 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Status Selection (Stock, Service, Sold) */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Status Selection
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Stock', 'Service', 'Sold'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: st }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.status === st
                      ? st === 'Stock' ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' :
                        st === 'Service' ? 'bg-amber-600 border-amber-500 text-white shadow-md' :
                        'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* IMEI Barcode Manage */}
          <div className="p-4 bg-slate-950/80 border border-slate-700/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                IMEI Barcode
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Optional Hardware Barcode</span>
            </div>

            {formData.imei ? (
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-[11px] text-emerald-400 font-semibold block uppercase">Attached IMEI:</span>
                    <span className="text-xs font-mono font-bold text-white">{formData.imei}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAttachBarcode()}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Rescan</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveBarcode}
                    className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 text-xs flex items-center gap-1 border border-red-800"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcodeInputManual}
                  onChange={(e) => setBarcodeInputManual(e.target.value)}
                  placeholder="Scan or enter 15-digit IMEI..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleAttachBarcode(barcodeInputManual)}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Barcode className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
