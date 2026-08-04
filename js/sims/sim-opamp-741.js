// مقعد مكبر التشغيل 741: ست تشكيلات (مقارن/عاكس/جامع/تفاضلي/تابع/مكبر أجهزة)
// خرج رقمي + راسم إشارة صغير، وتشبع الخرج عند 80% من VCC (كما في الكتاب)
import { SimKit, label, arrow, withAlpha } from './simkit.js';
import { el } from '../ui.js';

// منزلق لوغاريتمي: يوزّع 2000 خطوة على عقود القيمة بدل توزيعها الخطي على كامل المدى،
// فتصبح القيم الدقيقة (كسر أوم) قابلة للبلوغ بالسحب لا محصورة في أول جزء من عشرة آلاف من المسار.
function logSlider(kit, { label: lab, min, max, value, unit = '', fmt }) {
  const STEPS = 2000;
  const lmin = Math.log10(min), lmax = Math.log10(max);
  const toRaw = v => Math.round((Math.log10(clampLog(v)) - lmin) / (lmax - lmin) * STEPS);
  const toVal = raw => Math.pow(10, lmin + (raw / STEPS) * (lmax - lmin));
  const clampLog = v => Math.max(min, Math.min(max, v));
  const out = el('output');
  const input = el('input', { type: 'range', min: 0, max: STEPS, step: 1, value: toRaw(value) });
  const show = v => { out.textContent = (fmt ? fmt(v) : v) + (unit ? ' ' + unit : ''); };
  let val = clampLog(value);
  input.addEventListener('input', () => { val = toVal(+input.value); show(val); });
  show(val);
  kit.controls.append(el('div', { class: 'sim-row' }, el('label', {}, lab), input, out));
  return {
    get value() { return val; },
    set(v) { val = clampLog(v); input.value = toRaw(val); show(val); },
    input,
  };
}

const OPEN_GAIN = 100000; // كسب الدائرة المفتوحة A لمكبر 741 (تقريبي كما في الكتاب)

