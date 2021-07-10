
interface Holdings {
  symbol: string;
  value: string;
  balance: string;
  price: string;
  name: string;
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
}

interface CoreTotal {
  assetsSum: string;
  stakedSum: string;
}

interface Token {
  __typename?: 'Token';
  symbol: string;
  amount: string;
  price: string;
  staked?: string;
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
  price: string;
  quantity: string;
  round?: number;
  name: string;
}

interface UserCollateral {
  __typename?: 'UserCollateral';
  collateral?: string;
  balance?: string;
}

interface BorrowData {
  __typename?: 'BorrowData';
  reward?: Reward;
  limit: string;
  value?: string;
  collaterals: Array<UserCollateral>;
  percentage: string;
  price: string;
}

interface EarnData {
  __typename?: 'EarnData';
  reward?: Reward;
}

interface LpData {
  __typename?: 'LPData';
  reward: Reward;
  balance: string;
  stakedValue: string;
  stakableValue: string;
  anc: string;
  ust: string;
}

interface GovData {
  __typename?: 'GovData';
  reward: Reward;
}

interface Total {
  __typename?: 'Total';
  airdropSum: string;
}

interface AccountAnc {
  __typename?: 'AccountANC';
  assets?: Coin;
  debt?: BorrowData;
  earn?: EarnData;
  pool?: LpData;
  gov?: GovData;
  airdrops?: Array<Airdrops>;
  total?: Total;
  totalReward?: string;
}

interface MirrorStaking {
  __typename?: 'MirrorStaking';
  symbol: string;
  apr: string;
  ustStaked?: string;
  tokenStaked?: string;
  tokenStakedUstValue?: string;
  stakeTotalUstValue?: string;
  poolTotalWithRewards?: string;
  rewards?: string;
  rewardsUstValue?: string;
  price?: string;
  name?: string;
  lpBalance?: string;
}

interface MirrorHoldings extends Holdings {
  __typename?: 'MirrorHoldings';
}

interface PylonHoldings extends Holdings {
  __typename?: 'PylonHoldings';
}
interface AssetsTotal {
  __typename?: 'AssetsTotal';
  rewardsSum: string;
  stakedSum: string;
  unstakedSum: string;
  airdropSum: string;
}

interface MirrorAccount {
  __typename?: 'Account';
  mirrorStaking: MirrorStaking[];
  mirrorHoldings: MirrorHoldings[];
  total: AssetsTotal;
  airdrops: Array<Airdrops>;
}

interface PylonPool {
  __typename?: 'PylonPool';
  symbol: string;
  lpName: string;
  stakedLpUstValue: string;
  availableLpUstValue: string;
  ustStaked: string;
  ustUnStaked: string;
  tokenStaked: string;
  tokenUnStaked: string;
  stakedLP: string;
  rewards: string;
  rewardsValue: string;
  availableLP: string;
  apy: string
}

interface PylonStakings {
  symbol
  name
  stakedValue
  rewards
  rewardsValue
  apy
  balance
  totalValue
}

interface PylonSum {
  pylonHoldingsSum: string;
  pylonStakingSum: string;
  pylonPoolSum: string;
  pylonAirdropSum: string;
  pylonPoolRewardsSum: string;
  pylonStakingRewardsSum: string;
  gatewayRewardsSum: string;
  gatewayDepositsSum: string;
}

interface DepositLogs {
  deposit: string
  depositDate: string
  depositReleaseDate: string
  rewardReleaseDate: string
}

interface PylonGateway {
  symbol: string;
  poolName: string;
  totalDeposit: string!
  depositLogs: DepositLogs[]
  apy: string
  rewards: string
  rewardsValue: string
}
interface PylonAccount {
  __typename?: 'PylonAccount';
  pylonHoldings: PylonHoldings[];
  pylonPool: PylonPool[];
  pylonAirdrops: Airdrops;
  pylonStakings: PylonStakings[];
  pylonSum: PylonSum
  pylonGateway: PylonGateway[];
}

interface Assets {
  __typename?: 'Assets';
  address: string;
  anchor?: AccountAnc;
  mirror?: MirrorAccount;
  pylon?: PylonAccount;
}
