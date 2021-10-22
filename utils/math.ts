import BN from 'bignumber.js';

export const sum = (array: BN.Value[]): string =>
  array.length ? BN.sum.apply(null, array.filter(isFinite)).toString() : '0';
export const plus = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).plus(b || 0).toString();
export const div = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).div(b || 1).toString();
export const gt = (a: BN.Value, b: BN.Value): boolean => new BN(a).gt(b);
export const times = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).times(b || 0).toString();
export const floor = (n: BN.Value): string => new BN(n).integerValue(BN.ROUND_FLOOR).toString();
export const ceil = (n: BN.Value): string => new BN(n).integerValue(BN.ROUND_CEIL).toString();
export const minus = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).minus(b || 0).toString();
export const decimal = (number = '0', decimals = 6): string =>
  new BN(number).decimalPlaces(decimals, BN.ROUND_DOWN).toFormat(decimals);
export const toAmount = (amount: string, decimals = 6): string => {
  const number = new BN(amount || 0).div(new BN(10).pow(decimals));
  return decimal(number.toString(), decimals);
};
