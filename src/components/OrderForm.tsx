import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Calendar,
  Layers,
  Camera,
  Scissors,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  CustomerOrder,
  OrderMeasurements,
  OrderStyles,
  CollarType,
  CuffType,
  DamanType,
  PocketType,
  KajType,
  ButtonType
} from '../types/tailor';

interface OrderFormProps {
  onSaveOrder: (order: CustomerOrder) => void;
  existingOrders: CustomerOrder[];
  editingOrder: CustomerOrder | null;
  onCancelEdit: () => void;
  onOpenCameraModal: () => void;
  capturedPhoto: string | null;
  onClearPhoto: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSaveOrder,
  existingOrders,
  editingOrder,
  onCancelEdit,
  onOpenCameraModal,
  capturedPhoto,
  onClearPhoto
}) => {
  // Customer Basic Info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [clothType, setClothType] = useState('کاٹن (Cotton)');
  const [fabricColor, setFabricColor] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [karigarName, setKarigarName] = useState('استاد کاریگر');

  // Measurements (Traditional Karigar Order 1-8)
  const [measurements, setMeasurements] = useState<OrderMeasurements>({
    len: '',
    bazu: '',
    teera: '',
    collar: '',
    chest: '',
    ghera: '',
    shalwar: '',
    paincha: '',
    waist: '',
    asan: ''
  });
  const [showExtraMeasurements, setShowExtraMeasurements] = useState(false);

  // Styles
  const [styles, setStyles] = useState<OrderStyles>({
    collar: 'کالر',
    cuff: 'گول کف',
    daman: 'گول دامن',
    pocket: '2 سائیڈ جیب',
    kaj: 'سادہ کاج',
    button: 'ٹچ بٹن'
  });

  const [notes, setNotes] = useState('');
  const [totalBill, setTotalBill] = useState<string>('1500');
  const [advance, setAdvance] = useState<string>('500');

  // Customer match state
  const [matchedCustomer, setMatchedCustomer] = useState<CustomerOrder | null>(null);

  // Set default delivery date (+3 days from now)
  useEffect(() => {
    if (!deliveryDate && !editingOrder) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setDeliveryDate(d.toISOString().split('T')[0]);
    }
  }, []);

  // Sync editing order if provided
  useEffect(() => {
    if (editingOrder) {
      setName(editingOrder.name);
      setPhone(editingOrder.phone);
      setDeliveryDate(editingOrder.deliveryDate);
      setQty(editingOrder.qty);
      setClothType(editingOrder.clothType || 'کاٹن (Cotton)');
      setFabricColor(editingOrder.fabricColor || '');
      setUrgency(editingOrder.urgency || 'normal');
      setKarigarName(editingOrder.karigarName || 'استاد کاریگر');
      setMeasurements(editingOrder.measurements);
      setStyles(editingOrder.styles);
      setNotes(editingOrder.notes || '');
      setTotalBill(editingOrder.bill.total.toString());
      setAdvance(editingOrder.bill.advance.toString());
    }
  }, [editingOrder]);

  // Check for repeat customer
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (val.trim().length >= 4) {
      const found = existingOrders.find(
        (o) => o.phone.includes(val.trim()) && o.id !== editingOrder?.id
      );
      setMatchedCustomer(found || null);
    } else {
      setMatchedCustomer(null);
    }
  };

  const loadPreviousMeasurements = (pastOrder: CustomerOrder) => {
    setMeasurements({ ...pastOrder.measurements });
    setStyles({ ...pastOrder.styles });
    if (!name) setName(pastOrder.name);
    setMatchedCustomer(null);
  };

  const handleMeasurementChange = (field: keyof OrderMeasurements, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const appendFraction = (field: keyof OrderMeasurements, fraction: string) => {
    setMeasurements((prev) => {
      const current = prev[field] || '';
      // If already has fraction, replace or add
      const baseNum = current.split('.')[0] || '0';
      return {
        ...prev,
        [field]: `${baseNum}${fraction}`
      };
    });
  };

  // Remaining balance calculation
  const totalVal = parseFloat(totalBill) || 0;
  const advanceVal = parseFloat(advance) || 0;
  const remainingVal = Math.max(0, totalVal - advanceVal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('براہ کرم گاہک کا نام درج کریں!');
      return;
    }

    const nextSlipNo = editingOrder
      ? editingOrder.slipNo
      : (existingOrders.length > 0 ? Math.max(...existingOrders.map((o) => o.slipNo)) + 1 : 1001);

    const newOrder: CustomerOrder = {
      id: editingOrder ? editingOrder.id : `ord-${Date.now()}`,
      slipNo: nextSlipNo,
      createdAt: editingOrder ? editingOrder.createdAt : new Date().toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      qty: Math.max(1, qty),
      clothType: clothType.trim(),
      fabricColor: fabricColor.trim(),
      urgency,
      karigarName: karigarName.trim(),
      measurements,
      styles,
      notes: notes.trim(),
      photoUrl: capturedPhoto || editingOrder?.photoUrl,
      bill: {
        total: totalVal,
        advance: advanceVal,
        remaining: remainingVal,
        status: remainingVal === 0 ? 'paid' : advanceVal > 0 ? 'partial' : 'unpaid'
      },
      status: editingOrder ? editingOrder.status : 'cutting'
    };

    onSaveOrder(newOrder);

    // If new order, reset fields
    if (!editingOrder) {
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setQty(1);
    setFabricColor('');
    setNotes('');
    setMeasurements({
      len: '',
      bazu: '',
      teera: '',
      collar: '',
      chest: '',
      ghera: '',
      shalwar: '',
      paincha: '',
      waist: '',
      asan: ''
    });
    setTotalBill('1500');
    setAdvance('500');
    setMatchedCustomer(null);
    onClearPhoto();
  };

  const addQuickNote = (phrase: string) => {
    setNotes((prev) => (prev ? `${prev}، ${phrase}` : phrase));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-12">
      {/* Editing Notice Banner */}
      {editingOrder && (
        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-900 dark:text-orange-200">
            <Scissors className="w-4 h-4 text-orange-600" />
            <span>آپ پرچی نمبر #{editingOrder.slipNo} ایڈٹ کر رہے ہیں</span>
          </div>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-600 dark:text-slate-300 hover:text-red-600 font-semibold"
          >
            ایڈٹ منسوخ کریں
          </button>
        </div>
      )}

      {/* Repeat Customer Match Alert */}
      {matchedCustomer && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 p-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="text-xs">
            <span className="font-bold text-blue-900 dark:text-blue-200">
              سابقہ گاہک ملا: {matchedCustomer.name} (#{matchedCustomer.slipNo})
            </span>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">
              سابقہ ناپ: لمبائی {matchedCustomer.measurements.len} • بازو {matchedCustomer.measurements.bazu} • شلوار {matchedCustomer.measurements.shalwar}
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadPreviousMeasurements(matchedCustomer)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>سابقہ ناپ لوڈ کریں</span>
          </button>
        </div>
      )}

      {/* 1. CUSTOMER INFO CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 pb-2 mb-3 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-arabic">
            <User className="w-4 h-4 text-blue-600" />
            <span>گاہک کی معلومات (Customer Details)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUrgency(urgency === 'normal' ? 'urgent' : 'normal')}
              className={`text-xs px-2.5 py-1 rounded-md font-bold transition-colors ${
                urgency === 'urgent'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {urgency === 'urgent' ? '🚨 ارجنٹ آرڈر' : 'عام آرڈر'}
            </button>
          </div>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              گاہک کا نام: *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد احمد / چوہدری بلال"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              موبائل نمبر (واٹس ایپ):
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="03001234567"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              واپسی تاریخ:
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              سوٹ کی تعداد:
            </label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              کپڑے کی قسم:
            </label>
            <select
              value={clothType}
              onChange={(e) => setClothType(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-blue-600"
            >
              <option value="کاٹن (Cotton)">کاٹن (Cotton)</option>
              <option value="واش اینڈ ویئر (Wash & Wear)">واش اینڈ ویئر</option>
              <option value="بوسکی (Boski)">بوسکی (Boski)</option>
              <option value="لٹھا (Latha)">لٹھا (Latha)</option>
              <option value="کرنڈی (Karandi)">کرنڈی (Karandi)</option>
              <option value="کھدر (Khaddar)">کھدر (Khaddar)</option>
              <option value="ریشم (Silk)">سلک / ریشم</option>
              <option value="دیگر">دیگر</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              کپڑے کا رنگ:
            </label>
            <input
              type="text"
              value={fabricColor}
              onChange={(e) => setFabricColor(e.target.value)}
              placeholder="مثلاً: سفید، کالا"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 2. MEASUREMENTS CARD IN KARIGAR ORDER (1-8) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-orange-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-arabic font-bold text-sm text-orange-900 dark:text-orange-300">
            <Scissors className="w-4 h-4 text-orange-600" />
            <span>پیمائش ناپ (کاریگر کی ترتیب میں - انچ)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-sans">
            فوری انچ: 1/4 (.25), 1/2 (.5), 3/4 (.75)
          </span>
        </div>

        {/* 8 Primary Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Length */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. لمبائی (Length):
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('len', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('len', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('len', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.len}
              onChange={(e) => handleMeasurementChange('len', e.target.value)}
              placeholder="40"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 2. Sleeve / Bazu */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. بازو (Sleeve):
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('bazu', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('bazu', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('bazu', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.bazu}
              onChange={(e) => handleMeasurementChange('bazu', e.target.value)}
              placeholder="23"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 3. Shoulder / Teera */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                3. تیرا (Teera):
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('teera', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('teera', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('teera', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.teera}
              onChange={(e) => handleMeasurementChange('teera', e.target.value)}
              placeholder="18"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 4. Collar / Ban */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                4. کالر / بین:
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('collar', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('collar', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('collar', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.collar}
              onChange={(e) => handleMeasurementChange('collar', e.target.value)}
              placeholder="15.5"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 5. Chest / Chhati */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                5. چھاتی (Chest):
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('chest', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('chest', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('chest', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.chest}
              onChange={(e) => handleMeasurementChange('chest', e.target.value)}
              placeholder="22"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 6. Ghera / Width */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                6. چوڑائی / گھیرا:
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('ghera', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('ghera', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('ghera', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.ghera}
              onChange={(e) => handleMeasurementChange('ghera', e.target.value)}
              placeholder="24"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 7. Shalwar */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                7. شلوار (Shalwar):
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('shalwar', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('shalwar', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('shalwar', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.shalwar}
              onChange={(e) => handleMeasurementChange('shalwar', e.target.value)}
              placeholder="38"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>

          {/* 8. Paincha */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                8. پائنچہ (Paincha):
              </label>
              <div className="flex gap-0.5 text-[10px]">
                <button type="button" onClick={() => appendFraction('paincha', '.25')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¼</button>
                <button type="button" onClick={() => appendFraction('paincha', '.5')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">½</button>
                <button type="button" onClick={() => appendFraction('paincha', '.75')} className="px-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">¾</button>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={measurements.paincha}
              onChange={(e) => handleMeasurementChange('paincha', e.target.value)}
              placeholder="8.5"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Optional Extra Measurements Toggle */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowExtraMeasurements(!showExtraMeasurements)}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExtraMeasurements ? 'rotate-180' : ''}`} />
            <span>اضافی ناپ (کمر، آسن)</span>
          </button>

          {showExtraMeasurements && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  کمر (Waist):
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={measurements.waist || ''}
                  onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                  placeholder="21"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  آسن (Asan):
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={measurements.asan || ''}
                  onChange={(e) => handleMeasurementChange('asan', e.target.value)}
                  placeholder="16"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. STYLES & CUTTING CHOICES (VISUAL SVG CARDS) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 pb-2 mb-3 border-b border-blue-100 dark:border-slate-800 flex items-center gap-1.5 font-arabic">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>اضافی چیزیں اور کٹائی کا انتخاب (Design & Styles)</span>
        </h3>

        {/* Collar / Ban */}
        <div className="mb-3.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            کالر / بین کا انتخاب:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                id: 'کالر',
                label: 'کالر',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 36 36">
                    <path d="M7 11 L14 18 L18 13 L22 18 L29 11 L24 23 L12 23 Z" />
                  </svg>
                )
              },
              {
                id: 'فل بین',
                label: 'فل بین',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 36 36">
                    <path d="M8 20 C8 12, 28 12, 28 20" />
                  </svg>
                )
              },
              {
                id: 'کٹ بین',
                label: 'کٹ بین',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 36 36">
                    <path d="M8 20 C8 12, 17 12, 17 21" />
                    <path d="M19 21 C19 12, 28 12, 28 20" />
                  </svg>
                )
              },
              {
                id: 'ہاف بین',
                label: 'ہاف بین',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 36 36">
                    <path d="M10 22 C10 15, 26 15, 26 22" />
                  </svg>
                )
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyles((prev) => ({ ...prev, collar: item.id as CollarType }))}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  styles.collar === item.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span className="text-xs font-bold mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cuffs */}
        <div className="mb-3.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            کف کا انتخاب:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                id: 'گول کف',
                label: 'گول کف',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <rect x="7" y="11" width="22" height="14" rx="7" />
                  </svg>
                )
              },
              {
                id: 'چورس کف',
                label: 'چورس کف',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <rect x="7" y="11" width="22" height="14" rx="1" />
                  </svg>
                )
              },
              {
                id: 'کٹ کف',
                label: 'کٹ کف',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <polygon points="7,15 11,11 25,11 29,15 29,25 7,25" />
                  </svg>
                )
              },
              {
                id: 'سادہ آستین',
                label: 'سادہ آستین',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <line x1="9" y1="10" x2="9" y2="26" />
                    <line x1="27" y1="10" x2="27" y2="26" />
                  </svg>
                )
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyles((prev) => ({ ...prev, cuff: item.id as CuffType }))}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  styles.cuff === item.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span className="text-xs font-bold mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daman */}
        <div className="mb-3.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            دامن کا انتخاب:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'گول دامن',
                label: 'گول دامن',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <path d="M8 8 L8 20 C8 27, 28 27, 28 20 L28 8" />
                  </svg>
                )
              },
              {
                id: 'چورس دامن',
                label: 'چورس دامن',
                icon: (
                  <svg className="w-7 h-7 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <path d="M8 8 L8 25 L28 25 L28 8" />
                  </svg>
                )
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyles((prev) => ({ ...prev, daman: item.id as DamanType }))}
                className={`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all ${
                  styles.daman === item.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pockets */}
        <div className="mb-3.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            جیبوں کا انتخاب:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: '2 سائیڈ جیب',
                label: '2 سائیڈ جیب',
                icon: (
                  <svg className="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <rect x="7" y="15" width="5" height="12" />
                    <rect x="24" y="15" width="5" height="12" />
                  </svg>
                )
              },
              {
                id: '1 سامنے+2 سائیڈ',
                label: '1 سامنے+2 سائیڈ',
                icon: (
                  <svg className="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <rect x="13" y="10" width="10" height="9" />
                    <rect x="7" y="16" width="4" height="11" />
                    <rect x="25" y="16" width="4" height="11" />
                  </svg>
                )
              },
              {
                id: '1 سامنے+1 سائیڈ',
                label: '1 سامنے+1 سائیڈ',
                icon: (
                  <svg className="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <rect x="13" y="10" width="10" height="9" />
                    <rect x="7" y="16" width="4" height="11" />
                  </svg>
                )
              },
              {
                id: 'شلوار جیب',
                label: 'شلوار جیب',
                icon: (
                  <svg className="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 36 36">
                    <path d="M12 9 L24 9 L22 26 L14 26 Z" />
                  </svg>
                )
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyles((prev) => ({ ...prev, pocket: item.id as PocketType }))}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  styles.pocket === item.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span className="text-xs font-bold mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kaj & Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              کاج کا انتخاب:
            </label>
            <select
              value={styles.kaj}
              onChange={(e) => setStyles((prev) => ({ ...prev, kaj: e.target.value as KajType }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
            >
              <option value="سادہ کاج">سادہ کاج</option>
              <option value="آنکھ کاج">آنکھ کاج</option>
              <option value="ڈبل کاج">ڈبل کاج</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              بٹن کا انتخاب:
            </label>
            <select
              value={styles.button}
              onChange={(e) => setStyles((prev) => ({ ...prev, button: e.target.value as ButtonType }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
            >
              <option value="ٹچ بٹن">ٹچ بٹن (Snap)</option>
              <option value="سادہ بٹن">سادہ بٹن (Regular)</option>
              <option value="فینسی بٹن">فینسی بٹن (Fancy/Metal)</option>
              <option value="بغیر بٹن">بغیر بٹن (Stitch only)</option>
            </select>
          </div>
        </div>

        {/* Special Instructions & Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            اضافی نوٹ / سلائی کی ہدایات:
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="سلائی کی خصوصی ہدایات..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-600"
          />

          {/* Quick Note Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['ڈبل سلائی', 'کلف ہلکا', 'دھاگہ میچنگ', 'اوورلاک', 'موبائل جیب', 'استر لگانا'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addQuickNote(tag)}
                className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cloth Swatch / Photo Capture Attachment */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              کپڑے یا نمونے کی تصویر:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {capturedPhoto ? (
              <div className="flex items-center gap-2">
                <img
                  src={capturedPhoto}
                  alt="Captured fabric swatch"
                  className="w-9 h-9 object-cover rounded-md border border-slate-300"
                />
                <button
                  type="button"
                  onClick={onClearPhoto}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="تصویر ہٹائیں"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenCameraModal}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>📷 نمونہ فوٹو لیں</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. BILLING & ACCOUNTING CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 pb-2 mb-3 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between font-arabic">
          <span>سلائی اجرت اور کھاتہ (Billing & Advance)</span>
          <span className="text-xs font-bold text-slate-500">کرنسی: روپے (PKR)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              کُل بل (Total Bill):
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={totalBill}
              onChange={(e) => setTotalBill(e.target.value)}
              placeholder="1500"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصول شدہ ایڈوانس:
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-bold font-mono outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-red-700 dark:text-red-400 mb-1">
              بقایا رقم (Remaining Balance):
            </label>
            <input
              type="text"
              readOnly
              value={remainingVal}
              className="w-full px-3 py-2 rounded-lg border border-orange-300 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 text-lg font-extrabold font-mono"
            />
          </div>
        </div>

        {/* Karigar Name assign */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            کاریگر کا نام (Karigar):
          </label>
          <input
            type="text"
            value={karigarName}
            onChange={(e) => setKarigarName(e.target.value)}
            placeholder="استاد رشید / اسلم"
            className="w-48 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* FORM ACTION BUTTONS */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={resetForm}
          className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>صاف کریں</span>
        </button>

        <button
          type="submit"
          className="flex-1 py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-sm sm:text-base font-bold shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Scissors className="w-5 h-5" />
          <span>{editingOrder ? 'تبدیلیاں محفوظ کریں اور پرچی دیکھیں' : '✅ ناپ محفوظ کریں اور کاریگر پرچی بنائیں'}</span>
        </button>
      </div>
    </form>
  );
};
