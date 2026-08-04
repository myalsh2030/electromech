// الوحدة الثالثة: الآلات الكهربائية — مقرر «كهرباء وإلكترونيات الآلات الميكانيكية» (مصيم 221)
// ملف بيانات خالص (ES Module) بدون أي منطق.
// المصادر: تفريغات الحقيبة T_c14..T_c17 (ص 118-153) + خريطة المقرر (بند 2 و5) + عقد المفاهيم data/concepts.js
// الدروس: u3l1 المولدات · u3l2 المحركات وبطاقتها وحمايتها · u3l3 المحول الكهربائي
// المحاكيات: sim-generator · sim-induction-motor · sim-transformer (نصوص المهام منقولة حرفيًا من js/sims/registry.js)

export const UNIT3 = {
  id: 'u3',
  title: 'الآلات الكهربائية',
  icon: 'cog',
  color: '#fbbf24',
  tagline: 'كيف يتحول الدوران إلى كهرباء… والكهرباء إلى دوران؟',
  lessons: [
    // ------------------------------------------------------------
    // u3l1 — المولدات الكهربائية (مستمر وتزامني)
    // ------------------------------------------------------------
    {
      id: 'u3l1',
      title: 'المولدات الكهربائية',
      minutes: 14,
      concepts: ['generated-emf', 'synchronous-speed', 'star-delta-relations'],
      blocks: [
        {
          t: 'concept',
          title: 'من أين تأتي الكهرباء أصلًا؟',
          icon: '⚡',
          html: 'أكثر من <b>98%</b> من كهرباء العالم تخرج من آلة واحدة: <span class="term">المولد التزامني <i>Synchronous Generator</i></span>. والفكرة كلها سطر واحد: <b>موصل يقطع خطوط مجال مغناطيسي فتتولد بين طرفيه قوة دافعة</b>. غيّر السرعة أو الفيض أو عدد اللفات — يتغير الجهد معك فورًا.',
        },
        {
          t: 'figure',
          caption: 'مبدأ عمل المولد: ملف يدور بين قطبين، والموحّد (حلقة مشقوقة) والفرش ينقلان الجهد المتولد إلى الدائرة الخارجية',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="200" y="22" text-anchor="middle" fill="var(--c-text)" font-size="15" font-weight="bold">مولد بسيط: ملف يدور بين قطبين</text><g stroke="var(--c-text2)" stroke-width="1.5" opacity="0.55"><line x1="70" y1="78" x2="216" y2="78"/><line x1="70" y1="108" x2="216" y2="108"/><line x1="70" y1="140" x2="216" y2="140"/><line x1="70" y1="170" x2="216" y2="170"/></g><rect x="22" y="52" width="46" height="140" rx="6" fill="var(--c-bad)" opacity="0.22" stroke="var(--c-bad)" stroke-width="2"/><text x="45" y="130" text-anchor="middle" fill="var(--c-bad)" font-size="22" font-weight="bold">N</text><rect x="218" y="52" width="46" height="140" rx="6" fill="var(--c-water)" opacity="0.22" stroke="var(--c-water)" stroke-width="2"/><text x="241" y="130" text-anchor="middle" fill="var(--c-water)" font-size="22" font-weight="bold">S</text><rect x="98" y="88" width="90" height="70" rx="5" fill="none" stroke="var(--c-amber)" stroke-width="4"/><line x1="188" y1="123" x2="286" y2="123" stroke="var(--c-text2)" stroke-width="3"/><ellipse cx="296" cy="112" rx="9" ry="16" fill="none" stroke="var(--c-amber)" stroke-width="3"/><ellipse cx="316" cy="112" rx="9" ry="16" fill="none" stroke="var(--c-amber)" stroke-width="3"/><rect x="290" y="82" width="12" height="14" rx="2" fill="var(--c-text2)"/><rect x="310" y="82" width="12" height="14" rx="2" fill="var(--c-text2)"/><polyline points="296,82 296,60 360,60 360,168" fill="none" stroke="var(--c-ok)" stroke-width="2"/><polyline points="316,82 316,72 340,72 340,168" fill="none" stroke="var(--c-ok)" stroke-width="2"/><circle cx="350" cy="182" r="15" fill="var(--c-amber)" opacity="0.3" stroke="var(--c-amber)" stroke-width="2"/><text x="130" y="212" text-anchor="middle" fill="var(--c-text2)" font-size="12">الملف الدوّار (المنتج)</text><text x="306" y="212" text-anchor="middle" fill="var(--c-text2)" font-size="12">الموحّد والفرش</text><text x="350" y="212" text-anchor="middle" fill="var(--c-text2)" font-size="12">حمل</text><text x="200" y="242" text-anchor="middle" fill="var(--c-text2)" font-size="12">خطوط المجال من N إلى S — والملف يقطعها فيتولد الجهد</text></svg>',
        },
        {
          t: 'formula',
          name: 'القوة الدافعة المتولدة في مولد التيار المستمر',
          expr: 'E<sub>a</sub> = (P / a) × φ × Z × (n / 60)',
          terms: [
            { sym: 'E<sub>a</sub>', ar: 'القوة الدافعة المتولدة', unit: 'V' },
            { sym: 'P', ar: 'عدد الأقطاب المغناطيسية', unit: '—' },
            { sym: 'a', ar: 'عدد المسارات المتوازية', unit: '—' },
            { sym: 'φ', ar: 'الفيض المغناطيسي لكل قطب', unit: 'Wb' },
            { sym: 'Z', ar: 'عدد الموصلات الكلية في المنتج', unit: '—' },
            { sym: 'n', ar: 'سرعة الدوران', unit: 'rpm' },
          ],
          note: 'القاعدة الذهبية لـ <span class="ltr">a</span>: في اللف التموجي <i>wave</i> يكون <span class="ltr">a = 2</span> دائمًا، وفي اللف الانطباقي <i>lap</i> يكون <span class="ltr">a = P</span>. وتذكّر أن <span class="ltr">1</span> ميجا خط <span class="ltr">= 0.01 Wb</span>.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة (1): أوجد الجهد المتولد',
          given: [
            'عدد الأقطاب <span class="ltr">P = 6</span> واللف تموجي أي <span class="ltr">a = 2</span>',
            'عدد الموصلات الكلية <span class="ltr">Z = 250</span> والسرعة <span class="ltr">n = 1200 rpm</span>',
            'الفيض لكل قطب <span class="ltr">6</span> ميجا خط <span class="ltr">= 0.06 Wb</span>',
          ],
          steps: [
            'نسبة الأقطاب إلى المسارات: <span class="ltr">P / a = 6 ÷ 2 = 3</span>',
            'اللفات في الثانية: <span class="ltr">n / 60 = 1200 ÷ 60 = 20</span>',
            'التعويض: <span class="ltr">E_a = 3 × 0.06 × 250 × 20 = 900 V</span>',
          ],
          answer: '<span class="ltr">E_a = 900 V</span> — ولو كان اللف انطباقيًا لصار <span class="ltr">a = 6</span> فينزل الجهد إلى ثلث القيمة.',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: مصطلحات ورشة المولدات',
          cards: [
            { front: 'اللف التموجي (Wave)', back: 'عدد المسارات المتوازية <span class="ltr">a = 2</span> مهما كان عدد الأقطاب — يعطي جهدًا أعلى وتيارًا أقل.' },
            { front: 'اللف الانطباقي (Lap)', back: 'عدد المسارات <span class="ltr">a = P</span> أي بعدد الأقطاب — يعطي تيارًا أعلى وجهدًا أقل عند نفس السرعة والفيض.' },
            { front: 'الموحد والفرش (Commutator & Brushes)', back: 'الموحد يعكس اتجاه التوصيل كل نصف لفة فيخرج التيار مستمرًا، والفرش الكربونية تنقله إلى الدائرة الخارجية.' },
          ],
        },
        {
          t: 'concept',
          title: 'لماذا هجرت المحطات مولد التيار المستمر؟',
          icon: '🔷',
          html: 'في <span class="term">المولد التزامني <i>Synchronous Generator</i></span> يصبح <b>المنتج ثابتًا</b> وملفات المجال دوّارة تُغذّى بتيار مستمر عبر حلقتين فقط. المزايا الخمس: أخذ التيار مباشرة من الثابت، والتخلص من متاعب حلقات الانزلاق، وتحمّل السرعات العالية، وعزل أفضل، وتبريد أسهل. القدرة تصل إلى <span class="ltr">1500 MVA</span>.',
        },
        {
          t: 'formula',
          name: 'السرعة التزامنية',
          expr: 'n<sub>s</sub> = 120 × f / p',
          terms: [
            { sym: 'n<sub>s</sub>', ar: 'السرعة التزامنية', unit: 'rpm' },
            { sym: 'f', ar: 'تردد الجهد المتولد', unit: 'Hz' },
            { sym: 'p', ar: 'عدد الأقطاب المغناطيسية', unit: '—' },
          ],
          note: 'اقلبها لإيجاد أي مجهول: <span class="ltr">f = p × n / 120</span> أو <span class="ltr">p = 120 × f / n_s</span>. مولد <span class="ltr">6</span> أقطاب يعطي <span class="ltr">50 Hz</span> عند <span class="ltr">1000 rpm</span> و<span class="ltr">60 Hz</span> عند <span class="ltr">1200 rpm</span>.',
        },
        {
          t: 'formula',
          name: 'علاقات التوصيل نجمة ودلتا',
          expr: 'نجمة: V<sub>L</sub> = √3 × V<sub>ph</sub> و I<sub>L</sub> = I<sub>ph</sub>',
          terms: [
            { sym: 'V<sub>L</sub>', ar: 'جهد الخط بين وجهين', unit: 'V' },
            { sym: 'V<sub>ph</sub>', ar: 'جهد الطور على الملف الواحد', unit: 'V' },
            { sym: 'I<sub>L</sub>', ar: 'تيار الخط', unit: 'A' },
            { sym: 'I<sub>ph</sub>', ar: 'تيار الطور داخل الملف', unit: 'A' },
          ],
          note: 'وفي توصيلة دلتا ينعكس الدور: <span class="ltr">V_L = V_ph</span> بينما <span class="ltr">I_L = √3 × I_ph</span>. العامل <span class="ltr">√3 ≈ 1.732</span> هو مفتاح كل حسابات الثلاثي الأوجه.',
        },
        {
          t: 'example',
          title: 'مثال الحقيبة: مولد 11 kV موصول نجمة',
          given: [
            'مولد تزامني ثلاثي الطور موصول نجمة، جهد الخط <span class="ltr">11 kV</span>',
            'التردد <span class="ltr">50 Hz</span> والسرعة <span class="ltr">1000 rpm</span>',
          ],
          steps: [
            'عدد الأقطاب: <span class="ltr">p = 120 × 50 ÷ 1000 = 6</span>',
            'جهد الطور: <span class="ltr">V_ph = 11000 ÷ √3 = 6350 V</span>',
          ],
          answer: 'المولد <span class="ltr">6</span> أقطاب وجهد الطور الواحد <span class="ltr">6350 V</span> رغم أن لوحته تقول <span class="ltr">11 kV</span>.',
        },
        {
          t: 'tip',
          html: '🛠 في الورشة: أول ما تفحصه في مولد تيار مستمر ضعيف الجهد هو <span class="term">الفرش الكربونية <i>Carbon Brushes</i></span> وسطح <span class="term">الموحد <i>Commutator</i></span> — التآكل والشرر يرفعان مقاومة التلامس فينخفض الجهد الخارج دون أي عطل في الملفات. ولا تنسَ: لوحة المولد تكتب <b>جهد الخط</b> لا جهد الطور، فاقسم على <span class="ltr">√3</span> قبل اختيار عزل الملف.',
        },
        {
          t: 'sim',
          sim: 'sim-generator',
          title: 'مولد الملف الدوّار',
          desc: 'ملف يدور داخل مجال: اضبط السرعة وعدد الأقطاب والفيض ونوع اللف، وشاهد الموجة قبل الموحّد وبعده',
          missions: [
            { id: 'm1', text: 'أعِد مثال (1): <span class="ltr">P=6</span>، <span class="ltr">Z=250</span>، لف تموجي <span class="ltr">a=2</span>، <span class="ltr">n=1200 rpm</span>، <span class="ltr">φ=0.06 Wb</span> ⟵ <span class="ltr">E_a=900 V ±2%</span>' },
            { id: 'm2', text: 'أعِد مثال (2): <span class="ltr">P=8</span>، <span class="ltr">Z=960</span>، لف انطباقي، <span class="ltr">n=600 rpm</span> — أوجد الفيض المعطي <span class="ltr">E_a=220 V</span> ⟵ <span class="ltr">φ=0.0229 Wb ±3%</span>' },
            { id: 'm3', text: 'أعِد مثال (3): <span class="ltr">P=8</span>، <span class="ltr">Z=480</span>، انطباقي، <span class="ltr">φ=0.05 Wb</span>، <span class="ltr">E_a=240 V</span> ⟵ <span class="ltr">n=600 rpm ±2%</span>' },
            { id: 'm4', text: 'أثبت أن <span class="ltr">f = p·n/120</span>: اضبط <span class="ltr">6</span> أقطاب و<span class="ltr">1000 rpm</span> وتحقّق من <span class="ltr">f=50 Hz ±0.5</span>' },
            { id: 'm5', text: 'بدّل اللف من انطباقي إلى تموجي عند نفس المعطيات وسجّل ارتفاع <span class="ltr">E_a</span> بنسبة <span class="ltr">P/2</span>' },
          ],
        },
        { t: 'quiz', ref: 'u3l1check' },
      ],
    },

    // ------------------------------------------------------------
    // u3l2 — المحركات الكهربائية وبطاقتها وحمايتها
    // ------------------------------------------------------------
    {
      id: 'u3l2',
      title: 'المحركات وبطاقتها وحمايتها',
      minutes: 16,
      concepts: ['induction-motor', 'slip', 'motor-nameplate', 'motor-protection'],
      blocks: [
        {
          t: 'concept',
          title: 'الآلة نفسها… بالاتجاه المعاكس',
          icon: '⚙️',
          html: 'المولد يأخذ دورانًا ويعطي كهرباء، و<span class="term">المحرك <i>Motor</i></span> يأخذ كهرباء ويعطي دورانًا. حين يمر تيار <span class="ltr">I</span> في موصل داخل مجال كثافته <span class="ltr">B</span> تنشأ قوة <span class="ltr">F</span> يحدد اتجاهها <b>قاعدة فليمنج لليد اليسرى</b>، وقوتان متعاكستان على جانبي الملف تعنيان <b>عزم دوران</b>.',
        },
        {
          t: 'figure',
          caption: 'بطاقة المحرك في الحقيبة: كل رقم عليها قرار صيانة — الجهد والتيار والتردد والسرعة وعامل الحمل',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="20" width="340" height="220" rx="12" fill="var(--c-surface2)" stroke="var(--c-amber)" stroke-width="3"/><line x1="30" y1="58" x2="370" y2="58" stroke="var(--c-amber)" stroke-width="3"/><text x="200" y="45" text-anchor="middle" fill="var(--c-amber)" font-size="16" font-weight="bold">MOTOR NAMEPLATE</text><g fill="var(--c-text)" font-size="14"><text x="52" y="86">3 PH</text><text x="52" y="116">10 hp</text><text x="52" y="146">240 / 480 V</text><text x="52" y="176">28 A / 14 A</text><text x="52" y="206">60 Hz</text></g><g fill="var(--c-text2)" font-size="12" text-anchor="end"><text x="348" y="86">ثلاثي الأوجه</text><text x="348" y="116">القدرة الميكانيكية</text><text x="348" y="146">جهدان للتوصيل</text><text x="348" y="176">تيار الحمل الكامل</text><text x="348" y="206">تردد المصدر</text></g><line x1="30" y1="216" x2="370" y2="216" stroke="var(--c-border)" stroke-width="2"/><text x="52" y="233" fill="var(--c-ok)" font-size="14">1745 rpm</text><text x="348" y="233" text-anchor="end" fill="var(--c-ok)" font-size="12">SF = 1.25</text><line x1="150" y1="66" x2="150" y2="210" stroke="var(--c-border)" stroke-width="1.5"/></svg>',
        },
        {
          t: 'concept',
          title: 'المجال الدوّار: السر كله في ١٢٠ درجة',
          icon: '🔍',
          html: 'ثلاثة ملفات في العضو الثابت بينها <span class="ltr">120°</span>، وثلاثة تيارات متزنة بينها <span class="ltr">120°</span> ⟵ ينشأ في الثغرة الهوائية <b>مجال مغناطيسي دوّار</b> يدور بالسرعة التزامنية. هذا المجال يقطع قضبان <span class="term">القفص السنجابي <i>Squirrel Cage</i></span> فيولّد فيها تيارات ⟵ مجالًا ثانيًا ⟵ عزمًا يدور العضو الدوار.',
        },
        {
          t: 'formula',
          name: 'السرعة التزامنية للمجال الدوّار',
          expr: 'N<sub>s</sub> = 120 × f / P',
          terms: [
            { sym: 'N<sub>s</sub>', ar: 'سرعة المجال الدوّار', unit: 'rpm' },
            { sym: 'f', ar: 'تردد مصدر التغذية', unit: 'Hz' },
            { sym: 'P', ar: 'عدد أقطاب العضو الثابت', unit: '—' },
          ],
          note: 'مضاعفة عدد الأقطاب تنزل بالسرعة إلى النصف، وتنصيف التردد ينزل بها إلى النصف كذلك — وهذا أساس التحكم بالسرعة عبر <span class="term">مغيّر التردد <i>VFD</i></span>.',
        },
        {
          t: 'formula',
          name: 'الانزلاق',
          expr: 's = (n<sub>s</sub> − n) / n<sub>s</sub> × 100%',
          terms: [
            { sym: 's', ar: 'الانزلاق', unit: '%' },
            { sym: 'n<sub>s</sub>', ar: 'السرعة التزامنية للمجال', unit: 'rpm' },
            { sym: 'n', ar: 'سرعة العضو الدوار الفعلية', unit: 'rpm' },
          ],
          note: 'الانزلاق لا يساوي صفرًا أبدًا في المحرك الحثي: لو دار العضو الدوار بالسرعة التزامنية لتوقف قطع خطوط المجال فينعدم التيار والعزم. القيم الطبيعية عند الحمل الكامل بين <span class="ltr">2%</span> و<span class="ltr">6%</span>.',
        },
        {
          t: 'example',
          title: 'اقرأ بطاقة الحقيبة: كم قطبًا وكم انزلاقًا؟',
          given: [
            'من البطاقة: التردد <span class="ltr">60 Hz</span> والسرعة عند الحمل الكامل <span class="ltr">1745 rpm</span>',
            'أقرب سرعة تزامنية أعلى من <span class="ltr">1745</span> هي <span class="ltr">1800 rpm</span>',
          ],
          steps: [
            'عدد الأقطاب: <span class="ltr">P = 120 × 60 ÷ 1800 = 4</span> أقطاب',
            'فرق السرعة: <span class="ltr">1800 − 1745 = 55 rpm</span>',
            'الانزلاق: <span class="ltr">s = 55 ÷ 1800 = 0.0306 = 3.06%</span>',
          ],
          answer: 'المحرك رباعي الأقطاب وانزلاقه <span class="ltr">3.06%</span> — قيمة طبيعية تمامًا لمحرك حثي عند الحمل الكامل.',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: أي محرك أمامك؟',
          cards: [
            { front: 'الحثي ذو القفص السنجابي', back: 'قضبان نحاس أو ألومنيوم مقصورة بحلقتين، بلا أطراف خارجية للعضو الدوار — الأمتن والأرخص والأقل صيانة.' },
            { front: 'الحثي ذو العضو الملفوف', back: 'ملفات على العضو الدوار تخرج إلى حلقات انزلاق، فتُوصل بمقاومات خارجية للتحكم المحدود في السرعة.' },
            { front: 'المحرك التزامني', back: 'عضوه الدوار يُغذّى بتيار مستمر خارجي، فيدور بالسرعة التزامنية مهما تغير الحمل ويصحح معامل القدرة.' },
            { front: 'المحرك العام (التوالي)', back: 'يعمل على <span class="ltr">AC</span> و<span class="ltr">DC</span> معًا وسرعته تصل إلى <span class="ltr">15000 rpm</span> — مكانس ومثاقب وخلاطات.' },
          ],
        },
        {
          t: 'order',
          title: 'رتّب طرق التحكم بسرعة المحرك الحثي من الأقل كلفة إلى الأعلى',
          items: [
            'تغيير قيمة الانزلاق بمقاومات خارجية',
            'تغيير عدد أقطاب العضو الثابت',
            'تغيير تردد المصدر بمغيّر تردد',
          ],
        },
        {
          t: 'match',
          title: 'وصّل كل عَرَض عطل بوسيلة الحماية المناسبة',
          pairs: [
            { a: 'خطر صدمة على الإنسان عند اللمس المباشر', b: 'قاطع تفاضلي <span class="ltr">30 mA</span>' },
            { a: 'تسرب أرضي وحماية التجهيزات من الحريق', b: 'قاطع تفاضلي <span class="ltr">300 mA</span>' },
            { a: 'ارتفاع حرارة ملفات المحرك', b: 'ريليه حرارية على الكونتاكتور' },
            { a: 'انقطاع أحد الأطوار الثلاثة', b: 'ريليه متابعة الأطوار' },
            { a: 'قصر كهربائي يستوجب فصلًا لحظيًا مع حماية من زيادة الحمل', b: 'ريليه مغناطيسية-حرارية' },
          ],
        },
        {
          t: 'tip',
          html: '🛠 في الورشة: <span class="ltr">SF = 1.25</span> على البطاقة <b>ليست رخصة تشغيل دائم</b> فوق المقنن — هي هامش لفترات قصيرة فقط. والأهم: اضبط <span class="term">الريليه الحرارية <i>Thermal Relay</i></span> على تيار البطاقة <b>المطابق لجهد التوصيل</b>: <span class="ltr">28 A</span> إن وُصل على <span class="ltr">240 V</span> و<span class="ltr">14 A</span> إن وُصل على <span class="ltr">480 V</span>. ضبطها على القيمة الخاطئة يعني محركًا محترقًا أو فصلًا متكررًا بلا سبب.',
        },
        {
          t: 'sim',
          sim: 'sim-induction-motor',
          title: 'مقعد المحرك الحثي ثلاثي الأوجه',
          desc: 'تردد وعدد أقطاب وعزم حمل قابل للضبط: تابع السرعة والانزلاق والتيار وحالة الريليه الحرارية',
          missions: [
            { id: 'm1', text: 'اضبط <span class="ltr">60 Hz</span> و<span class="ltr">4</span> أقطاب ⟵ <span class="ltr">N_s=1800 rpm</span>، ثم حمّل حتى <span class="ltr">1745 rpm</span> وتحقّق من انزلاق <span class="ltr">3.06% ±0.2</span>' },
            { id: 'm2', text: 'اضبط <span class="ltr">50 Hz</span> و<span class="ltr">6</span> أقطاب ⟵ <span class="ltr">N_s=1000 rpm</span>، ثم <span class="ltr">60 Hz</span> ⟵ <span class="ltr">1200 rpm ±1%</span>' },
            { id: 'm3', text: 'ضاعف عدد الأقطاب من <span class="ltr">4</span> إلى <span class="ltr">8</span> وأثبت انخفاض <span class="ltr">N_s</span> إلى النصف (نسبة <span class="ltr">0.5±0.02</span>)' },
            { id: 'm4', text: 'خفّض التردد إلى <span class="ltr">30 Hz</span> وأثبت هبوط السرعة إلى النصف مع بقاء العزم ضمن <span class="ltr">±10%</span>' },
            { id: 'm5', text: 'ارفع عزم الحمل حتى يفصل الريليه الحراري وسجّل تيار الفصل (يتجاوز التيار المقنن بأكثر من <span class="ltr">25%</span>)' },
          ],
        },
        { t: 'quiz', ref: 'u3l2check' },
      ],
    },

    // ------------------------------------------------------------
    // u3l3 — المحول الكهربائي
    // ------------------------------------------------------------
    {
      id: 'u3l3',
      title: 'المحول الكهربائي',
      minutes: 13,
      concepts: ['transformer-principle', 'turns-ratio', 'efficiency'],
      blocks: [
        {
          t: 'concept',
          title: 'آلة بلا جزء متحرك… وبدونها لا تعمل مدينة اليوم',
          icon: '🔌',
          html: '<span class="term">المحول <i>Transformer</i></span> ملفان حول قلب حديدي، بلا محامل ولا فرش ولا دوران. وظيفته أن يرفع الجهد عند محطة التوليد ليُنقل بأقل فقد، ثم يخفضه عند الاستهلاك. الطرف الموصول بالمصدر هو <b>الملف الابتدائي</b>، والموصول بالحمل هو <b>الملف الثانوي</b>.',
        },
        {
          t: 'figure',
          caption: 'المحول: مصدر متردد على الابتدائي (يمين)، فيض متغير في القلب، وجهد محثوث على الثانوي (يسار)',
          svg: '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><text x="200" y="24" text-anchor="middle" fill="var(--c-text)" font-size="15" font-weight="bold">مبدأ عمل المحول</text><rect x="120" y="50" width="160" height="160" rx="6" fill="none" stroke="var(--c-text2)" stroke-width="16" opacity="0.7"/><g stroke="var(--c-amber)" stroke-width="4" fill="none"><path d="M262 74 h26 M262 94 h26 M262 114 h26 M262 134 h26 M262 154 h26 M262 174 h26"/></g><g stroke="var(--c-water)" stroke-width="4" fill="none"><path d="M112 84 h-26 M112 104 h-26 M112 124 h-26 M112 144 h-26 M112 164 h-26"/></g><line x1="288" y1="74" x2="330" y2="74" stroke="var(--c-amber)" stroke-width="3"/><line x1="288" y1="174" x2="330" y2="174" stroke="var(--c-amber)" stroke-width="3"/><circle cx="330" cy="124" r="20" fill="none" stroke="var(--c-amber)" stroke-width="3"/><path d="M320 124 q5 -9 10 0 q5 9 10 0" fill="none" stroke="var(--c-amber)" stroke-width="2.5"/><line x1="330" y1="74" x2="330" y2="104" stroke="var(--c-amber)" stroke-width="3"/><line x1="330" y1="144" x2="330" y2="174" stroke="var(--c-amber)" stroke-width="3"/><line x1="86" y1="84" x2="56" y2="84" stroke="var(--c-water)" stroke-width="3"/><line x1="86" y1="164" x2="56" y2="164" stroke="var(--c-water)" stroke-width="3"/><rect x="38" y="104" width="36" height="40" rx="4" fill="none" stroke="var(--c-ok)" stroke-width="3"/><line x1="56" y1="84" x2="56" y2="104" stroke="var(--c-water)" stroke-width="3"/><line x1="56" y1="144" x2="56" y2="164" stroke="var(--c-water)" stroke-width="3"/><text x="300" y="222" text-anchor="middle" fill="var(--c-amber)" font-size="12">الابتدائي N₁</text><text x="200" y="222" text-anchor="middle" fill="var(--c-text2)" font-size="12">القلب الحديدي</text><text x="70" y="222" text-anchor="middle" fill="var(--c-water)" font-size="12">الثانوي N₂</text><text x="200" y="245" text-anchor="middle" fill="var(--c-text2)" font-size="12">الفيض المتغير وحده هو الذي يحثّ الجهد في الثانوي</text></svg>',
        },
        {
          t: 'formula',
          name: 'نسبة التحويل',
          expr: 'V<sub>1</sub> / V<sub>2</sub> = N<sub>1</sub> / N<sub>2</sub>',
          terms: [
            { sym: 'V<sub>1</sub>', ar: 'جهد الملف الابتدائي', unit: 'V' },
            { sym: 'V<sub>2</sub>', ar: 'جهد الملف الثانوي', unit: 'V' },
            { sym: 'N<sub>1</sub>', ar: 'عدد لفات الابتدائي', unit: 'لفة' },
            { sym: 'N<sub>2</sub>', ar: 'عدد لفات الثانوي', unit: 'لفة' },
          ],
          note: 'إن كان <span class="ltr">N₂ > N₁</span> فالمحول <b>رافع</b>، وإن كان <span class="ltr">N₂ < N₁</span> فهو <b>خافض</b>. ولا فرق في التصميم بينهما — الفرق في اتجاه التغذية فقط.',
        },
        {
          t: 'example',
          title: 'كم لفة نحتاج في الثانوي؟',
          given: [
            'محول خافض <span class="ltr">220 / 24 V</span>',
            'لفات الملف الابتدائي <span class="ltr">N₁ = 1000</span> لفة',
          ],
          steps: [
            'من نسبة التحويل: <span class="ltr">N₂ = N₁ × V₂ ÷ V₁</span>',
            'التعويض: <span class="ltr">N₂ = 1000 × 24 ÷ 220</span>',
            'الناتج: <span class="ltr">N₂ = 109</span> لفة تقريبًا',
          ],
          answer: '<span class="ltr">N₂ ≈ 109</span> لفة — نسبة التحويل <span class="ltr">≈ 9.2 : 1</span> خافضة.',
        },
        {
          t: 'concept',
          title: 'جرّبه على بطارية… لن يعطيك شيئًا',
          icon: '⚠',
          html: 'مبدأ المحول هو <span class="term">قانون فاراداي <i>Faraday\'s Law</i></span>: الجهد المحثوث يتناسب مع <b>معدل تغير الفيض</b>. والتيار المستمر يصنع فيضًا <b>ثابتًا</b> معدل تغيره صفر ⟵ جهد الثانوي صفر، بينما يرتفع تيار الابتدائي بشدة لأن مقاومة الملف وحدها هي التي تحدّه. هذا أحد أهم أسباب تفضيل <span class="ltr">AC</span> على <span class="ltr">DC</span>.',
        },
        {
          t: 'formula',
          name: 'كفاءة المحول',
          expr: 'η = (P<sub>out</sub> / P<sub>in</sub>) × 100%',
          terms: [
            { sym: 'η', ar: 'الكفاءة', unit: '%' },
            { sym: 'P<sub>out</sub>', ar: 'القدرة الخارجة من الثانوي', unit: 'W' },
            { sym: 'P<sub>in</sub>', ar: 'القدرة الداخلة إلى الابتدائي', unit: 'W' },
          ],
          note: 'وبالمنطق نفسه تُحسب <b>كفاءة النقل</b>: الطاقة الواصلة لمكان الاستهلاك ÷ الطاقة الناتجة في محطة التوليد. الفرق بينهما هو المفاقيد الحديدية والنحاسية وفقد الخطوط.',
        },
        {
          t: 'flip',
          title: 'اقلب البطاقة: تصنيف المحولات',
          cards: [
            { front: 'محول قدرة (Power)', back: 'يعمل في شبكات النقل ومحطات التوليد بجهود عالية جدًا وسعات كبيرة، ويكون زيتيًا مع رديترات تبريد.' },
            { front: 'محول توزيع (Distribution)', back: 'يخفض جهد الشبكة إلى جهد الاستهلاك في الأحياء والمصانع، وهو الأقرب للمستهلك النهائي.' },
            { front: 'محولات قياس (VT & CT)', back: 'محول جهد ومحول تيار: يخفضان القيم العالية إلى قيم آمنة تقرؤها الأجهزة وريليهات الوقاية.' },
            { front: 'المحول الذاتي (Auto)', back: 'ملف واحد بمأخذ وسطي: اتصال كهربائي ومغناطيسي معًا — أرخص وأصغر، وعيبه انعدام العزل بين الطرفين.' },
          ],
        },
        {
          t: 'match',
          title: 'وصّل كل جزء من أجزاء محول القدرة بوظيفته',
          pairs: [
            { a: 'خزان التمدد (Conservator)', b: 'يستوعب تمدد الزيت وانكماشه مع تغير الحرارة' },
            { a: 'مزيل الرطوبة (Breather)', b: 'يجفف الهواء الداخل إلى الخزان من الرطوبة' },
            { a: 'زعانف الرديترات', b: 'تبدّد حرارة الزيت وتخفض حرارة الملفات' },
            { a: 'عازل الاختراق (Bushing)', b: 'يمرّر الموصل عبر جدار الخزان معزولًا عنه' },
          ],
        },
        {
          t: 'concept',
          title: 'ريليه الغاز: أنف المحول',
          icon: '🚩',
          html: 'يُركّب <span class="term">ريليه الغاز <i>Buchholz Relay</i></span> في الأنبوب بين الخزان الرئيسي وخزان التمدد. عند <b>قصر داخلي بين الملفات</b> يسخن الزيت ويتحلل إلى غازات تصعد إلى الأعلى فتحرك عوّامتين: الأولى تعطي <b>إنذارًا</b> عند القصر الصغير، والثانية تعطي أمر <b>فصل</b> عند القصر الكبير. وهو لا يقيس مستوى الزيت — للمستوى مؤشر زجاجي مستقل.',
        },
        {
          t: 'tip',
          html: '🛠 في الورشة: إذا فصل ريليه الغاز <b>لا تعِد التشغيل فورًا</b> — الغاز المتجمع دليل على عطل داخلي، ويُسحب ويُحلّل أولًا. وقاعدة سلامة أخرى: لا تختبر محولًا بتوصيله على مصدر <span class="ltr">DC</span> لترى «هل يعمل» — الثانوي سيقرأ <span class="ltr">0 V</span> والابتدائي سيسحب تيارًا عاليًا يحرق العزل خلال ثوانٍ.',
        },
        {
          t: 'sim',
          sim: 'sim-transformer',
          title: 'مقعد المحول أحادي وثلاثي الطور',
          desc: 'اضبط عدد اللفات والحمل ونوع التوصيلة، واقرأ جهدَي وتيارَي الملفين ومنحنى الجهد–التيار',
          missions: [
            { id: 'm1', text: 'اضبط <span class="ltr">N₁=1000</span> و<span class="ltr">V₁=220 V</span> وأوجد <span class="ltr">N₂</span> المعطي <span class="ltr">V₂=24 V</span> ⟵ <span class="ltr">N₂=109±3</span> لفة' },
            { id: 'm2', text: 'أعِد جدول (5-1) بالحالات الخمس: لا حمل، <span class="ltr">10 kΩ</span>، <span class="ltr">100 kΩ</span>، حثي <span class="ltr">10 mH</span>، سعوي <span class="ltr">4.7 µF</span> وسجّل <span class="ltr">V_p, V_s, I_p, I_s</span> لكل حالة' },
            { id: 'm3', text: 'في التوصيل النجمي تحقّق من <span class="ltr">V_ph = V_L/√3</span>: عند <span class="ltr">11 kV</span> ⟵ <span class="ltr">6350 V ±1%</span>' },
            { id: 'm4', text: 'في توصيلة دلتا تحقّق من <span class="ltr">I_L = √3 · I_ph</span> بخطأ <span class="ltr">±2%</span>' },
            { id: 'm5', text: 'بدّل المصدر إلى <span class="ltr">DC</span> وأثبت انهيار جهد الثانوي إلى <span class="ltr">0 V</span> مع ارتفاع تيار الابتدائي' },
          ],
        },
        { t: 'quiz', ref: 'u3l3check' },
      ],
    },
  ],
};

