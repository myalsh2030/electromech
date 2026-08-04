// مقعد المحرك الحثي ثلاثي الأوجه — Ns = 120f/P، الانزلاق، منحنى العزم–السرعة، والريليه الحرارية
// كل الألوان من kit.pal (تدعم الوضعين فاتح/داكن) — لا hex صلب في هذا الملف.
// نموذج العزم: معادلة كلوس المبسطة T(s) = 2·Tm / (s/sm + sm/s) — عزم الانهيار ثابت مع
// مقاومة العضو الدوار الخارجية، وانزلاقه وحده هو الذي ينزاح (نقطة تعليمية مقصودة).
import { SimKit, label, arrow, withAlpha } from './simkit.js';

const V_RATED = 400;    // جهد الخط المقنن V
const F_RATED = 60;     // التردد المقنن Hz
const TM_PU = 2.5;      // عزم الانهيار عند الظروف المقننة (pu من عزم الحمل الكامل)
const SM0 = 0.12;       // انزلاق عزم الانهيار بلا مقاومة خارجية
const I0 = 0.35;        // تيار اللاحمل (pu)
const T_FR = 0.02;      // عزم الاحتكاك والفقد الميكانيكي (pu)
const VA = 6720;        // 28 A × 240 V من بطاقة محرك الحقيبة ⟵ I_N = VA / V
const TRIP_SET = 1.25;  // ضبط الريليه الحرارية = 1.25 × I_N (عامل زيادة الحمل SF)
const TRIP_HEAT = 3;    // عتبة الحرارة المتراكمة للفصل (زمن عكسي)
const DWELL_MS = 400;   // زمن ثبات الشرط قبل اعتماد المهمة
const MISSION_MS = 120; // مؤقت فحص المهام — مستقل تمامًا عن حلقة الرسم وعن رؤية الـcanvas

