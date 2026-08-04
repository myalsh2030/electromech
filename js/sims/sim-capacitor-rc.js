// مختبر شحن وتفريغ المكثف: بطارية + مفتاح شحن/تفريغ + R + C
// دائرة RC بمعادلة أسية دقيقة: Uc(t)=target+(Uc0-target)e^(-t/τ) — τ=RC
// ملاحظة العقد: كل الألوان من kit.pal (فاتح/داكن) — بلا hex صلب هنا.
import { SimKit, label, arrow, withAlpha } from './simkit.js';

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.72 });
  const read = kit.readout();

  // ===== حالة الدائرة =====
  let mode = 0;          // 0 متوقف | 1 شحن | 2 تفريغ
  let Uc = 0;             // جهد المكثف الحالي (V)
  let Ic = 0;             // تيار الدائرة الحالي (A) — موجب شحن، سالب تفريغ
  let tPhase = 0;         // زمن محاكاة منذ بداية الطور الحالي (s)
  let phaseStartUc = 0;   // جهد المكثف عند بداية الطور الحالي
  let history = [];       // نقاط الرسم البياني {t,u,i} للطور الحالي
  const done = new Set();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id);
    ctx.completeMission(id);
  };

  // خط أساس لمهمة مضاعفة C (m4): يُحدَّث عند أي تغيير في R، ويتقدّم مع كل تغيير في C
  let baseR = 1000, baseC = 100;

  const checkRC = (r, cUF) => {
    const rc = r * cUF * 1e-6;
    if (Math.abs(rc - 1) <= 0.05) complete('m2');
  };

  // ===== المنزلقات =====
  const ESl = kit.slider({
    label: 'جهد المصدر E', min: 5, max: 30, step: 0.5, value: 12, unit: 'V',
    fmt: v => v.toFixed(1),
  });
  const RSl = kit.slider({
    label: 'المقاومة R', min: 100, max: 100000, step: 100, value: 1000,
    fmt: v => (v >= 1000 ? (v / 1000).toFixed(2) + ' kΩ' : v.toFixed(0) + ' Ω'),
    oninput: v => {
      baseR = v; baseC = CSl.value;      // R تغيّرت ⟵ خط أساس جديد لمهمة المضاعفة
      checkRC(v, CSl.value);
    },
  });
  const CSl = kit.slider({
    label: 'السعة C', min: 4.7, max: 4700, step: 0.1, value: 100, unit: 'µF',
    fmt: v => v.toFixed(1),
    oninput: v => {
      // m4: مضاعفة C عند ثبات R (بلا تغيّر منذ آخر خط أساس) ⟵ نسبة 2.0±0.05
      // ملاحظة: baseC لا يُحدَّث هنا عند كل حدث C — يبقى ثابتًا على قيمته عند آخر تغيير لـ R
      // (يُضبط في RSl.oninput فقط)، وإلا يصبح خط الأساس آخر موضع للمنزلق فتستحيل مقارنة
      // «قبل المضاعفة/بعدها» أثناء السحب المتواصل.
      if (Math.abs(RSl.value - baseR) < 1e-6 && baseC > 0 && Math.abs(v / baseC - 2) <= 0.05) {
        complete('m4');
      }
      checkRC(RSl.value, v);
    },
  });

  // ===== أزرار التحكم بالمفتاح =====
  kit.buttons([
    {
      label: '⚡ شحن', cls: '',
      onclick: () => { mode = 1; tPhase = 0; phaseStartUc = Uc; history = []; },
    },
    {
      label: '🔻 تفريغ', cls: 'secondary',
      onclick: () => {
        // m3: تفريغ يبدأ من شحن شبه كامل (≥95% من E) ⟵ تيار ابتدائي ≈ -E/R ±5%
        const ratio = Uc / ESl.value;
        if (ratio >= 0.95) complete('m3');
        mode = 2; tPhase = 0; phaseStartUc = Uc; history = [];
      },
    },
    {
      label: '↺ إعادة ضبط', cls: 'ghost',
      onclick: () => { mode = 0; Uc = 0; Ic = 0; tPhase = 0; phaseStartUc = 0; history = []; },
    },
  ]);

  // ===== جسيمات التيار (على محيط حلقة الدائرة) =====
  const N_PART = 18;
  const particles = Array.from({ length: N_PART }, (_, i) => ({ phase: i / N_PART }));

  // نقاط الشكل على محيط الحلقة (مصفوفة أضلاع + الأطوال التراكمية) — تُحسب كل إطار لأن الحجم يتغيّر
  function perimeterPoint(pts, lens, total, ph) {
    let d = ((ph % 1) + 1) % 1 * total;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if (d <= lens[i] || i === pts.length - 1) {
        const f = lens[i] ? d / lens[i] : 0;
        return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
      }
      d -= lens[i];
    }
    return pts[0];
  }

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H;
    const E = ESl.value, R = RSl.value, Cf = CSl.value * 1e-6;
    const tau = Math.max(R * Cf, 1e-6);
    const target = mode === 1 ? E : mode === 2 ? 0 : Uc;

    // ===== الفيزياء: حل أسي دقيق لكل خطوة زمنية (مستقر مهما كبرت الخطوة) =====
    if (mode !== 0) {
      // زمن حقيقي طالما 5τ ضمن نافذة معقولة (يطابق m2: RC=1s ⟵ شحن كامل في 5s فعليًا)،
      // ويُسرَّع فقط للقيم الكبيرة كي لا ينتظر المتدرب دقائق — وبذلك تظهر مضاعفة C
      // (m4) بصريًا كمضاعفة فعلية لمدة الحركة لا شكلًا مطابقًا بمدة ثابتة دائمًا.
      const REAL_S_CAP = 12;
      const simSpeed = (5 * tau) > REAL_S_CAP ? (5 * tau) / REAL_S_CAP : 1;
      const dtSim = dt * simSpeed;
      const prevT = tPhase;
      const alpha = 1 - Math.exp(-dtSim / tau);
      Uc += (target - Uc) * alpha;
      Ic = (target - Uc) / R;
      tPhase += dtSim;

      // m1: عند العبور من طور شحن بدأ قريبًا من الصفر (تفريغ حقيقي سابق) وt=τ ⟵ 63%±2%
      if (mode === 1 && phaseStartUc <= 0.05 * E && prevT < tau && tPhase >= tau) {
        const ratio = Uc / E;
        if (Math.abs(ratio - 0.632) <= 0.02) complete('m1');
      }

      if (!history.length || tPhase - history[history.length - 1].t > tau * 0.02) {
        history.push({ t: tPhase, u: Uc / E, i: Ic / (E / R) });
        if (history.length > 300) history.shift();
      }
    } else {
      Ic = 0;
    }

    // ===== هندسة الرسم =====
    const circTop = 14, circBot = H * 0.5;
    const graphTop = H * 0.58, graphBot = H - 16;
    const x1 = W * 0.16, x2 = W * 0.8, y1 = circTop + 26, y2 = circBot - 8;

    // ===== الحلقة (محيط مستطيل: علوي=مقاومة، يمين=مكثف، سفلي=مفتاح، يسار=بطارية) =====
    const TL = { x: x1, y: y1 }, TR = { x: x2, y: y1 }, BR = { x: x2, y: y2 }, BL = { x: x1, y: y2 };
    const pts = [TL, TR, BR, BL];
    const lens = pts.map((p, i) => {
      const q = pts[(i + 1) % pts.length];
      return Math.hypot(q.x - p.x, q.y - p.y);
    });
    const total = lens.reduce((a, b) => a + b, 0);

    c.strokeStyle = withAlpha(kit.pal.text, 0.5);
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(TL.x, TL.y); c.lineTo(TR.x, TR.y); c.lineTo(BR.x, BR.y); c.lineTo(BL.x, BL.y); c.closePath();
    c.stroke();

    // بطارية على الضلع الأيسر
    drawBattery(c, x1, (y1 + y2) / 2, kit.pal);
    // مقاومة زجزاجية على الضلع العلوي
    drawResistor(c, x1, x2, y1, kit.pal);
    label(c, `R = ${R >= 1000 ? (R / 1000).toFixed(2) + ' kΩ' : R.toFixed(0) + ' Ω'}`, (x1 + x2) / 2, y1 - 14, { size: 12, color: kit.pal.amber, align: 'center' });
    // مكثف على الضلع الأيمن (فتحة اللوحين تعكس نسبة الشحن)
    drawCapacitor(c, x2, y1, y2, Uc / E, kit.pal);
    label(c, `C = ${CSl.value.toFixed(1)} µF`, x2 + 10, (y1 + y2) / 2, { size: 12, color: kit.pal.water, align: 'left' });
    // مفتاح على الضلع السفلي
    drawSwitch(c, x1, x2, y2, mode, kit.pal);

    // جسيمات التيار على المحيط (تتوقف عند mode=0)
    if (mode !== 0) {
      const dir = mode === 1 ? 1 : -1;
      const ampRatio = Math.min(1, Math.abs(Ic) * R / Math.max(E, 1e-6));
      const speed = 0.05 + 0.3 * ampRatio;
      const count = Math.max(2, Math.round(3 + 13 * ampRatio));
      const col = mode === 1 ? kit.pal.amber : kit.pal.water2;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.phase += dir * speed * dt;
        const pt = perimeterPoint(pts, lens, total, p.phase);
        c.beginPath();
        c.fillStyle = col;
        c.arc(pt.x, pt.y, 2.6, 0, Math.PI * 2);
        c.fill();
      }
    }

    // ===== الرسم البياني: Uc/E و Ic/(E/R) مقابل t/τ حتى 5τ =====
    drawGraph(c, x1, graphTop, x2 - x1, graphBot - graphTop, history, tau, kit.pal);

    // ===== نصوص الحالة =====
    const modeTxt = mode === 1 ? 'شحن' : mode === 2 ? 'تفريغ' : 'متوقف';
    const modeColor = mode === 1 ? kit.pal.ok : mode === 2 ? kit.pal.bad : kit.pal.text2;
    label(c, `الوضع: ${modeTxt}`, W - 10, 16, { size: 12.5, color: modeColor, align: 'right' });
    label(c, `t = ${tPhase.toFixed(2)} s  |  τ = ${tau.toFixed(3)} s`, W - 10, 34, { size: 11.5, color: kit.pal.text2, align: 'right' });

    // ===== القراءات الحية =====
    read.set([
      { label: 'E', value: `${E.toFixed(1)} V`, color: kit.pal.text },
      { label: 'Uc', value: `${Uc.toFixed(2)} V`, color: kit.pal.amber },
      { label: 'Ic', value: `${(Ic * 1000).toFixed(2)} mA`, color: kit.pal.water },
      { label: 'τ=RC', value: `${tau.toFixed(3)} s`, color: kit.pal.ok },
      { label: 'شحن', value: `${((Uc / E) * 100).toFixed(1)}%`, color: kit.pal.badge },
    ]);
  });

  return {
    destroy() { kit.destroy(); },
  };
}

