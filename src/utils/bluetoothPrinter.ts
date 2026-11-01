import { CustomerOrder, ShopProfile } from '../types/tailor';

export interface BluetoothPrinterState {
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
}

// ESC/POS Command Constants
const ESC = 0x1b;
const GS = 0x1d;

export class BluetoothThermalPrinter {
  private device: any = null;
  private characteristic: any = null;

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public async connect(): Promise<string> {
    if (!this.isSupported()) {
      throw new Error('آپ کا براؤزر ویب بلوٹوتھ کو سپورٹ نہیں کرتا۔ آپ براہ راست براؤزر پرنٹ یا واٹس ایپ استعمال کر سکتے ہیں۔');
    }

    try {
      // Standard Bluetooth Serial Port / Thermal Printer UUIDs
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb', // Standard Printer
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          0xffe0, // HM-10 / common BLE serial
          '49535343-fe7d-4ae5-8fa9-9fafd205e455'
        ]
      });

      this.device = device;
      const server = await device.gatt.connect();

      // Find writable characteristic
      const services = await server.getPrimaryServices();
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            this.characteristic = char;
            break;
          }
        }
        if (this.characteristic) break;
      }

      if (!this.characteristic) {
        throw new Error('پرنٹر پر پرنٹ سروس دستیاب نہیں ہوئی۔');
      }

      return device.name || 'بلوٹوتھ پرنٹر';
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        throw new Error('کوئی ڈیوائس منتخب نہیں کی گئی۔');
      }
      throw new Error(err.message || 'بلوٹوتھ پرنٹر کنیکٹ کرنے میں مسئلہ آیا۔');
    }
  }

  public disconnect(): void {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }

  public async printReceipt(order: CustomerOrder, shop: ShopProfile): Promise<boolean> {
    if (!this.characteristic) {
      throw new Error('پرنٹر کنیکٹ نہیں ہے۔ پہلے اوپر "پرنٹر جوڑیں" پر کلک کریں۔');
    }

    const encoder = new TextEncoder();
    const commands: number[] = [];

    // Initialize printer: ESC @
    commands.push(ESC, 0x40);

    // Center Align: ESC a 1
    commands.push(ESC, 0x61, 1);

    // Bold ON: ESC E 1
    commands.push(ESC, 0x45, 1);
    // Double size for Shop Name: GS ! 0x11
    commands.push(GS, 0x21, 0x11);

    const titleText = `${shop.name}\n`;
    for (const b of encoder.encode(titleText)) commands.push(b);

    // Normal size: GS ! 0x00
    commands.push(GS, 0x21, 0x00);
    commands.push(ESC, 0x45, 0);

    const subText = `${shop.phone} | ${shop.address}\n--------------------------------\n`;
    for (const b of encoder.encode(subText)) commands.push(b);

    // Order Details - Left Align: ESC a 0
    commands.push(ESC, 0x61, 0);
    const slipHeader = `Slip #: ${order.slipNo} | Date: ${new Date(order.createdAt).toLocaleDateString()}\nCustomer: ${order.name}\nPhone: ${order.phone}\nReturn Date: ${order.deliveryDate} (Qty: ${order.qty})\n--------------------------------\n`;
    for (const b of encoder.encode(slipHeader)) commands.push(b);

    // Measurements Table in Karigar Sequence
    const m = order.measurements;
    const measText = `MEASUREMENTS (پیمائش):\n1. Length (لمبائی):   ${m.len}\n2. Sleeve (بازو):     ${m.bazu}\n3. Shoulder (تیرا):   ${m.teera}\n4. Collar (کالر/بین): ${m.collar}\n5. Chest (چھاتی):     ${m.chest}\n6. Ghera (گھیرا):     ${m.ghera}\n7. Shalwar (شلوار):   ${m.shalwar}\n8. Paincha (پائنچہ):  ${m.paincha}\n--------------------------------\n`;
    for (const b of encoder.encode(measText)) commands.push(b);

    // Styling Choices
    const s = order.styles;
    const styleText = `STYLE (کٹائی و ڈیزائن):\n- Collar/Ban: ${s.collar}\n- Cuff:       ${s.cuff}\n- Daman:      ${s.daman}\n- Pockets:    ${s.pocket}\n- Kaj/Button: ${s.kaj} / ${s.button}\n`;
    for (const b of encoder.encode(styleText)) commands.push(b);

    if (order.notes) {
      const notesText = `Note: ${order.notes}\n`;
      for (const b of encoder.encode(notesText)) commands.push(b);
    }

    // Bill
    const billText = `--------------------------------\nTotal Bill:      Rs. ${order.bill.total}\nAdvance:         Rs. ${order.bill.advance}\nRemaining (بقایا): Rs. ${order.bill.remaining}\n================================\n${shop.karigarNote}\n\n\n\n`;
    for (const b of encoder.encode(billText)) commands.push(b);

    // Cut Paper: GS V 66 0
    commands.push(GS, 0x56, 66, 0);

    const buffer = new Uint8Array(commands);
    
    // Chunk transmission (usually 512 bytes limit per BLE packet)
    const chunkSize = 100;
    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      await this.characteristic.writeValue(chunk);
    }

    return true;
  }
}

export const printerInstance = new BluetoothThermalPrinter();
