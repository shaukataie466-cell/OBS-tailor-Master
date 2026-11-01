import React, { useState } from 'react';
import { Printer, Bluetooth, MessageCircle, X, Check, Scissors, AlertCircle, Share2 } from 'lucide-react';
import { CustomerOrder, ShopProfile } from '../types/tailor';
import { formatWhatsAppMessage, openWhatsApp } from '../utils/receiptGenerator';
import { printerInstance } from '../utils/bluetoothPrinter';

interface ThermalReceiptModalProps {
  order: CustomerOrder | null;
  shop: ShopProfile;
  isOpen: boolean;
  onClose: () => void;
  printerConnected: boolean;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  order,
  shop,
  isOpen,
  onClose,
  printerConnected
}) => {
  const [printingStatus, setPrintingStatus] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleBluetoothPrint = async () => {
    setPrintingStatus('بلوٹوتھ پرنٹر کو کمانڈ بھیجی جا رہی ہے...');
    try {
      if (!printerConnected) {
        await printerInstance.connect();
      }
      await printerInstance.printReceipt(order, shop);
      setPrintingStatus('پرچی کامیابی سے پرنٹ ہو گئی!');
      setTimeout(() => setPrintingStatus(null), 3000);
    } catch (err: any) {
      setPrintingStatus(err.message || 'پرنٹ کرنے میں مسئلہ پیش آیا۔ براہ راست پرنٹ کا بٹن دبائیں۔');
      setTimeout(() => setPrintingStatus(null), 4000);
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = formatWhatsAppMessage(order, shop);
    openWhatsApp(order.phone, encoded);
  };

  const m = order.measurements;
  const s = order.styles;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold font-arabic">کاریگر کٹنگ پرچی و رسید (Slip #{order.slipNo})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Paper Receipt */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 max-h-[68vh] overflow-y-auto">
          {printingStatus && (
            <div className="mb-3 p-2.5 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-600" />
              <span>{printingStatus}</span>
            </div>
          )}

          {/* THE THERMAL RECEIPT SLIP (Optimized for 58mm / 80mm roll print) */}
          <div
            id="printableSlipArea"
            className="bg-white text-slate-900 mx-auto p-4 rounded-lg shadow-sm border border-slate-300 max-w-[340px] font-mono text-[12px] leading-relaxed relative"
          >
            {/* Scissors Cut Header Line */}
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 border-b border-dashed border-slate-400 pb-2 mb-2">
              <Scissors className="w-3.5 h-3.5" />
              <span>---------------- کٹنگ پرچی ----------------</span>
            </div>

            {/* Shop Brand */}
            <div className="text-center mb-2">
              <h2 className="text-base font-extrabold tracking-tight font-arabic text-slate-950">
                {shop.name}
              </h2>
              <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                📞 {shop.phone}
              </p>
              {shop.address && (
                <p className="text-[10px] text-slate-500 font-sans">
                  📍 {shop.address}
                </p>
              )}
            </div>

            <div className="border-b border-dashed border-slate-400 my-2" />

            {/* Slip Meta */}
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span><strong>پرچی نمبر:</strong> #{order.slipNo}</span>
              <span><strong>تاریخ:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="text-[11px] space-y-0.5 mb-2">
              <div><strong>گاہک:</strong> <span className="font-bold text-slate-950">{order.name}</span></div>
              {order.phone && <div><strong>فون:</strong> {order.phone}</div>}
              <div className="flex justify-between font-bold text-orange-900 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                <span>واپسی تاریخ: {order.deliveryDate}</span>
                <span>تعداد: {order.qty} سوٹ</span>
              </div>
              {order.clothType && (
                <div className="text-[11px] text-slate-700">
                  <span>کپڑا: {order.clothType}</span>
                  {order.fabricColor && <span> ({order.fabricColor})</span>}
                </div>
              )}
            </div>

            <div className="border-b border-dashed border-slate-400 my-2" />

            {/* MEASUREMENTS IN KARIGAR ORDER (1-8) */}
            <div className="mb-2">
              <div className="text-center font-bold text-xs bg-slate-100 py-1 mb-1.5 rounded">
                ✂️ کاریگر پیمائش ناپ (انچ میں)
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">1. لمبائی:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.len || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">2. بازو:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.bazu || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">3. تیرا:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.teera || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">4. کالر/بین:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.collar || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">5. چھاتی:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.chest || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">6. گھیرا:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.ghera || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">7. شلوار:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.shalwar || '-'}</strong>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                  <span className="text-slate-600">8. پائنچہ:</span>
                  <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.paincha || '-'}</strong>
                </div>
                {m.waist && (
                  <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                    <span className="text-slate-600">کمر:</span>
                    <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.waist}</strong>
                  </div>
                )}
                {m.asan && (
                  <div className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                    <span className="text-slate-600">آسن:</span>
                    <strong className="text-blue-900 text-[13px] bg-blue-50 px-1 rounded">{m.asan}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2" />

            {/* STYLE DETAILS */}
            <div className="mb-2 text-[11px] space-y-1">
              <div className="font-bold text-center text-slate-800 bg-slate-100 py-0.5 rounded">
                ✂️ کٹائی و سلائی اسٹائل
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div>• کالر: <strong>{s.collar}</strong></div>
                <div>• کف: <strong>{s.cuff}</strong></div>
                <div>• دامن: <strong>{s.daman}</strong></div>
                <div>• جیب: <strong>{s.pocket}</strong></div>
                <div>• کاج: <strong>{s.kaj}</strong></div>
                <div>• بٹن: <strong>{s.button}</strong></div>
              </div>
            </div>

            {order.notes && (
              <div className="mb-2 p-1.5 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded text-[10px]">
                <strong>خصوصی ہدایت:</strong> {order.notes}
              </div>
            )}

            {/* Fabric Photo if captured */}
            {order.photoUrl && (
              <div className="my-2 text-center">
                <img
                  src={order.photoUrl}
                  alt="Fabric sample"
                  className="w-24 h-24 object-cover mx-auto rounded border border-slate-300"
                />
                <span className="text-[9px] text-slate-500">کپڑے کا نمونہ</span>
              </div>
            )}

            <div className="border-b border-dashed border-slate-400 my-2" />

            {/* BILL & ACCOUNTS */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>کُل سلائی بل:</span>
                <strong>Rs. {order.bill.total}</strong>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>وصول ایڈوانس:</span>
                <strong>Rs. {order.bill.advance}</strong>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-red-700 bg-red-50 p-1 rounded border border-red-200">
                <span>بقایا رقم (Remaining):</span>
                <span>Rs. {order.bill.remaining}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2" />

            {/* Footer Notice */}
            <div className="text-center text-[10px] text-slate-500 mt-2 font-sans">
              <p>{shop.karigarNote}</p>
              <p className="mt-1 font-semibold text-slate-700">شکریہ! دوبارہ تشریف لائیں۔</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          {/* Direct Print Button */}
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="flex-1 min-w-[130px] py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>پرنٹ پرچی (Print)</span>
          </button>

          {/* Bluetooth Print Button */}
          <button
            type="button"
            onClick={handleBluetoothPrint}
            className="flex-1 min-w-[130px] py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Bluetooth className="w-4 h-4" />
            <span>بلوٹوتھ پرنٹر</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex-1 min-w-[130px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>واٹس ایپ رسید</span>
          </button>
        </div>
      </div>
    </div>
  );
};
