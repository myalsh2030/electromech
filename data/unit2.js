// الوحدة الثانية: القوانين ذات الصلة — التوالي والتوازي والتوصيل المركب
// مقرر «كهرباء وإلكترونيات الآلات الميكانيكية» (مصيم 221) — المنصة النظرية.
// ملف بيانات خالص (ES Module) بدون أي منطق.
// المصادر الحرفية: تفريغات الحقيبة T_c09..T_c13 (فصول التوالي والتوازي والمركب والتمارين)
//                 + خريطة المقرر course-map.md (الوحدة الثانية + بند 5 نقاط الفحص).
// وسوم concepts و concept مأخوذة حرفيًا من data/concepts.js.
// نصوص مهام المحاكاة منقولة حرفيًا من js/sims/registry.js (sim-series-parallel).

export const UNIT2 = {
  id: 'u2',
  title: 'القوانين ذات الصلة',
  icon: 'git-branch',
  color: '#38bdf8',
  tagline: 'مسار واحد أم عدة مسارات؟ سؤال يغيّر كل قراءة على لوحة الآلة.',
  lessons: [
    // ------------------------------------------------------------
    // u2l1 — التوالي و KVL ومجزئ الجهد
    // ------------------------------------------------------------
    {
      id: 'u2l1',
      title: 'التوالي وKVL ومجزئ الجهد',
      minutes: 14,
      concepts: ['series-circuit', 'kvl', 'voltage-divider'],
      blocks: [
        {
          t: 'concept',
          title: 'مصباح واحد يُطفئ الصف كله',
          icon: '🔍',
          html: 'سلسلة إنارة قديمة: تحترق لمبة واحدة فينطفئ الخط بأكمله. السبب أنها <span class="term">دائرة توالٍ <i>Series Circuit</i></span> — <b>مسار واحد لا غير للتيار</b>. وما دام المسار واحدًا فإن <b>التيار نفسه</b> يمر في كل عنصر مهما اختلفت قيمته.<ul><li>القاعدة الحاسمة: إذا كان بين نقطتين قيمة تيار واحدة، فكل ما بينهما موصول على التوالي.</li><li>شكل الرسم لا يهم: مستطيل أو متعرّج أو مائل — المهم عدد المسارات.</li></ul>',
        },
        {
          t: 'figure',
          caption: 'دائرة توالٍ من الحقيبة: مصدر <span class="ltr">20 V</span> مع <span class="ltr">2 Ω</span> و<span class="ltr">1 Ω</span> و<span class="ltr">5 Ω</span> — تيار واحد يدور في المسار كله',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="60" width="280" height="140" fill="none" stroke="var(--c-border2)" stroke-width="3"/><line x1="46" y1="112" x2="74" y2="112" stroke="var(--c-amber)" stroke-width="5"/><line x1="54" y1="128" x2="66" y2="128" stroke="var(--c-amber)" stroke-width="5"/><line x1="46" y1="144" x2="74" y2="144" stroke="var(--c-amber)" stroke-width="5"/><rect x="52" y="106" width="16" height="44" fill="var(--c-bg)" opacity="0"/><text x="60" y="90" text-anchor="middle" fill="var(--c-amber)" font-size="15" font-weight="bold">20 V</text><rect x="168" y="48" width="64" height="24" rx="4" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><text x="200" y="34" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">R1 = 2 &#937;</text><rect x="326" y="100" width="28" height="60" rx="4" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><text x="300" y="134" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">R2 = 1 &#937;</text><rect x="168" y="188" width="64" height="24" rx="4" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><text x="200" y="232" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">R3 = 5 &#937;</text><path d="M112 60 L136 60" stroke="var(--c-ok)" stroke-width="3"/><path d="M136 60 l-9 -5 l0 10 z" fill="var(--c-ok)"/><text x="124" y="46" text-anchor="middle" fill="var(--c-ok)" font-size="13" font-weight="bold">I = 2.5 A</text><text x="200" y="140" text-anchor="middle" fill="var(--c-text2)" font-size="13">مسار واحد ⟵ تيار واحد</text></svg>',
        },
        {
          t: 'formula',
          name: 'المقاومة الكلية في التوالي',
          expr: 'R<sub>T</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub> + … + R<sub>n</sub>',
          terms: [
            { sym: 'R_T', ar: 'المقاومة الكلية للمسار', unit: 'Ω' },
            { sym: 'R_1..R_n', ar: 'مقاومات المسار الواحد', unit: 'Ω' },
            { sym: 'n', ar: 'عدد المقاومات', unit: '—' },
          ],
          note: 'وعند تساوي المقاومات تُختصر إلى <b>R<sub>T</sub> = n · R</b>. مثال الحقيبة (1): ثمان مقاومات <span class="ltr">22 Ω</span> ⟵ <span class="ltr">R_T = 8 × 22 = 176 Ω</span>.',
        },
        {
          t: 'example',
          title: 'مثال (2) من الحقيبة: دائرة التوالي كاملة',
          given: [
            'مصدر <span class="ltr">E = 20 V</span>',
            'ثلاث مقاومات على التوالي: <span class="ltr">R1 = 2 Ω</span>، <span class="ltr">R2 = 1 Ω</span>، <span class="ltr">R3 = 5 Ω</span>',
          ],
          steps: [
            'المقاومة الكلية: <span class="ltr">R_T = 2 + 1 + 5 = 8 Ω</span>، والتيار: <span class="ltr">I = 20 ÷ 8 = 2.5 A</span>',
            'هبوط الجهد على كل مقاومة: <span class="ltr">V1 = 2.5 × 2 = 5 V</span>، <span class="ltr">V2 = 2.5 × 1 = 2.5 V</span>، <span class="ltr">V3 = 2.5 × 5 = 12.5 V</span>',
            'القدرات: <span class="ltr">P1 = 12.5 W</span>، <span class="ltr">P2 = 6.25 W</span>، <span class="ltr">P3 = 31.25 W</span>، وقدرة المنبع <span class="ltr">P_del = 20 × 2.5 = 50 W</span>',
          ],
          answer: 'المجموع يطابق المنبع: <span class="ltr">12.5 + 6.25 + 31.25 = 50 W</span> — وهذا هو ميزان القدرة الذي يكشف أي خطأ حسابي فورًا.',
        },
        {
          t: 'concept',
          title: 'قانون كيرشوف للجهد: جولة حول الحلقة',
          icon: '🔢',
          html: 'امشِ حول أي مسار مغلق وأنت تجمع الجهود بإشاراتها، ستعود إلى نقطة البداية بمجموع <b>صفر</b>. هذا هو <span class="term">قانون كيرشوف للجهد <i>Kirchhoff Voltage Law</i></span>. وبصيغة الورشة: <b>جهد المصدر يساوي مجموع هبوط الجهد على مقاومات المسار</b>. وكل <span class="term">هبوط جهد <i>Voltage Drop</i></span> ينشأ بقطبية معاكسة للمصدر، فيستهلك جهده حتى ينتهي عند الصفر.',
        },
        {
          t: 'formula',
          name: 'قانون كيرشوف للجهد (KVL)',
          expr: 'V<sub>S</sub> = V<sub>1</sub> + V<sub>2</sub> + V<sub>3</sub> + …',
          terms: [
            { sym: 'V_S', ar: 'جهد المصدر في المسار المغلق', unit: 'V' },
            { sym: 'V_1..V_n', ar: 'هبوط الجهد على كل مقاومة', unit: 'V' },
          ],
          note: 'الصيغة الجبرية المكافئة: <b>مجموع الجهود حول أي مسار مغلق = صفر</b>. مثال (5) بالحقيبة: <span class="ltr">E = 10 V</span> و<span class="ltr">V1 = 5 V</span> و<span class="ltr">V2 = 2 V</span> ⟵ <span class="ltr">V3 = 10 − 5 − 2 = 3 V</span>.',
        },
        {
          t: 'order',
          title: 'رتّب خطوات حل مثال (6): E = 54 V وV3 = 15 V وV1 = 18 V وR2 = 7 Ω',
          items: [
            'بـ KVL: V2 = 54 − 18 − 15 = 21 V',
            'بقانون أوم على R2: I = 21 ÷ 7 = 3 A',
            'المقاومة R1 = V1 ÷ I = 18 ÷ 3 = 6 Ω',
            'المقاومة R3 = V3 ÷ I = 15 ÷ 3 = 5 Ω',
          ],
        },
        {
          t: 'formula',
          name: 'مجزئ الجهد',
          expr: 'V<sub>X</sub> = ( R<sub>X</sub> ÷ R<sub>T</sub> ) × V<sub>S</sub>',
          terms: [
            { sym: 'V_X', ar: 'الجهد على المقاومة المطلوبة', unit: 'V' },
            { sym: 'R_X', ar: 'قيمة المقاومة المطلوبة', unit: 'Ω' },
            { sym: 'R_T', ar: 'المقاومة الكلية للمسار', unit: 'Ω' },
            { sym: 'V_S', ar: 'جهد المصدر', unit: 'V' },
          ],
          note: 'فائدتها أنها تعطي الجهد <b>دون حساب التيار أصلًا</b>. تحقّق من مثال (2): <span class="ltr">V3 = (5 ÷ 8) × 20 = 12.5 V</span> — نفس النتيجة تمامًا.',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: ماذا يثبت وماذا يتغيّر في التوالي؟',
          cards: [
            { front: 'التيار I', back: 'ثابت في كل عناصر المسار مهما اختلفت المقاومات — لأن المسار واحد ولا مفرّ للإلكترونات منه.' },
            { front: 'الجهد V', back: 'يتجزأ على المقاومات بنسبة قيمها: الأكبر مقاومةً تأخذ النصيب الأكبر من جهد المصدر.' },
            { front: 'المقاومة R_T', back: 'تكبر بإضافة أي مقاومة جديدة، فتنخفض قيمة التيار في المسار كله بالمقابل.' },
            { front: 'مصدران متعاكسان', back: 'توصيل Series-Opposing يطرح الجهدين: <span class="ltr">50 V</span> مع <span class="ltr">12.5 V</span> معكوسة تعطي <span class="ltr">37.5 V</span> فعّالة فقط.' },
          ],
        },
        {
          t: 'tip',
          html: '🛠 في الورشة: عناصر الحماية والتحكم (المصهر والقاطع وتلامسات الإيقاف) تُوصَّل <b>دائمًا على التوالي</b> مع الحمل — لأن فتح أي عنصر منها يقطع المسار الوحيد فيتوقف كل شيء. ولهذا أيضًا يُوصَّل <span class="term">الأميتر <i>Ammeter</i></span> على التوالي: ليصير جزءًا من المسار الذي يقيسه. أما إن قِسْتَ جهد الطرفين المفتوحين لمصهر محترق فستقرأ <b>جهد المصدر كاملًا</b> عليه، وهذه أسرع علامة تشخيصية لديك.',
        },
        {
          t: 'sim',
          sim: 'sim-series-parallel',
          title: 'مقعد التوالي والتوازي والمركّب',
          desc: 'ثلاث مقاومات بنمط توصيل قابل للتبديل، أميتر لكل فرع وفولتميتر لكل عنصر مع تحقق آلي من كيرشوف',
          missions: [
            { id: 'm1', text: 'أعِد مثال التوالي (2): <span class="ltr">20 V</span> مع <span class="ltr">2/1/5 Ω</span> ⟵ <span class="ltr">I=2.5 A</span> و<span class="ltr">V=5/2.5/12.5 V</span> و<span class="ltr">P=50 W</span> بخطأ <span class="ltr">±2%</span>' },
          ],
        },
        { t: 'quiz', ref: 'u2l1check' },
      ],
    },

    // ------------------------------------------------------------
    // u2l2 — التوازي و KCL ومجزئ التيار
    // ------------------------------------------------------------
    {
      id: 'u2l2',
      title: 'التوازي وKCL ومجزئ التيار',
      minutes: 14,
      concepts: ['parallel-circuit', 'kcl', 'current-divider'],
      blocks: [
        {
          t: 'concept',
          title: 'لماذا لا تُطفئ لمبةٌ محترقة بيتك كله؟',
          icon: '💡',
          html: 'لأن مصابيح المنزل موصولة <span class="term">على التوازي <i>Parallel</i></span>: كل فرع بين <b>النقطتين نفسيهما</b>، فله <b>جهد المصدر كاملًا</b> ومساره الخاص. انقطاع فرع لا يمس بقية الفروع.<ul><li>الجهد واحد على كل الفروع، والتيار هو الذي يتوزع بينها.</li><li>كل فرع جديد يفتح طريقًا إضافيًا، فتنخفض المقاومة الكلية.</li></ul>',
        },
        {
          t: 'figure',
          caption: 'مثال (4) من الحقيبة: مصدر <span class="ltr">27 V</span> على فرعين <span class="ltr">9 Ω</span> و<span class="ltr">18 Ω</span> — الجهد واحد والتيار ينقسم',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><line x1="60" y1="60" x2="340" y2="60" stroke="var(--c-border2)" stroke-width="3"/><line x1="60" y1="200" x2="340" y2="200" stroke="var(--c-border2)" stroke-width="3"/><line x1="60" y1="60" x2="60" y2="200" stroke="var(--c-border2)" stroke-width="3"/><line x1="46" y1="112" x2="74" y2="112" stroke="var(--c-amber)" stroke-width="5"/><line x1="54" y1="128" x2="66" y2="128" stroke="var(--c-amber)" stroke-width="5"/><line x1="46" y1="144" x2="74" y2="144" stroke="var(--c-amber)" stroke-width="5"/><text x="60" y="228" text-anchor="middle" fill="var(--c-amber)" font-size="15" font-weight="bold">E = 27 V</text><line x1="200" y1="60" x2="200" y2="200" stroke="var(--c-border2)" stroke-width="3"/><rect x="182" y="106" width="36" height="48" rx="4" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><text x="200" y="42" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">R1 = 9 &#937;</text><text x="200" y="232" text-anchor="middle" fill="var(--c-ok)" font-size="14" font-weight="bold">I1 = 3 A</text><line x1="320" y1="60" x2="320" y2="200" stroke="var(--c-border2)" stroke-width="3"/><rect x="302" y="106" width="36" height="48" rx="4" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><text x="320" y="42" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">R2 = 18 &#937;</text><text x="320" y="232" text-anchor="middle" fill="var(--c-ok)" font-size="14" font-weight="bold">I2 = 1.5 A</text><circle cx="200" cy="60" r="5" fill="var(--c-warn)"/><circle cx="320" cy="60" r="5" fill="var(--c-warn)"/><text x="130" y="46" text-anchor="middle" fill="var(--c-warn)" font-size="14" font-weight="bold">Is = 4.5 A</text><text x="130" y="130" text-anchor="middle" fill="var(--c-text2)" font-size="13">الجهد نفسه</text><text x="130" y="150" text-anchor="middle" fill="var(--c-text2)" font-size="13">على كل فرع</text></svg>',
        },
        {
          t: 'formula',
          name: 'المقاومة الكلية في التوازي',
          expr: 'G<sub>T</sub> = 1 ÷ R<sub>T</sub> = 1÷R<sub>1</sub> + 1÷R<sub>2</sub> + … + 1÷R<sub>n</sub>',
          terms: [
            { sym: 'R_T', ar: 'المقاومة الكلية المكافئة', unit: 'Ω' },
            { sym: 'R_1..R_n', ar: 'مقاومات الفروع', unit: 'Ω' },
            { sym: 'G_T', ar: 'الموصلية الكلية وهي مقلوب R_T', unit: 'S' },
          ],
          note: 'اختصارات جاهزة: لمقاومتين <b>R<sub>T</sub> = (R<sub>1</sub>×R<sub>2</sub>) ÷ (R<sub>1</sub>+R<sub>2</sub>)</b>، ولمقاومات متساوية <b>R<sub>T</sub> = R ÷ n</b>. والنتيجة دائمًا <b>أصغر من أصغر فرع</b>.',
        },
        {
          t: 'example',
          title: 'مثال (1) من الحقيبة: ثلاثة فروع 2Ω و4Ω و5Ω',
          given: ['<span class="ltr">R1 = 2 Ω</span>', '<span class="ltr">R2 = 4 Ω</span>', '<span class="ltr">R3 = 5 Ω</span> موصولة كلها على التوازي'],
          steps: [
            'اجمع المقلوبات: <span class="ltr">1/2 + 1/4 + 1/5 = 0.95 S</span> وهذه هي الموصلية الكلية <span class="ltr">G_T</span>',
            'اقلب الناتج: <span class="ltr">R_T = 1 ÷ 0.95 = 1.053 Ω</span>',
          ],
          answer: '<span class="ltr">G_T = 0.95 S</span> و<span class="ltr">R_T = 1.053 Ω</span> — لاحظ أنها أصغر من <span class="ltr">2 Ω</span>، أصغر الفروع.',
        },
        {
          t: 'concept',
          title: 'قانون كيرشوف للتيار: العقدة لا تخزّن شيئًا',
          icon: '🎯',
          html: 'عند أي <span class="term">عقدة <i>Node</i></span> — وهي نقطة يلتقي فيها أكثر من فرعين — يخرج ما دخل بالضبط. هذا هو <span class="term">قانون كيرشوف للتيار <i>Kirchhoff Current Law</i></span>: <b>مجموع التيارات الداخلة = مجموع التيارات الخارجة</b>. مثال (6) بالحقيبة: يدخل العقدة <span class="ltr">4 A</span> و<span class="ltr">3 A</span> فيخرج منها <span class="ltr">7 A</span>، ثم تتفرع إلى <span class="ltr">1 A</span> و<span class="ltr">6 A</span>.',
        },
        {
          t: 'formula',
          name: 'مجزئ التيار',
          expr: 'I<sub>X</sub> = I × ( R<sub>T</sub> ÷ R<sub>X</sub> )',
          terms: [
            { sym: 'I_X', ar: 'تيار الفرع المطلوب', unit: 'A' },
            { sym: 'I', ar: 'التيار الكلي الداخل إلى العقدة', unit: 'A' },
            { sym: 'R_T', ar: 'المقاومة الكلية للفروع المتوازية', unit: 'Ω' },
            { sym: 'R_X', ar: 'مقاومة الفرع المطلوب', unit: 'Ω' },
          ],
          note: 'ولفرعين فقط تُكتب <b>I<sub>1</sub> = [ R<sub>2</sub> ÷ (R<sub>1</sub>+R<sub>2</sub>) ] × I</b>. مثال (7): <span class="ltr">I = 12 A</span> على <span class="ltr">2 Ω</span> و<span class="ltr">4 Ω</span> ⟵ <span class="ltr">I1 = 8 A</span> و<span class="ltr">I2 = 4 A</span>: الفرع الأقل مقاومة يأخذ النصيب الأكبر.',
        },
        {
          t: 'example',
          title: 'مثال (4) من الحقيبة: التيارات والقدرات',
          given: ['<span class="ltr">E = 27 V</span>', '<span class="ltr">R1 = 9 Ω</span> و<span class="ltr">R2 = 18 Ω</span> على التوازي'],
          steps: [
            'المكافئة: <span class="ltr">R_T = (9 × 18) ÷ 27 = 6 Ω</span>، وتيار المنبع <span class="ltr">Is = 27 ÷ 6 = 4.5 A</span>',
            'تيارا الفرعين بالجهد المشترك: <span class="ltr">I1 = 27 ÷ 9 = 3 A</span> و<span class="ltr">I2 = 27 ÷ 18 = 1.5 A</span>',
            'القدرات: <span class="ltr">P1 = 27 × 3 = 81 W</span> و<span class="ltr">P2 = 27 × 1.5 = 40.5 W</span> و<span class="ltr">Ps = 27 × 4.5 = 121.5 W</span>',
          ],
          answer: 'تحقّقان في سطر واحد: <span class="ltr">3 + 1.5 = 4.5 A</span> (كيرشوف) و<span class="ltr">81 + 40.5 = 121.5 W</span> (ميزان القدرة).',
        },
        {
          t: 'match',
          title: 'وصّل كل حالة بنتيجتها في دائرة التوازي',
          pairs: [
            { a: 'أضفتَ فرعًا جديدًا للدائرة', b: 'تنخفض R_T ويرتفع تيار المنبع' },
            { a: 'أربعة فروع متساوية <span class="ltr">2 Ω</span>', b: 'R_T = 2 ÷ 4 = 0.5 Ω' },
            { a: 'فرع مقاومته كبيرة جدًا', b: 'تيار مهمل لا يكاد يظهر في القياس' },
            { a: 'انقطاع أحد الفروع', b: 'بقية الفروع تعمل بجهدها كاملًا' },
          ],
        },
        {
          t: 'tip',
          html: '⚠ في الورشة: يُوصَّل <span class="term">الفولتميتر <i>Voltmeter</i></span> على التوازي مع العنصر لأن التوازي يعني «الجهد نفسه». وانتبه: أي فرع تضيفه على لوحة التوزيع يزيد <b>تيار المصدر</b> ولا يزيد الجهد — ولهذا يفصل القاطع الرئيس عند تشغيل حِمل إضافي رغم أن كل جهاز على حدة يعمل بلا مشكلة. اجمع تيارات الفروع قبل أن تُضيف حِملًا جديدًا.',
        },
        {
          t: 'sim',
          sim: 'sim-series-parallel',
          title: 'مقعد التوالي والتوازي والمركّب',
          desc: 'ثلاث مقاومات بنمط توصيل قابل للتبديل، أميتر لكل فرع وفولتميتر لكل عنصر مع تحقق آلي من كيرشوف',
          missions: [
            { id: 'm2', text: 'أعِد مثال التوازي (1): <span class="ltr">2∥4∥5 Ω</span> ⟵ <span class="ltr">G_T=0.95 S</span> و<span class="ltr">R_T=1.053 Ω ±2%</span>' },
            { id: 'm4', text: 'أعِد تمرين <span class="ltr">48 V</span> مع <span class="ltr">8 kΩ ∥ 24 kΩ</span> ⟵ <span class="ltr">I₁=6 mA</span> و<span class="ltr">I₂=2 mA</span> و<span class="ltr">I_s=8 mA ±2%</span>' },
          ],
        },
        { t: 'quiz', ref: 'u2l2check' },
      ],
    },

    // ------------------------------------------------------------
    // u2l3 — التوصيل المركب والقدرة والكفاءة
    // ------------------------------------------------------------
    {
      id: 'u2l3',
      title: 'التوصيل المركب والقدرة والكفاءة',
      minutes: 16,
      concepts: ['series-parallel-network', 'open-short-fault', 'efficiency'],
      blocks: [
        {
          t: 'concept',
          title: 'شبكة معقّدة… تُحلّ بخطوة واحدة مكرّرة',
          icon: '🔥',
          html: 'لوحة الآلة أمامك فيها عشر مقاومات متشابكة، ولا تعرف من أين تبدأ. الحيلة كلها في <span class="term">التوصيل المركب <i>Series-Parallel Network</i></span>: <b>ابدأ من أبعد مجموعة متوازية عن المصدر، اختزلها إلى مقاومة واحدة، ثم اجمع ما صار على التوالي</b>. كرّر حتى تبقى مقاومة واحدة يراها المصدر — ثم ارجع بالخطوات نفسها لتوزيع الجهود والتيارات.',
        },
        {
          t: 'figure',
          caption: 'المثال المحلول بالحقيبة: <span class="ltr">15 V</span> مع <span class="ltr">1 Ω</span> على التوالي مع <span class="ltr">(2 Ω ∥ 6 Ω)</span>',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><line x1="55" y1="60" x2="345" y2="60" stroke="var(--c-border2)" stroke-width="3"/><line x1="55" y1="200" x2="345" y2="200" stroke="var(--c-border2)" stroke-width="3"/><line x1="55" y1="60" x2="55" y2="200" stroke="var(--c-border2)" stroke-width="3"/><line x1="41" y1="112" x2="69" y2="112" stroke="var(--c-amber)" stroke-width="5"/><line x1="49" y1="128" x2="61" y2="128" stroke="var(--c-amber)" stroke-width="5"/><line x1="41" y1="144" x2="69" y2="144" stroke="var(--c-amber)" stroke-width="5"/><text x="55" y="228" text-anchor="middle" fill="var(--c-amber)" font-size="15" font-weight="bold">15 V</text><rect x="108" y="48" width="60" height="24" rx="4" fill="var(--c-surface2)" stroke="var(--c-water)" stroke-width="3"/><text x="138" y="36" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">1 &#937;</text><line x1="250" y1="60" x2="250" y2="200" stroke="var(--c-border2)" stroke-width="3"/><rect x="232" y="106" width="36" height="48" rx="4" fill="var(--c-surface2)" stroke="var(--c-water2)" stroke-width="3"/><text x="250" y="96" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">2 &#937;</text><line x1="330" y1="60" x2="330" y2="200" stroke="var(--c-border2)" stroke-width="3"/><rect x="312" y="106" width="36" height="48" rx="4" fill="var(--c-surface2)" stroke="var(--c-water2)" stroke-width="3"/><text x="330" y="96" text-anchor="middle" fill="var(--c-text)" font-size="14" font-weight="bold">6 &#937;</text><circle cx="250" cy="60" r="5" fill="var(--c-warn)"/><circle cx="330" cy="60" r="5" fill="var(--c-warn)"/><text x="205" y="36" text-anchor="middle" fill="var(--c-ok)" font-size="14" font-weight="bold">I = 6 A</text><text x="290" y="232" text-anchor="middle" fill="var(--c-text2)" font-size="13">مجموعة متوازية ⟵ 1.5 &#937;</text><text x="138" y="232" text-anchor="middle" fill="var(--c-text2)" font-size="13">RT = 2.5 &#937;</text></svg>',
        },
        {
          t: 'example',
          title: 'المثال المحلول: اختزال ثم قانون أوم',
          given: ['مصدر <span class="ltr">15 V</span>', 'مقاومة <span class="ltr">1 Ω</span> على التوالي', 'مجموعة متوازية <span class="ltr">2 Ω</span> و<span class="ltr">6 Ω</span>'],
          steps: [
            'اختزل المتوازيتين: <span class="ltr">(2 × 6) ÷ (2 + 6) = 12 ÷ 8 = 1.5 Ω</span>',
            'اجمع توالياً: <span class="ltr">R_T = 1 + 1.5 = 2.5 Ω</span>',
            'التيار الكلي: <span class="ltr">I = 15 ÷ 2.5 = 6 A</span>',
          ],
          answer: '<span class="ltr">R_T = 2.5 Ω</span> و<span class="ltr">I = 6 A</span> — ثم يتوزع هذا التيار على الفرعين بمجزئ التيار.',
        },
        {
          t: 'order',
          title: 'رتّب منهج الاختزال المتدرّج كما يُطبَّق على شبكة السلّم',
          items: [
            'ابدأ من الطرف الأبعد عن المصدر واختزل المجموعة المتوازية هناك',
            'اجمع ناتج الاختزال مع مقاومة التوالي التي تسبقه',
            'كرّر الخطوتين عقدةً بعد عقدة حتى تبقى مقاومة كلية واحدة',
            'احسب تيار المصدر ثم ارجع للأمام موزّعًا الجهود والتيارات',
          ],
        },
        {
          t: 'concept',
          title: 'الفتح والقصر: عطلان متعاكسان تمامًا',
          icon: '⚠',
          html: 'كل أعطال الدوائر تقريبًا ترجع إلى حالتين: <span class="term">الدائرة المفتوحة <i>Open Circuit</i></span> — انقطاع في المسار فالتيار صفر ويظهر <b>جهد المصدر كاملًا على موضع الفتح</b>؛ و<span class="term">القصر <i>Short Circuit</i></span> — مسار مقاومته شبه صفرية فيصير <b>الجهد صفرًا عليه والتيار أقصى ما يمكن</b>. حفظ هاتين البصمتين يختصر نصف زمن التشخيص.',
        },
        {
          t: 'example',
          title: 'تمرين (11) من الحقيبة: جهد الحمل قبل القصر وبعده',
          given: [
            'مصدر <span class="ltr">9 V</span> على التوالي مع <span class="ltr">2.2 kΩ</span> ثم <span class="ltr">3.3 kΩ</span>',
            'حمل <span class="ltr">47 kΩ</span> يُقاس عليه جهد الحمل <span class="ltr">V_L</span>',
          ],
          steps: [
            'قبل العطل: <span class="ltr">R_T = 2.2 + 3.3 + 47 = 52.5 kΩ</span> و<span class="ltr">I = 9 ÷ 52.5k = 0.171 mA</span> ⟵ <span class="ltr">V_L = 0.171m × 47k ≈ 8.06 V</span>',
            'بعد قصر <span class="ltr">2.2 kΩ</span>: <span class="ltr">R_T = 3.3 + 47 = 50.3 kΩ</span> ⟵ <span class="ltr">V_L ≈ 8.41 V</span>',
            'ولو قُصِر طرفا الحمل نفسه: <span class="ltr">I = 9 ÷ 5.5k ≈ 1.64 mA</span> و<span class="ltr">V_L = 0 V</span>',
          ],
          answer: 'قصر مقاومة في المسار <b>يرفع</b> جهد الحمل قليلًا، أما قصر الحمل نفسه فيُسقط جهده إلى الصفر ويقفز التيار — فرق جوهري في القراءة.',
        },
        {
          t: 'formula',
          name: 'الكفاية والقدرة المفقودة',
          expr: 'η = P<sub>out</sub> ÷ P<sub>in</sub> = P<sub>out</sub> ÷ ( U × I )',
          terms: [
            { sym: 'η', ar: 'الكفاية وتُقرأ إيتا', unit: '—' },
            { sym: 'P_out', ar: 'القدرة الخارجة المفيدة', unit: 'W' },
            { sym: 'P_in', ar: 'القدرة الداخلة من المصدر', unit: 'W' },
            { sym: 'U', ar: 'جهد التغذية', unit: 'V' },
            { sym: 'I', ar: 'تيار التغذية', unit: 'A' },
          ],
          note: 'والفاقد هو الفرق: <b>P<sub>L</sub> = P<sub>in</sub> − P<sub>out</sub></b>، ويتحول كله حرارةً في الملفات والمحامل — أي زيادة مفاجئة فيه إنذار عطل.',
        },
        {
          t: 'example',
          title: 'تمرين (2) من الحقيبة: كفاءة محرك كهربائي',
          given: ['القدرة الخارجة <span class="ltr">P_out = 850 W</span>', 'جهد التغذية <span class="ltr">U = 120 V</span>', 'تيار التغذية <span class="ltr">I = 8 A</span>'],
          steps: [
            'القدرة الداخلة: <span class="ltr">P_in = 120 × 8 = 960 W</span>',
            'الكفاية: <span class="ltr">η = 850 ÷ 960 = 0.885</span> أي <span class="ltr">88.5%</span>',
            'الفاقد حرارةً: <span class="ltr">960 − 850 = 110 W</span>',
          ],
          answer: '<span class="ltr">η ≈ 88.5%</span> و<span class="ltr">P_L = 110 W</span> — وهي قيمة معقولة لمحرك بهذا الحجم، فإن هبطت مع الزمن فتش عن المحامل والمحاذاة.',
        },
        {
          t: 'tip',
          html: '🔍 في الورشة: مقاومة كابل التغذية نفسها تُشكّل مقاومة توالٍ مع المحرك. كلما طال الكابل زاد هبوط الجهد عليه ونقص الجهد الواصل للمحرك، فيسحب المحرك تيارًا أعلى ويسخن. قِس الجهد <b>على أطراف المحرك</b> لا على اللوحة، وإن وجدت فرقًا يتجاوز <span class="ltr">5%</span> فالمشكلة في مقطع الكابل أو في طرف مرتخٍ مؤكسد.',
        },
        {
          t: 'sim',
          sim: 'sim-series-parallel',
          title: 'مقعد التوالي والتوازي والمركّب',
          desc: 'ثلاث مقاومات بنمط توصيل قابل للتبديل، أميتر لكل فرع وفولتميتر لكل عنصر مع تحقق آلي من كيرشوف',
          missions: [
            { id: 'm3', text: 'أعِد المثال المركّب: <span class="ltr">15 V</span> مع <span class="ltr">1 Ω</span> توالياً مع <span class="ltr">(2∥6)</span> ⟵ <span class="ltr">R_T=2.5 Ω</span> و<span class="ltr">I=6 A ±2%</span>' },
            { id: 'm5', text: 'أثبت انحفاظ القدرة في النمطين: <span class="ltr">|ΣP_i − P_del| ≤ 1%</span>' },
          ],
        },
        { t: 'quiz', ref: 'u2l3check' },
      ],
    },
  ],
};

