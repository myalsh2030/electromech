// مختبر أوم والقدرة: ثلاث محطات — مصدر ومقاومة (I=E/R)، قياس مباشر (R=V/I)،
// وكفاية جهاز (η=P₂/P₁) — تغطي قانون أوم والقدرة بصورهما الثلاث وحساب الكفاية.
// كل الألوان من kit.pal (فاتح/داكن) — لا hex صلب.
import { SimKit, label, withAlpha } from './simkit.js';

// سلّم مقاومات مفضّل يضمن قيمًا مضبوطة (100 Ω، 10 Ω، 2 kΩ) وأزواج تضعيف متتالية
const RVALS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const RMAX = RVALS.length - 1;

const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
const fmtR = r => (r >= 1000 ? `${+(r / 1000).toFixed(2)} kΩ` : `${+r.toFixed(2)} Ω`);
const fmtI = i => (i >= 1 ? `${i.toFixed(3)} A` : i >= 1e-3 ? `${(i * 1e3).toFixed(2)} mA` : `${(i * 1e6).toFixed(1)} µA`);
const fmtP = p => (p >= 1 ? `${p.toFixed(2)} W` : `${(p * 1e3).toFixed(1)} mW`);

const STATIONS = [
  { id: 'source', name: 'مصدر ومقاومة' },
  { id: 'measure', name: 'قياس مباشر (V,I ⟵ R)' },
  { id: 'eff', name: 'كفاية جهاز' },
];

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.64 });
  const read = kit.readout();

  // القيم الافتراضية خارج شروط كل المهام عمدًا
  let station = 'source';
  let pulse = 0, lastKey = '', flow = 0, energyWh = 0;
  const done = new Set();
  const hit3 = new Set(); // تتبّع أهداف مثال (7) الثلاثة في محطة المصدر
  let prevE = 10, prevR = RVALS[9]; // 1000 Ω — لالتقاط حدث تضعيف R لاحقًا
  let dwellStation = station, dwellFrom = performance.now();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id); pulse = 1;
    ctx.completeMission(id);
  };

  // ===== أزرار المحطات =====
  const stBtns = kit.buttons(STATIONS.map(s => ({
    label: s.name,
    onclick: () => { station = s.id; showRows(); },
  })));
  const paintStations = () => stBtns.forEach((b, i) => { b.className = `btn sm ${STATIONS[i].id === station ? '' : 'secondary'}`; });

  // ===== محطة المصدر والمقاومة =====
  const eSl = kit.slider({
    label: 'الجهد المصدر E', min: 1, max: 50, step: 0.5, value: 10, unit: 'V', fmt: v => v.toFixed(1),
    // oninput (لا مستمع DOM منفصل): set() تستدعيه أيضًا فلا ينفصل prevE عن eSl.value
    // بعد نقر «جرّب مثال (1) 📖» الذي يستدعي eSl.set(50)
    oninput: v => { prevE = v; },
  });
  const rSl = kit.slider({
    label: 'المقاومة R', min: 0, max: RMAX, step: 1, value: 9, unit: '',
    fmt: v => fmtR(RVALS[v]),
    oninput: v => {
      const newR = RVALS[v];
      if (station === 'source' && eSl.value === prevE && prevR && Math.abs(newR - 2 * prevR) < 0.001 * newR) complete('m4');
      prevR = newR;
    },
  });

  // ===== محطة القياس المباشر =====
  const vSl = kit.slider({ label: 'قراءة الفولتميتر V', min: 1, max: 999, step: 1, value: 10, unit: 'mV' });
  const iSl = kit.slider({ label: 'قراءة الأميتر I', min: 1, max: 999, step: 1, value: 10, unit: 'µA' });

  // ===== محطة الكفاية =====
  const p1Sl = kit.slider({ label: 'القدرة الداخلة P₁', min: 100, max: 2000, step: 10, value: 500, unit: 'W' });
  const p2Sl = kit.slider({ label: 'القدرة الخارجة P₂', min: 50, max: 2000, step: 10, value: 400, unit: 'W' });

  kit.buttons([{
    label: 'جرّب مثال (1) 📖', cls: 'ghost',
    onclick: () => { station = 'source'; showRows(); eSl.set(50); rSl.set(6); }, // 6 ⟵ 100 Ω
  }]);

  const rows = {
    e: eSl.input.closest('.sim-row'), r: rSl.input.closest('.sim-row'),
    v: vSl.input.closest('.sim-row'), i: iSl.input.closest('.sim-row'),
    p1: p1Sl.input.closest('.sim-row'), p2: p2Sl.input.closest('.sim-row'),
  };
  function showRows() {
    rows.e.style.display = rows.r.style.display = station === 'source' ? '' : 'none';
    rows.v.style.display = rows.i.style.display = station === 'measure' ? '' : 'none';
    rows.p1.style.display = rows.p2.style.display = station === 'eff' ? '' : 'none';
    dwellStation = station; dwellFrom = performance.now();
    paintStations();
  }
  showRows();

  // ===== المهام (مؤقت مستقل عن حلقة الرسم) =====
  function checkMissions() {
    const now = performance.now();
    if (station !== dwellStation) { dwellStation = station; dwellFrom = now; }
    const held = now - dwellFrom >= 300;

    if (station === 'source') {
      const E = eSl.value, R = RVALS[rSl.value], I = E / R;
      // م1: مثال (1) — R=100 Ω، V=E=50 V ⟵ I=0.5±0.01 A
      if (held && near(R, 100, 0.001) && near(E, 50, 0.001) && Math.abs(I - 0.5) <= 0.01) complete('m1');
      // م3: مثال (7) — R=10 Ω عند I=0.7/1.4/2.1 A ⟵ P=4.9/19.6/44.1 W
      if (near(R, 10, 0.001)) {
        for (const target of [0.7, 1.4, 2.1]) if (near(I, target, 0.02)) hit3.add(target);
      }
      if (hit3.size === 3) complete('m3');
      // م4: تُلتقط لحظة تضعيف R في oninput أعلاه (نسبة I وP تساوي 0.5 رياضيًا عند ثبات E)
    } else if (station === 'measure') {
      const Vmv = vSl.value, Iua = iSl.value, R = (Vmv * 1000) / Iua; // Ω
      // م2: مثال (2) بوحدات مصغّرة — V=150 mV، I=75 µA ⟵ R=2 kΩ ±2%
      // (تفاوت على R بدل مساواة تامة على Vmv/Iua: المنزلقان 999 موضعًا لا يبلغان القيمتين بالسحب باللمس)
      if (held && near(R, 2000, 0.02)) complete('m2');
    } else if (station === 'eff') {
      const P1 = p1Sl.value, P2 = p2Sl.value, eta = P2 / P1, PL = P1 - P2;
      // م5: η=0.85±0.01 و P_L=150 W±1 (تفاوت بدل مساواة تامة على P1/P2 للسبب نفسه)
      if (held && Math.abs(eta - 0.85) <= 0.01 && Math.abs(PL - 150) <= 1) complete('m5');
    }
  }
  const timer = setInterval(checkMissions, 120);

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H, p = kit.pal;
    c.save();

    if (station === 'source') {
      const E = eSl.value, R = RVALS[rSl.value], I = E / R, Pw = I * I * R;
      energyWh += Pw * dt / 3600;
      flow = (flow + dt * Math.min(1.4, 0.2 + Math.log10(1 + I * 20) * 0.4)) % 1;
      drawSource(c, W, H, p, E, R, I, Pw, flow, pulse, t);
      // الطاقة المتراكمة تدخل المفتاح كي يتحدّث شريط القراءة معها (لا فقط عند تغيّر E/R)
      const key = `s|${E}|${R}|${energyWh.toFixed(3)}`;
      if (key !== lastKey) {
        lastKey = key;
        read.set([
          { label: 'I', value: fmtI(I), color: p.water },
          { label: 'V', value: `${E.toFixed(1)} V`, color: p.amber },
          { label: 'P', value: fmtP(Pw), color: p.ok },
          { label: 'طاقة W', value: `${energyWh.toFixed(3)} Wh`, color: p.badge },
        ]);
      }
    } else if (station === 'measure') {
      const Vmv = vSl.value, Iua = iSl.value, R = (Vmv * 1000) / Iua;
      drawMeasure(c, W, H, p, Vmv, Iua, R, pulse);
      const key = `m|${Vmv}|${Iua}`;
      if (key !== lastKey) {
        lastKey = key;
        read.set([
          { label: 'V', value: `${Vmv} mV`, color: p.badge },
          { label: 'I', value: `${Iua} µA`, color: p.water },
          { label: 'R = V/I', value: fmtR(R), color: p.amber },
        ]);
      }
    } else {
      const P1 = p1Sl.value, P2 = p2Sl.value, eta = P2 / Math.max(P1, 1), PL = P1 - P2;
      drawEff(c, W, H, p, P1, P2, eta, PL, t, pulse);
      const key = `e|${P1}|${P2}`;
      if (key !== lastKey) {
        lastKey = key;
        read.set([
          { label: 'الداخلة P₁', value: `${P1} W`, color: p.amber },
          { label: 'الخارجة P₂', value: `${P2} W`, color: p.ok },
          { label: 'الكفاية η', value: `${(eta * 100).toFixed(1)}%`, color: p.water },
          { label: 'المفقودة P_L', value: `${PL.toFixed(0)} W`, color: p.bad },
        ]);
      }
    }

    if (pulse > 0) {
      c.strokeStyle = withAlpha(p.ok, 0.15 + 0.5 * pulse);
      c.lineWidth = 3; c.strokeRect(4, 4, W - 8, H - 8);
      pulse = Math.max(0, pulse - dt * 1.2);
    }
    c.restore();
  });

  return {
    destroy() {
      clearInterval(timer);
      kit.destroy();
    },
  };
}

