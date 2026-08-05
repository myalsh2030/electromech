// مقعد التوالي والتوازي والمركّب: ثلاث مقاومات بنمط توصيل قابل للتبديل،
// أميتر لكل فرع وفولتميتر لكل عنصر، وتحقق آلي من KVL وKCL وانحفاظ القدرة.
// كل الألوان من kit.pal (فاتح/داكن) — لا hex صلب.
import { SimKit, label, withAlpha } from './simkit.js';

// سلّم مقاومات مفضّل: 1 Ω … 100 kΩ (يغطي 1/2/4/5/6 و8k و24k بدقة)
const BASE = [1, 1.5, 2, 2.4, 3, 3.9, 4, 4.7, 5, 6, 6.8, 8];
const RVALS = [];
for (const d of [1, 10, 100, 1000, 10000]) for (const b of BASE) RVALS.push(+(b * d).toFixed(4));
RVALS.push(100000);
const RMAX = RVALS.length - 1; // 60

const MODES = [
  { id: 'series', name: 'توالٍ' },
  { id: 'parallel', name: 'توازٍ' },
  { id: 'combined', name: 'مركّب: R₁ + (R₂∥R₃)' },
];

// قانون كل نمط — يظهر أسفل اللوحة ليربط الرقم المتحرك بالصيغة
const FORMULA = {
  series: 'R_T = R₁+R₂+R₃   ·   التيار واحد في كل العناصر   ·   E = V₁+V₂+V₃',
  parallel: 'G_T = 1/R₁+1/R₂+1/R₃   ·   R_T = 1/G_T   ·   الجهد واحد وI_s = ΣI_i',
  combined: 'R_p = R₂R₃/(R₂+R₃)   ·   R_T = R₁+R_p   ·   I₁ = I₂+I₃',
};

