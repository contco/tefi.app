export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';
export const TERRA_TEST_NET = { URL: 'https://tequila-lcd.terra.dev', chainID: 'tequila-0004' };
export const TERRA_MAIN_NET = { URL: 'https://lcd.terra.dev', chainID: 'columbus-4' };

//temp
export const IS_TEST = false;

//MarketValue
export const MarketTitles = ['Total Market Value', 'Total Assets', 'Total Borrowing', 'Total Rewards'];

//Assets
export const AssetsTitle = ['Ticker', 'Name', 'Balance', 'Price', 'Value'];

//Anchor Borrowing
export const BorrowingTitle = ['Collateral Value', 'Borrowed Value', 'Net APR'];

//Pools
export const PoolsTitle = ['Name', 'Staked', 'Stakeable', 'Value'];

//Rewards
export const RewardsTitle = ['Name', 'Staked', 'APR', 'Reward'];

//Earn
export const EarnTitle = ['Total Deposit', 'APY'];

//Mirror Borrowing
export const MirrorBorrowTitle = ['Name', 'Price', 'Borrowed', 'Collateral', 'Collateral Ratio'];

//Short Farms
export const ShortTitle = ['Name', 'Shorted', 'Locked UST', 'Unlocked UST', 'Reward'];

//LocalStorage

export const ADDRESS_KEY = 'address';
export const LOCAL_ADDRESS_TYPE = 'local';
export const WALLET_ADDRESS_TYPE = 'wallet';

export enum WalletConnectType {
  Extension,
  Mobile,
}

export const TEFI_PREVIEW_IMAGE = 'https://storage.googleapis.com/tefi-app/tefi-preview.png';

const BASE_URL = `https://storage.googleapis.com/tefi-app`;

export const ICON_ANC_URL = `${BASE_URL}/ANC.png`;
export const ICON_LUNA_URL = `${BASE_URL}/Luna.png`;
export const ICON_LOTA_URL = `${BASE_URL}/LOTA.png`;
export const ICON_MINE_URL = `${BASE_URL}/MINE.png`;
export const ICON_MIR_URL = `${BASE_URL}/MIR.svg`;
export const ICON_SPEC_URL = `${BASE_URL}/Luna.png`;
