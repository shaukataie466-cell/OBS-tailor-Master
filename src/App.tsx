import React, { useState, useEffect } from 'react';
import {
  ShopProfile,
  CustomerOrder,
  OrderStatus,
  DEFAULT_SHOP_PROFILE,
  SAMPLE_ORDERS
} from './types/tailor';
import { Header } from './components/Header';
import { LicenseScreen } from './components/LicenseScreen';
import { OrderForm } from './components/OrderForm';
import { OrdersList } from './components/OrdersList';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ShopSettingsModal } from './components/ShopSettingsModal';
import { AppIconModal } from './components/AppIconModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { printerInstance } from './utils/bluetoothPrinter';
import { Scissors, AlertCircle, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const STORAGE_PROFILE_KEY = 'obs_sub_profile';
const STORAGE_ORDERS_KEY = 'obs_tailors_orders_v12';
const STORAGE_THEME_KEY = 'obs_tailor_darkmode';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_THEME_KEY, darkMode.toString());
  }, [darkMode]);

  // Shop Profile & License state
  const [shop, setShop] = useState<ShopProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage', e);
    }
    return SAMPLE_ORDERS;
  });

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<CustomerOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<CustomerOrder | null>(null);
  const [currentCapturedPhoto, setCurrentCapturedPhoto] = useState<string | null>(null);

  // Bluetooth printer connection state
  const [printerConnected, setPrinterConnected] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Connect Bluetooth Printer
  const handleConnectPrinter = async () => {
    try {
      showToast('بلوٹوتھ پرنٹرز تلاش کیے جا رہے ہیں...', 'info');
      const deviceName = await printerInstance.connect();
      setPrinterConnected(true);
      showToast(`پرنٹر کنیکٹ ہو گیا: ${deviceName}`, 'success');
    } catch (err: any) {
      setPrinterConnected(false);
      showToast(err.message || 'پرنٹر کنیکٹ نہیں ہو سکا۔ آپ براہ راست براؤزر سے پرنٹ کر سکتے ہیں۔', 'error');
    }
  };

  // Shop activation
  const handleActivateShop = (newProfile: ShopProfile) => {
    setShop(newProfile);
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    showToast(`مبارک ہو! ${newProfile.name} کا لائسنس ایکٹیویٹ ہو گیا ہے۔`, 'success');
  };

  // Update shop profile
  const handleSaveShopSettings = (updated: ShopProfile) => {
    setShop(updated);
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
    showToast('دکان کا ریکارڈ اپ ڈیٹ ہو گیا!', 'success');
  };

  // Logout / Switch License
  const handleLogout = () => {
    if (confirm('کیا آپ واقعی لائسنس یا دکان تبدیل کرنا چاہتے ہیں؟')) {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      setShop(null);
      setIsSettingsOpen(false);
    }
  };

  // Import Backup
  const handleImportBackup = (backup: { shopProfile: ShopProfile; orders: CustomerOrder[] }) => {
    if (backup.shopProfile) {
      setShop(backup.shopProfile);
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(backup.shopProfile));
    }
    if (backup.orders && Array.isArray(backup.orders)) {
      setOrders(backup.orders);
    }
    showToast('بیک اپ کامیابی سے لوڈ ہو گیا!', 'success');
  };

  // Save new or edited order
  const handleSaveOrder = (order: CustomerOrder) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === order.id);
      if (exists) {
        return prev.map((o) => (o.id === order.id ? order : o));
      }
      return [order, ...prev];
    });

    setEditingOrder(null);
    setCurrentCapturedPhoto(null);
    setActiveReceiptOrder(order); // Automatically open the Karigar cutting slip receipt!
    showToast(`آرڈر #${order.slipNo} (${order.name}) کامیابی سے محفوظ ہو گیا!`, 'success');
  };

  // Delete Order
  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('آرڈر ڈیلیٹ کر دیا گیا', 'info');
  };

  // Update Order Status
  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast('آرڈر کا اسٹیٹس اپ ڈیٹ ہو گیا', 'success');
  };

  // If shop is not licensed yet, show License Registration
  if (!shop || !shop.licensed) {
    return <LicenseScreen onActivate={handleActivateShop} />;
  }

  // Quick stats
  const totalPendingBalance = orders.reduce((sum, o) => sum + o.bill.remaining, 0);
  const cuttingOrdersCount = orders.filter((o) => o.status === 'cutting').length;
  const readyOrdersCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-bold flex items-center gap-2 max-w-md w-full border animate-in fade-in slide-in-from-top-4 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : notification.type === 'error'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-blue-600 text-white border-blue-500'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">{notification.message}</span>
        </div>
      )}

      {/* Main App Top Bar */}
      <Header
        shop={shop}
        printerConnected={printerConnected}
        onConnectPrinter={handleConnectPrinter}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenIconModal={() => setIsIconModalOpen(true)}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
        onNewOrder={() => {
          setEditingOrder(null);
          setCurrentCapturedPhoto(null);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
        {/* Quick Summary Dashboard Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-arabic">کُل آرڈرز</span>
              <strong className="text-base font-extrabold text-blue-900 dark:text-blue-300 font-mono">
                {orders.length}
              </strong>
            </div>
            <Scissors className="w-5 h-5 text-blue-500 opacity-60" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-arabic">کٹائی باقی</span>
              <strong className="text-base font-extrabold text-amber-600 font-mono">
                {cuttingOrdersCount}
              </strong>
            </div>
            <Clock className="w-5 h-5 text-amber-500 opacity-60" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-arabic">سوٹ تیار</span>
              <strong className="text-base font-extrabold text-purple-600 font-mono">
                {readyOrdersCount}
              </strong>
            </div>
            <CheckCircle className="w-5 h-5 text-purple-500 opacity-60" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-arabic">کُل بقایا رقم</span>
              <strong className="text-base font-extrabold text-red-600 font-mono">
                Rs. {totalPendingBalance.toLocaleString()}
              </strong>
            </div>
            <TrendingUp className="w-5 h-5 text-red-500 opacity-60" />
          </div>
        </div>

        {/* Content View: Order Form or Orders List */}
        {activeTab === 'new' ? (
          <div>
            <OrderForm
              onSaveOrder={handleSaveOrder}
              existingOrders={orders}
              editingOrder={editingOrder}
              onCancelEdit={() => setEditingOrder(null)}
              onOpenCameraModal={() => setIsCameraOpen(true)}
              capturedPhoto={currentCapturedPhoto}
              onClearPhoto={() => setCurrentCapturedPhoto(null)}
            />
          </div>
        ) : (
          <div>
            <OrdersList
              orders={orders}
              shop={shop}
              onOpenReceipt={(order) => setActiveReceiptOrder(order)}
              onEditOrder={(order) => {
                setEditingOrder(order);
                setActiveTab('new');
              }}
              onDeleteOrder={handleDeleteOrder}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Karigar Thermal Print & WhatsApp Slip Receipt Modal */}
      <ThermalReceiptModal
        order={activeReceiptOrder}
        shop={shop}
        isOpen={!!activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        printerConnected={printerConnected}
      />

      {/* 2. Camera Fabric/Pattern Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setCurrentCapturedPhoto(dataUrl);
          showToast('کپڑے کا نمونہ شامل ہو گیا!', 'success');
        }}
      />

      {/* 3. Shop Profile Settings & Data Backup Modal */}
      <ShopSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shop={shop}
        orders={orders}
        onSaveShop={handleSaveShopSettings}
        onImportBackup={handleImportBackup}
        onLogout={handleLogout}
      />

      {/* 4. Official 3D App Icon Preview & Download Modal */}
      <AppIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
      />

      {/* 5. Android APK & GitHub Guide Modal */}
      <ApkGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />
    </div>
  );
}
