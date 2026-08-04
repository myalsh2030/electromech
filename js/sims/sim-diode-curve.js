// راسم منحنى الدايود: مسح الجهد لاستخراج الركبة والتسريب العكسي + تصميم منظّم زينر + دائرة LED/دايود
// ثلاث مشاهد: 'curve' (الركبة والتسريب) — 'zener' (المنظّم) — 'led' (LED/دايود سيليكون)
import { SimKit, label, arrow, withAlpha } from './simkit.js';

const VT = 0.026; // جهد الحرارة V عند الغرفة

// مواد منحنى المسح (سيليكون/جرمانيوم) — نموذج أسي مبسّط لعرض الشكل + تسريب شبه ثابت عكسيًا
// Is مضبوط بحيث يعطي ~10 mA عند جهد الركبة المعلن (بدل قيمة اعتباطية كانت تُصعّد المنحنى ست مراتب عشرية قبل أوانه)
const SI = { name: 'سيليكون Si', is: 0.01 / Math.exp(0.7 / (1.8 * VT)), n: 1.8, knee: 0.7 };
const GE = { name: 'جرمانيوم Ge', is: 0.01 / Math.exp(0.3 / (1.3 * VT)), n: 1.3, knee: 0.3 };
const CURVE_MATS = [SI, GE];

// مادتا دائرة LED/الدايود — نموذج هبوط جهد ثابت (تقريب الكتاب)
const LEDM = { name: 'LED', vf: 2 };
const SID = { name: 'دايود سيليكون', vf: 0.7 };
const LED_MATS = [LEDM, SID];

const VZ = 12; // جهد الزينر المطلوب تثبيته (مهمة 3)
const VS_LED = 12; // جهد مصدر دائرة LED/الدايود (مهمتا 4 و5) — مستقل عن VZ حتى لا يتغيّر خفيةً معه