// ================================================================
// بنوك أسئلة الوحدة الثانية
// ================================================================
export const U2_QUIZZES = {
  // الاختبار القبلي للوحدة — يغطي الدروس الثلاثة
  u2pre: {
    title: 'قبل الانطلاق: أين أنت من قوانين الدوائر؟',
    questions: [
      {
        t: 'mc',
        q: 'دائرة توالٍ مصدرها <span class="ltr">20 V</span> وفيها <span class="ltr">2 Ω</span> و<span class="ltr">1 Ω</span> و<span class="ltr">5 Ω</span>. كم التيار المار فيها؟',
        opts: ['<span class="ltr">2.5 A</span>', '<span class="ltr">10 A</span>', '<span class="ltr">4 A</span>', '<span class="ltr">1.6 A</span>'],
        correct: 0,
        why: 'اجمع مقاومات المسار الواحد أولًا: <span class="ltr">2 + 1 + 5 = 8 Ω</span>، ثم طبّق قانون أوم: <span class="ltr">I = 20 ÷ 8 = 2.5 A</span>. الخطأ الشائع هو القسمة على مقاومة واحدة بدل المقاومة الكلية.',
        unit: 'u2',
        concept: 'series-circuit',
      },
      {
        t: 'mc',
        q: 'في مسار مغلق: <span class="ltr">E = 10 V</span> و<span class="ltr">V1 = 5 V</span> و<span class="ltr">V2 = 2 V</span>. كم <span class="ltr">V3</span>؟',
        opts: ['<span class="ltr">3 V</span>', '<span class="ltr">17 V</span>', '<span class="ltr">7 V</span>', '<span class="ltr">5 V</span>'],
        correct: 0,
        why: 'قانون كيرشوف للجهد يقول إن جهد المصدر يساوي مجموع هبوط الجهد على المسار: <span class="ltr">V3 = 10 − 5 − 2 = 3 V</span>. لو جمعتَ بدل الطرح لخرجتَ بجهد أكبر من المصدر وهذا مستحيل.',
        unit: 'u2',
        concept: 'kvl',
      },
      {
        t: 'mc',
        q: 'ثلاث مقاومات <span class="ltr">2 Ω</span> و<span class="ltr">4 Ω</span> و<span class="ltr">5 Ω</span> على التوازي. ما المقاومة الكلية؟',
        opts: ['<span class="ltr">11.00 Ω</span>', '<span class="ltr">3.667 Ω</span>', '<span class="ltr">1.053 Ω</span>', '<span class="ltr">0.950 Ω</span>'],
        correct: 2,
        why: 'اجمع المقلوبات: <span class="ltr">1/2 + 1/4 + 1/5 = 0.95 S</span> وهي الموصلية، ثم اقلبها: <span class="ltr">R_T = 1 ÷ 0.95 = 1.053 Ω</span>. تذكّر أن الناتج لا بد أن يكون أصغر من أصغر فرع.',
        unit: 'u2',
        concept: 'parallel-circuit',
      },
      {
        t: 'mc',
        q: 'عقدة يدخلها تيار <span class="ltr">10 A</span> ويخرج منها فرعان أحدهما يحمل <span class="ltr">6 A</span>. كم تيار الفرع الآخر؟',
        opts: ['<span class="ltr">4 A</span>', '<span class="ltr">16 A</span>', '<span class="ltr">10 A</span>', '<span class="ltr">6 A</span>'],
        correct: 0,
        why: 'العقدة لا تخزّن تيارًا، فمجموع الداخل يساوي مجموع الخارج: <span class="ltr">10 − 6 = 4 A</span>. هذا هو قانون كيرشوف للتيار في أبسط صوره.',
        unit: 'u2',
        concept: 'kcl',
      },
      {
        t: 'mc',
        q: 'مصدر <span class="ltr">15 V</span> ومقاومة <span class="ltr">1 Ω</span> على التوالي مع مجموعة <span class="ltr">2 Ω ∥ 6 Ω</span>. كم التيار المسحوب من المصدر؟',
        opts: ['<span class="ltr">6 A</span>', '<span class="ltr">1.67 A</span>', '<span class="ltr">15 A</span>', '<span class="ltr">3.75 A</span>'],
        correct: 0,
        why: 'اختزل المتوازيتين أولًا: <span class="ltr">(2 × 6) ÷ 8 = 1.5 Ω</span>، ثم اجمعها توالياً: <span class="ltr">R_T = 2.5 Ω</span>، فيكون <span class="ltr">I = 15 ÷ 2.5 = 6 A</span>.',
        unit: 'u2',
        concept: 'series-parallel-network',
      },
      {
        t: 'mc',
        q: 'محرك خارجه <span class="ltr">850 W</span> ويتغذى بـ<span class="ltr">120 V</span> و<span class="ltr">8 A</span>. كم كفايته؟',
        opts: ['<span class="ltr">70.8%</span>', '<span class="ltr">88.5%</span>', '<span class="ltr">94.4%</span>', '<span class="ltr">113%</span>'],
        correct: 1,
        why: 'القدرة الداخلة <span class="ltr">120 × 8 = 960 W</span>، والكفاية <span class="ltr">850 ÷ 960 = 88.5%</span>، والفاقد حرارةً <span class="ltr">110 W</span>. الكفاية لا تتجاوز <span class="ltr">100%</span> أبدًا.',
        unit: 'u2',
        concept: 'efficiency',
      },
    ],
  },

  // نقطة تفتيش الدرس الأول
  u2l1check: {
    title: 'نقطة تفتيش: التوالي وKVL ومجزئ الجهد',
    questions: [
      {
        t: 'mc',
        q: 'ثلاث مقاومات مختلفة القيم موصولة على التوالي. أي واحدة منها يمر بها تيار أكبر؟',
        opts: [
          'التيار متساوٍ في الثلاث لأن المسار واحد',
          'المقاومة الصغرى لأنها تعيق مرور التيار أقل',
          'المقاومة الكبرى لأنها تسحب جهدًا أكبر عليها',
          'المقاومة الأقرب للقطب الموجب للمصدر',
        ],
        correct: 0,
        why: 'الوهم الشائع أن المقاومة الأصغر «تمرّر أكثر». في التوالي لا يوجد إلا مسار واحد، فالتيار نفسه يعبر كل العناصر؛ الذي يختلف هو هبوط الجهد على كل مقاومة بحسب قيمتها.',
        unit: 'u2',
        concept: 'series-circuit',
      },
      {
        t: 'mc',
        q: 'بمجزئ الجهد في مثال (2): <span class="ltr">20 V</span> على <span class="ltr">2/1/5 Ω</span>. كم الجهد على مقاومة <span class="ltr">5 Ω</span>؟',
        opts: ['<span class="ltr">2.5 V</span>', '<span class="ltr">5 V</span>', '<span class="ltr">12.5 V</span>', '<span class="ltr">20 V</span>'],
        correct: 2,
        why: 'صيغة مجزئ الجهد: <span class="ltr">V_X = (R_X ÷ R_T) × V_S = (5 ÷ 8) × 20 = 12.5 V</span> — دون حاجة لحساب التيار أصلًا. المقاومة الأكبر تأخذ النصيب الأكبر من جهد المصدر.',
        unit: 'u2',
        concept: 'voltage-divider',
      },
      {
        t: 'tf',
        q: 'في أي مسار مغلق يساوي جهد المصدر مجموع هبوط الجهد على مقاومات المسار.',
        correct: true,
        why: 'صحيح، وهذه هي الصيغة العملية لقانون كيرشوف للجهد. وهي أداتك في الورشة: إن لم يكتمل المجموع فهناك عنصر مفتوح ابتلع الجهد الناقص.',
        unit: 'u2',
        concept: 'kvl',
      },
      {
        t: 'mc',
        q: 'دائرة توالٍ فيها <span class="ltr">R_T = 12 kΩ</span> و<span class="ltr">R2 = 4 kΩ</span> و<span class="ltr">R3 = 6 kΩ</span>. كم <span class="ltr">R1</span>؟',
        opts: ['<span class="ltr">2 kΩ</span>', '<span class="ltr">22 kΩ</span>', '<span class="ltr">10 kΩ</span>', '<span class="ltr">12 kΩ</span>'],
        correct: 0,
        why: 'في التوالي المقاومة الكلية مجموع بسيط، فالمجهولة هي الباقي: <span class="ltr">R1 = 12 − 4 − 6 = 2 kΩ</span>.',
        unit: 'u2',
        concept: 'series-circuit',
      },
    ],
  },

  // نقطة تفتيش الدرس الثاني
  u2l2check: {
    title: 'نقطة تفتيش: التوازي وKCL ومجزئ التيار',
    questions: [
      {
        t: 'mc',
        q: 'أربع مقاومات متساوية قيمة كل منها <span class="ltr">2 Ω</span> موصولة على التوازي. كم <span class="ltr">R_T</span>؟',
        opts: ['<span class="ltr">8.0 Ω</span>', '<span class="ltr">2.0 Ω</span>', '<span class="ltr">0.5 Ω</span>', '<span class="ltr">4.0 Ω</span>'],
        correct: 2,
        why: 'عند تساوي الفروع تُختصر القاعدة إلى <span class="ltr">R_T = R ÷ n = 2 ÷ 4 = 0.5 Ω</span>. لاحظ أنها أصغر من أي فرع منفرد — وهذه بصمة التوازي دائمًا.',
        unit: 'u2',
        concept: 'parallel-circuit',
      },
      {
        t: 'mc',
        q: 'فرعان <span class="ltr">1 kΩ</span> و<span class="ltr">100 kΩ</span> على مصدر <span class="ltr">12 V</span>. ما المقارنة الصحيحة بين تياريهما؟',
        opts: [
          'فرع <span class="ltr">1 kΩ</span> يحمل تيارًا أكبر بمئة ضعف',
          'فرع <span class="ltr">100 kΩ</span> يحمل تيارًا أكبر بمئة ضعف',
          'التياران متساويان لتساوي الجهد عليهما',
          'فرع <span class="ltr">1 kΩ</span> يحمل تيارًا أكبر بعشرة أضعاف',
        ],
        correct: 0,
        why: 'الجهد واحد على الفرعين، فالتيار يتناسب عكسًا مع المقاومة: <span class="ltr">12 mA</span> مقابل <span class="ltr">0.12 mA</span>، أي مئة ضعف. تساوي الجهد لا يعني تساوي التيار.',
        unit: 'u2',
        concept: 'current-divider',
      },
      {
        t: 'tf',
        q: 'في دائرة التوازي يتساوى التيار في كل الفروع لأن الجهد واحد عليها.',
        correct: false,
        why: 'خطأ: تساوي الجهد على الفروع لا يعني تساوي التيار فيها؛ التيار يتوزع عكسيًا مع قيمة كل مقاومة (مجزئ التيار)، فالفرع الأصغر مقاومةً يأخذ التيار الأكبر. المتساوي في التوازي هو الجهد لا التيار.',
        unit: 'u2',
        concept: 'kcl',
      },
      {
        t: 'mc',
        q: 'مصدر <span class="ltr">27 V</span> على فرعين <span class="ltr">9 Ω</span> و<span class="ltr">18 Ω</span>. كم تيار المنبع <span class="ltr">Is</span>؟',
        opts: ['<span class="ltr">1 A</span>', '<span class="ltr">4.5 A</span>', '<span class="ltr">3 A</span>', '<span class="ltr">1.5 A</span>'],
        correct: 1,
        why: 'المكافئة <span class="ltr">(9 × 18) ÷ 27 = 6 Ω</span> فيكون <span class="ltr">Is = 27 ÷ 6 = 4.5 A</span>. والتحقق بكيرشوف: <span class="ltr">3 + 1.5 = 4.5 A</span>.',
        unit: 'u2',
        concept: 'parallel-circuit',
      },
    ],
  },

  // نقطة تفتيش الدرس الثالث
  u2l3check: {
    title: 'نقطة تفتيش: التوصيل المركب والقدرة والكفاءة',
    questions: [
      {
        t: 'mc',
        q: 'مقاومة <span class="ltr">1 Ω</span> على التوالي مع مجموعة <span class="ltr">2 Ω ∥ 6 Ω</span>. كم المقاومة الكلية؟',
        opts: ['<span class="ltr">9 Ω</span>', '<span class="ltr">2.5 Ω</span>', '<span class="ltr">1.5 Ω</span>', '<span class="ltr">4 Ω</span>'],
        correct: 1,
        why: 'ابدأ بالمجموعة المتوازية: <span class="ltr">(2 × 6) ÷ (2 + 6) = 1.5 Ω</span>، ثم أضف مقاومة التوالي: <span class="ltr">1 + 1.5 = 2.5 Ω</span>. الخطأ الشائع جمع الثلاثة مباشرة.',
        unit: 'u2',
        concept: 'series-parallel-network',
      },
      {
        t: 'mc',
        q: 'ما الفرق في قراءة الفولتميتر بين عنصر مفتوح وعنصر مقصور داخل دائرة تعمل؟',
        opts: [
          'المفتوح يظهر عليه جهد المصدر كاملًا والمقصور يظهر عليه صفر',
          'المفتوح يظهر عليه صفر والمقصور يظهر عليه جهد المصدر كاملًا',
          'كلاهما يظهر عليه نصف جهد المصدر مع اختلاف التيار فقط',
          'كلاهما يظهر عليه صفر ولا يفرّق الفولتميتر بينهما إطلاقًا',
        ],
        correct: 0,
        why: 'الفتح يوقف التيار فيتراكم جهد المصدر كله على موضع الانقطاع، والقصر يجعل مقاومة العنصر صفرًا فلا ينشأ عليه هبوط جهد. هاتان البصمتان هما مفتاح التشخيص السريع.',
        unit: 'u2',
        concept: 'open-short-fault',
      },
      {
        t: 'mc',
        q: 'محرك يسحب <span class="ltr">8 A</span> من <span class="ltr">120 V</span> ويعطي <span class="ltr">850 W</span>. كم القدرة المفقودة حرارةً؟',
        opts: ['<span class="ltr">960 W</span>', '<span class="ltr">110 W</span>', '<span class="ltr">1810 W</span>', '<span class="ltr">850 W</span>'],
        correct: 1,
        why: 'الداخلة <span class="ltr">120 × 8 = 960 W</span> والخارجة <span class="ltr">850 W</span>، فالفاقد هو الفرق: <span class="ltr">110 W</span> تتحول حرارةً في الملفات والمحامل، والكفاية <span class="ltr">88.5%</span>.',
        unit: 'u2',
        concept: 'efficiency',
      },
      {
        t: 'tf',
        q: 'حدوث قصر على مقاومة داخل مسار التغذية يرفع الجهد الواصل إلى الحمل قليلًا.',
        correct: true,
        why: 'صحيح: القصر يلغي هبوط الجهد على تلك المقاومة فيبقى نصيب أكبر للحمل. في تمرين (11) ارتفع <span class="ltr">V_L</span> من <span class="ltr">8.06 V</span> إلى <span class="ltr">8.41 V</span> بعد قصر <span class="ltr">2.2 kΩ</span>. أما قصر الحمل نفسه فيُسقط جهده إلى الصفر.',
        unit: 'u2',
        concept: 'open-short-fault',
      },
    ],
  },
};

