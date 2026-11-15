# خدماتي | Khadamati

مشروع متعدد المنصات يعمل من قاعدة كود واحدة على الويب وAndroid وiOS باستخدام Expo وReact Native وTypeScript وExpo Router.

## متطلبات البيئة
- Node.js 22.13 أو أحدث، أو Node.js 24.3 أو أحدث.
- npm.
- Android Studio وAndroid SDK وJDK 17 للبناء والتشغيل المحلي على Android.
- macOS وXcode 26.4 أو أحدث للبناء المحلي على iOS.
- يمكن بناء iOS سحابيًا عبر EAS Build دون جهاز Mac، مع إعداد حساب Apple عند الحاجة إلى التوزيع.

## التشغيل
```bash
npm install
npx expo install --fix
npx expo start
```

ثم:
- اضغط `w` لتشغيل نسخة الويب.
- اضغط `a` لتشغيل Android (يتطلب Android Studio ومحاكيًا أو جهازًا متصلًا).
- اضغط `i` لتشغيل iOS محليًا على macOS مع Xcode.

أوامر مباشرة:
```bash
npm run web
npm run android
npm run ios
npm run typecheck
npm run doctor
```

## بناء التطبيقات
ثبّت EAS CLI وسجّل الدخول إلى حساب Expo:
```bash
npm install --global eas-cli
eas login
eas build:configure
```

ملفات البناء معرفة في `eas.json`:
- Android preview: ملف APK للتجربة والتثبيت المباشر.
- Android production: ملف AAB للنشر على Google Play.
- iOS preview/production: بناء iOS عبر EAS؛ يتطلب حساب Apple وإعداد بيانات التوقيع المناسبة.

أوامر البناء:
```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
eas build --platform all --profile production
```

## هيكل المشروع
- `app/`: الشاشات والمسارات المشتركة بين المنصات.
- `app/+html.tsx`: إعداد صفحة الويب واتجاه RTL العربي.
- `app.json`: إعدادات Expo ومعرّفات التطبيق.
- `eas.json`: إعدادات بناء Android وiOS.
- `package.json`: الاعتماديات وأوامر التشغيل.

## ملاحظات
- لا توجد خدمات خلفية أو قاعدة بيانات أو مفاتيح سرية مضافة في هذه المرحلة.
- لا يتم النشر إلى Vercel أو أي استضافة تلقائيًا عند Push إلى GitHub.
- مجلدات `android/` و`ios/` تُولّد عند الحاجة باستخدام Expo Prebuild؛ لا نحتاج إلى إدارتها يدويًا في البداية.
- قبل أول بناء EAS، نفّذ `eas build:configure` واربط المشروع بحساب Expo لإضافة معرّف المشروع.
