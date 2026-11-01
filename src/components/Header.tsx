import { Settings, Bluetooth, Plus, Moon, Sun, Sparkles, Smartphone } from 'lucide-react';
import { ShopProfile } from '../types/tailor';
import { AppIcon } from './AppIcon';

interface HeaderProps {
  shop: ShopProfile;
  printerConnected: boolean;
  onConnectPrinter: () => void;
  onOpenSettings: () => void;
  onOpenIconModal: () => void;
  onOpenApkGuide: () => void;
  onNewOrder: () => void;
  activeTab: 'new' | 'list';
  setActiveTab: (tab: 'new' | 'list') => void;
  ordersCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  shop,
  printerConnected,
  onConnectPrinter,
  onOpenSettings,
  onOpenIconModal,
  onOpenApkGuide,
  onNewOrder,
  activeTab,
  setActiveTab,
  ordersCount,
  darkMode,
  setDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-950 dark:bg-slate-900 text-white shadow-md border-b border-emerald-900 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Brand / Shop Name with 3D OBS App Icon */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenIconModal}
            className="shrink-0 transition-transform active:scale-95 hover:opacity-90 relative group"
            title="3D ایپ آئیکن دیکھیں اور ڈاؤن لوڈ کریں"
          >
            <AppIcon size={38} />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] text-black font-extrabold shadow-sm">
              ★
            </span>
          </button>
          <div className="min-w-0 cursor-pointer" onClick={onOpenIconModal}>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight truncate leading-tight font-arabic">
                {shop.name}
              </h1>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-700 hidden sm:inline">
                OBS Pro
              </span>
            </div>
            <p className="text-xs text-emerald-300 dark:text-slate-400 truncate hidden sm:block">
              {shop.phone} {shop.address ? `• ${shop.address}` : ''}
            </p>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="flex items-center gap-1 bg-blue-950/60 dark:bg-slate-800/80 p-1 rounded-lg border border-blue-800/60 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveTab('new');
              onNewOrder();
            }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'new'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>نیا ناپ و آرڈر</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <span>محفوظ آرڈرز</span>
            <span className="text-[11px] bg-blue-800 text-blue-100 px-1.5 py-0.2 rounded-full tabular-nums">
              {ordersCount}
            </span>
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Printer status button */}
          <button
            onClick={onConnectPrinter}
            title={printerConnected ? 'پرنٹر کنیکٹڈ ہے' : 'بلوٹوتھ پرنٹر جوڑیں'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              printerConnected
                ? 'bg-emerald-600/90 text-white border-emerald-500'
                : 'bg-blue-800/80 hover:bg-blue-700 text-blue-100 border-blue-700'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {printerConnected ? 'پرنٹر آن' : 'پرنٹر جوڑیں'}
            </span>
          </button>

          {/* 3D App Icon button */}
          <button
            onClick={onOpenIconModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-yellow-300 border border-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="3D موبائل ایپ آئیکن ڈاؤن لوڈ کریں"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">3D آئیکن</span>
          </button>

          {/* Android APK button */}
          <button
            onClick={onOpenApkGuide}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="اینڈرائیڈ APK گائیڈ اور انسٹال طریقہ"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">📱 اے پی کے (APK)</span>
          </button>

          {/* Theme switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-800 transition-colors"
            title={darkMode ? 'لائٹ موڈ' : 'ڈارک موڈ'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="دکان سیٹنگز"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span className="hidden lg:inline">دکان سیٹنگز</span>
          </button>
        </div>
      </div>
    </header>
  );
};
