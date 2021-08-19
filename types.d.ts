interface Holdings {
  symbol: string;
  value: string;
  balance: string;
  price: string;
  name: string;
}

interface Gov {
  name: string
  symbol: string
  staked: string
  value: string
  rewards: string
  rewardsValue?: string
  price: string
  apr?: string
  apy?: string;
}

interface Pool {
  symbol1: string;
  symbol2: string;
  lpName: string;
  stakedLpUstValue: string;
  stakeableLpUstValue: string;
  totalLpUstValue: string;
  token1Staked: string;
  token1UnStaked: string;
  token2Staked: string;
  token2UnStaked: string;
  stakedLp: string;
  stakeableLp: string;
  rewards?: string;
  rewardsValue?: string;
  rewardsSymbol?: string;
  apy?: string;
  apr?: string;
}

interface Coin extends Holdings {
  __typename?: "Coin";
}

interface Core {
  __typename?: 'Core';
  coins: Coin[];
  staking: LunaStaking[];
  total: CoreTotal;
}

interface LunaStaking {
  balance: string;
  rewards: string;
  stakedValue: string;
  rewardsValue: string;
  totalValue: string;
  validator: string;
  state: string;
}

interface CoreTotal {
  assetsSum: string;
  stakedSum: string;
  unstakedSum: string;
}

interface Reward {
  __typename?: 'Reward';
  name?: string;
  staked?: string;
  apy?: string;
  reward?: string;
}

interface Airdrops {
  __typename?: string;
  value: string;
  quantity: string;
  round?: number;
  name: string;
  symbol: string;
  proof: string | string[];
  contract: string
}

interface UserCollateral {
  __typename?: 'UserCollateral';
  collateral?: string;
  balance?: string;
  price?: string;
  value?:string;
  symbol:string;
}

interface BorrowData {
  __typename?: 'BorrowData';
  reward?: Reward;
  limit: string;
  value?: string;
  collaterals: Array<UserCollateral>;
  totalCollateralValue:string;
  percentage: string;
  lunaprice: string;
  ancprice: string;
  netApy: string;
}

interface EarnData {
  __typename?: 'EarnData';
  reward?: Reward;
}

interface Total {
  __typename?: 'Total';
  airdropSum: string;
  anchorPoolSum: string;
  anchorRewardsSum: string;
  anchorHoldingsSum: string;
}

interface AccountAnc {
  __typename?: 'AccountANC';
  assets?: Holdings[];
  debt?: BorrowData;
  earn?: EarnData;
  pool: Pool[];
  gov?: Gov;
  airdrops?: Array<Airdrops>;
  total?: Total;
  totalReward?: string;
}

interface MirrorTotal {
  mirrorHoldingsSum: string;
  mirrorPoolRewardsSum: string;
  mirrorPoolSum: string;
  mirrorAirdropSum: string;
}

interface AssetInfo {
  idx: string;
  name: string;
  price: string;
  symbol: string;
}

interface BorrowInfo {
  amount: string;
  amountValue: string;
  shortApr: string;
}

interface CollateralInfo {
  collateral: string;
  collateralValue: string;
  collateralRatio: string;
  csymbol: string;
}

interface LockedInfo {
  locked_amount: string;
  unlocked_amount: string;
  unlock_time: string;
  reward: string;
  rewardValue: string;
  shorted: string;
}

interface MirrorShortFarm {
  assetInfo: AssetInfo;
  borrowInfo: BorrowInfo;
  collateralInfo: CollateralInfo;
  lockedInfo: LockedInfo;
}

interface MirrorAccount {
  __typename?: 'Account';
  mirrorStaking: Pool[];
  mirrorHoldings: Holdings[];
  gov: Gov;
  total: MirrorTotal;
  airdrops: Array<Airdrops>;
  mirrorShortFarm: MirrorShortFarm[];
}

interface terrSwapAccount {
  __typename?: 'Account';
  list: Pool[];
  total: string;
}
interface PylonGov extends Gov {
  rewards;
  rewardsValue;
  totalValue;
}

interface PylonSum {
  pylonHoldingsSum: string;
  pylonPoolSum: string;
  pylonAirdropSum: string;
  pylonPoolRewardsSum: string;
  gatewayRewardsSum: string;
  gatewayDepositsSum: string;
}

interface DepositLogs {
  deposit: string;
  depositDate: string;
  depositReleaseDate: string;
  rewardReleaseDate: string;
}

interface PylonGateway {
  symbol: string;
  poolName: string;
  totalDeposit: string;
  depositLogs: DepositLogs[];
  apy: string;
  rewards: string;
  rewardsValue: string;
}
interface PylonAccount {
  __typename?: 'PylonAccount';
  pylonHoldings: Holdings[];
  pylonPool: PylonPool[];
  pylonAirdrops: Airdrops[];
  gov: PylonGov;
  pylonSum: PylonSum;
  pylonGateway: PylonGateway[];
}

interface SpecFarms {
  symbol: string;
  lpName: string;
  stakedLp: string;
  stakedLpUstValue: string;
  tokenStaked: string;
  ustStaked: string;
  farm: string;
  stakedSpec: string;
  stakedSpecValue: string;
  stakedMir: string;
  stakedMirValue: string;
  apy: string;
}

interface SpectrumTotal {
  farmsTotal: string;
  holdingsTotal: string;
  rewardsTotal: string;
}

interface SpecGov {
  name: string;
  staked: string;
  value: string;
  rewards: string;
  price: string;
  apr: string;
}

interface SpectrumAccount {
  farms: SpecFarms[];
  specHoldings: Holdings[];
  specGov?: SpecGov;
  spectrumTotal: SpectrumTotal;
}

interface loterraDraw {
  combinations: string;
  drawTime: string
  ticketCounts: string
  ticketPrice: string;
  jackpot: string;
}

interface LotaGov extends Gov {
  rewardsValue: string;
}
interface LoterraAccount {
  loterraDraw: LoterraDraw
  lotaGov: LotaGov
}
interface Assets {
  __typename?: 'Assets';
  address: string;
  anchor?: AccountAnc;
  mirror?: MirrorAccount;
  pylon?: PylonAccount;
  spectrum: SpectrumAccount
  loterra: LoterraAccount,
}

interface PriceChange {
  change: number;
  percentChange: number;
}
