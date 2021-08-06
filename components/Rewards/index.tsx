import { RewardsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText, SubText, CSS_APR } from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Box } from '@contco/core-ui';
import loterra from '../../pages/api/loterra';
const HEADING_TEXT = `Rewards`;
export interface RewardsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  pylonAssets: PylonAccount;
  spectrum: SpectrumAccount;
  loterra: LoterraAccount
}

const Rewards: React.FC<RewardsProps> = ({ ancAssets, mirrorAssets, pylonAssets, spectrum, loterra }) => {
  const borrowRewards = ancAssets?.debt?.reward;
  const totalReward = ancAssets?.totalReward;

  const getRewardsTotal = () => {
    const ancTotal = totalReward;
    const mirrorTotal = mirrorAssets?.total?.mirrorPoolRewardsSum;
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolRewardsSum;
    const loterraRewards = loterra?.lotaGov?.rewardsValue ?? '0';
    const total = (
      parseFloat(mirrorTotal) +
      parseFloat(ancTotal) +
      parseFloat(pylonPoolTotal) +
      parseFloat(loterraRewards)
    );
    return convertToFloatValue(total.toString()) ?? 0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const getPool = () => {
      const pool = [...pylonAssets?.pylonPool, ...mirrorAssets?.mirrorStaking, ...ancAssets.pool].sort(
        (a, b) => b.rewardsValue - a.rewardsValue,
      );
      if(pool && pool.length > 0) {
      return pool.map((assets: Pool, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {assets?.lpName}</StyledText>
          <StyledText isChildren={true}>
            {' '}
            {convertToFloatValue(assets?.stakedLP)} LP
            <HoverText>
              {convertToFloatValue(assets?.tokenStaked)} {assets?.symbol} <br />
              {convertToFloatValue(assets?.ustStaked)} {'UST'}
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
    const govData = [pylonAssets?.gov, spectrum?.specGov, mirrorAssets?.gov, ancAssets?.gov, loterra?.lotaGov].filter(item => item != null).sort((a,b) => parseFloat(b.value) - parseFloat(a.value));
    return govData?.map((govItem: Gov) => {
      return(
        <Row key={govItem.name}>
          <StyledText fontWeight="500"> {govItem.name}</StyledText>
          <Box>
          <StyledText> 
            {convertToFloatValue(govItem.staked)} {govItem.symbol}
          </StyledText>
          <SubText>
              ${convertToFloatValue(govItem.value)}
            </SubText>
          </Box>
          <div>
            <StyledText css={CSS_APR}> {govItem?.apy ? convertToFloatValue(govItem?.apy) : convertToFloatValue(govItem?.apr)}%</StyledText>
            {govItem?.apy ? <SubText> (APY)</SubText> : null}
          </div>
          {govItem.symbol === "LOTA" ? 
            (
            <div>
              <StyledText>
                {convertToFloatValue(govItem?.rewards)} {govItem.symbol}
              </StyledText>
              <SubText>${convertToFloatValue(govItem?.rewardsValue)}</SubText>
            </div>
            )
            :
            <StyledText>
            Automatically <br />
            re-staked
            </StyledText>
          }
        </Row>
      )
    })
    
  }
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getRewardsTotal()}</StyledText>
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
