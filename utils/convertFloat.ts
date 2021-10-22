export const convertToFloatValue = (value: string) => {
  const numberFormat = (value) => new Intl.NumberFormat().format(value);
  const floatValue = parseFloat(value);
  if (floatValue === 0) {
    return 0;
  } else if (Math.abs(floatValue) <= 0.001) {
    return floatValue.toFixed(8);
  } else {
    return numberFormat(floatValue.toFixed(3));
  }
};
