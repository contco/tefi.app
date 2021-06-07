import BN from "bignumber.js"
import MIRROR_ASSETS from "./mirrorAssets.json";


const listedAll: ListedItem[] = MIRROR_ASSETS;

export const WASMQUERY = "WasmContractsContractAddressStore";
export const STAKING_CONTRACT = "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5";
export const UUSD = "uusd";
export const MIR = "MIR";
export const UNIT = 1000000;
export const plus = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).plus(b || 0).toString()
export const div = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).div(b || 1).toString();
export const gt = (a: BN.Value, b: BN.Value): boolean => new BN(a).gt(b);
export const times = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).times(b || 0).toString();
export const floor = (n: BN.Value): string => new BN(n).integerValue(BN.ROUND_FLOOR).toString();

  
const stringify = (msg: object) => JSON.stringify(msg).replace(/"/g, '\\"');



const listed = MIRROR_ASSETS.filter(({ status }) => status === "LISTED")

const getToken = (symbol?: string) =>
  !symbol
    ? ""
    : symbol === UUSD
    ? symbol
    : listed.find((item) => item.symbol === symbol)?.["token"] ?? ""


export const alias = ({ token, contract, msg }: Query) =>
!msg
  ? ``
  : `
  ${token}: ${WASMQUERY}(
    ContractAddress: "${contract}"
    QueryMsg: "${stringify(msg)}"
  ) {
    Height
    Result
  }`;

const parseResult = <Parsed>(params: { Result?: string } | null) =>
  params && params.Result ? (JSON.parse(params.Result) as Parsed) : undefined


const parseResults = <Parsed>(object?: Dictionary<ContractData>) =>
  object &&
  Object.entries(object).reduce<Dictionary<Parsed>>((acc, [token, data]) => {
    const next = parseResult<Parsed>(data)
    return Object.assign({}, acc, next && { [token]: next })
  }, {})


  export const parse = <Parsed>(data : Dictionary<ContractData> ) =>
  data && parseResults<Parsed>(data);

  export const parseContractsData = <Parsed>( data: ContractsData | undefined ) =>
  data && parseResult<Parsed>(data[WASMQUERY])


  export enum PriceKey {
    PAIR = "pair",
    ORACLE = "oracle",
    END = "end",
  }

  export enum AssetInfoKey {
    // Dictionary<string>
    LIQUIDITY = "liquidity",
    MINCOLLATERALRATIO = "minCollateralRatio",
    LPTOTALSTAKED = "lpTotalStaked",
    LPTOTALSUPPLY = "lpTotalSupply",
  }
  
  export enum BalanceKey {
    // Dictionary<string>
    TOKEN = "token",
    LPTOTAL = "lpTotal",
    LPSTAKABLE = "lpStakable",
    LPSTAKED = "lpStaked",
    MIRGOVSTAKED = "MIRGovStaked",
    REWARD = "reward",
  }

  export const price = {
    [PriceKey.PAIR]: (pairPool: Dictionary<PairPool>) =>
      dict(pairPool, calcPairPrice),
    [PriceKey.ORACLE]: (oraclePrice: Dictionary<Rate>) =>
      dict(oraclePrice, ({ rate }) => rate),
    [PriceKey.END]: (mintInfo: Dictionary<MintInfo>) =>
      dict(mintInfo, ({ end_price }) => end_price),
  }

export const dict = <Data, Item = string>(
    dictionary: Dictionary<Data>,
    selector: (data: Data, token?: string) => Item
  ) =>
    Object.entries(dictionary).reduce<Dict<Item>>(
      (acc, [token, data]) => ({ ...acc, [token]: selector(data, token) }),
      {}
)

export const parsePairPool = ({ assets, total_share }: PairPool) => ({
  uusd: assets.find(({ info }) => "native_token" in info)?.amount ?? "0",
  asset: assets.find(({ info }) => "token" in info)?.amount ?? "0",
  total: total_share ?? "0",
});

export const calcPairPrice = (param: PairPool) => {
    const { uusd, asset } = parsePairPool(param)
    return [uusd, asset].every((v) => v && gt(v, 0)) ? div(uusd, asset) : "0"
}

export const contractInfo = {
  [AssetInfoKey.LIQUIDITY]: (pairPool: Dictionary<PairPool>) =>
    dict(pairPool, (pool) => parsePairPool(pool).asset),
  [AssetInfoKey.MINCOLLATERALRATIO]: (mintInfo: Dictionary<MintInfo>) =>
    dict(mintInfo, ({ min_collateral_ratio }) => min_collateral_ratio),
  [AssetInfoKey.LPTOTALSTAKED]: (stakingPool: Dictionary<StakingPool>) =>
    dict(stakingPool, ({ total_bond_amount }) => total_bond_amount),
  [AssetInfoKey.LPTOTALSUPPLY]: (lpTokenInfo: Dictionary<TotalSupply>) =>
    dict(lpTokenInfo, ({ total_supply }) => total_supply),
}

const reward = (globalIndex?: string, info?: RewardInfo) => {
  if (globalIndex && info) {
    const { index, bond_amount, pending_reward } = info

    const reward = new BN(globalIndex)
      .minus(index)
      .times(bond_amount)
      .plus(pending_reward)

    return reward.toString()
  }

  return "0"
}

export const balance = {
  [BalanceKey.TOKEN]: (tokenBalance: Dictionary<Balance>) =>
    dict(tokenBalance, ({ balance }) => balance),
  [BalanceKey.LPTOTAL]: (
    lpTokenBalance: Dictionary<Balance>,
    stakingReward: StakingReward
  ) => reduceLP(listedAll, { lpTokenBalance, stakingReward }),
  [BalanceKey.LPSTAKABLE]: (lpTokenBalance: Dictionary<Balance>) =>
    dict(lpTokenBalance, ({ balance }) => balance),
  [BalanceKey.LPSTAKED]: (stakingReward: StakingReward) =>
    reduceBondAmount(stakingReward),
  [BalanceKey.MIRGOVSTAKED]: (govStake: Balance) => {
    const token = getToken(MIR)
    return { [token]: govStake.balance }
  },
  [BalanceKey.REWARD]: (
    stakingPool: Dictionary<StakingPool>,
    stakingReward: StakingReward
  ) =>
    dict(stakingPool, ({ reward_index: globalIndex }, token) => {
      const { reward_infos } = stakingReward;
      const info = reward_infos?.find((info) => info.asset_token === token)
      return floor(reward(globalIndex, info))
    }),
};

const reduceLP = (
  listedAll: ListedItem[],
  { lpTokenBalance, stakingReward }: LPParams
) =>
{
  return listedAll.reduce<Dictionary<string>>(
    (acc, { token }) => ({
      ...acc,
      [token]: plus(
        lpTokenBalance[token].balance,
        stakingReward.reward_infos.find(
          ({ asset_token }) => asset_token === token
        )?.bond_amount
      ),
    }),
    {}
  )
}

const reduceBondAmount = ({ reward_infos }: StakingReward) =>
  reward_infos.reduce<Dictionary<string>>(
    (acc, { asset_token, bond_amount }) => {
      return { ...acc, [asset_token]: bond_amount }
    },
    {}
);

export const fromLP =  (
  lp: string,
  shares: { asset: Asset; uusd: Asset },
  totalShare: string
): { asset: Asset; uusd: Asset } =>
  Object.entries(shares).reduce(
    (acc, [key, { amount, token }]) => ({
      ...acc,
      [key]: {
        amount: new BN(lp).times(amount).div(totalShare).toString(),
        token,
      },
    }),
    {} as { asset: Asset; uusd: Asset }
  );