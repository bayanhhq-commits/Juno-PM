# Juno Agent V3 · Windows Local

هذه النسخة هي **Agent حقيقي** وليست مجرد واجهة تجريبية. تقرأ مواد المشروع
وبيانات الاستخدام، ثم تنفذ ثلاث مراحل تلقائياً:

1. تحليل الأدلة والـmodule usage واستخراج الفرص.
2. ترتيب الأولويات وبناء Now / Next / Later roadmap واختيار lifecycle path.
3. كتابة 13 مخرجاً: opportunity brief، one-page PRD، full PRD، prototype
   brief، epic، user stories، analytics، UAT، GTM، rollout، release notes،
   user manual، وpost-launch review.

كل النتائج تبقى Draft إلى أن تختاري Approve أو Reject. لا يحدّث Juno أي نظام
خارجي، ولا يرسل رسائل، ولا ينشر أي شيء تلقائياً.

## التشغيل على Windows

1. ثبتي Node.js 20 أو أحدث مرة واحدة.
2. فكّي ضغط الحزمة.
3. اضغطي مرتين على `START_JUNO.bat`.
4. اتركي النافذة السوداء مفتوحة أثناء العمل. إغلاقها يوقف Juno.

## اختيار عقل Juno

### Local model · Ollama

- ثبتي Ollama for Windows.
- اضغطي `SETUP_LOCAL_MODEL.bat` لتنزيل نموذج البداية `llama3.2` بعد موافقتك.
- اختاري **Local model · Ollama** داخل Juno.
- المحتوى يبقى على جهازك ويذهب فقط إلى Ollama المحلي.

### OpenAI API

- اختاري **OpenAI API** داخل Juno.
- أدخلي API key عند التشغيل. المفتاح لا يُكتب إلى القرص ولا يُحفظ في المتصفح.
- Juno يستخدم Responses API مع Structured Outputs و`store: false`.

## الملفات المدعومة في هذه النسخة

TXT، Markdown، CSV، JSON، HTML. لصفحات الـLMS المحمية، احفظي الصفحة بصيغة
HTML أو انسخي محتواها إلى TXT/Markdown ثم أضيفيها. PDF وDOCX يحتاجان parser
إضافياً وسنضيفهما في مرحلة لاحقة إذا احتجناهما.

## التراجع والحماية

- كل تشغيل يُحفظ في مجلد جديد داخل `data/runs` ولا يمس التشغيلات السابقة.
- Approve وReject يضيفان سجل قرار منفصلاً.
- Restore ينشئ نسخة جديدة من تشغيل سابق؛ لا يحذف التاريخ.
- Kill switch وStop current run يوقفان العمل الجاري.
- Control & Audit داخل الواجهة يوفر Undo وRestore للـworkspace.
- حذف مجلد V3 يزيل هذه النسخة فقط؛ نسختا V1 وV2 تبقيان كما هما.

## اختبار المطور

    npm test
    npm run build

لا يوجد نشر أو GitHub integration في هذه النسخة.
