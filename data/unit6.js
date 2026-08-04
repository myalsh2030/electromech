// الوحدة السادسة: الدوائر الإلكترونية — مقرر «كهرباء وإلكترونيات الآلات الميكانيكية» (مصيم 221)
// ملف بيانات خالص (ES Module) بدون أي منطق.
// المصادر: تفريغات الحقيبة T_c26..T_c31 (ص 226–273) + course-map.md (بند 2 الوحدة السادسة، وبند 5 نقاط الفحص).
// وسوم concepts[] وحقول concept في الأسئلة منقولة حرفيًا من data/concepts.js.
// نصوص مهام المحاكيات منقولة حرفيًا من js/sims/registry.js.

export const UNIT6 = {
  id: 'u6',
  title: 'الدوائر الإلكترونية',
  icon: 'cpu',
  color: '#a78bfa',
  tagline: 'رقاقة بحجم ظفرك تكبّر وتوقّت وتعدّ — تعلّم كيف تقرأها وتقيسها',
  lessons: [
    // ------------------------------------------------------------
    // u6l1 — الدوائر المتكاملة وراسم الإشارة
    // concept / concept / figure / match / concept / formula / example / formula / example / sim / tip / quiz
    // ------------------------------------------------------------
    {
      id: 'u6l1',
      title: 'الدوائر المتكاملة وراسم الإشارة',
      minutes: 14,
      concepts: ['integrated-circuit', 'oscilloscope-reading'],
      blocks: [
        {
          t: 'concept',
          title: 'دائرة كاملة على شريحة أصغر من ظفرك',
          icon: '🔍',
          html: 'افتح أي لوحة تحكم حديثة: بدل عشرات الترانزستورات والمقاومات المتناثرة، ستجد مستطيلًا أسود صغيرًا بأرجل معدنية. إنه <span class="term">الدائرة المتكاملة <i>Integrated Circuit (IC)</i></span>: دايودات وترانزستورات ومقاومات ومكثفات مثبتة كلها على <b>شريحة سيليكون واحدة</b>. فوائدها: <ul><li>صغر الحجم وانخفاض التكلفة.</li><li>استهلاك قدرة منخفض وسرعة عالية.</li><li>تقليل وصلات الأسلاك الخارجية.</li></ul> وعيبها الذي يهم الفني: <b>لا يمكن فصل عنصر واحد منها ولا استبداله</b> — إذا تلفت، تُستبدل الرقاقة كلها.',
        },
        {
          t: 'concept',
          title: 'خطية أم رقمية؟ وكم بوابة بداخلها؟',
          icon: '🔷',
          html: 'تُصنَّف الدوائر المتكاملة بطريقتين: <ul><li>حسب <b>طبيعة العمل</b>: <span class="term">خطية <i>Linear</i></span> تتعامل مع إشارة متصلة (مكبرات ومقارنات ومنظمات ومؤقتات)، و<span class="term">رقمية <i>Digital</i></span> تتعامل مع إشارة ثنائية الحالة (بوابات وعدادات وذاكرات).</li><li>حسب <b>مقياس التكامل</b> (جدول ٧-١): <span class="ltr">SSI 1–10</span> بوابة، <span class="ltr">MSI 10–100</span>، <span class="ltr">LSI 100–1000</span>، <span class="ltr">VLSI 1000–10000</span>، <span class="ltr">SLSI 10000–100000</span>.</li></ul> والترميز يدل على العائلة: <span class="ltr">TTL</span> بـ<span class="ltr">74XXX</span> للاستخدام الصناعي و<span class="ltr">54XXX</span> للمدى الحراري الواسع، و<span class="ltr">ECL</span> بـ<span class="ltr">10XXX</span> للسرعات العالية، و<span class="ltr">CMOS</span> بـ<span class="ltr">40XX</span> للقدرة المنخفضة.',
        },
        {
          t: 'figure',
          caption: 'حزمة DIP: نقطة الدليل (أو الحزّ) تحدد الطرف رقم 1، ثم يمضي الترقيم بعكس عقارب الساعة',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="200" y="24" text-anchor="middle" fill="var(--c-text)" font-size="15" font-weight="bold">ترقيم أطراف الدائرة المتكاملة</text><rect x="150" y="45" width="100" height="170" rx="8" fill="none" stroke="var(--c-text2)" stroke-width="2"/><path d="M188 45 a12 12 0 0 0 24 0" fill="none" stroke="var(--c-water)" stroke-width="2"/><circle cx="166" cy="66" r="5" fill="var(--c-water)"/><g fill="var(--c-text2)"><rect x="126" y="72" width="24" height="9" rx="2"/><rect x="126" y="110" width="24" height="9" rx="2"/><rect x="126" y="148" width="24" height="9" rx="2"/><rect x="126" y="186" width="24" height="9" rx="2"/><rect x="250" y="72" width="24" height="9" rx="2"/><rect x="250" y="110" width="24" height="9" rx="2"/><rect x="250" y="148" width="24" height="9" rx="2"/><rect x="250" y="186" width="24" height="9" rx="2"/></g><g fill="var(--c-text)" font-size="13" font-weight="bold"><text x="160" y="82">1</text><text x="160" y="120">2</text><text x="160" y="158">3</text><text x="160" y="196">4</text><text x="234" y="82">8</text><text x="234" y="120">7</text><text x="234" y="158">6</text><text x="234" y="196">5</text></g><path d="M118 78 L108 78 L108 200 L118 200" fill="none" stroke="var(--c-water2)" stroke-width="2"/><path d="M282 200 L292 200 L292 78 L282 78" fill="none" stroke="var(--c-water2)" stroke-width="2"/><path d="M282 78 l8 0 l-4 -7 z" fill="var(--c-water2)"/><text x="66" y="140" text-anchor="middle" fill="var(--c-water2)" font-size="12">اتجاه العدّ</text><text x="334" y="140" text-anchor="middle" fill="var(--c-water2)" font-size="12">عكس عقارب</text><text x="334" y="156" text-anchor="middle" fill="var(--c-water2)" font-size="12">الساعة</text><text x="200" y="240" text-anchor="middle" fill="var(--c-text2)" font-size="12">نقطة الدليل ⟵ الطرف رقم 1</text></svg>',
        },
        {
          t: 'match',
          title: 'وصّل رقم الرقاقة بعائلتها أو وظيفتها',
          pairs: [
            { a: '<span class="ltr">74LS04</span>', b: 'عائلة <span class="ltr">TTL</span> بقدرة منخفضة شوتكي' },
            { a: '<span class="ltr">10107</span>', b: 'عائلة <span class="ltr">ECL</span> للسرعات العالية' },
            { a: '<span class="ltr">4050</span>', b: 'عائلة <span class="ltr">CMOS</span> قليلة استهلاك القدرة' },
            { a: '<span class="ltr">741</span>', b: 'مكبر تشغيل' },
            { a: '<span class="ltr">555</span>', b: 'مؤقت زمني' },
          ],
        },
        {
          t: 'concept',
          title: 'شاشة تريك شكل الإشارة لا رقمها فقط',
          icon: '💡',
          html: '<span class="term">راسم الإشارة <i>Oscilloscope</i></span> يرسم بيانيًا الجهد مع الزمن: <b>المحور الرأسي جهد</b> وفيه <span class="ltr">8</span> مربعات، و<b>المحور الأفقي زمن</b> وفيه <span class="ltr">10</span> مربعات، وضلع كل مربع <span class="ltr">1 cm</span>. تضبط قيمة المربع بمفتاحين: <span class="ltr">VOLT/DIV</span> للجهد و<span class="ltr">TIME/DIV</span> للزمن. ومفتاح الاقتران يعطيك <span class="ltr">AC</span> و<span class="ltr">DC</span> و<span class="ltr">GND</span> — ووضع <span class="ltr">GND</span> هو الذي يحدد لك <b>خط الصفر</b> قبل أي قياس.',
        },
        {
          t: 'formula',
          name: 'قراءة الجهد من الشاشة',
          expr: 'V = عدد المربعات الرأسية × VOLT/DIV',
          terms: [
            { sym: 'V<sub>p-p</sub>', ar: 'جهد الموجة من القاع إلى القمة', unit: 'V' },
            { sym: 'عدد المربعات الرأسية', ar: 'ارتفاع الموجة من القاع إلى القمة', unit: 'مربع' },
            { sym: 'VOLT/DIV', ar: 'قيمة المربع الواحد على محور الجهد', unit: 'V/div' },
          ],
          note: 'لا تنسَ: تغيير مفتاح <span class="ltr">VOLT/DIV</span> لا يغيّر الإشارة، بل يغيّر مقياس الرسم فقط. هذه القراءة قمة-لقمة؛ القيمة القمّية نصفها.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة: نفس الموجة ومفتاحان مختلفان',
          given: ['ارتفاع الموجة على الشاشة = <span class="ltr">4</span> مربعات', 'الحالة الأولى: <span class="ltr">VOLT/DIV = 2 V</span>، والحالة الثانية: <span class="ltr">VOLT/DIV = 5 V</span>'],
          steps: [
            'الحالة الأولى: <span class="ltr">V = 4 × 2 = 8 V</span>',
            'الحالة الثانية: <span class="ltr">V = 4 × 5 = 20 V</span>',
          ],
          answer: '<span class="ltr">8 V</span> ثم <span class="ltr">20 V</span> — الموجة واحدة، والقراءة تتبع مفتاح العيار.',
        },
        {
          t: 'formula',
          name: 'قراءة الزمن والتردد من الشاشة',
          expr: 'T = عدد المربعات الأفقية × TIME/DIV',
          terms: [
            { sym: 'T', ar: 'زمن الدورة الكاملة', unit: 's' },
            { sym: 'عدد المربعات الأفقية', ar: 'عرض دورة كاملة واحدة', unit: 'مربع' },
            { sym: 'TIME/DIV', ar: 'قيمة المربع الواحد على محور الزمن', unit: 's/div' },
          ],
          note: 'ومن الزمن الدوري نحصل على التردد مباشرة: <span class="ltr">f = 1 / T</span> بالهرتز.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة: من عرض الموجة إلى ترددها',
          given: ['دورة كاملة تشغل <span class="ltr">4</span> مربعات أفقية', '<span class="ltr">TIME/DIV = 0.2 s</span>'],
          steps: [
            'زمن الدورة: <span class="ltr">T = 4 × 0.2 = 0.8 s</span>',
            'التردد: <span class="ltr">f = 1 ÷ 0.8 = 1.25 Hz</span>',
          ],
          answer: '<span class="ltr">T = 0.8 s</span> و<span class="ltr">f = 1.25 Hz</span> — موجة بطيئة جدًا تُرى بالعين على الشاشة.',
        },
        {
          t: 'sim',
          sim: 'sim-oscilloscope',
          title: 'أوسيليسكوب افتراضي بقناتين',
          desc: 'شبكة ‎8×10 ومولد موجات ومفاتيح VOLT/DIV وTIME/DIV: قِس السعة والزمن والتردد من الشاشة',
          missions: [
            { id: 'm1', text: 'اضبط الجهاز ليعرض ارتفاع <span class="ltr">4</span> مربعات عند <span class="ltr">2 V/div</span> ⟵ <span class="ltr">V=8 V ±2%</span>' },
            { id: 'm2', text: 'اضبط الجهاز ليعرض دورة كاملة في <span class="ltr">4</span> مربعات عند <span class="ltr">0.2 s/div</span> ⟵ <span class="ltr">T=0.8 s</span> و<span class="ltr">f=1.25 Hz ±2%</span>' },
            { id: 'm3', text: 'اضبط الجهاز لعرض دورتين كاملتين بالضبط لموجة <span class="ltr">50 Hz</span> ⟵ <span class="ltr">TIME/DIV = 4 ms</span>' },
            { id: 'm4', text: 'قِس موجة مجهولة وأدخل <span class="ltr">V</span> و<span class="ltr">f</span> بخطأ أقل من <span class="ltr">5%</span>' },
            { id: 'm5', text: 'استخدم وضع <span class="ltr">GND</span> لتحديد خط الصفر قبل القياس ثم بدّل إلى <span class="ltr">DC</span> وسجّل الإزاحة' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة 🛠: الدوائر المتكاملة تعمل في مدى حراري ضيق <span class="ltr">30–80 °C</span>. فإذا وجدت لوحة تحكم تفصل بعد ربع ساعة من التشغيل ثم تعمل بعد أن تبرد، فتّش عن <b>مروحة التبريد أو مرشّح الهواء المسدود</b> قبل أن تتهم الرقاقة. وعند القياس بالراسم: ثبّت مشبك الأرضي على أرضي الدائرة أولًا، ثم لامس نقطة القياس بالإبرة — العكس يعطيك موجة ضجيج مضللة.',
        },
        { t: 'quiz', ref: 'u6l1check' },
      ],
    },

    // ------------------------------------------------------------
    // u6l2 — مكبر التشغيل 741 وتطبيقاته
    // concept / concept / figure / formula / example / flip / concept / formula / example / sim / tip / quiz
    // ------------------------------------------------------------
    {
      id: 'u6l2',
      title: 'مكبر التشغيل 741',
      minutes: 14,
      concepts: ['opamp-741', 'inverting-amp'],
      blocks: [
        {
          t: 'concept',
          title: 'حساس يعطي 50 مللي فولت… ولا شيء يتحرك!',
          icon: '💡',
          html: 'حساس حرارة على محمل مضخة يعطي إشارة تتراوح من <span class="ltr">0</span> إلى <span class="ltr">50 mV</span>. لا ريليه ولا مؤشر يستجيب لهذا الجهد الضئيل. الحل هو <span class="term">مكبر التشغيل <i>Operational Amplifier</i></span>: عنصر له <b>دخلان وخرج واحد</b>، يأخذ الفرق بين الدخلين ويضربه في كسب هائل يبلغ نحو <span class="ltr">100000</span>. به تتحول ميللي الفولتات إلى فولتات تشغّل دائرة التحكم.',
        },
        {
          t: 'concept',
          title: 'دخل عاكس ودخل غير عاكس… وسقف اسمه التشبع',
          icon: '🔷',
          html: 'أحد الدخلين يعكس إشارة الجهد ويسمى <span class="term">الدخل العاكس <i>Inverting Input</i></span>، والآخر يبقيها على حالها ويسمى <span class="term">الدخل غير العاكس <i>Non-inverting Input</i></span>. ومواصفات <span class="ltr">741</span> التي يحفظها الفني: <ul><li>التغذية مزدوجة من <span class="ltr">±4 V</span> إلى <span class="ltr">±16 V</span>، والقدرة القصوى <span class="ltr">0.5 W</span>.</li><li>مقاومة الدخل عالية جدًا من <span class="ltr">2 MΩ</span> فأعلى، ومقاومة الخرج <span class="ltr">10–100 Ω</span>.</li><li><b>التشبع</b>: مهما زاد الدخل لا يتجاوز الخرج نحو <span class="ltr">80%</span> من جهد التغذية.</li></ul>',
        },
        {
          t: 'figure',
          caption: 'أطراف المكبر 741 الثمانية: 2 دخل عاكس، 3 غير عاكس، 6 خرج، 4 و7 التغذية',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="200" y="24" text-anchor="middle" fill="var(--c-text)" font-size="15" font-weight="bold">المكبر 741 — حزمة ثمانية أطراف</text><rect x="160" y="45" width="80" height="170" rx="8" fill="none" stroke="var(--c-badge)" stroke-width="2"/><path d="M188 45 a12 12 0 0 0 24 0" fill="none" stroke="var(--c-water)" stroke-width="2"/><path d="M182 105 L182 155 L222 130 Z" fill="none" stroke="var(--c-badge)" stroke-width="2"/><g fill="var(--c-text2)"><rect x="136" y="72" width="24" height="8" rx="2"/><rect x="136" y="110" width="24" height="8" rx="2"/><rect x="136" y="148" width="24" height="8" rx="2"/><rect x="136" y="186" width="24" height="8" rx="2"/><rect x="240" y="72" width="24" height="8" rx="2"/><rect x="240" y="110" width="24" height="8" rx="2"/><rect x="240" y="148" width="24" height="8" rx="2"/><rect x="240" y="186" width="24" height="8" rx="2"/></g><g fill="var(--c-text)" font-size="12" font-weight="bold"><text x="168" y="81">1</text><text x="168" y="119">2</text><text x="168" y="157">3</text><text x="168" y="195">4</text><text x="226" y="81">8</text><text x="226" y="119">7</text><text x="226" y="157">6</text><text x="226" y="195">5</text></g><g fill="var(--c-text2)" font-size="11" text-anchor="end"><text x="132" y="81">تحييد</text><text x="132" y="119">دخل عاكس</text><text x="132" y="157">دخل غير عاكس</text><text x="132" y="195">تغذية سالبة</text></g><g fill="var(--c-text2)" font-size="11" text-anchor="start"><text x="268" y="81">غير مستخدم</text><text x="268" y="119">تغذية موجبة</text><text x="268" y="157">الخرج</text><text x="268" y="195">تحييد</text></g><text x="200" y="240" text-anchor="middle" fill="var(--c-ok)" font-size="11">عكس الطرفين 4 و7 يحرق الرقاقة فورًا</text></svg>',
        },
        {
          t: 'formula',
          name: 'المكبر العاكس',
          expr: 'V<sub>out</sub> = − (R<sub>F</sub> / R<sub>in</sub>) × V<sub>in</sub>',
          terms: [
            { sym: 'V<sub>out</sub>', ar: 'جهد الخرج', unit: 'V' },
            { sym: 'V<sub>in</sub>', ar: 'جهد الدخل', unit: 'V' },
            { sym: 'R<sub>F</sub>', ar: 'مقاومة التغذية الراجعة بين الدخل العاكس والخرج', unit: 'Ω' },
            { sym: 'R<sub>in</sub>', ar: 'مقاومة الدخل بين الإشارة والدخل العاكس', unit: 'Ω' },
          ],
          note: 'الإشارة السالبة تعني أن <b>خرج هذه الدائرة معكوس الإشارة</b> عن دخلها. والكسب هو نسبة المقاومتين لا غير.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة: تكبير إشارة حساس حرارة',
          given: ['حساس حرارة جهده من <span class="ltr">0</span> إلى <span class="ltr">50 mV</span>', 'المطلوب خرج من <span class="ltr">0</span> إلى <span class="ltr">−5 V</span>'],
          steps: [
            'الكسب المطلوب: <span class="ltr">R<sub>F</sub> / R<sub>in</sub> = 5 ÷ 0.05 = 100</span>',
            'نختار <span class="ltr">R<sub>in</sub> = 1 kΩ</span>',
            'إذن: <span class="ltr">R<sub>F</sub> = 1 × 100 = 100 kΩ</span>',
          ],
          answer: '<span class="ltr">R<sub>in</sub> = 1 kΩ</span> و<span class="ltr">R<sub>F</sub> = 100 kΩ</span> — والخرج معكوس الإشارة كما تنص المعادلة.',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: أربع تشكيلات لنفس المكبر',
          cards: [
            { front: 'المقارن (Comparator)', back: 'يقارن دخلين بأقصى كسب: إن زاد الدخل غير العاكس تشبّع الخرج موجبًا فأنارت اللمبة. فرق <span class="ltr">0.12 mV</span> يكفي للتشبع عند تغذية <span class="ltr">15 V</span>.' },
            { front: 'مكبر الجمع (Summing)', back: 'يجمع جهدين أو أكثر جمعًا جبريًا مع عكس الإشارة، ولكل دخل مقاومته الخاصة فيمكن تكبير كل واحد بنسبة مستقلة.' },
            { front: 'المكبر التفاضلي (Differential)', back: 'يكبّر الفرق بين دخلين قيمتهما غير صفرية — ولهذا يلغي الضجيج المشترك بينهما.' },
            { front: 'تابع الجهد (Voltage Follower)', back: 'كسبه يساوي الواحد، ومقاومة دخله عالية جدًا وخرجه منخفضة جدًا. يستخدم حاجزًا بين المراحل لتقليل تأثير التحميل.' },
          ],
        },
        {
          t: 'concept',
          title: 'مكبر أجهزة القياس: ثلاثة مكبرات ومقاومة ضبط واحدة',
          icon: '🎯',
          html: '<span class="term">مكبر أجهزة القياس <i>Instrumentation Amplifier</i></span> هو مكبر تفاضلي بكسب عالٍ ومعاوقة دخل كبيرة، يتكون من <b>ثلاثة مكبرات تشغيل</b>: مرحلة أولى بمكبرين تعزل الحساس وتمنع سحب التيار منه، ومرحلة ثانية مكبر تفاضلي واحد. وميزته العملية أن <b>الكسب كله يُضبط بمقاومة خارجية واحدة</b> هي <span class="ltr">R<sub>e</sub></span> — فتغيّر حساسية جهاز القياس بتغيير مقاومة واحدة.',
        },
        {
          t: 'formula',
          name: 'كسب مكبر أجهزة القياس',
          expr: 'V<sub>out</sub> = [ (2R<sub>1</sub> + R<sub>e</sub>) / R<sub>e</sub> ] × [ R<sub>3</sub> / R<sub>2</sub> ] × (V<sub>2</sub> − V<sub>1</sub>)',
          terms: [
            { sym: 'V<sub>2</sub> − V<sub>1</sub>', ar: 'الفرق بين جهدَي الدخل', unit: 'V' },
            { sym: 'R<sub>1</sub>', ar: 'مقاومتا التغذية الراجعة في مرحلة الدخل', unit: 'Ω' },
            { sym: 'R<sub>e</sub>', ar: 'مقاومة ضبط الكسب الخارجية', unit: 'Ω' },
            { sym: 'R<sub>2</sub>, R<sub>3</sub>', ar: 'مقاومتا المرحلة التفاضلية', unit: 'Ω' },
          ],
          note: 'كلما <b>صغرت</b> <span class="ltr">R<sub>e</sub></span> ارتفع الكسب — ولهذا تخرج بقيم صغيرة جدًا عند الكسوب العالية.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة: مقاومة الضبط لكسب 1000',
          given: ['<span class="ltr">R<sub>1</sub> = R<sub>2</sub> = R<sub>3</sub> = 1 kΩ</span>', 'الكسب المطلوب = <span class="ltr">1000</span>'],
          steps: [
            'بما أن <span class="ltr">R<sub>3</sub>/R<sub>2</sub> = 1</span>: <span class="ltr">1000 = (2×1000 + R<sub>e</sub>) ÷ R<sub>e</sub></span>',
            'بالضرب في المقام: <span class="ltr">1000 R<sub>e</sub> = 2000 + R<sub>e</sub></span>',
            'إذن: <span class="ltr">R<sub>e</sub> = 2000 ÷ 999 = 2.002 Ω</span>',
          ],
          answer: '<span class="ltr">R<sub>e</sub> = 2.002 Ω</span> — مقاومة صغيرة جدًا، فاحذر مقاومة أطراف اللحام لأنها تُحسب ضمنها.',
        },
        {
          t: 'sim',
          sim: 'sim-opamp-741',
          title: 'مقعد مكبر التشغيل 741',
          desc: 'ست تشكيلات (مقارن/عاكس/جامع/تفاضلي/تابع/مكبر أجهزة) مع عرض الخرج رقميًا وعلى راسم إشارة',
          missions: [
            { id: 'm1', text: 'مثال حساس الحرارة: كبّر <span class="ltr">0–50 mV</span> إلى <span class="ltr">0–(−5) V</span> ⟵ <span class="ltr">R_F/R_in = 100 ±2%</span> مع انعكاس الإشارة' },
            { id: 'm2', text: 'مكبر الأجهزة بكسب <span class="ltr">1000</span> عند <span class="ltr">R₁=R₂=R₃=1 kΩ</span> ⟵ <span class="ltr">R_e=2.002 Ω ±1%</span>' },
            { id: 'm3', text: 'تمرين (10): كسب <span class="ltr">500</span> عند <span class="ltr">R=2 kΩ</span> ⟵ احسب <span class="ltr">R_e</span> وتحقّق منه بخطأ <span class="ltr">±1%</span>' },
            { id: 'm4', text: 'المقارن: أثبت أن فرق دخل <span class="ltr">0.12 mV</span> عند كسب <span class="ltr">100000</span> يكفي للتشبع عند تغذية <span class="ltr">15 V</span>' },
            { id: 'm5', text: 'ارفع الدخل حتى القصّ وتحقّق من أن الخرج يتوقف عند <span class="ltr">80%</span> من جهد التغذية <span class="ltr">±2%</span>' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة ⚠: إذا وجدت خرج بطاقة تحكم ثابتًا عند <span class="ltr">+12 V</span> أو <span class="ltr">−12 V</span> ولا يتحرك مهما تغيّر الحساس، فالمكبر <b>في حالة تشبع</b> ولا يعني ذلك بالضرورة تلفه: افحص أولًا سلك الحساس (قطع في السلك يترك الدخل طليقًا فيتشبع الخرج)، ثم افحص مقاومة التغذية الراجعة <span class="ltr">R<sub>F</sub></span> — انفتاحها يجعل الكسب هائلًا فيتشبع الخرج دائمًا.',
        },
        { t: 'quiz', ref: 'u6l2check' },
      ],
    },

    // ------------------------------------------------------------
    // u6l3 — مصادر التغذية والمؤقت 555 والعدادات
    // concept / formula / concept / sim / concept / figure / formula / example / concept / sim / tip / quiz
    // ------------------------------------------------------------
    {
      id: 'u6l3',
      title: 'مصادر التغذية والمؤقت 555 والعدادات',
      minutes: 18,
      concepts: ['rectifier-halfwave', 'rectifier-fullwave', 'smoothing-ripple', 'voltage-regulator-ic', 'timer-555', 'digital-counter'],
      blocks: [
        {
          t: 'concept',
          title: 'من 220 فولت متردد إلى 12 فولت مستمر نظيف',
          icon: '📦',
          html: 'كل بطاقة تحكم في الآلة تحتاج تيارًا مستمرًا نظيفًا، والطريق إليه أربع محطات: <ul><li><b>المحول</b>: يخفض <span class="ltr">220 V</span> إلى الجهد المطلوب.</li><li><b>التوحيد</b>: <span class="term">نصف الموجة <i>Half-wave</i></span> يمرر نصف الدورة فقط ومتوسط خرجه <span class="ltr">0.318 V<sub>p</sub></span>، بينما <span class="term">القنطرة موجة كاملة <i>Bridge Rectifier</i></span> تقلب النصف السالب فيصير المتوسط <span class="ltr">0.636 V<sub>p</sub></span> وتردد الخرج ضعف تردد المصدر.</li><li><b>التنعيم</b>: مكثف كبير يملأ الفجوات فيبقى تموج صغير.</li><li><b>التنظيم</b>: رقاقة تثبّت الجهد مهما تغيّر الحمل.</li></ul>',
        },
        {
          t: 'formula',
          name: 'معامل التموج',
          expr: 'معامل التموج = V<sub>r</sub> / V<sub>ol</sub>',
          terms: [
            { sym: 'V<sub>r</sub>', ar: 'جهد التموج المتردد المركّب على الخرج', unit: 'V' },
            { sym: 'V<sub>ol</sub>', ar: 'جهد الخرج عند الحمل الكامل', unit: 'V' },
          ],
          note: 'ومن نفس القراءتين: <span class="ltr">تنظيم الحمل = (V<sub>on</sub> − V<sub>ol</sub>) ÷ V<sub>ol</sub> × 100</span>، و<span class="ltr">معاوقة الخرج = (V<sub>on</sub> − V<sub>ol</sub>) ÷ I<sub>ol</sub></span>، حيث <span class="ltr">V<sub>on</sub></span> جهد الخرج بلا حمل.',
        },
        {
          t: 'concept',
          title: 'منظّم الجهد: ثلاثة أرجل تحل مشكلة كاملة',
          icon: '🔷',
          html: '<span class="term">منظم الجهد <i>Voltage Regulator IC</i></span> رقاقة تثبّت الجهد مع تغيّر الحمل: <ul><li><span class="ltr">78XX</span> للجهد الموجب و<span class="ltr">79XX</span> للسالب، و<span class="ltr">XX</span> هي قيمة الخرج (<span class="ltr">7812</span> يعطي <span class="ltr">12 V</span>).</li><li><span class="ltr">LM317</span> منظّم متغير يغطي <span class="ltr">1.2–30 V</span> وحتى <span class="ltr">1.5 A</span>.</li></ul> <b>قاعدة إلزامية</b>: جهد الدخل غير المنظّم يجب أن يزيد عن جهد الخرج بما لا يقل عن <span class="ltr">3 V</span>. ومواصفات مغذٍّ نمطي جيد: خرج <span class="ltr">2–24 V</span>، تيار حتى <span class="ltr">2 A</span>، معاوقة خرج أقل من <span class="ltr">0.1 Ω</span>، تنظيم أفضل من <span class="ltr">0.5%</span>، وتموج أقل من <span class="ltr">10 mV</span>.',
        },
        {
          t: 'sim',
          sim: 'sim-rectifier',
          title: 'دائرة التوحيد والتنعيم',
          desc: 'نصف موجة وموجة كاملة وثلاثي الأوجه مع مكثف تنعيم: اقرأ الموجتين وقِس التموج والكفاءة',
          missions: [
            { id: 'm1', text: 'عند <span class="ltr">15 V</span> بلا مكثف: تحقّق من أن تردد خرج نصف الموجة = تردد المصدر، والموجة الكاملة = ضعفه، وثلاثي الأوجه = ثلاثة أمثاله بخطأ <span class="ltr">±2%</span>' },
            { id: 'm2', text: 'قارن <span class="ltr">V_o</span> المقاس بالمحسوب: <span class="ltr">0.318 V_p</span> لنصف الموجة و<span class="ltr">0.636 V_p</span> للموجة الكاملة بخطأ <span class="ltr">±5%</span>' },
            { id: 'm3', text: 'أضف <span class="ltr">4.7</span> ثم <span class="ltr">100</span> ثم <span class="ltr">470 µF</span> وسجّل تناقص جهد التموج <span class="ltr">V_r</span> تناقصًا صارمًا' },
            { id: 'm4', text: 'اعكس دايودًا واحدًا في القنطرة وسجّل تغيّر شكل الخرج وهبوط <span class="ltr">V_o</span>' },
            { id: 'm5', text: 'اقصر أطراف دايود وتحقّق من ظهور إنذار تيار القصر' },
          ],
        },
        {
          t: 'concept',
          title: 'المؤقت 555: ثمانية أطراف تصنع كل نبضة تحتاجها',
          icon: '🔍',
          html: '<span class="term">المؤقت <i>555 Timer</i></span> من أشهر الرقائق منذ السبعينات، يعمل بتغذية <span class="ltr">5–18 V</span> وأطرافه الثمانية: <span class="ltr">1</span> أرضي، <span class="ltr">2</span> قدح، <span class="ltr">3</span> خرج، <span class="ltr">4</span> إعادة ضبط، <span class="ltr">5</span> جهد تحكم، <span class="ltr">6</span> عتبة، <span class="ltr">7</span> تفريغ، <span class="ltr">8</span> تغذية. بداخله مجزئ جهد يصنع عتبتين عند <span class="ltr">2V<sub>CC</sub>/3</span> و<span class="ltr">V<sub>CC</sub>/3</span>، ومقارنان وقلّاب. وله وضعان: <b>غير مستقر</b> يولّد نبضات متتالية، و<b>وحيد الاستقرار</b> يخرج نبضة واحدة عند القدح. وعمليًا يوصَل مكثف <span class="ltr">0.01 µF</span> بين الطرف <span class="ltr">5</span> والأرضي لتثبيت جهد التحكم.',
        },
        {
          t: 'figure',
          caption: 'تشكيلة 555 غير المستقرة: R_A وR_B وC تحدد زمن بقاء الخرج مرتفعًا T₁ وزمن بقائه منخفضًا T₂',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><line x1="30" y1="32" x2="370" y2="32" stroke="var(--c-water)" stroke-width="2"/><text x="20" y="28" fill="var(--c-water)" font-size="11">Vcc</text><line x1="30" y1="228" x2="370" y2="228" stroke="var(--c-text2)" stroke-width="2"/><text x="20" y="242" fill="var(--c-text2)" font-size="11">0V</text><rect x="120" y="90" width="90" height="90" rx="6" fill="none" stroke="var(--c-badge)" stroke-width="2"/><text x="165" y="140" text-anchor="middle" fill="var(--c-badge)" font-size="18" font-weight="bold">555</text><line x1="65" y1="32" x2="65" y2="52" stroke="var(--c-text2)" stroke-width="2"/><rect x="53" y="52" width="24" height="30" fill="none" stroke="var(--c-text)" stroke-width="2"/><line x1="65" y1="82" x2="65" y2="100" stroke="var(--c-text2)" stroke-width="2"/><line x1="65" y1="100" x2="120" y2="100" stroke="var(--c-text2)" stroke-width="2"/><text x="92" y="70" fill="var(--c-text)" font-size="12">RA</text><line x1="65" y1="100" x2="65" y2="120" stroke="var(--c-text2)" stroke-width="2"/><rect x="53" y="120" width="24" height="30" fill="none" stroke="var(--c-text)" stroke-width="2"/><line x1="65" y1="150" x2="65" y2="165" stroke="var(--c-text2)" stroke-width="2"/><line x1="65" y1="165" x2="120" y2="165" stroke="var(--c-text2)" stroke-width="2"/><text x="92" y="138" fill="var(--c-text)" font-size="12">RB</text><line x1="65" y1="165" x2="65" y2="190" stroke="var(--c-text2)" stroke-width="2"/><line x1="48" y1="190" x2="82" y2="190" stroke="var(--c-text)" stroke-width="2"/><line x1="48" y1="199" x2="82" y2="199" stroke="var(--c-text)" stroke-width="2"/><line x1="65" y1="199" x2="65" y2="228" stroke="var(--c-text2)" stroke-width="2"/><text x="92" y="199" fill="var(--c-text)" font-size="12">C</text><line x1="190" y1="90" x2="190" y2="32" stroke="var(--c-text2)" stroke-width="2"/><line x1="140" y1="180" x2="140" y2="228" stroke="var(--c-text2)" stroke-width="2"/><g fill="var(--c-text2)" font-size="10"><text x="126" y="96">7</text><text x="126" y="161">6/2</text><text x="196" y="102">8</text><text x="144" y="176">1</text><text x="200" y="118">3</text></g><line x1="210" y1="122" x2="250" y2="122" stroke="var(--c-ok)" stroke-width="2"/><path d="M255 140 L255 100 L285 100 L285 140 L300 140 L300 100 L330 100 L330 140 L345 140 L345 100 L370 100" fill="none" stroke="var(--c-ok)" stroke-width="2"/><text x="270" y="92" text-anchor="middle" fill="var(--c-ok)" font-size="11">T1</text><text x="292" y="156" text-anchor="middle" fill="var(--c-ok)" font-size="11">T2</text><text x="312" y="180" text-anchor="middle" fill="var(--c-text2)" font-size="11">خرج الطرف 3</text></svg>',
        },
        {
          t: 'formula',
          name: 'تردد المؤقت 555 في الوضع غير المستقر',
          expr: 'f = 1.44 / [ (R<sub>A</sub> + 2R<sub>B</sub>) × C ]',
          terms: [
            { sym: 'f', ar: 'تردد النبضات الخارجة من الطرف 3', unit: 'Hz' },
            { sym: 'R<sub>A</sub>', ar: 'المقاومة بين التغذية وطرف التفريغ', unit: 'Ω' },
            { sym: 'R<sub>B</sub>', ar: 'المقاومة بين طرف التفريغ وطرف العتبة', unit: 'Ω' },
            { sym: 'C', ar: 'مكثف التوقيت', unit: 'F' },
          ],
          note: 'وزمنا النبضة: <span class="ltr">T₁ = 0.693 (R<sub>A</sub> + R<sub>B</sub>) C</span> و<span class="ltr">T₂ = 0.693 R<sub>B</sub> C</span> — ولأن <span class="ltr">T₁</span> أكبر من <span class="ltr">T₂</span> دائمًا لا يمكن الحصول على موجة مربعة تمامًا. أما الوضع وحيد الاستقرار فنبضته: <span class="ltr">T = 1.1 R C</span>.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة: مؤقت بتردد 50 c/s',
          given: ['التردد المطلوب <span class="ltr">f = 50 c/s</span>', 'الشرط: <span class="ltr">T₁</span> يساوي ضعف <span class="ltr">T₂</span>', 'نختار <span class="ltr">C = 1 µF</span>'],
          steps: [
            'من معادلة التردد: <span class="ltr">R<sub>A</sub> + 2R<sub>B</sub> = 1.44 ÷ (50 × 1×10⁻⁶) = 28.8 kΩ</span>',
            'من شرط الزمنين: <span class="ltr">T₁/T₂ = (R<sub>A</sub> + R<sub>B</sub>) ÷ R<sub>B</sub> = 2</span> ⟵ <span class="ltr">R<sub>A</sub> = R<sub>B</sub></span>',
            'بالتعويض: <span class="ltr">3R<sub>A</sub> = 28.8 kΩ</span>',
          ],
          answer: '<span class="ltr">R<sub>A</sub> = R<sub>B</sub> = 9.6 kΩ</span> عند <span class="ltr">C = 1 µF</span>.',
        },
        {
          t: 'concept',
          title: 'العدّاد: كيف تحصي النبضات وتعرضها رقمًا؟',
          icon: '🔢',
          html: 'في <span class="term">النظام الثنائي <i>Binary System</i></span> لا توجد إلا حالتان: <span class="ltr">0</span> و<span class="ltr">1</span>، وقيمة كل خانة ضعف التي قبلها. فالعدد <span class="ltr">1101</span> يساوي <span class="ltr">1 + 4 + 8 = 13</span>، وعدد بأربعة بت يغطي المدى <span class="ltr">0–15</span>. و<span class="term">العدّاد الثنائي <i>Binary Counter</i></span> يقسم الموجة الداخلة على <span class="ltr">2</span> ثم <span class="ltr">4</span> ثم <span class="ltr">8</span> ثم <span class="ltr">16</span> فيعطي المخارج <span class="ltr">A B C D</span>: عند النبضة السادسة تقرأ <span class="ltr">0110</span> وعند الثالثة عشرة <span class="ltr">1101</span>. ودائرة العد <span class="ltr">0–9</span> تكتمل هكذا: عدّاد <span class="ltr">4518</span> ⟵ محوّل شفرة <span class="ltr">4511</span> ⟵ مبين سباعي المقاطع عبر سبع مقاومات <span class="ltr">220 Ω</span>.',
        },
        {
          t: 'sim',
          sim: 'sim-555-counter',
          title: 'مختبر المؤقت 555 والعداد 0–9',
          desc: 'مؤقت 555 في الوضعين وحيد الاستقرار وغير المستقر يقود عدادًا ومبينًا سباعي المقاطع',
          missions: [
            { id: 'm1', text: 'أعِد مثال الحقيبة: <span class="ltr">f=50 c/s</span> و<span class="ltr">T₁=2T₂</span> عند <span class="ltr">C=1 µF</span> ⟵ <span class="ltr">R_A=R_B=9.6 kΩ ±5%</span>' },
            { id: 'm2', text: 'أعِد المثال وحيد الاستقرار: نبضة <span class="ltr">3 s</span> عند <span class="ltr">C=33 µF</span> ⟵ <span class="ltr">R=82.65 kΩ ±5%</span>' },
            { id: 'm3', text: 'تمرين (14): <span class="ltr">f=10 c/s</span> وزمن الفتح = <span class="ltr">3×</span> زمن الغلق ⟵ تحقّق من <span class="ltr">R_A=2R_B ±5%</span>' },
            { id: 'm4', text: 'اضبط الدائرة على <span class="ltr">1 Hz</span> بالضبط <span class="ltr">±2%</span> وراقب تقدّم العدّاد رقمًا كل ثانية' },
            { id: 'm5', text: 'شغّل نبضات متتالية وتحقّق من خرج العدّاد <span class="ltr">0110</span> عند النبضة <span class="ltr">6</span> و<span class="ltr">1101</span> عند النبضة <span class="ltr">13</span>' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة 👷: قبل لمس أي مغذٍّ فُصل عن الشبكة، <b>فرّغ مكثف التنعيم</b> — مكثف <span class="ltr">4700 µF</span> يبقى مشحونًا دقائق ويكفي لصعقة مؤلمة أو لإتلاف مجس الأفوميتر. وعلامة تشخيصية سريعة: إذا قرأ الأفوميتر جهدًا صحيحًا على الخرج بينما تظهر على الراسم موجة تموج كبيرة وتتصرف الآلة عشوائيًا، فالمشتبه الأول هو <b>مكثف التنعيم الجاف</b> لا منظّم الجهد.',
        },
        { t: 'quiz', ref: 'u6l3check' },
      ],
    },
  ],
};

// ================================================================
// بنوك أسئلة الوحدة السادسة
// ================================================================
export const U6_QUIZZES = {
  // الاختبار القبلي للوحدة — سؤالان لكل درس
  u6pre: {
    title: 'قبل الانطلاق: أين أنت من الدوائر الإلكترونية؟',
    questions: [
      {
        t: 'mc',
        q: 'موجة ارتفاعها <span class="ltr">4</span> مربعات ومفتاح <span class="ltr">VOLT/DIV</span> على <span class="ltr">5 V</span>. كم جهد الموجة؟',
        opts: ['<span class="ltr">20 V</span>', '<span class="ltr">1.25 V</span>', '<span class="ltr">9 V</span>'],
        correct: 0,
        why: 'الجهد = عدد المربعات الرأسية × قيمة المربع = <span class="ltr">4 × 5 = 20 V</span>. المفتاح يخبرك بقيمة المربع الواحد فقط، والباقي ضرب بسيط.',
        unit: 'u6',
        concept: 'oscilloscope-reading',
      },
      {
        t: 'mc',
        q: 'من أين يبدأ ترقيم أطراف الدائرة المتكاملة وفي أي اتجاه يمضي؟',
        opts: ['من نقطة الدليل وبعكس عقارب الساعة', 'من الطرف المقابل للدليل ومع عقارب الساعة', 'من أعلى يمين الحزمة ومع عقارب الساعة دائمًا'],
        correct: 0,
        why: 'نقطة الدليل (أو الحزّ) هي علامة المصنع للطرف رقم <span class="ltr">1</span>، ثم يتوالى العد بعكس عقارب الساعة حول الحزمة. تجاهل هذه القاعدة يعني توصيل التغذية مكان الخرج.',
        unit: 'u6',
        concept: 'integrated-circuit',
      },
      {
        t: 'tf',
        q: 'الدخل العاكس في المكبر <span class="ltr">741</span> عند الدبوس رقم <span class="ltr">2</span>، وخرجه عند الدبوس رقم <span class="ltr">6</span>.',
        correct: true,
        why: 'صحيح. ترتيب <span class="ltr">741</span>: الدخل العاكس <span class="ltr">2</span>، غير العاكس <span class="ltr">3</span>، الخرج <span class="ltr">6</span>، والتغذية السالبة <span class="ltr">4</span> والموجبة <span class="ltr">7</span>.',
        unit: 'u6',
        concept: 'opamp-741',
      },
      {
        t: 'mc',
        q: 'مكبر عاكس فيه <span class="ltr">R<sub>in</sub> = 1 kΩ</span> و<span class="ltr">R<sub>F</sub> = 100 kΩ</span>. كم كسبه وما إشارة خرجه؟',
        opts: ['الكسب <span class="ltr">100</span> والخرج معكوس الإشارة', 'الكسب <span class="ltr">101</span> والخرج بنفس إشارة الدخل', 'الكسب <span class="ltr">0.01</span> والخرج معكوس الإشارة'],
        correct: 0,
        why: 'الكسب هو نسبة المقاومتين: <span class="ltr">100 ÷ 1 = 100</span>، والإشارة السالبة في المعادلة تعني أن الخرج معكوس عن الدخل.',
        unit: 'u6',
        concept: 'inverting-amp',
      },
      {
        t: 'mc',
        q: 'في تشكيلة <span class="ltr">555</span> غير المستقرة، بأي علاقة يُحسب التردد؟',
        opts: ['<span class="ltr">f = 1.44 / ((R<sub>A</sub> + 2R<sub>B</sub>) × C)</span>', '<span class="ltr">f = 0.693 × R<sub>B</sub> × C</span>', '<span class="ltr">f = 1.1 × R × C</span>'],
        correct: 0,
        why: 'هذه هي معادلة التردد في الوضع غير المستقر. أما <span class="ltr">0.693 R<sub>B</sub> C</span> فهي زمن <span class="ltr">T₂</span>، و<span class="ltr">1.1 R C</span> فهي نبضة الوضع وحيد الاستقرار.',
        unit: 'u6',
        concept: 'timer-555',
      },
      {
        t: 'mc',
        q: 'مغذٍّ منظّم خرجه <span class="ltr">12 V</span>. ما أقل جهد دخل غير منظّم مقبول؟',
        opts: ['<span class="ltr">15 V</span>', '<span class="ltr">12.5 V</span>', '<span class="ltr">10.5 V</span>'],
        correct: 0,
        why: 'القاعدة: الدخل غير المنظّم يزيد عن الخرج بما لا يقل عن <span class="ltr">3 V</span>، أي <span class="ltr">12 + 3 = 15 V</span>. أقل من ذلك يفقد المنظّم قدرته على التثبيت فيظهر تموج على الخرج.',
        unit: 'u6',
        concept: 'voltage-regulator-ic',
      },
    ],
  },

  // نقطة تفتيش الدرس الأول
  u6l1check: {
    title: 'نقطة تفتيش: الدوائر المتكاملة وراسم الإشارة',
    questions: [
      {
        t: 'mc',
        q: 'دورة كاملة تشغل <span class="ltr">4</span> مربعات أفقية ومفتاح <span class="ltr">TIME/DIV</span> على <span class="ltr">0.2 s</span>. كم زمن الدورة وترددها؟',
        opts: ['<span class="ltr">T = 0.8 s</span> و<span class="ltr">f = 1.25 Hz</span>', '<span class="ltr">T = 0.05 s</span> و<span class="ltr">f = 20 Hz</span>', '<span class="ltr">T = 4.2 s</span> و<span class="ltr">f = 0.24 Hz</span>'],
        correct: 0,
        why: 'الزمن الدوري = عدد المربعات × قيمة المربع = <span class="ltr">4 × 0.2 = 0.8 s</span>، والتردد مقلوبه: <span class="ltr">1 ÷ 0.8 = 1.25 Hz</span>.',
        unit: 'u6',
        concept: 'oscilloscope-reading',
      },
      {
        t: 'mc',
        q: 'أي دائرة متكاملة تنتمي إلى عائلة <span class="ltr">CMOS</span> قليلة استهلاك القدرة؟',
        opts: ['<span class="ltr">4050</span>', '<span class="ltr">74LS04</span>', '<span class="ltr">10107</span>'],
        correct: 0,
        why: 'عائلة <span class="ltr">CMOS</span> تُرمّز بالمتسلسلة <span class="ltr">40XX</span>. أما <span class="ltr">74LS04</span> فهي <span class="ltr">TTL</span>، و<span class="ltr">10107</span> فهي <span class="ltr">ECL</span> عالية السرعة.',
        unit: 'u6',
        concept: 'integrated-circuit',
      },
      {
        t: 'mc',
        q: 'قبل قياس أي إشارة بالراسم، ما فائدة وضع مفتاح الاقتران على <span class="ltr">GND</span>؟',
        opts: ['تحديد موقع خط الصفر على الشاشة', 'تفريغ شحنة المجس قبل بدء القياس', 'رفع سعة الإشارة لتظهر أوضح'],
        correct: 0,
        why: 'وضع <span class="ltr">GND</span> يفصل الإشارة ويترك خطًا أفقيًا هو مستوى الصفر. بدون تحديده تكون كل قراءات الجهد منسوبة إلى مرجع مجهول.',
        unit: 'u6',
        concept: 'oscilloscope-reading',
      },
      {
        t: 'tf',
        q: 'يمكن استبدال ترانزستور تالف داخل دائرة متكاملة بلحام ترانزستور جديد مكانه.',
        correct: false,
        why: 'خطأ. عناصر الدائرة المتكاملة مصنّعة داخل شريحة السيليكون نفسها ولا يمكن الوصول إليها ولا فصلها — العلاج الوحيد هو استبدال الرقاقة كلها.',
        unit: 'u6',
        concept: 'integrated-circuit',
      },
    ],
  },

  // نقطة تفتيش الدرس الثاني
  u6l2check: {
    title: 'نقطة تفتيش: مكبر التشغيل 741',
    questions: [
      {
        t: 'mc',
        q: 'حساس ضغط خرجه <span class="ltr">50 mV</span> ونريد خرجًا قدره <span class="ltr">−5 V</span>. إذا اخترت <span class="ltr">R<sub>in</sub> = 1 kΩ</span> فكم تكون <span class="ltr">R<sub>F</sub></span>؟',
        opts: ['<span class="ltr">100 kΩ</span>', '<span class="ltr">10 kΩ</span>', '<span class="ltr">1 MΩ</span>'],
        correct: 0,
        why: 'الكسب المطلوب <span class="ltr">5 ÷ 0.05 = 100</span>، ومع <span class="ltr">R<sub>in</sub> = 1 kΩ</span> تكون <span class="ltr">R<sub>F</sub> = 1 × 100 = 100 kΩ</span>.',
        unit: 'u6',
        concept: 'inverting-amp',
      },
      {
        t: 'mc',
        q: 'عند تغذية المكبر <span class="ltr">741</span> بـ<span class="ltr">±15 V</span>، عند أي جهد يتشبع خرجه تقريبًا؟',
        opts: ['نحو <span class="ltr">±12 V</span> أي أغلب جهد التغذية', 'نحو <span class="ltr">±15 V</span> أي كامل جهد التغذية', 'نحو <span class="ltr">±7.5 V</span> أي نصف جهد التغذية'],
        correct: 0,
        why: 'جهد التشبع عمليًا نحو <span class="ltr">80%</span> من جهد التغذية: <span class="ltr">0.8 × 15 = 12 V</span>. لا يصل الخرج إلى جهد المنبع كاملًا مهما زاد الدخل.',
        unit: 'u6',
        concept: 'opamp-741',
      },
      {
        t: 'tf',
        q: 'مقاومة دخل المكبر <span class="ltr">741</span> عالية جدًا، ولهذا يُهمل التيار الذي يسحبه من الحساس.',
        correct: true,
        why: 'صحيح. مقاومة الدخل تبدأ من <span class="ltr">2 MΩ</span> وتزيد كثيرًا، فالتيار المسحوب ضئيل جدًا — وهذا ما يجعل المكبر لا يُحمّل الحساس ولا يشوّه إشارته.',
        unit: 'u6',
        concept: 'opamp-741',
      },
      {
        t: 'mc',
        q: 'مكبر أجهزة قياس فيه <span class="ltr">R₁ = R₂ = R₃ = 1 kΩ</span> والكسب المطلوب <span class="ltr">1000</span>. كم <span class="ltr">R<sub>e</sub></span>؟',
        opts: ['<span class="ltr">2.002 Ω</span>', '<span class="ltr">0.999 Ω</span>', '<span class="ltr">2000 Ω</span>'],
        correct: 0,
        why: 'من معادلة الكسب: <span class="ltr">1000 R<sub>e</sub> = 2000 + R<sub>e</sub></span> ومنها <span class="ltr">R<sub>e</sub> = 2000 ÷ 999 = 2.002 Ω</span>. كلما ارتفع الكسب صغرت مقاومة الضبط.',
        unit: 'u6',
        concept: 'opamp-741',
      },
    ],
  },

  // نقطة تفتيش الدرس الثالث
  u6l3check: {
    title: 'نقطة تفتيش: مصادر التغذية والمؤقت 555 والعدادات',
    questions: [
      {
        t: 'mc',
        q: 'مؤقت <span class="ltr">555</span> غير مستقر فيه <span class="ltr">R<sub>A</sub> = R<sub>B</sub> = 9.6 kΩ</span> و<span class="ltr">C = 1 µF</span>. كم التردد؟',
        opts: ['<span class="ltr">50 c/s</span>', '<span class="ltr">100 c/s</span>', '<span class="ltr">150 c/s</span>'],
        correct: 0,
        why: 'بالتعويض: <span class="ltr">R<sub>A</sub> + 2R<sub>B</sub> = 28.8 kΩ</span>، ومنها <span class="ltr">f = 1.44 ÷ (28800 × 1×10⁻⁶) = 50 c/s</span> — وهو مثال الحقيبة نفسه.',
        unit: 'u6',
        concept: 'timer-555',
      },
      {
        t: 'mc',
        q: 'نبضة وحيدة الاستقرار مدتها <span class="ltr">3 s</span> بمكثف <span class="ltr">33 µF</span>. كم قيمة المقاومة؟',
        opts: ['<span class="ltr">82.65 kΩ</span>', '<span class="ltr">90.90 kΩ</span>', '<span class="ltr">8.265 kΩ</span>'],
        correct: 0,
        why: 'من <span class="ltr">T = 1.1 R C</span>: <span class="ltr">R = 3 ÷ (1.1 × 33×10⁻⁶) = 82.65 kΩ</span>. انتبه لتحويل الميكروفاراد إلى فاراد قبل القسمة.',
        unit: 'u6',
        concept: 'timer-555',
      },
      {
        t: 'mc',
        q: 'ما القيمة العشرية للعدد الثنائي <span class="ltr">1110</span>؟',
        opts: ['<span class="ltr">14</span>', '<span class="ltr">11</span>', '<span class="ltr">28</span>'],
        correct: 0,
        why: 'الخانات من اليمين قيمها <span class="ltr">1, 2, 4, 8</span>: الخانة الأولى صفر، ثم <span class="ltr">2 + 4 + 8 = 14</span>.',
        unit: 'u6',
        concept: 'digital-counter',
      },
      {
        t: 'tf',
        q: 'زيادة سعة مكثف التنعيم على خرج الموحّد تقلّل جهد التموج.',
        correct: true,
        why: 'صحيح. المكثف الأكبر يحتفظ بشحنة أكبر فيملأ الفجوة بين قمتين بهبوط أقل، فيقلّ <span class="ltr">V<sub>r</sub></span> ويقلّ معه معامل التموج.',
        unit: 'u6',
        concept: 'smoothing-ripple',
      },
    ],
  },
};

// ================================================================
// أسئلة الوحدة السادسة في الاختبار التشخيصي الشامل
// ================================================================
export const U6_DIAG = [
  {
    t: 'mc',
    q: 'موجة ارتفاعها <span class="ltr">4</span> مربعات على شاشة الراسم ومفتاح الجهد على <span class="ltr">2 V</span> لكل مربع. كم جهد الموجة؟',
    opts: ['<span class="ltr">8 V</span>', '<span class="ltr">0.5 V</span>', '<span class="ltr">6 V</span>'],
    correct: 0,
    why: 'الجهد = عدد المربعات × قيمة المربع = <span class="ltr">4 × 2 = 8 V</span>. هذه القراءة هي أساس كل قياس على راسم الإشارة.',
    unit: 'u6',
    concept: 'oscilloscope-reading',
  },
  {
    t: 'mc',
    q: 'في المكبر <span class="ltr">741</span>، أي دبوس هو دبوس الخرج؟',
    opts: ['الدبوس <span class="ltr">6</span>', 'الدبوس <span class="ltr">3</span>', 'الدبوس <span class="ltr">2</span>'],
    correct: 0,
    why: 'الخرج عند الدبوس <span class="ltr">6</span>. أما <span class="ltr">2</span> فهو الدخل العاكس و<span class="ltr">3</span> الدخل غير العاكس — وخلطها يعني توصيل الحمل على مدخل.',
    unit: 'u6',
    concept: 'opamp-741',
  },
  {
    t: 'mc',
    q: 'وجدت على رقاقة في لوحة تحكم الرقم <span class="ltr">555</span>. ما وظيفتها؟',
    opts: ['مؤقت زمني يولّد النبضات', 'عدّاد ثنائي رباعي المقاطع', 'مكبر تشغيل للإشارات الصغيرة'],
    correct: 0,
    why: 'الرقم على الرقاقة يدل على وظيفتها: <span class="ltr">555</span> مؤقت زمني، و<span class="ltr">4024</span> عدّاد ثنائي، و<span class="ltr">741</span> مكبر تشغيل.',
    unit: 'u6',
    concept: 'timer-555',
  },
];
