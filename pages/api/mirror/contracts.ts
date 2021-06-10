import networks from "../../../utils/networks";

const UUSD = "uusd"


const helpers = ({
    whitelist,
  }: ContractAddressJSON): ContractAddressHelpers => {
    const listedAll = Object.values(whitelist)
    const listed = listedAll.filter(({ status }) => status === "LISTED")

    const getToken = (symbol?: string) =>
      !symbol
        ? ""
        : symbol === UUSD
        ? symbol
        : listed.find((item) => item.symbol === symbol)?.["token"] ?? ""

    const getSymbol = (token?: string) =>
      !token
        ? ""
        : token.startsWith("u")
        ? token
        : whitelist[token]?.symbol ?? ""

    const getIsDelisted = (token: string) =>
      whitelist[token]?.status === "DELISTED"

    const toAssetInfo = (token: string) =>
      token === UUSD
        ? { native_token: { denom: token } }
        : { token: { contract_addr: token } }

    const toToken = ({ amount, token }: Asset) => ({
      amount,
      info: toAssetInfo(token),
    })

    const parseAssetInfo = (info: AssetInfo | NativeInfo) => {
      const token =
        "native_token" in info
          ? info.native_token.denom
          : info.token.contract_addr

      return { token, symbol: getSymbol(token) }
    }

    const parseToken = ({ amount, info }: AssetToken | NativeToken) => ({
      amount,
      ...parseAssetInfo(info),
    })

    return {
      listed,
      listedAll,
      getToken,
      getSymbol,
      getIsDelisted,
      toAssetInfo,
      toToken,
      parseToken,
    }
  }

export const getContractAddress = async () : Promise<ContractsAddress | undefined>  => {
   const contractUrl = networks.mainnet.contract;
   try {
      const response = await fetch(contractUrl);
      const data: ContractAddressJSON = await response.json();  
      return data && { ...data, ...helpers(data) }
    } 
    catch {
     const data = { contracts: {}, whitelist: {}, delist: {} };
     return data && { ...data, ...helpers(data) }
    }
  }
  