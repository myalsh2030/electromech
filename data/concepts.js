// عقد المفاهيم — مقرر «كهرباء وإلكترونيات الآلات الميكانيكية» (مصيم 221)
// مصدر الحقيقة الوحيد لمفردات المقرر ومخرجاته — **ملف واحد متطابق في المنصتين**:
//   · النظري  electromech/website/data/concepts.js
//   · العملي  electromech-lab/website/data/concepts.js
// يستهلكه: دروس الوحدات وبنوك الأسئلة والمحاكيات والمسرد ومحرك الاستحضار المتباعد
//          وحقيبة القاعة (الحصص والجلسات العملية).
// ويفحصه: node tools/validate-course.mjs
// ملف بيانات خالص — لا منطق.
//
// ═══════════════════════════════════════════════════════════════════
// قواعد العقد (من القالب — تُتبع حرفيًا)
// ═══════════════════════════════════════════════════════════════════
//   id      — kebab-case إنجليزي، يُنقل **حرفيًا** إلى وسوم concepts في data/unitN.js
//             ووسوم concept في بنوك الأسئلة. لا يُخترع خارج هذا الملف ولا يُغيَّر بعده.
//   label   — التسمية العربية القصيرة (تظهر للمتدرب في «مراجعة اليوم»).
//   term    — المصطلح الإنجليزي المقابل.
//   outcome — مخرَج **واحد** لا غير.
//   depth   — core: يُدرَّس + يُقاس + يُتمرَّن (محاكاة أو محطة عملي) + مسرد + حصة قاعة.
//             support: يُدرَّس + يُقاس.  aware: يُدرَّس فقط.
//   needs   — مفاهيم سابقة لازمة معرفيًا. الترتيب أدناه هو ترتيب التدريس
//             (u1→u6 ثم العملي)، فلا يعتمد أي مفهوم على مفهوم لاحق.
//
// كل مفهوم core مقرون في تعليق درسه بما يُمرّنه:
//   محاكيات النظري: sim-ohm-power · sim-capacitor-rc · sim-magnetic-field ·
//   sim-series-parallel · sim-generator · sim-induction-motor · sim-transformer ·
//   sim-control-panel · sim-diode-curve · sim-bjt-bench · sim-oscilloscope ·
//   sim-opamp-741 · sim-rectifier · sim-555-counter
//   محطات العملي: lab-measure · lab-circuits · lab-generator · lab-motor ·
//   lab-transformer · lab-rectifier · lab-faults

export const OUTCOMES = [
  {
    id: 'O1',
    text: 'يحسب الكميات الكهربائية الأساسية (الجهد والتيار والمقاومة والقدرة والكفاية) بتطبيق قانون أوم وقوانين القدرة على دوائر الآلات.',
  },
  {
    id: 'O2',
    text: 'يصنّف المواد والعناصر السلبية (موصلات ومقاومات ومكثفات) ويحسب سعتها وزمن شحنها وتفريغها.',
  },
  {
    id: 'O3',
    text: 'يحلّل دوائر التوالي والتوازي والمركّبة بقانونَي كيرشوف ومجزئَي الجهد والتيار، ويستنتج أثر الفتح والقصر على القراءات.',
  },
  {
    id: 'O4',
    text: 'يفسّر عمل المولد والمحرك والمحول من مبادئ المغناطيسية والحث، ويحسب القوة الدافعة والسرعة التزامنية والانزلاق ونسبة التحويل من بيانات الآلة.',
  },
  {
    id: 'O5',
    text: 'يصمّم دائرة تحكم وقوى ويختار وسائل القطع والوصل والحماية (كونتاكتور ومصهر وقاطع) بمقننات مناسبة للحمل.',
  },
  {
    id: 'O6',
    text: 'يحدّد سلوك الدايود والترانزستور من منحنيات الخواص، ويحسب مقاومات التحديد ونقطة التشغيل ومعاملات التكبير.',
  },
  {
    id: 'O7',
    text: 'يبني ويحلّل الدوائر الإلكترونية الأساسية (توحيد وتنعيم وتكبير وتوقيت) ويقيس إشاراتها براسم الذبذبات.',
  },
  {
    id: 'O8',
    text: 'ينفّذ قياسات كهربائية وعمليات فك وتركيب وتشخيص أعطال بأدوات الورشة ووفق قواعد السلامة، ويوثّق قراءاته في جداول التجربة.',
  },
];