// ================================================================
// بنوك أسئلة الوحدة الثالثة
// ================================================================
export const U3_QUIZZES = {
  // الاختبار القبلي للوحدة — يغطي الدروس الثلاثة
  u3pre: {
    title: 'قبل الانطلاق: أين أنت من الآلات الكهربائية؟',
    questions: [
      {
        t: 'mc',
        q: 'مولد تيار مستمر يعمل بلف تموجي. إذا ضاعفت سرعة دورانه وبقي كل شيء آخر ثابتًا، فماذا يحدث للقوة الدافعة المتولدة؟',
        opts: ['تتضاعف قيمتها', 'تهبط إلى النصف', 'تبقى دون تغيّر'],
        correct: 0,
        why: 'في العلاقة <span class="ltr">E_a = (P/a) × φ × Z × (n/60)</span> تظهر السرعة <span class="ltr">n</span> في البسط، فالعلاقة طردية مباشرة: مضاعفة السرعة تضاعف الجهد المتولد.',
        unit: 'u3',
        concept: 'generated-emf',
      },
      {
        t: 'mc',
        q: 'مولد تزامني عدد أقطابه <span class="ltr">6</span>. ما السرعة اللازمة ليعطي ترددًا مقداره <span class="ltr">50 Hz</span>؟',
        opts: ['<span class="ltr">1000 rpm</span>', '<span class="ltr">1200 rpm</span>', '<span class="ltr">3000 rpm</span>'],
        correct: 0,
        why: '<span class="ltr">n_s = 120 × f / p = 120 × 50 ÷ 6 = 1000 rpm</span>. أما <span class="ltr">1200 rpm</span> فهي سرعة التردد <span class="ltr">60 Hz</span> لنفس المولد.',
        unit: 'u3',
        concept: 'synchronous-speed',
      },
      {
        t: 'mc',
        q: 'مولد تزامني ثلاثي الطور موصول نجمة وجهد خطه <span class="ltr">11 kV</span>. كم جهد الطور الواحد؟',
        opts: ['<span class="ltr">6350 V</span>', '<span class="ltr">11000 V</span>', '<span class="ltr">19053 V</span>'],
        correct: 0,
        why: 'في التوصيل النجمي <span class="ltr">V_ph = V_L ÷ √3 = 11000 ÷ 1.732 = 6350 V</span>. الخطأ الشائع هو ضرب جهد الخط في <span class="ltr">√3</span> بدل قسمته.',
        unit: 'u3',
        concept: 'star-delta-relations',
      },
      {
        t: 'mc',
        q: 'محرك حثي سرعته التزامنية <span class="ltr">1800 rpm</span> ويدور عند الحمل الكامل بسرعة <span class="ltr">1745 rpm</span>. كم انزلاقه؟',
        opts: ['<span class="ltr">3.06%</span>', '<span class="ltr">0.97%</span>', '<span class="ltr">6.12%</span>'],
        correct: 0,
        why: 'الانزلاق <span class="ltr">s = (1800 − 1745) ÷ 1800 = 55 ÷ 1800 = 3.06%</span> — وهي قيمة نموذجية لمحرك حثي يعمل عند حمله الكامل.',
        unit: 'u3',
        concept: 'slip',
      },
      {
        t: 'mc',
        q: 'انقطع أحد الأطوار الثلاثة عن محرك يعمل تحت حمل. أي وسيلة حماية معنية مباشرة بهذه الحالة؟',
        opts: ['ريليه متابعة الأطوار', 'قاطع الحماية التفاضلي', 'مفتاح فصل الحمل اليدوي'],
        correct: 0,
        why: 'ريليه متابعة الأطوار يراقب وجود الأطوار الثلاثة وتتابعها ويفصل عند انقطاع أحدها. أما القاطع التفاضلي فوظيفته كشف تسرب التيار إلى الأرض لحماية الإنسان.',
        unit: 'u3',
        concept: 'motor-protection',
      },
      {
        t: 'mc',
        q: 'لماذا لا يعمل المحول الكهربائي على مصدر تيار مستمر؟',
        opts: [
          'لأن الفيض يبقى ثابتًا فلا يتولد حث في الملف الثانوي',
          'لأن القلب الحديدي يفقد مغنطته أمام التيار المستمر',
          'لأن مقاومة الملف الابتدائي ترتفع مع التيار المستمر',
        ],
        correct: 0,
        why: 'قانون فاراداي يربط الجهد المحثوث بـ<b>معدل تغير</b> الفيض. التيار المستمر يعطي فيضًا ثابتًا معدل تغيره صفر، فجهد الثانوي صفر مهما كانت نسبة اللفات.',
        unit: 'u3',
        concept: 'transformer-principle',
      },
    ],
  },

  // نقطة تفتيش الدرس الأول
  u3l1check: {
    title: 'نقطة تفتيش: المولدات الكهربائية',
    questions: [
      {
        t: 'mc',
        q: 'مولد <span class="ltr">6</span> أقطاب بلف تموجي، <span class="ltr">Z = 250</span>، <span class="ltr">n = 1200 rpm</span>، <span class="ltr">φ = 0.06 Wb</span>. كم القوة الدافعة المتولدة؟',
        opts: ['<span class="ltr">900 V</span>', '<span class="ltr">1800 V</span>', '<span class="ltr">300 V</span>'],
        correct: 0,
        why: 'اللف التموجي يعني <span class="ltr">a = 2</span>، فيكون <span class="ltr">E_a = (6÷2) × 0.06 × 250 × (1200÷60) = 3 × 0.06 × 250 × 20 = 900 V</span>.',
        unit: 'u3',
        concept: 'generated-emf',
      },
      {
        t: 'mc',
        q: 'ما قيمة عدد المسارات المتوازية <span class="ltr">a</span> في اللف الانطباقي <i>lap</i>؟',
        opts: [
          'يساوي عدد الأقطاب <span class="ltr">P</span>',
          'يساوي <span class="ltr">2</span> مهما كان عدد الأقطاب',
          'يساوي نصف عدد الموصلات <span class="ltr">Z</span>',
        ],
        correct: 0,
        why: 'في اللف الانطباقي <span class="ltr">a = P</span>، وفي التموجي <span class="ltr">a = 2</span> دائمًا. الخلط بينهما يضاعف الخطأ في <span class="ltr">E_a</span> بمقدار <span class="ltr">P/2</span>.',
        unit: 'u3',
        concept: 'generated-emf',
      },
      {
        t: 'tf',
        q: 'كلما زاد عدد أقطاب المولد التزامني لزمته سرعة دوران أقل لإعطاء التردد نفسه.',
        correct: true,
        why: 'صحيح. من <span class="ltr">n_s = 120 f / p</span> نرى أن <span class="ltr">p</span> في المقام، فمولد <span class="ltr">12</span> قطبًا يعطي <span class="ltr">50 Hz</span> عند <span class="ltr">500 rpm</span> فقط.',
        unit: 'u3',
        concept: 'synchronous-speed',
      },
      {
        t: 'mc',
        q: 'في التوصيل النجمي لمولد ثلاثي الطور، ما العلاقة بين تيار الخط وتيار الطور؟',
        opts: [
          'يتساويان تمامًا: <span class="ltr">I_L = I_ph</span>',
          'تيار الخط أكبر بمقدار <span class="ltr">√3 = 1.732</span>',
          'تيار الخط أصغر بمقدار <span class="ltr">√3</span>',
        ],
        correct: 0,
        why: 'في النجمة <span class="ltr">I_L = I_ph</span> بينما الجهد هو الذي يتضاعف بـ<span class="ltr">√3</span>. أما في دلتا فينعكس الأمر: <span class="ltr">V_L = V_ph</span> و<span class="ltr">I_L = √3 × I_ph</span>.',
        unit: 'u3',
        concept: 'star-delta-relations',
      },
    ],
  },

  // نقطة تفتيش الدرس الثاني
  u3l2check: {
    title: 'نقطة تفتيش: المحركات وبطاقتها وحمايتها',
    questions: [
      {
        t: 'mc',
        q: 'بطاقة محرك تقول: <span class="ltr">3 PH</span>، <span class="ltr">60 Hz</span>، <span class="ltr">1745 rpm</span> عند الحمل الكامل. كم عدد أقطابه؟',
        opts: ['<span class="ltr">4</span> أقطاب', '<span class="ltr">2</span> قطبان', '<span class="ltr">6</span> أقطاب'],
        correct: 0,
        why: 'أقرب سرعة تزامنية فوق <span class="ltr">1745</span> هي <span class="ltr">1800 rpm</span>، ومنها <span class="ltr">P = 120 × 60 ÷ 1800 = 4</span> أقطاب. لا تحسب الأقطاب من السرعة الفعلية مباشرة.',
        unit: 'u3',
        concept: 'motor-nameplate',
      },
      {
        t: 'mc',
        q: 'ما مصدر التيار في موصلات العضو الدوار للمحرك الحثي ذي القفص السنجابي؟',
        opts: [
          'المجال الدوّار يحثّ فيها التيار',
          'حلقات انزلاق تغذيها بتيار مستمر',
          'فرش كربونية على موحد ميكانيكي',
        ],
        correct: 0,
        why: 'القفص السنجابي بلا أطراف خارجية أصلًا؛ المجال الدوار للعضو الثابت هو الذي يقطع قضبانه فيحث فيها تيارات — ومن هنا جاءت تسمية «المحرك الحثي».',
        unit: 'u3',
        concept: 'induction-motor',
      },
      {
        t: 'mc',
        q: 'ماذا يعني الرمز <span class="ltr">SF = 1.25</span> على بطاقة المحرك؟',
        opts: [
          'يحتمل حملًا يزيد <span class="ltr">25%</span> عن المقنن لفترات قصيرة',
          'يفقد <span class="ltr">25%</span> من قدرته كلما ارتفعت حرارة ملفاته',
          'يبدأ حركته بتيار يبلغ <span class="ltr">25%</span> من تيار التشغيل',
        ],
        correct: 0,
        why: '<span class="term">عامل زيادة الحمل <i>Service Factor</i></span> هامش تحميل قصير الأمد فقط، وليس رخصة تشغيل دائم فوق القدرة المقننة وإلا ارتفعت الحرارة وتدهور العزل.',
        unit: 'u3',
        concept: 'motor-nameplate',
      },
      {
        t: 'tf',
        q: 'لو دار العضو الدوار للمحرك الحثي بالسرعة التزامنية تمامًا فلن يتولد فيه تيار ولا عزم.',
        correct: true,
        why: 'صحيح. عند تساوي السرعتين يتوقف قطع خطوط المجال فينعدم الجهد المحثوث والتيار والعزم — ولهذا لا يبلغ المحرك الحثي السرعة التزامنية أبدًا ويبقى انزلاقه أكبر من الصفر.',
        unit: 'u3',
        concept: 'slip',
      },
    ],
  },

  // نقطة تفتيش الدرس الثالث
  u3l3check: {
    title: 'نقطة تفتيش: المحول الكهربائي',
    questions: [
      {
        t: 'mc',
        q: 'محول <span class="ltr">220 / 24 V</span> ولفات ابتدائيه <span class="ltr">N₁ = 1000</span> لفة. كم لفة في الثانوي تقريبًا؟',
        opts: ['<span class="ltr">109</span> لفة', '<span class="ltr">9167</span> لفة', '<span class="ltr">240</span> لفة'],
        correct: 0,
        why: '<span class="ltr">N₂ = N₁ × V₂ ÷ V₁ = 1000 × 24 ÷ 220 = 109</span> لفة. النتيجة <span class="ltr">9167</span> تأتي من قلب النسبة خطأً، وهي مستحيلة في محول خافض.',
        unit: 'u3',
        concept: 'turns-ratio',
      },
      {
        t: 'mc',
        q: 'ما الأجزاء الرئيسة الثلاثة التي يتركب منها أي محول كهربائي؟',
        opts: [
          'ملف ابتدائي وملف ثانوي وقلب حديدي',
          'خزان زيت ورديترات وعازل اختراق',
          'موحّد وحلقات انزلاق وفرش كربونية',
        ],
        correct: 0,
        why: 'الأجزاء الأساسية ثلاثة فقط: الابتدائي والثانوي والقلب. أما الخزان والرديترات والعوازل فإضافات خاصة بمحولات القدرة الزيتية، والموحد والفرش تخص الآلات الدوارة لا المحول.',
        unit: 'u3',
        concept: 'transformer-principle',
      },
      {
        t: 'mc',
        q: 'محول قدرته الداخلة إلى الابتدائي <span class="ltr">1000 W</span> والخارجة من الثانوي <span class="ltr">960 W</span>. كم كفاءته؟',
        opts: ['<span class="ltr">96%</span>', '<span class="ltr">104%</span>', '<span class="ltr">40%</span>'],
        correct: 0,
        why: 'الكفاءة = القدرة الخارجة ÷ القدرة الداخلة = <span class="ltr">960 ÷ 1000 = 96%</span>. القيمة <span class="ltr">104%</span> مستحيلة فيزيائيًا لأنها تعني خرجًا أكبر من الدخل.',
        unit: 'u3',
        concept: 'efficiency',
      },
      {
        t: 'tf',
        q: 'ريليه الغاز (بوخهولتز) يكشف القصر الداخلي بين ملفات المحول من الغازات المتصاعدة من الزيت.',
        correct: true,
        why: 'صحيح. القصر الداخلي يسخن الزيت فيتحلل إلى غازات تصعد نحو خزان التمدد مارّة بالريليه، فتحرك عوّامة الإنذار ثم عوّامة الفصل. وهو لا يقيس مستوى الزيت — له مؤشر زجاجي مستقل.',
        unit: 'u3',
        concept: 'transformer-principle',
      },
    ],
  },
};

