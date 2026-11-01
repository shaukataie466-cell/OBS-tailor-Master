import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Github,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'github' | 'pwa'>('github');

  if (!isOpen) return null;

  const gitCommands = `git init
git add .
git commit -m "Initial commit - Tailor Master Pro with OBS 3D Icon"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-arabic leading-tight">
                اینڈرائیڈ اے پی کے (APK) اور گٹ ہب طریقہ کار
              </h3>
              <p className="text-xs text-emerald-300">
                گٹ ہب ایکشنز کے ذریعے خودکار APK تیار کرنے کا مکمل طریقہ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'github'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>طریقہ 1: گٹ ہب سے APK فائل بنوانا (خودکار)</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>طریقہ 2: بغیر APK فوری موبائل انسٹال</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === 'github' ? (
            <>
              {/* Ready Status Box */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs sm:text-sm font-arabic">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>آپ کے پروجیکٹ میں خودکار APK بلڈر پہلے ہی شامل کر دیا گیا ہے!</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  ہم نے آپ کی ایپ میں <code className="bg-emerald-100 dark:bg-emerald-900 px-1 py-0.5 rounded font-mono font-bold">.github/workflows/build-apk.yml</code> فائل بنا دی ہے۔ جب بھی آپ یہ کوڈ گٹ ہب پر ڈالیں گے، گٹ ہب خودکار طریقے سے آپ کو APK فائل تیار کر کے دے گا۔
                </p>
              </div>

              {/* 4 Steps Guide */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white font-arabic text-sm">
                  گٹ ہب سے APK حاصل کرنے کے 4 آسان اقدامات:
                </h4>

                <div className="space-y-2.5">
                  {/* Step 1 */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-slate-100 font-arabic">
                        گٹ ہب پر نئی ریپوزٹری (New Repository) بنائیں:
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                        <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-1 font-semibold">
                          github.com/new <ExternalLink className="w-3 h-3" />
                        </a> پر جائیں اور نام رکھیں مثلاً <code className="bg-slate-100 dark:bg-slate-900 px-1 rounded">tailor-master-app</code>۔
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="w-full">
                      <strong className="block text-slate-900 dark:text-slate-100 font-arabic">
                        کوڈ گٹ ہب پر پش / اپلوڈ کریں:
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 mb-2">
                        ٹرمینل یا VS Code میں یہ کمانڈز چلائیں (یا گٹ ہب ویب سائٹ پر سیدھا فائلیں اپلوڈ کریں):
                      </p>
                      <div className="relative bg-slate-950 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                        <pre>{gitCommands}</pre>
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs flex items-center gap-1 text-slate-200 transition-colors"
                          title="کمانڈ کاپی کریں"
                        >
                          {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{copiedCmd ? 'کاپی ہو گئی' : 'کاپی'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-slate-100 font-arabic">
                        گٹ ہب خودکار طور پر APK تیار کرے گا (GitHub Actions):
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                        کوڈ اپلوڈ ہوتے ہی گٹ ہب کا کلاؤڈ کمپیوٹر خودکار طور پر Capacitor اور Gradle چلا کر اینڈرائیڈ APK بنا دیتا ہے۔ آپ کو اپنے کمپیوٹر میں کوئی سافٹ ویئر انسٹال نہیں کرنا پڑتا۔
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-slate-100 font-arabic">
                        تیار شدہ APK فائل ڈاؤن لوڈ کریں:
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                        اپنی گٹ ہب ریپوزٹری میں اوپر <strong>"Actions"</strong> ٹیب پر کلک کریں۔ وہاں تازہ ترین رن پر کلک کریں اور نیچے <strong>Artifacts</strong> میں سے <strong>"TailorMasterPro-OBS-Debug-APK"</strong> ڈاؤن لوڈ کر لیں۔
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* PWA Instant Method */
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 font-arabic flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>سب سے تیز طریقہ: بغیر APK ڈاؤن لوڈ کیے ایپ انسٹال کرنا!</span>
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  ہماری بنائی گئی یہ ویب سائٹ ایک مکمل <strong>Progressive Web App (PWA)</strong> ہے۔ آپ کو کسی گٹ ہب یا APK فائل کے چکر میں پڑے بغیر 5 سیکنڈ میں یہ ایپ اپنے موبائل پر مل سکتی ہے!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3 items-center">
                  <span className="w-7 h-7 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">1</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    اپنے موبائل فون کے <strong>Google Chrome</strong> میں یہ ایپ اوپن کریں۔
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3 items-center">
                  <span className="w-7 h-7 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">2</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    اوپر دائیں کونے میں تین نقطوں <strong>(⋮)</strong> کے بٹن کو دبائیں۔
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-3 items-center">
                  <span className="w-7 h-7 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">3</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    <strong>"Add to Home screen"</strong> یا <strong>"Install app" (ایپ انسٹال کریں)</strong> منتخب کریں۔
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-center text-xs text-slate-600 dark:text-slate-300">
                🎉 ایپ فوراً آپ کے موبائل کی ہوم اسکرین پر <strong>3D OBS آئیکن</strong> اور آف لائن سپورٹ کے ساتھ شامل ہو جائے گی!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-sans">
            Package: <strong className="font-mono text-slate-700 dark:text-slate-300">com.obs.tailormaster</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            سمجھ گیا (ٹھیک ہے)
          </button>
        </div>
      </div>
    </div>
  );
};
