import { convertToFloatValue } from '../../../utils/convertFloat';
import { times } from '../../../utils/math';

const formatApr = (apr = '0') => {
  const aprPercentage = times(apr, 100);
  return parseFloat(aprPercentage).toFixed(2);
};

export const getRewardData = (anchor, mirror, pylon, spectrum, loterra, starterra: StarTerraAccount) => {
  const borrowRewards = anchor?.debt?.reward;
  const totalReward = anchor?.totalReward;

  const getRewardsTotal = () => {
    const ancTotal = totalReward;
    const mirrorTotal = mirror?.total?.mirrorPoolRewardsSum;
    const pylonPoolTotal = pylon?.pylonSum?.pylonPoolRewardsSum;
    const loterraRewards = loterra?.lotaGov?.rewardsValue ?? '0';
    const starterraRewards = starterra?.govRewardsTotal;
    const total =
      parseFloat(mirrorTotal) + parseFloat(ancTotal) + parseFloat(pylonPoolTotal) + parseFloat(loterraRewards)
      + parseFloat(starterraRewards);

    return total.toString() ?? '0';
  };

  const getGovStaked = () => {
    const ancGov = parseFloat(anchor?.gov?.value ?? '0');
    const mirrorGov = parseFloat(mirror?.gov?.value ?? '0');
    const pylonGov = parseFloat(pylon?.gov?.value ?? '0');
    const specGov = parseFloat(spectrum?.specGov?.value ?? '0');
    const lotaGov = parseFloat(loterra?.lotaGov?.value ?? '0');
    const sttGov = parseFloat(starterra?.govStakedTotal);
    const govStaked = mirrorGov + ancGov + pylonGov + specGov + lotaGov + sttGov;
    return govStaked;
  };

  const pool = [...pylon?.pylonPool, ...mirror?.mirrorStaking, ...anchor.pool].sort(
    (a, b) => b.rewardsValue - a.rewardsValue,
  );

  const gov = [pylon?.gov, spectrum?.specGov, mirror?.gov, anchor?.gov, loterra?.lotaGov, ...starterra.starTerraGov]
    .filter((item) => item != null)
    .sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

  const rewardEstimates = () => {
    let dailyTotal = 0;
    let monthlyTotal = 0;
    let yearlyTotal = 0;

    pool?.map((item: Pool) => {
      const value = parseFloat(item?.totalLpUstValue);
      const apr = parseFloat(item?.apr);
      if (value && apr) {
        const daily = (apr / 365) * value;
        const monthly = daily * 30;
        const yearly = apr * value;

        dailyTotal += daily;
        monthlyTotal += monthly;
        yearlyTotal += yearly;
      }
    });

    gov?.map((item: Gov) => {
      const value = parseFloat(item?.value);
      const apr = parseFloat(item?.apr || item?.apy);
      if (value && apr) {
        const daily = (apr / 36500) * value;
        const monthly = daily * 30;
        const yearly = (apr / 100) * value;

        dailyTotal += daily;
        monthlyTotal += monthly;
        yearlyTotal += yearly;
      }
    });

    const anchorBorrowValue = parseFloat(anchor?.debt?.value);
    const anchorBorrowApr = parseFloat(borrowRewards?.apy);

    if (anchorBorrowValue && anchorBorrowApr) {
      const daily = (anchorBorrowApr / 36500) * anchorBorrowValue;
      const monthly = daily * 30;
      const yearly = (anchorBorrowApr / 100) * anchorBorrowValue;

      dailyTotal += daily;
      monthlyTotal += monthly;
      yearlyTotal += yearly;
    }

    return {
      Claimable: getRewardsTotal(),
      Daily: dailyTotal.toFixed(2),
      Monthly: monthlyTotal.toFixed(2),
      Yearly: yearlyTotal.toFixed(2),
    };
  };

  const poolData =
    pool && pool.length > 0
      ? pool.map((assets: Pool) => {
          const ap = assets?.apy ? { apy: formatApr(assets.apy) + '%' } : { apr: formatApr(assets.apr) + '%' };
          return [
            { name: assets?.lpName },
            {
              lpData: {
                lp: convertToFloatValue(assets?.stakedLp) + ' LP',
                token1: convertToFloatValue(assets?.token2Staked) + ' ' + assets?.symbol2,
                token2: convertToFloatValue(assets?.token1Staked) + ' ' + assets?.symbol1,
              },
            },
            ap,
            {
              reward: {
                token: convertToFloatValue(assets?.rewards) + ' ' + assets?.rewardsSymbol,
                tokenValue: '$' + convertToFloatValue(assets?.rewardsValue),
              },
            },
          ];
        })
      : [];

  const borrowData = [
    [
      {
        name: borrowRewards?.name,
      },
      {
        value: 'N/A',
      },
      {
        apr: borrowRewards?.apy + '%',
      },
      {
        reward: {
          token: borrowRewards?.reward + ' ANC',
          tokenValue:
            borrowRewards?.reward === '<0.001'
              ? '$' + 0
              : '$' + (parseFloat(borrowRewards?.reward) * parseFloat(anchor?.debt?.ancprice)).toFixed(3),
        },
      },
    ],
  ];

  const govData = gov?.map((govItem: Gov) => {
    const govReward = { value: 'Automatically re-staked' };
    const ap = govItem?.apy
      ? { apy: convertToFloatValue(govItem.apy) + '%' }
      : { apr: govItem?.apr === '0' ? 'N/A' : convertToFloatValue(govItem?.apr) + '%' };
    return [
      {
        name: govItem.name,
        info: govItem?.faction,
      },
      {
        balance: {
          token: convertToFloatValue(govItem.staked) + ' ' + govItem.symbol,
          tokenValue: '$' + convertToFloatValue(govItem.value),
        },
      },
      ap,
      govReward,
    ];
  });

  const estimate = rewardEstimates();
  const headerData = Object.keys(estimate).map((key) => {
    return {
      name: key,
      value: '$' + convertToFloatValue(estimate[key]),
    };
  });

  return {
    titles: ['Name', 'Staked', 'APR', 'Reward'],
    data: [...poolData, ...borrowData, ...govData],
    total: headerData,
    totalReward: parseFloat(getRewardsTotal()),
    totalGov: getGovStaked(),
  };
};
