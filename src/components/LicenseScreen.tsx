import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Store, Phone, MapPin, Sparkles } from 'lucide-react';
import { ShopProfile, DEFAULT_SHOP_PROFILE } from '../types/tailor';
import { AppIcon } from './AppIcon';

interface LicenseScreenProps {
  onActivate: (profile: ShopProfile) => void;
}

export const LicenseScreen: React.FC<LicenseScreenProps> = ({ onActivate }) => {
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !phone.trim()) {
      setError('دکان کا نام اور موبائل نمبر درج کرنا لازمی ہے!');
      return;
    }

    const trimmedKey = licenseKey.trim().toUpperCase();
    if (trimmedKey !== 'OBS-VIP' && trimmedKey !== '1234' && trimmedKey !== 'VIP' && trimmedKey !== 'TAILOR2026') {
      setError('غلط لائسنس کوڈ! ڈیمو کے لیے OBS-VIP یا 1234 درج کریں۔');
      return;
    }

    const profile: ShopProfile = {
      name: shopName.trim(),
      phone: phone.trim(),
      address: address.trim() || 'مین بازار',
      currency: 'روپے',
      karigarNote: 'براہ کرم ترپائی اور استری صفائی سے کریں۔ سلائی معیار اعلیٰ ہو۔',
      licensed: true,
      activationDate: new Date().toISOString(),
      licenseKey: trimmedKey
    };

    onActivate(profile);
  };

  const handleDemoFill = () => {
    setShopName(DEFAULT_SHOP_PROFILE.name);
    setPhone(DEFAULT_SHOP_PROFILE.phone);
    setAddress(DEFAULT_SHOP_PROFILE.address);
    setLicenseKey('OBS-VIP');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Banner with 3D OBS App Icon */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 p-6 text-white text-center border-b border-emerald-800">
          <div className="flex justify-center mb-3">
            <AppIcon size={105} />
          </div>
          <h2 className="text-2xl font-bold font-arabic tracking-tight text-white">
            Tailor Master Pro
          </h2>
          <p className="text-xs font-arabic text-emerald-300 mt-1">
            OBS کھاتہ رجسٹر لائسنس اور دکان رجسٹریشن
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>دکان کا نام (Shop Title):</span>
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="مثال: الخیر ٹیلرز / جمیل درزی ماسٹر"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>دکان دار کا موبائل نمبر (Mobile Number):</span>
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03001234567"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>شہر یا بازار کا نام (Address):</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: مین بازار، نزد جامع مسجد، لاہور"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>سبسکرپشن کی / پن کوڈ (License Key):</span>
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="لائسنس کوڈ درج کریں (مثلاً: OBS-VIP)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono tracking-wider"
              required
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              ڈیمو پن کوڈ: <strong className="text-orange-600 font-mono">OBS-VIP</strong> یا <strong className="text-orange-600 font-mono">1234</strong>
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ایکٹیویٹ کریں اور ایپ کھولیں</span>
            </button>

            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ڈیمو معلومات خودکار بھریں (Auto Fill Demo)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