export const CONCEPTS = [
  // ═══════════════════════════════════════════════════════════════
  // u1 — الكميات الكهربائية الأساسية (9 ساعات / 4 دروس)
  // ═══════════════════════════════════════════════════════════════

  // ---- u1l1 — أساسيات الكهرباء والذرة والتيار ----
  // core مُمرَّن في: sim-ohm-power (التيار) · lab-measure (قياس التيار والتردد)
  {
    id: 'electric-current',
    label: 'التيار الكهربائي',
    term: 'Electric Current',
    outcome: 'O1',
    depth: 'core',
    needs: [],
  },
  {
    id: 'dc-ac',
    label: 'التيار المستمر والمتردد',
    term: 'DC vs AC',
    outcome: 'O1',
    depth: 'support',
    needs: ['electric-current'],
  },
  {
    id: 'material-classes',
    label: 'تصنيف المواد كهربائيًا',
    term: 'Conductor / Semiconductor / Insulator',
    outcome: 'O2',
    depth: 'support',
    needs: [],
  },

  // ---- u1l2 — المغناطيسية والحث الكهرومغناطيسي ----
  // core مُمرَّن في: sim-magnetic-field (مصنع المغناطيس + الحث بالحركة)
  {
    id: 'magnetic-flux',
    label: 'الفيض المغناطيسي وكثافته',
    term: 'Magnetic Flux & Flux Density',
    outcome: 'O4',
    depth: 'core',
    needs: [],
  },
  {
    id: 'electromagnet',
    label: 'المغناطيس الكهربائي والملف الحلزوني',
    term: 'Electromagnet / Solenoid',
    outcome: 'O4',
    depth: 'support',
    needs: ['electric-current', 'magnetic-flux'],
  },
  {
    id: 'faraday-law',
    label: 'قانون فاراداي للحث',
    term: "Faraday's Law of Induction",
    outcome: 'O4',
    depth: 'core',
    needs: ['magnetic-flux'],
  },

  // ---- u1l3 — الكميات الكهربائية وحساباتها ----
  // core مُمرَّن في: sim-ohm-power · lab-measure و lab-circuits
  {
    id: 'ohm-law',
    label: 'قانون أوم',
    term: "Ohm's Law",
    outcome: 'O1',
    depth: 'core',
    needs: ['electric-current'],
  },
  {
    id: 'electric-power',
    label: 'القدرة الكهربائية',
    term: 'Electric Power',
    outcome: 'O1',
    depth: 'core',
    needs: ['ohm-law'],
  },
  {
    id: 'efficiency',
    label: 'الكفاية والقدرة المفقودة',
    term: 'Efficiency & Power Loss',
    outcome: 'O1',
    depth: 'support',
    needs: ['electric-power'],
  },

  // ---- u1l4 — المقاومات والموصلات والمكثفات ----
  // core مُمرَّن في: sim-capacitor-rc (الشحن والتفريغ وثابت الزمن)
  {
    id: 'capacitance',
    label: 'السعة والشحنة المخزّنة',
    term: 'Capacitance',
    outcome: 'O2',
    depth: 'core',
    needs: ['electric-current'],
  },
  {
    id: 'rc-time-constant',
    label: 'ثابت الزمن ومنحنيا الشحن والتفريغ',
    term: 'RC Time Constant',
    outcome: 'O2',
    depth: 'core',
    needs: ['capacitance', 'ohm-law'],
  },

  // ═══════════════════════════════════════════════════════════════
  // u2 — القوانين ذات الصلة (13 ساعة / 3 دروس)
  // ═══════════════════════════════════════════════════════════════

  // ---- u2l1 — التوالي و KVL ومجزئ الجهد ----
  // core مُمرَّن في: sim-series-parallel (نمط التوالي) · lab-circuits (تدريب 1)
  {
    id: 'series-circuit',
    label: 'دائرة التوالي والمقاومة المكافئة',
    term: 'Series Circuit',
    outcome: 'O3',
    depth: 'core',
    needs: ['ohm-law'],
  },
  {
    id: 'kvl',
    label: 'قانون كيرشوف للجهد',
    term: "Kirchhoff's Voltage Law (KVL)",
    outcome: 'O3',
    depth: 'core',
    needs: ['series-circuit'],
  },
  {
    id: 'voltage-divider',
    label: 'مجزئ الجهد',
    term: 'Voltage Divider',
    outcome: 'O3',
    depth: 'core',
    needs: ['series-circuit'],
  },

  // ---- u2l2 — التوازي و KCL ومجزئ التيار ----
  // core مُمرَّن في: sim-series-parallel (نمط التوازي) · lab-circuits (تدريب 2)
  {
    id: 'parallel-circuit',
    label: 'دائرة التوازي والمقاومة المكافئة',
    term: 'Parallel Circuit',
    outcome: 'O3',
    depth: 'core',
    needs: ['ohm-law'],
  },
  {
    id: 'kcl',
    label: 'قانون كيرشوف للتيار',
    term: "Kirchhoff's Current Law (KCL)",
    outcome: 'O3',
    depth: 'core',
    needs: ['parallel-circuit'],
  },
  {
    id: 'current-divider',
    label: 'مجزئ التيار',
    term: 'Current Divider',
    outcome: 'O3',
    depth: 'support',
    needs: ['parallel-circuit'],
  },

  // ---- u2l3 — التوصيل المركب والقدرة والكفاءة ----
  // core مُمرَّن في: sim-series-parallel (النمط المركّب والاختزال المتدرّج)
  {
    id: 'series-parallel-network',
    label: 'التوصيل المركب والاختزال المتدرّج',
    term: 'Series-Parallel Network',
    outcome: 'O3',
    depth: 'core',
    needs: ['series-circuit', 'parallel-circuit'],
  },
  {
    id: 'open-short-fault',
    label: 'الدائرة المفتوحة والقصر وأثرهما على القراءة',
    term: 'Open & Short Circuit',
    outcome: 'O3',
    depth: 'support',
    needs: ['series-parallel-network'],
  },

  // ═══════════════════════════════════════════════════════════════
  // u3 — الآلات الكهربائية (6 ساعات / 3 دروس)
  // ═══════════════════════════════════════════════════════════════

  // ---- u3l1 — المولدات الكهربائية ----
  // core مُمرَّن في: sim-generator · lab-generator (المحطة 3)
  {
    id: 'generated-emf',
    label: 'القوة الدافعة المتولدة Ea',
    term: 'Generated e.m.f.',
    outcome: 'O4',
    depth: 'core',
    needs: ['faraday-law'],
  },
  {
    id: 'synchronous-speed',
    label: 'السرعة التزامنية وعلاقتها بالتردد والأقطاب',
    term: 'Synchronous Speed',
    outcome: 'O4',
    depth: 'core',
    needs: ['generated-emf'],
  },
  {
    id: 'star-delta-relations',
    label: 'علاقات التوصيل نجمة ودلتا',
    term: 'Star / Delta Relations',
    outcome: 'O4',
    depth: 'core',
    needs: ['dc-ac'],
  },

  // ---- u3l2 — المحركات وبطاقتها وحمايتها ----
  // core مُمرَّن في: sim-induction-motor · lab-motor (المحطة 4)
  {
    id: 'induction-motor',
    label: 'المحرك الحثي والمجال الدوار',
    term: 'Induction Motor',
    outcome: 'O4',
    depth: 'core',
    needs: ['electromagnet', 'synchronous-speed'],
  },
  {
    id: 'slip',
    label: 'الانزلاق',
    term: 'Slip',
    outcome: 'O4',
    depth: 'core',
    needs: ['induction-motor'],
  },
  {
    id: 'motor-nameplate',
    label: 'بطاقة المحرك وقراءة بياناتها',
    term: 'Motor Nameplate',
    outcome: 'O4',
    depth: 'support',
    needs: ['induction-motor'],
  },
  {
    id: 'motor-protection',
    label: 'وسائل حماية المحرك',
    term: 'Motor Protection',
    outcome: 'O4',
    depth: 'support',
    needs: ['motor-nameplate'],
  },

  // ---- u3l3 — المحول الكهربائي ----
  // core مُمرَّن في: sim-transformer · lab-transformer (المحطة 5)
  {
    id: 'transformer-principle',
    label: 'مبدأ عمل المحول',
    term: 'Transformer Principle',
    outcome: 'O4',
    depth: 'core',
    needs: ['faraday-law', 'dc-ac'],
  },
  {
    id: 'turns-ratio',
    label: 'نسبة التحويل وكفاءة المحول',
    term: 'Turns Ratio',
    outcome: 'O4',
    depth: 'core',
    needs: ['transformer-principle', 'efficiency'],
  },

  // ═══════════════════════════════════════════════════════════════
  // u4 — وسائل التحكم في الدوائر الكهربائية (6 ساعات / 3 دروس)
  // ═══════════════════════════════════════════════════════════════

  // ---- u4l1 — وسائل القطع والوصل ومكوّنات دائرة التحكم ----
  // core مُمرَّن في: sim-control-panel · lab-faults (المحطة 7)
  {
    id: 'control-vs-power',
    label: 'دائرة التحكم ودائرة القوى',
    term: 'Control vs Power Circuit',
    outcome: 'O5',
    depth: 'support',
    needs: ['motor-protection'],
  },
  {
    id: 'contactor',
    label: 'الكونتاكتور واختيار مقننه',
    term: 'Contactor',
    outcome: 'O5',
    depth: 'support',
    needs: ['control-vs-power', 'electric-current'],
  },
  {
    id: 'no-nc-contacts',
    label: 'التلامسات عادة مفتوح وعادة مغلق',
    term: 'NO / NC Contacts',
    outcome: 'O5',
    depth: 'support',
    needs: ['control-vs-power'],
  },
  {
    id: 'latching-circuit',
    label: 'دائرة التمسك الذاتي',
    term: 'Latching (Self-hold) Circuit',
    outcome: 'O5',
    depth: 'core',
    needs: ['contactor', 'no-nc-contacts'],
  },

  // ---- u4l2 — المصهرات ومقنناتها ----
  // (بلا محاكاة أصيلة — تستعير مهمة المصهر في sim-control-panel)
  {
    id: 'fuse-ratings',
    label: 'مقننات المصهر ومعامل الانصهار',
    term: 'Fuse Ratings & Fusing Factor',
    outcome: 'O5',
    depth: 'support',
    needs: ['electric-current'],
  },

  // ---- u4l3 — القواطع وإخماد القوس ----
  // core مُمرَّن في: sim-control-panel (وضع الحماية والفصل)
  {
    id: 'circuit-breaker',
    label: 'القاطع الكهربائي ومواصفاته',
    term: 'Circuit Breaker',
    outcome: 'O5',
    depth: 'support',
    needs: ['fuse-ratings'],
  },
  {
    id: 'electric-arc',
    label: 'القوس الكهربائي وطرق إخماده',
    term: 'Electric Arc & Quenching',
    outcome: 'O5',
    depth: 'support',
    needs: ['circuit-breaker'],
  },

  // ═══════════════════════════════════════════════════════════════
  // u5 — أساسيات العناصر الإلكترونية (8 ساعات / 4 دروس)
  // ═══════════════════════════════════════════════════════════════

  // ---- u5l1 — أشباه الموصلات ووصلة PN والدايود ----
  // core مُمرَّن في: sim-diode-curve · lab-rectifier (المحطة 6)
  {
    id: 'pn-junction',
    label: 'التطعيم ووصلة PN ومنطقة الاستنزاف',
    term: 'Doping & PN Junction',
    outcome: 'O6',
    depth: 'support',
    needs: ['material-classes'],
  },
  {
    id: 'diode-bias',
    label: 'الانحياز الأمامي والعكسي',
    term: 'Forward / Reverse Bias',
    outcome: 'O6',
    depth: 'core',
    needs: ['pn-junction'],
  },
  {
    id: 'diode-curve',
    label: 'منحنى خواص الدايود وجهد العتبة',
    term: 'Diode Characteristic Curve',
    outcome: 'O6',
    depth: 'core',
    needs: ['diode-bias'],
  },

  // ---- u5l2 — الدايودات الخاصة والعناصر الضوئية ----
  // core مُمرَّن في: sim-diode-curve (نمطا زينر و LED)
  {
    id: 'zener-regulator',
    label: 'دايود زينر ومنظّم الجهد',
    term: 'Zener Diode Regulator',
    outcome: 'O6',
    depth: 'core',
    needs: ['diode-curve'],
  },
  {
    id: 'led-resistor',
    label: 'الـ LED ومقاومة تحديد التيار',
    term: 'LED & Current-limiting Resistor',
    outcome: 'O6',
    depth: 'core',
    needs: ['diode-bias', 'ohm-law'],
  },

  // ---- u5l3 — الترانزستور BJT ----
  // core مُمرَّن في: sim-bjt-bench (خط الحمل ومناطق التشغيل)
  {
    id: 'alpha-beta',
    label: 'تيارات الترانزستور والمعاملان ألفا وبيتا',
    term: 'Alpha & Beta (Transistor Currents)',
    outcome: 'O6',
    depth: 'core',
    needs: ['pn-junction', 'kcl'],
  },
  {
    id: 'bjt-regions',
    label: 'مناطق التشغيل الثلاث وخط الحمل',
    term: 'Operating Regions & Load Line',
    outcome: 'O6',
    depth: 'core',
    needs: ['alpha-beta'],
  },

  // ---- u5l4 — FET / MOSFET ----
  // (بلا محاكاة أصيلة — تستعير مهمة مقارنة FET في sim-bjt-bench)
  {
    id: 'shockley-equation',
    label: 'معادلة شوكلي وتيار المصرف',
    term: 'Shockley Equation',
    outcome: 'O6',
    depth: 'support',
    needs: ['bjt-regions'],
  },

  // ═══════════════════════════════════════════════════════════════
  // u6 — الدوائر الإلكترونية (6 ساعات / 3 دروس)
  // ═══════════════════════════════════════════════════════════════

  // ---- u6l1 — الدوائر المتكاملة وراسم الإشارة ----
  // core مُمرَّن في: sim-oscilloscope · lab-rectifier (قراءة الموجات)
  {
    id: 'integrated-circuit',
    label: 'الدائرة المتكاملة وتصنيفها وترقيم أطرافها',
    term: 'Integrated Circuit (IC)',
    outcome: 'O7',
    depth: 'support',
    needs: ['bjt-regions'],
  },
  {
    id: 'oscilloscope-reading',
    label: 'قراءة الجهد والزمن والتردد من الراسم',
    term: 'Oscilloscope Reading',
    outcome: 'O7',
    depth: 'core',
    needs: ['dc-ac'],
  },

  // ---- u6l2 — مكبر التشغيل 741 وتطبيقاته ----
  // core مُمرَّن في: sim-opamp-741
  {
    id: 'opamp-741',
    label: 'مكبر التشغيل 741 وأطرافه والتشبع',
    term: 'Operational Amplifier 741',
    outcome: 'O7',
    depth: 'support',
    needs: ['integrated-circuit'],
  },
  {
    id: 'inverting-amp',
    label: 'المكبر العاكس وحساب الكسب',
    term: 'Inverting Amplifier',
    outcome: 'O7',
    depth: 'core',
    needs: ['opamp-741', 'ohm-law'],
  },

  // ---- u6l3 — مصادر التغذية والمؤقت 555 والعدادات ----
  // core مُمرَّن في: sim-rectifier و sim-555-counter · lab-rectifier (المحطة 6)
  {
    id: 'rectifier-halfwave',
    label: 'التوحيد نصف الموجة',
    term: 'Half-wave Rectifier',
    outcome: 'O7',
    depth: 'support',
    needs: ['diode-bias', 'dc-ac'],
  },
  {
    id: 'rectifier-fullwave',
    label: 'التوحيد موجة كاملة والقنطرة',
    term: 'Full-wave / Bridge Rectifier',
    outcome: 'O7',
    depth: 'core',
    needs: ['rectifier-halfwave'],
  },
  {
    id: 'smoothing-ripple',
    label: 'التنعيم بالمكثف ومعامل التموج',
    term: 'Smoothing & Ripple Factor',
    outcome: 'O7',
    depth: 'core',
    needs: ['rectifier-fullwave', 'capacitance'],
  },
  {
    id: 'voltage-regulator-ic',
    label: 'منظمات الجهد 78XX و79XX وLM317',
    term: 'Voltage Regulator IC',
    outcome: 'O7',
    depth: 'support',
    needs: ['smoothing-ripple', 'zener-regulator'],
  },
  {
    id: 'timer-555',
    label: 'المؤقت 555 والتشكيلتان المستقرة وغير المستقرة',
    term: '555 Timer',
    outcome: 'O7',
    depth: 'core',
    needs: ['rc-time-constant', 'integrated-circuit'],
  },
  {
    id: 'digital-counter',
    label: 'النظام الثنائي والعداد والعرض السباعي',
    term: 'Binary Counter & 7-Segment Display',
    outcome: 'O7',
    depth: 'support',
    needs: ['timer-555'],
  },

  // ═══════════════════════════════════════════════════════════════
  // العملي — مفاهيم المهارة التقنية (منصة electromech-lab)
  // 4 أجنحة / 7 محطات — كلها تحت المخرَج O8
  // ═══════════════════════════════════════════════════════════════

  // ---- lab u1l1 تمهيد + u1l2 المحطة 1: القياسات الكهربائية (lab-measure) ----
  {
    id: 'avometer',
    label: 'الأفوميتر وضبط المدى',
    term: 'AVO Meter / Multimeter',
    outcome: 'O8',
    depth: 'core',
    needs: ['electric-current'],
  },
  {
    id: 'analog-reading-scale',
    label: 'قراءة التدريج التناظري ومعامل المدى',
    term: 'Analogue Scale Reading',
    outcome: 'O8',
    depth: 'support',
    needs: ['avometer'],
  },
  {
    id: 'color-code',
    label: 'كود ألوان المقاومات',
    term: 'Resistor Colour Code',
    outcome: 'O8',
    depth: 'core',
    needs: ['ohm-law'],
  },
  {
    id: 'meter-connection-rules',
    label: 'قواعد توصيل الأميتر توالياً والفولتميتر توازياً',
    term: 'Ammeter / Voltmeter Connection Rules',
    outcome: 'O8',
    depth: 'core',
    needs: ['avometer'],
  },
  {
    id: 'ohmmeter-deenergized',
    label: 'قياس المقاومة بعد فصل التغذية',
    term: 'De-energized Resistance Test',
    outcome: 'O8',
    depth: 'core',
    needs: ['avometer'],
  },
  {
    id: 'clamp-meter',
    label: 'الكلامبميتر وقياس التيار بلا فصل',
    term: 'Clamp Meter',
    outcome: 'O8',
    depth: 'core',
    needs: ['avometer'],
  },

  // ---- lab u1l3 المحطة 2: تكوين الدوائر وكيرشوف (lab-circuits) ----
  {
    id: 'power-rating-check',
    label: 'التحقق من قدرة المقاومة قبل التشغيل',
    term: 'Component Power Rating Check',
    outcome: 'O8',
    depth: 'support',
    needs: ['electric-power'],
  },

  // ---- lab u2 جناح الآلات: المحطات 3 و4 و5 ----
  // (lab-generator · lab-motor · lab-transformer)
  {
    id: 'loto',
    label: 'القفل والوسم قبل الفك',
    term: 'Lock-Out / Tag-Out (LOTO)',
    outcome: 'O8',
    depth: 'core',
    needs: [],
  },
  {
    id: 'marking-before-disassembly',
    label: 'الوسم وتسجيل الأصل قبل الفك',
    term: 'Marking Before Disassembly',
    outcome: 'O8',
    depth: 'support',
    needs: ['loto'],
  },
  {
    id: 'winding-rewind',
    label: 'إعادة لف الملفات وعزل المجاري',
    term: 'Rewinding & Slot Insulation',
    outcome: 'O8',
    depth: 'core',
    needs: ['electromagnet', 'marking-before-disassembly'],
  },
  {
    id: 'insulation-test',
    label: 'اختبار العزل ملف–أرضي',
    term: 'Insulation (Phase-to-Earth) Test',
    outcome: 'O8',
    depth: 'core',
    needs: ['ohmmeter-deenergized'],
  },
  {
    id: 'winding-fault-diagnosis',
    label: 'تشخيص أعطال الملفات من القراءات',
    term: 'Winding Fault Diagnosis',
    outcome: 'O8',
    depth: 'core',
    needs: ['insulation-test', 'motor-nameplate'],
  },

  // ---- lab u3 جناح الإلكترونيات: المحطة 6 (lab-rectifier) ----
  {
    id: 'polarized-capacitor-safety',
    label: 'سلامة المكثفات المستقطبة وتفريغها',
    term: 'Polarized Capacitor Safety',
    outcome: 'O8',
    depth: 'support',
    needs: ['capacitance'],
  },

  // ---- lab u4 جناح التحكم والأعطال: المحطة 7 (lab-faults) ----
  {
    id: 'control-diagram-reading',
    label: 'قراءة مخطط دائرة التحكم وتتبّع المسار',
    term: 'Control Diagram Reading',
    outcome: 'O8',
    depth: 'core',
    needs: ['control-vs-power', 'no-nc-contacts'],
  },
  {
    id: 'continuity-test',
    label: 'اختبار الاستمرارية على دائرة معزولة',
    term: 'Continuity Test',
    outcome: 'O8',
    depth: 'support',
    needs: ['ohmmeter-deenergized', 'loto'],
  },
  {
    id: 'half-split-troubleshooting',
    label: 'منهج تنصيف المسار في تحديد العطل',
    term: 'Half-split Troubleshooting',
    outcome: 'O8',
    depth: 'core',
    needs: ['control-diagram-reading'],
  },
  {
    id: 'interlock-check',
    label: 'التحقق من القفل التبادلي قبل التشغيل',
    term: 'Interlock Verification',
    outcome: 'O8',
    depth: 'support',
    needs: ['latching-circuit', 'continuity-test'],
  },
];
