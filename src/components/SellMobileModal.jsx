import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Calendar, 
  Clock, 
  Smartphone, 
  ArrowRightLeft, 
  User, 
  Phone, 
  Barcode,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Check
} from 'lucide-react';
import { getCurrentDateFormatted, getCurrentTimeFormatted, formatReadableDate } from '../utils/formatters';
import { parseSellPrice } from '../utils/priceParser';

export function SellMobileModal() {
  const { 
    selectedMobileForSell, 
    setSelectedMobileForSell, 
    sellMobile, 
    setBillPreviewData,
    mobiles,
    openMobileScanner,
    barcodeScanResult
  } = useShop();

  // Section B - Sale Form
  const [saleForm, setSaleForm] = useState({
    customerName: '',
    customerMobile: '',
    saleDate: getCurrentDateFormatted(),
    saleTime: getCurrentTimeFormatted(),
    sellPrice: '',
    description: '',
    saleType: 'Sell Directly',
  });

  // Exchange intake form matching Add Mobile format
  const [exchangeForm, setExchangeForm] = useState({
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

  const [barcodeInputManual, setBarcodeInputManual] = useState('');
  const [selectedExchangeMobile, setSelectedExchangeMobile] = useState(null);

  useEffect(() => {
    if (!barcodeScanResult || !selectedMobileForSell) return;
    const normalized = barcodeScanResult.trim().toLowerCase();
    const found = mobiles.find(item => item.id === barcodeScanResult || item.imei?.toLowerCase() === normalized || item.im?.toLowerCase() === normalized);
    if (found && found.id !== selectedMobileForSell.id) {
      setSelectedExchangeMobile(found);
      setExchangeForm(prev => ({
        ...prev,
        mobileName: found.mobileName || '',
        ram: found.ram || prev.ram,
        storage: found.storage || prev.storage,
        im: found.im || prev.im,
        imei: found.imei || barcodeScanResult,
        description: found.description || prev.description
      }));
      setBarcodeInputManual(found.imei || found.im || barcodeScanResult);
    }
  }, [barcodeScanResult, mobiles, selectedMobileForSell]);

  if (!selectedMobileForSell) return null;

  const mob = selectedMobileForSell;

  const handleClose = () => {
    setSelectedMobileForSell(null);
    setSaleForm({
      customerName: '',
      customerMobile: '',
      saleDate: getCurrentDateFormatted(),
      saleTime: getCurrentTimeFormatted(),
      sellPrice: '',
      description: '',
      saleType: 'Sell Directly',
    });
    setExchangeForm({
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
    setBarcodeInputManual('');
    setSelectedExchangeMobile(null);
  };

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'customerName' && !exchangeForm.personName) {
        setExchangeForm(ex => ({ ...ex, personName: value }));
      }
      if (name === 'customerMobile' && !exchangeForm.personNumber) {
        setExchangeForm(ex => ({ ...ex, personNumber: value }));
      }
      return updated;
    });
  };

  const handleExchangeChange = (e) => {
    const { name, value } = e.target;
    setExchangeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAttachExchangeBarcode = (code) => {
    const finalCode = (code || barcodeInputManual).trim();
    if (!finalCode) {
      openMobileScanner();
      return;
    }
    const found = mobiles.find(item => item.id === finalCode || item.imei?.toLowerCase() === finalCode.toLowerCase() || item.im?.toLowerCase() === finalCode.toLowerCase());
    if (found && found.id !== mob.id) {
      setSelectedExchangeMobile(found);
      setExchangeForm(prev => ({ ...prev, mobileName: found.mobileName || '', ram: found.ram || prev.ram, storage: found.storage || prev.storage, im: found.im || prev.im, imei: found.imei || finalCode, description: found.description || prev.description }));
    } else if (!found) {
      setExchangeForm(prev => ({ ...prev, imei: finalCode }));
    }
    setBarcodeInputManual('');
  };

  const handleRemoveExchangeBarcode = () => {
    setExchangeForm(prev => ({ ...prev, imei: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!saleForm.customerName.trim()) {
      alert('Please enter Customer Name');
      return;
    }
    if (!saleForm.customerMobile.trim()) {
      alert('Please enter Customer Mobile Number');
      return;
    }
    if (!saleForm.sellPrice.trim()) {
      alert('Please enter Sell Price (e.g. 45000, ₹45,000, 45k)');
      return;
    }

    if (saleForm.saleType === 'Exchange') {
      if (!exchangeForm.mobileName.trim()) {
        alert('Please enter Exchange Mobile Name');
        return;
      }
      if (!exchangeForm.im.trim()) {
        alert('Please enter Exchange Shop IM Code');
        return;
      }
    }

    // Process sale with complete exchange mobile info
    const fullExchangeMobile = saleForm.saleType === 'Exchange' ? {
      ...exchangeForm,
      personName: exchangeForm.personName || saleForm.customerName,
      personNumber: exchangeForm.personNumber || saleForm.customerMobile,
    } : null;

    const fullSalePayload = {
      ...saleForm,
      exchangeMobile: fullExchangeMobile,
      exchangeMobileId: selectedExchangeMobile?.id || null,
      exchangeMobileName: exchangeForm.mobileName,
      exchangeMobileIm: exchangeForm.im
    };

    const updatedMob = await sellMobile(mob.id, fullSalePayload);

    // Point 5: Pass exchange mobile with IMEI so sticker printer option can be shown
    setBillPreviewData({
      mobile: updatedMob || mob,
      sale: fullSalePayload,
      exchangeMobileWithImei: (fullExchangeMobile && fullExchangeMobile.imei) ? fullExchangeMobile : null
    });

    handleClose();
  };

  const parsedAmountPreview = parseSellPrice(saleForm.sellPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sell Mobile</h2>
              <p className="text-xs text-slate-400">Complete sale checkout and generate customer bill</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* SECTION A — PREVIOUS MOBILE INFORMATION (READ-ONLY) */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Section A — Previously Saved Mobile Information
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
                Read-Only Specifications
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Mobile Name</span>
                <strong className="text-white font-sans text-sm">{mob.mobileName}</strong>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">RAM / Storage</span>
                <span className="text-slate-200">{mob.ram} / {mob.storage}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Shop IM Code</span>
                <span className="text-indigo-400 font-bold">{mob.im}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">IMEI Barcode</span>
                <span className={mob.imei ? 'text-blue-400 font-bold' : 'text-slate-500 italic'}>
                  {mob.imei || 'Not Attached'}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">In Date</span>
                <span className="text-slate-300">{formatReadableDate(mob.inDate)}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Seller Name</span>
                <span className="text-slate-200">{mob.contactName || mob.personName || '-'}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Seller Phone</span>
                <span className="text-slate-200">{mob.contactNumber || mob.personNumber || '-'}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Current Status</span>
                <span className="text-blue-400 font-bold">{mob.status}</span>
              </div>
            </div>

            {mob.description && (
              <div className="mt-2 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 uppercase text-[10px] font-semibold">Description: </span>
                {mob.description}
              </div>
            )}
          </div>

          {/* SECTION B — SALE DETAILS FORM */}
          <form id="sell-mobile-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Section B — New Sale Details
              </span>
            </div>

            {/* 1 & 2. Customer Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  1. Customer Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="customerName"
                    value={saleForm.customerName}
                    onChange={handleSaleChange}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Customer Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="customerMobile"
                    value={saleForm.customerMobile}
                    onChange={handleSaleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3 & 4. Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>3. Sale Date <span className="text-red-400">*</span></span>
                  <span className="text-[11px] text-slate-400 font-mono">Current Date Default</span>
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={saleForm.saleDate}
                  onChange={handleSaleChange}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>4. Sale Time <span className="text-red-400">*</span></span>
                  <span className="text-[11px] text-slate-400 font-mono">Current Time Default</span>
                </label>
                <input
                  type="text"
                  name="saleTime"
                  value={saleForm.saleTime}
                  onChange={handleSaleChange}
                  placeholder="e.g. 11:45 AM"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* 5. Sell Price */}
            <div className="p-4 bg-slate-950/70 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  5. Sell Price (Flexible Text/Number Format) <span className="text-red-400">*</span>
                </label>
                {parsedAmountPreview > 0 && (
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Calculated: ₹{parsedAmountPreview.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <input
                type="text"
                name="sellPrice"
                value={saleForm.sellPrice}
                onChange={handleSaleChange}
                placeholder="e.g. 45000, ₹45,000, 45,000, 45k"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-base text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                * Note: Enter any price format like <code>45000</code>, <code>₹45,000</code>, or <code>45k</code>. System automatically aggregates it for trading totals.
              </p>
            </div>

            {/* SALE TYPE */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Sale Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSaleForm(prev => ({ ...prev, saleType: 'Sell Directly' }))}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    saleForm.saleType === 'Sell Directly'
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Sell Directly (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSaleForm(prev => ({ ...prev, saleType: 'Exchange' }))}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    saleForm.saleType === 'Exchange'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Exchange</span>
                </button>
              </div>
            </div>

            {/* Point 11 & Point 5: EXCHANGE INTAKE FORM WITH IMEI SCAN, ATTACH & STICKER PREVIEW FLOW */}
            {saleForm.saleType === 'Exchange' && (
              <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/40 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-800/40">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider font-mono">
                      Exchange Intake Mobile Details
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Will Auto-Add to Stock
                  </span>
                </div>

                {/* 1. Mobile Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Exchange Mobile Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobileName"
                    value={exchangeForm.mobileName}
                    onChange={handleExchangeChange}
                    placeholder="e.g. Redmi Note 13 Pro+ / iPhone 12"
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={saleForm.saleType === 'Exchange'}
                  />
                </div>

                {/* 2 & 3. RAM & Storage */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      RAM
                    </label>
                    <input
                      list="exchange-ram-options"
                      name="ram"
                      value={exchangeForm.ram}
                      onChange={handleExchangeChange}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <datalist id="exchange-ram-options"><option value="4GB" /><option value="6GB" /><option value="8GB" /><option value="12GB" /><option value="16GB" /><option value="24GB" /></datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Storage
                    </label>
                    <input
                      list="exchange-storage-options"
                      name="storage"
                      value={exchangeForm.storage}
                      onChange={handleExchangeChange}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <datalist id="exchange-storage-options"><option value="64GB" /><option value="128GB" /><option value="256GB" /><option value="512GB" /><option value="1TB" /></datalist>
                  </div>
                </div>

                {/* 4. In Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>In Date</span>
                    <span className="text-[10px] text-slate-400 font-mono">Current Date Default</span>
                  </label>
                  <input
                    type="date"
                    name="inDate"
                    value={exchangeForm.inDate}
                    onChange={handleExchangeChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 5 & 6. Name of the Person & Mobile Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Name of the Person
                    </label>
                    <input
                      type="text"
                      name="personName"
                      value={exchangeForm.personName || saleForm.customerName}
                      onChange={handleExchangeChange}
                      placeholder="Customer name"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="personNumber"
                      value={exchangeForm.personNumber || saleForm.customerMobile}
                      onChange={handleExchangeChange}
                      placeholder="Customer phone"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 7. Shop Internal IM Code */}
                <div className="p-3 bg-indigo-950/40 border border-indigo-700/50 rounded-xl">
                  <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                    Shop Internal IM Code for Exchange Mobile <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="im"
                    value={exchangeForm.im}
                    onChange={handleExchangeChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-indigo-500/50 rounded-xl text-xs font-mono font-bold text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={saleForm.saleType === 'Exchange'}
                  />
                </div>

                {/* 8. Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Exchange Device Description / Condition
                  </label>
                  <textarea
                    rows={2}
                    name="description"
                    value={exchangeForm.description}
                    onChange={handleExchangeChange}
                    placeholder="Scratches, battery condition, accessories handed over, etc."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Point 5: IMEI Barcode Scan & Attached state for Exchange Mobile */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Barcode className="w-4 h-4 text-indigo-400" />
                      <span>Exchange Device IMEI Barcode Scan</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Optional Hardware Barcode</span>
                  </div>

                  {exchangeForm.imei ? (
                    <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/50 p-3 rounded-xl animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block font-mono">
                            Barcode Attached & Saved
                          </span>
                          <span className="text-xs font-mono font-bold text-white tracking-widest">{exchangeForm.imei}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAttachExchangeBarcode()}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Rescan</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveExchangeBarcode}
                          className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 text-xs border border-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={barcodeInputManual}
                          onChange={(e) => setBarcodeInputManual(e.target.value)}
                          placeholder="Scan exchange device barcode or enter 15-digit IMEI..."
                          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAttachExchangeBarcode(barcodeInputManual)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <Barcode className="w-4 h-4" />
                          <span>Scan / Attach</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>* After attaching, sticker print option will be available on bill preview</span>
                        <button
                          type="button"
                          onClick={openMobileScanner}
                          className="text-indigo-400 hover:text-indigo-300 underline font-mono"
                        >
                          Open Existing Barcode Scanner
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedExchangeMobile && (
                    <div className="mt-2 p-2.5 rounded-xl border border-blue-500/30 bg-blue-950/30 text-xs text-blue-200">
                      Existing mobile selected: <strong>{selectedExchangeMobile.mobileName}</strong> [{selectedExchangeMobile.im}] {selectedExchangeMobile.imei ? `IMEI ${selectedExchangeMobile.imei}` : ''}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Sale Description / Payment Mode
              </label>
              <textarea
                name="description"
                rows={2}
                value={saleForm.description}
                onChange={handleSaleChange}
                placeholder="Payment mode (UPI/Cash), warranty card given, customer notes..."
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </form>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="sell-mobile-form"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Complete Sale & View Bill</span>
          </button>
        </div>

      </div>
    </div>
  );
}
