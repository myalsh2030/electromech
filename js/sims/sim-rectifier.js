// دائرة التوحيد والتنعيم — نصف موجة / قنطرة موجة كاملة / ثلاثي الأوجه + مكثف تنعيم.
// المحاكاة رقمية بالكامل: تُبنى موجة الخرج بالتكامل الزمني (شحن المكثف من القمم وتفريغه
// في الحمل بثابت الزمن RC) ثم تُقاس منها V_p و V_o و V_r وتردد الخرج والكفاءة —
// أي أن الأرقام مقيسة من الموجة لا مكتوبة سلفًا، تمامًا كقراءة الراسم في المعمل.
// عقد الألوان: كل الألوان من kit.pal (الوضعان فاتح/داكن) — بلا hex صلب.
import { SimKit, label, withAlpha } from './simkit.js';

const TYPES = [
  { id: 'half',   name: 'نصف موجة',   k: 1, coef: 0.318, nd: 1 },
  { id: 'bridge', name: 'قنطرة كاملة', k: 2, coef: 0.636, nd: 2 },
  { id: 'three',  name: 'ثلاثي الأوجه', k: 3, coef: 0.827, nd: 1 },
];
const CAPS = [0, 4.7, 100, 470, 1000];      // µF — «بدون» أولًا
const FAULTS = [
  { id: 'ok',    name: 'دايودات سليمة' },
  { id: 'rev',   name: 'عكس دايود' },
  { id: 'short', name: 'قصر دايود' },
];
const VD = 0.7;        // هبوط الدايود السيليكوني V
const RS = 0.6;        // مقاومة المصدر والأسلاك Ω (تحدّ تيار القصر)
const I_LIMIT = 1;     // تقنين الدايود 1 A (أدوات الحقيبة 100V/1A)
const N = 360;         // عينة لكل دورة مصدر
const SETTLE = 10;     // دورات حتى استقرار المكثف
const VPD = [0.2, 0.5, 1, 2, 5, 10, 20, 50];