// ================================================================
// أسئلة الوحدة الثانية في الاختبار التشخيصي الشامل
// ================================================================
export const U2_DIAG = [
  {
    t: 'mc',
    q: 'دائرة توالٍ <span class="ltr">20 V</span> فيها <span class="ltr">2 Ω</span> و<span class="ltr">1 Ω</span> و<span class="ltr">5 Ω</span>. كم الجهد على مقاومة <span class="ltr">5 Ω</span>؟',
    opts: ['<span class="ltr">4 V</span>', '<span class="ltr">12.5 V</span>', '<span class="ltr">20 V</span>', '<span class="ltr">10 V</span>'],
    correct: 1,
    why: 'التيار واحد في المسار: <span class="ltr">20 ÷ 8 = 2.5 A</span>، فالجهد على <span class="ltr">5 Ω</span> هو <span class="ltr">2.5 × 5 = 12.5 V</span>. أو مباشرة بمجزئ الجهد: <span class="ltr">(5 ÷ 8) × 20</span>.',
    unit: 'u2',
    concept: 'series-circuit',
  },
  {
    t: 'mc',
    q: 'مقاومتان <span class="ltr">2 Ω</span> و<span class="ltr">4 Ω</span> على التوازي. أي عبارة تصف المقاومة المكافئة؟',
    opts: [
      'أصغر من <span class="ltr">2 Ω</span> وتساوي <span class="ltr">1.33 Ω</span>',
      'بينهما تمامًا وتساوي <span class="ltr">3 Ω</span> بالضبط',
      'أكبر منهما وتساوي <span class="ltr">6 Ω</span> بالجمع',
      'تساوي <span class="ltr">2 Ω</span> أي قيمة الفرع الأصغر',
    ],
    correct: 0,
    why: 'قاعدة الفرعين: <span class="ltr">(2 × 4) ÷ (2 + 4) = 1.33 Ω</span>. كل فرع جديد يفتح مسارًا إضافيًا للتيار، فالمكافئة أصغر من أصغر فرع دائمًا ولا تكون بينهما ولا فوقهما.',
    unit: 'u2',
    concept: 'parallel-circuit',
  },
  {
    t: 'mc',
    q: 'أمامك شبكة: <span class="ltr">1 Ω</span> توالياً مع <span class="ltr">(2 Ω ∥ 6 Ω)</span> على مصدر <span class="ltr">15 V</span>. ما أول خطوة صحيحة؟',
    opts: [
      'اقسم جهد المصدر على عدد المقاومات الثلاث',
      'اجمع المقاومات الثلاث جمعًا مباشرًا',
      'اختزل المجموعة المتوازية إلى واحدة',
      'احسب تيار كل فرع قبل أي اختزال للشبكة',
    ],
    correct: 2,
    why: 'منهج الاختزال المتدرّج يبدأ دائمًا بالمجموعات المتوازية: <span class="ltr">(2 × 6) ÷ 8 = 1.5 Ω</span>، ثم تُجمع توالياً مع <span class="ltr">1 Ω</span> لتعطي <span class="ltr">2.5 Ω</span> ومنها <span class="ltr">I = 6 A</span>.',
    unit: 'u2',
    concept: 'series-parallel-network',
  },
];
