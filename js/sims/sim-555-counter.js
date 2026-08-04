// مختبر المؤقت 555 والعداد 0-9: وضعا Astable/Monostable + عداد ثنائي يُقدَّح يدويًا
// ملاحظة للعقد: كل الألوان من kit.pal (تدعم الوضعين) — لا hex صلب هنا.
import { SimKit, label, arrow, withAlpha } from './simkit.js';

// ===== الفيزياء (كما في الحقيبة، بلا اشتقاق) =====
// RA, RB بالكيلو أوم — C بالميكروفاراد — النتائج بالثواني والهرتز
function astable(RA, RB, C) {
  const R_A = RA * 1000, R_B = RB * 1000, Cf = C * 1e-6;
  const T1 = 0.693 * (R_A + R_B) * Cf; // زمن الفتح (خرج عالٍ)
  const T2 = 0.693 * R_B * Cf;         // زمن الغلق (خرج منخفض)
  const f = 1.44 / ((R_A + 2 * R_B) * Cf);
  return { T1, T2, f, duty: T1 / (T1 + T2) };
}
function monostable(R, C) {
  return 1.1 * (R * 1000) * (C * 1e-6);
}

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.78 });
  const read = kit.readout();

  let mode = 'astable';        // 'astable' | 'mono'
  let pulse = 0;                // وهج احتفالي عند إنجاز مهمة
  let monoTimer = 0;            // عد تنازلي مرئي للنبضة وحيدة الاستقرار
  let monoDur = 0;
  let phase = 0;                 // زاوية دورة الموجة المستمرة للعرض
  let pulseCount = 0;            // عدّاد النبضات (مقياس 0-15) — يتقدّم يدويًا وتلقائيًا من خرج المؤقت
  let sawSix = false, sawThirteen = false;
  let prevHigh = false;          // لاشتقاق حواف خرج المؤقت (منخفض⟵عالٍ) في الوضع غير المستقر
  let edgesAt1Hz = 0;            // عدد نبضات فعلية شوهدت أثناء بقاء f ضمن هدف 1 Hz
  let lastKey = '';
  const done = new Set();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id);
    pulse = 1;
    ctx.completeMission(id);
  };

  // ===== أزرار الوضع =====
  const modeBtns = kit.buttons([
    { label: 'غير مستقر Astable', onclick: () => { mode = 'astable'; paintMode(); } },
    { label: 'مستقر Monostable', onclick: () => { mode = 'mono'; paintMode(); } },
  ]);
  const paintMode = () => {
    modeBtns[0].className = `btn sm ${mode === 'astable' ? '' : 'secondary'}`;
    modeBtns[1].className = `btn sm ${mode === 'mono' ? '' : 'secondary'}`;
    // R_B لا أثر لها في الوضع وحيد الاستقرار (المؤقّت يعتمد R_A وC فقط) — تُخفى لإزالة اللبس
    if (rbSl.input.parentElement) rbSl.input.parentElement.style.display = mode === 'mono' ? 'none' : '';
  };

  // ===== منزلقات المقاومات والمكثف والتغذية =====
  const raSl = kit.slider({ label: 'R_A (المستقر: R)', min: 1, max: 100, step: 0.05, value: 20, unit: 'kΩ', fmt: v => v.toFixed(2) });
  const rbSl = kit.slider({ label: 'R_B', min: 1, max: 100, step: 0.05, value: 20, unit: 'kΩ', fmt: v => v.toFixed(2) });
  paintMode();
  const cSl = kit.slider({ label: 'C', min: 0.01, max: 100, step: 0.01, value: 10, unit: 'µF', fmt: v => v.toFixed(2) });
  const vSl = kit.slider({ label: 'V_CC', min: 5, max: 18, step: 1, value: 9, unit: 'V' });

  // ===== أزرار أمثلة الحقيبة =====
  kit.buttons([
    { label: 'مثال 555 غير مستقر 📖', cls: 'ghost', onclick: () => { mode = 'astable'; paintMode(); raSl.set(9.6); rbSl.set(9.6); cSl.set(1); } },
    { label: 'مثال 555 مستقر 📖', cls: 'ghost', onclick: () => { mode = 'mono'; paintMode(); raSl.set(82.65); cSl.set(33); } },
  ]);

  // ===== زر النبضة الخارجية: يقدح المستقر ويقدّم العداد =====
  kit.buttons([{
    label: 'نبضة قدح خارجية ⏭',
    onclick: () => {
      if (mode === 'mono') {
        monoDur = monostable(raSl.value, cSl.value);
        monoTimer = monoDur;
      }
      pulseCount = (pulseCount + 1) % 16;
      if (pulseCount === 6) sawSix = true;
      if (pulseCount === 13) sawThirteen = true;
      if (sawSix && sawThirteen) complete('m5');
    },
  }]);
  kit.buttons([{
    label: 'تصفير العداد ↺', cls: 'secondary',
    onclick: () => { pulseCount = 0; sawSix = false; sawThirteen = false; edgesAt1Hz = 0; },
  }]);

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H;
    const RA = raSl.value, RB = rbSl.value, C = cSl.value, VCC = vSl.value;
    const pal = kit.pal;

    // ===== حساب الأزمنة حسب الوضع =====
    let T1, T2, f, duty;
    if (mode === 'astable') {
      ({ T1, T2, f, duty } = astable(RA, RB, C));
    } else {
      T1 = monostable(RA, C);
      T2 = 0; f = 0; duty = 1;
    }

    // ===== تحقّق المهام =====
    if (mode === 'astable') {
      // م1: إعادة مثال الحقيبة f=50 وT1=2T2 عند C=1µF ⟵ RA=RB=9.6kΩ
      if (Math.abs(C - 1) <= 0.05 && Math.abs(RA - 9.6) <= 9.6 * 0.05 && Math.abs(RB - 9.6) <= 9.6 * 0.05)
        complete('m1');
      // م3: تمرين 14 — f=10 وفتح = 3×غلق ⟵ RA=2RB
      if (Math.abs(f - 10) <= 10 * 0.05 && Math.abs(T1 / T2 - 3) <= 3 * 0.05 && Math.abs(RA - 2 * RB) <= 2 * RB * 0.05)
        complete('m3');
      // م4: اضبط 1Hz بالضبط ±2% وراقب العدّاد فعليًا يتقدّم عدة نبضات بهذا المعدّل
      if (Math.abs(f - 1) <= 1 * 0.02 && edgesAt1Hz >= 3) complete('m4');
    } else {
      // م2: إعادة المثال وحيد الاستقرار — نبضة 3s عند C=33µF ⟵ R=82.65kΩ
      if (Math.abs(C - 33) <= 33 * 0.05 && Math.abs(RA - 82.65) <= 82.65 * 0.05) complete('m2');
    }

    // ===== أنيميشن الموجة =====
    if (mode === 'astable' && (T1 + T2) > 0) phase = (phase + dt) % (T1 + T2);
    const outHigh = mode === 'astable' ? phase < T1 : monoTimer > 0;
    if (monoTimer > 0) monoTimer = Math.max(0, monoTimer - dt);

    // ===== العدّاد يتقدّم فعليًا من حواف خرج المؤقت (لا فقط بالزر اليدوي) =====
    if (mode === 'astable') {
      const inTargetHz = Math.abs(f - 1) <= 1 * 0.02;
      if (!inTargetHz) edgesAt1Hz = 0;
      if (outHigh && !prevHigh) {
        pulseCount = (pulseCount + 1) % 16;
        if (pulseCount === 6) sawSix = true;
        if (pulseCount === 13) sawThirteen = true;
        if (sawSix && sawThirteen) complete('m5');
        if (inTargetHz) edgesAt1Hz++;
      }
      prevHigh = outHigh;
    } else {
      prevHigh = false;
    }

    // ===== تخطيط اللوحة =====
    const chipX = W * 0.06, chipY = H * 0.14, chipW = W * 0.24, chipH = H * 0.34;
    drawChip(c, pal, chipX, chipY, chipW, chipH, outHigh, VCC);

    const waveX0 = chipX + chipW + 26, waveX1 = W - 14, waveY0 = H * 0.16, waveH = 60;
    drawWave(c, pal, waveX0, waveX1, waveY0, waveH, mode, T1, T2, phase, monoTimer, monoDur);

    const ctrY = H * 0.58, ctrH = H * 0.36;
    drawCounter(c, pal, 14, ctrY, W - 28, ctrH, pulseCount, sawSix, sawThirteen);

    // شارة إنجاز
    if (pulse > 0) {
      label(c, '✓ إنجاز!', W / 2, 14, { size: 13, color: pal.ok, align: 'center', weight: 800 });
      pulse = Math.max(0, pulse - dt * 1.2);
    }

    // ===== القراءات الحية =====
    const key = `${mode}|${RA}|${RB}|${C}|${VCC}|${pulseCount}`;
    if (key !== lastKey) {
      lastKey = key;
      const rows = mode === 'astable'
        ? [
            { label: 'T1 (فتح)', value: `${(T1 * 1000).toFixed(1)} ms`, color: pal.amber },
            { label: 'T2 (غلق)', value: `${(T2 * 1000).toFixed(1)} ms`, color: pal.water },
            { label: 'f', value: `${f.toFixed(2)} Hz`, color: pal.ok },
            { label: 'دورة العمل', value: `${(duty * 100).toFixed(1)}%`, color: pal.badge },
          ]
        : [{ label: 'T (النبضة)', value: `${T1.toFixed(2)} s`, color: pal.amber }];
      rows.push({ label: 'العداد', value: `${pulseCount} (${sawSix ? '6✓ ' : ''}${sawThirteen ? '13✓' : ''}${!sawSix && !sawThirteen ? '…' : ''})`, color: pal.text2 });
      read.set(rows);
    }
  });

  return { destroy() { kit.destroy(); } };
}

