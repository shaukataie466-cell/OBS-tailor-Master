import React from 'react';
import { X, Download, Sparkles, Check, Copy } from 'lucide-react';
import { AppIcon } from './AppIcon';

interface AppIconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppIconModal: React.FC<AppIconModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const downloadPng = () => {
    const svgElem = document.getElementById('obsAppIconSvg');
    if (!svgElem) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElem);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.clearRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'obs_khata_register_icon_1024.png';
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(blobURL);
      }
    };
    img.src = blobURL;
  };

  const downloadSvg = () => {
    const svgElem = document.getElementById('obsAppIconSvg');
    if (!svgElem) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElem);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'obs_khata_register_icon.svg';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="text-base font-bold font-arabic">آفیشل 3D موبائل ایپ آئیکن</h3>
              <p className="text-xs text-emerald-300">OBS کھاتہ رجسٹر (Khata Register)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center bg-slate-50 dark:bg-slate-950/60">
          <div className="p-4 rounded-3xl bg-radial from-emerald-900/30 to-transparent">
            <AppIcon size={190} />
          </div>

          {/* Details Pill */}
          <div className="mt-4 grid grid-cols-2 gap-2 w-full text-left text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">مرکزی لوگو</span>
              <strong className="text-slate-800 dark:text-slate-200">3D OBS (White, Gold, Grey)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">اوپر</span>
              <strong className="text-slate-800 dark:text-slate-200">کھلی کتاب / کھاتہ رجسٹر</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">نیچے بائیں جانب</span>
              <strong className="text-slate-800 dark:text-slate-200">تھرمل پرنٹر + پرچی</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">نیچے متن</span>
              <strong className="text-slate-800 dark:text-slate-200 font-arabic">کھاتہ رجسٹر (3D)</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <button
            type="button"
            onClick={downloadPng}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ہائی ریزولوشن PNG (1024px)</span>
          </button>

          <button
            type="button"
            onClick={downloadSvg}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ویکٹر SVG ڈاؤن لوڈ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
