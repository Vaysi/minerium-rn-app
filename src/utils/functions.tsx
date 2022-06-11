export function addThousandSep(num: number | string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function hashToE(num: number) {
  return num / 1000000000000000000;
}