// ===== رسم شريحة 555 مبسّطة بأطرافها =====
function drawChip(c, pal, x, y, w, h, outHigh, VCC) {
  c.save();
  c.fillStyle = withAlpha(pal.text, 0.06);
  c.strokeStyle = outHigh ? withAlpha(pal.ok, 0.85) : withAlpha(pal.text, 0.5);
  c.lineWidth = outHigh ? 2.4 : 1.4;
  roundRect(c, x, y, w, h, 8);
  c.fill(); c.stroke();
  label(c, 'NE555', x + w / 2, y + h / 2, { size: 13, color: pal.text, align: 'center', weight: 800 });

  // أطراف يسار/يمين (تسميات فقط، بلا وصلات كهربائية دقيقة)
  const leftPins = ['1 أرضي', '2 قدح', '3 خرج', '4 ريست'];
  const rightPins = ['8 تغذية', '7 تفريغ', '6 عتبة', '5 تحكم'];
  leftPins.forEach((t, i) => {
    const py = y + h * (i + 0.5) / leftPins.length;
    c.strokeStyle = withAlpha(pal.text, 0.4); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x - 16, py); c.lineTo(x, py); c.stroke();
    label(c, t, x - 18, py, { size: 9.5, color: pal.text2, align: 'left' });
  });
  rightPins.forEach((t, i) => {
    const py = y + h * (i + 0.5) / rightPins.length;
    c.strokeStyle = withAlpha(pal.text, 0.4); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x + w, py); c.lineTo(x + w + 16, py); c.stroke();
    label(c, t, x + w + 18, py, { size: 9.5, color: pal.text2, align: 'left' });
  });

  // مؤشر حالة الخرج (طرف 3)
  c.fillStyle = outHigh ? pal.ok : withAlpha(pal.text, 0.3);
  c.beginPath(); c.arc(x + w + 32, y + h * 2.5 / 4, 5, 0, Math.PI * 2); c.fill();
  label(c, `V_CC=${VCC}V`, x + w / 2, y + h + 16, { size: 10.5, color: pal.text2, align: 'center' });
  c.restore();
}