// ───────── نواة المحاكاة: موجة خرج دورة كاملة في الحالة المستقرة + قياساتها ─────────
function simulate(ty, Vp, R, Cf, f, fault) {
  // جهد خرج المقوّم المثالي عند زاوية th (قبل المكثف)
  const rect = (th) => {
    const v = Vp * Math.sin(th);
    if (ty.id === 'half') {
      if (fault === 'short') return v;                       // مقصور: تمر الموجة بلا توحيد
      if (fault === 'rev') return Math.max(0, -v - VD);       // معكوس: النصف الآخر
      return Math.max(0, v - VD);
    }
    if (ty.id === 'bridge') {
      if (fault === 'rev') return Math.max(0, v - 2 * VD);    // ذراع مكسورة ⟵ نصف موجة
      if (fault === 'short') return Math.max(0, v - VD);      // دايود مقصور ⟵ نصف موجة وقصر بالوجه الآخر
      return Math.max(0, Math.abs(v) - 2 * VD);
    }
    const v0 = Vp * Math.sin(th), v1 = Vp * Math.sin(th - 2.0943951), v2 = Vp * Math.sin(th + 2.0943951);
    if (fault === 'rev') return Math.max(0, Math.max(-v0, v1, v2) - VD);
    if (fault === 'short') {
      const base = Math.max(0, Math.max(v1, v2) - VD);
      return v0 < 0 ? Math.min(base, v0) : Math.max(base, v0);
    }
    return Math.max(0, Math.max(v0, v1, v2) - VD);
  };

  const w = new Float64Array(N);
  const dt = 1 / (f * N);
  const decay = Cf > 0 ? Math.exp(-dt / Math.max(R * Cf, 1e-9)) : 0;
  let v = 0;
  for (let i = 0; i < (SETTLE + 1) * N; i++) {
    const src = rect(2 * Math.PI * (i % N) / N);
    v = Cf > 0 ? Math.max(src, v * decay) : src;
    if (i >= SETTLE * N) w[i - SETTLE * N] = v;
  }

  let mx = -Infinity, mn = Infinity, sum = 0, sq = 0;
  for (let i = 0; i < N; i++) { const x = w[i]; if (x > mx) mx = x; if (x < mn) mn = x; sum += x; sq += x * x; }
  const Vo = sum / N, Vrms = Math.sqrt(sq / N);

  // تردد الخرج يُقاس من متوسط المسافة بين قمم الموجة (كما يُقاس بالراسم)
  const pk = [];
  for (let i = 0; i < N; i++) {
    const a = w[(i - 1 + N) % N], b = w[i], d = w[(i + 1) % N];
    if (b >= a && b > d && b > 0.35 * mx) pk.push(i);
  }
  let fOut = f;
  if (pk.length) {
    let g = 0;
    for (let i = 0; i < pk.length; i++) g += ((pk[(i + 1) % pk.length] - pk[i] + N) % N) || N;
    fOut = f * N / (g / pk.length);
  }

  // تيار القصر: الدايود المقصور يضع المصدر على مقاومة الأسلاك وحدها (نفس نموذج RS في الأنواع الثلاثة)
  let Isc = mx / Math.max(R, 1e-6);
  if (fault === 'short') {
    Isc = ty.id === 'three' ? Math.sqrt(3) * Vp / (RS + 0.05) : Vp / (RS + 0.05);
  } else if (fault === 'rev' && ty.id === 'bridge') {
    // دايود معكوس في القنطرة يفتح مسارًا مباشرًا حول المصدر عبر الدايودين السليمين في نصف الدورة الأخرى
    Isc = Vp / (RS + 0.05);
  }
  return { w, Vo, Vrms, Vpk: mx, Vr: mx - mn, fOut, Isc, eta: Vrms > 0 ? (Vo / Vrms) ** 2 : 0 };
}

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.66 });
  const read = kit.readout();

  // ===== الحالة (الافتراضيات خارج شروط كل المهام) =====
  let ti = 0;            // نصف موجة
  let ci = 2;            // 100 µF ⟵ يمنع تحقّق m1/m2 عند الفتح
  let fi = 0;            // دايودات سليمة
  let fq = 50;           // Hz
  let S = null, HEALTHY = null;
  let alarmT = 0, pulse = 0;
  let cSeq = [];         // تسلسل اختيار المكثفات لمهمة m3
  const seenF = new Set(), seenVo = new Set();
  const done = new Set();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id); pulse = 1;
    ctx.completeMission(id);
  };

  const recompute = () => {
    const ty = TYPES[ti], Vp = vSl.value * Math.SQRT2, R = Math.max(rSl.value, 1), Cf = CAPS[ci] * 1e-6;
    S = simulate(ty, Vp, R, Cf, fq, FAULTS[fi].id);
    HEALTHY = fi === 0 ? S : simulate(ty, Vp, R, Cf, fq, 'ok');
  };

  // ===== المنزلقات =====
  const vSl = kit.slider({
    label: 'جهد المصدر V_ac', min: 0, max: 50, step: 0.5, value: 24, unit: 'V',
    fmt: v => v.toFixed(1),
    oninput: () => { cSeq = []; recompute(); },
  });
  const rSl = kit.slider({
    label: 'مقاومة الحمل R_L', min: 10, max: 10000, step: 10, value: 1000,
    fmt: v => (v >= 1000 ? (v / 1000).toFixed(2) + ' kΩ' : v.toFixed(0) + ' Ω'),
    oninput: () => { cSeq = []; recompute(); },
  });

  // ===== أزرار النوع =====
  const tyBtns = kit.buttons(TYPES.map((t, i) => ({
    label: t.name, onclick: () => { ti = i; cSeq = []; recompute(); paint(); },
  })));

  // ===== أزرار المكثف — هنا يُسجَّل تسلسل m3 =====
  const cBtns = kit.buttons(CAPS.map((v, i) => ({
    label: v === 0 ? 'بدون مكثف' : `${v} µF`, cls: 'secondary',
    onclick: () => {
      ci = i; recompute(); paint();
      if (v > 0) {
        cSeq.push({ c: v, vr: S.Vr });
        if (cSeq.length > 4) cSeq.shift();
        checkSeq();
      } else cSeq = [];
    },
  })));

  // m3: آخر ثلاثة اختيارات = 4.7 ثم 100 ثم 470 µF وV_r متناقصة تناقصًا صارمًا
  const checkSeq = () => {
    if (cSeq.length < 3) return;
    const [a, b, d] = cSeq.slice(-3);
    if (a.c === 4.7 && b.c === 100 && d.c === 470 && a.vr > b.vr && b.vr > d.vr) complete('m3');
  };

  // ===== أزرار الأعطال والتردد =====
  const fBtns = kit.buttons(FAULTS.map((f, i) => ({
    label: f.name, cls: 'secondary',
    onclick: () => { fi = i; alarmT = 0; recompute(); paint(); },
  })));
  const qBtns = kit.buttons([50, 60].map(v => ({
    label: `${v} Hz`, cls: 'ghost',
    onclick: () => { fq = v; cSeq = []; recompute(); paint(); },
  })));

  const paint = () => {
    tyBtns.forEach((b, i) => { b.className = `btn sm ${i === ti ? '' : 'secondary'}`; });
    cBtns.forEach((b, i) => { b.className = `btn sm ${i === ci ? '' : 'secondary'}`; });
    fBtns.forEach((b, i) => { b.className = `btn sm ${i === fi ? '' : 'secondary'}`; });
    qBtns.forEach((b, i) => { b.className = `btn sm ${[50, 60][i] === fq ? '' : 'ghost'}`; });
  };
  recompute(); paint();

  // ===== فاحص المهام: مؤقت مستقل عن حلقة الرسم =====
  const timer = setInterval(() => {
    if (!S) return;
    const ty = TYPES[ti], C = CAPS[ci], fault = FAULTS[fi].id, Vac = vSl.value;

    // m1 — عند 15 V بلا مكثف: تردد الخرج = k×تردد المصدر بخطأ ±2% للأنواع الثلاثة
    if (Math.abs(Vac - 15) < 0.26 && C === 0 && fault === 'ok') {
      const exp = ty.k * fq;
      if (Math.abs(S.fOut - exp) / exp * 100 <= 2) seenF.add(ty.id);
      if (seenF.size === 3) complete('m1');
    }
    // m2 — V_o المقاس مقابل 0.318V_p (نصف) و0.636V_p (كاملة) بخطأ ±5%
    // (يُستثنى Vac القريب من 15 V كي لا يُمنح m2 كأثر جانبي لإجراء m1 نفسه في نفس اللحظة)
    if (C === 0 && fault === 'ok' && Vac >= 5 && Math.abs(Vac - 15) >= 1 && ty.id !== 'three') {
      const calc = ty.coef * S.Vpk;
      if (calc > 0 && Math.abs(S.Vo - calc) / calc * 100 <= 5) seenVo.add(ty.id);
      if (seenVo.size === 2) complete('m2');
    }
    // m4 — عكس دايود في القنطرة: شكل الخرج يتغيّر (التردد ينتصف) وV_o يهبط
    if (ty.id === 'bridge' && fault === 'rev' && HEALTHY && HEALTHY.Vo > 1) {
      const halved = Math.abs(S.fOut - HEALTHY.fOut / 2) <= 0.05 * HEALTHY.fOut;
      if (halved && S.Vo <= HEALTHY.Vo - 0.05) complete('m4');
    }
    // m5 — إنذار تيار القصر ظاهر ومستقر 1.2 s (dwell بطوابع performance.now)
    if (fault === 'short' && S.Isc >= I_LIMIT) {
      const now = performance.now();
      if (!alarmT) alarmT = now;
      else if (now - alarmT >= 1200) complete('m5');
    } else alarmT = 0;
  }, 160);

  // ===== جسيمات تيار الحمل (≤ 12) =====
  const parts = Array.from({ length: 12 }, (_, i) => ({ p: i / 12 }));

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, P = kit.pal;
    const ty = TYPES[ti], fault = FAULTS[fi].id, C = CAPS[ci];
    const Vp = vSl.value * Math.SQRT2, R = Math.max(rSl.value, 1);
    const alarm = fault === 'short' && S.Isc >= I_LIMIT;
    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.2);

    // ── شاشة الراسم (يسار) ──
    const sx = 8, sy = 30, sw = W * 0.56, sh = H - sy - 26;
    drawScope(c, sx, sy, sw, sh, S, Vp, ty, fq, C, P, alarm);

    // ── مخطط الدائرة (يمين) ──
    const cx0 = W * 0.60, cw = W - cx0 - 8;
    drawCircuit(c, cx0, sy, cw, sh, ty, fault, C, P, parts, dt, S, R, alarm);

    // ── العنوان وشريط الإنذار ──
    label(c, `${ty.name} — ${C === 0 ? 'بلا مكثف' : C + ' µF'} — ${fq} Hz`, W - 8, 14,
      { size: 12.5, color: pulse > 0 ? P.ok : P.text, align: 'right' });
    if (alarm) {
      c.fillStyle = withAlpha(P.bad, 0.18 + 0.12 * Math.sin(t * 8));
      c.fillRect(0, 0, W, 24);
      label(c, `⚠ إنذار تيار قصر: ${S.Isc.toFixed(1)} A — يتجاوز تقنين الدايود ${I_LIMIT} A`, 8, 13,
        { size: 12, color: P.bad, align: 'left' });
    } else if (S.Isc > I_LIMIT) {
      label(c, `تنبيه: تيار الذروة ${S.Isc.toFixed(2)} A فوق التقنين`, 8, 13, { size: 11.5, color: P.amber, align: 'left' });
    }

    // ── القراءات الحية ──
    const calc = ty.coef * S.Vpk;
    const err = calc > 0 ? Math.abs(S.Vo - calc) / calc * 100 : 0;
    if (C === 0 && calc > 0) {
      label(c, `الخطأ بين المقاس والمحسوب: ${err.toFixed(1)}%`, W - 8, 30,
        { size: 11.5, color: err <= 5 ? P.ok : P.amber, align: 'right' });
    }
    read.set([
      { label: 'V_p قمة الخرج', value: `${S.Vpk.toFixed(2)} V`, color: P.amber },
      { label: 'V_o المقاس', value: `${S.Vo.toFixed(2)} V`, color: P.water },
      { label: `V_o المحسوب ${ty.coef}V_p`, value: `${calc.toFixed(2)} V`, color: P.text2 },
      { label: 'V_r التموج', value: `${S.Vr.toFixed(2)} V`, color: P.badge },
      { label: 'تردد الخرج', value: `${S.fOut.toFixed(1)} Hz`, color: P.ok },
      { label: 'I_o', value: `${(S.Vo / R * 1000).toFixed(1)} mA`, color: P.water },
      { label: 'η الكفاءة', value: `${(S.eta * 100).toFixed(1)} %`, color: P.ok },
    ]);
  });

  return {
    destroy() { clearInterval(timer); kit.destroy(); },
  };
}