function curveCurrent(mat, v) {
  // أمبير — موجب أمامي، سالب عكسي (تسريب شبه ثابت بعد التشبع)
  return mat.is * (Math.exp(v / (mat.n * VT)) - 1);
}

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.72 });
  const read = kit.readout();
  const done = new Set();
  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id);
    pulse = 1;
    ctx.completeMission(id);
  };

  let scene = 'curve';
  let pulse = 0;

  // ===== حالة مشهد المسح =====
  let curveMatIdx = 0;
  const knee = { Si: false, Ge: false };
  let leak = { mat: null, v5: null, v15: null };

  // ===== حالة مشهد الزينر =====
  const zen = { sig: null, atMin: null, atMax: null };

  // ===== حالة مشهد LED/دايود =====
  let ledMatIdx = 0;
  let ledDone = false, sidDone = false;

  // ===== أزرار التبديل بين المشاهد =====
  const sceneBtns = kit.buttons([
    { label: 'المسح والركبة', onclick: () => setScene('curve') },
    { label: 'منظّم الزينر', onclick: () => setScene('zener') },
    { label: 'دائرة LED/دايود', onclick: () => setScene('led') },
  ]);
  const sceneRow = sceneBtns[0].parentElement;

  // ===== صف مواد المسح =====
  const curveMatBtns = kit.buttons(CURVE_MATS.map((m, i) => ({
    label: m.name,
    onclick: () => { curveMatIdx = i; paintCurveMats(); },
  })));
  const curveMatRow = curveMatBtns[0].parentElement;
  const paintCurveMats = () => curveMatBtns.forEach((b, i) => { b.className = `btn sm ${i === curveMatIdx ? '' : 'secondary'}`; });
  paintCurveMats();

  // منزلق جهد المسح
  const vSl = kit.slider({ label: 'جهد المسح v', min: -30, max: 1.5, step: 0.1, value: -30, unit: 'V', fmt: v => v.toFixed(1) });
  const vRow = vSl.input.parentElement;

  // ===== صف مواد LED/دايود =====
  const ledMatBtns = kit.buttons(LED_MATS.map((m, i) => ({
    label: `${m.name} (Vf=${m.vf}V)`,
    onclick: () => { ledMatIdx = i; paintLedMats(); },
  })));
  const ledMatRow = ledMatBtns[0].parentElement;
  const paintLedMats = () => ledMatBtns.forEach((b, i) => { b.className = `btn sm ${i === ledMatIdx ? '' : 'secondary'}`; });
  paintLedMats();

  // منزلقا المقاومة Rs — منفصلان لكل مشهد (كانا مشتركين فيُنجزان مهام الآخر خفية عبر قيمة موروثة)
  const rsZenerSl = kit.slider({ label: 'المقاومة Rs', min: 100, max: 10000, step: 5, value: 1000, unit: 'Ω', fmt: v => Math.round(v) });
  const rsZenerRow = rsZenerSl.input.parentElement;
  const rsLedSl = kit.slider({ label: 'المقاومة Rs', min: 100, max: 10000, step: 5, value: 1000, unit: 'Ω', fmt: v => Math.round(v) });
  const rsLedRow = rsLedSl.input.parentElement;

  // منزلق حمل الزينر RL
  const rlSl = kit.slider({ label: 'حمل الزينر RL', min: 100, max: 10000, step: 100, value: 1000, unit: 'Ω', fmt: v => Math.round(v) });
  const rlRow = rlSl.input.parentElement;

  // منزلق جهد الدخل للزينر
  const vinSl = kit.slider({ label: 'جهد الدخل Vin', min: 15, max: 25, step: 0.5, value: 20, unit: 'V', fmt: v => v.toFixed(1) });
  const vinRow = vinSl.input.parentElement;

  function setScene(s) {
    scene = s;
    sceneBtns.forEach((b, i) => {
      const names = ['curve', 'zener', 'led'];
      b.className = `btn sm ${names[i] === s ? '' : 'secondary'}`;
    });
    curveMatRow.style.display = s === 'curve' ? '' : 'none';
    vRow.style.display = s === 'curve' ? '' : 'none';
    ledMatRow.style.display = s === 'led' ? '' : 'none';
    rsZenerRow.style.display = s === 'zener' ? '' : 'none';
    rsLedRow.style.display = s === 'led' ? '' : 'none';
    rlRow.style.display = s === 'zener' ? '' : 'none';
    vinRow.style.display = s === 'zener' ? '' : 'none';
  }
  setScene('curve');

  let lastKey = '';

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H;
    const p = kit.pal;

    if (scene === 'curve') drawCurve(c, W, H, p);
    else if (scene === 'zener') drawZener(c, W, H, p);
    else drawLed(c, W, H, p);

    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.4);
  });

  function drawCurve(c, W, H, p) {
    const mat = CURVE_MATS[curveMatIdx];
    const v = vSl.value;

    // ===== منطق المهام 1 و2 =====
    if (curveMatIdx === 0 && Math.abs(v - 0.7) <= 0.05) knee.Si = true;
    if (curveMatIdx === 1 && Math.abs(v - 0.3) <= 0.05) knee.Ge = true;
    if (knee.Si && knee.Ge) complete('m1');

    const iNow = curveCurrent(mat, v);
    if (leak.mat !== mat.name) leak = { mat: mat.name, v5: null, v15: null };
    if (v <= 0 && Math.abs(v - (-5)) <= 0.3) leak.v5 = iNow;
    if (v <= 0 && Math.abs(v - (-15)) <= 0.3) leak.v15 = iNow;
    if (leak.v5 != null && leak.v15 != null) {
      const diffPct = Math.abs(leak.v5 - leak.v15) / Math.max(1e-12, Math.abs(leak.v5)) * 100;
      if (diffPct < 5) complete('m2');
    }

    // ===== محاور الرسم =====
    const ox = 60, oy = H - 60, pw = W - 90, ph = H - 100;
    const xOf = vv => ox + (vv - (-30)) / (1.5 - (-30)) * pw;
    const iMax = 8e-3; // أعلى تيار معروض (مقياس أمامي)
    const iMin = -mat.is * 1.6;
    const yOf = ii => oy - (ii - iMin) / (iMax - iMin) * ph;

    c.strokeStyle = withAlpha(p.text, 0.35); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + pw, oy); c.stroke();
    c.beginPath(); c.moveTo(ox, oy - ph); c.lineTo(ox, oy); c.stroke();
    label(c, 'v_D (V)', ox + pw, oy + 18, { size: 11, color: p.text2, align: 'right' });
    label(c, 'i_D', ox - 8, oy - ph - 4, { size: 11, color: p.text2, align: 'right' });

    // المنحنى
    c.beginPath();
    c.strokeStyle = p.water; c.lineWidth = 2.2;
    for (let vv = -30; vv <= 1.5; vv += 0.3) {
      const ii = Math.min(curveCurrent(mat, vv), iMax);
      const x = xOf(vv), y = yOf(Math.max(ii, iMin));
      vv === -30 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.stroke();

    // خط الركبة المرجعي
    c.strokeStyle = withAlpha(p.amber, 0.5); c.setLineDash([4, 4]);
    c.beginPath(); c.moveTo(xOf(mat.knee), oy - ph); c.lineTo(xOf(mat.knee), oy); c.stroke();
    c.setLineDash([]);
    label(c, `ركبة ${mat.name}: ${mat.knee} V`, xOf(mat.knee), oy - ph - 12, { size: 11.5, color: p.amber, align: 'center' });

    // نقطة الجهد الحالي
    const px = xOf(v), py = yOf(Math.max(Math.min(iNow, iMax), iMin));
    c.fillStyle = pulse > 0 ? p.ok : p.badge;
    c.beginPath(); c.arc(px, py, 5.5, 0, Math.PI * 2); c.fill();
    arrow(c, px, oy + 22, px, oy, { color: p.badge, width: 1.6 });

    label(c, `Si: ${knee.Si ? '✓' : '…'}   Ge: ${knee.Ge ? '✓' : '…'}`, ox + 6, oy - ph + 16, { size: 11.5, color: p.text2, align: 'left' });

    const key = `c|${curveMatIdx}|${v}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'المادة', value: mat.name, color: p.water },
        { label: 'v_D', value: `${v.toFixed(1)} V`, color: p.amber },
        { label: 'i_D', value: `${(iNow * 1000).toFixed(3)} mA`, color: p.ok },
      ]);
    }
  }

  function drawZener(c, W, H, p) {
    const Rs = rsZenerSl.value, RL = rlSl.value, Vin = vinSl.value;
    const Itotal = (Vin - VZ) / Rs;
    const Irl = VZ / RL;
    let Iz = Itotal - Irl, VL;
    if (Iz >= 0.001) { VL = VZ; }
    else { VL = Vin * RL / (RL + Rs); Iz = 0; }

    // إبطال القراءتين القديمتين إن تغيّر توقيع التصميم (Rs أو RL) كي لا تُنجَز m3 بقراءات موروثة من تصميم سابق
    const sig = `${Rs}|${RL}`;
    if (zen.sig !== sig) { zen.sig = sig; zen.atMin = null; zen.atMax = null; }

    if (Math.abs(Vin - 15) <= 0.5) zen.atMin = VL;
    if (Math.abs(Vin - 25) <= 0.5) zen.atMax = VL;
    if (zen.atMin != null && zen.atMax != null &&
        Math.abs(zen.atMin - 12) <= 0.2 && Math.abs(zen.atMax - 12) <= 0.2) complete('m3');

    // ===== مخطط الدائرة =====
    const y = H * 0.42, x0 = 50, x1 = W * 0.42, x2 = W - 60;
    c.strokeStyle = withAlpha(p.text, 0.6); c.lineWidth = 2;
    // خط المصدر إلى المقاومة
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x1 - 40, y); c.stroke();
    zigzag(c, x1 - 40, y, x1, p.amber);
    c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke();
    // الزينر (مثلث + خط مكسور) بين x1 والأرضي
    const zy0 = y, zy1 = H * 0.78;
    c.beginPath(); c.moveTo(x1, zy0); c.lineTo(x1, zy0 + 14); c.stroke();
    c.fillStyle = Iz > 0 ? p.ok : p.bad;
    c.beginPath();
    c.moveTo(x1 - 12, zy0 + 14); c.lineTo(x1 + 12, zy0 + 14); c.lineTo(x1, zy0 + 34); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x1, zy0 + 34); c.lineTo(x1, zy1); c.stroke();
    // الحمل RL يمين الزينر
    c.beginPath(); c.moveTo(x2, y); c.lineTo(x2, zy0 + 14); c.stroke();
    c.strokeRect(x2 - 12, zy0 + 14, 24, 26);
    c.beginPath(); c.moveTo(x2, zy0 + 40); c.lineTo(x2, zy1); c.stroke();
    // خط الأرضي المشترك
    c.beginPath(); c.moveTo(x1, zy1); c.lineTo(x2, zy1); c.stroke();
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x0, zy1); c.lineTo(x1, zy1); c.stroke();

    label(c, `Vin = ${Vin.toFixed(1)} V`, x0, y - 16, { size: 12.5, color: p.water, align: 'left' });
    label(c, `Rs = ${Math.round(Rs)} Ω`, (x1 - 40 + x1) / 2, y - 14, { size: 11.5, color: p.amber, align: 'center' });
    label(c, `Zener 12V`, x1 - 16, zy0 + 24, { size: 11, color: p.text2, align: 'right' });
    label(c, `RL = ${Math.round(RL)} Ω`, x2 + 10, zy0 + 27, { size: 11.5, color: p.badge, align: 'left' });
    label(c, `Iz = ${(Iz * 1000).toFixed(2)} mA`, W / 2, H * 0.9, { size: 12.5, color: Iz > 0 ? p.ok : p.bad, align: 'center' });
    label(c, `V_L = ${VL.toFixed(2)} V`, W / 2, H * 0.9 + 20, { size: 13, color: pulse > 0 ? p.ok : p.text, align: 'center', weight: 800 });

    const statusMin = zen.atMin != null ? `${zen.atMin.toFixed(2)}V@15` : '—';
    const statusMax = zen.atMax != null ? `${zen.atMax.toFixed(2)}V@25` : '—';
    label(c, `أطراف الفحص: ${statusMin}  |  ${statusMax}`, W / 2, H * 0.9 + 40, { size: 11, color: p.text2, align: 'center' });

    const key = `z|${Rs}|${RL}|${Vin}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'Vin', value: `${Vin.toFixed(1)} V`, color: p.water },
        { label: 'Iz', value: `${(Iz * 1000).toFixed(2)} mA`, color: Iz > 0 ? p.ok : p.bad },
        { label: 'V_L', value: `${VL.toFixed(2)} V`, color: p.amber },
      ]);
    }
  }

  function drawLed(c, W, H, p) {
    const mat = LED_MATS[ledMatIdx];
    const Rs = rsLedSl.value;
    const I = (VS_LED - mat.vf) / Rs;

    if (mat === LEDM && Rs >= 475 && Rs <= 525) { complete('m4'); ledDone = true; }
    if (mat === SID && Rs >= 1073.5 && Rs <= 1186.5) { complete('m5'); sidDone = true; }

    // ===== مخطط الدائرة =====
    const y = H * 0.5, x0 = 60, x1 = W * 0.5, x2 = W - 70;
    c.strokeStyle = withAlpha(p.text, 0.6); c.lineWidth = 2;
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x1 - 45, y); c.stroke();
    zigzag(c, x1 - 45, y, x1, p.amber);
    c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke();

    // رمز العنصر (LED دائرة مضيئة / دايود مثلث)
    const glow = mat === LEDM ? Math.min(1, I * 30) : 0;
    if (mat === LEDM) {
      c.fillStyle = withAlpha(p.bad, 0.25 + glow * 0.5);
      c.beginPath(); c.arc(x2, y, 16 + glow * 4, 0, Math.PI * 2); c.fill();
    }
    c.fillStyle = withAlpha(p.text, 0.85);
    c.beginPath();
    c.moveTo(x2 - 14, y - 12); c.lineTo(x2 - 14, y + 12); c.lineTo(x2 + 10, y); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x2 + 10, y - 12); c.lineTo(x2 + 10, y + 12); c.stroke();

    c.beginPath(); c.moveTo(x0, y); c.lineTo(x0, H * 0.75); c.lineTo(x2 + 10, H * 0.75); c.lineTo(x2 + 10, y); c.stroke();

    label(c, 'مصدر 12V', x0, y - 18, { size: 12.5, color: p.water, align: 'left' });
    label(c, `Rs = ${Math.round(Rs)} Ω`, (x1 - 45 + x1) / 2, y - 14, { size: 11.5, color: p.amber, align: 'center' });
    label(c, mat.name, x2, y - 26, { size: 12, color: p.text2, align: 'center' });
    label(c, `I = ${(I * 1000).toFixed(2)} mA`, W / 2, H * 0.88, { size: 13, color: pulse > 0 ? p.ok : p.text, align: 'center', weight: 800 });

    const target = mat === LEDM ? '20 mA' : '10 mA';
    const near = mat === LEDM ? (Rs >= 475 && Rs <= 525) : (Rs >= 1073.5 && Rs <= 1186.5);
    label(c, `الهدف: ${target}  ${near ? '✓' : ''}`, W / 2, H * 0.88 + 20, { size: 11.5, color: near ? p.ok : p.text2, align: 'center' });

    const key = `l|${ledMatIdx}|${Rs}`;
    if (key !== lastKey) {
      lastKey = key;
      read.set([
        { label: 'المادة', value: mat.name, color: p.water },
        { label: 'Rs', value: `${Math.round(Rs)} Ω`, color: p.amber },
        { label: 'I', value: `${(I * 1000).toFixed(2)} mA`, color: p.ok },
      ]);
    }
  }

  return { destroy() { kit.destroy(); } };
}

// مقاومة بشكل متعرّج بسيط بين نقطتين أفقيتين
function zigzag(c, x0, y, x1, color) {
  const n = 6, dx = (x1 - x0) / n;
  c.strokeStyle = color; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x0, y);
  for (let i = 0; i < n; i++) {
    const xm = x0 + dx * (i + 0.5);
    c.lineTo(xm, y + (i % 2 === 0 ? -7 : 7));
  }
  c.lineTo(x1, y);
  c.stroke();
}
