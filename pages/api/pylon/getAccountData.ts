import { PYLON_API_ENDPOINT, PYLON_TOKEN_NAME, PYLON_TOKEN_SYMBOL, PYLON_UST_LP } from "./constants";
import { getGatewayData } from "./getGatewayData";
import { getLatestRound } from "./airdrops";
import { fetchData } from "../commons/index";

const DEFAULT_PYLON_SUM = { pylonHoldingsSum: '0', pylonPoolSum: '0', pylonAirdropSum: '0', pylonPoolRewardsSum: '0', gatewayRewardsSum: '0', gatewayDepositsSum: '0' };

const fetchPylonData = async (address: string) => {
    const mineOverviewPromise = fetchData(PYLON_API_ENDPOINT + 'mine/v1/overview');
    const governanceOverviewPromise = fetchData(PYLON_API_ENDPOINT + 'governance/v1/overview');
    const poolOverViewPromise = fetchData(PYLON_API_ENDPOINT + 'liquidity/v1/overview');
    const getAccountDetailsPromise = fetchData(PYLON_API_ENDPOINT + `account/v1/${address}`);
    const mineStakingPromise = fetchData(PYLON_API_ENDPOINT + `governance/v1/status/${address}`);
    const minePoolPromise = fetchData(PYLON_API_ENDPOINT + `liquidity/v1/status/${address}`);
    const airdropPromise = fetchData(PYLON_API_ENDPOINT + `mine/v1/airdrop/${address}`);
    const gatewayDataPromise = getGatewayData(address);
    const latestRoundPromise = getLatestRound();
    const result = await Promise.all([mineOverviewPromise, getAccountDetailsPromise, mineStakingPromise, minePoolPromise, governanceOverviewPromise, poolOverViewPromise, airdropPromise, gatewayDataPromise, latestRoundPromise]);
    return result;
}

const getPylonHoldings = (price: number, accountDetails: any) => {
    if (accountDetails && accountDetails?.data?.mineBalance) {
        const { mineBalance } = accountDetails.data;
        const value = (mineBalance * price).toString();
        return { pylonHoldingsSum: value.toString(), pylonHoldings: [{ symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: mineBalance.toString(), value, price: price.toString() }] };
    }
    return { pylonHoldingsSum: '0', pylonHoldings: [] };
};

const getPylonGov = (price: number, mineStakingData: any, apy: number) => {
    if (mineStakingData?.data) {
        const { stakedBalance, earned } = mineStakingData?.data;
        if (stakedBalance !== 0) {
            const stakedValue = (stakedBalance * price).toString();
            const rewardsValue = (earned * price).toString();
            const totalValue = (rewardsValue + stakedValue).toString();
            const apyPercent = (apy ?? 0) * 100;
            const gov = { name: "MINE Gov", symbol: "MINE", staked: stakedBalance.toString(), rewards: earned.toString(), value: stakedValue, price: price.toString(), rewardsValue, totalValue, apy: apyPercent?.toString() ?? '0' };
            return gov;
        }
    }
    return null;
};

const getMinePoolInfo = (price: number, minePoolData, apy: number, lpValue: number) => {
    if (minePoolData?.data) {
        const { balance, earned, stakedBalance } = minePoolData.data;
        if (stakedBalance || balance) {
            const stakedLpUstValue = (stakedBalance * lpValue);
            const stakeableLpUstValue = (balance * lpValue) ?? 0;
            const totalLpUstValue = (stakeableLpUstValue + stakedLpUstValue).toString();
            const token1Staked = stakedLpUstValue / 2;
            const token1UnStaked = stakeableLpUstValue / 2;
            const token2Staked = token1Staked / price;
            const token2UnStaked = token1UnStaked / price;
            const rewardsValue = (price * earned).toString();
            const pylonPool = [{ symbol1: 'UST', symbol2: PYLON_TOKEN_SYMBOL, lpName: PYLON_UST_LP, stakeableLp: balance.toString(), stakedLp: stakedBalance.toString(), rewards: earned.toString(), rewardsValue, apr: apy?.toString() ?? '0', stakedLpUstValue: stakedLpUstValue.toString(), stakeableLpUstValue: stakeableLpUstValue.toString(), totalLpUstValue, token1Staked: token1Staked.toString(), token1UnStaked: token1UnStaked.toString(), rewardsSymbol: PYLON_TOKEN_SYMBOL, token2Staked: token2Staked.toString(), token2UnStaked: token2UnStaked.toString() }];
            const pylonPoolSum = (stakedLpUstValue + stakeableLpUstValue).toString();
            const pylonPoolRewardsSum = rewardsValue?.toString() ?? '0';
            return { pylonPoolSum, pylonPoolRewardsSum, pylonPool }
        }
    }
    return { pylonPoolSum: '0', pylonPoolRewardsSum: '0', pylonPool: [] };
};

const getPylonAirdrops = (price: number, data: any, latestRound: number) => {
    if (data && data?.amount) {
        const { amount } = data;
        const value = (amount * price).toString();
        const pylonAirdrops = { name: PYLON_TOKEN_NAME, symbol: PYLON_TOKEN_SYMBOL, round: latestRound, quantity: amount.toString(), price: value };
        return { pylonAirdropSum: value, pylonAirdrops };
    }
    return { pylonAirdropSum: '0', pylonAirdrops: undefined };
}

const getLpValue = (liquidityInfo: any, minePrice: number) => {
    const { tokenReserve, ustReserve, totalShares } = liquidityInfo;
    const totalLpValue = (tokenReserve * minePrice) + ustReserve;
    const lpValue = totalLpValue / totalShares;
    return lpValue;
}

export const getAccountData = async (address: string) => {
    try {
        const [mineOverview, getAccountDetails, mineStakingData, minePoolData, governanceOverview, liquidityOverview, airdropData, pylonGateway, latestRound] = await fetchPylonData(address);
        if (mineOverview) {
            const { priceInUst } = mineOverview.data;
            const lpValue = getLpValue(mineOverview?.data?.liquidityInfo, priceInUst);
            const { pylonHoldingsSum, pylonHoldings } = getPylonHoldings(priceInUst, getAccountDetails);
            const gov = getPylonGov(priceInUst, mineStakingData, governanceOverview?.data?.apy);
            const { pylonPoolSum, pylonPoolRewardsSum, pylonPool } = getMinePoolInfo(priceInUst, minePoolData, liquidityOverview?.data?.apy, lpValue);
            const { pylonAirdropSum, pylonAirdrops } = getPylonAirdrops(priceInUst, airdropData?.data, latestRound);
            const { gatewayPoolData, gatewayRewardsSum, gatewayDepositsSum } = pylonGateway;
            const pylonTotal = { pylonHoldingsSum, pylonPoolSum, pylonAirdropSum, pylonPoolRewardsSum, gatewayRewardsSum, gatewayDepositsSum };

            return { pylonHoldings, gov, pylonPool, pylonAirdrops, pylonSum: pylonTotal, pylonGateway: gatewayPoolData };
        }

        return { pylonHoldings: [], gov: null, pylonAirdrops: null, pylonGateway: [], pylonPool: [], pylonSum: DEFAULT_PYLON_SUM };
    }
    catch (err) {
        throw new Error("Error Fetching Pylon Data");
    }
};
