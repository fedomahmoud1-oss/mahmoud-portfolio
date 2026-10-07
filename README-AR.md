# موقع محمود فداوي — دليل النشر والتعديل

## ١) النشر (مرة واحدة، حوالي ١٠ دقائق)
1. اعمل حساب مجاني على github.com، وأنشئ Repository **Private** باسم مثل `mahmoud-portfolio`، وارفع محتوى فولدر `site` كله فيه (زر Add file ← Upload files).
2. اعمل حساب مجاني على netlify.com بحساب GitHub، واختر Add new site ← Import from Git ← اختار الـ repo. اترك الإعدادات كما هي (Publish directory فاضي أو `.`) واضغط Deploy.
3. هتاخد لينك زي `something.netlify.app`. تقدر تغيّره من Site configuration ← Change site name (مثلاً `mahmoudfadawy.netlify.app`).

## ٢) تفعيل لوحة الإضافة (أنت بس اللي تدخل)
1. في GitHub: Settings ← Developer settings ← OAuth Apps ← New. Homepage: لينك الموقع. Callback: `https://api.netlify.com/auth/done`. انسخ Client ID وأنشئ Client Secret.
2. في Netlify: Site configuration ← Access & security ← OAuth ← Install provider ← GitHub، والصق الـ ID والـ Secret.
3. افتح الملف `admin/config.yml` وغيّر السطر `repo:` إلى `اسمك-على-جيتهاب/mahmoud-portfolio`، وغيّر `YOUR-SITE` إلى اسم موقعك. ارفع التعديل على GitHub.
4. ادخل `لينك-موقعك/admin` ← Login with GitHub. **فقط حسابك أنت** (صاحب الـ repo) يقدر يسجل ويعدّل. أي حد تاني بيشوف صفحة الدخول بس.

## ٣) إضافة شغل جديد
من `/admin` ← Portfolio ← Selected Work ← Add Works. املأ العنوان بالإنجليزي والعربي، واختر النوع، وارفع الفيديو (MP4 مضغوط) أو حط لينك يوتيوب Unlisted للفيديوهات الطويلة، وارفع صورة مصغّرة (Poster). اضغط Save ثم Publish، وبعد دقيقة يظهر في الموقع. نفس الشيء لقائمة الأعمال والكريدتس (Credits list).

## ٤) روابط للمشاركة
- الإنجليزي (الأساسي): `لينك-موقعك`
- العربي مباشرة: `لينك-موقعك/?lang=ar`
