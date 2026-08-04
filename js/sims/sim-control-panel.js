// لوحة التحكم الصناعية — تمسك ذاتي (VPU 5.1) وعكس اتجاه بقفل تبادلي (VPU 5.3)
// ونجمة-دلتا (VPU 5.4) واختيار الكونتاكتور بقاعدة I ≥ 1.25·I_load وحقن عطل 95-96.
// دائرة التحكم سلسلة عناصر: F1 ← S1 (إيقاف NC) ← أوفرلود 95-96 ← الفروع (S2/S3 مع
// تلامس التمسك 13-14) ← الملفات. جهد أي نقطة = جهد التحكم قبل أول عنصر مفتوح، وصفر بعده —
// وهذا بالضبط أسلوب تحديد موقع العطل بالفولتميتر.
// كل الألوان من kit.pal (تدعم الوضعين فاتح/داكن) — لا hex صلب في هذا الملف.
import { SimKit, label, arrow, withAlpha } from './simkit.js';

const RATINGS = [9, 12, 18, 25, 32, 40];  // مقننات كونتاكتورات شائعة (A)
const UCS = [24, 48, 110];                // جهود التحكم القياسية (V)
const TICK = 50;                          // ms — مؤقت المنطق مستقل عن حلقة الرسم
const HOLD_MS = 600;                      // مكث إثبات التمسك بعد رفع اليد عن S2

