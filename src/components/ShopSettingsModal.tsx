import React, { useState, useRef } from 'react';
import { Store, Phone, MapPin, FileText, Download, Upload, X, Check, RefreshCw, LogOut, Shield } from 'lucide-react';
import { ShopProfile, CustomerOrder } from '../types/tailor';
import { exportOrdersJson } from '../utils/receiptGenerator';

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: ShopProfile;
  orders: CustomerOrder[];
  onSaveShop: (updated: ShopProfile) => void;
  onImportBackup: (backup: { shopProfile: ShopProfile; orders: CustomerOrder[] }) => void;
  onLogout: () => void;
}

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  shop,
  orders,
  onSaveShop,
  onImportBackup,
  onLogout
}) => {
  const [name, setName] = useState(shop.name);
  const [phone, setPhone] = useState(shop.phone);
  const [address, setAddress] = useState(shop.address);
  const [karigarNote, setKarigarNote] = useState(shop.karigarNote);
  const [currency, setCurrency] = useState(shop.currency || 'روپے');
  const [msg, setMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setMsg('دکان کا نام اور فون نمبر لازمی ہے!');
      return;
    }
    const updated: ShopProfile = {
      ...shop,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      karigarNote: karigarNote.trim(),
      currency: currency.trim()
    };
    onSaveShop(updated);
    setMsg('دکان کی معلومات کامیابی سے محفوظ ہو گئیں!');
    setTimeout(() => {
      setMsg(null);
      onClose();
    }, 1200);
  };

  const handleBackupExport = () => {
    exportOrdersJson(orders, shop);
    setMsg('بیک اپ فائل ڈاؤن لوڈ ہو گئی۔');
    setTimeout(() => setMsg(null), 2500);
  };

  const handleBackupImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.orders && Array.isArray(parsed.orders)) {
          onImportBackup(parsed);
          setMsg(`بیک اپ کامیابی سے لوڈ ہو گیا! ${parsed.orders.length} آرڈرز بحال ہو گئے۔`);
          setTimeout(() => {
            setMsg(null);
            onClose();
          }, 1500);
        } else {
          setMsg('غلط بیک اپ فائل! درست فارمیٹ منتخب کریں۔');
        }
      } catch (err) {
        setMsg('فائل پڑھنے میں غلطی ہوئی!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold font-arabic">دکان پروفائل و بیک اپ سیٹنگز</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {msg && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold">
              {msg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>دکان کا نام (Shop Title):</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>موبائل نمبر:</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                کرنسی کی علامت (Currency):
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="روپے / Rs"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>دکان کا پتہ (Address):</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>رسید کے نیچے نوٹ (Receipt Footer Note):</span>
            </label>
            <textarea
              rows={2}
              value={karigarNote}
              onChange={(e) => setKarigarNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
            />
          </div>

          {/* Backup Section */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              ڈیٹا بیک اپ اور بحالی (Backup & Restore)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBackupExport}
                className="flex-1 py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>بیک اپ فائل بنائیں (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>بیک اپ فائل ری سٹور کریں</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleBackupImport}
              />
            </div>
          </div>

          {/* License Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-100 dark:bg-slate-800/40 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>ایکٹیو لائسنس: <strong className="font-mono text-slate-700 dark:text-slate-300">{shop.licenseKey}</strong></span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3 h-3" />
              <span>لائسنس تبدیل کریں</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              منسوخ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>سیٹنگز محفوظ کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
