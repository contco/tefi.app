import axios from 'axios';
const ANCHOR_API_URL = "https://api.anchorprotocol.com/api/v2/";

export const getAnchorApyStats = async () => {
    try {
      const {data: distributionAPY} = await axios.get(ANCHOR_API_URL + "distribution-apy");
      const {data: ustLpRewardApy} = await axios.get(ANCHOR_API_URL + "ust-lp-reward");
      const {data: govRewardApy} = await axios.get(ANCHOR_API_URL + "gov-reward");
      return {distributionAPY: distributionAPY?.distribution_apy, lpRewardApy: ustLpRewardApy?.apy, govRewardApy: govRewardApy?.current_apy };
    }
    catch(err) {
      return {distributionAPY: '0', lpRewardApy: '0', govRewardApy: '0'};
    }
  }