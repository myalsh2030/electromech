// مصنع المغناطيس والحث بالحركة: ملف حلزوني بقلب قابل للتبديل (كهرومغناطيس)
// + نفس الملف يستقبل مغناطيسًا متحركًا (حث بالحركة وقانون لينز)
// ملاحظة للعقد: الألوان كلها من kit.pal حصرًا — بلا hex صلب هنا.
import { SimKit, label, arrow, withAlpha } from './simkit.js';

const CORE_FACTOR = 6;      // مضاعف شدة المجال عند التحول من هواء إلى حديد (>5× كما يشترط m2)
const FLUX_K = 0.001;       // ثابت تناسب: e = N · FLUX_K · v  (يمثّل N·dΦ/dt)
const DWELL_MS = 450;       // زمن الثبات المطلوب لاعتماد قراءة كمرجع

export function mount(container, ctx) {
  const kit = new SimKit(container, { ratio: 0.66 });
  const read = kit.readout();

  let mode = 'A';           // A: كهرومغناطيس | B: الحث بالحركة
  let core = 'air';         // air | iron
  let pulse = 0;
  let pos = -1;             // موضع المغناطيس البصري (تذبذب بصري فقط)
  const done = new Set();

  const complete = id => {
    if (done.has(id) || ctx.isMissionDone?.(id)) return;
    done.add(id);
    pulse = 1;
    ctx.completeMission(id);
  };

  // ===== حالة المهام =====
  let sawLowN = false;      // m1: زار N منخفضًا عند I≈2A
  let sawPos = false, sawNeg = false; // m5
  // مرجع الثبات (dwell) لِـ m3/m4
  let dwellStartT = 0, dwellN = null, dwellV = null, locked = false;
  let lastLocked = null;    // {N, v, e}

  // ===== أزرار الوضع =====
  const modeBtns = kit.buttons([
    { label: '⚡ كهرومغناطيس', onclick: () => { mode = 'A'; syncVis(); } },
    { label: '📌 الحث بالحركة', onclick: () => { mode = 'B'; syncVis(); } },
  ]);
  const paintMode = () => modeBtns.forEach((b, i) => { b.className = `btn sm ${(i === 0) === (mode === 'A') ? '' : 'secondary'}`; });

  // ===== أزرار القلب (لوضع الكهرومغناطيس) =====
  let lastAirRaw = 0; // آخر شدة مجال مسجّلة عند القلب الهوائي بنفس N,I — لإثبات m2
  const coreBtns = kit.buttons([
    { label: 'قلب هوائي', onclick: () => { core = 'air'; paintCore(); } },
    {
      label: 'قلب حديدي', onclick: () => {
        core = 'iron'; paintCore();
        const ratio = lastAirRaw > 0 ? (N.value * I.value * CORE_FACTOR) / lastAirRaw : CORE_FACTOR;
        if (ratio > 5) complete('m2');
      },
    },
  ]);
  const paintCore = () => coreBtns.forEach((b, i) => { b.className = `btn sm ${(i === 0) === (core === 'air') ? '' : 'secondary'}`; });
  paintMode(); paintCore();

  // ===== المنزلقات =====
  const N = kit.slider({ label: 'عدد لفات الملف N', min: 50, max: 1000, step: 10, value: 200, fmt: v => Math.round(v) });
  const I = kit.slider({ label: 'التيار I (كهرومغناطيس)', min: 0.1, max: 5, step: 0.1, value: 1, unit: 'A', fmt: v => v.toFixed(1) });
  const V = kit.slider({ label: 'سرعة المغناطيس v (+يمين / −يسار)', min: -5, max: 5, step: 0.1, value: 0, unit: 'm/s', fmt: v => v.toFixed(1) });

  const rowOf = s => s.input.closest('.sim-row');
  const iRow = rowOf(I), vRow = rowOf(V);
  const coreRow = coreBtns[0].parentElement;

  function syncVis() {
    iRow.style.display = mode === 'A' ? '' : 'none';
    coreRow.style.display = mode === 'A' ? '' : 'none';
    vRow.style.display = mode === 'B' ? '' : 'none';
    paintMode();
  }
  syncVis();

  kit.loop((c, dt, t) => {
    const W = kit.W, H = kit.H;
    const n = N.value, i = I.value, v = V.value;

    // ===== فيزياء الكهرومغناطيس =====
    const raw = n * i * (core === 'iron' ? CORE_FACTOR : 1); // شدة مجال نسبية (وحدات اعتباطية)
    if (core === 'air') lastAirRaw = n * i; // مرجع للمقارنة عند التحول لاحقًا
    // التطبيع حسب القلب الحالي (لا حسب أقصى القلب الحديدي دائمًا)، وإلا يُسحق مدى الهواء
    // إلى أقل من 17% من الشريط فيصبح دليل m1 البصري (رفع المشابك تدريجيًا) غير مرئي.
    const fieldPct = Math.min(1, raw / (1000 * 5 * (core === 'iron' ? CORE_FACTOR : 1)));
    const clips = Math.min(8, Math.round(fieldPct * 8));

    // m1: رفع N من أدنى إلى أقصى عند I≈2A → مشابك متزايدة رتابةً (مضمونة رياضيًا: raw تصاعدية في N)
    if (n <= 60 && Math.abs(i - 2) <= 0.15) sawLowN = true;
    if (sawLowN && n >= 990 && Math.abs(i - 2) <= 0.15) complete('m1');

    // ===== فيزياء الحث بالحركة =====
    const e = n * FLUX_K * v; // e = N·dΦ/dt (نموذج مبسّط: dΦ/dt ∝ v)
    // موضع المغناطيس البصري: حركة أحادية الاتجاه تتبع إشارة v فعليًا (لا تذبذب جيبي
    // يعكس اتجاهه الظاهري مرتين في كل دورة بصرف النظر عن إشارة v)، مع لفّ دوري
    // بين طرفي المسار [-1, 1] كي يبقى ضمن اللوحة.
    pos += v * dt * 0.18;
    if (pos > 1) pos -= 2;
    if (pos < -1) pos += 2;
    if (v >= 1) sawPos = true;
    if (v <= -1) sawNeg = true;
    if (sawPos && sawNeg) complete('m5');

    // m3: بلوغ ق.د.ك هدف = 3.2V ±5% (تحقّق N=800,v=4 → e=3.2 مضبوط ضمن المديات)
    const target = 3.2, tol = target * 0.05;
    const inTarget = Math.abs(e - target) < tol;

    // منطق الثبات (dwell) — مستقل بطوابع performance.now لِـ m3 و m4
    const now = performance.now();
    const changed = dwellN === null || Math.abs(dwellN - n) > 0.01 || Math.abs(dwellV - v) > 0.01;
    if (changed) { dwellN = n; dwellV = v; dwellStartT = now; locked = false; }
    const stableFor = now - dwellStartT;
    if (mode === 'B' && !locked && stableFor >= DWELL_MS) {
      locked = true;
      if (inTarget) complete('m3');
      // m4: ضاعف N عند ثبات v وأثبت مضاعفة e (نسبة 2.0±0.05)
      if (lastLocked && Math.abs(lastLocked.v - v) < 0.1 && Math.abs(v) >= 0.5) {
        const ratioN = n / lastLocked.N;
        const ratioE = Math.abs(lastLocked.e) > 1e-6 ? e / lastLocked.e : 0;
        if (ratioN > 1.9 && ratioN < 2.1 && Math.abs(ratioE - 2) < 0.05) complete('m4');
      }
      lastLocked = { N: n, v, e };
    }

    // ===== الرسم =====
    if (mode === 'A') drawElectromagnet(c, W, H, kit.pal, n, i, core, clips, fieldPct, pulse, t);
    else drawInduction(c, W, H, kit.pal, n, v, e, target, tol, pulse, t, pos);

    if (pulse > 0) pulse = Math.max(0, pulse - dt * 1.4);

    // ===== القراءات =====
    if (mode === 'A') {
      read.set([
        { label: 'شدة المجال النسبية', value: `${Math.round(fieldPct * 100)}%`, color: kit.pal.amber },
        { label: 'القلب', value: core === 'iron' ? 'حديد' : 'هواء', color: kit.pal.badge },
        { label: 'مشابك مرفوعة', value: `${clips}`, color: kit.pal.ok },
      ]);
    } else {
      read.set([
        { label: 'e الحثية', value: `${e.toFixed(2)} V`, color: inTarget ? kit.pal.ok : kit.pal.amber },
        { label: 'الهدف', value: `${target.toFixed(1)} V ±5%`, color: kit.pal.text2 },
        { label: 'الاتجاه', value: v > 0.05 ? 'يمين ⟶' : v < -0.05 ? '⟵ يسار' : 'ساكن', color: kit.pal.badge },
      ]);
    }
  });

  return { destroy() { kit.destroy(); } };
}