const MODES = [
  { id: 'comp', label: 'مقارن' },
  { id: 'inv', label: 'عاكس' },
  { id: 'sum', label: 'جامع' },
  { id: 'diff', label: 'تفاضلي' },
  { id: 'vf', label: 'تابع' },
  { id: 'inst', label: 'مكبر أجهزة' },
];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmtR = ohm => ohm >= 1000 ? `${(ohm / 1000).toFixed(ohm % 1000 ? 1 : 0)} kΩ` : `${ohm.toFixed(ohm < 10 ? 3 : 0)} Ω`;

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.72 });
  const read = kit.readout();

  let mode = 'inv';
  let pulse = 0;
  let lastKey = '';
  const done = new Set();
  const parts = []; // جسيمات احتفالية — سقف صارم دون 40

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id);
    pulse = 1;
    ctx.completeMission(id);
    const n = Math.min(10, 40 - parts.length);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      parts.push({ x: kit.W * 0.72, y: kit.H * 0.42, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, life: 1 });
    }
  };

  // ===== أزرار التشكيلة =====
  const modeBtns = kit.buttons(MODES.map(m => ({
    label: m.label,
    onclick: () => { mode = m.id; syncVisibility(); },
  })));
  const paintModes = () => modeBtns.forEach((b, i) => { b.className = `btn sm ${MODES[i].id === mode ? '' : 'secondary'}`; });

  // ===== المنزلقات =====
  const vccSl = kit.slider({ label: 'جهد التغذية V_CC±', min: 4, max: 16, step: 0.5, value: 8, unit: 'V', fmt: v => v.toFixed(1) });
  const rinSl = kit.slider({ label: 'R_in', min: 100, max: 1000000, step: 100, value: 50000, unit: '', fmt: v => fmtR(v) });
  const rfSl = kit.slider({ label: 'R_F', min: 1000, max: 1000000, step: 1000, value: 5000, unit: '', fmt: v => fmtR(v) });
  const rSl = kit.slider({ label: 'R₁=R₂=R₃', min: 500, max: 5000, step: 10, value: 1500, unit: '', fmt: v => fmtR(v) });
  // منزلق لوغاريتمي: القيمتان المطلوبتان (2.002 Ω و8.016 Ω) كانتا تقعان في أول 1/10000 من مسار خطي فتستحيل إصابتهما بالسحب
  const reSl = logSlider(kit, { label: 'R_e', min: 1, max: 10000, value: 500, unit: '', fmt: v => fmtR(v) });
  const vinMvSl = kit.slider({ label: 'دخل الحساس V_in', min: 0, max: 50, step: 0.5, value: 0, unit: 'mV', fmt: v => v.toFixed(1) });
  const vdiffSl = kit.slider({ label: 'فرق الدخل ΔV', min: 0, max: 1, step: 0.001, value: 0, unit: 'mV', fmt: v => v.toFixed(3) });
  const v1Sl = kit.slider({ label: 'V₁ (−)', min: 0, max: 5, step: 0.05, value: 0, unit: 'V', fmt: v => v.toFixed(2) });
  const v2Sl = kit.slider({ label: 'V₂ (+)', min: 0, max: 5, step: 0.05, value: 0, unit: 'V', fmt: v => v.toFixed(2) });

  // صفوف كل منزلق — لإخفاء غير المتعلق منها بالتشكيلة الحالية
  const rows = {
    rin: rinSl.input.parentElement, rf: rfSl.input.parentElement, r: rSl.input.parentElement,
    re: reSl.input.parentElement, vinMv: vinMvSl.input.parentElement, vdiff: vdiffSl.input.parentElement,
    v1: v1Sl.input.parentElement, v2: v2Sl.input.parentElement,
  };
  const VIS = {
    comp: ['vdiff'], inv: ['rin', 'rf', 'vinMv'], sum: ['rin', 'rf', 'v1', 'v2'],
    diff: ['rin', 'rf', 'v1', 'v2'], vf: ['v1'], inst: ['r', 're', 'v1', 'v2'],
  };
  function syncVisibility() {
    for (const k in rows) rows[k].style.display = VIS[mode].includes(k) ? '' : 'none';
    paintModes();
  }
  syncVisibility();

  // زر أمثلة الكتاب: يعبّئ القيم المعطاة في مثال الكتاب (R_in و V_in) ويترك R_F للمتدرب ليحسبه
  // ويضبطه بنفسه بلوغًا للنسبة R_F/R_in = 100 المطلوبة في m1 (R_F=20kΩ سابقًا كانت نسبتها 20 لا 100)
  kit.buttons([{
    label: 'مثال حساس الحرارة 📖', cls: 'ghost',
    onclick: () => { mode = 'inv'; syncVisibility(); rinSl.set(1000); vinMvSl.set(50); },
  }]);

  // ===== الفيزياء =====
  function compute() {
    const vcc = vccSl.value, rin = rinSl.value, rf = rfSl.value, r = rSl.value, re = reSl.value;
    const vinMv = vinMvSl.value, vdiffMv = vdiffSl.value, v1 = v1Sl.value, v2 = v2Sl.value;
    let raw = 0, ratio = null, note = '';
    if (mode === 'comp') { raw = OPEN_GAIN * (vdiffMv / 1000); note = 'مقارن: خرج A(V₂−V₁) بلا مقاومات ردّ'; }
    else if (mode === 'inv') { ratio = rf / rin; raw = -ratio * (vinMv / 1000); note = 'عاكس: V_out = −(R_F/R_in)·V_in'; }
    else if (mode === 'sum') { ratio = rf / rin; raw = -ratio * (v1 + v2); note = 'جامع عاكس: V_out = −(R_F/R_in)·(V₁+V₂)'; }
    else if (mode === 'diff') { ratio = rf / rin; raw = ratio * (v2 - v1); note = 'تفاضلي: V_out = (R_F/R_in)·(V₂−V₁)'; }
    else if (mode === 'vf') { raw = v1; note = 'تابع جهد: V_out = V_in (مقاومة دخل عالية جدًا)'; }
    else { ratio = (2 * r + re) / re; raw = ratio * (v2 - v1); note = 'مكبر أجهزة: G=[(2R+R_e)/R_e]'; }
    const satV = 0.8 * vcc;
    const out = clamp(raw, -satV, satV);
    const saturated = Math.abs(raw) > satV + 1e-9;
    return { vcc, rin, rf, r, re, vinMv, vdiffMv, v1, v2, raw, ratio, out, satV, saturated, note };
  }

  // ===== الرسم =====
  const hist = [];
  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H;
    const p = compute();

    // ===== تحقّق المهام =====
    if (mode === 'inv' && p.vinMv >= 5 && p.ratio != null && Math.abs(p.ratio - 100) / 100 <= 0.02) complete('m1');
    if (mode === 'inst') {
      const gain = p.ratio;
      if (Math.abs(p.r - 1000) / 1000 <= 0.01 && Math.abs(gain - 1000) / 1000 <= 0.01) complete('m2');
      if (Math.abs(p.r - 2000) / 2000 <= 0.02 && Math.abs(gain - 500) / 500 <= 0.01) complete('m3');
    }
    if (mode === 'comp' && Math.abs(p.vcc - 15) / 15 <= 0.02 && p.vdiffMv >= 0.12 * 0.98) complete('m4');
    if (mode !== 'comp' && Math.abs(p.raw) >= 0.8 * p.vcc * 1.02 && Math.abs(p.out - p.satV * Math.sign(p.raw || 1)) / p.satV <= 0.02) complete('m5');

    // خلفية اللوحة
    c.fillStyle = withAlpha(kit.pal.text, .02);
    c.fillRect(0, 0, W, H);

    // ===== رمز المكبر (مثلث) =====
    const cx = W * 0.42, cy = H * 0.4, half = Math.min(W, H) * 0.16;
    const glow = pulse > 0;
    c.strokeStyle = glow ? withAlpha(kit.pal.ok, 0.5 + 0.5 * pulse) : withAlpha(kit.pal.text, .6);
    c.lineWidth = glow ? 2.6 : 1.8;
    c.fillStyle = withAlpha(kit.pal.text, .05);
    c.beginPath();
    c.moveTo(cx - half, cy - half); c.lineTo(cx - half, cy + half); c.lineTo(cx + half, cy); c.closePath();
    c.fill(); c.stroke();
    label(c, '−', cx - half + 10, cy - half * 0.45, { size: 15, color: kit.pal.text, align: 'left' });
    label(c, '+', cx - half + 10, cy + half * 0.45, { size: 15, color: kit.pal.text, align: 'left' });
    label(c, '741', cx - half * 0.15, cy, { size: 11, color: kit.pal.text2, align: 'center' });

    // خطوط الدخل/الخرج
    arrow(c, cx - half - 46, cy - half * 0.45, cx - half - 4, cy - half * 0.45, { color: kit.pal.water });
    arrow(c, cx - half - 46, cy + half * 0.45, cx - half - 4, cy + half * 0.45, { color: kit.pal.badge });
    arrow(c, cx + half, cy, cx + half + 46, cy, { color: kit.pal.amber });
    label(c, mode === 'vf' || mode === 'comp' ? 'V₂' : (mode === 'inv' ? 'V_in' : 'V₂ (+)'), cx - half - 50, cy + half * 0.45, { size: 11.5, color: kit.pal.badge, align: 'right' });
    if (mode !== 'vf' && mode !== 'inv') label(c, 'V₁ (−)', cx - half - 50, cy - half * 0.45, { size: 11.5, color: kit.pal.water, align: 'right' });
    label(c, `V_out = ${p.out.toFixed(2)} V`, cx + half + 52, cy, { size: 12.5, color: kit.pal.amber, align: 'left', weight: 800 });

    // ردّ الفعل (رسم رمزي لمسار المقاومة) لغير المقارن/التابع
    if (mode !== 'comp' && mode !== 'vf') {
      c.strokeStyle = withAlpha(kit.pal.text2, .6); c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(cx - half - 4, cy - half * 0.45);
      c.lineTo(cx - half - 4, cy - half - 30);
      c.lineTo(cx + half + 20, cy - half - 30);
      c.lineTo(cx + half + 20, cy);
      c.stroke();
      const rlabel = mode === 'inst' ? `R_e=${fmtR(p.re)}` : `R_F=${fmtR(p.rf)}`;
      label(c, rlabel, (cx - half + cx + half) / 2, cy - half - 40, { size: 11.5, color: kit.pal.text2, align: 'center' });
    }

    // مؤشر التشبع
    if (p.saturated) {
      label(c, `⚡ تشبع عند ${(0.8 * p.vcc).toFixed(2)} V (80% من V_CC)`, W / 2, cy + half + 26, { size: 12.5, color: kit.pal.bad, align: 'center', weight: 800 });
    } else if (p.ratio != null) {
      label(c, `الكسب الفعلي ≈ ${p.ratio.toFixed(2)}`, W / 2, cy + half + 26, { size: 12, color: kit.pal.text2, align: 'center' });
    }

    // ===== راسم الإشارة (سجل الخرج) =====
    const scY0 = H - 70, scY1 = H - 14, scX0 = 16, scX1 = W - 16;
    c.strokeStyle = withAlpha(kit.pal.text, .18); c.lineWidth = 1;
    c.strokeRect(scX0, scY0, scX1 - scX0, scY1 - scY0);
    c.beginPath();
    c.moveTo(scX0, (scY0 + scY1) / 2); c.lineTo(scX1, (scY0 + scY1) / 2);
    c.strokeStyle = withAlpha(kit.pal.text2, .3); c.stroke();

    hist.push(p.out / Math.max(p.vcc, 0.01));
    if (hist.length > 160) hist.shift();
    c.beginPath();
    hist.forEach((v, i) => {
      const x = scX0 + (i / 159) * (scX1 - scX0);
      const y = (scY0 + scY1) / 2 - v * (scY1 - scY0) * 0.48;
      i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    });
    c.strokeStyle = p.saturated ? kit.pal.bad : kit.pal.ok;
    c.lineWidth = 2; c.stroke();
    label(c, 'راسم الخرج V_out/V_CC', scX0 + 4, scY0 - 10, { size: 10.5, color: kit.pal.text2, align: 'left' });

    // جسيمات احتفالية
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i];
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 40 * dt; q.life -= dt * 1.1;
      if (q.life <= 0) { parts.splice(i, 1); continue; }
      c.fillStyle = withAlpha(kit.pal.ok, Math.max(0, q.life));
      c.beginPath(); c.arc(q.x, q.y, 3, 0, Math.PI * 2); c.fill();
    }
    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.2);

    // ===== القراءات الحية =====
    const key = `${mode}|${p.vcc}|${p.rin}|${p.rf}|${p.r}|${p.re}|${p.vinMv}|${p.vdiffMv}|${p.v1}|${p.v2}`;
    if (key !== lastKey) {
      lastKey = key;
      const items = [
        { label: 'التشكيلة', value: MODES.find(m => m.id === mode).label, color: kit.pal.badge },
        { label: 'V_out', value: `${p.out.toFixed(3)} V`, color: kit.pal.amber },
      ];
      if (p.ratio != null) items.push({ label: 'الكسب', value: p.ratio.toFixed(3), color: kit.pal.water });
      items.push({ label: 'الحالة', value: p.saturated ? 'تشبّع' : 'خطي', color: p.saturated ? kit.pal.bad : kit.pal.ok });
      read.set(items);
    }
  });

  return { destroy() { kit.destroy(); } };
}