// أوضاع الدائرة: أعمدة القوى وصفوف التحكم لكل مخطط
const MODES = {
  dol: { title: 'VPU 5.1 — تشغيل باتجاه واحد بتمسك ذاتي', power: ['K1'] },
  rev: { title: 'VPU 5.3 — عكس الاتجاه بقفل تبادلي', power: ['K1', 'K2'] },
  sd:  { title: 'VPU 5.4 — بدء نجمة-دلتا', power: ['K7', 'K9', 'K8'] },
};

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.86 });
  const read = kit.readout();

  // ───────── الحالة (القيم الافتراضية خارج شروط كل المهام) ─────────
  let mode = 'dol';
  let uc = 48;                 // م5 تتطلب 24 V
  let rating = 9;              // م4 تتطلب 25 A عند حمل 20 A
  let selfHold = false;        // وصلة التمسك 13-14 (م1)
  let interlock = false;       // القفل التبادلي (م2)
  let fault = false;           // فتح في تلامس 95-96 (م5)
  let k1 = false, k2 = false, k7 = false, k8 = false, k9 = false;
  let shortAlarm = false;      // قصر بين طورين عند فشل القفل التبادلي
  let tStart = 0, measured = 0, starEnd = 0;
  const press = { S1: false, S2: false, S3: false };
  const pendingUp = { S1: false, S2: false, S3: false };  // إفلات مؤجَّل: يضمن أن يرى المنطق الضغطة ولو كانت خاطفة
  const probes = new Map();    // معرف النقطة ⟵ آخر قراءة فولت
  const blocked = new Set();   // اتجاهات أثبت القفل التبادلي منعها
  const done = new Set();
  const hit = [];              // مناطق النقر (تُبنى كل إطار داخل [0..W]×[0..H])
  let relStamp = 0, prevS2 = false, pulse = 0, flow = 0, rot = 0, lastKey = '';
  let note = '';

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id); pulse = 1; ctx.completeMission(id);
  };

  // ───────── التحكمات ─────────
  const setMode = m => { mode = m; resetCoils(); probes.clear(); blocked.clear(); paint(); };
  const modeBtns = kit.buttons([
    { label: 'تمسك ذاتي 5.1', onclick: () => setMode('dol') },
    { label: 'عكس اتجاه 5.3', onclick: () => setMode('rev') },
    { label: 'نجمة-دلتا 5.4', onclick: () => setMode('sd') },
  ]);
  const ucBtns = kit.buttons(UCS.map(u => ({
    label: `تحكم ${u} V`, onclick: () => { uc = u; probes.clear(); paint(); },
  })));
  const ratBtns = kit.buttons(RATINGS.map(r => ({
    label: `${r} A`, onclick: () => { rating = r; paint(); checkSizing(); },
  })));
  const tglBtns = kit.buttons([
    { label: 'وصلة التمسك 13-14', onclick: () => { selfHold = !selfHold; paint(); } },
    { label: 'قفل تبادلي', onclick: () => { interlock = !interlock; blocked.clear(); shortAlarm = false; paint(); } },
    { label: 'حقن عطل 95-96', onclick: () => { fault = !fault; probes.clear(); paint(); } },
    { label: 'إعادة ضبط ♻️', cls: 'ghost', onclick: () => { resetCoils(); shortAlarm = false; probes.clear(); } },
  ]);
  const loadSl = kit.slider({
    label: 'تيار الحمل', min: 5, max: 30, step: 1, value: 12, unit: 'A', oninput: checkSizing,
  });
  const tSl = kit.slider({
    label: 'زمن التحويل نجمة-دلتا', min: 1, max: 10, step: 0.5, value: 5, unit: 's', fmt: v => v.toFixed(1),
  });

  function paint() {
    const keys = Object.keys(MODES);
    modeBtns.forEach((b, i) => { b.className = `btn sm ${keys[i] === mode ? '' : 'secondary'}`; });
    ucBtns.forEach((b, i) => { b.className = `btn sm ${UCS[i] === uc ? '' : 'secondary'}`; });
    ratBtns.forEach((b, i) => { b.className = `btn sm ${RATINGS[i] === rating ? '' : 'secondary'}`; });
    tglBtns[0].className = `btn sm ${selfHold ? '' : 'secondary'}`;
    tglBtns[1].className = `btn sm ${interlock ? '' : 'secondary'}`;
    tglBtns[2].className = `btn sm ${fault ? '' : 'secondary'}`;
  }
  paint();

  function resetCoils() {
    k1 = k2 = k7 = k8 = k9 = false;
    tStart = 0; measured = 0; starEnd = 0; relStamp = 0;
    shortAlarm = false;
  }

  // م4: كونتاكتور لحمل 20 A ⟵ I ≥ 1.25 × 20 = 25 A (أصغر مقنن يفي هو 25 A)
  function checkSizing() {
    if (loadSl.value === 20 && rating >= 25) complete('m4');
  }

  // ───────── منطق الدائرة (مؤقت مستقل عن حلقة الرسم) ─────────
  function step() {
    const now = performance.now();
    const supply = !press.S1 && !fault;          // سلامة المسار: F1 ← S1 ← 95-96
    const p1 = k1, p2 = k2, p7 = k7;
    note = '';
    if (mode === 'dol') {
      k2 = k7 = k8 = k9 = false;
      k1 = supply && (press.S2 || (selfHold && p1));
    } else if (mode === 'rev') {
      k7 = k8 = k9 = false;
      const a = supply && (press.S2 || p1);      // التمسك الذاتي مضمّن في مخطط 5.3
      const b = supply && (press.S3 || p2);
      if (a && b) {
        if (interlock) {
          k1 = p1; k2 = p2 && !p1;               // الممسك يبقى والآخر يُمنع ميكانيكيًا
          if (!p1 && !p2) { k1 = false; k2 = false; }
          note = 'القفل التبادلي منع جذب الملفين معًا ✅';
          if (press.S3 && k1 && !k2) blocked.add('fwd');
          if (press.S2 && k2 && !k1) blocked.add('rev');
        } else { k1 = true; k2 = true; shortAlarm = true; }
      } else { k1 = a; k2 = b; }
    } else {
      k1 = k2 = false;
      const run = supply && (press.S2 || p7);    // K7 يمسك نفسه بتلامس 13-14
      k7 = run;
      if (!run) { k9 = false; k8 = false; tStart = 0; starEnd = 0; }
      else if (!tStart) { tStart = now; k9 = true; k8 = false; }
      else if (!starEnd && now - tStart >= tSl.value * 1000) { k9 = false; starEnd = now; }
      else if (starEnd && !k8) { k8 = true; measured = (now - tStart) / 1000; }
    }
    if (shortAlarm) note = 'إنذار: قصر بين طورين — الملفان مجذوبان معًا ✖';
    checkMissions(now);
    // تنفيذ الإفلات المؤجَّل بعد أن رآه المنطق دورة كاملة
    for (const s of ['S1', 'S2', 'S3'])
      if (pendingUp[s]) { press[s] = false; pendingUp[s] = false; }
  }

  function checkMissions(now) {
    // م1: تمسك ذاتي — يبقى K1 مجذوبًا بعد رفع اليد عن S2 لمدة تتجاوز HOLD_MS
    if (!press.S2 && prevS2 && k1) relStamp = now;
    if (press.S2 || !k1) relStamp = 0;
    prevS2 = press.S2;
    if (mode === 'dol' && selfHold && k1 && !press.S2 && relStamp && now - relStamp >= HOLD_MS)
      complete('m1');

    // م2: القفل التبادلي يمنع جذب K1 وK2 معًا في الاتجاهين ولا يظهر إنذار قصر
    if (mode === 'rev' && interlock && !shortAlarm && blocked.has('fwd') && blocked.has('rev'))
      complete('m2');

    // م3: تتابع K7→K9 ثم K8 بعد زمن المؤقت بخطأ ±0.2 s
    if (mode === 'sd' && k7 && k8 && !k9 && measured > 0
      && Math.abs(measured - tSl.value) <= 0.2) complete('m3');

    // م4 تُفحص عند تغيير الحمل/المقنن، وم5 عند لمس نقطة القياس
  }
  const timer = setInterval(step, TICK);

  // ───────── جهد نقاط القياس على مسار التحكم ─────────
  // n0 بعد F1 · n1 بين S1 و95-96 (قبل العنصر) · n2 بعد 95-96 (بعد العنصر)
  const nodeV = i => {
    if (i === 0) return uc;
    if (i === 1) return press.S1 ? 0 : uc;
    return (press.S1 || fault) ? 0 : uc;
  };

  // ───────── النقر واللمس ─────────
  const release = () => {
    for (const s of ['S1', 'S2', 'S3']) if (press[s]) pendingUp[s] = true;
  };
  const down = ev => {
    const r = kit.canvas.getBoundingClientRect();
    const x = Math.min(kit.W, Math.max(0, (ev.clientX - r.left) * kit.W / r.width));
    const y = Math.min(kit.H, Math.max(0, (ev.clientY - r.top) * kit.H / r.height));
    for (const h of hit) {
      if (x < h.x || x > h.x + h.w || y < h.y || y > h.y + h.h) continue;
      if (h.kind === 'hold') { press[h.id] = true; pendingUp[h.id] = false; ev.preventDefault(); return; }
      const v = nodeV(h.i);
      probes.set(h.i, v);
      // م5: 24 V قبل تلامس 95-96 و0 V بعده أثناء العطل
      if (fault && uc === 24 && probes.get(1) === 24 && probes.get(2) === 0) complete('m5');
      return;
    }
  };
  kit.canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  kit.canvas.style.cursor = 'pointer';

  // ───────── الرسم ─────────
  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, p = kit.pal;
    const live = !press.S1 && !fault;
    const running = mode === 'sd' ? k7 : (k1 || k2);
    const dir = k2 ? -1 : 1;
    const spd = mode === 'sd' ? (k8 ? 1 : (k9 ? 0.55 : 0)) : (running ? 1 : 0);
    hit.length = 0;
    rot += dt * spd * dir * 3.4;
    flow = (flow + dt * (live ? 0.55 : 0)) % 1;
    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.4);

    const dim = withAlpha(p.text, 0.5);
    const wire = withAlpha(p.text, 0.42);
    const hot = live ? p.amber : dim;

    label(c, MODES[mode].title, W - 12, 14, { size: 12.5, color: p.badge });

    // ═════ دائرة القوى: الأطوار ← تلامسات رئيسية ← محرك ═════
    const yP = H * 0.19, xR = W - 14, xM = 46;
    c.lineWidth = 3.2; c.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      c.strokeStyle = running ? withAlpha(p.amber, 0.85) : wire;
      c.beginPath(); c.moveTo(xR, yP - 12 + i * 12); c.lineTo(xR - 16, yP - 12 + i * 12); c.stroke();
    }
    label(c, 'L1 L2 L3', xR, yP + 30, { size: 10.5, color: p.text2 });
    const names = MODES[mode].power;
    const on = { K1: k1, K2: k2, K7: k7, K8: k8, K9: k9 };
    const bw = Math.min(52, (xR - 30 - xM - 40) / names.length);
    names.forEach((n, i) => {
      const bx = xR - 34 - (i + 1) * (bw + 8);
      cell(c, p, bx, yP - 18, bw, 36, on[n], n, on[n] ? 'مغلق' : 'مفتوح');
    });
    // موصل المحرك
    c.strokeStyle = running ? p.amber : wire; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(xR - 34 - names.length * (bw + 8), yP); c.lineTo(xM + 24, yP); c.stroke();
    motor(c, p, xM, yP, 23, running, rot, dir, mode === 'sd' && k9 ? 'نجمة' : (mode === 'sd' && k8 ? 'دلتا' : ''));

    // جسيمات التيار على مسار القوى (< 40)
    if (running) {
      c.fillStyle = withAlpha(p.amber, 0.9);
      for (let i = 0; i < 10; i++) {
        const u = (i / 10 + flow) % 1;
        const px = xM + 24 + u * (xR - 58 - xM);
        c.beginPath(); c.arc(px, yP, 2.2, 0, Math.PI * 2); c.fill();
      }
    }

    // ═════ دائرة التحكم: السلسلة العلوية ═════
    const yH = H * 0.44, xN = 16, xBus = W * 0.5;
    c.strokeStyle = wire; c.lineWidth = 1.8;
    c.beginPath(); c.moveTo(xR, yH); c.lineTo(xBus, yH); c.stroke();
    label(c, `L+ ${uc}V`, xR, yH - 18, { size: 11, color: p.text2 });
    label(c, 'N', xN, yH - 18, { size: 11, color: p.text2, align: 'left' });

    const chain = [
      { tag: 'F1', closed: true, id: 'F' },
      { tag: 'S1 إيقاف', closed: !press.S1, id: 'S1', hold: true },
      { tag: '95-96', closed: !fault, id: 'OL' },
    ];
    const stepX = (xR - 14 - xBus) / 3, cw = Math.max(28, stepX - 8);
    chain.forEach((e, i) => {
      const ex = xR - 14 - (i + 1) * stepX;
      contact(c, p, ex, yH, cw, e.closed, e.tag, e.closed ? (live ? p.amber : dim) : p.bad);
      if (e.hold) hit.push({ kind: 'hold', id: 'S1', x: ex, y: yH - 15, w: cw, h: 30 });
      // نقطة قياس بعد كل عنصر (في الفجوة بينه وبين سابقه)
      const nx = Math.max(xBus, ex - (stepX - cw) / 2), v = nodeV(i);
      hit.push({ kind: 'probe', i, x: nx - 7, y: yH - 10, w: 14, h: 20 });
      c.fillStyle = probes.has(i) ? (v > 0 ? p.ok : p.bad) : withAlpha(p.text, 0.45);
      c.beginPath(); c.arc(nx, yH, probes.has(i) ? 4.5 : 3, 0, Math.PI * 2); c.fill();
      if (probes.has(i))
        label(c, `${probes.get(i)} V`, nx, yH + 16, { size: 11, color: v > 0 ? p.ok : p.bad, align: 'center' });
    });
    label(c, 'المس نقطة ⚫ لقياس الجهد · المس S1/S2/S3 للضغط والإفلات 🔎', xR, H - 7,
      { size: 10.5, color: p.text2 });

    // ═════ صفوف الملفات ═════
    const rungs = mode === 'dol'
      ? [{ btn: 'S2', tag: 'K1', on: k1, hold: selfHold, ilk: null }]
      : mode === 'rev'
        ? [{ btn: 'S2', tag: 'K1', on: k1, hold: true, ilk: 'K2', ilkOn: k2 },
           { btn: 'S3', tag: 'K2', on: k2, hold: true, ilk: 'K1', ilkOn: k1 }]
        : [{ btn: 'S2', tag: 'K7', on: k7, hold: true, ilk: null },
           { btn: null, tag: 'K9 نجمة', on: k9, ilk: 'K8', ilkOn: k8 },
           { btn: null, tag: 'K8 دلتا', on: k8, ilk: 'K9', ilkOn: k9 }];
    const gap = Math.min(34, (H - 46 - yH) / (rungs.length + 0.3));
    c.strokeStyle = wire; c.lineWidth = 1.8;
    c.beginPath(); c.moveTo(xBus, yH); c.lineTo(xBus, yH + gap * rungs.length); c.stroke();
    c.beginPath(); c.moveTo(xN, yH); c.lineTo(xN, yH + gap * rungs.length); c.stroke();

    rungs.forEach((r, i) => {
      const y = yH + gap * (i + 1);
      c.strokeStyle = wire; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(xBus, y); c.lineTo(xN, y); c.stroke();
      let x = xBus - 12;
      if (r.btn) {
        const bw2 = 42;
        const pressed = press[r.btn];
        contact(c, p, x - bw2, y, bw2, pressed, `${r.btn} تشغيل`, pressed && live ? p.amber : dim);
        hit.push({ kind: 'hold', id: r.btn, x: x - bw2, y: y - 15, w: bw2, h: 30 });
        // تلامس التمسك 13-14 موازيًا للضاغط
        if (r.hold) {
          c.strokeStyle = r.on && live ? p.ok : withAlpha(p.text, 0.35);
          c.lineWidth = 1.6;
          c.beginPath();
          c.moveTo(x, y); c.lineTo(x, y - 15); c.lineTo(x - bw2, y - 15); c.lineTo(x - bw2, y);
          c.stroke();
          label(c, '13-14', x - bw2 / 2, y - 22, { size: 9.5, color: r.on ? p.ok : p.text2, align: 'center' });
        }
        x -= bw2 + 10;
      }
      if (r.ilk) {
        const iw = 38;
        contact(c, p, x - iw, y, iw, !r.ilkOn, `${r.ilk} NC`, r.ilkOn ? p.bad : (interlock || mode === 'sd' ? p.ok : p.text2));
        x -= iw + 10;
      }
      coil(c, p, Math.max(xN + 30, x - 26), y, r.tag, r.on, r.on ? p.ok : dim);
    });

    // ═════ الرسائل والقراءات ═════
    const need = loadSl.value * 1.25;
    const sizeOk = rating >= need;
    const msg = shortAlarm ? note
      : fault ? 'عطل: تلامس 95-96 مفتوح — لا جهد بعده'
      : note || (mode === 'dol' && !selfHold ? 'وصّل تلامس التمسك 13-14 ثم اضغط S2 وارفع يدك'
      : mode === 'rev' && !interlock ? 'حذار: بلا قفل تبادلي يؤدي ضغط S2 وS3 معًا إلى قصر'
      : mode === 'sd' && k9 ? `مرحلة النجمة… المؤقت ${((performance.now() - tStart) / 1000).toFixed(1)} s`
      : mode === 'sd' && k8 ? `تمّ التحويل إلى دلتا بعد ${measured.toFixed(2)} s` : '');
    if (msg) label(c, msg, W / 2, yH - 20, {
      size: 12, align: 'center',
      color: shortAlarm || fault ? p.bad : (pulse > 0 ? p.ok : p.text2),
    });

    const key = `${mode}|${k1}${k2}${k7}${k8}${k9}|${uc}|${rating}|${loadSl.value}|${measured.toFixed(2)}|${shortAlarm}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'جهد التحكم', value: `${uc} V`, color: p.water },
        { label: 'الحمل / المطلوب', value: `${loadSl.value} A ⟵ ≥ ${need.toFixed(1)} A`, color: p.amber },
        { label: 'الكونتاكتور', value: `${rating} A ${sizeOk ? '✓' : '✖'}`, color: sizeOk ? p.ok : p.bad },
        { label: 'المحرك', value: running ? (dir > 0 ? 'يمين ⟳' : 'يسار ⟲') : 'متوقف', color: running ? p.ok : p.text2 },
        { label: 'زمن التحويل المقاس', value: measured ? `${measured.toFixed(2)} s` : '—', color: p.badge },
      ]);
    }
  });

  return {
    destroy() {
      clearInterval(timer);
      kit.canvas.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      kit.destroy();
    },
  };
}

// ───────────────────── رموز الرسم ─────────────────────
// صندوق تلامس رئيسي في دائرة القوى
function cell(c, p, x, y, w, h, on, tag, sub) {
  c.save();
  c.strokeStyle = on ? p.ok : withAlpha(p.text, 0.5);
  c.fillStyle = withAlpha(on ? p.ok : p.text, on ? 0.14 : 0.05);
  c.lineWidth = on ? 2.2 : 1.4;
  c.beginPath(); c.roundRect(x, y, w, h, 6); c.fill(); c.stroke();
  c.restore();
  label(c, tag, x + w / 2, y + h / 2 - 6, { size: 12, color: on ? p.ok : p.text2, align: 'center', weight: 800 });
  label(c, sub, x + w / 2, y + h / 2 + 9, { size: 9.5, color: p.text2, align: 'center', weight: 600 });
}

// تلامس/ضاغط على خط أفقي: مغلق ⟵ جسر مستقيم، مفتوح ⟵ ريشة مائلة
function contact(c, p, x, y, w, closed, tag, color) {
  c.save();
  c.strokeStyle = color; c.lineWidth = 2.2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w - 5, y); c.stroke();
  c.beginPath(); c.moveTo(x, y); c.lineTo(x + 5, y); c.stroke();
  c.beginPath();
  c.moveTo(x + w - 5, y);
  if (closed) c.lineTo(x + 5, y); else c.lineTo(x + 5, y - 9);
  c.stroke();
  c.fillStyle = color;
  c.beginPath(); c.arc(x + 5, y, 2.4, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(x + w - 5, y, 2.4, 0, Math.PI * 2); c.fill();
  c.restore();
  label(c, tag, x + w / 2, y + 15, { size: 10.5, color, align: 'center' });
}

// ملف كونتاكتور: مستطيل بطرفين A1/A2
function coil(c, p, x, y, tag, on, color) {
  const w = 30, h = 20;
  c.save();
  c.strokeStyle = color; c.lineWidth = on ? 2.4 : 1.5;
  c.fillStyle = withAlpha(on ? p.ok : p.text, on ? 0.18 : 0.05);
  c.beginPath(); c.rect(x - w / 2, y - h / 2, w, h); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2 + 8, y); c.stroke();
  c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2 - 8, y); c.stroke();
  c.restore();
  label(c, tag, x, y + 20, { size: 10.5, color, align: 'center', weight: 800 });
}

// المحرك: دائرة M 3~ بعلامة دوران واتجاه
function motor(c, p, x, y, r, running, rot, dir, stage) {
  c.save();
  c.strokeStyle = running ? p.ok : withAlpha(p.text, 0.5);
  c.lineWidth = running ? 2.4 : 1.6;
  c.fillStyle = withAlpha(running ? p.ok : p.text, running ? 0.12 : 0.04);
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
  if (running) {
    c.strokeStyle = p.amber; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(rot) * (r - 6), y + Math.sin(rot) * (r - 6)); c.stroke();
  }
  c.restore();
  label(c, 'M 3~', x, y - 8, { size: 11, color: running ? p.ok : p.text2, align: 'center', weight: 800 });
  if (running) arrow(c, x - 12, y + r + 12, x + 12 * dir, y + r + 12, { color: p.amber, width: 2 });
  if (stage) label(c, stage, x, y + r + 26, { size: 10.5, color: p.badge, align: 'center' });
}
