import { RewardsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, StyledText, SubText, CSS_APR } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import { times } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Box } from '@contco/core-ui';
import TitleContainer from '../DashboardComponents/TitleContainer';
import LpContainer from '../DashboardComponents/LpContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';

const HEADING_TEXT = `Rewards`;
export interface RewardsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  pylonAssets: PylonAccount;
  spectrum: SpectrumAccount;
  loterra: LoterraAccount;
}

const Rewards: React.FC<RewardsProps> = ({ ancAssets, mirrorAssets, pylonAssets, spectrum, loterra }) => {
  const borrowRewards = ancAssets?.debt?.reward;
  const totalReward = ancAssets?.totalReward;

  const getRewardsTotal = () => {
    const ancTotal = totalReward;
    const mirrorTotal = mirrorAssets?.total?.mirrorPoolRewardsSum;
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolRewardsSum;
    const loterraRewards = loterra?.lotaGov?.rewardsValue ?? '0';
    const total =
      parseFloat(mirrorTotal) + parseFloat(ancTotal) + parseFloat(pylonPoolTotal) + parseFloat(loterraRewards);
    return convertToFloatValue(total.toString()) ?? 0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const pool = [...pylonAssets?.pylonPool, ...mirrorAssets?.mirrorStaking, ...ancAssets.pool].sort(
    (a, b) => b.rewardsValue - a.rewardsValue,
  );

  const govData = [pylonAssets?.gov, spectrum?.specGov, mirrorAssets?.gov, ancAssets?.gov, loterra?.lotaGov]
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

    govData?.map((item: Gov) => {
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

    const anchorBorrowValue = parseFloat(ancAssets?.debt?.value);
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

  const getPool = () => {
    if (pool && pool.length > 0) {
      return pool.map((assets: Pool, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500">{assets?.lpName}</StyledText>
          <LpContainer
            lp={convertToFloatValue(assets?.stakedLp) + ' LP'}
            token1={convertToFloatValue(assets?.token2Staked) + ' ' + assets?.symbol2}
            token2={convertToFloatValue(assets?.token1Staked) + ' ' + assets?.symbol1}
          />
          <div>
            <StyledText css={CSS_APR}> {assets?.apy ? formatApr(assets?.apy) : formatApr(assets?.apr)}%</StyledText>
            {assets?.apy ? <SubText> (APY)</SubText> : null}
          </div>
          <AssetContainer
            token={convertToFloatValue(assets?.rewards) + ' ' + assets?.rewardsSymbol}
            tokenValue={'$' + convertToFloatValue(assets?.rewardsValue)}
          />
        </Row>
      ));
    }
    return null;
  };

  const displayGovData = () => {
    return govData?.map((govItem: Gov) => {
      return (
        <Row key={govItem.name}>
          <StyledText fontWeight="500"> {govItem.name}</StyledText>
          <AssetContainer
            token={convertToFloatValue(govItem.staked) + ' ' + govItem.symbol}
            tokenValue={'$' + convertToFloatValue(govItem.value)}
          />
          <div>
            <StyledText css={CSS_APR}>
              {' '}
              {govItem?.apy ? convertToFloatValue(govItem?.apy) : convertToFloatValue(govItem?.apr)}%
            </StyledText>
            {govItem?.apy ? <SubText> (APY)</SubText> : null}
          </div>
          {govItem.symbol === 'LOTA' ? (
            <AssetContainer
              token={convertToFloatValue(govItem?.rewards) + ' ' + govItem.symbol}
              tokenValue={'$' + convertToFloatValue(govItem?.rewardsValue)}
            />
          ) : (
            <StyledText>
              Automatically <br />
              re-staked
            </StyledText>
          )}
        </Row>
      );
    });
  };

  const estimate = rewardEstimates();
  const headerData = Object.keys(estimate).map((key) => {
    return {
      name: key,
      value: '$' + convertToFloatValue(estimate[key]),
    };
  });

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={headerData} />
      </HeadingWrapper>
      <TitleContainer titles={RewardsTitle} />
      {getPool()}
      {parseFloat(ancAssets.debt?.value) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {borrowRewards?.name}</StyledText>
          <StyledText>{'N/A'}</StyledText>
          <StyledText css={CSS_APR}> {borrowRewards?.apy}%</StyledText>
          <Box>
            <StyledText>{borrowRewards?.reward} ANC</StyledText>
            <SubText>
              $
              {borrowRewards?.reward === '<0.001'
                ? 0
                : (parseFloat(borrowRewards?.reward) * parseFloat(ancAssets?.debt?.ancprice)).toFixed(3)}
            </SubText>
          </Box>
        </Row>
      ) : null}
      {displayGovData()}
    </Wrapper>
  );
};

export default Rewards;
