export const formatDate = (date, reg = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return date;
  const time = new Date(date);
  const f = {
    Y: time.getFullYear(),
    M: time.getMonth() + 1,
    D: time.getDate(),
    H: time.getHours(),
    h: time.getHours(),
    m: time.getMinutes(),
    s: time.getSeconds(),
  };

  const result = reg.replace(/([YMDHhms])+/g, (match, cur) => {
    const date = String(f[cur]);
    return match.length - date.length < 0 ? `0${date}` : date;
  });

  return result;
};
