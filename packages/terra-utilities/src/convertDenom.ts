import { MICRO } from "./constants";

export const convertDenomToValue = (denom: string | number ) => {
    const denomToConvert = typeof denom === "string" ? parseFloat(denom) : denom;
    const value = denomToConvert / MICRO;
    return value;
}

export const convertIntoDenom = (amount: string | number) => {
    const amountToConvert = typeof amount === "string" ? parseFloat(amount) : amount;
    const denom = amountToConvert * MICRO;
    return denom;
}