// ───────────────────── شاشة الراسم ذات القناتين ─────────────────────
function drawScope(c, x, y, w, h, S, Vp, ty, f, C, P, alarm) {
  c.save();
  c.fillStyle = withAlpha(P.text, 0.05);
  c.fillRect(x, y, w, h);
  c.strokeStyle = withAlpha(P.text, 0.35); c.lineWidth = 1.2;
  c.strokeRect(x, y, w, h);

  const zero = y + h * 0.55, dv = h / 8;
  const vpd = VPD.find(s => s >= Math.max(Vp, 1) / 3.6) || 50;
  const yOf = v => zero - v / vpd * dv;

  // الشبكة
  c.lineWidth = 1; c.strokeStyle = withAlpha(P.text, 0.1);
  c.beginPath();
  for (let i = 1; i < 10; i++) { const gx = x + w * i / 10; c.moveTo(gx, y); c.lineTo(gx, y + h); }
  for (let i = 1; i < 8; i++) { const gy = y + dv * i; c.moveTo(x, gy); c.lineTo(x + w, gy); }
  c.stroke();
  c.strokeStyle = withAlpha(P.text, 0.4);
  c.beginPath(); c.moveTo(x, zero); c.lineTo(x + w, zero); c.stroke();

  c.beginPath(); c.rect(x, y, w, h); c.clip();
  const M = S.w.length, SP = 2 * M;               // دورتا مصدر معروضتان
  const xOf = i => x + i / SP * w;

  // القناة 1: الدخل (ثلاثة أوجه ترسم باهتة معًا)
  const ph = ty.id === 'three' ? [0, -2.0943951, 2.0943951] : [0];
  ph.forEach((p, k) => {
    c.beginPath();
    c.strokeStyle = withAlpha(P.amber, k === 0 ? 0.9 : 0.35);
    c.lineWidth = k === 0 ? 1.8 : 1.2;
    for (let i = 0; i <= SP; i++) {
      const v = Vp * Math.sin(2 * Math.PI * (i % M) / M - p);
      i ? c.lineTo(xOf(i), yOf(v)) : c.moveTo(xOf(i), yOf(v));
    }
    c.stroke();
  });

  // نطاق التموج مظللًا بين القمة والقاع
  if (C > 0 && S.Vr > 0.05) {
    c.fillStyle = withAlpha(P.badge, 0.16);
    c.fillRect(x, yOf(S.Vpk), w, Math.max(1, yOf(S.Vpk - S.Vr) - yOf(S.Vpk)));
  }

  // القناة 2: الخرج
  c.beginPath();
  c.strokeStyle = alarm ? P.bad : P.water;
  c.lineWidth = 2.4;
  for (let i = 0; i <= SP; i++) {
    const v = S.w[i % M];
    i ? c.lineTo(xOf(i), yOf(v)) : c.moveTo(xOf(i), yOf(v));
  }
  c.stroke();

  // خط V_o المتوسط
  c.setLineDash([6, 4]); c.strokeStyle = P.ok; c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(x, yOf(S.Vo)); c.lineTo(x + w, yOf(S.Vo)); c.stroke();
  c.setLineDash([]);
  c.restore();

  label(c, `V_o = ${S.Vo.toFixed(2)} V`, x + w - 6, yOf(S.Vo) - 9, { size: 11, color: P.ok, align: 'right' });
  label(c, `${vpd} V/div`, x + 6, y + 12, { size: 11, color: P.text2, align: 'left' });
  label(c, `${(2000 / f / 10).toFixed(1)} ms/div`, x + 6, y + 27, { size: 11, color: P.text2, align: 'left' });
  label(c, 'CH1 الدخل', x + w - 6, y + 12, { size: 11, color: P.amber, align: 'right' });
  label(c, 'CH2 الخرج', x + w - 6, y + 27, { size: 11, color: P.water, align: 'right' });
  label(c, `f_out = ${S.fOut.toFixed(1)} Hz  =  ${(S.fOut / f).toFixed(1)} × f_src`, x + w / 2, y + h + 13,
    { size: 11.5, color: P.text2, align: 'center' });
}

