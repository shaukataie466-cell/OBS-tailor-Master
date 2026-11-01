import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  MessageCircle,
  Edit3,
  Trash2,
  Calendar,
  Phone,
  Clock,
  CheckCircle,
  Scissors,
  Package,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { CustomerOrder, OrderStatus, ShopProfile } from '../types/tailor';
import { formatWhatsAppMessage, openWhatsApp } from '../utils/receiptGenerator';

interface OrdersListProps {
  orders: CustomerOrder[];
  shop: ShopProfile;
  onOpenReceipt: (order: CustomerOrder) => void;
  onEditOrder: (order: CustomerOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  shop,
  onOpenReceipt,
  onEditOrder,
  onDeleteOrder,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      order.name.toLowerCase().includes(term) ||
      order.phone.includes(term) ||
      order.slipNo.toString().includes(term);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'cutting':
        return { label: '✂️ کٹائی باقی', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'stitching':
        return { label: '🧵 سلائی جاری', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'ready':
        return { label: '✨ سوٹ تیار ہے', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'delivered':
        return { label: '📦 ڈیلیور شدہ', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const handleWhatsApp = (order: CustomerOrder) => {
    const message = formatWhatsAppMessage(order, shop);
    openWhatsApp(order.phone, message);
  };

  return (
    <div className="space-y-3 pb-16">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="گاہک کا نام، فون نمبر، یا پرچی نمبر سے تلاش کریں..."
            className="w-full pr-9 pl-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'تمام آرڈرز', count: orders.length },
            { id: 'cutting', label: 'کٹائی', count: orders.filter((o) => o.status === 'cutting').length },
            { id: 'stitching', label: 'سلائی', count: orders.filter((o) => o.status === 'stitching').length },
            { id: 'ready', label: 'تیار', count: orders.filter((o) => o.status === 'ready').length },
            { id: 'delivered', label: 'ڈیلیور', count: orders.filter((o) => o.status === 'delivered').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-80 tabular-nums">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800">
          <Scissors className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-arabic">
            کوئی آرڈر نہیں ملا
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            اوپر "نیا ناپ و آرڈر" پر کلک کر کے نیا گاہک شامل کریں۔
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const m = order.measurements;
            const s = order.styles;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3"
              >
                {/* Top Row: Slip #, Name, Status, Urgent */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Big Slip # Box */}
                    <div className="bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 px-2.5 py-1 rounded-lg text-center shrink-0">
                      <span className="text-[10px] block uppercase font-mono text-blue-600 dark:text-blue-400 leading-tight">Slip</span>
                      <strong className="text-base sm:text-lg font-mono font-extrabold block">
                        #{order.slipNo}
                      </strong>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white truncate font-arabic">
                          {order.name}
                        </h4>
                        {order.urgency === 'urgent' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-red-100 text-red-700 border border-red-300">
                            ارجنٹ
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-sans">
                          ({order.qty} سوٹ)
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap font-sans">
                        {order.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {order.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          واپسی: <strong className="text-slate-800 dark:text-slate-200">{order.deliveryDate}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown / Badge */}
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className={`text-xs px-2 py-1 rounded-lg border font-bold outline-none cursor-pointer ${statusInfo.color}`}
                  >
                    <option value="cutting">✂️ کٹائی باقی</option>
                    <option value="stitching">🧵 سلائی جاری</option>
                    <option value="ready">✨ سوٹ تیار ہے</option>
                    <option value="delivered">📦 ڈیلیور شدہ</option>
                  </select>
                </div>

                {/* Middle: Measurements Strip (Key numbers) */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center font-mono">
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">لمبائی</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.len || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">بازو</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.bazu || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">تیرا</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.teera || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">کالر</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.collar || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">چھاتی</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.chest || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">گھیرا</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.ghera || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">شلوار</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.shalwar || '-'}</strong>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">پائنچہ</span>
                      <strong className="text-blue-900 dark:text-blue-300 font-bold">{m.paincha || '-'}</strong>
                    </div>
                  </div>

                  {/* Styles line */}
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 flex-wrap">
                    <span>کٹائی: <strong>{s.collar}</strong></span>
                    <span>•</span>
                    <span><strong>{s.cuff}</strong></span>
                    <span>•</span>
                    <span><strong>{s.daman}</strong></span>
                    <span>•</span>
                    <span><strong>{s.pocket}</strong></span>
                    {order.clothType && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">{order.clothType}</span>
                      </>
                    )}
                    {order.photoUrl && (
                      <span className="text-purple-600 font-bold flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> فوٹو موجود
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Bill details & Action buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                  {/* Bill Info */}
                  <div className="flex items-center gap-3 text-xs">
                    <span>کُل: <strong>Rs. {order.bill.total}</strong></span>
                    <span className="text-emerald-700 dark:text-emerald-400">
                      ایڈوانس: <strong>Rs. {order.bill.advance}</strong>
                    </span>
                    <span className={`font-bold px-1.5 py-0.5 rounded ${
                      order.bill.remaining === 0
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}>
                      بقایا: Rs. {order.bill.remaining}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      title="کاریگر پرچی و پرنٹ"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>پرچی</span>
                    </button>

                    <button
                      onClick={() => handleWhatsApp(order)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      title="واٹس ایپ پر بھیجیں"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onEditOrder(order)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                      title="ایڈٹ کریں"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`کیا آپ واقعی #${order.slipNo} (${order.name}) کا آرڈر ڈیلیٹ کرنا چاہتے ہیں؟`)) {
                          onDeleteOrder(order.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="ڈیلیٹ کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
