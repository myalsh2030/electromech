// الوحدة الخامسة: أساسيات العناصر الإلكترونية — المنصة النظرية (مصيم 221)
// ملف بيانات خالص (ES Module) بدون أي منطق.
// المصدر: حقيبة المقرر النظرية ص 181–216 (تفريغات T_c21..T_c26) + course-map.md بند 5.
// المفاهيم المستعملة هنا مأخوذة حرفيًا من data/concepts.js:
//   pn-junction · diode-bias · diode-curve · zener-regulator · led-resistor ·
//   alpha-beta · bjt-regions · shockley-equation
// المحاكيات: sim-diode-curve (u5l1 و u5l2) · sim-bjt-bench (u5l3) — نصوص المهام منقولة
// حرفيًا من js/sims/registry.js.

export const UNIT5 = {
  id: 'u5',
  title: 'أساسيات العناصر الإلكترونية',
  icon: 'cpu',
  color: '#a78bfa',
  tagline: 'بلورة رمل صغيرة تقرر متى يمر التيار ومتى يتوقف',
  lessons: [
    // ------------------------------------------------------------
    // u5l1 — أشباه الموصلات ووصلة PN والدايود
    // ------------------------------------------------------------
    {
      id: 'u5l1',
      title: 'أشباه الموصلات ووصلة PN والدايود',
      minutes: 14,
      concepts: ['pn-junction', 'diode-bias', 'diode-curve'],
      blocks: [
        {
          t: 'concept',
          title: 'مادة تقرر بنفسها: أمرّر أم أمنع؟',
          icon: '💡',
          html: 'داخل كل لوحة تحكم في الورشة قطعة رمل معالَجة تسمى <span class="term">شبه الموصل <i>Semiconductor</i></span>. عند الصفر المطلق تسلك سلوك <b>العازل المثالي</b>، وعند حرارة الغرفة <span class="ltr">300 K</span> تتحرر إلكترونات التكافؤ فتصبح موصلة. أشهر عنصرين: <span class="term">السيليكون <i>Si</i></span> و<span class="term">الجرمانيوم <i>Ge</i></span>، وكلاهما <b>رباعي التكافؤ</b> يرتبط بجيرانه بروابط تساهمية.',
        },
        {
          t: 'figure',
          caption: 'التطعيم: ذرة خماسية التكافؤ تمنح إلكترونًا حرًا (نوع N)، وذرة ثلاثية التكافؤ تترك رابطة ناقصة أي فجوة (نوع P)',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="300" y="26" text-anchor="middle" fill="var(--c-text)" font-size="15" font-weight="bold">نوع N</text><text x="100" y="26" text-anchor="middle" fill="var(--c-text)" font-size="15" font-weight="bold">نوع P</text><g stroke="var(--c-border2)" stroke-width="2"><line x1="250" y1="80" x2="340" y2="80"/><line x1="250" y1="170" x2="340" y2="170"/><line x1="250" y1="80" x2="250" y2="170"/><line x1="340" y1="80" x2="340" y2="170"/><line x1="50" y1="80" x2="140" y2="80"/><line x1="50" y1="170" x2="140" y2="170"/><line x1="50" y1="80" x2="50" y2="170"/><line x1="140" y1="80" x2="140" y2="170"/></g><g fill="none" stroke="var(--c-text2)" stroke-width="2"><circle cx="250" cy="80" r="17"/><circle cx="340" cy="170" r="17"/><circle cx="250" cy="170" r="17"/><circle cx="50" cy="80" r="17"/><circle cx="140" cy="170" r="17"/><circle cx="50" cy="170" r="17"/></g><circle cx="340" cy="80" r="17" fill="none" stroke="var(--c-ok)" stroke-width="3"/><circle cx="140" cy="80" r="17" fill="none" stroke="var(--c-amber)" stroke-width="3"/><g fill="var(--c-text2)" font-size="12" text-anchor="middle"><text x="250" y="85">+4</text><text x="340" y="175">+4</text><text x="250" y="175">+4</text><text x="50" y="85">+4</text><text x="140" y="175">+4</text><text x="50" y="175">+4</text></g><text x="340" y="85" text-anchor="middle" fill="var(--c-ok)" font-size="12" font-weight="bold">+5</text><text x="140" y="85" text-anchor="middle" fill="var(--c-amber)" font-size="12" font-weight="bold">+3</text><circle cx="368" cy="112" r="7" fill="var(--c-simwater)"/><text x="368" y="140" text-anchor="middle" fill="var(--c-simwater)" font-size="11">إلكترون حر</text><circle cx="168" cy="112" r="7" fill="none" stroke="var(--c-amber)" stroke-width="2" stroke-dasharray="3 3"/><text x="168" y="140" text-anchor="middle" fill="var(--c-amber)" font-size="11">فجوة</text><text x="300" y="228" text-anchor="middle" fill="var(--c-text2)" font-size="11">شوائب مانحة DONOR</text><text x="100" y="228" text-anchor="middle" fill="var(--c-text2)" font-size="11">شوائب كاسبة ACCEPTOR</text><text x="200" y="250" text-anchor="middle" fill="var(--c-text2)" font-size="11">نسبة التطعيم: ذرة شائبة واحدة لكل مليون ذرة</text></svg>',
        },
        {
          t: 'concept',
          title: 'التطعيم: مليون ذرة وذرة واحدة غريبة',
          icon: '🔢',
          html: 'البلورة النقية موصليتها ضعيفة جدًا أمام النحاس والفضة، فتُضاف إليها شوائب بنسبة <b>ذرة واحدة لكل مليون ذرة</b>:<ul><li><b>نوع N</b>: شائبة خماسية التكافؤ (<span class="term">مانحة <i>Donor</i></span>) تترك إلكترونًا خامسًا حرًا — الأغلبية إلكترونات.</li><li><b>نوع P</b>: شائبة ثلاثية التكافؤ (<span class="term">كاسبة <i>Acceptor</i></span>) تترك رابطة ناقصة — الأغلبية فجوات.</li></ul>',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: من أنا في البلورة؟',
          cards: [
            { front: 'الإلكترون الحر (Free Electron)', back: 'حامل شحنة سالب تحرر من رابطة تساهمية، وهو حامل الأغلبية في المادة نوع N وحامل الأقلية في المادة نوع P.' },
            { front: 'الفجوة (Hole)', back: 'موضع شاغر في رابطة تساهمية يسلك سلوك شحنة موجبة متحركة، وهو حامل الأغلبية في المادة نوع P.' },
            { front: 'منطقة الاستنزاف (Depletion Region)', back: 'شريط على جانبي الحاجز خالٍ تمامًا من حاملات الشحنة، نشأ من عبور الإلكترونات إلى الفجوات وترك أيونات ثابتة خلفها.' },
          ],
        },
        {
          t: 'concept',
          title: 'وصلة PN: حاجز يولد نفسه بنفسه',
          icon: '🔒',
          html: 'إذا طُعِّم جزء من بلورة واحدة بشوائب مانحة وجزؤها الآخر بكاسبة تكوّنت <span class="term">وصلة PN <i>PN Junction</i></span>. الإلكترونات القريبة من الحاجز تعبر إلى الفجوات فتترك أيونات موجبة وسالبة ثابتة، وتنشأ <b>منطقة الاستنزاف</b>. لا تكفي ملامسة قطعتين منفصلتين — لا بد من <b>استمرار البناء البلوري</b> وإلا ضاعت خواص الدايود كلها.',
        },
        {
          t: 'figure',
          caption: 'الانحياز الأمامي يضيّق منطقة الاستنزاف فيمر تيار كبير، والعكسي يوسّعها فلا يمر إلا تيار تسريب صغير',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="300" y="26" text-anchor="middle" fill="var(--c-ok)" font-size="14" font-weight="bold">انحياز أمامي</text><text x="100" y="26" text-anchor="middle" fill="var(--c-bad)" font-size="14" font-weight="bold">انحياز عكسي</text><rect x="215" y="45" width="170" height="80" rx="6" fill="none" stroke="var(--c-text2)" stroke-width="2"/><rect x="296" y="45" width="8" height="80" fill="var(--c-ok)" opacity="0.45"/><text x="345" y="92" text-anchor="middle" fill="var(--c-text2)" font-size="13">P</text><text x="255" y="92" text-anchor="middle" fill="var(--c-text2)" font-size="13">N</text><rect x="15" y="45" width="170" height="80" rx="6" fill="none" stroke="var(--c-text2)" stroke-width="2"/><rect x="78" y="45" width="44" height="80" fill="var(--c-bad)" opacity="0.35"/><text x="150" y="92" text-anchor="middle" fill="var(--c-text2)" font-size="13">P</text><text x="45" y="92" text-anchor="middle" fill="var(--c-text2)" font-size="13">N</text><text x="300" y="146" text-anchor="middle" fill="var(--c-text2)" font-size="11">المنطقة ضاقت</text><text x="100" y="146" text-anchor="middle" fill="var(--c-text2)" font-size="11">المنطقة اتسعت</text><g stroke="var(--c-ok)" stroke-width="3" fill="none"><line x1="240" y1="175" x2="360" y2="175"/><polyline points="352,168 360,175 352,182"/></g><g stroke="var(--c-bad)" stroke-width="1.5" fill="none"><line x1="60" y1="175" x2="140" y2="175" stroke-dasharray="5 5"/><polyline points="134,170 140,175 134,180"/></g><text x="300" y="204" text-anchor="middle" fill="var(--c-ok)" font-size="12" font-weight="bold">تيار كبير ومقاومة صغيرة</text><text x="100" y="204" text-anchor="middle" fill="var(--c-bad)" font-size="12" font-weight="bold">تيار تسريب ومقاومة عالية</text><text x="300" y="232" text-anchor="middle" fill="var(--c-text2)" font-size="11">الأنود موجب والكاثود سالب</text><text x="100" y="232" text-anchor="middle" fill="var(--c-text2)" font-size="11">الأنود سالب والكاثود موجب</text><text x="200" y="254" text-anchor="middle" fill="var(--c-text2)" font-size="11">جهد العتبة: 0.7 V للسيليكون و 0.3 V للجرمانيوم</text></svg>',
        },
        {
          t: 'formula',
          name: 'تيار الدايود في دائرة توالٍ بسيطة',
          expr: 'I = ( V<sub>S</sub> − V<sub>F</sub> ) / R',
          terms: [
            { sym: 'I', ar: 'التيار المار في الدائرة', unit: 'A' },
            { sym: 'V<sub>S</sub>', ar: 'جهد المصدر', unit: 'V' },
            { sym: 'V<sub>F</sub>', ar: 'هبوط الجهد الأمامي على الدايود', unit: 'V' },
            { sym: 'R', ar: 'مقاومة تحديد التيار', unit: 'Ω' },
          ],
          note: 'قيم للحفظ من الحقيبة: <span class="ltr">V<sub>F</sub> = 0.7 V</span> لدايود السيليكون و<span class="ltr">0.3 V</span> لدايود الجرمانيوم (وفي منحنى الخواص المركّب ص 190 يظهر الجرمانيوم عند <span class="ltr">0.2 V</span>، بينما شكل 6-9 يظهره عند <span class="ltr">0.3 V</span>).',
        },
        {
          t: 'example',
          title: 'مثال محلول: دايود سيليكون مع مقاومة',
          given: [
            'مصدر مستمر <span class="ltr">V<sub>S</sub> = 12 V</span>',
            'مقاومة توالٍ <span class="ltr">R = 1 kΩ</span>',
            'دايود سيليكون منحاز أماميًا، أي <span class="ltr">V<sub>F</sub> = 0.7 V</span>',
          ],
          steps: [
            'الجهد الباقي على المقاومة: <span class="ltr">12 − 0.7 = 11.3 V</span>',
            'التيار: <span class="ltr">I = 11.3 ÷ 1000 = 0.0113 A</span>',
            'بالوحدات المصغّرة: <span class="ltr">I = 11.3 mA</span>',
          ],
          answer: '<span class="ltr">I ≈ 11.3 mA</span> — ولو كان الدايود جرمانيوم لصار <span class="ltr">11.7 mA</span>، ففرق جهد العتبة يظهر في التيار مباشرة.',
        },
        {
          t: 'match',
          title: 'وصّل كل حالة بقراءتها الصحيحة',
          pairs: [
            { a: 'انحياز أمامي لدايود سليم', b: 'مقاومة صغيرة وتيار كبير' },
            { a: 'انحياز عكسي لدايود سليم', b: 'ما لا نهاية عمليًا وتيار تسريب' },
            { a: 'ركبة المنحنى عند 0.7 V', b: 'دايود سيليكون' },
            { a: 'ركبة المنحنى عند 0.3 V', b: 'دايود جرمانيوم' },
          ],
        },
        {
          t: 'sim',
          sim: 'sim-diode-curve',
          title: 'منحنى الدايود وزينر وLED',
          desc: 'امسح الجهد من ‎−30 V إلى ‎+1.5 V وارسم منحنى الخواص، وصمّم منظّم زينر ودائرة LED',
          missions: [
            { id: 'm1', text: 'استخرج جهد الركبة للسيليكون <span class="ltr">0.7 V</span> وللجرمانيوم <span class="ltr">0.3 V</span> بخطأ لا يتجاوز <span class="ltr">±0.05 V</span>' },
            { id: 'm2', text: 'أثبت ثبات تيار التسريب العكسي: غيّر الجهد من <span class="ltr">−5 V</span> إلى <span class="ltr">−15 V</span> وتحقّق من تغيّر التيار بأقل من <span class="ltr">5%</span>' },
            { id: 'm5', text: 'اضبط تيارًا أماميًا <span class="ltr">10 mA</span> من مصدر <span class="ltr">12 V</span> عبر دايود سيليكون ⟵ <span class="ltr">R=1.13 kΩ ±5%</span>' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة 🛠: اختبر أي دايود بالأوميتر <b>بعد فصل التغذية</b> وقياسه خارج الدائرة. القراءة السليمة: <b>مقاومة صغيرة</b> في اتجاه و<b>ما لا نهاية</b> عند عكس المسبارين. قراءتان صغيرتان في الاتجاهين = دايود <b>مقصور</b>، وما لا نهاية في الاتجاهين = دايود <b>مفتوح</b> — وكلاهما يوقف مغذي اللوحة كاملًا.',
        },
        { t: 'quiz', ref: 'u5l1check' },
      ],
    },

    // ------------------------------------------------------------
    // u5l2 — الدايودات الخاصة والعناصر الضوئية
    // ------------------------------------------------------------
    {
      id: 'u5l2',
      title: 'الدايودات الخاصة والعناصر الضوئية',
      minutes: 13,
      concepts: ['zener-regulator', 'led-resistor'],
      blocks: [
        {
          t: 'concept',
          title: 'دايود يعيش على الانهيار… ودايود يضيء',
          icon: '🔥',
          html: 'الدايود العادي يتلف عند الانهيار العكسي، أما <span class="term">دايود زينر <i>Zener Diode</i></span> فصُنع ليعمل هناك بأمان: زيدت نسبة شوائبه فانخفض جهد انهياره وضُبطت حرارته بالتحكم في التيار العكسي. وبجواره على اللوحة يقف <span class="term">الدايود الباعث للضوء <i>LED</i></span> الذي يحوّل الطاقة الكهربائية إلى ضوء بدل الحرارة.',
        },
        {
          t: 'concept',
          title: 'الزينر منظّم جهد بلا حركة',
          icon: '🎯',
          html: 'في الانحياز الأمامي لا يختلف الزينر عن الدايود العادي، والفرق كله في <b>الانحياز العكسي</b>. يثبّت جهد الحمل عند <span class="ltr">V<sub>L</sub> = V<sub>Z</sub></span>، والزيادة كلها تذهب تيارًا في الزينر. وإذا صغرت مقاومة الحمل فطلبت تيارًا أكبر، جاءت الزيادة <b>من تيار الزينر</b> لا من المصدر. مدى جهود زينر التجارية <span class="ltr">2.4–200 V</span> (وأشهرها في اللوحات <span class="ltr">3.3</span> و<span class="ltr">5.1</span> و<span class="ltr">12 V</span>) بقدرات تصل إلى عشرات الواطات — في الحقيبة ورد سهوًا <span class="ltr">25–200 V</span>.',
        },
        {
          t: 'formula',
          name: 'منظّم الجهد بالزينر',
          expr: 'R<sub>S</sub> = ( V<sub>dc</sub> − V<sub>Z</sub> ) / ( I<sub>Z</sub> + I<sub>L</sub> )',
          terms: [
            { sym: 'V<sub>dc</sub>', ar: 'جهد الدخل غير المنظّم', unit: 'V' },
            { sym: 'V<sub>Z</sub>', ar: 'جهد انهيار زينر وهو جهد الحمل المثبَّت', unit: 'V' },
            { sym: 'I<sub>Z</sub>', ar: 'تيار الزينر', unit: 'A' },
            { sym: 'I<sub>L</sub>', ar: 'تيار الحمل', unit: 'A' },
            { sym: 'R<sub>S</sub>', ar: 'مقاومة التوالي المحدِّدة', unit: 'Ω' },
          ],
          note: 'مع العلاقتين الملازمتين: <span class="ltr">I<sub>i</sub> = I<sub>Z</sub> + I<sub>L</sub></span> و<span class="ltr">V<sub>L</sub> = V<sub>Z</sub></span>.',
        },
        {
          t: 'figure',
          caption: 'دائرة تثبيت الجهد بالزينر (شكل 6-11): تيار الدخل يتوزع بين الزينر والحمل، وجهد الحمل يبقى عند جهد زينر',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><g stroke="var(--c-text2)" stroke-width="2" fill="none"><line x1="340" y1="60" x2="250" y2="60"/><line x1="230" y1="60" x2="150" y2="60"/><line x1="150" y1="60" x2="70" y2="60"/><line x1="340" y1="60" x2="340" y2="200"/><line x1="340" y1="200" x2="70" y2="200"/><line x1="150" y1="60" x2="150" y2="200"/><line x1="70" y1="60" x2="70" y2="200"/></g><rect x="230" y="48" width="42" height="24" fill="none" stroke="var(--c-amber)" stroke-width="2.5"/><text x="251" y="38" text-anchor="middle" fill="var(--c-amber)" font-size="12">Rs</text><g stroke="var(--c-text)" stroke-width="2.5" fill="none"><line x1="330" y1="112" x2="350" y2="112"/><line x1="330" y1="140" x2="350" y2="140"/></g><text x="376" y="132" text-anchor="middle" fill="var(--c-text2)" font-size="12">Vdc</text><g fill="var(--c-badge)" stroke="var(--c-badge)" stroke-width="2"><polygon points="138,138 162,138 150,116"/><polyline points="136,112 164,112" fill="none"/><polyline points="132,118 136,112" fill="none"/><polyline points="168,106 164,112" fill="none"/></g><text x="120" y="132" text-anchor="middle" fill="var(--c-badge)" font-size="12">Vz</text><rect x="58" y="108" width="24" height="44" fill="none" stroke="var(--c-ok)" stroke-width="2.5"/><text x="36" y="134" text-anchor="middle" fill="var(--c-ok)" font-size="12">RL</text><text x="300" y="88" text-anchor="middle" fill="var(--c-text2)" font-size="11">Ii</text><text x="168" y="96" text-anchor="middle" fill="var(--c-badge)" font-size="11">Iz</text><text x="90" y="96" text-anchor="middle" fill="var(--c-ok)" font-size="11">IL</text><text x="356" y="108" text-anchor="middle" fill="var(--c-text2)" font-size="12">+</text><text x="356" y="150" text-anchor="middle" fill="var(--c-text2)" font-size="12">−</text><text x="200" y="234" text-anchor="middle" fill="var(--c-text)" font-size="13" font-weight="bold">VL = VZ ثابت مهما تغيّر Vdc</text><text x="200" y="254" text-anchor="middle" fill="var(--c-text2)" font-size="11">Ii = Iz + IL</text></svg>',
        },
        {
          t: 'formula',
          name: 'مقاومة تحديد تيار الـ LED',
          expr: 'R = ( V<sub>S</sub> − V<sub>F</sub> ) / I<sub>F</sub>',
          terms: [
            { sym: 'V<sub>S</sub>', ar: 'جهد المصدر', unit: 'V' },
            { sym: 'V<sub>F</sub>', ar: 'جهد التشغيل الأمامي للـ LED', unit: 'V' },
            { sym: 'I<sub>F</sub>', ar: 'التيار الأمامي المطلوب', unit: 'A' },
            { sym: 'R', ar: 'مقاومة التوالي المحدِّدة', unit: 'Ω' },
          ],
          note: 'من الحقيبة: <span class="ltr">V<sub>F</sub> ≈ 2 V</span> للـ LED المصنوع من <span class="ltr">زرنيخيد فوسفيد الجاليوم GaAsP</span> — أعلى بكثير من دايود السيليكون.',
        },
        {
          t: 'example',
          title: 'مثال محلول: مقاومة تشغيل مبيّن LED',
          given: [
            'مصدر <span class="ltr">V<sub>S</sub> = 9 V</span>',
            'LED جهده الأمامي <span class="ltr">V<sub>F</sub> = 2 V</span>',
            'التيار الأمامي المطلوب <span class="ltr">I<sub>F</sub> = 20 mA</span>',
          ],
          steps: [
            'الجهد الذي يجب أن تسقطه المقاومة: <span class="ltr">9 − 2 = 7 V</span>',
            'حوّل التيار: <span class="ltr">20 mA = 0.02 A</span>',
            'المقاومة: <span class="ltr">R = 7 ÷ 0.02 = 350 Ω</span>',
          ],
          answer: '<span class="ltr">R = 350 Ω</span> — وتُختار أقرب قيمة قياسية أعلى (<span class="ltr">390 Ω</span>) لأن التيار الأقل يطيل عمر المبيّن.',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: العناصر الضوئية',
          cards: [
            { front: 'الدايود الضوئي (Photo Diode)', back: 'يعمل بانحياز عكسي، وتياره يعتمد على شدة الإضاءة لا على الجهد. تياره بالميكروأمبير وزمن استجابته بالنانوثانية، وعند الإظلام يمر تيار الإظلام فقط.' },
            { front: 'الترانزستور الضوئي (Photo Transistor)', back: 'ضوء يسقط على القاعدة فيتولد تيار قاعدة يُكبَّر بمعامل بيتا. تياره بالمللي أمبير أي أشدّ حساسية بكثير، لكن زمن استجابته بالميكروثانية أي أبطأ.' },
            { front: 'المقاومة الضوئية (LDR)', back: 'شريحة كبريتيد الكادميوم تتناقص مقاومتها كلما زادت شدة الإضاءة، من نحو 10000 أوم في الظلام إلى وحدات قليلة في الضوء القوي.' },
            { front: 'الرابط الضوئي (Optocoupler)', back: 'مبيّن LED وترانزستور ضوئي في غلاف واحد لا يربطهما سلك بل ضوء، فتنتقل الإشارة ويبقى عزل كهربائي تام بين دائرتَي الدخل والخرج.' },
          ],
        },
        {
          t: 'match',
          title: 'وصّل كل مادة بلون الضوء الذي تشعّه',
          pairs: [
            { a: 'النيتروجين', b: 'أزرق' },
            { a: 'الفوسفور', b: 'أخضر' },
            { a: 'زرنيخ الفسفور', b: 'أحمر' },
            { a: 'الزرنيخ مع الزنك', b: 'تحت الحمراء' },
          ],
        },
        {
          t: 'sim',
          sim: 'sim-diode-curve',
          title: 'منحنى الدايود وزينر وLED',
          desc: 'امسح الجهد من ‎−30 V إلى ‎+1.5 V وارسم منحنى الخواص، وصمّم منظّم زينر ودائرة LED',
          missions: [
            { id: 'm3', text: 'صمّم منظّم زينر يثبّت <span class="ltr">12 V</span> من دخل يتراوح <span class="ltr">15–25 V</span> ⟵ ثبات <span class="ltr">V_L</span> ضمن <span class="ltr">±0.2 V</span>' },
            { id: 'm4', text: 'احسب المقاومة اللازمة لتشغيل <span class="ltr">LED</span> عند <span class="ltr">20 mA</span> من <span class="ltr">12 V</span> ⟵ <span class="ltr">500 Ω ±5%</span>' },
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة ⚠: لا توصل مبيّن <span class="term">LED <i>LED</i></span> بلا مقاومة توالٍ أبدًا — سيسحب تيارًا يحرقه في لحظة. وفي لوحات التحكم يُوصل معه <b>دايود عكسي</b> لحمايته من الجهد العكسي، لأن جهد انهياره العكسي صغير جدًا. أما مبيّنات القطاعات السباعية <span class="term">7-Segment</span> فتُغذّى عبر مقاومات <span class="ltr">220 Ω</span> لكل مقطع.',
        },
        { t: 'quiz', ref: 'u5l2check' },
      ],
    },

    // ------------------------------------------------------------
    // u5l3 — الترانزستور BJT
    // ------------------------------------------------------------
    {
      id: 'u5l3',
      title: 'الترانزستور ثنائي القطبية BJT',
      minutes: 14,
      concepts: ['alpha-beta', 'bjt-regions'],
      blocks: [
        {
          t: 'concept',
          title: 'تيار ميكروأمبير يحرّك تيار مللي أمبير',
          icon: '⭐',
          html: 'انتشر <span class="term">الترانزستور <i>Transistor</i></span> لصغر حجمه وقلة تكلفته واستهلاكه الضئيل للطاقة. وهو في الآلات الميكانيكية شيئان لا ثالث لهما: <b>مكبّر إشارة</b> حسّاس، أو <b>مفتاح إلكتروني</b> بلا تلامسات تتآكل. والنوع الشائع هو <span class="term">ثنائي القطبية <i>BJT</i></span> لأنه يعتمد على الإلكترونات والفجوات معًا.',
        },
        {
          t: 'figure',
          caption: 'الترانزستور كدايودين متقابلين: اتصال الأنودين عند القاعدة يعطي npn، واتصال الكاثودين يعطي pnp',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="300" y="26" text-anchor="middle" fill="var(--c-ok)" font-size="14" font-weight="bold">npn</text><text x="100" y="26" text-anchor="middle" fill="var(--c-amber)" font-size="14" font-weight="bold">pnp</text><g stroke="var(--c-text2)" stroke-width="2" fill="none"><line x1="300" y1="45" x2="300" y2="90"/><line x1="300" y1="130" x2="300" y2="150"/><line x1="300" y1="190" x2="300" y2="215"/><line x1="300" y1="140" x2="238" y2="140"/><line x1="100" y1="45" x2="100" y2="90"/><line x1="100" y1="130" x2="100" y2="150"/><line x1="100" y1="190" x2="100" y2="215"/><line x1="100" y1="140" x2="38" y2="140"/></g><g fill="var(--c-ok)" stroke="var(--c-ok)" stroke-width="2"><polygon points="288,112 312,112 300,90"/><polygon points="288,168 312,168 300,190"/></g><g stroke="var(--c-ok)" stroke-width="2.5"><line x1="286" y1="88" x2="314" y2="88"/><line x1="286" y1="193" x2="314" y2="193"/></g><g fill="var(--c-amber)" stroke="var(--c-amber)" stroke-width="2"><polygon points="88,90 112,90 100,112"/><polygon points="88,190 112,190 100,168"/></g><g stroke="var(--c-amber)" stroke-width="2.5"><line x1="86" y1="115" x2="114" y2="115"/><line x1="86" y1="166" x2="114" y2="166"/></g><g fill="var(--c-text2)" font-size="12" text-anchor="middle"><text x="300" y="40">المجمع C</text><text x="300" y="232">الباعث E</text><text x="222" y="144">القاعدة B</text><text x="100" y="40">المجمع C</text><text x="100" y="232">الباعث E</text><text x="22" y="144">B</text></g><text x="200" y="254" text-anchor="middle" fill="var(--c-text2)" font-size="11">الباعث أعلى تركيزًا بحاملات الأغلبية، والمجمع أوسع ليجمعها</text></svg>',
        },
        {
          t: 'concept',
          title: 'ثلاث مناطق ووظيفة لكل منها',
          icon: '🎯',
          html: 'الترانزستور ثلاث مناطق: <b>القاعدة <i>Base</i></b> رقيقة في الوسط، و<b>الباعث <i>Emitter</i></b> عالي التركيز بحاملات الأغلبية، و<b>المجمع <i>Collector</i></b> الذي يجمعها. ومنطقة التشغيل تحددها الوصلتان:<ul><li><b>الفعّالة</b>: باعث-قاعدة أمامي ومجمع-قاعدة عكسي ⟵ <b>مكبّر</b>.</li><li><b>القطع</b>: الوصلتان عكسيتان ⟵ <b>مفتاح OFF</b>.</li><li><b>التشبع</b>: الوصلتان أماميتان ⟵ <b>مفتاح ON</b>.</li></ul>',
        },
        {
          t: 'formula',
          name: 'قانون كيرشوف على الترانزستور',
          expr: 'I<sub>E</sub> = I<sub>B</sub> + I<sub>C</sub>',
          terms: [
            { sym: 'I<sub>E</sub>', ar: 'تيار الباعث وهو الأكبر دائمًا', unit: 'A' },
            { sym: 'I<sub>B</sub>', ar: 'تيار القاعدة وهو الأصغر دائمًا', unit: 'A' },
            { sym: 'I<sub>C</sub>', ar: 'تيار المجمع', unit: 'A' },
          ],
          note: 'نتيجة مباشرة لا تُخرَق أبدًا: <span class="ltr">I<sub>C</sub></span> لا يمكن أن يتجاوز <span class="ltr">I<sub>E</sub></span>، وأي قراءة تخالف ذلك خطأ قياس.',
        },
        {
          t: 'formula',
          name: 'معاملا كسب التيار ألفا وبيتا',
          expr: 'β = I<sub>C</sub> / I<sub>B</sub> &nbsp;&nbsp;·&nbsp;&nbsp; α = I<sub>C</sub> / I<sub>E</sub> &nbsp;&nbsp;·&nbsp;&nbsp; α = β / ( β + 1 )',
          terms: [
            { sym: 'β', ar: 'كسب تيار الباعث المشترك ويرمز له في اللوحات بـ hFE', unit: 'بلا وحدة' },
            { sym: 'α', ar: 'كسب تيار القاعدة المشتركة', unit: 'بلا وحدة' },
          ],
          note: 'المدى المألوف: <span class="ltr">β = 20–200</span> للترانزستور العادي (وقد تبلغ <span class="ltr">10000</span> في أنواع خاصة)، و<span class="ltr">α = 0.90–0.995</span>.',
        },
        {
          t: 'example',
          title: 'مثال محلول: من تيار القاعدة إلى ألفا',
          given: [
            'معامل كسب التيار <span class="ltr">β = 100</span>',
            'تيار القاعدة <span class="ltr">I<sub>B</sub> = 40 µA</span>',
          ],
          steps: [
            'تيار المجمع: <span class="ltr">I<sub>C</sub> = β × I<sub>B</sub> = 100 × 40 µA = 4 mA</span>',
            'تيار الباعث: <span class="ltr">I<sub>E</sub> = I<sub>B</sub> + I<sub>C</sub> = 0.04 + 4 = 4.04 mA</span>',
            'المعامل ألفا: <span class="ltr">α = I<sub>C</sub> ÷ I<sub>E</sub> = 4 ÷ 4.04 = 0.990</span>',
          ],
          answer: '<span class="ltr">I<sub>C</sub> = 4 mA</span> و<span class="ltr">I<sub>E</sub> = 4.04 mA</span> و<span class="ltr">α = 0.990</span> — لاحظ أن ألفا أقل من الواحد دائمًا لأن الباعث هو الأكبر.',
        },
        {
          t: 'match',
          title: 'وصّل كل منطقة تشغيل بحالة وصلتيها',
          pairs: [
            { a: 'المنطقة الفعّالة (مكبّر)', b: 'باعث-قاعدة أمامي ومجمع-قاعدة عكسي' },
            { a: 'منطقة القطع (مفتاح OFF)', b: 'الوصلتان منحازتان عكسيًا' },
            { a: 'منطقة التشبع (مفتاح ON)', b: 'الوصلتان منحازتان أماميًا' },
          ],
        },
        {
          t: 'order',
          title: 'رتّب خطوات تحديد أطراف ترانزستور مجهول بالأوميتر',
          items: [
            'قِس المقاومة بين كل طرفين بالتبادل وسجّل القراءات الست',
            'أعلى قراءة مقاومة تدل على أن الطرفين هما المجمع والباعث',
            'إذن الطرف الثالث الباقي هو طرف القاعدة',
            'ثبّت مسبارًا على القاعدة وبدّل الآخر بين الطرفين ثم اعكس الأقطاب',
            'أقل قراءة مقاومة تسجَّل مع الباعث، والباقي هو المجمع',
          ],
        },
        {
          t: 'sim',
          sim: 'sim-bjt-bench',
          title: 'مقعد الترانزستور BJT بخط الحمل',
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
          t: 'tip',
          html: 'في الورشة 🔍: عامل الترانزستور كدايودين عند الفحص. اربط الطرف الموجب للأوميتر بالقاعدة ثم لامس المجمع — قراءة تعني <b>npn</b>، وما لا نهاية يعني أن عليك عكس المسبارين لتكتشف <b>pnp</b>. وبين المجمع والباعث لترانزستور سيليكون سليم تكون القراءة <b>ما لا نهاية</b>؛ أي قراءة منخفضة هناك تعني عنصرًا تالفًا يجب استبداله.',
        },
        { t: 'quiz', ref: 'u5l3check' },
      ],
    },

    // ------------------------------------------------------------
    // u5l4 — ترانزستور تأثير المجال FET / MOSFET
    // ------------------------------------------------------------
    {
      id: 'u5l4',
      title: 'ترانزستور تأثير المجال FET و MOSFET',
      minutes: 12,
      concepts: ['shockley-equation'],
      blocks: [
        {
          t: 'concept',
          title: 'ترانزستور يُحكَم بالجهد لا بالتيار',
          icon: '💡',
          html: '<span class="term">ترانزستور تأثير المجال <i>FET</i></span> عنصر <b>أحادي القطبية</b> يعتمد على نوع واحد من الشحنات فقط، والتحكم فيه بالمجال الكهربائي لا بتيار قاعدة. لهذا يسحب من دائرة القيادة تيارًا مهملًا. وله عائلتان: <span class="term">ذو الوصلة <i>JFET</i></span>، وذو البوابة المعزولة <span class="term">MOSFET</span> ويسمى أيضًا <span class="term">IGFET</span>.',
        },
        {
          t: 'figure',
          caption: 'قناة N بين المنبع والمصرف تحيط بها منطقتا بوابة منحازتان عكسيًا؛ سهم البوابة للداخل يعني قناة N وللخارج قناة P',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="300" y="26" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">التركيب</text><text x="100" y="26" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">الرمز</text><rect x="278" y="45" width="44" height="170" rx="4" fill="var(--c-simwater)" opacity="0.25"/><rect x="278" y="45" width="44" height="170" rx="4" fill="none" stroke="var(--c-text2)" stroke-width="2"/><rect x="248" y="100" width="30" height="60" fill="var(--c-amber)" opacity="0.45"/><rect x="322" y="100" width="30" height="60" fill="var(--c-amber)" opacity="0.45"/><g stroke="var(--c-text2)" stroke-width="2"><line x1="300" y1="45" x2="300" y2="30"/><line x1="300" y1="215" x2="300" y2="230"/><line x1="352" y1="130" x2="372" y2="130"/></g><g fill="var(--c-text2)" font-size="12" text-anchor="middle"><text x="300" y="24">D</text><text x="300" y="244">S</text><text x="383" y="134">G</text><text x="300" y="134">N</text><text x="263" y="134">P</text><text x="337" y="134">P</text></g><circle cx="100" cy="130" r="58" fill="none" stroke="var(--c-border2)" stroke-width="2"/><g stroke="var(--c-text)" stroke-width="2.5" fill="none"><line x1="112" y1="86" x2="112" y2="174"/><line x1="112" y1="96" x2="146" y2="96"/><line x1="112" y1="164" x2="146" y2="164"/><line x1="146" y1="96" x2="146" y2="66"/><line x1="146" y1="164" x2="146" y2="194"/><line x1="112" y1="130" x2="52" y2="130"/></g><polygon points="86,122 86,138 100,130" fill="var(--c-ok)"/><g fill="var(--c-text2)" font-size="12" text-anchor="middle"><text x="146" y="58">D</text><text x="146" y="210">S</text><text x="40" y="134">G</text></g><text x="200" y="254" text-anchor="middle" fill="var(--c-text2)" font-size="11">المنبع S يقابل الباعث · المصرف D يقابل المجمع · البوابة G تقابل القاعدة</text></svg>',
        },
        {
          t: 'concept',
          title: 'ثلاثة أطراف بأسماء جديدة',
          icon: '📦',
          html: 'أطراف <span class="term">JFET</span> ثلاثة، وكل واحد يقابل طرفًا في الترانزستور <span class="term">BJT</span>:<ul><li><b>المنبع <i>Source</i></b>: تدخل منه حاملات الأغلبية — يقابل الباعث.</li><li><b>المصرف <i>Drain</i></b>: تخرج منه الحاملات مكوّنة تيار المصرف — يقابل المجمع.</li><li><b>البوابة <i>Gate</i></b>: منطقتا الجانبين، وانحيازها <b>عكسي دائمًا</b> — تقابل القاعدة.</li></ul>',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: جهود JFET الحرجة',
          cards: [
            { front: 'جهد الاختناق VPO (Pinch-off)', back: 'عند ثبات VGS يتناسب تيار المصرف طرديًا مع VDS حسب قانون أوم حتى يبلغ هذا الجهد، فيثبت التيار عند قيمته القصوى.' },
            { front: 'أقصى تيار مصرف IDSS', back: 'تيار المصرف المستقر بعد جهد الاختناق عندما تكون البوابة عند جهد المنبع نفسه، أي عند VGS = 0، وهو أعلى منحنى في العائلة.' },
            { front: 'جهد الانغلاق VGS(off)', back: 'الجهد السالب الذي تتلامس عنده منطقتا الاستنزاف فتنغلق القناة تمامًا وينعدم تيار المصرف، وحالته تسمى CUT-OFF.' },
          ],
        },
        {
          t: 'formula',
          name: 'معادلة شوكلي لتيار المصرف',
          expr: 'I<sub>D</sub> = I<sub>DSS</sub> × [ 1 − ( V<sub>GS</sub> / V<sub>GS(off)</sub> ) ]²',
          terms: [
            { sym: 'I<sub>D</sub>', ar: 'تيار المصرف الناتج', unit: 'mA' },
            { sym: 'I<sub>DSS</sub>', ar: 'أقصى تيار مصرف عند جهد بوابة صفر', unit: 'mA' },
            { sym: 'V<sub>GS</sub>', ar: 'جهد البوابة بالنسبة للمنبع وهو سالب', unit: 'V' },
            { sym: 'V<sub>GS(off)</sub>', ar: 'جهد الانغلاق الذي ينعدم عنده التيار', unit: 'V' },
          ],
          note: 'المقدار بين القوسين يُربَّع دائمًا، ولهذا يهبط التيار هبوطًا سريعًا كلما زاد الجهد السالب على البوابة.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة المحلول: تيار المصرف عند جهدين',
          given: [
            'من لوحة بيانات العنصر: <span class="ltr">I<sub>DSS</sub> = 10 mA</span>',
            'جهد الانغلاق <span class="ltr">V<sub>GS(off)</sub> = −3.5 V</span>',
          ],
          steps: [
            'عند <span class="ltr">V<sub>GS</sub> = −1 V</span>: النسبة <span class="ltr">(−1 ÷ −3.5) = 0.286</span>، فيكون <span class="ltr">I<sub>D</sub> = 10 × (1 − 0.286)² = 5.1 mA</span>',
            'عند <span class="ltr">V<sub>GS</sub> = −2 V</span>: النسبة <span class="ltr">(−2 ÷ −3.5) = 0.571</span>، فيكون <span class="ltr">I<sub>D</sub> = 10 × (1 − 0.571)² = 1.84 mA</span>',
            'ينعدم التيار عندما تتساوى النسبة بالواحد، أي عند <span class="ltr">V<sub>GS</sub> = −3.5 V</span>',
          ],
          answer: '<span class="ltr">5.1 mA</span> ثم <span class="ltr">1.84 mA</span> ثم <span class="ltr">0 mA</span> — تغيّر <span class="ltr">1 V</span> على البوابة خفّض التيار إلى الثلث تقريبًا.',
        },
        {
          t: 'formula',
          name: 'التوصيلية gm',
          expr: 'g<sub>m</sub> = Δ I<sub>D</sub> / Δ V<sub>GS</sub> &nbsp;&nbsp;·&nbsp;&nbsp; g<sub>mo</sub> = −2 I<sub>DSS</sub> / V<sub>P</sub>',
          terms: [
            { sym: 'g<sub>m</sub>', ar: 'التوصيلية عند ثبوت جهد المصرف-المنبع', unit: 'S' },
            { sym: 'g<sub>mo</sub>', ar: 'التوصيلية عند جهد بوابة صفر', unit: 'S' },
            { sym: 'V<sub>P</sub>', ar: 'جهد الاختناق', unit: 'V' },
          ],
          note: 'تقاس التوصيلية بوحدة <span class="term">السيمنز <i>Siemens</i></span>، وتُقرأ من المنحنى بأخذ نقطتين متقاربتين وقسمة تغيّر التيار على تغيّر الجهد.',
        },
        {
          t: 'concept',
          title: 'MOSFET: بوابة معزولة بطبقة أكسيد',
          icon: '⚫',
          html: 'في <span class="term">MOSFET</span> تُعزل البوابة عن القناة بطبقة <span class="ltr">SiO₂</span>، وله نوعان:<ul><li><b>DE-MOSFET</b>: جهد بوابة سالب ⟵ <b>استنزاف</b> يقلل الإلكترونات فيقل التيار، وموجب ⟵ <b>تعزيز</b> يزيدها فيزيد التيار.</li><li><b>E-MOSFET</b>: لا قناة أصلًا بين المصرف والمنبع، فعند <span class="ltr">V<sub>GS</sub> = 0</span> لا يمر تيار — ولذلك يسمى <b>OFF MOSFET</b>.</li></ul>',
        },
        {
          t: 'match',
          title: 'وصّل كل طرف في FET بمقابله في BJT',
          pairs: [
            { a: 'المنبع S', b: 'الباعث E' },
            { a: 'المصرف D', b: 'المجمع C' },
            { a: 'البوابة G', b: 'القاعدة B' },
            { a: 'تيار المصرف ID', b: 'تيار المجمع IC' },
          ],
        },
        {
          t: 'order',
          title: 'رتّب ما يحدث في قناة N كلما زاد الجهد السالب على البوابة',
          items: [
            'البوابة عند جهد المنبع، والقناة مفتوحة بكامل عرضها',
            'جهد سالب صغير يوسّع منطقتَي الاستنزاف قليلًا فتضيق القناة',
            'زيادة الجهد السالب تضيّق القناة أكثر فيقل تيار المصرف',
            'عند جهد الانغلاق تتلامس المنطقتان فينعدم التيار تمامًا',
          ],
        },
        {
          t: 'tip',
          html: 'في الورشة ⚠: بوابة <span class="term">MOSFET</span> معزولة بطبقة أكسيد رقيقة جدًا، وشحنة ساكنة من يدك أو من ملابسك تكفي لثقبها وإتلاف العنصر <b>قبل تركيبه أصلًا</b>. تُخزَّن هذه العناصر بأرجلها مقصورة برغوة موصلة، ويُلبس سوار التأريض عند التعامل معها. وميزتها في لوحات القيادة أنها لا تسحب من دائرة التحكم تيارًا يُذكر.',
        },
        { t: 'quiz', ref: 'u5l4check' },
      ],
    },
  ],
};

// ================================================================
// بنوك أسئلة الوحدة الخامسة
// ================================================================
export const U5_QUIZZES = {
  // الاختبار القبلي — 6 أسئلة تغطي الدروس الأربعة
  u5pre: {
    title: 'قبل الانطلاق: أين أنت من العناصر الإلكترونية؟',
    questions: [
      {
        t: 'mc',
        q: 'ما الغرض من تطعيم بلورة السيليكون النقية بالشوائب؟',
        opts: [
          'رفع درجة انصهارها لتتحمل حرارة التشغيل',
          'زيادة موصليتها بتوفير حاملات شحنة إضافية',
          'تقليل حجمها ليتسع أكبر عدد في الرقاقة',
        ],
        correct: 1,
        why: 'السيليكون النقي موصليته ضعيفة جدًا مقارنة بالنحاس، فتُضاف شوائب بنسبة ذرة لكل مليون ذرة لتمنح إلكترونات حرة (نوع N) أو فجوات (نوع P).',
        unit: 'u5',
        concept: 'pn-junction',
      },
      {
        t: 'tf',
        q: 'في الانحياز العكسي تتسع منطقة الاستنزاف فترتفع مقاومة الدايود ارتفاعًا كبيرًا.',
        correct: true,
        why: 'القطب السالب يجذب الفجوات والموجب يجذب الإلكترونات بعيدًا عن الحاجز، فتتسع المنطقة الخالية من الشحنات ولا يمر إلا تيار تسريب صغير.',
        unit: 'u5',
        concept: 'diode-bias',
      },
      {
        t: 'mc',
        q: 'مبيّن <span class="ltr">LED</span> جهده الأمامي <span class="ltr">2 V</span> ويحتاج <span class="ltr">20 mA</span> من مصدر <span class="ltr">9 V</span>. كم مقاومة التحديد؟',
        opts: ['<span class="ltr">450 Ω</span>', '<span class="ltr">350 Ω</span>', '<span class="ltr">550 Ω</span>'],
        correct: 1,
        why: 'المقاومة تسقط الجهد الزائد: (9 − 2) ÷ 0.02 = <span class="ltr">350 Ω</span>. ثم تُختار أقرب قيمة قياسية أعلى منها.',
        unit: 'u5',
        concept: 'led-resistor',
      },
      {
        t: 'mc',
        q: 'في منظّم زينر: ماذا يحدث حين يرتفع جهد الدخل غير المنظّم؟',
        opts: [
          'يرتفع جهد الحمل بنفس نسبة ارتفاع الدخل تمامًا',
          'يبقى جهد الحمل ثابتًا والزيادة تمر تيارًا في الزينر',
          'ينقطع التيار عن الحمل حتى يعود الدخل لقيمته',
        ],
        correct: 1,
        why: 'الزينر يثبّت جهد الحمل عند جهد انهياره VZ، والفائض كله يذهب على شكل تيار زينر — وهذا جوهر عمل المنظّم.',
        unit: 'u5',
        concept: 'zener-regulator',
      },
      {
        t: 'mc',
        q: 'ترانزستور <span class="ltr">β = 100</span> وتيار قاعدته <span class="ltr">40 µA</span>. كم تيار المجمع؟',
        opts: ['<span class="ltr">0.4 mA</span>', '<span class="ltr">40 mA</span>', '<span class="ltr">4 mA</span>'],
        correct: 2,
        why: 'β = IC ÷ IB، إذن <span class="ltr">IC = 100 × 40 µA = 4 mA</span> — تيار قاعدة بالميكروأمبير يقود تيار مجمع بالمللي أمبير.',
        unit: 'u5',
        concept: 'alpha-beta',
      },
      {
        t: 'mc',
        q: 'في ترانزستور <span class="ltr">E-MOSFET</span> عند <span class="ltr">V<sub>GS</sub> = 0</span>: كم تيار المصرف؟',
        opts: [
          'يساوي صفرًا لأنه لا قناة توصيل أصلًا',
          'يساوي أقصى قيمة له لأن البوابة غير مُعاقة',
          'يساوي نصف القيمة القصوى المدوّنة باللوحة',
        ],
        correct: 0,
        why: 'يختلف E-MOSFET عن DE-MOSFET بعدم وجود قناة بين المصرف والمنبع، فلا يمر تيار حتى يُطبَّق جهد بوابة كافٍ — ولذلك يسمى OFF MOSFET.',
        unit: 'u5',
        concept: 'shockley-equation',
      },
    ],
  },

  // نقطة تفتيش الدرس الأول
  u5l1check: {
    title: 'نقطة تفتيش: أشباه الموصلات والدايود',
    questions: [
      {
        t: 'mc',
        q: 'دايود سيليكون على التوالي مع <span class="ltr">1 kΩ</span> ومصدر <span class="ltr">12 V</span>. كم التيار تقريبًا؟',
        opts: ['<span class="ltr">12.0 mA</span>', '<span class="ltr">11.3 mA</span>', '<span class="ltr">10.7 mA</span>'],
        correct: 1,
        why: 'الدايود يسقط <span class="ltr">0.7 V</span>، فيبقى <span class="ltr">11.3 V</span> على المقاومة، والتيار = 11.3 ÷ 1000 = <span class="ltr">11.3 mA</span>.',
        unit: 'u5',
        concept: 'diode-curve',
      },
      {
        t: 'mc',
        q: 'عُرض عليك منحنى خواص مجهول وركبته عند <span class="ltr">0.25 V</span>. ما مادة الدايود؟',
        opts: ['دايود جرمانيوم', 'دايود سيليكون', 'مبيّن LED ضوئي'],
        correct: 0,
        why: 'ركبة السيليكون عند <span class="ltr">0.7 V</span> وركبة الجرمانيوم بين <span class="ltr">0.2</span> و<span class="ltr">0.3 V</span>، أما مبيّن LED فركبته عند <span class="ltr">2 V</span> — والقيمة المعروضة ضمن مدى الجرمانيوم.',
        unit: 'u5',
        concept: 'diode-curve',
      },
      {
        t: 'tf',
        q: 'تيار التسريب العكسي في الدايود ناتج عن حاملات الشحنة الأقلية.',
        correct: true,
        why: 'الإلكترونات في الجانب P والفجوات في الجانب N هي حاملات الأقلية، وهي وحدها التي تعبر في الانحياز العكسي فتعطي تيارًا صغيرًا شبه ثابت.',
        unit: 'u5',
        concept: 'diode-bias',
      },
      {
        t: 'mc',
        q: 'ما الذي يحدث لمنطقة الاستنزاف عند الانحياز الأمامي؟',
        opts: [
          'تتسع حتى تشمل البلورة كلها فينقطع التيار',
          'تبقى بعرضها الأصلي مهما تغيّر جهد البطارية',
          'تضيق حتى يعبرها التيار بمقاومة صغيرة',
        ],
        correct: 2,
        why: 'التنافر بين القطب السالب والإلكترونات وبين الموجب والفجوات يدفع الحاملات نحو الحاجز فتضيق المنطقة، وعند بلوغ جهد العتبة يمر تيار كبير.',
        unit: 'u5',
        concept: 'diode-bias',
      },
    ],
  },

  // نقطة تفتيش الدرس الثاني
  u5l2check: {
    title: 'نقطة تفتيش: الدايودات الخاصة والعناصر الضوئية',
    questions: [
      {
        t: 'mc',
        q: 'ما وظيفة الدايود الموصول في انحياز عكسي بجوار مبيّن <span class="ltr">LED</span>؟',
        opts: [
          'رفع شدة الضوء المنبعث من المبيّن',
          'حماية المبيّن من الجهد العكسي',
          'تثبيت لون الضوء عند تغيّر التيار',
        ],
        correct: 1,
        why: 'جهد الانهيار العكسي للـ LED صغير جدًا، فيوضع دايود عكسي يمرر الجهد العكسي بعيدًا عنه ويقيه التلف.',
        unit: 'u5',
        concept: 'led-resistor',
      },
      {
        t: 'mc',
        q: 'ماذا يحدث لمقاومة <span class="ltr">LDR</span> عند زيادة شدة الإضاءة عليها؟',
        opts: ['تنقص', 'تزيد', 'تثبت'],
        correct: 0,
        why: 'الضوء يولّد أزواج إلكترون-فجوة داخل كبريتيد الكادميوم فترتفع الموصلية وتنخفض المقاومة — من نحو <span class="ltr">10000 Ω</span> في الظلام إلى قيم صغيرة جدًا.',
        unit: 'u5',
        concept: 'led-resistor',
      },
      {
        t: 'tf',
        q: 'الرابط الضوئي يعزل دائرة الدخل عن الخرج لأن الربط بينهما بالضوء لا بالأسلاك.',
        correct: true,
        why: 'مبيّن LED يشغّل ترانزستورًا ضوئيًا داخل غلاف واحد بلا اتصال معدني، فأي تحميل على دائرة الخرج لا يؤثر على الدخل إطلاقًا.',
        unit: 'u5',
        concept: 'led-resistor',
      },
      {
        t: 'mc',
        q: 'في منظّم زينر: من أين يأتي التيار الإضافي حين تصغر مقاومة الحمل؟',
        opts: [
          'من تيار الزينر الذي ينقص بمقدار الزيادة تمامًا',
          'من تيار المصدر الذي يرتفع تلقائيًا',
          'من مقاومة التوالي التي تسقط جهدًا أقل',
        ],
        correct: 0,
        why: 'تيار المصدر يبقى ثابتًا لأن جهد الحمل لم يتغيّر، فالزيادة التي يطلبها الحمل تُقتطع من تيار الزينر وفق العلاقة <span class="ltr">I<sub>i</sub> = I<sub>Z</sub> + I<sub>L</sub></span>.',
        unit: 'u5',
        concept: 'zener-regulator',
      },
    ],
  },

  // نقطة تفتيش الدرس الثالث
  u5l3check: {
    title: 'نقطة تفتيش: الترانزستور BJT',
    questions: [
      {
        t: 'mc',
        q: 'هل يمكن أن يكون تيار المجمع أكبر من تيار الباعث في ترانزستور سليم؟',
        opts: [
          'نعم إذا تجاوز معامل بيتا قيمة مئة',
          'لا لأن الباعث مجموع القاعدة والمجمع',
          'نعم عند تشغيله في منطقة التشبع',
        ],
        correct: 1,
        why: 'قانون كيرشوف على الترانزستور يعطي IE = IB + IC، وتيار القاعدة موجب دائمًا، فالباعث هو الأكبر حتمًا وألفا أقل من الواحد.',
        unit: 'u5',
        concept: 'alpha-beta',
      },
      {
        t: 'mc',
        q: 'ترانزستور وصلتاه منحازتان أماميًا. في أي منطقة يعمل وما وظيفته؟',
        opts: [
          'منطقة القطع ووظيفته مفتاح مفتوح',
          'المنطقة الفعّالة ووظيفته مكبّر إشارة',
          'منطقة التشبع ووظيفته مفتاح مغلق',
        ],
        correct: 2,
        why: 'انحياز الوصلتين أماميًا هو تعريف منطقة التشبع، وفيها يهبط VCE إلى أقل من <span class="ltr">0.3 V</span> فيعمل الترانزستور مفتاح وصل ON.',
        unit: 'u5',
        concept: 'bjt-regions',
      },
      {
        t: 'mc',
        q: 'في اختبار ترانزستور مجهول بالأوميتر: أعلى مقاومة بين طرفين تعني ماذا؟',
        opts: [
          'أنهما المجمع والباعث والثالث هو القاعدة',
          'أن العنصر تالف ويجب استبداله فورًا',
          'أنهما القاعدة والباعث والثالث هو المجمع',
        ],
        correct: 0,
        why: 'المسار بين المجمع والباعث يمر بوصلتين متعاكستين فتكون مقاومته الأعلى، ومنها يُعرف الطرف الثالث بأنه القاعدة.',
        unit: 'u5',
        concept: 'bjt-regions',
      },
      {
        t: 'tf',
        q: 'معامل كسب التيار <span class="ltr">β</span> يساوي تيار المجمع مقسومًا على تيار القاعدة، ومداه المألوف <span class="ltr">20–200</span>.',
        correct: true,
        why: 'هذا هو تعريف بيتا نفسه، ويرمز له في لوحات البيانات بـ hFE. وتصل قيمته إلى نحو <span class="ltr">10000</span> في أنواع خاصة فقط.',
        unit: 'u5',
        concept: 'alpha-beta',
      },
    ],
  },

  // نقطة تفتيش الدرس الرابع
  u5l4check: {
    title: 'نقطة تفتيش: FET و MOSFET',
    questions: [
      {
        t: 'mc',
        q: 'عنصر <span class="ltr">JFET</span> فيه <span class="ltr">I<sub>DSS</sub> = 10 mA</span> و<span class="ltr">V<sub>GS(off)</sub> = −3.5 V</span>. كم <span class="ltr">I<sub>D</sub></span> عند <span class="ltr">V<sub>GS</sub> = −2 V</span>؟',
        opts: ['<span class="ltr">5.10 mA</span>', '<span class="ltr">1.84 mA</span>', '<span class="ltr">2.86 mA</span>'],
        correct: 1,
        why: 'بمعادلة شوكلي: 10 × (1 − 2 ÷ 3.5)² = 10 × 0.184 = <span class="ltr">1.84 mA</span>. والقيمة <span class="ltr">5.1 mA</span> تخص <span class="ltr">V<sub>GS</sub> = −1 V</span>.',
        unit: 'u5',
        concept: 'shockley-equation',
      },
      {
        t: 'mc',
        q: 'ما نوع انحياز البوابة في ترانزستور <span class="ltr">JFET</span> أثناء التشغيل؟',
        opts: ['عكسي دائمًا', 'أمامي دائمًا', 'متبادل بينهما'],
        correct: 0,
        why: 'انحياز البوابة عكسي دائمًا بالنسبة للمنبع، ولهذا لا تسحب البوابة تيارًا يُذكر وتتحكم بالمجال الكهربائي وحده.',
        unit: 'u5',
        concept: 'shockley-equation',
      },
      {
        t: 'mc',
        q: 'سهم البوابة في رمز <span class="ltr">JFET</span> متجه إلى الخارج. على أي قناة يدل؟',
        opts: [
          'قناة P وحاملاتها فجوات موجبة',
          'قناة N وحاملاتها إلكترونات حرة',
          'قناة مزدوجة تعمل بالنوعين معًا',
        ],
        correct: 0,
        why: 'القاعدة المتفق عليها: السهم للداخل يعني قناة N، وللخارج يعني قناة P — وحاملات قناة P هي الفجوات.',
        unit: 'u5',
        concept: 'shockley-equation',
      },
      {
        t: 'tf',
        q: 'التوصيلية <span class="ltr">g<sub>m</sub></span> هي معدل تغيّر تيار المصرف إلى تغيّر جهد البوابة، وتقاس بالسيمنز.',
        correct: true,
        why: 'g<sub>m</sub> = ΔI<sub>D</sub> ÷ ΔV<sub>GS</sub> عند ثبوت V<sub>DS</sub>، ووحدتها السيمنز — وتُقرأ عمليًا من ميل منحنى التوصيلية بين نقطتين متقاربتين.',
        unit: 'u5',
        concept: 'shockley-equation',
      },
    ],
  },
};

// ================================================================
// أسئلة الوحدة الخامسة في الاختبار التشخيصي الشامل
// ================================================================
export const U5_DIAG = [
  {
    t: 'mc',
    q: 'لتشغيل دايود في انحياز أمامي: بم يوصل الأنود؟',
    opts: [
      'بالقطب الموجب للمصدر',
      'بالقطب السالب للمصدر',
      'بنقطة الأرضي المشتركة',
    ],
    correct: 0,
    why: 'الجانب P هو الأنود ويوصل بالقطب الموجب، والجانب N هو الكاثود ويوصل بالسالب — عندها تضيق منطقة الاستنزاف ويمر التيار.',
    unit: 'u5',
    concept: 'diode-bias',
  },
  {
    t: 'mc',
    q: 'ترانزستور معامل كسبه <span class="ltr">β = 100</span>. كم يساوي معامله <span class="ltr">α</span>؟',
    opts: ['<span class="ltr">0.909</span>', '<span class="ltr">1.010</span>', '<span class="ltr">0.990</span>'],
    correct: 2,
    why: 'α = β ÷ (β + 1) = 100 ÷ 101 = <span class="ltr">0.990</span>، وهي ضمن المدى المألوف <span class="ltr">0.90–0.995</span> ولا تبلغ الواحد أبدًا.',
    unit: 'u5',
    concept: 'alpha-beta',
  },
  {
    t: 'mc',
    q: 'ما جهد العتبة الأمامي لدايود السيليكون كما في منحنى الخواص؟',
    opts: ['<span class="ltr">0.3 V</span>', '<span class="ltr">0.7 V</span>', '<span class="ltr">2.0 V</span>'],
    correct: 1,
    why: 'السيليكون يبدأ التوصيل عند <span class="ltr">0.7 V</span>، والجرمانيوم عند <span class="ltr">0.3 V</span>، أما <span class="ltr">2 V</span> فهي جهد تشغيل مبيّن LED.',
    unit: 'u5',
    concept: 'diode-curve',
  },
];