// ===== محطة المصدر: حلقة بطارية + مقاومة + أميتر مع جسيمات تيار =====
function drawSource(c, W, H, p, E, R, I, Pw, flow, pulse, t) {
  const x0 = W * 0.16, x1 = W * 0.84, yTop = H * 0.28, yBot = H * 0.68;
  const wire = withAlpha(p.text, 0.6), live = p.amber;

  c.strokeStyle = wire; c.lineWidth = 2.2; c.lineCap = 'round';
  line(c, x0, yTop, x1, yTop); line(c, x1, yTop, x1, yBot);
  line(c, x0, yBot, x1, yBot); line(c, x0, yBot, x0, yTop);
  dots(c, x1, yTop, x1, yBot, flow, live, 4);
  dots(c, x1, yBot, x0, yBot, flow, live, 8);
  dots(c, x0, yTop, x1, yTop, flow, live, 8);

  battery(c, x0, (yTop + yBot) / 2, E, p);

  // مقاومة على الضلع العلوي + مؤشر حراري (وهج يتسع مع القدرة)
  const rw = 70, rh = 26, rx = (x0 + x1) / 2 - rw / 2, ry = yTop - rh / 2;
  const heat = Math.min(1, Pw / 40);
  c.save();
  c.fillStyle = withAlpha(p.bad, heat * 0.35);
  c.beginPath(); c.roundRect(rx - 10, ry - 10, rw + 20, rh + 20, 12); c.fill();
  c.fillStyle = withAlpha(p.water, 0.14);
  c.strokeStyle = p.water; c.lineWidth = 2;
  c.beginPath(); c.roundRect(rx, ry, rw, rh, 5); c.fill(); c.stroke();
  c.beginPath(); c.lineWidth = 1.6;
  for (let k = 0; k <= 6; k++) {
    const px = rx + 6 + (rw - 12) * (k / 6), py = ry + rh / 2 + (k % 2 ? 8 : -8) * (k && k < 6 ? 1 : 0);
    k ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.stroke();
  c.restore();
  label(c, `R = ${fmtR(R)}`, rx + rw / 2, ry - 18, { size: 12.5, color: p.water, align: 'center' });
  label(c, `${fmtP(Pw)}`, rx + rw / 2, ry + rh + 16, { size: 11.5, color: heat > 0.5 ? p.bad : p.text2, align: 'center' });

  meterA(c, (x0 + x1) / 2, yBot, I, p);

  label(c, 'مختبر أوم: I = E ÷ R', W / 2, 18, { size: 13, color: p.text, align: 'center', weight: 800 });
  if (pulse > 0) label(c, '✓ تحقّق!', W / 2, 36, { size: 12.5, color: p.ok, align: 'center' });
}

// ===== محطة القياس المباشر: جهازان + R محسوبة =====
function drawMeasure(c, W, H, p, Vmv, Iua, R, pulse) {
  const cx1 = W * 0.28, cx2 = W * 0.72, cy = H * 0.42, rad = Math.min(W, H) * 0.16;
  gauge(c, cx1, cy, rad, p, p.badge, 'فولتميتر', `${Vmv} mV`);
  gauge(c, cx2, cy, rad, p, p.water, 'أميتر', `${Iua} µA`);
  c.strokeStyle = withAlpha(p.text, 0.4); c.lineWidth = 1.6;
  c.setLineDash([4, 4]);
  line(c, cx1 + rad, cy, cx2 - rad, cy);
  c.setLineDash([]);
  label(c, 'R = V ÷ I', W / 2, H * 0.68, { size: 13, color: p.text, align: 'center', weight: 800 });
  label(c, fmtR(R), W / 2, H * 0.68 + 26, { size: 20, color: pulse > 0 ? p.ok : p.amber, align: 'center', weight: 800 });
  if (pulse > 0) label(c, '✓ مطابق لمثال (2)', W / 2, H * 0.68 + 46, { size: 12, color: p.ok, align: 'center' });
}

// ===== محطة الكفاية: صندوق جهاز بسهمي دخول/خروج =====
function drawEff(c, W, H, p, P1, P2, eta, PL, t, pulse) {
  const bx = W / 2 - 55, by = H * 0.34, bw = 110, bh = H * 0.32;
  c.save();
  c.fillStyle = withAlpha(p.water, 0.14);
  c.strokeStyle = eta > 1 ? p.bad : p.water; c.lineWidth = 2.2;
  c.beginPath(); c.roundRect(bx, by, bw, bh, 8); c.fill(); c.stroke();
  c.restore();
  label(c, 'الجهاز', W / 2, by + bh / 2, { size: 13, color: p.text, align: 'center', weight: 800 });

  arrowLine(c, W * 0.12, by + bh / 2, bx - 6, by + bh / 2, p.amber, `P₁ = ${P1} W`, p);
  arrowLine(c, bx + bw + 6, by + bh / 2, W * 0.88, by + bh / 2, p.ok, `P₂ = ${P2} W`, p);

  // فقد حراري لأعلى الصندوق
  const heat = Math.min(1, Math.max(0, PL) / 400);
  c.save();
  c.strokeStyle = withAlpha(p.bad, 0.4 + heat * 0.5); c.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const wx = bx + bw * (0.25 + i * 0.25);
    c.beginPath();
    c.moveTo(wx, by - 4);
    c.quadraticCurveTo(wx + 6, by - 14 - Math.sin(t * 3 + i) * 3, wx, by - 26);
    c.stroke();
  }
  c.restore();
  label(c, `P_L = ${PL.toFixed(0)} W`, W / 2, by - 34, { size: 11.5, color: p.bad, align: 'center' });

  label(c, `η = ${(eta * 100).toFixed(1)}%`, W / 2, by + bh + 30, { size: 18, color: eta > 1 ? p.bad : p.ok, align: 'center', weight: 800 });
  if (pulse > 0) label(c, '✓ تحقّق!', W / 2, by + bh + 52, { size: 12, color: p.ok, align: 'center' });
}

