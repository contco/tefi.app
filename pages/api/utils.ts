export const FCD_URL = "https://fcd.terra.dev/v1/";
export const LCD_URL = "https://lcd.terra.dev/";

export const getLatestBlockHeight = async () => {
    const response = await fetch('https://lcd.terra.dev/blocks/latest');
    const block = await response.json();
    return block.block.header.height;
};


export const getLpValue = (liquidityInfo: any, price: number) => {
    const totalShares = parseFloat(liquidityInfo.total_share);
    const ustReserve = parseFloat(liquidityInfo?.assets[0]?.info?.native_token ? liquidityInfo?.assets[0]?.amount : liquidityInfo?.assets[1]?.amount);
    const tokenReserve = parseFloat(liquidityInfo?.assets[0]?.info?.native_token ? liquidityInfo?.assets[1]?.amount : liquidityInfo?.assets[0]?.amount);
    const totalLpValue = (tokenReserve * price) + ustReserve;
    const lpValue = totalLpValue / totalShares;
    return lpValue;
};