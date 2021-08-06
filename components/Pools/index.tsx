import { PoolsTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  pylonAssets: PylonAccount;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets, pylonAssets }) => {
  const getPoolTotal = () => {
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolSum;
    const total = (
      parseFloat(pylonPoolTotal) +
      parseFloat(mirrorAssets?.total?.mirrorPoolSum) +
      parseFloat(ancAssets?.total?.anchorPoolSum)
    )
    return convertToFloatValue(total.toString()) ?? '0';
  };

  const getPool = () => {
    const pool = [...pylonAssets?.pylonPool, ...mirrorAssets?.mirrorStaking, ...ancAssets.pool].sort(
      (a, b) =>
        parseFloat(b.stakeableLpUstValue) +
        parseFloat(b.stakedLpUstValue) -
        (parseFloat(a.stakeableLpUstValue) + parseFloat(a.stakedLpUstValue)),
    );
    return pool.map((assets: Pool, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {assets?.lpName}</StyledText>
        {assets?.stakedLp !== "0" ?
          <StyledText isChildren={true}>
            {convertToFloatValue(assets?.stakedLp)} LP
            <HoverText>
              {convertToFloatValue(assets?.token2Staked)} {assets?.symbol2} <br />
              {convertToFloatValue(assets?.token1Staked)} {assets.symbol1}
            </HoverText>
          </StyledText>
          : <StyledText>-</StyledText>}
        {assets?.stakeableLp !== "0" ?
          <StyledText isChildren={true}>
            {convertToFloatValue(assets?.stakeableLp)} LP
            <HoverText>
              {convertToFloatValue(assets?.token2UnStaked)} {assets?.symbol2} <br />
              {convertToFloatValue(assets?.token1Staked)} {assets.symbol1}
            </HoverText>

          </StyledText>
          : <StyledText>-</StyledText>
        }
        <StyledText> ${convertToFloatValue(assets?.totalLpUstValue)}</StyledText>
      </Row>
    ));
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getPoolTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
        {PoolsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getPool()}
    </Wrapper>
  );
};

export default Pools;
