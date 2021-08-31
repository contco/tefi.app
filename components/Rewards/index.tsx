import { RewardsTitle } from '../../constants';
import {
  Wrapper,
  Row,
  HeadingWrapper,
  Heading,
  Title,
  StyledText,
  HoverText,
  SubText,
  CSS_APR,
  StyledTextContainer,
  SimpleText,
} from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Box, Flex } from '@contco/core-ui';

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
        const daily = (apr / 36500) * value;
        const monthly = daily * 30;
        const yearly = (apr / 100) * value;

        dailyTotal += daily;
        monthlyTotal += monthly;
        yearlyTotal += yearly;
      }
    });

    govData?.map((item: Gov) => {
      console.log('assets', item);

      const value = parseFloat(item?.value);
      const apr = parseFloat(item?.apr || item?.apy);
      if (value && apr) {
        const daily = (apr / 36500) * value;
        const monthly = daily * 30;
        const yearly = (apr / 100) * value;

        console.log(daily, monthly, yearly);

        dailyTotal += daily;
        monthlyTotal += monthly;
        yearlyTotal += yearly;
      }
    });

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
          <StyledText isChildren={true}>
            {' '}
            {convertToFloatValue(assets?.stakedLp)} LP
            <HoverText>
              {convertToFloatValue(assets?.token2Staked)} {assets?.symbol2} <br />
              {convertToFloatValue(assets?.token1Staked)} {assets?.symbol1}
            </HoverText>
          </StyledText>
          <div>
            <StyledText css={CSS_APR}> {assets?.apy ? formatApr(assets?.apy) : formatApr(assets?.apr)}%</StyledText>
            {assets?.apy ? <SubText> (APY)</SubText> : null}
          </div>
          <div>
            <StyledText>
              {convertToFloatValue(assets?.rewards)} {assets?.rewardsSymbol}
            </StyledText>
            <SubText>${convertToFloatValue(assets?.rewardsValue)}</SubText>
          </div>
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
          <Box>
            <StyledText>
              {convertToFloatValue(govItem.staked)} {govItem.symbol}
            </StyledText>
            <SubText>${convertToFloatValue(govItem.value)}</SubText>
          </Box>
          <div>
            <StyledText css={CSS_APR}>
              {' '}
              {govItem?.apy ? convertToFloatValue(govItem?.apy) : convertToFloatValue(govItem?.apr)}%
            </StyledText>
            {govItem?.apy ? <SubText> (APY)</SubText> : null}
          </div>
          {govItem.symbol === 'LOTA' ? (
            <div>
              <StyledText>
                {convertToFloatValue(govItem?.rewards)} {govItem.symbol}
              </StyledText>
              <SubText>${convertToFloatValue(govItem?.rewardsValue)}</SubText>
            </div>
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

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex>
          {Object.keys(estimate).map((key, index) => (
            <StyledTextContainer key={index}>
              <SimpleText>
                <b>{key}:</b> &nbsp;
              </SimpleText>
              <SimpleText>${convertToFloatValue(estimate[key])}</SimpleText>
            </StyledTextContainer>
          ))}
        </Flex>
      </HeadingWrapper>
      <Row>
        {RewardsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
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
