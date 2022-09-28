export const toDateString = (date) => {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  m = m < 10 ? '0' + m : m;
  d = d < 10 ? '0' + d : d;
  return `${y}-${m}-${d}`;
}

export const toTimeString = (date) => {
  let h = date.getHours();
  let m = date.getMinutes();
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return `${h}:${m}`;
}