// ───────────────────── مخطط الدائرة ─────────────────────
function drawCircuit(c, x, y, w, h, ty, fault, C, P, parts, dt, S, R, alarm) {
  const xL = x + 26, xR = x + w - 30, xM = (xL + xR) / 2 + 10;
  const top = y + 26, bot = y + h - 34;
  const wire = withAlpha(P.text, 0.55);
  const st = fault === 'ok' ? P.text : fault === 'rev' ? P.amber : P.bad;

  c.save();
  c.strokeStyle = wire; c.lineWidth = 1.7; c.lineCap = 'round';

  if (ty.id === 'three') {
    // ثلاثة أوجه ⟵ ثلاثة دايودات ⟵ قضيب موجب مشترك، والتعادل قضيب سفلي
    const nx = x + 10;
    const ys = [top + 18, (top + bot) / 2, bot - 18];
    ys.forEach((yy, k) => {
      src(c, xL, yy, P, `L${k + 1}`);
      c.beginPath(); c.moveTo(xL + 13, yy); c.lineTo(xM, yy); c.stroke();
      c.beginPath(); c.moveTo(xL - 13, yy); c.lineTo(nx, yy); c.stroke();
      diode(c, (xL + 13 + xM) / 2, yy, 0, k === 0 ? st : P.text, P);
    });
    c.beginPath(); c.moveTo(xM, ys[0]); c.lineTo(xM, ys[2]); c.stroke();
    c.beginPath(); c.moveTo(xM, ys[0]); c.lineTo(xM, top); c.lineTo(xR, top); c.stroke();
    c.beginPath(); c.moveTo(nx, ys[0]); c.lineTo(nx, bot); c.lineTo(xR, bot); c.stroke();
    label(c, 'N', nx + 8, bot - 10, { size: 10.5, color: P.text2, align: 'center' });
    loadBranch(c, xR, top, bot, C, P, R, S);
  } else {
    // حلقة: مصدر يسارًا، مقوّم أعلى، مكثف وحمل يمينًا
    src(c, xL, (top + bot) / 2, P, '~');
    c.beginPath();
    c.moveTo(xL, (top + bot) / 2 - 13); c.lineTo(xL, top); c.lineTo(xR, top);
    c.moveTo(xL, (top + bot) / 2 + 13); c.lineTo(xL, bot); c.lineTo(xR, bot);
    c.moveTo(xR, top); c.lineTo(xR, bot);
    c.stroke();
    if (ty.id === 'half') {
      diode(c, (xL + xR) / 2, top, fault === 'rev' ? Math.PI : 0, st, P);
    } else {
      // قنطرة: أربعة دايودات على معين بين المصدر والخرج
      const bx = (xL + xR) / 2, by = (top + bot) / 2 - 6, r = Math.min(26, (xR - xL) / 4);
      c.strokeStyle = wire;
      c.beginPath();
      c.moveTo(bx - r, by); c.lineTo(bx, by - r); c.lineTo(bx + r, by); c.lineTo(bx, by + r); c.closePath();
      c.stroke();
      c.beginPath(); c.moveTo(bx, by - r); c.lineTo(bx, top); c.moveTo(bx, by + r); c.lineTo(bx, bot); c.stroke();
      diode(c, bx - r / 2, by - r / 2, -Math.PI / 4, fault === 'ok' ? P.text : st, P, 7);
      diode(c, bx + r / 2, by - r / 2, -Math.PI * 3 / 4, P.text, P, 7);
      diode(c, bx - r / 2, by + r / 2, Math.PI / 4, P.text, P, 7);
      diode(c, bx + r / 2, by + r / 2, Math.PI * 3 / 4, P.text, P, 7);
      label(c, 'قنطرة', bx, by + r + 14, { size: 10.5, color: P.text2, align: 'center' });
    }
    loadBranch(c, xR, top, bot, C, P, R, S);
  }
  c.restore();

  // جسيمات تيار الحمل على الضلع الأيمن (سرعتها بتيار الحمل)
  const io = S.Vo / R;
  const yA = top, yB = bot;
  if (io > 1e-4 && yB - yA > 14) {
    const sp = Math.min(0.9, 0.12 + io * 6);
    const n = Math.min(parts.length, Math.max(3, Math.round(3 + io * 90)));
    c.fillStyle = alarm ? P.bad : P.water2;
    for (let i = 0; i < n; i++) {
      const p = parts[i];
      p.p = (p.p + sp * dt) % 1;
      c.beginPath(); c.arc(x + w - 30, yA + p.p * (yB - yA), 2.4, 0, Math.PI * 2); c.fill();
    }
  }
  label(c, fault === 'ok' ? 'الدائرة سليمة' : fault === 'rev' ? 'دايود معكوس' : 'دايود مقصور',
    x + w / 2, y + h - 8, { size: 11.5, color: fault === 'ok' ? P.text2 : st, align: 'center' });
}

