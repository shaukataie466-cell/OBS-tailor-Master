import { CustomerOrder, ShopProfile } from '../types/tailor';

export function formatWhatsAppMessage(order: CustomerOrder, shop: ShopProfile): string {
  const m = order.measurements;
  const s = order.styles;

  const text = `
*✂️ ${shop.name}*
📍 ${shop.address}
📞 رابطہ: ${shop.phone}
━━━━━━━━━━━━━━━━━━━━
*📋 کاریگر پرچی / سلائی آرڈر رسیپٹ*
*پرچی نمبر (Slip No):* #${order.slipNo}
*گاہک کا نام:* ${order.name}
*موبائل نمبر:* ${order.phone || 'نہیں ہے'}
*سوٹ کی تعداد:* ${order.qty} سوٹ
*واپسی تاریخ (Delivery):* ${order.deliveryDate}
${order.clothType ? `*کپڑا و رنگ:* ${order.clothType} (${order.fabricColor || ''})\n` : ''}
*📐 پیمائش ناپ (Measurements):*
1. لمبائی (Length): *${m.len}*
2. بازو (Sleeve): *${m.bazu}*
3. تیرا (Shoulder): *${m.teera}*
4. کالر / بین: *${m.collar}*
5. چھاتی (Chest): *${m.chest}*
6. چوڑائی / گھیرا: *${m.ghera}*
7. شلوار (Shalwar): *${m.shalwar}*
8. پائنچہ (Paincha): *${m.paincha}*
${m.waist ? `کمر (Waist): *${m.waist}*\n` : ''}${m.asan ? `آسن (Asan): *${m.asan}*\n` : ''}
*✂️ کٹائی و ڈیزائن (Style):*
• بین/کالر: *${s.collar}*
• کف: *${s.cuff}*
• دامن: *${s.daman}*
• جیبیں: *${s.pocket}*
• کاج و بٹن: *${s.kaj} / ${s.button}*
${order.notes ? `*نوٹ:* ${order.notes}\n` : ''}
*💰 کھاتہ و بل:*
• کُل بل: Rs. ${order.bill.total}
• وصول شدہ ایڈوانس: Rs. ${order.bill.advance}
• بقایا رقم (Remaining): *Rs. ${order.bill.remaining}*
━━━━━━━━━━━━━━━━━━━━
شکریہ! آپ کے تعاون کا بہت شکریہ۔
`.trim();

  return encodeURIComponent(text);
}

export function openWhatsApp(phone: string, message: string) {
  // Clean phone number (e.g. 03001234567 -> 923001234567)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) {
    cleanPhone = '92' + cleanPhone;
  }
  
  const url = cleanPhone.length > 5 
    ? `https://wa.me/${cleanPhone}?text=${message}`
    : `https://wa.me/?text=${message}`;
    
  window.open(url, '_blank');
}

export function exportOrdersJson(orders: CustomerOrder[], profile: ShopProfile) {
  const data = {
    exportedAt: new Date().toISOString(),
    shopProfile: profile,
    orders: orders
  };
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `TailorMaster_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}
