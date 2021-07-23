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

//Borrowing
export const BorrowingTitle = ['Collateral Value', 'Borrowed Value', 'Net APR'];

//Pools
export const PoolsTitle = ['Name', 'Balance', 'Value'];

//Rewards
export const RewardsTitle = ['Name', 'Staked', 'APR', 'Reward'];

//Earn
export const EarnTitle = ['Total Deposit', 'APY'];

//LocalStorage

export const ADDRESS_KEY = 'address';
export const LOCAL_ADDRESS_TYPE = 'local';
export const WALLET_ADDRESS_TYPE = 'wallet';


export enum WalletConnectType {
  Extension,
  Mobile
}

export const TEFI_PREVIEW_IMAGE = "https://storage.googleapis.com/tefi-app/tefi-preview.png";