// ===== موجة الخرج: مربّعة للمستقر، نبضة واحدة للمستقر =====
function drawWave(c, pal, x0, x1, y0, h, mode, T1, T2, phase, monoTimer, monoDur) {
  c.save();
  c.strokeStyle = withAlpha(pal.text, 0.25);
  c.lineWidth = 1;
  c.beginPath(); c.moveTo(x0, y0 + h); c.lineTo(x1, y0 + h); c.stroke();
  const width = x1 - x0;

  c.strokeStyle = pal.ok; c.lineWidth = 2.2; c.lineJoin = 'round';
  c.beginPath();
  if (mode === 'astable' && (T1 + T2) > 0) {
    const period = T1 + T2;
    const cyclesShown = 3.2;
    const span = period * cyclesShown;
    const t0 = phase - span; // نافذة زمنية خلف نقطة الطور الحالية
    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const tt = t0 + (px / width) * span;
      const local = ((tt % period) + period) % period;
      const yv = local < T1 ? y0 : y0 + h;
      if (!started) { c.moveTo(x0 + px, yv); started = true; }
      else c.lineTo(x0 + px, yv);
    }
    label(c, 'الخرج (طرف 3)', x0, y0 - 10, { size: 11, color: pal.text2, align: 'right' });
  } else {
    const durShow = monoDur > 0 ? monoDur : 1;
    const wPulse = monoTimer > 0 ? (monoTimer / durShow) * width * 0.5 : 0;
    c.moveTo(x0, y0 + h);
    c.lineTo(x0 + width * 0.15, y0 + h);
    c.lineTo(x0 + width * 0.15, y0);
    c.lineTo(x0 + width * 0.15 + Math.max(wPulse, 2), y0);
    c.lineTo(x0 + width * 0.15 + Math.max(wPulse, 2), y0 + h);
    c.lineTo(x1, y0 + h);
    label(c, 'نبضة وحيدة (طرف 3)', x0, y0 - 10, { size: 11, color: pal.text2, align: 'right' });
    if (monoTimer > 0) label(c, `${monoTimer.toFixed(2)} s`, x0 + width * 0.15 + 6, y0 - 10, { size: 10.5, color: pal.amber, align: 'right' });
  }
  c.stroke();
  label(c, 'عالٍ', x1 + 4, y0, { size: 9.5, color: pal.text2, align: 'right' });
  label(c, 'منخفض', x1 + 4, y0 + h, { size: 9.5, color: pal.text2, align: 'right' });
  c.restore();
}