// ===== رسوم أعوان الشكل =====
function drawBattery(c, x, ymid, pal) {
  c.strokeStyle = pal.text; c.lineWidth = 2.4; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x - 12, ymid - 12); c.lineTo(x + 12, ymid - 12); c.stroke();
  c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(x - 7, ymid - 4); c.lineTo(x + 7, ymid - 4); c.stroke();
  c.lineWidth = 2.4;
  c.beginPath(); c.moveTo(x - 12, ymid + 6); c.lineTo(x + 12, ymid + 6); c.stroke();
  c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(x - 7, ymid + 14); c.lineTo(x + 7, ymid + 14); c.stroke();
  label(c, '+', x, ymid - 22, { size: 13, color: pal.ok, align: 'center' });
  label(c, '−', x, ymid + 24, { size: 13, color: pal.bad, align: 'center' });
}

function drawResistor(c, x1, x2, y, pal) {
  const n = 6, w = (x2 - x1) * 0.4, x0 = (x1 + x2) / 2 - w / 2, seg = w / n, amp = 8;
  c.strokeStyle = pal.amber; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x1, y);
  c.lineTo(x0, y);
  for (let i = 0; i < n; i++) {
    const xx = x0 + seg * (i + 1);
    c.lineTo(xx - seg / 2, y + (i % 2 ? amp : -amp));
  }
  c.lineTo(x0 + w, y);
  c.lineTo(x2, y);
  c.stroke();
}