// فرع الحمل: المكثف موازيًا للمقاومة على الضلع الأيمن
function loadBranch(c, x, yTop, yBot, C, P, R, S) {
  const ym = (yTop + yBot) / 2;
  if (C > 0) {
    const cx = x - 34;
    c.strokeStyle = withAlpha(P.text, 0.55); c.lineWidth = 1.7;
    c.beginPath(); c.moveTo(cx, yTop); c.lineTo(cx, ym - 7); c.moveTo(cx, ym + 7); c.lineTo(cx, yBot); c.stroke();
    const chg = S.Vpk > 0 ? Math.max(0.2, Math.min(1, S.Vo / S.Vpk)) : 0.2;
    c.strokeStyle = withAlpha(P.badge, chg); c.lineWidth = 3;
    c.beginPath(); c.moveTo(cx - 9, ym - 7); c.lineTo(cx + 9, ym - 7); c.stroke();
    c.beginPath(); c.moveTo(cx - 9, ym + 7); c.lineTo(cx + 9, ym + 7); c.stroke();
    label(c, `${C} µF`, cx, ym + 22, { size: 10.5, color: P.badge, align: 'center' });
    label(c, '+', cx - 14, ym - 7, { size: 11, color: P.bad, align: 'center' });
  }
  // مقاومة الحمل: صندوق على الضلع الأيمن
  c.strokeStyle = P.amber; c.lineWidth = 2;
  c.strokeRect(x - 7, ym - 16, 14, 32);
  label(c, R >= 1000 ? `${(R / 1000).toFixed(1)} kΩ` : `${R} Ω`, x + 12, ym, { size: 10.5, color: P.amber, align: 'left' });
}

// رمز مصدر متردد
function src(c, x, y, P, tag) {
  c.save();
  c.strokeStyle = P.text2; c.lineWidth = 1.6;
  c.beginPath(); c.arc(x, y, 13, 0, Math.PI * 2); c.stroke();
  c.strokeStyle = P.amber; c.lineWidth = 1.8;
  c.beginPath();
  for (let i = -8; i <= 8; i++) c.lineTo(x + i, y - 4 * Math.sin(Math.PI * i / 8));
  c.stroke();
  c.restore();
  if (tag && tag !== '~') label(c, tag, x, y - 19, { size: 10.5, color: P.text2, align: 'center' });
}

// رمز دايود: مثلث + قضيب، ang اتجاه التمرير
function diode(c, x, y, ang, col, P, s = 9) {
  c.save();
  c.translate(x, y); c.rotate(ang);
  c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 2;
  c.beginPath(); c.moveTo(-s, -s * 0.8); c.lineTo(s * 0.5, 0); c.lineTo(-s, s * 0.8); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(s * 0.5, -s * 0.9); c.lineTo(s * 0.5, s * 0.9); c.stroke();
  c.restore();
}
