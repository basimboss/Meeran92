import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Barcode, 
  CheckCircle2, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  Printer, 
  Check, 
  Smartphone,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { getCurrentDateFormatted } from '../utils/formatters';

export function AddMobileModal() {
  const { isAddMobileOpen, setIsAddMobileOpen, addMobile, setImeiStickerData, openMobileScanner, barcodeScanResult } = useShop();

  // Point 6: Removed Dealer / Exchange toggle, simply show Name of the Person
  const [formData, setFormData] = useState({
    mobileName: '',
    ram: '8GB',
    storage: '128GB',
    inDate: getCurrentDateFormatted(),
    personName: '', // Name of the person
    personNumber: '', // Mobile number
    im: '',
    description: '',
    imei: ''
  });

  const [showMissingImeiModal, setShowMissingImeiModal] = useState(false);
  const [showCancelDraftModal, setShowCancelDraftModal] = useState(false);
  const [savedSuccessMobile, setSavedSuccessMobile] = useState(null);
  const [barcodeInputManual, setBarcodeInputManual] = useState('');

  useEffect(() => {
    if (barcodeScanResult && isAddMobileOpen) {
      setFormData(prev => ({ ...prev, imei: barcodeScanResult }));
      setBarcodeInputManual('');
    }
  }, [barcodeScanResult, isAddMobileOpen]);

  if (!isAddMobileOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttachBarcode = (code) => {
    const finalCode = (code || barcodeInputManual).trim();
    if (!finalCode) {
      openMobileScanner();
      return;
    }
    setFormData(prev => ({ ...prev, imei: finalCode }));
    setBarcodeInputManual('');
  };

  const handleRemoveBarcode = () => {
    setFormData(prev => ({ ...prev, imei: '' }));
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!formData.mobileName.trim()) {
      alert('Please enter Mobile Name');
      return;
    }
    if (!formData.im.trim()) {
      alert('Please enter shop internal IM code');
      return;
    }

    if (!formData.imei.trim()) {
      setShowMissingImeiModal(true);
      return;
    }

    commitSave();
  };

  const commitSave = async () => {
    const saved = await addMobile({
      ...formData,
      contactName: formData.personName,
      contactNumber: formData.personNumber
    });
    setShowMissingImeiModal(false);
    setSavedSuccessMobile(saved);
  };

  const handleCancelClick = () => {
    const hasData = formData.mobileName || formData.personName || formData.imei;
    if (hasData) {
      setShowCancelDraftModal(true);
    } else {
      closeAll();
    }
  };

  const handleDeleteDraft = () => {
    setShowCancelDraftModal(false);
    closeAll();
  };

  const handleKeepDraft = () => {
    setShowCancelDraftModal(false);
  };

  const closeAll = () => {
    setIsAddMobileOpen(false);
    setSavedSuccessMobile(null);
    setShowMissingImeiModal(false);
    setShowCancelDraftModal(false);
    setFormData({
      mobileName: '',
      ram: '8GB',
      storage: '128GB',
      inDate: getCurrentDateFormatted(),
      personName: '',
      personNumber: '',
      im: '',
      description: '',
      imei: ''
    });
  };

  const handlePrintSticker = () => {
    if (!savedSuccessMobile) return;
    setImeiStickerData(savedSuccessMobile);
    closeAll();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">
        
        {/* Header (Point 8: Smartphone icon) */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add New Mobile</h2>
              <p className="text-xs text-slate-400">Register new mobile stock into shop management portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancelClick}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSaveClick} className="p-6 overflow-y-auto space-y-5">
          
          {/* 1. Mobile Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Mobile Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="mobileName"
              value={formData.mobileName}
              onChange={handleChange}
              placeholder="e.g. Samsung Galaxy S25 Ultra / iPhone 16 Pro"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>

          {/* 2 & 3. RAM & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                2. RAM <span className="text-red-400">*</span>
              </label>
              <input
                list="mobile-ram-options"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <datalist id="mobile-ram-options"><option value="4GB" /><option value="6GB" /><option value="8GB" /><option value="12GB" /><option value="16GB" /><option value="24GB" /></datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                3. Storage <span className="text-red-400">*</span>
              </label>
              <input
                list="mobile-storage-options"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <datalist id="mobile-storage-options"><option value="64GB" /><option value="128GB" /><option value="256GB" /><option value="512GB" /><option value="1TB" /></datalist>
            </div>
          </div>

          {/* 4. In Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>4. In Date (Current Date Default) <span className="text-red-400">*</span></span>
              <span className="text-[11px] text-indigo-400 font-mono">Calendar & Manual</span>
            </label>
            <input
              type="date"
              name="inDate"
              value={formData.inDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              required
            />
          </div>

          {/* Point 6: Removed Dealer & Exchange 2 options, Simply show "Name of the Person" and "Mobile Number" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                5. Name of the Person
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="personName"
                  value={formData.personName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Kumar / Apex Mobile"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                6. Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="personNumber"
                  value={formData.personNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 7. IM (Shop Internal Code - NOT IMEI) */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                7. Shop Internal IM Code <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">Shop's Own Code (Distinct from IMEI)</span>
            </div>
            <input
              type="text"
              name="im"
              value={formData.im}
              onChange={handleChange}
              placeholder="e.g. IM-1001"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-indigo-500/50 rounded-xl text-sm text-indigo-200 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* 8. Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              8. Description / Device Condition
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Physical condition, box & accessories, scratch details, etc."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* 9. IMEI Barcode (Optional) */}
          <div className="p-4 bg-slate-950/80 border border-slate-700/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-indigo-400" />
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  9. IMEI Barcode (Optional)
                </label>
              </div>
              <span className="text-[11px] text-slate-400">Device Hardware IMEI</span>
            </div>

            {formData.imei ? (
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide font-mono block">
                      IMEI Barcode Attached
                    </span>
                    <span className="text-sm font-mono font-bold text-white tracking-wider">
                      {formData.imei}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openMobileScanner}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Rescan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveBarcode}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Barcode</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcodeInputManual}
                    onChange={(e) => setBarcodeInputManual(e.target.value)}
                    placeholder="Scan device barcode or enter 15-digit IMEI..."
                    className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAttachBarcode(barcodeInputManual)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Barcode className="w-4 h-4" />
                    <span>Attach IMEI</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>* Optional: Can be saved without attaching IMEI</span>
                  <button
                    type="button"
                    onClick={openMobileScanner}
                    className="text-indigo-400 hover:text-indigo-300 underline font-mono"
                  >
                    Open Barcode Scanner
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Mobile</span>
            </button>
          </div>

        </form>

        {/* Missing IMEI Confirmation */}
        {showMissingImeiModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">IMEI Barcode Not Attached</h3>
              <p className="text-sm text-slate-300 mt-2">
                Do you want to continue?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMissingImeiModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={commitSave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Draft Confirmation */}
        {showCancelDraftModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-3">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Cancel Mobile Draft</h3>
              <p className="text-sm text-slate-300 mt-2">
                Do you want to delete this draft or keep it?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeleteDraft}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Delete Draft
                </button>
                <button
                  type="button"
                  onClick={handleKeepDraft}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                >
                  Keep Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Success */}
        {savedSuccessMobile && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Mobile Saved Successfully</h3>
              <p className="text-sm text-slate-300 mt-2">
                <strong>{savedSuccessMobile.mobileName}</strong> [{savedSuccessMobile.im}] has been added to shop stock.
              </p>

              <div className="mt-6 flex justify-center gap-3">
                {savedSuccessMobile.imei && (
                  <button
                    type="button"
                    onClick={handlePrintSticker}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Sticker</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeAll}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
