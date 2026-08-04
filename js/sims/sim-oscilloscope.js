// أوسيليسكوب افتراضي بقناتين: شبكة 8×10 + مولد موجات + VOLT/DIV وTIME/DIV واقتران AC/DC/GND
// كل القياسات تُقرأ من الشاشة كما في المعمل: Vpp = الارتفاع بالمربعات × VOLT/DIV،
// T = عرض الدورة بالمربعات × TIME/DIV، و f = 1/T.
// ملاحظة العقد: كل الألوان من kit.pal (الوضعان فاتح/داكن) — بلا hex صلب هنا.
import { SimKit, label, arrow, withAlpha } from './simkit.js';
import { CalcInput } from './labkit.js';

// مفتاح VOLT/DIV: 5mV … 20V (متتالية 1-2-5 كما في الأجهزة الحقيقية)
const VOLT_DIV = [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20];
// مفتاح TIME/DIV: 0.2µs … 0.5s (متتالية 1-2-4-5 — تتضمن 4 ms اللازمة لموجة 50 Hz)
const TIME_DIV = (() => {
  const out = [];
  for (let d = -7; d <= -1; d++) for (const m of [1, 2, 4, 5]) {
    const v = +(m * Math.pow(10, d)).toPrecision(4);
    if (v >= 2e-7 && v <= 0.5) out.push(v);
  }
  return out;
})();
const WAVES = ['جيبي', 'مربع', 'مثلث'];
const COUPLING = ['AC', 'DC', 'GND'];
const TRIG = ['CH1', 'CH2', 'LINE', 'EXT'];
const F_LINE = 50;              // تردد الشبكة لمصدر تزامن LINE
const UNK_FREQ = [12.5, 25, 40, 60, 125, 250, 400, 800, 1250, 2500];

const fmtVolt = v => (v < 1 ? `${Math.round(v * 1000)} mV` : `${v} V`);
const fmtTime = v => (v < 1e-3 ? `${+(v * 1e6).toPrecision(3)} µs`
  : v < 1 ? `${+(v * 1e3).toPrecision(3)} ms` : `${v} s`);
