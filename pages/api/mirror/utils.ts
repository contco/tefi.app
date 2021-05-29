import BN from "bignumber.js"
const WASMQUERY = "WasmContractsContractAddressStore";


export const div = (a?: BN.Value, b?: BN.Value): string => new BN(a || 0).div(b || 1).toString();
export const gt = (a: BN.Value, b: BN.Value): boolean => new BN(a).gt(b)
  
const stringify = (msg: object) => JSON.stringify(msg).replace(/"/g, '\\"');

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

  export enum PriceKey {
    PAIR = "pair",
    ORACLE = "oracle",
    END = "end",
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