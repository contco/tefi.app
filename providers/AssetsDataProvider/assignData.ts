import {
  getAirdropsData,
  getAnchorBondData,
  getAnchorBorrowData,
  getAnchorEarnData,
  getAssetData,
  getLoterraData,
  getLunaStakingData,
  getMirrorBorrowData,
  getMirrorShortFarmData,
  getPoolData,
  getPylonGatewayData,
  getRewardData,
  getSpecFarmData,
  getSpecRewardData,
  getStarterraFarms,
  getApolloVaultData
} from './helpers';

export const assignData = (data) =>
  data
    ? {
        anchorEarn: getAnchorEarnData(data?.assets?.anchor?.earn),
        anchorBond: getAnchorBondData(data?.assets?.anchor?.burn),
        anchorBorrow: getAnchorBorrowData(data?.assets?.anchor?.debt),
        lunaStaking: getLunaStakingData(data?.assets?.core),
        mirrorShortFarm: getMirrorShortFarmData(data?.assets?.mirror?.mirrorShortFarm),
        mirrorBorrow: getMirrorBorrowData(data?.assets?.mirror?.mirrorShortFarm),
        pylon: getPylonGatewayData(data?.assets?.pylon),
        specFarm: getSpecFarmData(data?.assets?.spectrum),
        specReward: getSpecRewardData(data?.assets?.spectrum),
        starterraFarms: getStarterraFarms(data?.assets?.starterra?.starTerraPools),
        assets: getAssetData(
          data?.assets?.anchor,
          data?.assets?.mirror,
          data?.assets?.pylon,
          data?.assets?.core,
          data?.assets?.spectrum,
        ),
        pools: getPoolData(
          data?.assets?.anchor,
          data?.assets?.mirror,
          data?.assets?.pylon,
          data?.assets?.terraSwapPool,
        ),
        rewards: getRewardData(
          data?.assets?.anchor,
          data?.assets?.mirror,
          data?.assets?.pylon,
          data?.assets?.spectrum,
          data?.assets?.loterra,
        ),
        airdrops: getAirdropsData(data?.assets?.anchor, data?.assets?.mirror, data?.assets?.pylon),
        loterra: getLoterraData(data?.assets?.loterra),
        apollo: getApolloVaultData(data?.assets?.apollo)
      }
    : {};
