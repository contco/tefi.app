import { convertToFloatValue } from '../../../utils/convertFloat';

export const getPoolData = (anchor, mirror, pylon, terraSwap) => {
  const getPoolTotal = () => {
    const pylonPoolTotal = pylon?.pylonSum?.pylonPoolSum;
    const total =
      parseFloat(pylonPoolTotal) +
      parseFloat(mirror?.total?.mirrorPoolSum) +
      parseFloat(anchor?.total?.anchorPoolSum) +
      parseFloat(terraSwap.total);
    return convertToFloatValue(total.toString()) ?? '0';
  };

  const pool = [...pylon?.pylonPool, ...mirror?.mirrorStaking, ...anchor.pool, ...terraSwap.list].sort(
    (a, b) =>
      parseFloat(b.stakeableLpUstValue) +
      parseFloat(b.stakedLpUstValue) -
      (parseFloat(a.stakeableLpUstValue) + parseFloat(a.stakedLpUstValue)),
  );

  const data = pool.map((assets: Pool) => {
    const staked =
      assets?.stakedLp !== '0'
        ? {
            lpData: {
              lp: convertToFloatValue(assets?.stakedLp) + ' LP',
              token1: convertToFloatValue(assets?.token2Staked) + ' ' + assets?.symbol2,
              token2: convertToFloatValue(assets?.token1Staked) + ' ' + assets.symbol1,
            },
          }
        : { value: '-' };

    const liquid =
      assets?.stakeableLp !== '0'
        ? {
            lpData: {
              lp: convertToFloatValue(assets?.stakeableLp) + ' LP',
              token1: convertToFloatValue(assets?.token2UnStaked) + ' ' + assets?.symbol2,
              token2: convertToFloatValue(assets?.token1UnStaked) + ' ' + assets.symbol1,
            },
          }
        : { value: '-' };

    return [{ name: assets.lpName }, staked, liquid, { value: '$' + convertToFloatValue(assets?.totalLpUstValue) }];
  });

  return {
    titles: ['Name', 'Staked', 'Liquid', 'Value'],
    data: data,
    total: '$' + getPoolTotal(),
  };
};
