export function addThousandSep(num: number | string) {
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
