
interface Holdings {
  symbol: string;
  value: string;
  balance: string;
  price: string;
  name: string;
}


interface Pool {
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
  rewardsSymbol: string;
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
}

interface CoreTotal {
  assetsSum: string;
  stakedSum: string;
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
  symbol: string;
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
  netApy: string;
}

interface EarnData {
  __typename?: 'EarnData';
  reward?: Reward;
}

interface GovData {
  __typename?: 'GovData';
  reward: Reward;
  price: string;
  value: string;
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
  gov?: GovData;
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

interface MirrorAccount {
  __typename?: 'Account';
  mirrorStaking: Pool[];
  mirrorHoldings: Holdings[];
  total: MirrorTotal;
  airdrops: Array<Airdrops>;
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
  pylonHoldings: Holdings[];
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
