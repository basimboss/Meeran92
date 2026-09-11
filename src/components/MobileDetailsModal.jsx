import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Smartphone, 
  Barcode, 
  User, 
  Phone, 
  Edit, 
  RotateCcw, 
  Trash2, 
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { formatReadableDate, generateBarcodePattern } from '../utils/formatters';

export function MobileDetailsModal() {
  const { 
    selectedMobileForDetails, 
    setSelectedMobileForDetails,
    setSelectedMobileForEdit,
    setSelectedMobileForSell,
    setSelectedMobileForReturn,
    setSelectedMobileForDelete,
    returnToStock,
    setBillPreviewData
  } = useShop();

  // Point 10: Toggle for "More Details" to reveal who sold/brought the mobile to shop
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  if (!selectedMobileForDetails) return null;

  const mob = selectedMobileForDetails;
  const barcodePattern = mob.imei ? generateBarcodePattern(mob.imei) : [];

  const handleClose = () => {
    setSelectedMobileForDetails(null);
    setShowMoreDetails(false);
  };

  // Point 9: Sold is GREEN, Stock is BLUE
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Stock':
        return 'bg-blue-950 text-blue-300 border-blue-800'; // Point 9: Blue for Stock
      case 'Service':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Sold':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800'; // Point 9: Green for Sold
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{mob.mobileName}</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadge(mob.status)}`}>
                  {mob.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Shop IM: <strong className="text-indigo-400">{mob.im}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Point 10: Right side "More Details" button */}
            <button
              type="button"
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>{showMoreDetails ? 'Less Details' : 'More Details'}</span>
              {showMoreDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Point 10: For Stock mobiles, "Current Status" section removed. Only show for non-stock if relevant */}
          {mob.status !== 'Stock' && (
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Status:</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(mob.status)}`}>
                ● {mob.status}
              </span>
            </div>
          )}

          {/* Point 10: Right side click "More Details" shows who sold the mobile (Name and Mobile Number) */}
          {showMoreDetails && (
            <div className="bg-gradient-to-r from-slate-950 to-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4.5 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider font-mono">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Source / Seller Contact Details (Who Sold This Mobile to Shop)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Name of the Person</span>
                    <strong className="text-white text-sm">{mob.contactName || mob.personName || 'Not Specified'}</strong>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Person Mobile Number</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      {mob.contactNumber || mob.personNumber ? `+91 ${mob.contactNumber || mob.personNumber}` : 'Not Available'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">RAM / Storage</span>
              <span className="text-slate-200 font-bold">{mob.ram} / {mob.storage}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Shop Internal IM</span>
              <span className="text-indigo-400 font-bold">{mob.im}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">In Date</span>
              <span className="text-slate-200">{formatReadableDate(mob.inDate)}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Device Status</span>
              <span className={mob.status === 'Stock' ? 'text-blue-400 font-bold' : mob.status === 'Sold' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {mob.status}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Seller Name</span>
              <span className="text-slate-200">{mob.contactName || mob.personName || '-'}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Seller Phone</span>
              <span className="text-slate-200">{mob.contactNumber || mob.personNumber || '-'}</span>
            </div>
          </div>

          {/* IMEI Barcode Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>IMEI Barcode Record</span>
              <Barcode className="w-4 h-4 text-indigo-400" />
            </div>

            {mob.imei ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400 font-mono font-semibold">Attached Barcode:</span>
                  <span className="text-sm font-mono font-bold text-white tracking-widest bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                    {mob.imei}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg flex flex-col items-center justify-center">
                  <svg className="h-10 w-64 max-w-full" viewBox="0 0 200 35" preserveAspectRatio="none">
                    {barcodePattern.map((width, i) => {
                      const isBlack = i % 2 === 0;
                      const xOffset = barcodePattern.slice(0, i).reduce((sum, w) => sum + w * 2.5, 5);
                      if (!isBlack) return null;
                      return <rect key={i} x={xOffset} y="0" width={width * 2.5} height="35" fill="#000" />;
                    })}
                  </svg>
                  <span className="text-[10px] font-mono font-bold text-slate-800 tracking-widest mt-1">
                    {mob.imei}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/60 border border-dashed border-slate-700 rounded-lg text-center">
                <span className="text-xs text-amber-400 font-medium italic">
                  IMEI Not Attached
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Device was saved without physical barcode attachment.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {mob.description && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Description / Notes</span>
              <p className="text-slate-300">{mob.description}</p>
            </div>
          )}

          {/* Sold Info (if sold) */}
          {mob.status === 'Sold' && mob.saleDetails && (
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Sale Record</span>
                <span className="text-sm font-mono font-black text-emerald-400">{mob.saleDetails.sellPrice}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <div>Customer: <strong className="text-white">{mob.saleDetails.customerName}</strong></div>
                <div>Phone: <strong className="text-white">+91 {mob.saleDetails.customerMobile}</strong></div>
                <div>Date: {formatReadableDate(mob.saleDetails.saleDate)}</div>
                <div>Time: {mob.saleDetails.saleTime}</div>
              </div>
            </div>
          )}

          {/* Service Info (if service) */}
          {mob.status === 'Service' && mob.serviceDetails && (
            <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/50">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Service Record</span>
                <span className="text-xs font-mono text-slate-300">{formatReadableDate(mob.serviceDetails.serviceDate)}</span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-amber-400 font-semibold">Reason: </span>
                {mob.serviceDetails.serviceReason}
              </div>
            </div>
          )}

          {/* Point 10: "Device Interaction Log" removed for stock products! */}

        </div>

        {/* ACTION AREA: Cancel, Edit, Return, Sell (Point 12: No $ icon), Delete */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleClose();
                setSelectedMobileForEdit(mob);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <Edit className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edit</span>
            </button>

            {mob.status === 'Stock' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setSelectedMobileForReturn(mob);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/80 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return</span>
                </button>

                {/* Point 12: Sell button with $ icon removed */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setSelectedMobileForSell(mob);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  Sell
                </button>
              </>
            )}

            {mob.status === 'Service' && (
              <button
                type="button"
                onClick={() => {
                  returnToStock(mob.id);
                  handleClose();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Return to Stock</span>
              </button>
            )}

            {mob.status === 'Sold' && mob.saleDetails && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setBillPreviewData({ mobile: mob, sale: mob.saleDetails });
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Bill</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                handleClose();
                setSelectedMobileForDelete(mob);
              }}
              className="px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
