/* eslint-disable id-denylist */
import BN from "bignumber.js"

const sum = (array: any): string => array.length ? BN.sum.apply(null, array.filter(isFinite)).toString() : "0";
const plus = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).plus(b || 0).toString()
const div = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).div(b || 1).toString();
const gt = (a: BN.Value, b: BN.Value): boolean => new BN(a).gt(b);
const times = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).times(b || 0).toString();
const floor = (n: BN.Value): string => new BN(n).integerValue(BN.ROUND_FLOOR).toString();
const ceil = (n: BN.Value): string => new BN(n).integerValue(BN.ROUND_CEIL).toString();
const minus = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).minus(b || 0).toString();
const decimal = (number = '0', decimals = 6): string => new BN(number).decimalPlaces(decimals, BN.ROUND_DOWN).toFormat(decimals);
const toAmount = (
    amount: string,
    decimals = 6,
  ): string => {
    const bnAmount = new BN(amount || 0).div(new BN(10).pow(decimals))
    return decimal(bnAmount.toString(), decimals)
}

export const math = {
    sum,
    plus,
    div,
    gt,
    times, 
    floor,
    ceil,
    minus,
    decimal,
    toAmount,
}
