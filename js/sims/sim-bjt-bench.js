// مقعد الترانزستور BJT بخط الحمل — درس 5.3
// نموذج تيار مستمر مبسّط كما في الكتاب: I_B=(V_BB−V_BE)/R_B و I_C=β·I_B (مقصوصًا عند التشبع)
// و V_CE=V_CC−I_C·R_C و I_E=I_B+I_C و α=β/(β+1)، مع منحنى القدرة الثابتة P_C=150 mW.
// ملاحظة العقد: كل الألوان من kit.pal (فاتح/داكن) — بلا hex صلب. لا setTimeout: كل المُهل
// والمُكوث (dwell) بطوابع performance.now تُقارَن في حلقة مستقلة عن قيم الإطار.
import { SimKit, label, arrow, withAlpha } from './simkit.js';

const VBE = 0.7;        // هبوط وصلة الباعث-القاعدة (سيليكون)
const VCESAT = 0.2;     // جهد التشبع بين المجمع والباعث
const PMAX = 0.15;      // حد القدرة عند 25°م — 150 mW
const DWELL = 600;      // مدة استقرار الإنذار قبل تسجيله (ms)

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.72 });
  const read = kit.readout();
  const done = new Set();

  // ===== الحالة =====
  let pnp = false;          // نوع الترانزستور
  let rbTouched = false;    // هل حرّك المتدرب R_B فعليًا؟ (شرط نصّ مهمة m4)
  let suppressRbTouch = false; // يمنع رفع rbTouched عند ضبط برمجي (زر المعايرة) لا لمسًا حقيقيًا
  let overSince = 0;        // طابع بدء تجاوز القدرة (performance.now)
  let alarm = false;        // إنذار التلف ظاهر
  let flash = 0;            // وهج عند إنجاز مهمة
  const toast = { t: '', c: '', until: 0 };

  const say = (t, c) => { toast.t = t; toast.c = c; toast.until = performance.now() + 2600; };

  const complete = (id, msg) => {
    if (done.has(id) || ctx.isMissionDone?.(id)) { say(msg, kit.pal.text2); return; }
    done.add(id);
    flash = 1;
    say('✓ ' + msg, kit.pal.ok);
    ctx.completeMission(id);
  };

  // ===== أزرار النوع =====
  const typeBtns = kit.buttons([
    { label: 'npn', onclick: () => { pnp = false; paintType(); } },
    { label: 'pnp', onclick: () => { pnp = true; paintType(); } },
  ]);
  const paintType = () => typeBtns.forEach((b, i) => { b.className = `btn sm ${(i === 1) === pnp ? '' : 'secondary'}`; });
  paintType();

  // ===== المنزلقات =====
  const bSl = kit.slider({
    label: 'معامل التكبير β', min: 20, max: 200, step: 1, value: 60,
    fmt: v => v.toFixed(0),
  });
  const vccSl = kit.slider({
    label: 'جهد التغذية V_CC', min: 5, max: 20, step: 0.5, value: 12, unit: 'V',
    fmt: v => v.toFixed(1),
  });
  const vbbSl = kit.slider({
    label: 'إشارة الدخل V_BB', min: 0, max: 12, step: 0.1, value: 3, unit: 'V',
    fmt: v => v.toFixed(1),
  });
  const rbSl = kit.slider({
    label: 'مقاومة القاعدة R_B', min: 10, max: 1000, step: 1, value: 220, unit: 'kΩ',
    fmt: v => v.toFixed(0),
    oninput: () => { if (!suppressRbTouch) rbTouched = true; },
  });
  const rcSl = kit.slider({
    label: 'مقاومة المجمع R_C', min: 100, max: 10000, step: 50, value: 1000,
    fmt: v => (v >= 1000 ? (v / 1000).toFixed(2) + ' kΩ' : v.toFixed(0) + ' Ω'),
  });

  // ===== الحسبة (نقطة واحدة للحقيقة: تُستدعى من الحلقة ومن أزرار التسمية) =====
  function solve() {
    const beta = bSl.value, VCC = vccSl.value, VBB = vbbSl.value;
    const RB = rbSl.value * 1000, RC = rcSl.value;
    const IB = Math.max(0, (VBB - VBE) / RB);          // A
    const Icsat = Math.max(0, (VCC - VCESAT) / RC);     // A — قصّ خط الحمل
    const sat = IB > 0 && beta * IB >= Icsat;
    const IC = sat ? Icsat : beta * IB;
    const VCE = sat ? VCESAT : VCC - IC * RC;
    const region = IC <= 1e-5 ? 'cut' : sat ? 'sat' : 'act';
    return { beta, VCC, VBB, RB, RC, IB, IC, IE: IB + IC, VCE, Icsat, region, alpha: beta / (beta + 1), P: VCE * IC };
  }

  // ===== أزرار تسمية الوظيفة (تُغلق مهمتَي القطع والتشبع نصًّا) =====
  kit.buttons([
    {
      label: 'مفتاح OFF', cls: 'secondary',
      onclick: () => {
        const s = solve();
        if (s.region === 'cut' && s.IC <= 1e-5 && Math.abs(s.VCE - s.VCC) <= 0.1)
          complete('m2', 'منطقة القطع: الوصلتان عكسيتان — الترانزستور مفتاح OFF');
        else say('التسمية غير مطابقة: لست في منطقة القطع', kit.pal.bad);
      },
    },
    {
      label: 'مكبّر (فعّالة)', cls: 'secondary',
      onclick: () => {
        const s = solve();
        say(s.region === 'act'
          ? 'صحيح: المنطقة الفعّالة — الترانزستور مكبّر'
          : 'التسمية غير مطابقة: لست في المنطقة الفعّالة', s.region === 'act' ? kit.pal.ok : kit.pal.bad);
      },
    },
    {
      label: 'مفتاح ON', cls: 'secondary',
      onclick: () => {
        const s = solve();
        if (s.region === 'sat' && s.VCE <= 0.3)
          complete('m3', 'منطقة التشبع: الوصلتان أماميتان — الترانزستور مفتاح ON');
        else say('التسمية غير مطابقة: لست في منطقة التشبع', kit.pal.bad);
      },
    },
  ]);

  // زر معايرة يهيّئ β و R_B لمهمة الكتاب ويترك V_BB للمتدرب
  kit.buttons([{
    label: 'معايرة: β=100 و R_B=100 kΩ 📖', cls: 'ghost',
    onclick: () => {
      bSl.set(100);
      suppressRbTouch = true; rbSl.set(100); suppressRbTouch = false; // ضبط برمجي — لا يُحتسب "لمسًا" لشرط m4
      say('اضبط الآن V_BB لتحصل على I_B = 50 µA', kit.pal.amber);
    },
  }]);

  // ===== جسيمات تيار المجمع (< 40) =====
  const parts = Array.from({ length: 16 }, (_, i) => ({ ph: i / 16 }));

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, P = kit.pal, now = performance.now();
    const s = solve();

    // ---- مُكوث تجاوز القدرة (مستقل عن الإطار: طوابع زمنية) ----
    if (s.P > PMAX) {
      if (!overSince) overSince = now;
      if (now - overSince >= DWELL && !alarm) {
        alarm = true;
        complete('m5', `إنذار تلف: P_C = ${(s.P * 1000).toFixed(0)} mW تجاوز 150 mW`);
      }
    } else { overSince = 0; alarm = false; }

    // ---- m1: β=100 مع I_C=5 mA ±2% و α=0.990±0.002 في المنطقة الفعّالة ----
    if (s.beta === 100 && s.region === 'act' &&
        Math.abs(s.IC - 0.005) <= 0.005 * 0.02 && Math.abs(s.alpha - 0.990) <= 0.002)
      complete('m1', 'β=100 و I_B=50 µA ⟵ I_C=5 mA و α=0.990');

    // ---- m4: توسيط نقطة التشغيل على خط الحمل بضبط R_B (±10% من الهدف V_CC/2 لا من V_CC) ----
    if (rbTouched && s.region === 'act' && Math.abs(s.VCE - s.VCC / 2) <= 0.1 * (s.VCC / 2))
      complete('m4', `نقطة التشغيل موسّطة: V_CE = ${s.VCE.toFixed(2)} V ≈ V_CC/2`);

    if (flash > 0) flash = Math.max(0, flash - dt * 1.3);

    // ===== تخطيط اللوحة: المنحنيات يسارًا والدائرة يمينًا (RTL) =====
    const gx0 = 34, gx1 = Math.max(gx0 + 60, W * 0.56);
    const gy0 = 34, gy1 = H - 42;
    drawCurves(c, gx0, gy0, gx1, gy1, s, P, flash, t);
    drawCircuit(c, Math.min(W - 8, gx1 + 16), 20, W - 8, H - 24, s, P, pnp, parts, dt, alarm, now);

    // ===== الشريط العلوي: المنطقة والوظيفة =====
    const rTxt = s.region === 'cut' ? 'القطع ⟵ مفتاح OFF'
      : s.region === 'sat' ? 'التشبع ⟵ مفتاح ON' : 'الفعّالة ⟵ مكبّر';
    const rCol = s.region === 'cut' ? P.text2 : s.region === 'sat' ? P.water2 : P.ok;
    label(c, `منطقة التشغيل: ${rTxt}`, W - 10, 12, { size: 12.5, color: rCol, align: 'right' });

    // ===== إنذار التلف =====
    if (alarm && Math.floor(t * 3) % 2 === 0)
      label(c, `⚠ تلف! P_C = ${(s.P * 1000).toFixed(0)} mW > 150 mW`, gx0 + 4, gy0 - 20, { size: 13, color: P.bad, align: 'left', weight: 800 });

    // ===== رسالة عابرة =====
    if (now < toast.until) label(c, toast.t, (gx0 + gx1) / 2, H - 12, { size: 12, color: toast.c || P.text2, align: 'center' });

    // ===== القراءات الحية =====
    const sgn = pnp ? -1 : 1;
    read.set([
      { label: 'I_B', value: `${(sgn * s.IB * 1e6).toFixed(1)} µA`, color: P.amber },
      { label: 'I_C', value: `${(sgn * s.IC * 1e3).toFixed(2)} mA`, color: P.water },
      { label: 'I_E', value: `${(sgn * s.IE * 1e3).toFixed(2)} mA`, color: P.water2 },
      { label: 'V_CE', value: `${(sgn * s.VCE).toFixed(2)} V`, color: P.ok },
      { label: 'α', value: s.alpha.toFixed(3), color: P.badge },
      { label: 'P_C', value: `${(s.P * 1000).toFixed(0)} mW`, color: s.P > PMAX ? P.bad : P.text2 },
    ]);
  });

  return { destroy() { kit.destroy(); } };
}

