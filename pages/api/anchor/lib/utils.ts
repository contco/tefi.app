export const getLatestBlockHeight = async () => {
  const response = await fetch('https://lcd.terra.dev/blocks/latest');
  const block = await response.json();
  return block.block.header.height;
};