// ───────────────────── النموذج الفيزيائي ─────────────────────
function physics(f, P, V, loadPct, rext) {
  const Ns = 120 * f / P;                                   // السرعة التزامنية rpm
  const kflux = Math.min(1.4, Math.max(0.2, (V / V_RATED) / (f / F_RATED))); // نسبة V/f
  const Tm = TM_PU * kflux * kflux;                         // عزم الانهيار ∝ V²
  const sm = SM0 * (1 + rext / 6);                          // انزلاق الانهيار ∝ مقاومة الدوار
  const T = loadPct / 100 + T_FR;                           // عزم الحمل الكلي pu
  const Tst = 2 * Tm / (1 / sm + sm);                       // عزم بدء الحركة عند s = 1
  let s, stalled = false;
  if (T > Tm) { stalled = true; s = 1; }
  else { const k = 2 * Tm / T; s = sm * (k - Math.sqrt(k * k - 4)) / 2; }
  const N = stalled ? 0 : Ns * (1 - s);                      // السرعة الفعلية rpm
  const Ipu = stalled
    ? Math.min(7, 6 * kflux)
    : Math.min(7, Math.sqrt(I0 * I0 + Math.pow(T / kflux, 2) * (1 - I0 * I0)));
  const IN = VA / V_RATED;                                   // التيار المقنن A — ثابت عند شروط اللوحة
  return { Ns, N, s, sm, Tm, T, Tst, Ipu, IN, IA: Ipu * IN, kflux, stalled, Tdev: stalled ? Tst : T };
}

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.74 });
  const read = kit.readout();

  // ───────── الحالة ─────────
  let poles = 2;              // القيم الافتراضية خارج شروط كل المهام
  let tripped = false;        // فصل الريليه الحرارية
  let heat = 0;               // الحرارة المتراكمة
  let tripI = 0;              // تيار الفصل المسجل (pu)
  let tripIA = 0;             // تيار الفصل بالأمبير
  let angF = 0, angR = 0;     // زوايا المجال الدوار والعضو الدوار
  let pulse = 0;              // وهج عند إنجاز مهمة
  let lastKey = '';
  const done = new Set();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id);
    pulse = 1;
    ctx.completeMission(id);
  };

  // مراجع تتبّع المهام
  let m2stage = false;        // م2: مرّ على 50 Hz و6 أقطاب
  let ref4 = null;            // م3: {f, Ns} عند 4 أقطاب
  let ref60 = null;           // م4: {N, T, P, load} عند 60 Hz
  const dwellAt = Object.create(null);   // مؤقتات ثبات الشرط لكل مهمة
  const dwell = (id, cond) => {
    if (!cond) { dwellAt[id] = 0; return false; }
    const now = performance.now();
    if (!dwellAt[id]) { dwellAt[id] = now; return false; }
    return now - dwellAt[id] >= DWELL_MS;
  };

  // ───────── التحكمات ─────────
  const fSl = kit.slider({
    label: 'تردد المصدر f', min: 10, max: 60, step: 1, value: 45, unit: 'Hz',
    oninput: () => { heat = 0; },
  });

  const poleBtns = kit.buttons([2, 4, 6, 8].map(p => ({
    label: `${p} أقطاب`,
    onclick: () => { poles = p; paintPoles(); heat = 0; },
  })));
  const paintPoles = () => poleBtns.forEach((b, i) => {
    b.className = `btn sm ${[2, 4, 6, 8][i] === poles ? '' : 'secondary'}`;
  });
  paintPoles();

  const vSl = kit.slider({
    label: 'جهد الخط V_L', min: 220, max: 400, step: 10, value: 300, unit: 'V',
  });
  const loadSl = kit.slider({
    label: 'عزم الحمل', min: 0, max: 150, step: 1, value: 20, unit: '%',
  });
  const rSl = kit.slider({
    label: 'مقاومة دوار خارجية', min: 0, max: 15, step: 1, value: 0, unit: '%',
  });

  kit.buttons([
    { label: 'بطاقة الحقيبة: 60Hz · 4 أقطاب · 400V 🏷️', cls: 'ghost',
      onclick: () => { fSl.set(60); poles = 4; paintPoles(); vSl.set(400); heat = 0; } },
    { label: 'إعادة ضبط الريليه ♻️', cls: 'ghost',
      onclick: () => { tripped = false; heat = 0; } },
  ]);

  // ───────── مؤقت الحماية الحرارية (مستقل عن حلقة الرسم) ─────────
  let tLast = performance.now();
  const thermTimer = setInterval(() => {
    const now = performance.now();
    const dt = Math.min((now - tLast) / 1000, 0.5);
    tLast = now;
    if (tripped) { heat = Math.max(0, heat - dt * 0.5); return; }
    const p = physics(fSl.value, poles, vSl.value, loadSl.value, rSl.value);
    if (p.Ipu > TRIP_SET) heat += dt * (p.Ipu * p.Ipu - TRIP_SET * TRIP_SET);
    else heat = Math.max(0, heat - dt * 0.8);
    if (heat >= TRIP_HEAT) {
      tripped = true; heat = TRIP_HEAT;
      tripI = p.Ipu; tripIA = p.IA;
      pulse = 1;
      // م5: تيار الفصل يتجاوز المقنن بأكثر من 25%
      if (tripI > TRIP_SET) complete('m5');
    }
  }, 60);

  // ───────── حلقة الرسم ─────────
  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, pal = kit.pal;
    const f = fSl.value, V = vSl.value, load = loadSl.value, rext = rSl.value;
    const p = physics(f, poles, V, load, rext);
    const live = !tripped;                 // المحرك مغذّى؟
    const N = live ? p.N : 0;
    const IA = live ? p.IA : 0;
    const Ipu = live ? p.Ipu : 0;

    // زوايا الدوران (مقياس مصغّر كي تُرى بالعين)
    angF += (p.Ns / 60) * dt * 0.9;
    angR += (N / 60) * dt * 0.9;

    // ═════ لوحة منحنى العزم–السرعة (يسار) ═════
    const BAND = 52;                        // شريط السرعة السفلي
    const gx0 = 34, gx1 = Math.max(gx0 + 60, W * 0.55), gy0 = 26, gy1 = H - BAND - 26;
    const yMax = Math.max(3.0, p.Tm * 1.15, p.T * 1.2);
    const X = n => gx0 + (n / Math.max(1, p.Ns)) * (gx1 - gx0);
    const Y = tq => gy1 - (tq / yMax) * (gy1 - gy0);

    c.strokeStyle = withAlpha(kit.pal.text, .16);
    c.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yy = gy1 - (i / 4) * (gy1 - gy0);
      c.beginPath(); c.moveTo(gx0, yy); c.lineTo(gx1, yy); c.stroke();
      label(c, (yMax * i / 4).toFixed(1), gx0 - 5, yy, { size: 10, color: pal.text2 });
    }
    c.strokeStyle = withAlpha(kit.pal.text, .5);
    c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(gx0, gy0); c.lineTo(gx0, gy1); c.lineTo(gx1, gy1); c.stroke();
    label(c, 'العزم pu', gx0 + 2, gy0 - 10, { size: 11, color: pal.text2, align: 'left' });
    label(c, `السرعة rpm ⟵ ${Math.round(p.Ns)}`, gx1, gy1 + 16, { size: 11, color: pal.text2 });

    // منحنى المحرك
    c.strokeStyle = pal.water; c.lineWidth = 2.2;
    c.beginPath();
    for (let i = 0; i <= 120; i++) {
      const s = 1 - i / 120 * 0.999;
      const tq = 2 * p.Tm / (s / p.sm + p.sm / s);
      const xx = X(p.Ns * (1 - s)), yy = Y(tq);
      i ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
    }
    c.stroke();

    // خط عزم الحمل
    c.strokeStyle = pal.amber; c.lineWidth = 1.8;
    c.setLineDash([5, 4]);
    c.beginPath(); c.moveTo(gx0, Y(p.T)); c.lineTo(gx1, Y(p.T)); c.stroke();
    c.setLineDash([]);
    label(c, `حمل ${p.T.toFixed(2)}`, gx1 - 4, Y(p.T) - 9, { size: 10.5, color: pal.amber });

    // قمة عزم الانهيار
    const bx = X(p.Ns * (1 - p.sm)), by = Y(p.Tm);
    c.fillStyle = withAlpha(kit.pal.badge, .95);
    c.beginPath(); c.arc(bx, by, 3.5, 0, Math.PI * 2); c.fill();
    label(c, `Tmax ${p.Tm.toFixed(2)}`, bx - 6, by - 11, { size: 10.5, color: pal.badge });

    // نقطة التشغيل
    const opX = X(N), opY = Y(live ? p.Tdev : 0);
    c.fillStyle = live ? (p.stalled ? pal.bad : pal.ok) : pal.bad;
    c.beginPath(); c.arc(opX, opY, 5 + pulse * 3, 0, Math.PI * 2); c.fill();
    if (live && !p.stalled) {
      c.strokeStyle = withAlpha(kit.pal.ok, .55); c.lineWidth = 1;
      c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(opX, opY); c.lineTo(opX, gy1); c.stroke();
      c.setLineDash([]);
      label(c, `${Math.round(N)}`, opX, gy1 + 16, { size: 11, color: pal.ok, align: 'center' });
    }

    // ═════ لوحة المحرك (يمين) ═════
    const panelH = H - BAND;
    const cx = (gx1 + W) / 2, cy = panelH * 0.46;
    const R = Math.min((W - gx1) * 0.42, panelH * 0.3);
    // العضو الثابت
    c.strokeStyle = withAlpha(kit.pal.text, .55); c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
    // أقطاب العضو الثابت (تتغير مع عدد الأقطاب)
    for (let i = 0; i < poles; i++) {
      const a = (i / poles) * Math.PI * 2 - Math.PI / 2;
      c.strokeStyle = withAlpha(i % 2 ? kit.pal.bad : kit.pal.water, .85);
      c.lineWidth = 5;
      c.beginPath();
      c.arc(cx, cy, R * 0.9, a - Math.PI / poles * 0.45, a + Math.PI / poles * 0.45);
      c.stroke();
    }
    // العضو الدوار (قضبان القفص السنجابي)
    c.fillStyle = withAlpha(kit.pal.text, .1);
    c.beginPath(); c.arc(cx, cy, R * 0.55, 0, Math.PI * 2); c.fill();
    c.strokeStyle = withAlpha(kit.pal.text, .45); c.lineWidth = 1.4;
    c.beginPath(); c.arc(cx, cy, R * 0.55, 0, Math.PI * 2); c.stroke();
    for (let i = 0; i < 12; i++) {
      const a = angR + i * Math.PI / 6;
      c.fillStyle = withAlpha(kit.pal.amber, live && !p.stalled ? .8 : .3);
      c.beginPath();
      c.arc(cx + Math.cos(a) * R * 0.44, cy + Math.sin(a) * R * 0.44, 2.4, 0, Math.PI * 2);
      c.fill();
    }
    // سهم المجال الدوار (يدور بالسرعة التزامنية)
    if (live) {
      arrow(c, cx, cy, cx + Math.cos(angF) * R * 0.82, cy + Math.sin(angF) * R * 0.82,
        { color: pal.water2, width: 3, head: 8 });
    }
    // سهم العضو الدوار (يتخلّف بمقدار الانزلاق)
    if (live && !p.stalled) {
      arrow(c, cx, cy, cx + Math.cos(angR) * R * 0.5, cy + Math.sin(angR) * R * 0.5,
        { color: pal.ok, width: 2.5, head: 6 });
    }

    // شريط الحرارة للريليه
    const hbx = cx - R, hby = cy + R + 14, hbw = R * 2;
    c.fillStyle = withAlpha(kit.pal.text, .12);
    c.fillRect(hbx, hby, hbw, 8);
    c.fillStyle = tripped ? pal.bad : (heat > TRIP_HEAT * 0.5 ? pal.amber : pal.ok);
    c.fillRect(hbx, hby, hbw * Math.min(1, heat / TRIP_HEAT), 8);
    label(c, tripped ? '⚠️ فصل الريليه الحرارية' : 'حرارة الريليه', cx, hby + 20,
      { size: 11.5, color: tripped ? pal.bad : pal.text2, align: 'center' });

    // رسائل الحالة أعلى اللوحة
    if (tripped) {
      label(c, `الريليه فصل عند ${tripIA.toFixed(1)} A = ${(tripI * 100).toFixed(0)}% من المقنن`,
        W / 2, 13, { size: 12.5, color: pal.bad, align: 'center' });
    } else if (p.stalled) {
      label(c, 'المحرك متوقف: عزم الحمل تجاوز عزم الانهيار', W / 2, 13,
        { size: 12.5, color: pal.bad, align: 'center' });
    } else if (p.kflux > 1.15) {
      label(c, 'تحذير: V/f مرتفعة — تشبّع مغناطيسي (اخفض الجهد مع التردد)', W / 2, 13,
        { size: 12, color: pal.amber, align: 'center' });
    } else if (pulse > 0) {
      label(c, '🏆 أُنجزت مهمة!', W / 2, 13, { size: 12.5, color: pal.ok, align: 'center' });
    }
    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.2);

    // ═════ شريط السرعة: N مقابل N_s والفجوة = الانزلاق ═════
    const bx0 = 14, bx1 = W - 14, bandY = H - BAND + 12, bh = 14;
    c.fillStyle = withAlpha(kit.pal.text, .1);
    c.fillRect(bx0, bandY, bx1 - bx0, bh);
    const frac = p.Ns > 0 ? Math.max(0, Math.min(1, N / p.Ns)) : 0;
    const bw = (bx1 - bx0) * frac;
    c.fillStyle = withAlpha(kit.pal.ok, live && !p.stalled ? .85 : .3);
    c.fillRect(bx0, bandY, bw, bh);
    // فجوة الانزلاق مخطّطة بلون التنبيه
    c.fillStyle = withAlpha(kit.pal.amber, .55);
    c.fillRect(bx0 + bw, bandY, (bx1 - bx0) - bw, bh);
    c.strokeStyle = withAlpha(kit.pal.text, .45); c.lineWidth = 1.2;
    c.strokeRect(bx0, bandY, bx1 - bx0, bh);
    label(c, `N = ${Math.round(N)} rpm`, bx0 + 6, bandY + bh / 2, { size: 11, color: pal.text, align: 'left' });
    label(c, `N_s = ${Math.round(p.Ns)} rpm`, bx1 - 6, bandY + bh / 2, { size: 11, color: pal.text, align: 'right' });
    label(c,
      `الفجوة = الانزلاق s = (N_s − N) / N_s = ${live && !p.stalled ? (p.s * 100).toFixed(2) : '100.00'} %`,
      W / 2, bandY + bh + 13, { size: 11.5, color: pal.amber, align: 'center' });

    // ═════ القراءات الحية ═════
    const key = `${f}|${poles}|${V}|${load}|${rext}|${tripped}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'N_s', value: `${Math.round(p.Ns)} rpm`, color: pal.water },
        { label: 'السرعة N', value: `${Math.round(N)} rpm`, color: pal.ok },
        { label: 'الانزلاق s', value: live && !p.stalled ? `${(p.s * 100).toFixed(2)} %` : '100 %', color: pal.amber },
        { label: 'التيار I', value: `${IA.toFixed(1)} A (${(Ipu * 100).toFixed(0)}%)`, color: Ipu > TRIP_SET ? pal.bad : pal.badge },
        { label: 'المقنن I_N', value: `${p.IN.toFixed(1)} A`, color: pal.text2 },
        { label: 'العزم', value: `${(live ? p.Tdev : 0).toFixed(2)} pu`, color: pal.badge },
        { label: 'V/f نسبي', value: p.kflux.toFixed(2), color: p.kflux > 1.15 ? pal.amber : pal.text2 },
        { label: 'الكفاءة ≈', value: live && !p.stalled ? `${((1 - p.s) * 92).toFixed(1)} %` : '0 %', color: pal.ok },
      ]);
    }
  });

  // ───────── تحقق المهام (نص السجل حرفيًا) ─────────
  // مؤقت مستقل تمامًا عن حلقة الرسم (لا يتجمّد إذا خرج الـcanvas من الشاشة)
  // ويشترط ثبات الشرط DWELL_MS قبل الاعتماد كي لا تُعتمد المهام من إطار عابر أثناء السحب.
  function checkMissions(f, V, load, p, live) {
    // م1: 60 Hz و4 أقطاب ⟵ N_s = 1800، ثم حمّل حتى 1745 rpm بانزلاق 3.06% ±0.2
    if (dwell('m1', live && !p.stalled && f === 60 && poles === 4 && Math.round(p.Ns) === 1800
      && Math.abs(p.s * 100 - 3.06) <= 0.2)) complete('m1');

    // م2: 50 Hz و6 أقطاب ⟵ 1000 rpm، ثم 60 Hz ⟵ 1200 rpm ±1%
    if (poles === 6 && f === 50 && Math.abs(p.Ns - 1000) <= 10) m2stage = true;
    if (dwell('m2', m2stage && poles === 6 && f === 60 && Math.abs(p.Ns - 1200) <= 12)) complete('m2');

    // م3: مضاعفة الأقطاب من 4 إلى 8 ⟵ نسبة N_s = 0.5 ±0.02
    if (poles === 4) ref4 = { f, Ns: p.Ns };
    if (dwell('m3', poles === 8 && ref4 && ref4.f === f && ref4.Ns > 0
      && Math.abs(p.Ns / ref4.Ns - 0.5) <= 0.02)) complete('m3');

    // م4: خفض التردد إلى 30 Hz ⟵ نصف السرعة مع بقاء العزم ضمن ±10%
    if (live && !p.stalled && f === 60) ref60 = { N: p.N, T: p.Tdev, P: poles, load };
    if (dwell('m4', live && !p.stalled && f === 30 && ref60 && ref60.P === poles && ref60.load === load
      && ref60.N > 0 && Math.abs(p.N / ref60.N - 0.5) <= 0.03
      && Math.abs(p.Tdev / ref60.T - 1) <= 0.10)) complete('m4');

    // م5: تُنجز داخل مؤقت الريليه عند الفصل بتيار > 125% من المقنن
  }

  const missionTimer = setInterval(() => {
    const f = fSl.value, V = vSl.value, load = loadSl.value, rext = rSl.value;
    const p = physics(f, poles, V, load, rext);
    checkMissions(f, V, load, p, !tripped);
  }, MISSION_MS);

  return {
    destroy() {
      clearInterval(thermTimer);
      clearInterval(missionTimer);
      kit.destroy();
    },
  };
}