// ===== رسم وضع الكهرومغناطيس =====
function drawElectromagnet(c, W, H, pal, n, i, core, clips, fieldPct, pulse, t) {
  const cx = W * 0.38, cy = H * 0.5;
  const coilW = Math.min(W * 0.34, 160), coilH = Math.min(H * 0.5, 150);
  const loops = Math.max(4, Math.min(12, Math.round(n / 100)));

  // خطوط المجال (بيضوية حول الملف — أكثف مع الحديد)
  const lineCount = core === 'iron' ? 5 : 3;
  for (let k = 1; k <= lineCount; k++) {
    const ex = coilW / 2 + k * (core === 'iron' ? 16 : 20);
    const ey = coilH / 2 + k * (core === 'iron' ? 10 : 14);
    c.save();
    c.strokeStyle = withAlpha(pal.amber, 0.55 - k * 0.07);
    c.lineWidth = 1.4;
    c.setLineDash([5, 5]);
    c.beginPath();
    c.ellipse(cx, cy, ex, ey, 0, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  // قلب الملف
  c.fillStyle = core === 'iron' ? withAlpha(pal.text2, 0.55) : withAlpha(pal.text2, 0.12);
  c.fillRect(cx - coilW / 2, cy - coilH / 2 + 6, coilW, coilH - 12);

  // لفات الملف
  c.strokeStyle = withAlpha(pal.water, pulse > 0 ? 0.95 : 0.8);
  c.lineWidth = pulse > 0 ? 3 : 2.2;
  for (let k = 0; k < loops; k++) {
    const x = cx - coilW / 2 + (k + 0.5) * (coilW / loops);
    c.beginPath();
    c.ellipse(x, cy, coilW / loops * 0.42, coilH / 2, 0, 0, Math.PI * 2);
    c.stroke();
  }

  label(c, `N = ${Math.round(n)} لفة`, cx, cy - coilH / 2 - 16, { size: 12.5, color: pal.water, align: 'center' });
  label(c, `I = ${i.toFixed(1)} A`, cx, cy + coilH / 2 + 18, { size: 12.5, color: pal.amber, align: 'center' });
  label(c, core === 'iron' ? 'القلب: حديد' : 'القلب: هواء', cx, cy + coilH / 2 + 36, { size: 11.5, color: pal.text2, align: 'center' });

  // مقياس شدة المجال
  const gx = W * 0.7, gy0 = H * 0.24, gh = H * 0.5, gw = 22;
  c.strokeStyle = withAlpha(pal.line, 1);
  c.strokeRect(gx, gy0, gw, gh);
  c.fillStyle = pal.amber;
  const fh = gh * fieldPct;
  c.fillRect(gx, gy0 + gh - fh, gw, fh);
  label(c, 'شدة المجال', gx + gw / 2, gy0 - 12, { size: 11.5, color: pal.text2, align: 'center' });

  // مشابك مرفوعة أسفل قطب الملف
  const clipX = gx + gw + 46;
  label(c, 'المشابك المرفوعة', clipX, gy0 - 12, { size: 11.5, color: pal.text2, align: 'center' });
  for (let k = 0; k < 8; k++) {
    const lifted = k < clips;
    const cy2 = gy0 + gh - 10 - (lifted ? k * 13 : 0);
    c.fillStyle = lifted ? withAlpha(pal.ok, 0.9) : withAlpha(pal.text2, 0.25);
    c.beginPath();
    c.ellipse(clipX, lifted ? cy2 : gy0 + gh - 10, 9, 4, 0, 0, Math.PI * 2);
    c.fill();
  }

  if (pulse > 0) label(c, '✓ إنجاز!', W / 2, 16, { size: 13, color: pal.ok, align: 'center' });
}

// ===== رسم وضع الحث بالحركة =====
function drawInduction(c, W, H, pal, n, v, e, target, tol, pulse, t, pos) {
  const cx = W * 0.4, cy = H * 0.42;
  const coilW = Math.min(W * 0.3, 130), coilH = Math.min(H * 0.42, 120);
  const loops = Math.max(4, Math.min(10, Math.round(n / 120)));

  // مسار حركة المغناطيس (خط متقطع)
  c.strokeStyle = withAlpha(pal.text2, 0.3);
  c.setLineDash([4, 6]);
  c.beginPath(); c.moveTo(cx - coilW, cy); c.lineTo(cx + coilW, cy); c.stroke();
  c.setLineDash([]);

  // لفات الملف
  c.strokeStyle = withAlpha(pal.water, 0.8);
  c.lineWidth = 2.2;
  for (let k = 0; k < loops; k++) {
    const x = cx - coilW / 2 + (k + 0.5) * (coilW / loops);
    c.beginPath();
    c.ellipse(x, cy, coilW / loops * 0.42, coilH / 2, 0, 0, Math.PI * 2);
    c.stroke();
  }

  // المغناطيس المتحرك: موضع أحادي الاتجاه يتبع pos (متسق دائمًا مع إشارة v الفعلية)
  const mx = cx + pos * (coilW * 0.7);
  const barW = 70, barH = 26;
  c.save();
  c.translate(mx, cy);
  c.fillStyle = pal.bad;
  c.fillRect(-barW / 2, -barH / 2, barW / 2, barH);
  c.fillStyle = pal.water;
  c.fillRect(0, -barH / 2, barW / 2, barH);
  c.strokeStyle = withAlpha(pal.text, 0.6);
  c.strokeRect(-barW / 2, -barH / 2, barW, barH);
  label(c, 'N', -barW / 4, 0, { size: 12, color: pal.text, align: 'center' });
  label(c, 'S', barW / 4, 0, { size: 12, color: pal.text, align: 'center' });
  c.restore();

  // سهم السرعة
  if (Math.abs(v) > 0.05) {
    const ax = mx, ay = cy - barH / 2 - 14;
    arrow(c, ax, ay, ax + Math.sign(v) * 26, ay, { color: pal.amber });
  }

  label(c, `N = ${Math.round(n)} لفة`, cx, cy - coilH / 2 - 16, { size: 12.5, color: pal.water, align: 'center' });

  // جلفانومتر
  const gx = W * 0.78, gy = H * 0.34, gr = Math.min(W, H) * 0.14;
  c.strokeStyle = withAlpha(pal.text2, 0.6);
  c.beginPath(); c.arc(gx, gy, gr, Math.PI, 0); c.stroke();
  label(c, 'الجلفانومتر', gx, gy + 16, { size: 11.5, color: pal.text2, align: 'center' });
  const eMax = 6;
  const ang = Math.PI - (Math.PI / 2 + Math.max(-1, Math.min(1, e / eMax)) * (Math.PI / 2 - 0.12));
  const needleColor = Math.abs(e - target) < tol ? pal.ok : pal.badge;
  c.strokeStyle = needleColor;
  c.lineWidth = 3;
  c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(ang) * gr * 0.85, gy - Math.sin(ang) * gr * 0.85); c.stroke();
  c.fillStyle = needleColor;
  c.beginPath(); c.arc(gx, gy, 3.5, 0, Math.PI * 2); c.fill();

  label(c, `e = ${e.toFixed(2)} V`, gx, gy - gr - 16, { size: 13, color: needleColor, align: 'center' });

  if (Math.abs(e - target) < tol) label(c, `✓ ضمن الهدف ${target.toFixed(1)}V ±5%`, W / 2, 16, { size: 12.5, color: pal.ok, align: 'center' });
  if (pulse > 0) label(c, '✓ إنجاز!', W / 2, H - 12, { size: 13, color: pal.ok, align: 'center' });
}
