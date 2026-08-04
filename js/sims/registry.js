// سجل المحاكيات: التعريف + المهام + التحميل الكسول
// 13 محاكاة للمنصة النظرية — المعرفات ونصوص المهام عقد إلزامي (SPEC.md بند 4، التفاصيل الرقمية في course-map.md بند 3).
// كل محاكٍ: js/sims/<id>.js يصدّر mount(container, ctx) ويعيد { destroy() }.
// concepts[]: معرّفات من data/concepts.js — بها يعرف المحقق أن المفهوم «يُتمرَّن».
export const SIMS = [
  {
    id: 'sim-ohm-power', icon: 'zap', unit: 'u1',
    title: 'مختبر أوم والقدرة',
    concepts: ['ohm-law', 'electric-power', 'efficiency', 'electric-current'],
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
    id: 'sim-capacitor-rc', icon: 'battery-charging', unit: 'u1',
    title: 'شحن وتفريغ المكثف',
    concepts: ['rc-time-constant', 'ohm-law', 'capacitance'],
    desc: 'بطارية ومفتاح تبديل ومقاومة ومكثف: تابع منحنيَي الجهد والتيار حتى خمسة ثوابت زمنية',
    missions: [
      { id: 'm1', text: 'تحقّق من بلوغ جهد المكثف <span class="ltr">63%</span> من جهد المصدر عند <span class="ltr">t=τ</span> بخطأ <span class="ltr">±2%</span>' },
      { id: 'm2', text: 'اختر <span class="ltr">R</span> و<span class="ltr">C</span> لزمن شحن كامل قدره <span class="ltr">5 s</span> ⟵ تحقّق من <span class="ltr">RC=1 s ±5%</span>' },
      { id: 'm3', text: 'أثبت أن تيار التفريغ معاكس لتيار الشحن (إشارة سالبة وقيمة ابتدائية <span class="ltr">E/R ±5%</span>)' },
      { id: 'm4', text: 'ضاعف <span class="ltr">C</span> عند ثبات <span class="ltr">R</span> وأثبت مضاعفة زمن بلوغ <span class="ltr">99%</span> (نسبة <span class="ltr">2.0±0.05</span>)' },
    ],
  },
  {
    id: 'sim-magnetic-field', icon: 'magnet', unit: 'u1',
    title: 'مصنع المغناطيس والحث بالحركة',
    concepts: ['faraday-law', 'magnetic-flux', 'electromagnet'],
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
    id: 'sim-series-parallel', icon: 'git-branch', unit: 'u2',
    title: 'مقعد التوالي والتوازي والمركّب',
    concepts: ['series-circuit', 'parallel-circuit', 'kvl', 'kcl', 'electric-power', 'voltage-divider', 'current-divider', 'series-parallel-network', 'open-short-fault'],
    desc: 'ثلاث مقاومات بنمط توصيل قابل للتبديل، أميتر لكل فرع وفولتميتر لكل عنصر مع تحقق آلي من كيرشوف',
    missions: [
      { id: 'm1', text: 'أعِد مثال التوالي (2): <span class="ltr">20 V</span> مع <span class="ltr">2/1/5 Ω</span> ⟵ <span class="ltr">I=2.5 A</span> و<span class="ltr">V=5/2.5/12.5 V</span> و<span class="ltr">P=50 W</span> بخطأ <span class="ltr">±2%</span>' },
      { id: 'm2', text: 'أعِد مثال التوازي (1): <span class="ltr">2∥4∥5 Ω</span> ⟵ <span class="ltr">G_T=0.95 S</span> و<span class="ltr">R_T=1.053 Ω ±2%</span>' },
      { id: 'm3', text: 'أعِد المثال المركّب: <span class="ltr">15 V</span> مع <span class="ltr">1 Ω</span> توالياً مع <span class="ltr">(2∥6)</span> ⟵ <span class="ltr">R_T=2.5 Ω</span> و<span class="ltr">I=6 A ±2%</span>' },
      { id: 'm4', text: 'أعِد تمرين <span class="ltr">48 V</span> مع <span class="ltr">8 kΩ ∥ 24 kΩ</span> ⟵ <span class="ltr">I₁=6 mA</span> و<span class="ltr">I₂=2 mA</span> و<span class="ltr">I_s=8 mA ±2%</span>' },
      { id: 'm5', text: 'أثبت انحفاظ القدرة في النمطين: <span class="ltr">|ΣP_i − P_del| ≤ 1%</span>' },
    ],
  },
  {
    id: 'sim-generator', icon: 'rotate-cw', unit: 'u3',
    title: 'مولد الملف الدوّار',
    concepts: ['generated-emf', 'faraday-law', 'synchronous-speed'],
    desc: 'ملف يدور داخل مجال: اضبط السرعة وعدد الأقطاب والفيض ونوع اللف، وشاهد الموجة قبل الموحّد وبعده',
    missions: [
      { id: 'm1', text: 'أعِد مثال (1): <span class="ltr">P=6</span>، <span class="ltr">Z=250</span>، لف تموجي <span class="ltr">a=2</span>، <span class="ltr">n=1200 rpm</span>، <span class="ltr">φ=0.06 Wb</span> ⟵ <span class="ltr">E_a=900 V ±2%</span>' },
      { id: 'm2', text: 'أعِد مثال (2): <span class="ltr">P=8</span>، <span class="ltr">Z=960</span>، لف انطباقي، <span class="ltr">n=600 rpm</span> — أوجد الفيض المعطي <span class="ltr">E_a=220 V</span> ⟵ <span class="ltr">φ=0.0229 Wb ±3%</span>' },
      { id: 'm3', text: 'أعِد مثال (3): <span class="ltr">P=8</span>، <span class="ltr">Z=480</span>، انطباقي، <span class="ltr">φ=0.05 Wb</span>، <span class="ltr">E_a=240 V</span> ⟵ <span class="ltr">n=600 rpm ±2%</span>' },
      { id: 'm4', text: 'أثبت أن <span class="ltr">f = p·n/120</span>: اضبط <span class="ltr">6</span> أقطاب و<span class="ltr">1000 rpm</span> وتحقّق من <span class="ltr">f=50 Hz ±0.5</span>' },
      { id: 'm5', text: 'بدّل اللف من انطباقي إلى تموجي عند نفس المعطيات وسجّل ارتفاع <span class="ltr">E_a</span> بنسبة <span class="ltr">P/2</span>' },
    ],
  },
  {
    id: 'sim-induction-motor', icon: 'fan', unit: 'u3',
    title: 'مقعد المحرك الحثي ثلاثي الأوجه',
    concepts: ['synchronous-speed', 'slip', 'motor-nameplate', 'efficiency', 'induction-motor', 'motor-protection'],
    desc: 'تردد وعدد أقطاب وعزم حمل قابل للضبط: تابع السرعة والانزلاق والتيار وحالة الريليه الحرارية',
    missions: [
      { id: 'm1', text: 'اضبط <span class="ltr">60 Hz</span> و<span class="ltr">4</span> أقطاب ⟵ <span class="ltr">N_s=1800 rpm</span>، ثم حمّل حتى <span class="ltr">1745 rpm</span> وتحقّق من انزلاق <span class="ltr">3.06% ±0.2</span>' },
      { id: 'm2', text: 'اضبط <span class="ltr">50 Hz</span> و<span class="ltr">6</span> أقطاب ⟵ <span class="ltr">N_s=1000 rpm</span>، ثم <span class="ltr">60 Hz</span> ⟵ <span class="ltr">1200 rpm ±1%</span>' },
      { id: 'm3', text: 'ضاعف عدد الأقطاب من <span class="ltr">4</span> إلى <span class="ltr">8</span> وأثبت انخفاض <span class="ltr">N_s</span> إلى النصف (نسبة <span class="ltr">0.5±0.02</span>)' },
      { id: 'm4', text: 'خفّض التردد إلى <span class="ltr">30 Hz</span> وأثبت هبوط السرعة إلى النصف مع بقاء العزم ضمن <span class="ltr">±10%</span>' },
      { id: 'm5', text: 'ارفع عزم الحمل حتى يفصل الريليه الحراري وسجّل تيار الفصل (يتجاوز التيار المقنن بأكثر من <span class="ltr">25%</span>)' },
    ],
  },
  {
    id: 'sim-transformer', icon: 'layers', unit: 'u3',
    title: 'مقعد المحول أحادي وثلاثي الطور',
    concepts: ['turns-ratio', 'efficiency', 'star-delta-relations', 'transformer-principle'],
    desc: 'اضبط عدد اللفات والحمل ونوع التوصيلة، واقرأ جهدَي وتيارَي الملفين ومنحنى الجهد–التيار',
    missions: [
      { id: 'm1', text: 'اضبط <span class="ltr">N₁=1000</span> و<span class="ltr">V₁=220 V</span> وأوجد <span class="ltr">N₂</span> المعطي <span class="ltr">V₂=24 V</span> ⟵ <span class="ltr">N₂=109±3</span> لفة' },
      { id: 'm2', text: 'أعِد جدول (5-1) بالحالات الخمس: لا حمل، <span class="ltr">10 kΩ</span>، <span class="ltr">100 kΩ</span>، حثي <span class="ltr">10 mH</span>، سعوي <span class="ltr">4.7 µF</span> وسجّل <span class="ltr">V_p, V_s, I_p, I_s</span> لكل حالة' },
      { id: 'm3', text: 'في التوصيل النجمي تحقّق من <span class="ltr">V_ph = V_L/√3</span>: عند <span class="ltr">11 kV</span> ⟵ <span class="ltr">6350 V ±1%</span>' },
      { id: 'm4', text: 'في توصيلة دلتا تحقّق من <span class="ltr">I_L = √3 · I_ph</span> بخطأ <span class="ltr">±2%</span>' },
      { id: 'm5', text: 'بدّل المصدر إلى <span class="ltr">DC</span> وأثبت انهيار جهد الثانوي إلى <span class="ltr">0 V</span> مع ارتفاع تيار الابتدائي' },
    ],
  },
  {
    id: 'sim-control-panel', icon: 'toggle-left', unit: 'u4',
    title: 'لوحة التحكم الصناعية',
    concepts: ['contactor', 'latching-circuit', 'interlock-check', 'star-delta-relations', 'fuse-ratings', 'no-nc-contacts', 'control-vs-power'],
    desc: 'اسحب العناصر وأسلِك المخطط: تمسك ذاتي وعكس اتجاه بقفل تبادلي ونجمة-دلتا مع حقن أعطال',
    missions: [
      { id: 'm1', text: 'نفّذ دائرة تشغيل باتجاه واحد بتمسك ذاتي <span class="ltr">(VPU 5.1)</span> وأثبت بقاء المحرك دائرًا بعد رفع اليد عن <span class="ltr">S2</span>' },
      { id: 'm2', text: 'نفّذ دائرة عكس الاتجاه بقفل تبادلي <span class="ltr">(VPU 5.3)</span> وتحقّق من استحالة جذب <span class="ltr">K1</span> و<span class="ltr">K2</span> معًا (لا إنذار قصر بين طورين)' },
      { id: 'm3', text: 'نفّذ نجمة-دلتا <span class="ltr">(VPU 5.4)</span> وتحقّق من تتابع <span class="ltr">K7→K9</span> ثم <span class="ltr">K8</span> بعد زمن المؤقت بخطأ <span class="ltr">±0.2 s</span>' },
      { id: 'm4', text: 'اختر كونتاكتورًا لحمل <span class="ltr">20 A</span> وتحقّق من القاعدة <span class="ltr">I ≥ 1.25 × 20 = 25 A</span>' },
      { id: 'm5', text: 'احقن عطلًا (فتح في تلامس <span class="ltr">95-96</span>) وحدّد موقعه بقياس <span class="ltr">24 V</span> قبل العنصر و<span class="ltr">0 V</span> بعده' },
    ],
  },
  {
    id: 'sim-diode-curve', icon: 'activity', unit: 'u5',
    title: 'منحنى الدايود وزينر وLED',
    concepts: ['diode-bias', 'zener-regulator', 'led-resistor', 'pn-junction', 'diode-curve'],
    desc: 'امسح الجهد من ‎−30 V إلى ‎+1.5 V وارسم منحنى الخواص، وصمّم منظّم زينر ودائرة LED',
    missions: [
      { id: 'm1', text: 'استخرج جهد الركبة للسيليكون <span class="ltr">0.7 V</span> وللجرمانيوم <span class="ltr">0.3 V</span> بخطأ لا يتجاوز <span class="ltr">±0.05 V</span>' },
      { id: 'm2', text: 'أثبت ثبات تيار التسريب العكسي: غيّر الجهد من <span class="ltr">−5 V</span> إلى <span class="ltr">−15 V</span> وتحقّق من تغيّر التيار بأقل من <span class="ltr">5%</span>' },
      { id: 'm3', text: 'صمّم منظّم زينر يثبّت <span class="ltr">12 V</span> من دخل يتراوح <span class="ltr">15–25 V</span> ⟵ ثبات <span class="ltr">V_L</span> ضمن <span class="ltr">±0.2 V</span>' },
      { id: 'm4', text: 'احسب المقاومة اللازمة لتشغيل <span class="ltr">LED</span> عند <span class="ltr">20 mA</span> من <span class="ltr">12 V</span> ⟵ <span class="ltr">500 Ω ±5%</span>' },
      { id: 'm5', text: 'اضبط تيارًا أماميًا <span class="ltr">10 mA</span> من مصدر <span class="ltr">12 V</span> عبر دايود سيليكون ⟵ <span class="ltr">R=1.13 kΩ ±5%</span>' },
    ],
  },
  {
    id: 'sim-bjt-bench', icon: 'cpu', unit: 'u5',
    title: 'مقعد الترانزستور BJT بخط الحمل',
    concepts: ['alpha-beta', 'bjt-regions'],
    desc: 'اضبط بيتا ومقاومتَي القاعدة والمجمع، وتابع نقطة التشغيل على عائلة المنحنيات مع حدّ القدرة',
    missions: [
      { id: 'm1', text: 'اضبط <span class="ltr">β=100</span> و<span class="ltr">I_B=50 µA</span> ⟵ تحقّق من <span class="ltr">I_C=5 mA ±2%</span> و<span class="ltr">α=0.990±0.002</span>' },
      { id: 'm2', text: 'اضبط الترانزستور في منطقة القطع <span class="ltr">(I_C ≤ 0.01 mA و V_CE ≈ V_CC)</span> وسمِّ وظيفته: مفتاح OFF' },
      { id: 'm3', text: 'اضبط الترانزستور في منطقة التشبع <span class="ltr">(V_CE ≤ 0.3 V)</span> وسمِّ وظيفته: مفتاح ON' },
      { id: 'm4', text: 'اضبط <span class="ltr">R_B</span> لتوسيط نقطة التشغيل على خط الحمل <span class="ltr">(V_CE = V_CC/2 ±10%)</span>' },
      { id: 'm5', text: 'تجاوز منحنى القدرة <span class="ltr">P_C=150 mW</span> وسجّل ظهور إنذار التلف' },
    ],
  },
  {
    id: 'sim-oscilloscope', icon: 'monitor', unit: 'u6',
    title: 'أوسيليسكوب افتراضي بقناتين',
    concepts: ['oscilloscope-reading', 'dc-ac'],
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
    id: 'sim-opamp-741', icon: 'triangle', unit: 'u6',
    title: 'مقعد مكبر التشغيل 741',
    concepts: ['opamp-741', 'inverting-amp'],
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
    id: 'sim-rectifier', icon: 'waves', unit: 'u6',
    title: 'دائرة التوحيد والتنعيم',
    concepts: ['rectifier-halfwave', 'rectifier-fullwave', 'smoothing-ripple', 'diode-bias', 'rc-time-constant'],
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
    id: 'sim-555-counter', icon: 'timer', unit: 'u6',
    title: 'مختبر المؤقت 555 والعداد 0–9',
    concepts: ['timer-555', 'digital-counter'],
    desc: 'مؤقت 555 في الوضعين المستقر وغير المستقر يقود عدادًا ومبينًا سباعي المقاطع',
    missions: [
      { id: 'm1', text: 'أعِد مثال الحقيبة: <span class="ltr">f=50 c/s</span> و<span class="ltr">T₁=2T₂</span> عند <span class="ltr">C=1 µF</span> ⟵ <span class="ltr">R_A=R_B=9.6 kΩ ±5%</span>' },
      { id: 'm2', text: 'أعِد المثال وحيد الاستقرار: نبضة <span class="ltr">3 s</span> عند <span class="ltr">C=33 µF</span> ⟵ <span class="ltr">R=82.65 kΩ ±5%</span>' },
      { id: 'm3', text: 'تمرين (14): <span class="ltr">f=10 c/s</span> وزمن الفتح = <span class="ltr">3×</span> زمن الغلق ⟵ تحقّق من <span class="ltr">R_A=2R_B ±5%</span>' },
      { id: 'm4', text: 'اضبط الدائرة على <span class="ltr">1 Hz</span> بالضبط <span class="ltr">±2%</span> وراقب تقدّم العدّاد رقمًا كل ثانية' },
      { id: 'm5', text: 'شغّل نبضات متتالية وتحقّق من خرج العدّاد <span class="ltr">0110</span> عند النبضة <span class="ltr">6</span> و<span class="ltr">1101</span> عند النبضة <span class="ltr">13</span>' },
    ],
  },
];

const loaders = {
  'sim-ohm-power': () => import('./sim-ohm-power.js'),
  'sim-capacitor-rc': () => import('./sim-capacitor-rc.js'),
  'sim-magnetic-field': () => import('./sim-magnetic-field.js'),
  'sim-series-parallel': () => import('./sim-series-parallel.js'),
  'sim-generator': () => import('./sim-generator.js'),
  'sim-induction-motor': () => import('./sim-induction-motor.js'),
  'sim-transformer': () => import('./sim-transformer.js'),
  'sim-control-panel': () => import('./sim-control-panel.js'),
  'sim-diode-curve': () => import('./sim-diode-curve.js'),
  'sim-bjt-bench': () => import('./sim-bjt-bench.js'),
  'sim-oscilloscope': () => import('./sim-oscilloscope.js'),
  'sim-opamp-741': () => import('./sim-opamp-741.js'),
  'sim-rectifier': () => import('./sim-rectifier.js'),
  'sim-555-counter': () => import('./sim-555-counter.js'),
};

export function loadSim(id) {
  const l = loaders[id];
  return l ? l() : Promise.resolve(null);
}
