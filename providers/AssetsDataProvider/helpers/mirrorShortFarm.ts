import { convertToFloatValue } from '../../../utils/convertFloat';

export const getMirrorShortFarmData = (short) => {
  const getTotalForFarm = (short, prop) => {
    const total = short.reduce((a, shortAsset) => a + parseFloat(shortAsset?.lockedInfo[prop]), 0);
    return total.toString();
  };

  let myshort = short?.filter(
    (assets) =>
      parseFloat(assets?.lockedInfo?.locked_amount) > 0 || parseFloat(assets?.lockedInfo?.unlocked_amount) > 0,
  );

  myshort = myshort
    .slice()
    .sort((a, b) => parseFloat(b?.lockedInfo?.rewardValue) - parseFloat(a?.lockedInfo?.rewardValue));

  const data = myshort.map((assets: MirrorShortFarm) => {
    return [
      { name: assets?.assetInfo?.symbol },
      {
        shorted: convertToFloatValue(assets?.lockedInfo?.shorted) + ' ' + assets?.assetInfo?.symbol,
      },
      {
        locked: convertToFloatValue(assets?.lockedInfo?.locked_amount) + ' UST',
      },
      {
        unlocked: convertToFloatValue(assets?.lockedInfo?.unlocked_amount) + ' UST',
      },
      {
        reward: {
          token: convertToFloatValue(assets?.lockedInfo?.reward) + ' MIR',
          tokenValue: convertToFloatValue(assets?.lockedInfo?.rewardValue) + ' UST',
        },
      },
    ];
  });

  return {
    titles: ['Name', 'Shorted', 'Locked UST', 'Unlocked UST', 'Reward'],
    data: data,
    total: [
      { name: 'Reward', value: convertToFloatValue(getTotalForFarm(short, 'reward')) + ' MIR' },
      { name: 'Locked', value: convertToFloatValue(getTotalForFarm(short, 'locked_amount')) + ' UST' },
      { name: 'Unlocked', value: convertToFloatValue(getTotalForFarm(short, 'unlocked_amount')) + ' UST' },
    ],
  };
};
