export const keepTwoDecimalStr = (num) => {
  const result = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/));
  let s = result.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};