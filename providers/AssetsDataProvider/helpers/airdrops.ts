import { convertToFloatValue } from '../../../utils/convertFloat';

export const getAirdropsData = (anchor, mirror, pylon) => {
  const getAirdropTotal = () => {
    const mirrorTotal = parseFloat(mirror?.total?.mirrorAirdropSum ?? '0');
    const anchorTotal = parseFloat(anchor?.total?.airdropSum ?? '0');
    const pylonTotal = parseFloat(pylon?.pylonSum?.pylonAirdropSum ?? '0');
    const total = (mirrorTotal + anchorTotal + pylonTotal).toFixed(3);
    return total;
  };

  let airdropsData = [...mirror?.airdrops, ...anchor?.airdrops, ...pylon.pylonAirdrops];
  airdropsData = airdropsData.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

  const data = airdropsData.map((assets: Airdrops) => {
    return [
      { name: assets.name },
      { round: assets.round },
      { quantity: convertToFloatValue(assets?.quantity) + ' ' + assets?.symbol },
      {
        value: '$' + convertToFloatValue(assets?.value),
      },
    ];
  });

  return {
    titles: ['Name', 'Round', 'Reward', 'Value'],
    data: data,
    total: '$' + getAirdropTotal(),
    totalValue: parseFloat(getAirdropTotal()),
  };
};
