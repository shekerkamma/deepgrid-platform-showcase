// The figure gate on its own (also re-exported by brief-kit.mjs), so build checks can use it without the model client.
// A figure is supported when the source states it, allowing a stated rounding (1,128.45 as 1,128) and a fraction
// written as a percentage (0.88 as 88%). Small integers (1 to 12) are not checked: they are counts and ordinals.
export const nums = s => (s.match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => x.replace(/,/g, ''));
const decimals = x => (x.split('.')[1] || '').length;
export function supported(figure, sourceText) {
  const f = parseFloat(figure);
  if (!Number.isFinite(f) || (Number.isInteger(f) && f <= 12 && !figure.includes('.'))) return true;
  // a year is supported when the source names it in either form: 2027 or FY27
  if (Number.isInteger(f) && f >= 2000 && f <= 2040 && new RegExp(`(?:\\b|FY)${f}\\b|\\bFY${String(f).slice(2)}\\b`, 'i').test(sourceText)) return true;
  return nums(sourceText).some(x => {
    const v = parseFloat(x);
    if (!Number.isFinite(v)) return false;
    if (x === figure || v === f) return true;
    const d = decimals(figure);
    if (Math.abs(Number(v.toFixed(d)) - f) < 1e-9) return true;
    if (v < 1.5 && Math.abs(Number((v * 100).toFixed(d)) - f) < 1e-9) return true;
    return false;
  });
}
