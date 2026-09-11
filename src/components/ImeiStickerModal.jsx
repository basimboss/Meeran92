import React from 'react';
import { useShop } from '../context/ShopContext';
import { Barcode, Printer, X } from 'lucide-react';
import { generateBarcodePattern } from '../utils/formatters';

export function ImeiStickerModal() {
  const { imeiStickerData, setImeiStickerData } = useShop();

  if (!imeiStickerData) return null;

  const { mobileName, imei, im } = imeiStickerData;
  const barcodePattern = generateBarcodePattern(imei || im || '92REFONIC');

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setImeiStickerData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header (Screen only) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              IMEI Sticker Preview (Pre-Print)
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STICKER CONTAINER */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950/40">
          
          {/* Thermal Sticker Mockup Card */}
          <div className="w-[320px] bg-white text-slate-950 p-4 rounded-xl shadow-2xl border border-slate-300 flex flex-col items-center text-center font-sans printable-area">
            {/* Header */}
            <div className="w-full flex items-center justify-between border-b border-slate-300 pb-1.5 mb-2">
              <span className="font-black text-sm tracking-tight text-slate-900 font-mono">
                92 REFONIC
              </span>
              <span className="text-[10px] font-bold text-slate-600 font-mono">
                IM: {im}
              </span>
            </div>

            {/* Mobile Name */}
            <div className="text-xs font-bold text-slate-900 truncate w-full mb-1">
              {mobileName}
            </div>

            {/* SVG Barcode Graphic */}
            <div className="my-2 w-full flex justify-center py-1 bg-slate-50 border border-slate-200 rounded">
              <svg className="h-12 w-64 max-w-full" viewBox="0 0 200 45" preserveAspectRatio="none">
                {barcodePattern.map((width, i) => {
                  // alternate black and white bars
                  const isBlack = i % 2 === 0;
                  // calculate x position
                  const xOffset = barcodePattern.slice(0, i).reduce((sum, w) => sum + w * 2.5, 5);
                  if (!isBlack) return null;
                  return (
                    <rect
                      key={i}
                      x={xOffset}
                      y="0"
                      width={width * 2.5}
                      height="45"
                      fill="#000"
                    />
                  );
                })}
              </svg>
            </div>

            {/* IMEI Number */}
            <div className="text-xs font-mono font-bold tracking-widest text-slate-900 mt-0.5">
              {imei}
            </div>

            {/* Sub text */}
            <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
              * Genuine Device Tag *
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center font-mono print:hidden">
            Sticker design layout ready for standard 50mm × 25mm barcode printer.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end gap-2.5 print:hidden">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sticker</span>
          </button>
        </div>

      </div>
    </div>
  );
}
