# Tailor Master Pro (درزی ماسٹر پرو - OBS کھاتہ رجسٹر)

پیشہ ورانہ درزی دکان مینجمنٹ، کاریگر کٹنگ پرچی، ناپ، سلائی اجرت، بلوٹوتھ تھرمل پرنٹر اور واٹس ایپ رسید سافٹ ویئر۔

---

## 📱 اینڈرائیڈ اے پی کے (Android APK) خودکار طریقے سے حاصل کرنے کا طریقہ

اس پروجیکٹ میں خودکار **GitHub Actions APK Builder** شامل کر دیا گیا ہے: `.github/workflows/build-apk.yml`

### 1. گٹ ہب پر ریپوزٹری بنائیں:
1. اپنے براؤزر میں [github.com/new](https://github.com/new) کھولیں۔
2. ریپوزٹری کا نام رکھیں مثلاً: `tailor-master-app`
3. **Public** یا **Private** منتخب کر کے **Create repository** پر کلک کریں۔

### 2. کوڈ گٹ ہب پر اپلوڈ کریں:
ٹرمینل یا کمانڈ پرامپٹ میں درج ذیل کمانڈز چلائیں:

```bash
git init
git add .
git commit -m "Tailor Master Pro with OBS 3D Icon and APK Builder"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tailor-master-app.git
git push -u origin main
```
*(نوٹ: `YOUR_USERNAME` کی جگہ اپنا گٹ ہب یوزر نیم لکھیں)*

---

### 3. گٹ ہب پر APK کیسے بنے گی؟
جیسے ہی آپ کوڈ پش کریں گے:
1. گٹ ہب کا **Actions** ٹیب خودکار طور پر آن ہو جائے گا۔
2. کلاؤڈ سرور پر کیپیسیٹر اور گریڈل (Gradle) چل کر 2 سے 3 منٹ میں اینڈرائیڈ APK تیار کر دے گا۔
3. اپنی گٹ ہب ریپوزٹری کے اوپر موجود **"Actions"** ٹیب پر کلک کریں۔
4. پہلی رن (Build & Release Android APK) پر کلک کریں۔
5. سب سے نیچے **Artifacts** سیکشن میں سے **`TailorMasterPro-OBS-Debug-APK`** پر کلک کر کے تیار شدہ APK ڈاؤن لوڈ کر لیں!

---

## ⚡ دوسرا طریقہ: بغیر APK موبائل پر فوری انسٹال کریں (PWA)
1. موبائل کے **Google Chrome** براؤزر میں اپنی ایپ کا ویب ایڈریس کھولیں۔
2. اوپر تین نقطوں `(⋮)` پر کلک کریں۔
3. **"Install app"** یا **"Add to Home screen"** منتخب کریں۔
4. ایپ فوری طور پر موبائل میں اصلی اینڈرائیڈ ایپ کی طرح 3D OBS آئیکن کے ساتھ انسٹال ہو جائے گی۔