const fmtR = r => (r >= 1000 ? `${+(r / 1000).toFixed(3)} kΩ` : r < 10 ? `${+r.toFixed(3)} Ω` : `${+r.toFixed(2)} Ω`);
const fmtI = i => (i >= 1 ? `${i.toFixed(3)} A` : i >= 1e-3 ? `${(i * 1e3).toFixed(2)} mA` : `${(i * 1e6).toFixed(1)} µA`);
const fmtV = v => `${v.toFixed(2)} V`;
const fmtP = p => (p >= 1 ? `${p.toFixed(2)} W` : `${(p * 1e3).toFixed(1)} mW`);
const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.78 });
  const read = kit.readout();

  let mode = 'combined';        // افتراضي خارج شروط كل المهام
  const sw = [true, true, true]; // مفاتيح الأفرع
  let pulse = 0, lastKey = '', flow = 0;
  const hit = [];                // مناطق نقر المقاومات على اللوحة
  const done = new Set();
  const proved = new Set();      // أنماط ثبت فيها انحفاظ القدرة (للمهمة 5)
  let dwellMode = mode, dwellFrom = performance.now();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id); pulse = 1;
    ctx.completeMission(id);
  };

  // ===== التحكمات =====
  const modeBtns = kit.buttons(MODES.map(m => ({
    label: m.name,
    onclick: () => { mode = m.id; dwellMode = m.id; dwellFrom = performance.now(); paintModes(); },
  })));
  const paintModes = () => modeBtns.forEach((b, i) => { b.className = `btn sm ${MODES[i].id === mode ? '' : 'secondary'}`; });
  paintModes();

  const eSl = kit.slider({ label: 'جهد المصدر E', min: 5, max: 48, step: 1, value: 12, unit: 'V' });
  const rSl = [0, 1, 2].map(i => kit.slider({
    label: `المقاومة R${'₁₂₃'[i]}`, min: 0, max: RMAX, step: 1, value: 12, // 12 ⟵ 10 Ω
    fmt: v => fmtR(RVALS[v]), unit: '',
  }));

  const swBtns = kit.buttons([0, 1, 2].map(i => ({
    label: `مفتاح الفرع ${i + 1}`,
    onclick: () => { sw[i] = !sw[i]; paintSw(); },
  })));
  const paintSw = () => swBtns.forEach((b, i) => {
    b.className = `btn sm ${sw[i] ? '' : 'secondary'}`;
    b.textContent = `الفرع ${i + 1}: ${sw[i] ? 'موصول' : 'مفصول'}`;
  });
  paintSw();

  kit.buttons([{
    label: 'إعادة الضبط ↺', cls: 'ghost',
    onclick: () => {
      mode = 'combined'; paintModes();
      eSl.set(12); rSl.forEach(s => s.set(12));
      sw[0] = sw[1] = sw[2] = true; paintSw();
      dwellMode = mode; dwellFrom = performance.now();
    },
  }]);

  // ===== الحساب =====
  function solve() {
    const E = eSl.value, R = rSl.map(s => RVALS[s.value]);
    const st = { E, R, mode, open: false, RT: 0, GT: 0, Is: 0, I: [0, 0, 0], V: [0, 0, 0], P: [0, 0, 0], Pdel: 0 };
    if (mode === 'series') {
      if (!sw[0] || !sw[1] || !sw[2]) st.open = true;
      else {
        st.RT = R[0] + R[1] + R[2];
        const I = E / st.RT;
        st.Is = I; st.GT = 1 / st.RT;
        for (let i = 0; i < 3; i++) { st.I[i] = I; st.V[i] = I * R[i]; }
      }
    } else if (mode === 'parallel') {
      let G = 0;
      for (let i = 0; i < 3; i++) if (sw[i]) G += 1 / R[i];
      if (G <= 0) st.open = true;
      else {
        st.GT = G; st.RT = 1 / G;
        for (let i = 0; i < 3; i++) if (sw[i]) { st.V[i] = E; st.I[i] = E / R[i]; }
        st.Is = E * G;
      }
    } else {
      let Gp = 0;
      if (sw[1]) Gp += 1 / R[1];
      if (sw[2]) Gp += 1 / R[2];
      if (!sw[0] || Gp <= 0) st.open = true;
      else {
        const Rp = 1 / Gp;
        st.RT = R[0] + Rp; st.GT = 1 / st.RT;
        const I = E / st.RT;
        st.Is = I; st.I[0] = I; st.V[0] = I * R[0];
        const Vp = I * Rp;
        for (let i = 1; i < 3; i++) if (sw[i]) { st.V[i] = Vp; st.I[i] = Vp / R[i]; }
      }
    }
    for (let i = 0; i < 3; i++) st.P[i] = st.V[i] * st.I[i];
    st.Pdel = E * st.Is;
    st.Psum = st.P[0] + st.P[1] + st.P[2];
    st.kvl = mode === 'parallel' ? 0 : Math.abs(E - (mode === 'series' ? st.V[0] + st.V[1] + st.V[2] : st.V[0] + Math.max(st.V[1], st.V[2])));
    st.kcl = mode === 'parallel' ? Math.abs(st.Is - (st.I[0] + st.I[1] + st.I[2]))
      : mode === 'combined' ? Math.abs(st.I[0] - (st.I[1] + st.I[2])) : 0;
    return st;
  }

  // ===== المهام (مؤقت مستقل عن حلقة الرسم) =====
  function checkMissions() {
    const s = solve();
    if (s.open) return;
    const all = sw[0] && sw[1] && sw[2];
    // م1: التوالي 20 V مع 2/1/5 Ω
    if (mode === 'series' && all && near(s.E, 20, 0.02) && near(s.Is, 2.5, 0.02)
      && near(s.V[0], 5, 0.02) && near(s.V[1], 2.5, 0.02) && near(s.V[2], 12.5, 0.02)
      && near(s.Pdel, 50, 0.02)) complete('m1');
    // م2: التوازي 2∥4∥5 ⟵ G_T=0.95 S و R_T=1.053 Ω
    if (mode === 'parallel' && all && near(s.GT, 0.95, 0.02) && near(s.RT, 1.0526, 0.02)) complete('m2');
    // م3: المركّب 15 V، 1Ω + (2∥6) ⟵ R_T=2.5 Ω و I=6 A
    if (mode === 'combined' && all && near(s.E, 15, 0.02) && near(s.RT, 2.5, 0.02) && near(s.Is, 6, 0.02)) complete('m3');
    // م4: 48 V مع 8k∥24k ⟵ 6mA و2mA وIs=8mA (فرعان نشطان فقط)
    if (mode === 'parallel' && near(s.E, 48, 0.02)) {
      const act = [0, 1, 2].filter(i => sw[i]).map(i => s.I[i]).sort((a, b) => b - a);
      if (act.length === 2 && near(act[0], 0.006, 0.02) && near(act[1], 0.002, 0.02) && near(s.Is, 0.008, 0.02)) complete('m4');
    }
    // م5: انحفاظ القدرة في النمطين (توالٍ وتوازٍ) مع مكث ≥ 800ms على النمط
    const now = performance.now();
    if (mode !== dwellMode) { dwellMode = mode; dwellFrom = now; }
    if ((mode === 'series' || mode === 'parallel') && now - dwellFrom >= 800
      && s.Pdel > 1e-6 && Math.abs(s.Psum - s.Pdel) <= 0.01 * s.Pdel) proved.add(mode);
    if (proved.has('series') && proved.has('parallel')) complete('m5');
  }
  const timer = setInterval(checkMissions, 140);

  // ===== الرسم =====
  const pointer = ev => {
    const r = kit.canvas.getBoundingClientRect();
    const x = Math.min(kit.W, Math.max(0, (ev.clientX - r.left) * kit.W / r.width));
    const y = Math.min(kit.H, Math.max(0, (ev.clientY - r.top) * kit.H / r.height));
    for (const h of hit) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { sw[h.i] = !sw[h.i]; paintSw(); return; }
  };
  kit.canvas.addEventListener('pointerdown', pointer);
  kit.canvas.style.cursor = 'pointer';

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, p = kit.pal;
    const s = solve();
    hit.length = 0;
    // سرعة الجسيمات تتبع التيار بلوغاريتم مقيّد (0.25–1.6 دورة/ث)
    flow = (flow + dt * (s.open ? 0 : Math.min(1.6, 0.25 + Math.log10(1 + s.Is * 1000) * 0.35))) % 1;

    // yTop مرفوع كي لا تتصادم فولتميترات نمطي التوالي والمركّب (أعلى الشبكة) مع شارة
    // الحالة/تحقق كيرشوف (y≈20 وy≈40) ولا يُقتطع نصّ قيمتها فوق حافة اللوحة (y<0).
    const x0 = 34, x1 = W - 26, yTop = 110, yBot = H - 52;
    c.lineWidth = 2.4; c.lineCap = 'round';
    const wire = withAlpha(p.text, 0.62);
    const live = s.open ? withAlpha(p.text, 0.3) : p.amber;

    // بطارية على الحافة اليسرى
    battery(c, x0, (yTop + yBot) / 2, s.E, p);

    if (mode === 'series') {
      const seg = (x1 - x0) / 3;
      seg1(c, x0, yTop, x1, yBot, wire, live, flow, s.open);
      for (let i = 0; i < 3; i++) {
        const cx = x0 + seg * (i + 0.5);
        drawR(c, cx - 30, yTop - 13, 60, 26, false, i, s, p, hit);
        meterV(c, cx, yTop - 40, s.V[i], p, s.open || !sw[i]);
      }
      meterA(c, (x0 + x1) / 2, yBot, s.Is, p, s.open);
    } else if (mode === 'parallel') {
      c.strokeStyle = wire;
      line(c, x0, yTop, x1, yTop); line(c, x0, yBot, x1, yBot);
      dots(c, x0, yTop, x1, yTop, flow, live, s.open ? 0 : 8);
      const gap = (x1 - x0 - 40) / 3;
      for (let i = 0; i < 3; i++) {
        const bx = x0 + 46 + gap * i + gap * 0.4;
        c.strokeStyle = sw[i] ? wire : withAlpha(p.bad, 0.55);
        line(c, bx, yTop, bx, yBot);
        drawR(c, bx - 17, (yTop + yBot) / 2 - 26, 34, 52, true, i, s, p, hit);
        meterA(c, bx, yTop + 34, s.I[i], p, s.open || !sw[i]);
        if (!s.open && sw[i]) dots(c, bx, yTop, bx, yBot, (flow + i * 0.3) % 1, live, 5);
      }
      meterV(c, (x0 + x1) / 2, yBot + 20, s.open ? 0 : s.E, p, s.open);
    } else {
      const xm = x0 + (x1 - x0) * 0.42;
      c.strokeStyle = wire;
      line(c, x0, yTop, x1, yTop); line(c, x0, yBot, x1, yBot); line(c, x1, yTop, x1, yBot);
      drawR(c, x0 + 44, yTop - 13, 60, 26, false, 0, s, p, hit);
      meterV(c, x0 + 74, yTop - 38, s.V[0], p, s.open || !sw[0]);
      for (let i = 1; i < 3; i++) {
        const bx = xm + (x1 - xm) * (i === 1 ? 0.32 : 0.72);
        c.strokeStyle = sw[i] ? wire : withAlpha(p.bad, 0.55);
        line(c, bx, yTop, bx, yBot);
        drawR(c, bx - 17, (yTop + yBot) / 2 - 26, 34, 52, true, i, s, p, hit);
        meterA(c, bx, yTop + 34, s.I[i], p, s.open || !sw[i]);
        if (!s.open && sw[i]) dots(c, bx, yTop, bx, yBot, (flow + i * 0.35) % 1, live, 5);
      }
      if (!s.open) dots(c, x0, yTop, xm, yTop, flow, live, 6);
      meterA(c, (x0 + x1) / 2, yBot, s.Is, p, s.open);
    }

    // قانون النمط الحالي (يسار أسفل اللوحة)
    label(c, FORMULA[mode], W - 14, H - 30, { size: 11.5, color: p.text2, align: 'right' });

    // شارة الحالة أعلى اللوحة
    const head = s.open ? 'دائرة مفتوحة — لا تيار' :
      `R_T = ${fmtR(s.RT)}   ·   G_T = ${s.GT >= 0.01 ? s.GT.toFixed(3) + ' S' : (s.GT * 1e3).toFixed(3) + ' mS'}   ·   I_s = ${fmtI(s.Is)}`;
    label(c, head, W / 2, 20, { size: 13.5, color: s.open ? p.bad : p.text, align: 'center', weight: 800 });

    // تحقق كيرشوف
    if (!s.open) {
      const okV = s.kvl <= 0.01 * s.E, okI = s.kcl <= 0.01 * Math.max(s.Is, 1e-9);
      const msg = mode === 'parallel'
        ? `KCL: I_s = ΣI_i ${okI ? '✓' : '✗'}`
        : `KVL: E = ΣV_i ${okV ? '✓' : '✗'}${mode === 'combined' ? `   ·   KCL: I₁ = I₂+I₃ ${okI ? '✓' : '✗'}` : ''}`;
      label(c, msg, W / 2, 40, { size: 12, color: okV && okI ? p.ok : p.bad, align: 'center' });
      label(c, `ΣP_i = ${fmtP(s.Psum)}  مقابل  P_del = ${fmtP(s.Pdel)}`, W / 2, H - 12,
        { size: 12, color: Math.abs(s.Psum - s.Pdel) <= 0.01 * s.Pdel ? p.ok : p.bad, align: 'center' });
    } else {
      label(c, 'أعِد وصل المفاتيح المفصولة لإغلاق المسار', W / 2, H - 12, { size: 12, color: p.text2, align: 'center' });
    }
    label(c, 'انقر أي مقاومة لفصل فرعها أو وصله', 14, H - 30, { size: 11, color: p.text2, align: 'left' });

    if (pulse > 0) {
      c.strokeStyle = withAlpha(p.ok, 0.15 + 0.5 * pulse);
      c.lineWidth = 3; c.strokeRect(4, 4, W - 8, H - 8);
      pulse = Math.max(0, pulse - dt * 1.2);
    }

    // ===== القراءات الحية =====
    const key = `${mode}|${s.E}|${s.R.join(',')}|${sw.join(',')}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'R_T', value: s.open ? '∞' : fmtR(s.RT), color: p.amber },
        { label: 'G_T', value: s.open ? '0 S' : (s.GT >= 0.01 ? s.GT.toFixed(3) + ' S' : (s.GT * 1e3).toFixed(3) + ' mS'), color: p.badge },
        { label: 'I_s', value: fmtI(s.Is), color: p.water },
        { label: 'I₁/I₂/I₃', value: s.I.map(fmtI).join(' / '), color: p.water2 },
        { label: 'V₁/V₂/V₃', value: s.V.map(fmtV).join(' / '), color: p.text },
        { label: 'P_del', value: fmtP(s.Pdel), color: p.ok },
      ]);
    }
  });

  return {
    destroy() {
      clearInterval(timer);
      kit.canvas.removeEventListener('pointerdown', pointer);
      kit.destroy();
    },
  };
}

// ===== أدوات رسم =====
function line(c, x1, y1, x2, y2) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }

// حلقة التوالي: الأسلاك الأربعة + جسيمات على الضلع السفلي
function seg1(c, x0, yTop, x1, yBot, wire, live, flow, open) {
  c.strokeStyle = wire;
  line(c, x0, yTop, x1, yTop); line(c, x1, yTop, x1, yBot); line(c, x0, yBot, x1, yBot);
  if (!open) dots(c, x1, yBot, x0, yBot, flow, live, 9);
}

// جسيمات حاملة للتيار (العدد الكلي في أي إطار أقل من 40)
function dots(c, x1, y1, x2, y2, ph, color, n) {
  c.save(); c.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const f = ((i / n) + ph) % 1;
    c.beginPath();
    c.arc(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 2.6, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

// بطارية عمودية على الحافة اليسرى
function battery(c, x, y, E, p) {
  c.save();
  c.strokeStyle = p.amber; c.lineWidth = 2.4;
  line(c, x, y - 34, x, y - 11);
  line(c, x, y + 11, x, y + 34);
  c.lineWidth = 3.4; line(c, x - 13, y - 11, x + 13, y - 11);
  c.lineWidth = 1.8; line(c, x - 7, y + 1, x + 7, y + 1);
  c.lineWidth = 3.4; line(c, x - 13, y + 11, x + 13, y + 11);
  c.restore();
  label(c, `E = ${E} V`, x, y + 30, { size: 12.5, color: p.amber, align: 'center' });
}

// مقاومة بجسم مستطيل + متعرّج، مع قيمها؛ تسجّل منطقة نقر داخل اللوحة
function drawR(c, x, y, w, h, vertical, i, s, p, hit) {
  const dead = s.open || (s.I[i] === 0 && s.V[i] === 0);
  const col = dead ? withAlpha(p.text, 0.35) : p.water;
  c.save();
  c.fillStyle = withAlpha(col, 0.14);
  c.strokeStyle = col; c.lineWidth = 2;
  c.beginPath(); c.roundRect(x, y, w, h, 5); c.fill(); c.stroke();
  // متعرّج داخلي
  c.beginPath(); c.lineWidth = 1.6;
  const n = 6;
  for (let k = 0; k <= n; k++) {
    const f = k / n;
    const px = vertical ? x + w / 2 + (k % 2 ? 8 : -8) * (k && k < n ? 1 : 0) : x + 6 + (w - 12) * f;
    const py = vertical ? y + 6 + (h - 12) * f : y + h / 2 + (k % 2 ? 7 : -7) * (k && k < n ? 1 : 0);
    k ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.stroke();
  c.restore();
  hit.push({ x, y, w, h, i });

  const tag = `R${'₁₂₃'[i]} = ${fmtR(s.R[i])}`;
  if (vertical) {
    label(c, tag, x + w + 6, y + h / 2 - 9, { size: 12, color: p.text, align: 'left' });
    label(c, `${fmtV(s.V[i])} · ${fmtP(s.P[i])}`, x + w + 6, y + h / 2 + 9, { size: 11, color: p.text2, align: 'left' });
  } else {
    label(c, tag, x + w / 2, y + h + 14, { size: 12, color: p.text, align: 'center' });
    label(c, `${fmtI(s.I[i])} · ${fmtP(s.P[i])}`, x + w / 2, y + h + 30, { size: 11, color: p.text2, align: 'center' });
  }
  if (dead && !s.open) label(c, 'مفصولة', x + w / 2, y - 10, { size: 11, color: p.bad, align: 'center' });
}

// أميتر: دائرة بحرف A وقيمة التيار
function meterA(c, x, y, I, p, dead) {
  const col = dead ? withAlpha(p.text, 0.35) : p.ok;
  c.save();
  c.fillStyle = withAlpha(col, 0.16); c.strokeStyle = col; c.lineWidth = 1.8;
  c.beginPath(); c.arc(x, y, 12, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  label(c, 'A', x, y, { size: 12, color: col, align: 'center', weight: 800 });
  label(c, fmtI(I), x, y + 24, { size: 11.5, color: col, align: 'center' });
}

// فولتميتر: دائرة بحرف V وقيمة الجهد
function meterV(c, x, y, V, p, dead) {
  const col = dead ? withAlpha(p.text, 0.35) : p.badge;
  c.save();
  c.fillStyle = withAlpha(col, 0.16); c.strokeStyle = col; c.lineWidth = 1.8;
  c.beginPath(); c.arc(x, y, 12, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  label(c, 'V', x, y, { size: 12, color: col, align: 'center', weight: 800 });
  label(c, fmtV(V), x, y - 22, { size: 11.5, color: col, align: 'center' });
}
