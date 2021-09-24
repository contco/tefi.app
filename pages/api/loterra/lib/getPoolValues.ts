export const getPoolValues = (stakedlpBalance: number, stakeableLpBalance: number, lpValue: number, price: number) => {
   
    const stakeableLpUstValue = stakeableLpBalance * lpValue;
    const stakedLpUstValue = stakedlpBalance * lpValue;
    const totalLpUstValue = stakeableLpUstValue + stakedLpUstValue;
    const token1UnStaked = stakeableLpUstValue / 2;
    const token1Staked = stakedLpUstValue / 2;
    const token2UnStaked = token1UnStaked / price;
    const token2Staked = token1Staked / price;
  
    return {
      stakedLpUstValue: stakedLpUstValue.toString(),
      stakeableLpUstValue: stakeableLpUstValue.toString(),
      totalLpUstValue: totalLpUstValue.toString(),
      token1UnStaked: token1UnStaked.toString(),
      token1Staked: token1Staked.toString(),
      token2UnStaked: token2UnStaked.toString(),
      token2Staked: token2Staked.toString(),
    };
  };
  