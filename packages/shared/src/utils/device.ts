/**
 * getDeviceType() // 'android' | 'ios' | 'pc'
 */
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
  const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  // eslint-disable-next-line no-nested-ternary
  return isAndroid ? 'android' : isIOS ? 'ios' : 'pc';
};
