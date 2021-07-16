export const FCD_URL = "https://fcd.terra.dev/v1/";
export const LCD_URL="https://lcd.terra.dev/";

export const getLatestBlockHeight = async () => {
    const response = await fetch('https://lcd.terra.dev/blocks/latest');
    const block = await response.json();
    return block.block.header.height;
  };
  