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