// ===== العداد الثنائي (4 بتات) + مبين رقمي عشري =====
function drawCounter(c, pal, x, y, w, h, count, sawSix, sawThirteen) {
  c.save();
  c.strokeStyle = withAlpha(pal.text, 0.3); c.lineWidth = 1;
  roundRect(c, x, y, w, h, 8); c.stroke();
  label(c, 'العدّاد الثنائي رباعي المقاطع (0-15)', x + w - 12, y + 16, { size: 11.5, color: pal.text2, align: 'right' });

  // بتات D C B A من الأعلى للأدنى قيمة (يسار → يمين)
  const bits = [3, 2, 1, 0];
  const cellW = Math.min(70, (w - 24) / 4);
  const startX = x + w / 2 + (cellW * bits.length) / 2;
  bits.forEach((b, i) => {
    const bit = (count >> b) & 1;
    const cx = startX - i * cellW - cellW / 2;
    const cy = y + h * 0.5;
    c.fillStyle = bit ? pal.ok : withAlpha(pal.text, 0.12);
    c.beginPath(); c.arc(cx, cy, 16, 0, Math.PI * 2); c.fill();
    c.strokeStyle = withAlpha(pal.text, 0.4); c.lineWidth = 1.2; c.stroke();
    label(c, bit ? '1' : '0', cx, cy, { size: 13, color: bit ? pal.bg : pal.text2, align: 'center', weight: 800 });
    label(c, ['A', 'B', 'C', 'D'][b], cx, cy + 26, { size: 10, color: pal.text2, align: 'center' });
  });

  // المبين الرقمي (عرض العدد العشري كاملًا داخل صندوق)
  const boxW = 64, boxH = 44;
  const bx = x + w - 24 - boxW, by = y + h * 0.5 - boxH / 2;
  c.fillStyle = withAlpha(pal.text, 0.08);
  c.strokeStyle = withAlpha(pal.text, 0.35); c.lineWidth = 1.2;
  roundRect(c, bx, by, boxW, boxH, 6); c.fill(); c.stroke();
  label(c, String(count), bx + boxW / 2, by + boxH / 2, { size: 24, color: pal.amber, align: 'center', weight: 800 });
  label(c, 'مبين العدد', bx + boxW / 2, by + boxH + 12, { size: 9.5, color: pal.text2, align: 'center' });

  const status = `نبضة6: ${sawSix ? '0110 ✓' : '…'}   نبضة13: ${sawThirteen ? '1101 ✓' : '…'}`;
  label(c, status, x + w - 12, y + h - 10, { size: 10.5, color: sawSix && sawThirteen ? pal.ok : pal.text2, align: 'right' });
  c.restore();
}

// مستطيل بزوايا مدورة (مسار فقط — الاستدعاء يقرر fill/stroke)
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