// ================================================================
// أسئلة الوحدة الثالثة في الاختبار التشخيصي الشامل
// ================================================================
export const U3_DIAG = [
  {
    t: 'mc',
    q: 'ما وظيفة الموحّد <i>Commutator</i> في مولد التيار المستمر؟',
    opts: [
      'تحويل الجهد المتولد إلى جهد مستمر في الدائرة الخارجية',
      'تثبيت سرعة دوران العضو الدوار عند القيمة التزامنية',
      'تبريد ملفات المجال ومنع ارتفاع حرارة العضو الثابت',
    ],
    correct: 0,
    why: 'الجهد المتولد في الملف الدوار متردد بطبيعته؛ الموحّد يعكس التوصيل مع الدائرة الخارجية كل نصف لفة فتخرج الموجة في اتجاه واحد، والفرش الكربونية تنقلها إلى الحمل.',
    unit: 'u3',
    concept: 'generated-emf',
  },
  {
    t: 'mc',
    q: 'محرك حثي سرعته التزامنية <span class="ltr">1800 rpm</span> ويدور فعليًا عند <span class="ltr">1710 rpm</span>. كم الانزلاق؟',
    opts: ['<span class="ltr">5%</span>', '<span class="ltr">10%</span>', '<span class="ltr">95%</span>'],
    correct: 0,
    why: '<span class="ltr">s = (1800 − 1710) ÷ 1800 = 90 ÷ 1800 = 0.05 = 5%</span>. القيمة <span class="ltr">95%</span> هي نسبة السرعة الفعلية إلى التزامنية لا الانزلاق.',
    unit: 'u3',
    concept: 'slip',
  },
  {
    t: 'mc',
    q: 'محول يرفع الجهد من <span class="ltr">220 V</span> إلى <span class="ltr">11 kV</span>. أي الملفين له عدد لفات أكبر؟',
    opts: [
      'الملف الثانوي لأن جهده أعلى',
      'الملف الابتدائي لأنه طرف المصدر',
      'الملفان متساويان في عدد اللفات',
    ],
    correct: 0,
    why: 'عدد اللفات يتناسب طرديًا مع الجهد: <span class="ltr">V₁/V₂ = N₁/N₂</span>. وبما أن جهد الثانوي أعلى <span class="ltr">50</span> ضعفًا فلفاته أكثر بالنسبة نفسها.',
    unit: 'u3',
    concept: 'transformer-principle',
  },
];
