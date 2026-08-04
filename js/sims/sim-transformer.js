// مقعد المحول أحادي وثلاثي الطور — V1/V2 = N1/N2، جدول (5-1)، منحنى الجهد–التيار،
// وعوامل √3 في التوصيلات النجمية والدلتا، وانهيار الخرج على التيار المستمر.
// كل الألوان من kit.pal (تدعم الوضعين فاتح/داكن) — لا hex صلب في هذا الملف.
import { SimKit, label, arrow, withAlpha } from './simkit.js';
import { DataTable } from './labkit.js';

const F = 50;              // تردد المصدر Hz
const R2W = 2.2, X2W = 0.7; // مقاومة ومفاعلة الملف الثانوي Ω
const S3 = Math.sqrt(3);

// أحمال جدول (5-1) في الحقيبة العملية — z = null يعني لا حمل
const LOADS = [
  { key: 'none',  name: 'لا حمل',      row: 'لا حمل',    z: null },
  { key: 'r10k',  name: 'R 10 kΩ',     row: 'R = 10 kΩ',  z: { r: 10000, x: 0 } },
  { key: 'r100k', name: 'R 100 kΩ',    row: 'R = 100 kΩ', z: { r: 100000, x: 0 } },
  { key: 'lind',  name: 'حثي 10 mH',   row: 'L = 10 mH',  z: { r: 0.8, x: 2 * Math.PI * F * 0.01 } },
  { key: 'ccap',  name: 'سعوي 4.7 µF', row: 'C = 4.7 µF', z: { r: 0.5, x: -1 / (2 * Math.PI * F * 4.7e-6) } },
];

const CONNS = [
  { key: 'YY', label: 'Y–Y', p: 'Y', s: 'Y' },
  { key: 'DD', label: 'Δ–Δ', p: 'D', s: 'D' },
  { key: 'YD', label: 'Y–Δ', p: 'Y', s: 'D' },
  { key: 'DY', label: 'Δ–Y', p: 'D', s: 'Y' },
];

// ───────────────────── النموذج الفيزيائي (طور واحد) ─────────────────────
function single(V1, N1, N2, z, dcMix) {
  const a = N1 / N2;                      // نسبة التحويل
  const E2 = (V1 / a) * (1 - dcMix);      // القوة الدافعة الثانوية — تنهار مع DC
  const R1 = 0.02 * N1;                   // مقاومة الملف الابتدائي Ω (تنمو مع اللفات)
  const I0 = 0.035 * (V1 / 220) * (1000 / N1); // تيار التمغنط (لا حمل)
  let Is = 0, Vs = E2, Ps = 0;
  if (z) {
    const rt = R2W + z.r, xt = X2W + z.x;
    const Zt = Math.hypot(rt, xt), Zl = Math.hypot(z.r, z.x);
    Is = E2 / Zt; Vs = Is * Zl; Ps = Is * Is * z.r;
  }
  // على DC: المفاعلة تختفي والابتدائي يرى مقاومته الأومية فقط ⟵ تيار مرتفع
  const IpAc = Math.hypot(Is / a, I0);
  const Ip = IpAc * (1 - dcMix) + (V1 / R1) * dcMix;
  const Pcore = 1.4 * (V1 / 220) ** 2 * (1000 / N1) * (1 - dcMix);
  const Pcu = Is * Is * R2W + Ip * Ip * R1;
  const Pp = Ps + Pcore + Pcu;
  return { a, E2, Vp: V1, Vs, Ip, Is, Ps, Pp, eta: Ps > 0 ? Ps / Pp : 0, I0, R1 };
}

