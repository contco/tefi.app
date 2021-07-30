interface TokenInfo {
    symbol: string
    name: string
    contract_addr: string
}

/* terraswap:unit */
export const MIR = "MIR"
export const UUSD = "uusd"
export const ULUNA = "uluna"
export const UKRW = "ukrw"
export const USDR = "usdr"
export const UMNT = "umnt"
export const UAUD = "uaud"
export const UCAD = "ucad"
export const UCHF = "uchf"
export const UCNY = "ucny"
export const UEUR = "ueur"
export const UGBP = "ugbp"
export const UHKD = "uhkd"
export const UINR = "uinr"
export const UJPY = "ujpy"
export const USGD = "usgd"
export const UTHB = "uthb"
export const UST = "UST"
export const KRT = "KRT"
export const SDT = "SDT"
export const MNT = "MNT"
export const LUNA = "Luna"
export const AUT = "AUT"
export const CAT = "CAT"
export const CHT = "CHT"
export const CNT = "CNT"
export const EUT = "EUT"
export const GBT = "GBT"
export const HKT = "HKT"
export const INT = "INT"
export const JPT = "JPT"
export const SGT = "SGT"
export const THT = "THT"
export const LP = "LP"

export let tokenInfos: Map<string, TokenInfo> = new Map<string, TokenInfo>([
    [LUNA, { contract_addr: ULUNA, symbol: LUNA, name: ULUNA }],
    [KRT, { contract_addr: UKRW, symbol: KRT, name: UKRW }],
    [MNT, { contract_addr: UMNT, symbol: MNT, name: UMNT }],
    [SDT, { contract_addr: USDR, symbol: SDT, name: USDR }],
    [UST, { contract_addr: UUSD, symbol: UST, name: UUSD }],
    [AUT, { contract_addr: UAUD, symbol: AUT, name: UAUD }],
    [CAT, { contract_addr: UCAD, symbol: CAT, name: UCAD }],
    [CHT, { contract_addr: UCHF, symbol: CHT, name: UCHF }],
    [CNT, { contract_addr: UCNY, symbol: CNT, name: UCNY }],
    [EUT, { contract_addr: UEUR, symbol: EUT, name: UEUR }],
    [GBT, { contract_addr: UGBP, symbol: GBT, name: UGBP }],
    [HKT, { contract_addr: UHKD, symbol: HKT, name: UHKD }],
    [INT, { contract_addr: UINR, symbol: INT, name: UINR }],
    [JPT, { contract_addr: UJPY, symbol: JPT, name: UJPY }],
    [SGT, { contract_addr: USGD, symbol: SGT, name: USGD }],
    [THT, { contract_addr: UTHB, symbol: THT, name: UTHB }],
    [ULUNA, { contract_addr: ULUNA, symbol: LUNA, name: ULUNA }],
    [UKRW, { contract_addr: UKRW, symbol: KRT, name: UKRW }],
    [UMNT, { contract_addr: UMNT, symbol: MNT, name: UMNT }],
    [USDR, { contract_addr: USDR, symbol: SDT, name: USDR }],
    [UUSD, { contract_addr: UUSD, symbol: UST, name: UUSD }],
    [UAUD, { contract_addr: UAUD, symbol: AUT, name: UAUD }],
    [UCAD, { contract_addr: UCAD, symbol: CAT, name: UCAD }],
    [UCHF, { contract_addr: UCHF, symbol: CHT, name: UCHF }],
    [UCNY, { contract_addr: UCNY, symbol: CNT, name: UCNY }],
    [UEUR, { contract_addr: UEUR, symbol: EUT, name: UEUR }],
    [UGBP, { contract_addr: UGBP, symbol: GBT, name: UGBP }],
    [UHKD, { contract_addr: UHKD, symbol: HKT, name: UHKD }],
    [UINR, { contract_addr: UINR, symbol: INT, name: UINR }],
    [UJPY, { contract_addr: UJPY, symbol: JPT, name: UJPY }],
    [USGD, { contract_addr: USGD, symbol: SGT, name: USGD }],
    [UTHB, { contract_addr: UTHB, symbol: THT, name: UTHB }],
])