function drawCapacitor(c, x, y1, y2, ratio, pal) {
  const ymid = (y1 + y2) / 2, gap = 10, plateW = 18;
  c.strokeStyle = pal.text; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(x, y1); c.lineTo(x, ymid - gap); c.stroke();
  c.beginPath(); c.moveTo(x, ymid + gap); c.lineTo(x, y2); c.stroke();
  const fillCol = withAlpha(pal.water, Math.max(0.15, Math.min(1, ratio)));
  c.strokeStyle = fillCol; c.lineWidth = 3;
  c.beginPath(); c.moveTo(x - plateW / 2, ymid - gap); c.lineTo(x + plateW / 2, ymid - gap); c.stroke();
  c.beginPath(); c.moveTo(x - plateW / 2, ymid + gap); c.lineTo(x + plateW / 2, ymid + gap); c.stroke();
}

function drawSwitch(c, x1, x2, y, mode, pal) {
  const cx = x1 + (x2 - x1) * 0.28, gap = 26;
  c.strokeStyle = mode === 0 ? pal.text2 : pal.ok; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x1, y); c.lineTo(cx - 4, y); c.stroke();
  c.beginPath(); c.moveTo(cx + gap + 4, y); c.lineTo(x2, y); c.stroke();
  c.beginPath(); c.arc(cx - 4, y, 2.6, 0, Math.PI * 2); c.fillStyle = pal.text; c.fill();
  c.beginPath(); c.arc(cx + gap + 4, y, 2.6, 0, Math.PI * 2); c.fill();
  const leverY = mode === 0 ? y - 14 : y;
  c.beginPath(); c.moveTo(cx - 4, y); c.lineTo(cx + gap + 4, leverY); c.stroke();
  const lbl = mode === 1 ? 'شحن' : mode === 2 ? 'تفريغ' : 'مفتوح';
  label(c, lbl, cx + gap / 2, y + 18, { size: 11, color: pal.text2, align: 'center' });
}