const fmtFreq = f => (f < 1000 ? `${+f.toPrecision(4)} Hz` : `${+(f / 1000).toPrecision(4)} kHz`);
// دالة الموجة بسعة وحدة
const shape = (k, a) => (k === 0 ? Math.sin(a) : k === 1 ? (Math.sin(a) >= 0 ? 1 : -1)
  : (2 / Math.PI) * Math.asin(Math.sin(a)));

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.66 });
  const read = kit.readout();

  // ===== حالة الجهاز والمولد =====
  let wave = 0;                 // شكل الموجة
  let coupling = 1;             // 0=AC 1=DC 2=GND — الافتراضي DC (خارج شرط م5)
  let trig = 0;                 // مصدر التزامن
  let ch2On = false;
  let drift = 0;                // انزياح الطور عند فقد التزامن
  let unknown = null;           // {wave, vpp, f} عند وضع «الموجة المجهولة»
  let gndSince = 0, gndZero = false;   // dwell وضع GND بطوابع performance.now
  let okV = false, okF = false;        // نتائج إدخالَي مهمة القياس
  let flash = 0;                // وهج عند إنجاز مهمة
  let hint = '';
  const done = new Set();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id); flash = 1; ctx.completeMission(id);
  };

  // ===== المولد: مانتيسا × عقد (يبلغ 1 Hz حتى 10 kHz بخطوة 0.01) =====
  let decade = 100;             // ×100 ⟵ الافتراضي 300 Hz
  const manSl = kit.slider({
    label: 'تردد المولد (المانتيسا)', min: 1, max: 10, step: 0.01, value: 3,
    fmt: v => v.toFixed(2),
  });
  const decBtns = kit.buttons([1, 10, 100, 1000].map(d => ({
    label: d === 1000 ? '× 1 kHz' : `× ${d} Hz`, cls: 'secondary',
    onclick: () => { decade = d; paintDec(); },
  })));
  const paintDec = () => decBtns.forEach((b, i) => {
    b.className = `btn sm ${[1, 10, 100, 1000][i] === decade ? '' : 'secondary'}`;
  });
  paintDec();

  const vppSl = kit.slider({
    label: 'سعة المولد Vpp', min: 0.2, max: 20, step: 0.1, value: 5, unit: 'V',
    fmt: v => v.toFixed(1),
  });
  const offSl = kit.slider({
    label: 'إزاحة DC للمصدر', min: -8, max: 8, step: 0.1, value: 0, unit: 'V',
    fmt: v => v.toFixed(1),
  });

  // ===== مفاتيح الجهاز =====
  const vdSl = kit.slider({
    label: 'VOLT/DIV', min: 0, max: VOLT_DIV.length - 1, step: 1, value: 9,   // 5 V/div
    fmt: i => fmtVolt(VOLT_DIV[i]),
  });
  const tdSl = kit.slider({
    label: 'TIME/DIV', min: 0, max: TIME_DIV.length - 1, step: 1,
    value: TIME_DIV.findIndex(v => Math.abs(v - 1e-3) < 1e-12),               // 1 ms
    fmt: i => fmtTime(TIME_DIV[i]),
  });

  const waveBtns = kit.buttons(WAVES.map((w, i) => ({
    label: w, cls: 'secondary', onclick: () => { wave = i; paintBtns(); },
  })));
  const cplBtns = kit.buttons(COUPLING.map((c, i) => ({
    label: c === 'GND' ? 'GND ⏚' : c, cls: 'secondary',
    onclick: () => {
      coupling = i;
      gndSince = i === 2 ? performance.now() : 0;
      paintBtns();
    },
  })));
  const trigBtns = kit.buttons([...TRIG.map((s, i) => ({
    label: `تزامن ${s}`, cls: 'secondary', onclick: () => { trig = i; drift = 0; paintBtns(); },
  })), {
    label: 'CH2 تشغيل/إيقاف', cls: 'ghost', onclick: () => { ch2On = !ch2On; paintBtns(); },
  }]);

  function paintBtns() {
    waveBtns.forEach((b, i) => { b.className = `btn sm ${i === wave ? '' : 'secondary'}`; });
    cplBtns.forEach((b, i) => { b.className = `btn sm ${i === coupling ? '' : 'secondary'}`; });
    trigBtns.forEach((b, i) => {
      if (i < 4) b.className = `btn sm ${i === trig ? '' : 'secondary'}`;
      else b.className = `btn sm ${ch2On ? '' : 'ghost'}`;
    });
  }
  paintBtns();

  // ===== الموجة المجهولة + إدخالا القياس (مهمة م4) =====
  const vIn = new CalcInput(kit.controls, {
    label: 'المقاس Vpp للمجهولة', unit: 'V', ref: 1,
    onResult: (err) => { okV = err < 5; },
  });
  const fIn = new CalcInput(kit.controls, {
    label: 'المقاس f للمجهولة', unit: 'Hz', ref: 1,
    onResult: (err) => { okF = err < 5; },
  });
  const setInputs = shown => {
    vIn.root.style.display = shown ? '' : 'none';
    fIn.root.style.display = shown ? '' : 'none';
  };
  setInputs(false);

  const unkBtns = kit.buttons([
    {
      label: '🎲 موجة مجهولة', cls: 'ghost',
      onclick: () => {
        unknown = {
          wave: Math.floor(Math.random() * 3),
          vpp: +(0.4 * (1 + Math.floor(Math.random() * 40))).toFixed(1),
          f: UNK_FREQ[Math.floor(Math.random() * UNK_FREQ.length)],
        };
        okV = okF = false;
        vIn.reset(unknown.vpp); fIn.reset(unknown.f);
        setInputs(true);
        manSl.input.disabled = vppSl.input.disabled = true;
        hint = 'قِس من الشبكة: الارتفاع × VOLT/DIV و عرض الدورة × TIME/DIV';
        paintUnk();
      },
    },
    {
      label: '↩︎ عودة للمولد', cls: 'ghost',
      onclick: () => {
        unknown = null; okV = okF = false; setInputs(false);
        manSl.input.disabled = vppSl.input.disabled = false;
        hint = ''; paintUnk();
      },
    },
    {
      label: '📌 سجّل الإزاحة', cls: 'ghost',
      onclick: () => {
        // م5: خط الصفر مثبّت بـGND ثم DC مع إزاحة مرئية ≥ 1 V — يُقرأ من state() نفسه الذي يرسم الأثر
        // ويصفّر الإزاحة عند «موجة مجهولة» (بدل قراءة offSl.value مباشرة فتنجَز المهمة على إزاحة غير معروضة أصلًا)
        const s = state();
        const off = s.off, vd = s.vd;
        if (unknown) { hint = 'عد إلى المولد لضبط إزاحة DC — الإزاحة معطّلة في وضع الموجة المجهولة'; return; }
        if (!gndZero) { hint = 'ثبّت خط الصفر أولًا: اضغط GND وانتظر ثانية'; return; }
        if (coupling !== 1) { hint = 'بدّل الاقتران إلى DC لرؤية الإزاحة'; return; }
        if (Math.abs(off) < 1) { hint = 'ارفع إزاحة DC إلى 1 V فأكثر ثم سجّل'; return; }
        if (Math.abs(off) / vd > 3) { hint = 'الإزاحة خارج الشاشة — كبّر VOLT/DIV'; return; }
        hint = `الإزاحة المسجّلة = ${(off / vd).toFixed(2)} مربع = ${off.toFixed(1)} V`;
        complete('m5');
      },
    },
  ]);
  const paintUnk = () => {
    unkBtns[0].className = `btn sm ${unknown ? '' : 'ghost'}`;
  };

  // زر AUTO: يختار مفتاحَي الجهاز لعرض مريح (لا يمسّ المولد)
  kit.buttons([{
    label: '⚙️ ضبط تلقائي AUTO', cls: 'ghost',
    onclick: () => {
      const s = state();
      let bi = 0, bd = Infinity;
      VOLT_DIV.forEach((v, i) => { const e = Math.abs(s.vpp / v - 4); if (e < bd) { bd = e; bi = i; } });
      vdSl.set(bi);
      let ti = 0, tdd = Infinity;
      TIME_DIV.forEach((v, i) => { const e = Math.abs(10 * v * s.f - 2.5); if (e < tdd) { tdd = e; ti = i; } });
      tdSl.set(ti);
      hint = 'ضبط تلقائي: ارتفاع ≈ 4 مربعات و≈ 2.5 دورة على الشاشة';
    },
  }]);

  // ===== مؤشر قياس بالنقر على الشاشة (نسبة من عرض الشبكة) =====
  let cursor = -1;              // −1 = مخفي
  let geom = { gx: 0, gy: 0, gw: 1, gh: 1, dv: 1, cy: 0 };
  const onTap = e => {
    const r = kit.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(kit.W, e.clientX - r.left));
    const y = Math.max(0, Math.min(kit.H, e.clientY - r.top));
    if (x < geom.gx || x > geom.gx + geom.gw || y < geom.gy || y > geom.gy + geom.gh) { cursor = -1; return; }
    cursor = (x - geom.gx) / geom.gw;
  };
  kit.canvas.addEventListener('pointerdown', onTap);
  kit.canvas.style.cursor = 'crosshair';

  // ===== القيم اللحظية =====
  const state = () => {
    const f = unknown ? unknown.f : manSl.value * decade;
    const vpp = unknown ? unknown.vpp : vppSl.value;
    const wv = unknown ? unknown.wave : wave;
    const off = unknown ? 0 : offSl.value;
    return { f, vpp, wv, off, T: 1 / f, vd: VOLT_DIV[vdSl.value], td: TIME_DIV[tdSl.value] };
  };

  // ===== مؤقت مستقل للمهام و dwell — لا يعتمد على حلقة الرسم =====
  const timer = setInterval(() => {
    const s = state();
    if (coupling === 2 && gndSince && performance.now() - gndSince >= 1000) gndZero = true;

    if (!unknown && coupling !== 2) {
      // م1: 2 V/div وارتفاع 4 مربعات ⟵ Vpp = 8 V ±2%
      if (Math.abs(s.vd - 2) < 1e-9 && Math.abs(s.vpp - 8) <= 0.16) complete('m1');
      // م2: 0.2 s/div ودورة كاملة في 4 مربعات ⟵ T = 0.8 s و f = 1.25 Hz ±2%
      if (Math.abs(s.td - 0.2) < 1e-9 && Math.abs(s.T - 0.8) <= 0.016) complete('m2');
      // م3: موجة 50 Hz ودورتان كاملتان على 10 مربعات ⟵ TIME/DIV = 4 ms
      if (Math.abs(s.td - 0.004) < 1e-9 && Math.abs(10 * s.td * s.f - 2) <= 0.04) complete('m3');
    }
    // م4: قياس المجهولة بخطأ < 5% في V و f معًا
    if (unknown && okV && okF) complete('m4');
  }, 140);

  // ===== الرسم =====
  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, p = kit.pal, s = state();
    const gx0 = 46, gy0 = 26;
    const dv = Math.min((W - gx0 - 14) / 10, (H - gy0 - 46) / 8);
    const gw = dv * 10, gh = dv * 8;
    const gx = gx0 + (W - gx0 - 14 - gw) / 2, gy = gy0 + (H - gy0 - 46 - gh) / 2;
    const cy = gy + gh / 2;

    // انزياح التزامن: مقفول على القناة المعروضة، ينساب عند LINE/EXT غير المتوافق
    const rate = trig === 2 ? 2 * Math.PI * (s.f - F_LINE * Math.round(s.f / F_LINE))
      : (trig === 3 || (trig === 1 && !ch2On)) ? 2 * Math.PI * 0.55 : 0;
    drift = (drift + rate * dt) % (2 * Math.PI);
    const locked = Math.abs(rate) < 1e-6;
    const basePh = trig === 1 && ch2On ? -Math.PI / 2 : 0;

    // شاشة الفوسفور
    c.fillStyle = withAlpha(p.text, 0.05);
    c.fillRect(gx, gy, gw, gh);

    // الشبكة 8×10
    c.strokeStyle = withAlpha(p.text, 0.14); c.lineWidth = 1;
    for (let i = 0; i <= 10; i++) { c.beginPath(); c.moveTo(gx + i * dv, gy); c.lineTo(gx + i * dv, gy + gh); c.stroke(); }
    for (let j = 0; j <= 8; j++) { c.beginPath(); c.moveTo(gx, gy + j * dv); c.lineTo(gx + gw, gy + j * dv); c.stroke(); }
    c.strokeStyle = withAlpha(p.text, 0.4); c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(gx, cy); c.lineTo(gx + gw, cy); c.stroke();
    c.beginPath(); c.moveTo(gx + gw / 2, gy); c.lineTo(gx + gw / 2, gy + gh); c.stroke();
    c.strokeStyle = flash > 0 ? withAlpha(p.ok, 0.3 + 0.6 * flash) : p.line;
    c.lineWidth = flash > 0 ? 2.4 : 1.6;
    c.strokeRect(gx, gy, gw, gh);
    if (flash > 0) flash = Math.max(0, flash - dt * 1.3);

    geom = { gx, gy, gw, gh, dv, cy };

    // مؤشر خط الصفر ⏚ على الحافة اليسرى + تقدّم تثبيت GND
    label(c, '⏚', gx - 8, cy, { size: 13, color: gndZero ? p.ok : p.text2, align: 'right' });
    if (coupling === 2 && !gndZero && gndSince) {
      const prog = Math.min(1, (performance.now() - gndSince) / 1000);
      c.fillStyle = withAlpha(p.ok, 0.75);
      c.fillRect(gx, cy + 4, gw * prog, 3);
      label(c, 'يثبّت خط الصفر…', gx + gw / 2, cy - 14, { size: 11.5, color: p.ok, align: 'center' });
    } else if (coupling === 2 && gndZero) {
      label(c, 'خط الصفر مثبّت ✓ — بدّل إلى DC', gx + gw / 2, cy - 14, { size: 11.5, color: p.ok, align: 'center' });
    }

    // ===== الآثار =====
    const cyclesScr = 10 * s.td * s.f;
    const drawTrace = (amp, ph, dc, col, wv) => {
      c.save(); c.beginPath();
      c.strokeStyle = col; c.lineWidth = 2; c.lineJoin = 'round';
      c.shadowColor = withAlpha(col, 0.6); c.shadowBlur = 6;
      for (let x = 0; x <= gw; x++) {
        const tt = (x / dv) * s.td;
        const v = coupling === 2 ? 0
          : amp * shape(wv, 2 * Math.PI * s.f * tt + ph + drift + basePh) + dc;
        const y = Math.max(gy + 1, Math.min(gy + gh - 1, cy - (v / s.vd) * dv));
        x === 0 ? c.moveTo(gx, y) : c.lineTo(gx + x, y);
      }
      c.stroke(); c.restore();
    };
    const dcShown = coupling === 1 ? s.off : 0;
    if (cyclesScr <= 140 || coupling === 2) {
      drawTrace(s.vpp / 2, 0, dcShown, p.water, s.wv);
      if (ch2On) drawTrace(s.vpp * 0.3, Math.PI / 2, 0, p.amber, s.wv);
    } else {
      // أسرع من قدرة العرض: يُرسم مغلّف بدل خطوط متداخلة
      c.fillStyle = withAlpha(p.water, 0.35);
      const hy = (s.vpp / 2 / s.vd) * dv;
      c.fillRect(gx, Math.max(gy, cy - dcShown / s.vd * dv - hy), gw, Math.min(gh, 2 * hy));
      label(c, 'قلّل TIME/DIV — الموجة أسرع من العرض', gx + gw / 2, gy + 14,
        { size: 12, color: p.bad, align: 'center' });
    }

    // ===== قياس الارتفاع بالمربعات =====
    const hDiv = s.vpp / s.vd;
    if (coupling !== 2 && hDiv <= 8 && hDiv >= 0.4 && cyclesScr <= 140) {
      const ax = gx + dv * 0.9, yTop = cy - dcShown / s.vd * dv - (hDiv / 2) * dv;
      const yBot = yTop + hDiv * dv;
      if (yTop > gy && yBot < gy + gh) {
        arrow(c, ax, (yTop + yBot) / 2, ax, yTop + 2, { color: p.badge, width: 1.8, head: 5 });
        arrow(c, ax, (yTop + yBot) / 2, ax, yBot - 2, { color: p.badge, width: 1.8, head: 5 });
        label(c, `${hDiv.toFixed(2)} مربع`, ax + 6, (yTop + yBot) / 2 - 10,
          { size: 11.5, color: p.badge, align: 'left' });
      }
    }

    // ===== قياس عرض الدورة بالمربعات =====
    const perDiv = s.T / s.td;
    if (coupling !== 2 && perDiv <= 10 && perDiv >= 0.35) {
      const by = gy + gh - dv * 0.55;
      arrow(c, gx + perDiv * dv / 2, by, gx + 2, by, { color: p.ok, width: 1.8, head: 5 });
      arrow(c, gx + perDiv * dv / 2, by, gx + perDiv * dv - 2, by, { color: p.ok, width: 1.8, head: 5 });
      label(c, `دورة = ${perDiv.toFixed(2)} مربع`, gx + perDiv * dv / 2, by - 11,
        { size: 11.5, color: p.ok, align: 'center' });
    }

    // ===== مؤشر القياس العمودي =====
    if (cursor >= 0) {
      const cxp = gx + cursor * gw, tt = (cursor * gw / dv) * s.td;
      const vv = coupling === 2 ? 0
        : (s.vpp / 2) * shape(s.wv, 2 * Math.PI * s.f * tt + drift + basePh) + dcShown;
      c.strokeStyle = withAlpha(p.badge, 0.85); c.lineWidth = 1.4;
      c.setLineDash([5, 4]);
      c.beginPath(); c.moveTo(cxp, gy); c.lineTo(cxp, gy + gh); c.stroke();
      c.setLineDash([]);
      const yv = Math.max(gy + 2, Math.min(gy + gh - 2, cy - (vv / s.vd) * dv));
      c.fillStyle = p.badge; c.beginPath(); c.arc(cxp, yv, 3.5, 0, Math.PI * 2); c.fill();
      label(c, `${vv.toFixed(2)} V · ${fmtTime(+tt.toPrecision(3))}`,
        cxp > gx + gw / 2 ? cxp - 6 : cxp + 6, gy + gh - 12,
        { size: 11, color: p.badge, align: cxp > gx + gw / 2 ? 'right' : 'left' });
    }

    // ===== شريط الحالة أعلى الشاشة =====
    label(c, `${coupling === 2 ? 'GND — خط الصفر' : COUPLING[coupling]} · تزامن ${TRIG[trig]}${locked ? ' 🔒' : ' ↔ غير متزامن'}`,
      gx + gw - 4, gy - 12, { size: 11.5, color: locked ? p.text2 : p.bad, align: 'right' });
    label(c, unknown ? 'موجة مجهولة ❓' : `مولد: ${WAVES[s.wv]}`, gx + 4, gy - 12,
      { size: 11.5, color: unknown ? p.badge : p.text2, align: 'left' });

    // تدريج المحاور
    label(c, `${fmtVolt(s.vd)}/مربع`, gx - 8, gy + 10, { size: 10.5, color: p.text2, align: 'right' });
    label(c, `${fmtTime(s.td)}/مربع`, gx + gw, gy + gh + 14, { size: 11, color: p.text2, align: 'right' });
    if (hint) label(c, hint, gx + gw / 2, gy + gh + 32, { size: 11.5, color: p.amber, align: 'center' });

    // ===== القراءات الحية =====
    read.set([
      { label: 'Vpp المقاس', value: unknown ? `${hDiv.toFixed(2)} مربع` : `${s.vpp.toFixed(1)} V`, color: p.water },
      { label: 'الارتفاع', value: `${hDiv.toFixed(2)} مربع × ${fmtVolt(s.vd)}`, color: p.badge },
      { label: 'T', value: unknown ? `${perDiv.toFixed(2)} مربع` : `${fmtTime(+s.T.toPrecision(4))}`, color: p.ok },
      { label: 'f', value: unknown ? '؟' : fmtFreq(s.f), color: p.amber },
      { label: 'الإزاحة', value: coupling === 1 ? `${(s.off / s.vd).toFixed(2)} مربع` : '0.00 مربع', color: p.text2 },
      { label: 'دورات على الشاشة', value: cyclesScr.toFixed(2), color: p.text2 },
    ]);
  });

  return {
    destroy() {
      clearInterval(timer);
      kit.canvas.removeEventListener('pointerdown', onTap);
      kit.destroy();
    },
  };
}
