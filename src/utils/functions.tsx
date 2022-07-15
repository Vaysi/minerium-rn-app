export function addThousandSep(num: number | string | any) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function hashToE(num: number) {
  return num / 1000000000000000000;
}

export function hasJsonStructure(str: any) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
}

export function humanize(x: number, fixed = 8) {
  return x && x.toFixed(fixed).replace(/\.?0*$/, '');
}

export function hasUpper(str: string) {
  return /[A-Z]/g.test(str);
}

export function hasLower(str: string) {
  return /[a-z]/g.test(str);
}

export function msToHMS(ms: number) {
  let seconds = ms / 1000;
  seconds = seconds % 3600;
  const minutes = seconds / 60;
  seconds = seconds % 60;
  return minutes.toFixed(0) + ':' + seconds.toFixed(0);
}