// ═══════════════════ عائلة منحنيات الخرج + خط الحمل + منحنى القدرة ═══════════════════
function drawCurves(c, x0, y0, x1, y1, s, P, flash, t) {
  const w = x1 - x0, h = y1 - y0;
  const Vmax = s.VCC * 1.06;
  const Imax = Math.max(s.Icsat * 1.18, 1e-4);
  const X = v => x0 + Math.max(0, Math.min(1, v / Vmax)) * w;
  const Y = i => y1 - Math.max(0, Math.min(1, i / Imax)) * h;

  // إطار وشبكة
  c.save();
  c.strokeStyle = withAlpha(P.text, 0.16); c.lineWidth = 1;
  c.strokeRect(x0, y0, w, h);
  c.strokeStyle = withAlpha(P.text, 0.07);
  for (let k = 1; k < 5; k++) {
    c.beginPath(); c.moveTo(x0 + w * k / 5, y0); c.lineTo(x0 + w * k / 5, y1); c.stroke();
    c.beginPath(); c.moveTo(x0, y0 + h * k / 5); c.lineTo(x1, y0 + h * k / 5); c.stroke();
  }
  c.restore();

  label(c, 'I_C (mA)', x0 - 6, y0 + 8, { size: 10.5, color: P.text2, align: 'right' });
  label(c, 'V_CE (V)', x1 - 4, y1 + 14, { size: 10.5, color: P.text2, align: 'right' });
  label(c, `${(Imax * 1000).toFixed(1)}`, x0 - 6, y0 + 24, { size: 10, color: P.text2, align: 'right' });
  label(c, `${s.VCC.toFixed(1)}`, X(s.VCC), y1 + 14, { size: 10, color: P.text2, align: 'center' });

  // عائلة المنحنيات: ست قيم لـ I_B تُوزّع تيار المجمع على المحور
  const step = s.Icsat / (5 * Math.max(s.beta, 1));
  c.save();
  c.lineWidth = 1.4;
  for (let k = 1; k <= 6; k++) {
    const ib = step * k;
    c.strokeStyle = withAlpha(P.text, 0.26);
    curve(c, X, Y, ib * s.beta, Vmax);
    if (k === 6) label(c, `I_B ↑`, X(Vmax * 0.9), Y(ib * s.beta) - 10, { size: 10, color: P.text2, align: 'center' });
  }
  // منحنى نقطة التشغيل الحالية بلون بارز
  if (s.IB > 0) {
    c.lineWidth = 2.2;
    c.strokeStyle = P.amber;
    curve(c, X, Y, s.beta * s.IB, Vmax);
    label(c, `I_B = ${(s.IB * 1e6).toFixed(1)} µA`, x0 + 6, Y(Math.min(s.beta * s.IB, Imax)) - 11, { size: 10.5, color: P.amber, align: 'left' });
  }
  c.restore();

  // خط الحمل: من (V_CC, 0) إلى (0, V_CC/R_C)
  c.save();
  c.strokeStyle = P.water; c.lineWidth = 2; c.setLineDash([6, 4]);
  c.beginPath(); c.moveTo(X(s.VCC), Y(0)); c.lineTo(X(0), Y(s.VCC / s.RC)); c.stroke();
  c.setLineDash([]);
  c.restore();
  label(c, 'خط الحمل', X(s.VCC * 0.62), Y(s.VCC * 0.38 / s.RC) - 12, { size: 10.5, color: P.water, align: 'center' });

  // منحنى القدرة الثابتة P_C = 150 mW
  c.save();
  c.strokeStyle = P.bad; c.lineWidth = 1.6; c.setLineDash([3, 3]);
  c.beginPath();
  let started = false;
  for (let px = 0; px <= 120; px++) {
    const v = Vmax * (px / 120);
    if (v < 0.05) continue;
    const i = PMAX / v;
    if (i > Imax) { started = false; continue; }
    const xx = X(v), yy = Y(i);
    started ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
    started = true;
  }
  c.stroke(); c.setLineDash([]);
  c.restore();
  if (PMAX / Vmax < Imax) label(c, 'حد 150 mW', X(Vmax * 0.96), Y(PMAX / (Vmax * 0.96)) - 10, { size: 10, color: P.bad, align: 'right' });

  // نقطة التشغيل Q
  const qx = X(s.VCE), qy = Y(s.IC);
  c.save();
  const over = s.P > PMAX;
  c.fillStyle = over ? P.bad : (flash > 0 ? P.ok : P.amber);
  c.strokeStyle = withAlpha(over ? P.bad : P.ok, 0.55);
  c.lineWidth = 2;
  c.beginPath(); c.arc(qx, qy, 5.4 + (flash > 0 ? 3 * flash : 0), 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(qx, qy, 11 + 6 * Math.abs(Math.sin(t * 2)), 0, Math.PI * 2); c.stroke();
  c.restore();
  label(c, `Q (${s.VCE.toFixed(2)} V، ${(s.IC * 1000).toFixed(2)} mA)`, x0 + 6, y1 - 8, { size: 11, color: over ? P.bad : P.ok, align: 'left' });
}

// منحنى خرج واحد: ركبة عند التشبع ثم شبه أفقي (ميل Early خفيف)
function curve(c, X, Y, icMax, Vmax) {
  c.beginPath();
  for (let k = 0; k <= 60; k++) {
    const v = Vmax * (k / 60);
    const i = icMax * (1 - Math.exp(-v / 0.075)) * (1 + v / 160);
    const xx = X(v), yy = Y(i);
    k ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
  }
  c.stroke();
}

// ═══════════════════ الدائرة: الترانزستور مع R_B و R_C و V_CC ═══════════════════
function drawCircuit(c, x0, y0, x1, y1, s, P, pnp, parts, dt, alarm, now) {
  const w = x1 - x0;
  if (w < 90) return;
  const cx = x0 + w * 0.58;          // محور الترانزستور الرأسي
  const railY = y0 + 16;             // قضيب V_CC
  const gndY = y1 - 14;              // الأرضي
  const bodyY = (railY + gndY) / 2;  // مركز الترانزستور
  const barX = cx - 12;              // قضيب القاعدة
  const colY = bodyY - 22, emY = bodyY + 22;

  // قضيب التغذية والأرضي
  c.save();
  c.strokeStyle = withAlpha(P.text, 0.5); c.lineWidth = 1.6; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0 + 8, railY); c.lineTo(x1 - 6, railY); c.stroke();
  c.beginPath(); c.moveTo(x0 + 8, gndY); c.lineTo(x1 - 6, gndY); c.stroke();
  c.restore();
  label(c, `V_CC = ${s.VCC.toFixed(1)} V`, x1 - 6, railY - 10, { size: 11, color: P.ok, align: 'right' });
  label(c, 'أرضي', x1 - 6, gndY + 11, { size: 10, color: P.text2, align: 'right' });

  // مقاومة المجمع R_C على الفرع الرأسي بين القضيب والمجمع
  zig(c, cx, railY, cx, colY - 14, P.water);
  label(c, `R_C ${s.RC >= 1000 ? (s.RC / 1000).toFixed(2) + 'k' : s.RC.toFixed(0)}Ω`, cx + 10, (railY + colY) / 2, { size: 10.5, color: P.water, align: 'left' });

  // مقاومة القاعدة R_B أفقيًا من مصدر الإشارة إلى القاعدة
  const bx = x0 + 10;
  zig(c, bx, bodyY, barX - 30, bodyY, P.amber, true);
  label(c, `R_B ${s.RB / 1000} kΩ`, (bx + barX) / 2, bodyY - 16, { size: 10.5, color: P.amber, align: 'center' });
  label(c, `V_BB ${s.VBB.toFixed(1)} V`, bx, bodyY + 16, { size: 10.5, color: P.amber, align: 'left' });

  // جسم الترانزستور: قضيب القاعدة + ساقا المجمع والباعث
  c.save();
  c.strokeStyle = alarm ? P.bad : P.text;
  c.lineWidth = 3;
  c.beginPath(); c.moveTo(barX, bodyY - 24); c.lineTo(barX, bodyY + 24); c.stroke();
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(barX - 30, bodyY); c.lineTo(barX, bodyY); c.stroke();
  c.beginPath(); c.moveTo(barX, bodyY - 12); c.lineTo(cx, colY - 14); c.stroke();
  c.beginPath(); c.moveTo(barX, bodyY + 12); c.lineTo(cx, emY + 14); c.stroke();
  c.beginPath(); c.moveTo(cx, emY + 14); c.lineTo(cx, gndY); c.stroke();
  // دائرة الغلاف
  c.lineWidth = 1.4; c.strokeStyle = withAlpha(alarm ? P.bad : P.text, 0.45);
  c.beginPath(); c.arc(barX + 8, bodyY, 34, 0, Math.PI * 2); c.stroke();
  c.restore();

  // سهم الباعث: للخارج في npn وللداخل في pnp
  const ex = (barX + cx) / 2, ey = (bodyY + 12 + emY + 14) / 2;
  if (pnp) arrow(c, ex, ey, barX + 4, bodyY + 15, { color: P.bad, width: 2, head: 7 });
  else arrow(c, barX + 6, bodyY + 15, ex + 6, ey + 5, { color: P.bad, width: 2, head: 7 });

  label(c, 'C', cx + 8, colY - 20, { size: 11, color: P.text2, align: 'left' });
  label(c, 'B', barX - 34, bodyY - 12, { size: 11, color: P.text2, align: 'right' });
  label(c, 'E', cx + 8, emY + 20, { size: 11, color: P.text2, align: 'left' });
  label(c, pnp ? 'pnp' : 'npn', barX + 8, bodyY - 44, { size: 12, color: P.badge, align: 'center', weight: 800 });

  // جسيمات تيار المجمع على الفرع الرأسي (سرعتها وعددها بقدر I_C)
  const ratio = s.Icsat > 0 ? Math.min(1, s.IC / s.Icsat) : 0;
  const n = Math.round(2 + 12 * ratio);
  if (ratio > 0.005) {
    const dir = pnp ? -1 : 1;
    c.save();
    c.fillStyle = alarm ? P.bad : P.water2;
    for (let i = 0; i < n; i++) {
      const p = parts[i];
      p.ph = (p.ph + dir * dt * (0.12 + 0.5 * ratio) + 1) % 1;
      const py = railY + (gndY - railY) * p.ph;
      c.beginPath(); c.arc(cx, py, 2.5, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }

  // قراءة V_CE بين المجمع والباعث
  label(c, `V_CE = ${s.VCE.toFixed(2)} V`, x1 - 6, bodyY + 34, { size: 11, color: P.ok, align: 'right' });
  label(c, `I_C = ${(s.IC * 1000).toFixed(2)} mA`, x1 - 6, bodyY + 50, { size: 11, color: P.water, align: 'right' });
  // وميض مزامن مع طابع الزمن — يبيّن أن الإنذار حيّ لا صورة ثابتة
  if (alarm && Math.floor(now / 300) % 2 === 0)
    label(c, '🔥', cx + 26, bodyY, { size: 16, color: P.bad, align: 'center' });
}

// مقاومة زجزاجية بين نقطتين (رأسية أو أفقية)
function zig(c, x1, y1, x2, y2, col, horiz = false) {
  const n = 6, amp = 7;
  c.save();
  c.strokeStyle = col; c.lineWidth = 2; c.lineCap = 'round';
  c.beginPath();
  if (horiz) {
    const len = x2 - x1, x0 = x1 + len * 0.25, seg = len * 0.5 / n;
    c.moveTo(x1, y1); c.lineTo(x0, y1);
    for (let i = 0; i < n; i++) c.lineTo(x0 + seg * (i + 0.5), y1 + (i % 2 ? amp : -amp));
    c.lineTo(x0 + seg * n, y1); c.lineTo(x2, y2);
  } else {
    const len = y2 - y1, y00 = y1 + len * 0.25, seg = len * 0.5 / n;
    c.moveTo(x1, y1); c.lineTo(x1, y00);
    for (let i = 0; i < n; i++) c.lineTo(x1 + (i % 2 ? amp : -amp), y00 + seg * (i + 0.5));
    c.lineTo(x1, y00 + seg * n); c.lineTo(x2, y2);
  }
  c.stroke();
  c.restore();
}
