// الوحدة الأولى: الكميات الكهربائية الأساسية — مقرر «كهرباء وإلكترونيات الآلات الميكانيكية» (مصيم 221)
// المصدر: الحقيبة التدريبية النظرية، تفريغات T_c01–T_c09 (ص 1–81) + خريطة المقرر course-map.md
// ملف بيانات خالص (ES Module) بلا منطق — يستهلكه data/course.js و data/quizzes.js
// وسوم concepts[] وحقول concept مأخوذة حرفيًا من data/concepts.js

export const UNIT1 = {
  id: 'u1',
  title: 'الكميات الكهربائية الأساسية',
  icon: 'zap',
  color: '#fbbf24',
  tagline: 'من إلكترون يفلت من ذرته… إلى محرك يدير الآلة',
  lessons: [
    // ============================================================
    // u1l1 — أساسيات الكهرباء والذرة والتيار
    // ============================================================
    {
      id: 'u1l1',
      title: 'أساسيات الكهرباء والذرة والتيار',
      minutes: 14,
      concepts: ['electric-current', 'dc-ac', 'material-classes'],
      blocks: [
        {
          t: 'concept',
          title: 'قبل أن تدور الآلة… إلكترون يفلت',
          icon: '🔍',
          html: 'داخل كل سلك نحاس في الورشة ملايين الذرات: نواة موجبة فيها البروتونات والنيوترونات، وحولها <span class="term">إلكترونات <i>Electrons</i></span> سالبة تدور في مدارات. إذا اكتسب إلكترون طاقة كافية (حرارة أو مؤثر خارجي) <b>أفلت من مداره وصار حرًا</b>، وترك خلفه <span class="term">فجوة <i>Hole</i></span>. سيل هذه الإلكترونات الحرة هو ما يشغّل محرك الآلة أمامك.',
        },
        {
          t: 'figure',
          caption: 'الذرة متعادلة حتى يفلت إلكترون من المدار الخارجي فتصبح موجبة وتترك فجوة',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><ellipse cx="150" cy="130" rx="115" ry="88" fill="none" stroke="var(--c-border2)" stroke-width="2"/><ellipse cx="150" cy="130" rx="65" ry="48" fill="none" stroke="var(--c-border2)" stroke-width="2"/><circle cx="150" cy="130" r="26" fill="var(--c-water)" opacity="0.35"/><circle cx="150" cy="130" r="26" fill="none" stroke="var(--c-water)" stroke-width="2"/><text x="150" y="137" text-anchor="middle" fill="var(--c-text)" font-size="16" font-weight="bold">+</text><circle cx="215" cy="130" r="7" fill="var(--c-simwater)"/><circle cx="85" cy="130" r="7" fill="var(--c-simwater)"/><circle cx="150" cy="42" r="7" fill="var(--c-simwater)"/><circle cx="265" cy="130" r="7" fill="none" stroke="var(--c-bad)" stroke-width="2" stroke-dasharray="3 3"/><circle cx="345" cy="88" r="7" fill="var(--c-bad)"/><path d="M275 126 L332 92" fill="none" stroke="var(--c-bad)" stroke-width="2"/><path d="M332 92 l-11 -1 l4 9" fill="none" stroke="var(--c-bad)" stroke-width="2"/><text x="345" y="70" text-anchor="middle" fill="var(--c-bad)" font-size="12">إلكترون حر</text><text x="262" y="162" text-anchor="middle" fill="var(--c-text2)" font-size="12">فجوة</text><text x="150" y="242" text-anchor="middle" fill="var(--c-text2)" font-size="12">نواة موجبة + مدارات الإلكترونات</text></svg>',
        },
        {
          t: 'concept',
          title: 'التيار: كم إلكترونًا يعبر في الثانية؟',
          icon: '🔢',
          html: '<span class="term">التيار الكهربائي <i>Electric Current</i></span> هو حركة متجهة للشحنات تنشأ عن فرق جهد بين نقطتين. رمزه <span class="ltr">I</span> ووحدته <span class="term">الأمبير <i>Ampere</i></span> <span class="ltr">A</span>، و<b>الأمبير الواحد يكافئ مرور <span class="ltr">6.25×10¹⁸</span> إلكترون خلال مقطع الموصل في الثانية</b>. ويقاس بالأميتر موصولًا <b>على التوالي</b> مع الحمل.',
        },
        {
          t: 'figure',
          caption: 'أعلى: جهد مستمر ثابت القيمة والاتجاه. أسفل: جهد متردد يعكس اتجاهه كل نصف دورة',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><line x1="30" y1="95" x2="380" y2="95" stroke="var(--c-border2)" stroke-width="1.5"/><line x1="40" y1="20" x2="40" y2="95" stroke="var(--c-border2)" stroke-width="1.5"/><line x1="45" y1="50" x2="375" y2="50" stroke="var(--c-water)" stroke-width="3"/><text x="200" y="38" text-anchor="middle" fill="var(--c-water)" font-size="13" font-weight="bold">DC</text><text x="200" y="115" text-anchor="middle" fill="var(--c-text2)" font-size="11">ثابت الاتجاه والقيمة</text><line x1="30" y1="205" x2="380" y2="205" stroke="var(--c-border2)" stroke-width="1.5"/><line x1="40" y1="145" x2="40" y2="255" stroke="var(--c-border2)" stroke-width="1.5"/><path d="M45 205 Q72 145 100 205 Q128 265 155 205 Q182 145 210 205 Q238 265 265 205 Q292 145 320 205 Q348 265 375 205" fill="none" stroke="var(--c-simwater2)" stroke-width="3"/><text x="200" y="162" text-anchor="middle" fill="var(--c-simwater2)" font-size="13" font-weight="bold">AC</text><text x="200" y="252" text-anchor="middle" fill="var(--c-text2)" font-size="11">دورة كاملة كل 1/f ثانية</text></svg>',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: أربعة مفاهيم يخلط بينها الفنيون',
          cards: [
            { front: 'التيار المستمر (DC)', back: 'ثابت الاتجاه والقيمة، تتحرك الإلكترونات في اتجاه واحد — بطارية الآلة ومحركات التيار المستمر.' },
            { front: 'التيار المتردد (AC)', back: 'متغير الاتجاه والشدة باستمرار من السالب إلى الموجب وبالعكس — شبكة الكهرباء والمحركات الحثية.' },
            { front: 'الاتجاه الهندسي', back: 'الاتجاه المفترض قبل اكتشاف الإلكترون: من القطب الموجب إلى السالب في الدائرة، وهو المرسوم في المخططات.' },
            { front: 'الاتجاه الإلكتروني', back: 'الاتجاه الحقيقي للإلكترونات: من القطب السالب إلى الموجب في الدائرة، وعكسه داخل مصدر الجهد.' },
          ],
        },
        {
          t: 'match',
          title: 'وصّل طريقة توليد الجهد بتطبيقها في الآلة',
          pairs: [
            { a: 'التأثير المغناطيسي', b: 'مولد الآلة (الدينمو)' },
            { a: 'التأثير الكيميائي', b: 'بطارية بدء الحركة' },
            { a: 'التأثير الضوئي', b: 'الخلية الشمسية' },
            { a: 'التأثير الحراري', b: 'المزدوج الحراري للأفران' },
            { a: 'الضغط على البلورات', b: 'اللاقط الصوتي (الميكروفون)' },
          ],
        },
        {
          t: 'concept',
          title: 'ثلاث سلال: موصل، شبه موصل، عازل',
          icon: '📦',
          html: 'تصنّف المواد حسب سماحيتها للشحنات بالحركة:<ul><li><span class="term">موصلات <i>Conductors</i></span>: تمرّر التيار بسهولة — النحاس والحديد والألمنيوم والزئبق.</li><li><span class="term">أشباه موصلات <i>Semiconductors</i></span>: بين الاثنين، تتحول إلى التوصيل بظروف معينة — <b>الجرمانيوم والسيليكون</b>.</li><li><span class="term">عوازل <i>Insulators</i></span>: تمنع مرور التيار — الخزف والورق والزجاج والمطاط والخشب.</li></ul>',
        },
        {
          t: 'order',
          title: 'رتّب أجزاء الوحدة ومضاعفاتها من الأصغر إلى الأكبر',
          items: ['ميكرو µ = 10⁻⁶', 'ملي m = 10⁻³', 'كيلو k = 10³', 'ميجا M = 10⁶'],
        },
        {
          t: 'tip',
          html: 'في الورشة: عندما تقيس تيار ملف حساس ستجد القراءة بالميكروأمبير <span class="ltr">µA</span>، وتيار بادئ الحركة بالمئات من الأمبير <span class="ltr">A</span>. <b>خطأ قوة العشرة يساوي حرق الجهاز أو حرق المدى</b> — اضبط مدى الأفوميتر على الأعلى دائمًا ثم انزل به تدريجيًا.',
        },
        { t: 'quiz', ref: 'u1l1check' },
      ],
    },

    // ============================================================
    // u1l2 — المغناطيسية والحث الكهرومغناطيسي
    // ============================================================
    {
      id: 'u1l2',
      title: 'المغناطيسية والحث الكهرومغناطيسي',
      minutes: 15,
      concepts: ['magnetic-flux', 'electromagnet', 'faraday-law'],
      blocks: [
        {
          t: 'concept',
          title: 'مسمار عادي… يجذب المشابك فجأة',
          icon: '⭐',
          html: 'ادلك مسمارًا حديديًا بمغناطيس في اتجاه واحد عدة مرات، فيصير هو نفسه مغناطيسًا يجذب المشابك. السبب أن جزيئات المادة مغناطيسات صغيرة عشوائية الاتجاه، وعند المغنطة <b>تنتظم كلها في اتجاه واحد</b>. والطريقة الثانية للمغنطة كهربائية: تمرير تيار مستمر في ملف حول قضيب الحديد.',
        },
        {
          t: 'figure',
          caption: 'خطوط الفيض تخرج من القطب الشمالي وتدخل الجنوبي خارج المغناطيس، وتزدحم عند الأقطاب',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><ellipse cx="200" cy="130" rx="150" ry="95" fill="none" stroke="var(--c-simwater)" stroke-width="2" opacity="0.55"/><ellipse cx="200" cy="130" rx="120" ry="62" fill="none" stroke="var(--c-simwater)" stroke-width="2" opacity="0.75"/><ellipse cx="200" cy="130" rx="98" ry="32" fill="none" stroke="var(--c-simwater)" stroke-width="2" opacity="0.9"/><rect x="120" y="112" width="80" height="36" fill="var(--c-simwater2)" opacity="0.4" stroke="var(--c-border2)" stroke-width="1.5"/><rect x="200" y="112" width="80" height="36" fill="var(--c-bad)" opacity="0.4" stroke="var(--c-border2)" stroke-width="1.5"/><text x="160" y="138" text-anchor="middle" fill="var(--c-text)" font-size="18" font-weight="bold">S</text><text x="240" y="138" text-anchor="middle" fill="var(--c-text)" font-size="18" font-weight="bold">N</text><line x1="200" y1="104" x2="200" y2="156" stroke="var(--c-text2)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="200" y="174" text-anchor="middle" fill="var(--c-text2)" font-size="11">منطقة الخمود</text><path d="M300 98 l-2 11 l10 -5" fill="none" stroke="var(--c-simwater)" stroke-width="2"/><path d="M100 162 l-10 -4 l10 -5" fill="none" stroke="var(--c-simwater)" stroke-width="2"/><text x="200" y="246" text-anchor="middle" fill="var(--c-text2)" font-size="12">خطوط المجال المغناطيسي حول قضيب</text></svg>',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: ثلاث حقائق عن المغناطيس',
          cards: [
            { front: 'أقطاب المغناطيس', back: 'قطبان دائمًا: شمالي N يتجه للشمال الجغرافي عند التعليق الحر، وجنوبي S. المتشابهة تتنافر والمختلفة تتجاذب.' },
            { front: 'منطقة الخمود', back: 'المنطقة المتعادلة في منتصف المغناطيس بين القطبين، وفيها تنعدم خاصية الجذب فلا تتراكم عليها برادة الحديد.' },
            { front: 'إذا كُسر المغناطيس', back: 'لا ينفصل القطبان! يظهر مغناطيسان لكل منهما قطب شمالي وجنوبي، ويمكن تكرار الكسر إلى مغناطيسات كثيرة.' },
          ],
        },
        {
          t: 'concept',
          title: 'التيار يصنع مجالًا… والملف يصنع مغناطيسًا',
          icon: '🔍',
          html: 'حول أي موصل يمر به تيار تنشأ <b>دوائر متحدة المركز</b> في مستوى عمودي على التيار، تتقارب كلما زادت شدته، وينعكس اتجاهها بعكس التيار. ولفّ الموصل حلزونيًا يزدحم الفيض داخله فيصير له قطبان. قوة <span class="term">المغناطيس الكهربائي <i>Electromagnet</i></span> تتوقف على أربعة عوامل: <b>شدة التيار، وعدد اللفات، وطول الملف، ونوع القلب</b>.',
        },
        {
          t: 'match',
          title: 'وصّل القاعدة بما تحدده',
          pairs: [
            { a: 'قاعدة اليد اليمنى للموصل', b: 'الإبهام = التيار، الأصابع = المجال' },
            { a: 'قاعدة اليد اليمنى للملف', b: 'الإبهام يشير إلى القطب الشمالي' },
            { a: 'قاعدة فليمنج لليد اليمنى', b: 'اتجاه القوة الدافعة الحثية' },
            { a: 'قانون لينز', b: 'الحث يعارض التغيّر في الفيض' },
          ],
        },
        {
          t: 'formula',
          name: 'قانون فاراداي للحث',
          expr: 'e = N × (ΔΦ / Δt)',
          terms: [
            { sym: 'e', ar: 'القوة الدافعة الكهربائية الحثية', unit: 'V' },
            { sym: 'N', ar: 'عدد لفات الملف', unit: 'لفة' },
            { sym: 'ΔΦ', ar: 'مقدار تغيّر الفيض المغناطيسي', unit: 'Wb' },
            { sym: 'Δt', ar: 'الزمن الذي حدث فيه التغيّر', unit: 's' },
          ],
          note: 'القاعدة الذهبية: <b>لا تغيّر في الفيض ⟵ لا جهد</b>. مغناطيس ساكن داخل ملف ساكن يعطي <span class="ltr">e = 0 V</span> مهما كان قويًا.',
        },
        {
          t: 'example',
          title: 'مثال محلول: ملف يتحرك أمام مغناطيس',
          given: ['عدد اللفات N = <span class="ltr">200</span> لفة', 'تغيّر الفيض ΔΦ = <span class="ltr">0.02 Wb</span>', 'زمن التغيّر Δt = <span class="ltr">0.1 s</span>'],
          steps: [
            'معدل تغيّر الفيض: ΔΦ ÷ Δt = 0.02 ÷ 0.1 = <span class="ltr">0.2 Wb/s</span>',
            'القوة الدافعة: e = N × 0.2 = 200 × 0.2 = <span class="ltr">40 V</span>',
          ],
          answer: 'e = <span class="ltr">40 V</span> — ولو ضاعفنا اللفات إلى <span class="ltr">400</span> عند نفس المعدل لصارت <span class="ltr">80 V</span>.',
        },
        {
          t: 'sim',
          sim: 'sim-magnetic-field',
          title: 'مصنع المغناطيس والحث بالحركة',
          desc: 'ملف حلزوني بقلب قابل للتبديل، وموصل يتحرك داخل مجال: شاهد خطوط المجال وق.د.ك الحثية',
          missions: [
            { id: 'm1', text: 'ارفع عدد اللفات من <span class="ltr">50</span> إلى <span class="ltr">1000</span> عند تيار <span class="ltr">2 A</span> وأثبت زيادة عدد المشابك المرفوعة زيادة رتيبة' },
            { id: 'm2', text: 'بدّل القلب من هواء إلى حديد عند نفس التيار وسجّل زيادة شدة المجال بأكثر من <span class="ltr">×5</span>' },
            { id: 'm3', text: 'حرّك الموصل داخل المجال حتى تبلغ ق.د.ك الحثية القيمة المستهدفة بخطأ <span class="ltr">±5%</span> من <span class="ltr">e=N·dΦ/dt</span>' },
            { id: 'm4', text: 'ضاعف عدد اللفات عند ثبات معدل تغيّر الفيض وتحقّق من مضاعفة <span class="ltr">e</span> (نسبة <span class="ltr">2.0±0.05</span>)' },
            { id: 'm5', text: 'اعكس اتجاه حركة المغناطيس داخل الملف وأثبت انعكاس إشارة الجلفانوميتر (قانون لينز)' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة: عمود المحرك وحوامله (البلي) قد <b>تتمغنط</b> مع الزمن فتلتقط برادة الحديد وتسرّع تآكل مسار الكرات. إذا لصقت البرادة بالعمود بعد الفك فالقطعة تحتاج <span class="term">إزالة مغنطة <i>Demagnetizing</i></span> قبل إعادة التركيب.',
        },
        { t: 'quiz', ref: 'u1l2check' },
      ],
    },

    // ============================================================
    // u1l3 — الكميات الكهربائية وحساباتها
    // ============================================================
    {
      id: 'u1l3',
      title: 'الكميات الكهربائية وحساباتها',
      minutes: 16,
      concepts: ['ohm-law', 'electric-power', 'efficiency'],
      blocks: [
        {
          t: 'concept',
          title: 'ثلاثة أرقام تحكم كل دائرة في الآلة',
          icon: '💡',
          html: 'أي عطل كهربائي تقرؤه بثلاث كميات فقط: <span class="term">الجهد <i>Voltage</i></span> <span class="ltr">U</span> بالفولت <span class="ltr">V</span> (يقاس بالفولتميتر على التوازي)، و<span class="term">التيار <i>Current</i></span> <span class="ltr">I</span> بالأمبير <span class="ltr">A</span> (بالأميتر على التوالي)، و<span class="term">المقاومة <i>Resistance</i></span> <span class="ltr">R</span> بالأوم <span class="ltr">Ω</span> (بالأوميتر <b>بعد فصل التيار</b>). وقانون واحد يربطها كلها.',
        },
        {
          t: 'figure',
          caption: 'مثلث أوم: غطِّ المجهول بإصبعك فتظهر أمامك الصيغة المطلوبة مباشرة',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><path d="M200 30 L340 225 L60 225 Z" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><line x1="102" y1="150" x2="298" y2="150" stroke="var(--c-water)" stroke-width="3"/><line x1="200" y1="150" x2="200" y2="225" stroke="var(--c-water)" stroke-width="3"/><text x="200" y="122" text-anchor="middle" fill="var(--c-text)" font-size="34" font-weight="bold">U</text><text x="150" y="203" text-anchor="middle" fill="var(--c-text)" font-size="30" font-weight="bold">R</text><text x="252" y="203" text-anchor="middle" fill="var(--c-text)" font-size="30" font-weight="bold">I</text><text x="200" y="250" text-anchor="middle" fill="var(--c-text2)" font-size="12">U = I × R   ·   I = U ÷ R   ·   R = U ÷ I</text></svg>',
        },
        {
          t: 'formula',
          name: 'قانون أوم',
          expr: 'U = I × R',
          terms: [
            { sym: 'U', ar: 'فرق الجهد', unit: 'V' },
            { sym: 'I', ar: 'شدة التيار', unit: 'A' },
            { sym: 'R', ar: 'المقاومة', unit: 'Ω' },
          ],
          note: 'الصورتان الأخريان: <span class="ltr">I = U / R</span> و<span class="ltr">R = U / I</span>. حوّل الوحدات قبل التعويض: <span class="ltr">mA = 10⁻³ A</span> و<span class="ltr">kΩ = 10³ Ω</span>.',
        },
        {
          t: 'example',
          title: 'مثال (1) من الحقيبة: تيار المقاومة',
          given: ['المقاومة R = <span class="ltr">100 Ω</span>', 'هبوط الجهد عليها V = <span class="ltr">50 V</span>'],
          steps: [
            'نستخدم صورة التيار: I = V ÷ R',
            'I = 50 ÷ 100 = <span class="ltr">0.5 A</span>',
          ],
          answer: 'I = <span class="ltr">0.5 A</span> أي <span class="ltr">500 mA</span>.',
        },
        {
          t: 'formula',
          name: 'القدرة الكهربائية',
          expr: 'P = U × I = I<sup>2</sup> × R = U<sup>2</sup> / R',
          terms: [
            { sym: 'P', ar: 'القدرة الكهربائية', unit: 'W' },
            { sym: 'U', ar: 'فرق الجهد', unit: 'V' },
            { sym: 'I', ar: 'شدة التيار', unit: 'A' },
            { sym: 'R', ar: 'المقاومة', unit: 'Ω' },
          ],
          note: 'للمحركات تُذكر القدرة بالحصان: <span class="ltr">1 HP = 746 W</span>. والشغل الكهربائي <span class="ltr">W = P × t</span> ويقاس عمليًا بـ<span class="ltr">kWh</span>.',
        },
        {
          t: 'example',
          title: 'مثال (7) من الحقيبة: القدرة تتربّع مع التيار',
          given: ['المقاومة R = <span class="ltr">10 Ω</span> ثابتة', 'التيار I = <span class="ltr">0.7</span> ثم <span class="ltr">1.4</span> ثم <span class="ltr">2.1 A</span>'],
          steps: [
            'عند I = 0.7: P = I² × R = 0.49 × 10 = <span class="ltr">4.9 W</span>',
            'عند I = 1.4: P = 1.96 × 10 = <span class="ltr">19.6 W</span>',
            'عند I = 2.1: P = 4.41 × 10 = <span class="ltr">44.1 W</span>',
          ],
          answer: 'مضاعفة التيار ضاعفت القدرة <b>أربع مرات</b> — ولهذا يحترق الملف بسرعة عند زيادة التيار قليلًا.',
        },
        {
          t: 'formula',
          name: 'الكفاية والقدرة المفقودة',
          expr: 'η = P<sub>2</sub> / P<sub>1</sub>   ·   P<sub>L</sub> = P<sub>1</sub> − P<sub>2</sub>',
          terms: [
            { sym: 'η', ar: 'الكفاية (تُنطق أيتا) ولا وحدة لها', unit: '—' },
            { sym: 'P₁', ar: 'القدرة الداخلة من المصدر', unit: 'W' },
            { sym: 'P₂', ar: 'القدرة الخارجة المفيدة', unit: 'W' },
            { sym: 'P_L', ar: 'القدرة المفقودة حرارةً واحتكاكًا', unit: 'W' },
          ],
          note: 'η أقل من <span class="ltr">1</span> دائمًا. جهاز داخلته <span class="ltr">1000 W</span> وخارجته <span class="ltr">850 W</span> ⟵ <span class="ltr">η = 0.85</span> و<span class="ltr">P_L = 150 W</span> تتحول حرارة.',
        },
        {
          t: 'match',
          title: 'وصّل الكمية بجهاز قياسها',
          pairs: [
            { a: 'الجهد U', b: 'الفولتميتر (على التوازي)' },
            { a: 'شدة التيار I', b: 'الأميتر (على التوالي)' },
            { a: 'المقاومة R', b: 'الأوميتر (بعد فصل التيار)' },
            { a: 'القدرة P', b: 'الواطميتر' },
            { a: 'الشغل الكهربائي W', b: 'العداد الكهربائي' },
          ],
        },
        {
          t: 'sim',
          sim: 'sim-ohm-power',
          title: 'مختبر أوم والقدرة',
          desc: 'مصدر ومقاومة وأجهزة قياس: طبّق قانون أوم بصوره الثلاث وتتبّع القدرة والحرارة',
          missions: [
            { id: 'm1', text: 'أعِد مثال (1): اضبط <span class="ltr">R=100 Ω</span> و<span class="ltr">V=50 V</span> وتحقّق من <span class="ltr">I=0.5±0.01 A</span>' },
            { id: 'm2', text: 'أعِد مثال (2) بالوحدات المصغّرة: <span class="ltr">V=150 mV</span> و<span class="ltr">I=75 µA</span> ⟵ <span class="ltr">R=2 kΩ ±2%</span>' },
            { id: 'm3', text: 'مثال (7): ثبّت <span class="ltr">R=10 Ω</span> وسجّل القدرة عند <span class="ltr">I=0.7/1.4/2.1 A</span> ⟵ <span class="ltr">4.9/19.6/44.1 W ±2%</span>' },
            { id: 'm4', text: 'أثبت أن مضاعفة <span class="ltr">R</span> عند ثبات <span class="ltr">E</span> تنصّف <span class="ltr">I</span> وتنصّف <span class="ltr">P</span> (نسبة <span class="ltr">0.5±0.02</span>)' },
            { id: 'm5', text: 'اضبط جهازًا داخلته <span class="ltr">1000 W</span> وخارجته <span class="ltr">850 W</span> وتحقّق من <span class="ltr">η=0.85±0.01</span> و<span class="ltr">P_L=150 W</span>' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة: محرك بطاقته <span class="ltr">5 HP</span> يعني <span class="ltr">3730 W</span> خرجًا ميكانيكيًا لا دخلًا كهربائيًا. اقسم على الكفاية لتعرف ما يسحبه فعلًا من الخط، ثم اختر الكابل والمصهر على <b>الدخل</b> لا على الخرج — وإلا سخّن الكابل وفصل المصهر عند كل بدء حركة.',
        },
        { t: 'quiz', ref: 'u1l3check' },
      ],
    },

    // ============================================================
    // u1l4 — المقاومات والموصلات والمكثفات
    // ============================================================
    {
      id: 'u1l4',
      title: 'المقاومات والموصلات والمكثفات',
      minutes: 16,
      concepts: ['capacitance', 'rc-time-constant'],
      blocks: [
        {
          t: 'concept',
          title: 'حلقات ملوّنة… تخبرك بالقيمة قبل أن تقيس',
          icon: '🔷',
          html: 'على أصغر مقاومة في لوحة التحكم أربع حلقات ملوّنة: <b>رقم أول، ورقم ثانٍ، وأس عشري، وتفاوت</b>. أسود <span class="ltr">0</span> حتى أبيض <span class="ltr">9</span>، والذهبي <span class="ltr">±5%</span> والفضي <span class="ltr">±10%</span>. مثلًا أصفر-بنفسجي-برتقالي-فضي = <span class="ltr">47 × 10³ = 47 kΩ ±10%</span>.',
        },
        {
          t: 'concept',
          title: 'لماذا يسخن هذا السلك دون غيره؟',
          icon: '🔥',
          html: 'مقاومة الموصل تتوقف على ثلاثة عوامل: <b>الطول</b> (طردي)، و<b>مساحة المقطع</b> (عكسي)، و<b>مادة الصنع</b>. ومقلوب المقاومة هو <span class="term">الموصلة <i>Conductance</i></span> <span class="ltr">G = 1/R</span> بوحدة السيمنز <span class="ltr">S</span>. لذلك يحتاج بادئ الحركة مقطعًا كبيرًا لتيار عالٍ، بينما يكفي المصباح مقطع صغير.',
        },
        {
          t: 'figure',
          caption: 'قراءة الحلقات بالترتيب: 4 ثم 7 ثم أس عشري 10³ ثم التفاوت الفضي',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="120" x2="380" y2="120" stroke="var(--c-text2)" stroke-width="3"/><rect x="100" y="86" width="200" height="68" rx="26" fill="var(--c-surface2)" stroke="var(--c-border2)" stroke-width="2"/><rect x="126" y="86" width="16" height="68" fill="#eab308"/><rect x="160" y="86" width="16" height="68" fill="#7e22ce"/><rect x="194" y="86" width="16" height="68" fill="#ea580c"/><rect x="252" y="86" width="16" height="68" fill="#c0c0c0" stroke="var(--c-border2)" stroke-width="1"/><text x="134" y="76" text-anchor="middle" fill="var(--c-text2)" font-size="11">أصفر</text><text x="168" y="76" text-anchor="middle" fill="var(--c-text2)" font-size="11">بنفسجي</text><text x="202" y="76" text-anchor="middle" fill="var(--c-text2)" font-size="11">برتقالي</text><text x="260" y="76" text-anchor="middle" fill="var(--c-text2)" font-size="11">فضي</text><text x="134" y="182" text-anchor="middle" fill="var(--c-text)" font-size="16" font-weight="bold">4</text><text x="168" y="182" text-anchor="middle" fill="var(--c-text)" font-size="16" font-weight="bold">7</text><text x="202" y="182" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">×10³</text><text x="260" y="182" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">±10%</text><text x="200" y="228" text-anchor="middle" fill="var(--c-water)" font-size="18" font-weight="bold">47 kΩ ±10%</text></svg>',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: أنواع المقاومات في اللوحة',
          cards: [
            { front: 'الكربونية (الشريطية)', back: 'حامل خزفي مغلّف بطبقة كربون رقيقة وطلاء واقٍ، وقيمتها تُقرأ من حلقات الألوان — الأكثر شيوعًا في الدوائر الإلكترونية.' },
            { front: 'السلكية', back: 'سلك كونستنتان (60% نحاس و40% نيكل) ملفوف على أنبوبة خزفية بمشابك معدنية — تتحمل قدرة عالية وحرارة كبيرة.' },
            { front: 'المتغيرة', back: 'ملف سلكي للأحمال الكبيرة أو طبقة جرافيت للأحمال الصغيرة، وتُضبط القيمة بتحريك المنزلق على سطح التلامس.' },
          ],
        },
        {
          t: 'concept',
          title: 'المكثف: خزّان شحنة يفرغ في لحظة',
          icon: '🔒',
          html: '<span class="term">المكثف <i>Capacitor</i></span> لوحان معدنيان بينهما مادة عازلة (هواء أو ورق أو ميكا أو سيراميك). يخزّن الشحنة عند توصيله بالجهد ويطلقها عند التفريغ، و<b>يمنع مرور التيار المستمر</b> بعد اكتمال الشحن. سعته تزيد بزيادة <b>مساحة الألواح وعددها وثابت العزل</b>، وتقل بزيادة <b>المسافة بين اللوحين</b>.',
        },
        {
          t: 'formula',
          name: 'السعة والشحنة المخزّنة',
          expr: 'C = Q / U   ⟵   Q = U × C',
          terms: [
            { sym: 'C', ar: 'سعة المكثف', unit: 'F' },
            { sym: 'Q', ar: 'كمية الشحنة المخزّنة', unit: 'C' },
            { sym: 'U', ar: 'جهد المكثف', unit: 'V' },
          ],
          note: 'الفاراد وحدة ضخمة، فالتطبيق العملي بالميكروفاراد <span class="ltr">µF</span> والنانوفاراد <span class="ltr">nF</span> والبيكوفاراد <span class="ltr">pF</span>.',
        },
        {
          t: 'example',
          title: 'مثال محلول: شحنة مكثف لوحة التحكم',
          given: ['سعة المكثف C = <span class="ltr">470 µF</span> = <span class="ltr">470×10⁻⁶ F</span>', 'جهد التشغيل U = <span class="ltr">24 V</span>'],
          steps: [
            'نطبّق العلاقة: Q = U × C',
            'Q = 24 × 470×10⁻⁶ = <span class="ltr">0.01128 C</span>',
          ],
          answer: 'Q ≈ <span class="ltr">11.3 mC</span> — شحنة صغيرة رقميًا لكنها كافية لتشرير قصر عنيف على أطراف المفك.',
        },
        {
          t: 'formula',
          name: 'السعة المكافئة للمكثفات',
          expr: 'توازٍ: C<sub>T</sub> = C<sub>1</sub> + C<sub>2</sub> + …   ·   توالٍ: 1/C<sub>T</sub> = 1/C<sub>1</sub> + 1/C<sub>2</sub> + …',
          terms: [
            { sym: 'C_T', ar: 'السعة الكلية المكافئة', unit: 'F' },
            { sym: 'C₁, C₂', ar: 'سعات المكثفات المفردة', unit: 'F' },
          ],
          note: 'انتبه: القاعدة <b>معكوسة</b> عن المقاومات. التوازي يزيد السعة (كأنك زدت مساحة الألواح)، والتوالي ينقصها لتصير أصغر من أي سعة مفردة.',
        },
        {
          t: 'example',
          title: 'مثال محلول: ثلاثة مكثفات على التوالي',
          given: ['ثلاثة مكثفات متساوية C = <span class="ltr">10 µF</span> لكل منها', 'التوصيل على التوالي'],
          steps: [
            'المقلوب: 1/C_T = 1/10 + 1/10 + 1/10 = 3/10',
            'إذن C_T = 10 ÷ 3 = <span class="ltr">3.33 µF</span>',
          ],
          answer: 'C_T = <span class="ltr">3.33 µF</span> — أصغر من أي مكثف مفرد، عكس ما يتوقعه أغلب المتدربين.',
        },
        {
          t: 'formula',
          name: 'ثابت الزمن للدائرة RC',
          expr: 'τ = R × C',
          terms: [
            { sym: 'τ', ar: 'ثابت الزمن (تُنطق تاو)', unit: 's' },
            { sym: 'R', ar: 'مقاومة دائرة الشحن', unit: 'Ω' },
            { sym: 'C', ar: 'سعة المكثف', unit: 'F' },
          ],
          note: 'عند <span class="ltr">t = τ</span> يبلغ جهد المكثف نحو <span class="ltr">63%</span> من جهد المصدر، ويُعتبر الشحن مكتملًا عمليًا بعد <span class="ltr">5τ</span> (قرابة <span class="ltr">100%</span>).',
        },
        {
          t: 'sim',
          sim: 'sim-capacitor-rc',
          title: 'شحن وتفريغ المكثف',
          desc: 'بطارية ومفتاح تبديل ومقاومة ومكثف: تابع منحنيَي الجهد والتيار حتى خمسة ثوابت زمنية',
          missions: [
            { id: 'm1', text: 'تحقّق من بلوغ جهد المكثف <span class="ltr">63%</span> من جهد المصدر عند <span class="ltr">t=τ</span> بخطأ <span class="ltr">±2%</span>' },
            { id: 'm2', text: 'اختر <span class="ltr">R</span> و<span class="ltr">C</span> لزمن شحن كامل قدره <span class="ltr">5 s</span> ⟵ تحقّق من <span class="ltr">RC=1 s ±5%</span>' },
            { id: 'm3', text: 'أثبت أن تيار التفريغ معاكس لتيار الشحن (إشارة سالبة وقيمة ابتدائية <span class="ltr">E/R ±5%</span>)' },
            { id: 'm4', text: 'ضاعف <span class="ltr">C</span> عند ثبات <span class="ltr">R</span> وأثبت مضاعفة زمن بلوغ <span class="ltr">99%</span> (نسبة <span class="ltr">2.0±0.05</span>)' },
          ],
        },
        {
          t: 'tip',
          html: '⚠ سلامة إلزامية: قبل لمس أي مكثف كيميائي كبير السعة في لوحة الآلة، تأكد من جهد التشغيل والقطبية، ثم <b>فرّغه بتوصيل مقاومة <span class="ltr">1 kΩ</span> بين طرفيه</b>. المكثف يحتفظ بجهده دقائق أو أيامًا بعد فصل التغذية، وعكس قطبية المكثف المستقطب قد يفجّره.',
        },
        { t: 'quiz', ref: 'u1l4check' },
      ],
    },
  ],
};

// ================================================================
// بنوك أسئلة الوحدة الأولى
// ================================================================
export const U1_QUIZZES = {
  // ---- الاختبار القبلي: 6 أسئلة تغطي الدروس الأربعة ----
  u1pre: {
    title: 'قبل الانطلاق: أين أنت من الكميات الكهربائية؟',
    questions: [
      {
        t: 'mc',
        q: 'أي وصف يطابق التيار الكهربائي في موصل نحاسي؟',
        opts: [
          'حركة متجهة للإلكترونات الحرة داخل الموصل',
          'تجمّع شحنات ساكنة على سطح الغلاف العازل',
          'اهتزاز ذرات المعدن حول مواضعها الثابتة',
          'انتقال حرارة من الطرف الساخن إلى الطرف البارد',
        ],
        correct: 0,
        why: 'التيار حركة متجهة للشحنات (الإلكترونات الحرة) تنشأ عن فرق جهد بين نقطتين، والأمبير الواحد يكافئ مرور 6.25×10¹⁸ إلكترون خلال المقطع في الثانية.',
        unit: 'u1',
        concept: 'electric-current',
      },
      {
        t: 'mc',
        q: 'أي المواد التالية يُصنَّف شبه موصل؟',
        opts: [
          'النحاس في كابلات التغذية',
          'الخزف العازل في القواعد',
          'الجرمانيوم والسيليكون',
          'المطاط في غلاف السلك',
        ],
        correct: 2,
        why: 'الجرمانيوم والسيليكون أشباه موصلات: مقاومتهما بين الموصل والعازل، ويتحولان إلى التوصيل عند ظروف معينة. النحاس موصل، والخزف والمطاط عازلان.',
        unit: 'u1',
        concept: 'material-classes',
      },
      {
        t: 'mc',
        q: 'قضيب مغناطيسي كُسر إلى نصفين. ماذا نملك الآن؟',
        opts: [
          'قطعة شمالية وقطعة جنوبية منفصلتان تمامًا',
          'مغناطيسان لكل منهما قطبان شمالي وجنوبي',
          'قطعتان فقدتا خاصية المغنطة نهائيًا',
          'مغناطيس واحد وقطعة حديد غير ممغنطة',
        ],
        correct: 1,
        why: 'كسر المغناطيس لا يفصل القطبين أبدًا: يظهر مغناطيسان لكل منهما قطب شمالي وقطب جنوبي، ويمكن تكرار الكسر إلى مغناطيسات كثيرة.',
        unit: 'u1',
        concept: 'magnetic-flux',
      },
      {
        t: 'mc',
        q: 'مقاومة <span class="ltr">100 Ω</span> هبوط الجهد عليها <span class="ltr">50 V</span>. كم التيار المار فيها؟',
        opts: [
          '<span class="ltr">0.5 A</span>',
          '<span class="ltr">2 A</span>',
          '<span class="ltr">5 A</span>',
          '<span class="ltr">5000 A</span>',
        ],
        correct: 0,
        why: 'بصورة التيار من قانون أوم: I = V ÷ R = 50 ÷ 100 = 0.5 A، وهو مثال (1) في الحقيبة بأرقامه الأصلية.',
        unit: 'u1',
        concept: 'ohm-law',
      },
      {
        t: 'mc',
        q: 'سخّان يعمل على <span class="ltr">120 V</span> ويسحب <span class="ltr">3 A</span>. كم قدرته؟',
        opts: [
          '<span class="ltr">40 W</span>',
          '<span class="ltr">123 W</span>',
          '<span class="ltr">360 W</span>',
          '<span class="ltr">3600 W</span>',
        ],
        correct: 2,
        why: 'P = U × I = 120 × 3 = 360 W، وهو تمرين الحقيبة رقم (8) في فصل حسابات أساسيات الكهرباء.',
        unit: 'u1',
        concept: 'electric-power',
      },
      {
        t: 'mc',
        q: 'ثلاثة مكثفات <span class="ltr">10 µF</span> موصولة على التوالي. كم السعة المكافئة؟',
        opts: [
          '<span class="ltr">30 µF</span>',
          '<span class="ltr">3.33 µF</span>',
          '<span class="ltr">10 µF</span>',
          '<span class="ltr">1000 µF</span>',
        ],
        correct: 1,
        why: 'في التوالي: 1/C_T = 1/10 + 1/10 + 1/10 = 3/10 فتكون C_T = 3.33 µF. قاعدة المكثفات معكوسة عن المقاومات، والسعة الكلية أصغر من أي سعة مفردة.',
        unit: 'u1',
        concept: 'capacitance',
      },
    ],
  },

  // ---- نقطة تفتيش الدرس 1.1 ----
  u1l1check: {
    title: 'نقطة تفتيش: الذرة والتيار وأنواعه',
    questions: [
      {
        t: 'mc',
        q: 'منحنى جهد يبدأ من الصفر ويرتفع إلى <span class="ltr">+200 V</span> ثم يهبط إلى <span class="ltr">−200 V</span> ويعود. ما نوعه؟',
        opts: [
          'تيار مستمر ثابت القيمة والاتجاه',
          'تيار متردد يعكس اتجاهه كل نصف دورة',
          'تيار مستمر تعرّض لهبوط جهد على الحمل',
          'تيار مستمر مقطوع بمفتاح يفتح ويغلق بانتظام',
        ],
        correct: 1,
        why: 'عبور الصفر إلى القيم السالبة يعني انعكاس الاتجاه، وهذا تعريف التيار المتردد AC. أما DC فيبقى في جهة واحدة من محور الزمن.',
        unit: 'u1',
        concept: 'dc-ac',
      },
      {
        t: 'mc',
        q: 'ما الذي يكافئه الأمبير الواحد؟',
        opts: [
          'مرور <span class="ltr">6.25×10¹⁸</span> إلكترون خلال المقطع في الثانية',
          'شحنة إلكترون واحد خلال دقيقة كاملة',
          'جهد قدره فولت واحد على مقاومة كبيرة',
          'قدرة قدرها واط واحد خلال ثانية واحدة',
        ],
        correct: 0,
        why: 'التعريف الوارد في الحقيبة: الأمبير هو مرور 6.25×10¹⁸ إلكترون خلال مقطع الموصل في الثانية الواحدة — أي معدل تدفق شحنة لا مقدار شحنة ولا جهد.',
        unit: 'u1',
        concept: 'electric-current',
      },
      {
        t: 'mc',
        q: 'أردت عزل طرفَي سلك مكشوف في لوحة الآلة. أي مادة تختار؟',
        opts: [
          'الألمنيوم',
          'المطاط',
          'الزئبق',
          'الجرمانيوم',
        ],
        correct: 1,
        why: 'المطاط عازل يمنع مرور التيار، ولهذا يُستخدم في أغلفة الأسلاك. الألمنيوم والزئبق موصلان، والجرمانيوم شبه موصل يوصّل عند ظروف معينة.',
        unit: 'u1',
        concept: 'material-classes',
      },
      {
        t: 'mc',
        q: 'كم يساوي <span class="ltr">27 kΩ</span> بوحدة الأوم؟',
        opts: [
          '<span class="ltr">2700 Ω</span>',
          '<span class="ltr">27000 Ω</span>',
          '<span class="ltr">270000 Ω</span>',
          '<span class="ltr">0.027 Ω</span>',
        ],
        correct: 1,
        why: 'كيلو تعني ×10³، فتكون 27 kΩ = 27 × 1000 = 27000 Ω. وضبط قوة العشرة قبل التعويض شرط لكل حساب في هذه الوحدة.',
        unit: 'u1',
        concept: 'electric-current',
      },
    ],
  },

  // ---- نقطة تفتيش الدرس 1.2 ----
  u1l2check: {
    title: 'نقطة تفتيش: المغناطيسية والحث',
    questions: [
      {
        t: 'mc',
        q: 'ما اتجاه خطوط المجال المغناطيسي خارج قضيب المغناطيس؟',
        opts: [
          'من القطب الشمالي إلى القطب الجنوبي',
          'من القطب الجنوبي إلى القطب الشمالي',
          'من القطبين معًا نحو منطقة الخمود',
          'دوائر مغلقة حول محور القضيب فقط',
        ],
        correct: 0,
        why: 'خارج المغناطيس تخرج الخطوط من الشمالي N وتدخل الجنوبي S، وداخله تتجه من S إلى N فتكتمل الحلقة المغلقة.',
        unit: 'u1',
        concept: 'magnetic-flux',
      },
      {
        t: 'mc',
        q: 'ملف حلزوني ضعيف الجذب. أي تغيير لا يزيد قوته؟',
        opts: [
          'زيادة عدد اللفات على القلب',
          'رفع شدة التيار المار في الملف',
          'إدخال قلب من الحديد بدل الهواء',
          'طلاء سطح الملف بمادة عازلة أسمك',
        ],
        correct: 3,
        why: 'عوامل قوة المغناطيس الكهربائي أربعة: شدة التيار، وعدد اللفات، وطول الملف، ونوع القلب. أما طلاء العزل الخارجي فلا يغيّر الفيض المتولد إطلاقًا.',
        unit: 'u1',
        concept: 'electromagnet',
      },
      {
        t: 'mc',
        q: 'مغناطيس قوي ساكن تمامًا داخل ملف ساكن. كم القوة الدافعة الحثية؟',
        opts: [
          'تساوي <span class="ltr">0 V</span> لأن الفيض ثابت لا يتغير',
          'قيمة كبيرة تتناسب مع قوة المغناطيس',
          'قيمة صغيرة تعتمد على عدد لفات الملف',
          'قيمة متزايدة مع طول مدة بقاء المغناطيس',
        ],
        correct: 0,
        why: 'قانون فاراداي: e = N × ΔΦ/Δt. إذا لم يتغير الفيض مع الزمن كان المقدار صفرًا مهما كانت قوة المغناطيس أو عدد اللفات.',
        unit: 'u1',
        concept: 'faraday-law',
      },
      {
        t: 'tf',
        q: 'حسب قانون لينز تتخذ القوة الدافعة الحثية اتجاهًا يعارض التغيّر في الفيض الأصلي.',
        correct: true,
        why: 'صحيح. ولهذا ينعكس انحراف الجلفانوميتر عند عكس اتجاه حركة المغناطيس داخل الملف — وهو أساس الكبح الكهربائي في الآلات.',
        unit: 'u1',
        concept: 'faraday-law',
      },
    ],
  },

  // ---- نقطة تفتيش الدرس 1.3 ----
  u1l3check: {
    title: 'نقطة تفتيش: أوم والقدرة والكفاية',
    questions: [
      {
        t: 'mc',
        q: 'هبوط الجهد على مقاومة <span class="ltr">150 mV</span> والتيار <span class="ltr">75 µA</span>. كم قيمتها؟',
        opts: [
          '<span class="ltr">2 Ω</span>',
          '<span class="ltr">2 kΩ</span>',
          '<span class="ltr">2 MΩ</span>',
          '<span class="ltr">0.5 kΩ</span>',
        ],
        correct: 1,
        why: 'R = V ÷ I = (150×10⁻³) ÷ (75×10⁻⁶) = 2×10³ Ω = 2 kΩ، وهو مثال (2) في الحقيبة. أهم خطوة فيه تحويل mV وµA قبل القسمة.',
        unit: 'u1',
        concept: 'ohm-law',
      },
      {
        t: 'mc',
        q: 'مقاومة <span class="ltr">10 Ω</span> يمر بها <span class="ltr">1.4 A</span>. كم القدرة المستهلكة فيها؟',
        opts: [
          '<span class="ltr">14 W</span>',
          '<span class="ltr">4.9 W</span>',
          '<span class="ltr">19.6 W</span>',
          '<span class="ltr">44.1 W</span>',
        ],
        correct: 2,
        why: 'P = I² × R = (1.4)² × 10 = 19.6 W، وهو الفرع (ب) من مثال (7). لاحظ أن مضاعفة التيار من 0.7 إلى 1.4 ضاعفت القدرة أربع مرات.',
        unit: 'u1',
        concept: 'electric-power',
      },
      {
        t: 'mc',
        q: 'مقاومة <span class="ltr">27 kΩ</span> يمر بها <span class="ltr">3 mA</span>. كم جهد المصدر؟',
        opts: [
          '<span class="ltr">81 V</span>',
          '<span class="ltr">9.1 V</span>',
          '<span class="ltr">810 V</span>',
          '<span class="ltr">0.81 V</span>',
        ],
        correct: 0,
        why: 'E = I × R = (3×10⁻³) × (27×10³) = 81 V، وهو مثال (5) في الحقيبة. تلاشي قوتَي العشرة معًا يجعل الحساب ذهنيًا بسيطًا.',
        unit: 'u1',
        concept: 'ohm-law',
      },
      {
        t: 'mc',
        q: 'جهاز داخلته <span class="ltr">1000 W</span> وخارجته <span class="ltr">850 W</span>. كم كفايته وقدرته المفقودة؟',
        opts: [
          'η = <span class="ltr">1.18</span> و P_L = <span class="ltr">150 W</span>',
          'η = <span class="ltr">0.85</span> و P_L = <span class="ltr">1850 W</span>',
          'η = <span class="ltr">0.85</span> و P_L = <span class="ltr">150 W</span>',
          'η = <span class="ltr">0.15</span> و P_L = <span class="ltr">850 W</span>',
        ],
        correct: 2,
        why: 'η = P₂ ÷ P₁ = 850 ÷ 1000 = 0.85 وهي أقل من الواحد دائمًا، و P_L = 1000 − 850 = 150 W تتحول حرارة واحتكاكًا داخل الجهاز.',
        unit: 'u1',
        concept: 'efficiency',
      },
    ],
  },

  // ---- نقطة تفتيش الدرس 1.4 ----
  u1l4check: {
    title: 'نقطة تفتيش: المقاومات والمكثفات',
    questions: [
      {
        t: 'mc',
        q: 'ما الإجراء الإلزامي قبل التعامل مع مكثف كيميائي كبير السعة؟',
        opts: [
          'قياس سعته بالأوميتر قبل فك أطرافه',
          'تفريغه بمقاومة <span class="ltr">1 kΩ</span> موصولة بين طرفيه',
          'عكس قطبيته لحظة ليفرغ شحنته المخزّنة',
          'تبريده بالهواء المضغوط قبل لمس أطرافه',
        ],
        correct: 1,
        why: 'المكثف يحتفظ بجهده دقائق أو أيامًا بعد فصل التغذية، فيُفرَّغ بمقاومة 1 kΩ بين الطرفين. وعكس قطبية المكثف المستقطب قد يفجّره.',
        unit: 'u1',
        concept: 'capacitance',
      },
      {
        t: 'mc',
        q: 'ضاعفنا المسافة بين لوحَي مكثف مع ثبات باقي العوامل. ماذا يحدث لسعته؟',
        opts: [
          'تتضاعف لأن الحيز بين اللوحين اتسع',
          'تنخفض إلى النصف تقريبًا',
          'تبقى ثابتة لأن المساحة لم تتغير',
          'ترتفع قليلًا ثم تعود لقيمتها',
        ],
        correct: 1,
        why: 'المسافة d في مقام علاقة السعة، فالتناسب عكسي: مضاعفة المسافة تنصّف السعة. أما مساحة الألواح وعددها وثابت العزل فتناسبها طردي.',
        unit: 'u1',
        concept: 'capacitance',
      },
      {
        t: 'mc',
        q: 'مقاومة <span class="ltr">10 kΩ</span> مع مكثف <span class="ltr">100 µF</span>. كم ثابت الزمن <span class="ltr">τ = R×C</span>؟',
        opts: [
          '<span class="ltr">0.1 s</span>',
          '<span class="ltr">1 s</span>',
          '<span class="ltr">10 s</span>',
          '<span class="ltr">100 s</span>',
        ],
        correct: 1,
        why: 'τ = R × C = (10×10³) × (100×10⁻⁶) = 1 s. وعند t = τ يبلغ جهد المكثف نحو 63% من جهد المصدر.',
        unit: 'u1',
        concept: 'rc-time-constant',
      },
      {
        t: 'tf',
        q: 'يعتبر شحن المكثف مكتملًا عمليًا بعد مرور خمسة ثوابت زمنية.',
        correct: true,
        why: 'صحيح. منحنى الشحن في الحقيبة يبلغ نحو 100% عند الخانة 5 على المحور الزمني، بينما يبدأ تيار الشحن أعظميًا ويؤول إلى الصفر.',
        unit: 'u1',
        concept: 'rc-time-constant',
      },
    ],
  },
};

// ================================================================
// أسئلة الوحدة الأولى في الاختبار التشخيصي الشامل
// ================================================================
export const U1_DIAG = [
  {
    t: 'mc',
    q: 'مقاومة <span class="ltr">10 kΩ</span> موصولة على بطارية <span class="ltr">12 V</span>. كم التيار؟',
    opts: [
      '<span class="ltr">1.2 mA</span>',
      '<span class="ltr">120 mA</span>',
      '<span class="ltr">0.83 A</span>',
      '<span class="ltr">120 kA</span>',
    ],
    correct: 0,
    why: 'I = V ÷ R = 12 ÷ 10000 = 0.0012 A = 1.2 mA، وهو تمرين الحقيبة الأول. مفتاحه تحويل kΩ إلى أوم قبل القسمة.',
    unit: 'u1',
    concept: 'ohm-law',
  },
  {
    t: 'mc',
    q: 'متى يتولد جهد على طرفَي ملف موضوع قرب مغناطيس؟',
    opts: [
      'عند تغيّر الفيض المار خلاله',
      'عند ثبات المغناطيس قريبًا جدًا منه',
      'عند تسخين قلب الملف لدرجة عالية',
      'عند زيادة مقاومة سلك الملف بإطالته',
    ],
    correct: 0,
    why: 'قانون فاراداي: القوة الدافعة الحثية تتولد من تغيّر الفيض مع الزمن (e = N × ΔΦ/Δt) — بحركة الموصل أو المغناطيس أو بتغيّر التيار المولّد للفيض.',
    unit: 'u1',
    concept: 'faraday-law',
  },
  {
    t: 'mc',
    q: 'مكثفان متساويان على التوالي. كيف تقارن سعتهما الكلية بسعة المكثف الواحد؟',
    opts: [
      'ضعف سعة المكثف الواحد',
      'نصف سعة المكثف الواحد',
      'مساوية لسعة المكثف الواحد',
      'أربعة أمثال سعة المكثف الواحد',
    ],
    correct: 1,
    why: 'في التوالي: 1/C_T = 1/C + 1/C = 2/C فتكون C_T = C/2، أي أصغر من أي سعة مفردة — عكس قاعدة المقاومات تمامًا.',
    unit: 'u1',
    concept: 'capacitance',
  },
];
