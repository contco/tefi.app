export const convertToFloatValue = (value: string) => {
    const floatValue = parseFloat(value);
    if(floatValue <= 0.001) {
      return floatValue.toFixed(8);
    }
    else {
      return floatValue.toFixed(3);
    }
 }