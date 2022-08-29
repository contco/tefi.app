interface Holdings {
  symbol: string;
  value: string;
  balance: string;
  price: string;
  name: string;
  denom?: string;
  contract?: string;
}

interface Gov {
  name: string;
  symbol: string;
  faction?: string;
  staked: string;
  value: string;
  rewards: string;
  rewardsValue?: string;
  price: string;
  apr?: string;
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
  __typename?: 'Coin';
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
  contract: string;
}

interface UserCollateral {
  __typename?: 'UserCollateral';
  collateral?: string;
  balance?: string;
  price?: string;
  value?: string;
  symbol: string;
}

interface BorrowData {
  __typename?: 'BorrowData';
  reward?: Reward;
  limit: string;
  value?: string;
  collaterals: Array<UserCollateral>;
  totalCollateralValue: string;
  percentage: string;
  lunaprice: string;
  ancprice: string;
  netApy: string;
}

interface EarnData {
  __typename?: 'EarnData';
  reward?: Reward;
}

interface Amount {
  amount: string;
  amountValue: string;
}
interface Time {
  requestedTime: string;
  claimableTime: string;
}

interface RequestData {
  amount: Amount;
  time: Time;
}

interface BurnData {
  requestData: Array<RequestData>;
  withdrawableAmount: string;
  withdrawableValue: string;
  totalBurnAmount: string;
  totalBurnAmountValue: string;
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
  burn?: BurnData;
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

interface loterraTotal {
  loterraHoldingsSum: string;
  loterraPoolRewardsSum: string;
  loterraPoolSum: string;
  loterraAirdropSum: string;
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
  tokenRewardsStaked: string;
  tokenRewardsStakedValue: string;
  tokenRewardsStakedSymbol: string;
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
  drawTime: string;
  ticketCounts: string;
  ticketPrice: string;
  jackpot: string;
}

interface LotaGov extends Gov {
  rewardsValue: string;
}
interface LoterraAccount {
  loterraDraw: LoterraDraw;
  lotaGov: LotaGov;
  total: loterraTotal;
  lotaPool: Pool;
}

interface InputViewProps {
  onSend: (data: any, post: any) => void;
}
interface ModalDisplayState {
  isVisible: boolean;
  setVisible: (state: boolean) => void;
  InputView: React.FC<InputViewProps>;
}

interface SendModalTipState {
  isTip?: boolean;
  setIsTip?: (state: boolean) => void;
  tipAddress?: string;
  setTipAddress?: (state: string) => void;
  NFTData?: any;
  setNFTData?: (state: any) => void;
}
interface StarStakedData {
  lpName: string;
  faction: string;
  stakedLp: string;
  stakedLpUstValue: string;
  token1Staked: string;
  token2Staked: string;
  rewards: string;
  rewardsValue: string;
  bondedLp: string;
  bondedLpUstValue: string;
  token1Bonded: string;
  token2Bonded: string;
  unbondingTime: string;
}

interface StarTerraPools {
  stakedData: StarStakedData[];
  symbol1: string;
  symbol2: string;
  stakeableLp: string;
  stakeableLpUstValue: string;
  token1UnStaked: string;
  token2UnStaked: string;
  totalStakedLp: string;
  totalStakedLpUstValue: string;
  totalBondedLp: string;
  totalBondedLpUstValue: string;
  totalRewards: string;
  totalRewardsValue: string;
}

interface StarTerraAccount {
  starTerraPools: StarTerraPools;
  starTerraGov: [Gov];
  govRewardsTotal: string;
  govStakedTotal: string;
}

interface ApolloVault {
  symbol1: string;
  symbol2: string;
  lpName: string;
  stakedLp: string;
  stakedLpUstValue: string;
  token1Staked: string;
  token2Staked: string;
}

interface ApolloAccount {
  vaults: ApolloVault[];
  total: string;
}

interface AlteredAccount {
  altePool: Pool;
}

interface TflokiAccount {
  tflokiHoldings: Holdings;
  flokiPool: Pool;
}

interface NexusVault {
  bLunaDeposit: string;
  bLunaDepositValue: string;
  bEthDeposit: string;
  bEthDepositValue: string;
  bLunaRewards: string;
  bEthRewards: string;
  bLunaVaultApr: string;
  bEthVaultApr: string;
}

interface NexusTotal {
  nexusPoolSum: string;
  nexusPoolRewardsSum: string;
}
interface NexusAccount {
  nexusHoldings: Holdings;
  nexusPools: Pool[];
  nexusGov: Gov;
  nexusVault: NexusVault;
  total: NexusTotal;
}

interface TerraworldAccount {
  twdHoldings: Holdings;
  twdGov: Gov;
  twdPool: Pool;
}

interface ValkyrieAccount {
  vkrHoldings: Holdings;
  vkrGov: Gov;
  vkrPool: Pool;
}
interface Assets {
  __typename?: 'Assets';
  address: string;
  anchor?: AccountAnc;
  mirror?: MirrorAccount;
  pylon?: PylonAccount;
  spectrum: SpectrumAccount;
  loterra: LoterraAccount;
  starterra: StarTerraAccount;
  apollo: ApolloAccount;
  altered: AlteredAccount;
  tfloki: TflokiAccount;
  nexus: NexusAccount;
  terraworld: TerraworldAccount;
  valkyrie: ValkyrieAccount;
}

interface PriceChange {
  change: number;
  percentChange: string;
}

interface txData {
  memo: string;
  block: string;
  txhash: string;
  timestamp: string;
  from_address: string;
  to_address: string;
}

interface ErrorResult {
  error: boolean;
  msg: string;
}

interface NftAssets {
  description: string;
  creator: string;
  name: string;
  image: string;
  tokenId: string;
  nftContract: string;
  nftType: string;
  nftSymbol: string;
  owner: ProfileNft;
}

interface ProfileNft {
  address: string;
  url: string;
  tokenId: string;
  nftAssets: NftAssets[];
}

interface Thread {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
}