function drawGraph(c, x, y, w, h, history, tau, pal) {
  c.strokeStyle = withAlpha(pal.text, 0.18); c.lineWidth = 1;
  c.strokeRect(x, y, w, h);
  // خطوط شبكة عند τ,2τ..5τ
  for (let k = 1; k <= 5; k++) {
    const gx = x + (w * k) / 5;
    c.beginPath(); c.moveTo(gx, y); c.lineTo(gx, y + h); c.strokeStyle = withAlpha(pal.text, 0.08); c.stroke();
  }
  label(c, 'Uc/E و Ic/(E/R) — المحور الأفقي حتى 5τ', x + w / 2, y - 8, { size: 10.5, color: pal.text2, align: 'center' });
  if (history.length < 2) return;
  const xOf = pt => x + Math.min(1, pt.t / (5 * tau)) * w;
  const yOf = v => y + h - Math.max(0, Math.min(1, v)) * h;
  c.beginPath(); c.strokeStyle = pal.amber; c.lineWidth = 2;
  history.forEach((p, i) => { const px = xOf(p), py = yOf(p.u); i ? c.lineTo(px, py) : c.moveTo(px, py); });
  c.stroke();
  c.beginPath(); c.strokeStyle = pal.water; c.lineWidth = 2;
  history.forEach((p, i) => { const px = xOf(p), py = yOf(Math.abs(p.i)); i ? c.lineTo(px, py) : c.moveTo(px, py); });
  c.stroke();
}
