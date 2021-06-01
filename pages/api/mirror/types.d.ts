type ListedItemStatus = "LISTED" | "DELISTED";
type ContractData = { Height: string; Result?: string } | null;
interface Dictionary<A> {
    [index: string]: A;
}

interface ListedItem {
    symbol: string
    name: string
    token: string
    pair: string
    lpToken: string
    status: ListedItemStatus
}
  
interface DelistItem {
    symbol: string
    date: string
    ratio: string
}

interface Dict<T = string> {
    [token: string]: T
}
interface Rate {
    rate: string
}

interface MintInfo {
    min_collateral_ratio: string
    end_price: string
}

interface PairPool {
    assets: (AssetToken | NativeToken)[]
    total_share: string
}

interface Asset {
    amount: string
    token: string
    symbol?: string
}

interface AssetInfo {
    token: { contract_addr: string }
}
  
interface NativeInfo {
    native_token: { denom: string }
}
  
interface AssetToken {
    amount: string
    info: AssetInfo
}
  
interface NativeToken {
    amount: string
    info: NativeInfo
}
  
interface Token {
    amount: string
    info: AssetInfo | NativeInfo
}
  
interface ContractAddressJSON {
    contracts: Dictionary<string>
    whitelist: Dictionary<ListedItem>
    delist: Dictionary<DelistItem>
}
  
interface ContractAddressHelpers {
    listed: ListedItem[]
    listedAll: ListedItem[]
    getToken: (symbol?: string) => string
    getSymbol: (token?: string) => string
    getIsDelisted: (token: string) => boolean
    toAssetInfo: (token: string) => AssetInfo | NativeInfo
    toToken: (params: Asset) => Token
    parseToken: (token: AssetToken | NativeToken) => Asset
}
  
interface ContractsAddress extends ContractAddressJSON ,ContractAddressHelpers {};

interface ContractVariables {
    contract: string
    msg: object
  }


interface Query extends Partial<ContractVariables> {
    token: string
}
interface Balance {
    balance: string
  }
interface StakingReward {
    reward_infos: RewardInfo[]
}
  
interface RewardInfo {
    asset_token: string
    bond_amount: string
    index: string
    pending_reward: string
}

interface StakingPool {
    total_bond_amount: string
    reward_index: string
}

interface TotalSupply {
    total_supply: string
  }
  
  interface LPParams {
    lpTokenBalance: Dictionary<Balance>
    stakingReward: StakingReward
  }