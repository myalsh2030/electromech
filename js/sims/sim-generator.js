// مولد الملف الدوّار — الدرس 3.1: E_a = (P/a)·φ·Z·(n/60) و f = p·n/120
// ملف يدور داخل مجال أقطاب: منزلقات السرعة والأقطاب وعدد الموصلات والفيض + نوع اللف،
// ويُعرض شكل الموجة عند حلقات الانزلاق (متردد) وبعد الموحّد (نابض) مع المتوسط E_a.
// كل الألوان من kit.pal (تدعم الوضعين فاتح/داكن) — لا hex صلب.
import { SimKit, label, arrow, withAlpha } from './simkit.js';

const WINDINGS = [
  { id: 'lap',  name: 'انطباقي  a = P', a: P => P },
  { id: 'wave', name: 'تموجي  a = 2',   a: () => 2 },
];

const DWELL_MS = 420;   // زمن ثبات الشرط قبل اعتماد المهمة
const CHECK_MS = 120;   // مؤقت فحص المهام — مستقل تمامًا عن حلقة الرسم

// القوة الدافعة المتولدة (فولت)
const emf = (P, Z, n, phi, a) => (P / a) * phi * Z * (n / 60);
// التردد الكهربائي (هرتز)
const freq = (P, n) => P * n / 120;

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.66 });
  const read = kit.readout();

  let wIdx = 0;              // 0 = انطباقي (الافتراضي)
  let th = 0;                // زاوية الدوّار للعرض
  let pulse = 0;             // وهج احتفالي
  let lastKey = '';
  let flashTxt = '';
  let flashAt = 0;           // طابع performance.now لرسالة التهنئة
  let lapSnap = null;        // لقطة اللف الانطباقي (للمهمة 5)
  let ratioSeen = 0;         // النسبة المرصودة بعد التبديل

  const done = new Set();
  const dwell = Object.create(null);

  const complete = (id, msg) => {
    if (done.has(id) || ctx.isMissionDone?.(id)) { done.add(id); return; }
    done.add(id);
    pulse = 1;
    flashTxt = msg;
    flashAt = performance.now();
    ctx.completeMission(id);
  };

  // ===== التحكمات =====
  const pSl = kit.slider({
    label: 'عدد الأقطاب P', min: 2, max: 8, step: 2, value: 4, unit: 'قطب',
    fmt: v => String(Math.round(v)),
  });
  const zSl = kit.slider({
    label: 'عدد الموصلات Z', min: 100, max: 1000, step: 10, value: 400, unit: 'موصل',
    fmt: v => String(Math.round(v)),
  });
  const nSl = kit.slider({
    label: 'السرعة n', min: 0, max: 3000, step: 10, value: 1500, unit: 'rpm',
    fmt: v => String(Math.round(v)),
  });
  const fSl = kit.slider({
    label: 'الفيض/قطب φ', min: 0.01, max: 0.08, step: 0.0005, value: 0.02, unit: 'Wb',
    fmt: v => (+v).toFixed(4),
  });

  const wBtns = kit.buttons(WINDINGS.map((w, i) => ({
    label: w.name,
    onclick: () => { wIdx = i; paintW(); },
  })));
  const paintW = () => wBtns.forEach((b, i) => { b.className = `btn sm ${i === wIdx ? '' : 'secondary'}`; });
  paintW();

  // أزرار تهيئة جزئية: تضبط المعطيات وتترك المجهول للمتدرب
  kit.buttons([
    {
      label: 'تهيئة مثال (2): φ مجهول', cls: 'ghost',
      onclick: () => { pSl.set(8); zSl.set(960); nSl.set(600); wIdx = 0; paintW(); },
    },
    {
      label: 'تهيئة مثال (3): n مجهولة', cls: 'ghost',
      onclick: () => { pSl.set(8); zSl.set(480); fSl.set(0.05); wIdx = 0; paintW(); },
    },
  ]);

  // ===== مؤقت فحص المهام (مستقل عن حلقة الرسم) =====
  const hold = (id, cond) => {
    if (done.has(id)) return false;
    if (!cond) { dwell[id] = 0; return false; }
    const now = performance.now();
    if (!dwell[id]) { dwell[id] = now; return false; }
    return now - dwell[id] >= DWELL_MS;
  };

  const checkTimer = setInterval(() => {
    const P = Math.round(pSl.value), Z = Math.round(zSl.value);
    const n = Math.round(nSl.value), phi = +fSl.value;
    const wid = WINDINGS[wIdx].id;
    const a = WINDINGS[wIdx].a(P);
    const E = emf(P, Z, n, phi, a);
    const f = freq(P, n);

    // م1: مثال (1) — P=6، Z=250، تموجي a=2، n=1200، φ=0.06 ⟵ E_a = 900 V ±2%
    if (hold('m1', P === 6 && Z === 250 && wid === 'wave' && n === 1200 &&
             Math.abs(phi - 0.06) < 1e-6 && Math.abs(E - 900) <= 900 * 0.02))
      complete('m1', '✓ مثال (1): E_a = 900 V');

    // م2: مثال (2) — P=8، Z=960، انطباقي، n=600، E_a=220 ⟵ φ = 0.0229 Wb ±3%
    const phiReq = 220 * 60 * 8 / (960 * 600 * 8); // = 0.0229167 Wb
    if (hold('m2', P === 8 && Z === 960 && wid === 'lap' && n === 600 &&
             Math.abs(phi - phiReq) <= phiReq * 0.03))
      complete('m2', '✓ مثال (2): φ ≈ 0.0229 Wb لجهد 220 V');

    // م3: مثال (3) — P=8، Z=480، انطباقي، φ=0.05، E_a=240 ⟵ n = 600 rpm ±2%
    if (hold('m3', P === 8 && Z === 480 && wid === 'lap' &&
             Math.abs(phi - 0.05) < 1e-6 && Math.abs(n - 600) <= 600 * 0.02))
      complete('m3', '✓ مثال (3): n = 600 rpm لجهد 240 V');

    // م4: إثبات f = p·n/120 — 6 أقطاب و1000 rpm ⟵ f = 50 Hz ±0.5
    if (hold('m4', P === 6 && n === 1000 && Math.abs(f - 50) <= 0.5))
      complete('m4', '✓ f = p·n/120 = 6×1000/120 = 50 Hz');

    // م5: تبديل انطباقي ⟵ تموجي بنفس المعطيات وارتفاع E_a بنسبة P/2
    if (wid === 'lap') {
      lapSnap = (n > 0 && E > 1) ? { P, Z, n, phi, E } : null;
      ratioSeen = 0;
      dwell.m5 = 0;
    } else if (lapSnap && lapSnap.P === P && lapSnap.Z === Z &&
               lapSnap.n === n && Math.abs(lapSnap.phi - phi) < 1e-9 && P >= 4) {
      const r = E / lapSnap.E;         // = a_lap/a_wave = P/2
      ratioSeen = r;
      if (hold('m5', Math.abs(r - P / 2) <= 0.02 * (P / 2)))
        complete('m5', `✓ التبديل رفع E_a بنسبة P/2 = ${(P / 2).toFixed(1)}×`);
    } else {
      ratioSeen = 0;
      dwell.m5 = 0;
    }
  }, CHECK_MS);

  // ===== الرسم =====
  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, p = kit.pal;
    const P = Math.round(pSl.value), Z = Math.round(zSl.value);
    const n = Math.round(nSl.value), phi = +fSl.value;
    const w = WINDINGS[wIdx], a = w.a(P);
    const E = emf(P, Z, n, phi, a);
    const f = freq(P, n);
    const peak = E * Math.PI / 2;              // قمة الموجة (متوسط |جيب| = 2/π × القمة)

    th += (n / 60) * 2 * Math.PI * 0.03 * dt;  // دوران مُبطّأ للعرض
    if (th > 1e6) th = 0;
    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.1);

    drawMachine(c, kit, W, H, P, th, phi, pulse);
    drawScope(c, kit, W, H, E, peak, f, th, w.id, P);

    // ===== الصيغة ورأس اللوحة =====
    label(c, `E_a = (P/a)·φ·Z·(n/60) = (${P}/${a})×${phi.toFixed(4)}×${Z}×(${n}/60)`,
      W - 10, 14, { size: 12, color: p.text2 });
    label(c, `f = p·n/120 = ${P}×${n}/120 = ${f.toFixed(1)} Hz`,
      W - 10, 32, { size: 12, color: p.badge });

    if (ratioSeen > 0)
      label(c, `نسبة الارتفاع بعد التبديل = ${ratioSeen.toFixed(2)}×   (P/2 = ${(P / 2).toFixed(1)})`,
        W - 10, H - 8, { size: 12, color: p.ok });
    else if (n === 0)
      label(c, 'الدوّار ساكن: لا قطع لخطوط الفيض ⟵ E_a = 0', W - 10, H - 8,
        { size: 12, color: p.bad });

    if (flashTxt && performance.now() - flashAt < 2600)
      label(c, flashTxt, W / 2, H - 26, { size: 13, color: p.ok, align: 'center', weight: 800 });

    // ===== القراءات الحية =====
    const key = `${P}|${Z}|${n}|${phi}|${wIdx}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'E_a المتولدة', value: `${E >= 1000 ? (E / 1000).toFixed(2) + ' kV' : E.toFixed(1) + ' V'}`, color: kit.pal.amber },
        { label: 'قمة الموجة', value: `${peak.toFixed(0)} V`, color: kit.pal.water },
        { label: 'التردد f', value: `${f.toFixed(1)} Hz`, color: kit.pal.badge },
        { label: 'المسارات a', value: `${a}`, color: kit.pal.ok },
      ]);
    }
  });

  return {
    destroy() {
      clearInterval(checkTimer);
      kit.destroy();
    },
  };
}

// ================= رسم الآلة (مقطع عرضي) =================
function drawMachine(c, kit, W, H, P, th, phi, pulse) {
  const p = kit.pal;
  const cx = W * 0.80, cy = H * 0.52;
  const R = Math.min(W * 0.17, (H - 70) * 0.44);
  if (R < 22) return;

  // الإطار الخارجي (العضو الثابت)
  c.save();
  c.strokeStyle = pulse > 0 ? withAlpha(p.ok, 0.4 + 0.5 * pulse) : withAlpha(p.text, 0.5);
  c.lineWidth = pulse > 0 ? 2.6 : 1.6;
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
  c.restore();

  // الأقطاب بالتناوب N/S + سهم الفيض لكل قطب (أقصى 8 أسهم)
  const step = Math.PI * 2 / P;
  const arcW = step * 0.46;
  for (let i = 0; i < P; i++) {
    const ang = i * step - Math.PI / 2;
    const north = i % 2 === 0;
    const col = north ? p.bad : p.water;
    c.save();
    c.strokeStyle = withAlpha(col, 0.55 + Math.min(0.4, phi * 5));
    c.lineWidth = Math.max(5, R * 0.13);
    c.beginPath(); c.arc(cx, cy, R * 0.9, ang - arcW / 2, ang + arcW / 2); c.stroke();
    c.restore();
    const rx = Math.cos(ang), ry = Math.sin(ang);
    if (north) arrow(c, cx + rx * R * 0.78, cy + ry * R * 0.78, cx + rx * R * 0.5, cy + ry * R * 0.5, { color: col, width: 1.8, head: 5 });
    else       arrow(c, cx + rx * R * 0.5,  cy + ry * R * 0.5,  cx + rx * R * 0.78, cy + ry * R * 0.78, { color: col, width: 1.8, head: 5 });
    if (R > 46)
      label(c, north ? 'N' : 'S', cx + rx * R * 1.06, cy + ry * R * 1.06,
        { size: 11, color: col, align: 'center', weight: 800 });
  }

  // الدوّار (المنتج)
  c.save();
  c.fillStyle = withAlpha(p.text, 0.06);
  c.beginPath(); c.arc(cx, cy, R * 0.42, 0, Math.PI * 2); c.fill();
  c.strokeStyle = withAlpha(p.text, 0.35); c.lineWidth = 1.2; c.stroke();
  c.restore();

  // ملف واحد يمثّل موصلات المنتج — يدور بزاوية th
  const ux = Math.cos(th), uy = Math.sin(th);
  c.save();
  c.strokeStyle = p.amber; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(cx - ux * R * 0.38, cy - uy * R * 0.38);
  c.lineTo(cx + ux * R * 0.38, cy + uy * R * 0.38);
  c.stroke();
  c.fillStyle = p.amber;
  c.beginPath(); c.arc(cx + ux * R * 0.38, cy + uy * R * 0.38, 3.4, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(cx - ux * R * 0.38, cy - uy * R * 0.38, 3.4, 0, Math.PI * 2); c.fill();
  c.restore();

  // الفرشتان
  c.save();
  c.fillStyle = withAlpha(p.text2, 0.8);
  c.fillRect(cx - R * 0.5, cy - 3, R * 0.1, 6);
  c.fillRect(cx + R * 0.4, cy - 3, R * 0.1, 6);
  c.restore();

  label(c, 'المنتج + الموحّد', cx, cy + R + 16, { size: 11.5, color: p.text2, align: 'center' });
  label(c, `${P} أقطاب`, cx, cy - R - 14, { size: 12, color: p.text, align: 'center', weight: 800 });
}

// ================= رسم شاشة الموجات =================
function drawScope(c, kit, W, H, E, peak, f, th, wid, P) {
  const p = kit.pal;
  const x0 = 10, x1 = Math.max(x0 + 60, W * 0.58);
  const yTop = 48, yBot = H - 44;
  const pw = x1 - x0, ph = yBot - yTop;
  if (pw < 60 || ph < 60) return;
  const mid = yTop + ph * 0.5;

  // إطار الشاشة وشبكتها
  c.save();
  c.fillStyle = withAlpha(p.text, 0.04);
  c.fillRect(x0, yTop, pw, ph);
  c.strokeStyle = withAlpha(p.line, 1); c.lineWidth = 1;
  c.strokeRect(x0 + 0.5, yTop + 0.5, pw - 1, ph - 1);
  c.strokeStyle = withAlpha(p.text, 0.09);
  for (let i = 1; i < 8; i++) {
    const gx = x0 + pw * i / 8;
    c.beginPath(); c.moveTo(gx, yTop); c.lineTo(gx, yBot); c.stroke();
  }
  for (let j = 1; j < 4; j++) {
    const gy = yTop + ph * j / 4;
    c.beginPath(); c.moveTo(x0, gy); c.lineTo(x1, gy); c.stroke();
  }
  c.restore();

  // المقياس الرأسي: القمة تشغل 40% من نصف الارتفاع الأعلى
  const full = niceMax(Math.max(peak, 1));
  const sc = (ph * 0.42) / full;
  const ph0 = -th * (P / 2);              // الزاوية الكهربائية = (P/2) × الزاوية الميكانيكية

  // خط الصفر
  c.save();
  c.strokeStyle = withAlpha(p.text, 0.3); c.lineWidth = 1;
  c.beginPath(); c.moveTo(x0, mid); c.lineTo(x1, mid); c.stroke();
  c.restore();

  const CYC = 2, N = 130;                 // دورتان كهربائيتان
  // الموجة عند حلقات الانزلاق (متردد جيبي)
  c.save();
  c.strokeStyle = withAlpha(p.water, 0.85); c.lineWidth = 2;
  c.beginPath();
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const s = Math.sin(ph0 + u * CYC * Math.PI * 2);
    const x = x0 + u * pw, y = mid - s * peak * sc;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.stroke();
  c.restore();

  // الموجة بعد الموحّد (قيمة مطلقة) — مملوءة
  c.save();
  const g = c.createLinearGradient(0, mid - full * sc, 0, mid);
  g.addColorStop(0, withAlpha(p.amber, 0.42));
  g.addColorStop(1, withAlpha(p.amber, 0.06));
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(x0, mid);
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const s = Math.abs(Math.sin(ph0 + u * CYC * Math.PI * 2));
    c.lineTo(x0 + u * pw, mid - s * peak * sc);
  }
  c.lineTo(x1, mid);
  c.closePath(); c.fill();
  c.strokeStyle = p.amber; c.lineWidth = 2;
  c.beginPath();
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const s = Math.abs(Math.sin(ph0 + u * CYC * Math.PI * 2));
    const x = x0 + u * pw, y = mid - s * peak * sc;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.stroke();
  c.restore();

  // خط المتوسط E_a
  const yAvg = mid - E * sc;
  c.save();
  c.setLineDash([6, 5]);
  c.strokeStyle = p.ok; c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(x0, yAvg); c.lineTo(x1, yAvg); c.stroke();
  c.restore();
  label(c, `E_a = ${E.toFixed(1)} V`, x1 - 6, yAvg - 10, { size: 12, color: p.ok, weight: 800 });

  // تسميات الشاشة
  label(c, 'بعد الموحّد (نابض)', x1 - 6, yTop + 14, { size: 11.5, color: p.amber });
  label(c, 'عند حلقات الانزلاق (متردد)', x1 - 6, yTop + 30, { size: 11.5, color: p.water });
  label(c, `المدى الزمني: ${f > 0 ? (CYC * 1000 / f).toFixed(1) + ' ms' : '—'}   |   القمة ${full} V`,
    x0 + 6, yBot - 12, { size: 11, color: p.text2, align: 'left' });
  label(c, wid === 'wave' ? 'لف تموجي: a = 2 (مساران فقط)' : 'لف انطباقي: a = P',
    x0 + 6, yTop + 14, { size: 11.5, color: p.badge, align: 'left' });
}

// أقرب سقف مريح للمقياس الرأسي
function niceMax(v) {
  const e = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / e;
  const s = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
  return s * e;
}
