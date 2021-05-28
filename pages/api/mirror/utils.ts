const WASMQUERY = "WasmContractsContractAddressStore";

interface Query extends Partial<ContractVariables> {
    token: string
  }
  
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
  data && parseResults<Parsed>(data)