// ===== أدوات رسم مشتركة =====
function line(c, x1, y1, x2, y2) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }

// جسيمات حاملة للتيار (مجموع الجسيمات في أي إطار أقل من 40)
function dots(c, x1, y1, x2, y2, ph, color, n) {
  c.save(); c.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const f = ((i / n) + ph) % 1;
    c.beginPath();
    c.arc(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 2.4, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

function battery(c, x, y, E, p) {
  c.save();
  c.strokeStyle = p.amber; c.lineWidth = 2.4;
  line(c, x, y - 34, x, y - 11);
  line(c, x, y + 11, x, y + 34);
  c.lineWidth = 3.4; line(c, x - 13, y - 11, x + 13, y - 11);
  c.lineWidth = 1.8; line(c, x - 7, y + 1, x + 7, y + 1);
  c.lineWidth = 3.4; line(c, x - 13, y + 11, x + 13, y + 11);
  c.restore();
  label(c, `E = ${E.toFixed(1)} V`, x, y + 52, { size: 12, color: p.amber, align: 'center' });
}

function meterA(c, x, y, I, p) {
  c.save();
  c.fillStyle = withAlpha(p.ok, 0.16); c.strokeStyle = p.ok; c.lineWidth = 1.8;
  c.beginPath(); c.arc(x, y, 14, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  label(c, 'A', x, y, { size: 13, color: p.ok, align: 'center', weight: 800 });
  label(c, fmtI(I), x, y + 26, { size: 12, color: p.ok, align: 'center' });
}

function gauge(c, x, y, r, p, color, title, value) {
  c.save();
  c.fillStyle = withAlpha(color, 0.14); c.strokeStyle = color; c.lineWidth = 2.4;
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  label(c, title, x, y - 12, { size: 12, color: p.text2, align: 'center' });
  label(c, value, x, y + 12, { size: 15, color, align: 'center', weight: 800 });
}

function arrowLine(c, x1, y1, x2, y2, color, text, p) {
  c.save();
  c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 2.4; c.lineCap = 'round';
  line(c, x1, y1, x2, y1);
  c.beginPath();
  c.moveTo(x2, y1);
  c.lineTo(x2 - 8, y1 - 5);
  c.lineTo(x2 - 8, y1 + 5);
  c.closePath(); c.fill();
  c.restore();
  label(c, text, (x1 + x2) / 2, y1 - 14, { size: 12, color, align: 'center' });
}
