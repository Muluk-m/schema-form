/* eslint-disable no-restricted-globals */
function getGlobalThis() {
  try {
    if (typeof self !== 'undefined') {
      return self;
    }
  } catch {
    //
  }
  try {
    if (typeof globalThisPolyfill !== 'undefined') {
      return globalThisPolyfill;
    }
  } catch {
    //
  }
  try {
    if (typeof global !== 'undefined') {
      return global;
    }
  } catch {
    //
  }
  // eslint-disable-next-line no-new-func
  return Function('return this')();
}
export const globalThisPolyfill: Window = getGlobalThis();
