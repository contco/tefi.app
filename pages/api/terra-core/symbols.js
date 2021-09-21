export const DENOM_SYMBOLS = {
    uusd: { name: "TerraUSD", symbol: "UST" },
    uluna: { name: "Luna", symbol: "Luna" },
    uaud: { name: "Terra Australian Dollar", symbol: "AUT" },
    ucad: { name: "Terra Canadian Dollar", symbol: "CAT" },
    uchf: { name: "Terra Swiss Franc", symbol: "CHT" },
    ucny: { name: "Terra Chinese Yuan", symbol: "CNT" },
    udkk: { name: "Terra Danish Krone", symbol: "DKK" },
    ueur: { name: "Terra Euro", symbol: "EUR" },
    ugbp: { name: "Terra British Pound", symbol: "GBT" },
    uhkd: { name: "Terra HongKong Dollar", symbol: "HKT" },
    uinr: { name: "Terra Indian Rupee", symbol: "INT" },
    ujpy: { name: "Terra Japanese Yen", symbol: "JPT" },
    ukrw: {
        name: "Terra South Korean Won",
        symbol: "KRT",
        isNative: true,
        isLunaPair: true,
        pool_addr: "terra1zw0kfxrxgrs5l087mjm79hcmj3y8z6tljuhpmc"
    },
    umnt: {
        name: "Terra Mongolian Togrog",
        symbol: "MNT",
        isNative: true,
        isLunaPair: true,
        pool_addr: "terra1sndgzq62wp23mv20ndr4sxg6k8xcsudsy87uph",
    },
    unok: { name: "Terra Norwegian Krone", symbol: "NOT" },
    usdr: {
        name: "TerraSDR",
        symbol: "SDT",
        isNative: true,
        isLunaPair: true,
        pool_addr: "terra1vs2vuks65rq7xj78mwtvn7vvnm2gn7adjlr002",
    },
    usek: { name: "Terra Swedish Krona", symbol: "SET" },
    usgd: { name: "Terra Singapore Dolalr", symbol: "SGT" },
    uthb: { name: "Terra Thai Baht", symbol: "THT" },
};

export const SWAP_TOKENS = [
    {
        name: "Bonded Luna",
        symbol: "bLUNA",
        isNative: false,
        isLunaPair: true,
        token_addr: "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp",
        pool_addr: "terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p"
    },
    {
        name: "LoTerra",
        symbol: "LOTA",
        isNative: false,
        isLunaPair: false,
        token_addr: "terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr",
        pool_addr: "terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta"
    },
    {
        name: "Bonded ETH",
        symbol: "bETH",
        isNative: false,
        isLunaPair: false,
        token_addr: "terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun",
        pool_addr: "terra1c0afrdc5253tkp5wt7rxhuj42xwyf2lcre0s7c"
    },
    {
        name: "Altered",
        symbol: "ALTE",
        isNative: false,
        isLunaPair: false,
        token_addr: "terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv",
        pool_addr: "terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz"
    },
    {
        name: "StarTerra",
        symbol: "STT",
        isNative: false,
        isLunaPair: false,
        token_addr: "terra13xujxcrc9dqft4p9a8ls0w3j0xnzm6y2uvve8n",
        pool_addr: "terra19pg6d7rrndg4z4t0jhcd7z9nhl3p5ygqttxjll"
    }
];

export const UUSD_DENOM = "uusd";
export const LUNA_DENOM = "uluna";
export const UKRW_DENOM = 'ukrw'