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
        parseFloat(b.availableLpUstValue) +
        parseFloat(b.stakedLpUstValue) -
        (parseFloat(a.availableLpUstValue) + parseFloat(a.stakedLpUstValue)),
    );
    return pool.map((assets: Pool, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {assets?.lpName}</StyledText>
        <StyledText isChildren={true}>
          {convertToFloatValue(assets?.stakedLP + assets?.availableLP)} LP
          <HoverText>
            {convertToFloatValue(assets?.tokenStaked + assets?.tokenUnStaked)} {assets?.symbol} <br />
            {convertToFloatValue(assets?.ustStaked + assets?.ustUnStaked)} {'UST'}
          </HoverText>
        </StyledText>
        <StyledText> ${convertToFloatValue(assets?.stakedLpUstValue + assets?.availableLpUstValue)}</StyledText>
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