// ───────────────────── النموذج ثلاثي الطور ─────────────────────
function three(VL, N1, N2, z, conn, dcMix) {
  const VphP = conn.p === 'Y' ? VL / S3 : VL;
  const m = single(VphP, N1, N2, z, dcMix);
  const VphS = m.Vs;
  const VLS = conn.s === 'Y' ? S3 * VphS : VphS;
  const IphS = m.Is, ILS = conn.s === 'D' ? S3 * IphS : IphS;
  const IphP = m.Ip, ILP = conn.p === 'D' ? S3 * IphP : IphP;
  return { VphP, VLP: VL, VphS, VLS, IphS, ILS, IphP, ILP, eta: m.eta, a: m.a };
}

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.68 });
  const read = kit.readout();

  // ───────── الحالة (القيم الافتراضية خارج شروط كل المهام) ─────────
  let mode = '1ph';      // م3/م4 تحتاجان '3ph'
  let source = 'AC';     // م5 تحتاج 'DC'
  let V1 = 380;          // م1 تحتاج 220
  let VL = 400;          // م3 تحتاج 11000
  let connIdx = 0;       // Y–Y: ثانويه نجمي ⟵ م4 (دلتا) غير محقّقة
  let loadIdx = 1;       // R 10 kΩ
  let dcMix = 0;         // نسبة انهيار المجال المتغير (0 على AC، 1 على DC)
  let flow = 0, pulse = 0, lastKey = '';
  const done = new Set();
  const S = {};          // لقطة الحالة المحسوبة — يقرأها مؤقت المهام المستقل

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id); pulse = 1; ctx.completeMission(id);
  };

  // ───────── التحكمات ─────────
  const modeBtns = kit.buttons([
    { label: 'أحادي الطور', onclick: () => { mode = '1ph'; paint(); } },
    { label: 'ثلاثي الطور', onclick: () => { mode = '3ph'; paint(); } },
    { label: 'مصدر AC ∿', onclick: () => { source = 'AC'; paint(); } },
    { label: 'مصدر DC ⎓', onclick: () => { source = 'DC'; paint(); } },
  ]);

  const vBtns = kit.buttons([110, 220, 380, 400].map(v => ({
    label: `${v} V`, onclick: () => { V1 = v; paint(); },
  })));
  const vlBtns = kit.buttons([220, 380, 400, 11000].map(v => ({
    label: v >= 1000 ? `${v / 1000} kV` : `${v} V`, onclick: () => { VL = v; paint(); },
  })));
  const connBtns = kit.buttons(CONNS.map((c, i) => ({
    label: c.label, onclick: () => { connIdx = i; paint(); },
  })));
  const loadBtns = kit.buttons(LOADS.map((l, i) => ({
    label: l.name, onclick: () => { loadIdx = i; paint(); },
  })));

  const n1Sl = kit.slider({ label: 'لفات الابتدائي N₁', min: 100, max: 2000, step: 10, value: 800, unit: 'لفة' });
  const n2Sl = kit.slider({ label: 'لفات الثانوي N₂', min: 10, max: 2000, step: 1, value: 400, unit: 'لفة' });

  // جدول (5-1): خمس حالات × أربع قراءات
  const table = new DataTable(kit.controls, {
    cols: [
      { key: 'vp', label: 'V_p', unit: 'V' }, { key: 'vs', label: 'V_s', unit: 'V' },
      { key: 'ip', label: 'I_p', unit: 'mA' }, { key: 'is', label: 'I_s', unit: 'mA' },
    ],
    rows: LOADS.map(l => l.row),
  });

  kit.buttons([
    { label: 'سجّل القراءة في جدول (5-1) 📋', cls: 'ghost', onclick: () => recordRow() },
    { label: 'امسح الجدول', cls: 'secondary', onclick: () => LOADS.forEach((l, r) => ['vp', 'vs', 'ip', 'is'].forEach(k => table.setCell(r, k, '—'))) },
  ]);

  function recordRow() {
    if (mode !== '1ph' || source !== 'AC') { flash = 'الجدول (5-1) يُسجَّل في وضع أحادي الطور على مصدر AC'; return; }
    const r = loadIdx;
    table.setCell(r, 'vp', S.Vp.toFixed(1), 'ok');
    table.setCell(r, 'vs', S.Vs.toFixed(1), 'ok');
    table.setCell(r, 'ip', (S.Ip * 1000).toFixed(1), 'ok');
    table.setCell(r, 'is', (S.Is * 1000).toFixed(1), 'ok');
    flash = `سُجّلت حالة «${LOADS[r].row}» — المتبقي ${LOADS.length - filledRows()} حالات`;
  }
  const filledRows = () => LOADS.filter((l, r) => table.getCell(r, 'vs') !== '').length;
  let flash = '';

  // تمييز الأزرار النشطة (ممتلئة) وإخفاء صفوف لا تخص الوضع الحالي
  const rowOf = b => b.parentElement;
  function paint() {
    const act = (b, on) => { b.className = `btn sm ${on ? '' : 'secondary'}`; };
    act(modeBtns[0], mode === '1ph'); act(modeBtns[1], mode === '3ph');
    act(modeBtns[2], source === 'AC'); act(modeBtns[3], source === 'DC');
    vBtns.forEach((b, i) => act(b, [110, 220, 380, 400][i] === V1));
    vlBtns.forEach((b, i) => act(b, [220, 380, 400, 11000][i] === VL));
    connBtns.forEach((b, i) => act(b, i === connIdx));
    loadBtns.forEach((b, i) => act(b, i === loadIdx));
    rowOf(vBtns[0]).style.display = mode === '1ph' ? '' : 'none';
    rowOf(vlBtns[0]).style.display = mode === '3ph' ? '' : 'none';
    rowOf(connBtns[0]).style.display = mode === '3ph' ? '' : 'none';
  }
  paint();

  // ───────── جسيمات تدفق الفيض في القلب (< 40) ─────────
  const FLUX = Array.from({ length: 18 }, (_, i) => i / 18);

  // ───────── مؤقت المهام المستقل عن حلقة الرسم ─────────
  const stamps = {};
  const dwell = (id, cond, ms) => {
    if (!cond) { stamps[id] = 0; return false; }
    const now = performance.now();
    if (!stamps[id]) { stamps[id] = now; return false; }
    return now - stamps[id] >= ms;
  };

  const missionTimer = setInterval(() => {
    if (S.Vp === undefined) return;
    const c = CONNS[connIdx];
    // م1: N₁=1000 و V₁=220 و N₂ = 109 ± 3 ⟵ V₂ ≈ 24 V
    if (dwell('m1', mode === '1ph' && source === 'AC' && S.N1 === 1000 && V1 === 220 && Math.abs(S.N2 - 109) <= 3, 400))
      complete('m1');
    // م2: جدول (5-1) بالحالات الخمس مكتمل القراءات
    if (table.isComplete()) complete('m2');
    // م3: نجمي على 11 kV ⟵ V_ph = V_L/√3 = 6350 V بخطأ ≤ 1%
    if (mode === '3ph' && c.p === 'Y' && VL === 11000) {
      const err = Math.abs(S.VphP - VL / S3) / (VL / S3);
      if (dwell('m3', err <= 0.01 && Math.abs(S.VphP - 6350) / 6350 <= 0.01, 700)) complete('m3');
    } else stamps.m3 = 0;
    // م4: دلتا على الثانوي ⟵ I_L = √3 · I_ph بخطأ ≤ 2%
    if (mode === '3ph' && c.s === 'D' && S.IphS > 1e-6) {
      const err = Math.abs(S.ILS / S.IphS - S3) / S3;
      if (dwell('m4', err <= 0.02, 700)) complete('m4');
    } else stamps.m4 = 0;
    // م5: على DC ينهار جهد الثانوي ويرتفع تيار الابتدائي
    if (dwell('m5', source === 'DC' && S.Vs < 0.5 && S.Ip > 5 * S.I0, 300)) complete('m5');
  }, 120);

  // ───────── حلقة الرسم ─────────
  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, P = kit.pal;
    const N1 = n1Sl.value, N2 = n2Sl.value, L = LOADS[loadIdx];
    const target = source === 'DC' ? 1 : 0;
    dcMix += (target - dcMix) * Math.min(1, dt * 3.5);
    if (dcMix < 0.002) dcMix = 0;
    if (dcMix > 0.995) dcMix = 1;   // انهيار تام: لا فيض متغيّر ⟵ E₂ = 0 بالضبط

    const m1p = single(mode === '3ph' ? (CONNS[connIdx].p === 'Y' ? VL / S3 : VL) : V1, N1, N2, L.z, dcMix);
    const t3 = mode === '3ph' ? three(VL, N1, N2, L.z, CONNS[connIdx], dcMix) : null;
    const ref = single(mode === '3ph' ? VL : V1, N1, N2, L.z, 0);

    Object.assign(S, {
      N1, N2, Vp: m1p.Vp, Vs: m1p.Vs, Ip: m1p.Ip, Is: m1p.Is, eta: m1p.eta,
      I0: Math.max(ref.I0, 1e-5),
      VphP: t3 ? t3.VphP : m1p.Vp, VLS: t3 ? t3.VLS : m1p.Vs,
      IphS: t3 ? t3.IphS : m1p.Is, ILS: t3 ? t3.ILS : m1p.Is,
      IphP: t3 ? t3.IphP : m1p.Ip, ILP: t3 ? t3.ILP : m1p.Ip,
    });

    flow += dt * (dcMix > 0.5 ? 0.15 : 0.9 + Math.min(1.6, m1p.Is * 3));

    // ═══ لوحة الرسم: المحول يمينًا والمنحنى يسارًا (RTL) ═══
    const gx = 14, gw = Math.max(120, W * 0.36), gy = 34, gh = H - 74;
    const Vsrc = mode === '3ph' ? (CONNS[connIdx].p === 'Y' ? VL / S3 : VL) : V1;
    drawCurve(c, P, gx, gy, gw, gh, Vsrc, N1, N2, m1p, dcMix);

    const bx = gx + gw + 18, bw = W - bx - 14, cy = H * 0.46;
    drawCore(c, P, bx, bw, cy, N1, N2, flow, dcMix, m1p, FLUX, t);

    // ═══ العناوين والقراءات على اللوحة ═══
    const head = mode === '1ph'
      ? `محول أحادي الطور — نسبة التحويل a = N₁/N₂ = ${m1p.a.toFixed(2)}`
      : `محول ثلاثي الطور ${CONNS[connIdx].label} — a = ${m1p.a.toFixed(2)} لكل طور`;
    label(c, head, W - 14, 16, { size: 13, color: pulse > 0 ? P.ok : P.text, align: 'right', weight: 800 });

    if (mode === '3ph' && t3) {
      const y0 = H - 44;
      const l1 = CONNS[connIdx].p === 'Y'
        ? `الابتدائي نجمي: V_ph = V_L/√3 = ${t3.VphP.toFixed(0)} V ، I_L = I_ph = ${(t3.ILP * 1000).toFixed(1)} mA`
        : `الابتدائي دلتا: V_ph = V_L = ${t3.VphP.toFixed(0)} V ، I_L = √3·I_ph = ${(t3.ILP * 1000).toFixed(1)} mA`;
      const l2 = CONNS[connIdx].s === 'D'
        ? `الثانوي دلتا: V_L = V_ph = ${t3.VLS.toFixed(1)} V ، I_L = √3·I_ph = ${(t3.ILS * 1000).toFixed(1)} mA`
        : `الثانوي نجمي: V_L = √3·V_ph = ${t3.VLS.toFixed(1)} V ، I_L = I_ph = ${(t3.ILS * 1000).toFixed(1)} mA`;
      label(c, l1, W - 14, y0, { size: 11.5, color: P.water, align: 'right' });
      label(c, l2, W - 14, y0 + 16, { size: 11.5, color: P.amber, align: 'right' });
    } else if (dcMix > 0.05) {
      label(c, `المصدر مستمر: لا فيض متغيّر ⟵ لا جهد مستحث. V₂ = ${m1p.Vs.toFixed(2)} V`,
        W - 14, H - 44, { size: 12, color: P.bad, align: 'right', weight: 800 });
      label(c, `تيار الابتدائي = V₁/R₁ = ${V1}/${m1p.R1.toFixed(0)} Ω = ${m1p.Ip.toFixed(2)} A — خطر احتراق!`,
        W - 14, H - 27, { size: 11.5, color: P.bad, align: 'right' });
    } else {
      label(c, `الحمل: ${L.name} — الكفاءة η = ${(m1p.eta * 100).toFixed(1)}٪`,
        W - 14, H - 44, { size: 12, color: P.ok, align: 'right' });
      if (flash) label(c, flash, W - 14, H - 27, { size: 11.5, color: P.badge, align: 'right' });
    }
    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.2);

    // ═══ شريط القراءات ═══
    const key = `${mode}${source}${V1}${VL}${connIdx}${loadIdx}${N1}|${N2}|${dcMix > 0.01 ? dcMix.toFixed(2) : 0}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set(mode === '1ph' ? [
        { label: 'V_p', value: `${m1p.Vp.toFixed(1)} V`, color: P.water },
        { label: 'V_s', value: `${m1p.Vs.toFixed(2)} V`, color: dcMix > 0.5 ? P.bad : P.amber },
        { label: 'I_p', value: `${(m1p.Ip * 1000).toFixed(1)} mA`, color: dcMix > 0.5 ? P.bad : P.water2 },
        { label: 'I_s', value: `${(m1p.Is * 1000).toFixed(1)} mA`, color: P.ok },
        { label: 'η', value: `${(m1p.eta * 100).toFixed(1)}٪`, color: P.badge },
      ] : [
        { label: 'V_L ابتدائي', value: `${t3.VLP.toFixed(0)} V`, color: P.water },
        { label: 'V_ph ابتدائي', value: `${t3.VphP.toFixed(1)} V`, color: P.water2 },
        { label: 'V_L ثانوي', value: `${t3.VLS.toFixed(1)} V`, color: P.amber },
        { label: 'I_ph ثانوي', value: `${(t3.IphS * 1000).toFixed(2)} mA`, color: P.ok },
        { label: 'I_L ثانوي', value: `${(t3.ILS * 1000).toFixed(2)} mA`, color: P.badge },
      ]);
    }
  });

  return {
    destroy() {
      clearInterval(missionTimer);
      kit.destroy();
    },
  };
}

// ───────────────────── رسم القلب والملفين ─────────────────────
function drawCore(c, P, bx, bw, cy, N1, N2, flow, dcMix, m, FLUX, t) {
  const w = Math.min(bw - 20, 230), x0 = bx + (bw - w) / 2;
  const h = w * 0.72, y0 = cy - h / 2, th = Math.max(9, w * 0.075);

  // القلب المصفّح (إطار مستطيل مفرّغ)
  c.save();
  c.strokeStyle = withAlpha(P.text, 0.5); c.lineWidth = th;
  c.strokeRect(x0 + th / 2, y0 + th / 2, w - th, h - th);
  c.strokeStyle = withAlpha(P.text2, 0.35); c.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const yy = y0 + th * 0.2 + i * (th * 0.16);
    c.beginPath(); c.moveTo(x0 + th, yy); c.lineTo(x0 + w - th, yy); c.stroke();
  }
  c.restore();

  // جسيمات الفيض داخل مسار القلب
  const path = [[x0 + th / 2, y0 + th / 2], [x0 + w - th / 2, y0 + th / 2],
    [x0 + w - th / 2, y0 + h - th / 2], [x0 + th / 2, y0 + h - th / 2]];
  const per = 2 * (w - th) + 2 * (h - th);
  FLUX.forEach(f0 => {
    const u = ((f0 + flow * 0.12) % 1) * per;
    const p = along(path, u, w - th, h - th);
    c.fillStyle = withAlpha(P.badge, dcMix > 0.5 ? 0.12 : 0.85);
    c.beginPath(); c.arc(p[0], p[1], 2.4, 0, Math.PI * 2); c.fill();
  });

  // الملفان: الابتدائي على الساق اليمنى (RTL: المصدر يمين)، الثانوي على اليسرى
  coil(c, x0 + w - th / 2, y0 + th, h - 2 * th, th, P.water, Math.round(6 + N1 / 260));
  coil(c, x0 + th / 2, y0 + th, h - 2 * th, th, P.amber, Math.round(4 + N2 / 260));

  label(c, `N₁ = ${N1}`, x0 + w - th - 6, y0 + h * 0.14, { size: 11.5, color: P.water, align: 'right' });
  label(c, `N₂ = ${N2}`, x0 - 6, y0 + h * 0.14, { size: 11.5, color: P.amber, align: 'right' });
  label(c, `${m.Vp.toFixed(0)} V`, x0 + w - th - 6, y0 + h * 0.86, { size: 12, color: P.water, align: 'right', weight: 800 });
  label(c, `${m.Vs.toFixed(1)} V`, x0 - 6, y0 + h * 0.86, { size: 12, color: dcMix > 0.5 ? P.bad : P.amber, align: 'right', weight: 800 });

  // سهم اتجاه الفيض داخل النافذة
  const cxm = x0 + w / 2, cym = y0 + h / 2;
  if (dcMix < 0.5) {
    const s = Math.sin(t * 2.2);
    arrow(c, cxm - 26 * s, cym, cxm + 26 * s, cym, { color: withAlpha(P.badge, 0.9), width: 2 });
    label(c, 'Φ', cxm, cym - 16, { size: 13, color: P.badge, align: 'center' });
  } else {
    label(c, 'Φ ثابت', cxm, cym, { size: 12, color: P.bad, align: 'center', weight: 800 });
  }
}

// نقطة على محيط مستطيل بمسافة u من الزاوية العليا اليسرى
function along(path, u, ww, hh) {
  if (u < ww) return [path[0][0] + u, path[0][1]];
  u -= ww;
  if (u < hh) return [path[1][0], path[1][1] + u];
  u -= hh;
  if (u < ww) return [path[2][0] - u, path[2][1]];
  u -= ww;
  return [path[3][0], path[3][1] - u];
}

// ملف حلزوني على ساق رأسية
function coil(c, x, yTop, hh, th, color, turns) {
  const n = Math.max(5, Math.min(16, turns));
  const step = hh / n, r = th * 0.85;
  c.save();
  c.strokeStyle = color; c.lineWidth = Math.max(2, th * 0.28); c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    c.beginPath();
    c.ellipse(x, yTop + step * (i + 0.5), r, step * 0.42, 0, -Math.PI * 0.85, Math.PI * 0.85);
    c.stroke();
  }
  c.restore();
}

// ───────────────────── منحنى الجهد–التيار على الحمل ─────────────────────
function drawCurve(c, P, x, y, w, h, V1, N1, N2, m, dcMix) {
  c.save();
  c.strokeStyle = withAlpha(P.text2, 0.5); c.lineWidth = 1;
  c.strokeRect(x, y, w, h);

  const E2 = (V1 / (N1 / N2));
  // مسح مقاومة الحمل من 100 kΩ إلى 5 Ω ⟵ نقاط (I_s , V_s)
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const R = 100000 * Math.pow(5 / 100000, i / 60);
    const Zt = Math.hypot(R2W + R, X2W);
    const Is = E2 / Zt, Vs = Is * R;
    pts.push([Is, Vs]);
  }
  const iMax = Math.max(...pts.map(p => p[0])) || 1;
  const vMax = Math.max(E2, 1);
  const px = i => x + w - (i / iMax) * (w - 34) - 8;  // المحور الأفقي RTL: التيار ينمو يسارًا
  const py = v => y + h - 22 - (v / vMax) * (h - 40);

  c.beginPath();
  pts.forEach((p, i) => (i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))));
  c.strokeStyle = withAlpha(P.amber, dcMix > 0.5 ? 0.25 : 0.95); c.lineWidth = 2;
  c.stroke();

  // نقطة التشغيل الحالية
  const ox = px(Math.min(m.Is, iMax)), oy = py(Math.min(m.Vs, vMax));
  c.fillStyle = dcMix > 0.5 ? P.bad : P.ok;
  c.beginPath(); c.arc(ox, oy, 4.5, 0, Math.PI * 2); c.fill();
  c.strokeStyle = withAlpha(P.ok, 0.4);
  c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox, y + h - 22); c.stroke();

  label(c, 'V_s (V)', x + w - 6, y + 10, { size: 10.5, color: P.text2, align: 'right' });
  label(c, 'I_s ⟵', x + 6, y + h - 8, { size: 10.5, color: P.text2, align: 'left' });
  label(c, `${vMax.toFixed(0)}`, x + w - 6, y + 24, { size: 10, color: P.amber, align: 'right' });
  label(c, `شكل (5-5)`, x + w / 2, y - 8, { size: 11, color: P.text2, align: 'center' });
  c.restore();
}
