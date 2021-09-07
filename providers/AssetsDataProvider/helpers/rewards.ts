import { convertToFloatValue } from '../../../utils/convertFloat';
import { times } from '../../../utils/math';

const formatApr = (apr = '0') => {
  const aprPercentage = times(apr, 100);
  return parseFloat(aprPercentage).toFixed(2);
};

export const getRewardData = (anchor, mirror, pylon, spectrum, loterra) => {
  const borrowRewards = anchor?.debt?.reward;
  const totalReward = anchor?.totalReward;

  const getRewardsTotal = () => {
    const ancTotal = totalReward;
    const mirrorTotal = mirror?.total?.mirrorPoolRewardsSum;
    const pylonPoolTotal = pylon?.pylonSum?.pylonPoolRewardsSum;
    const loterraRewards = loterra?.lotaGov?.rewardsValue ?? '0';
    const total =
      parseFloat(mirrorTotal) + parseFloat(ancTotal) + parseFloat(pylonPoolTotal) + parseFloat(loterraRewards);
    return convertToFloatValue(total.toString()) ?? 0;
  };

  const pool = [...pylon?.pylonPool, ...mirror?.mirrorStaking, ...anchor.pool].sort(
    (a, b) => b.rewardsValue - a.rewardsValue,
  );

  const gov = [pylon?.gov, spectrum?.specGov, mirror?.gov, anchor?.gov, loterra?.lotaGov]
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
          return [
            { name: assets?.lpName },
            {
              lpData: {
                lp: convertToFloatValue(assets?.stakedLp) + ' LP',
                token1: convertToFloatValue(assets?.token2Staked) + ' ' + assets?.symbol2,
                token2: convertToFloatValue(assets?.token1Staked) + ' ' + assets?.symbol1,
              },
            },
            { apy: assets?.apy ? formatApr(assets?.apy) : formatApr(assets?.apr) + '%' },
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
        apy: borrowRewards?.apy + '%',
      },
      {
        reward: {
          token: borrowRewards?.reward + ' ANC',
          tokenValue:
            '$' + borrowRewards?.reward === '<0.001'
              ? 0
              : (parseFloat(borrowRewards?.reward) * parseFloat(anchor?.debt?.ancprice)).toFixed(3),
        },
      },
    ],
  ];

  const govData = gov?.map((govItem: Gov) => {
    const govReward =
      govItem.symbol === 'LOTA'
        ? {
            reward: {
              token: convertToFloatValue(govItem?.rewards) + ' ' + govItem.symbol,
              tokenValue: '$' + convertToFloatValue(govItem?.rewardsValue),
            },
          }
        : { value: 'Automatically \n re-staked' };
    return [
      {
        name: govItem.name,
      },
      {
        balance: {
          token: convertToFloatValue(govItem.staked) + ' ' + govItem.symbol,
          tokenValue: '$' + convertToFloatValue(govItem.value),
        },
      },
      {
        apy: govItem?.apy ? convertToFloatValue(govItem?.apy) : convertToFloatValue(govItem?.apr) + '%',
      },
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
    titles: ['Name', 'Staked', 'Liquid', 'Value'],
    data: [...poolData, ...borrowData, ...govData],
    total: headerData,
  };
};
