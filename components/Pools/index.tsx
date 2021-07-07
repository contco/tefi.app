import { PoolsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  pylonAssets: PylonAccount;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets, pylonAssets }) => {
  const pool = ancAssets?.pool;

  const getPoolTotal = () => {
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolSum;
    const total = (parseFloat(pylonPoolTotal) + parseFloat(mirrorAssets?.total?.stakedSum) + parseFloat(pool?.stakedValue) + parseFloat(pool?.stakableValue)).toFixed(3);
    return total ?? '0';
  };

  const getPylonPool = () => {
    if(pylonAssets?.pylonPool) {
      return pylonAssets?.pylonPool.map((assets: PylonPool, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {assets?.lpName}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(assets?.stakedLP + assets?.availableLP).toFixed(3)} LP
            <HoverText>
              {parseFloat(assets?.tokenStaked + assets?.tokenUnStaked).toFixed(3)} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked + assets?.ustUnStaked).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText> ${parseFloat(assets?.stakedLpUstValue + assets?.availableLpUstValue).toFixed(3)}</StyledText>
        </Row>
      ))}
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
      {getPylonPool()}

      {pool?.balance ? (
        <Row>
          <StyledText fontWeight={500}> {pool?.reward?.name}</StyledText>
          <StyledText >
            {(parseFloat(pool?.balance) + parseFloat(pool?.reward?.staked)).toFixed(3)} {'LP'}
          </StyledText>
          <StyledText>${(parseFloat(pool?.stakableValue) + parseFloat(pool?.stakedValue)).toFixed(3)}</StyledText>
        </Row>
      ) : null}

      {mirrorAssets?.mirrorStaking.map((assets: MirrorStaking, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {assets?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(assets?.lpBalance).toFixed(3)} LP
            <HoverText>
              {parseFloat(assets?.tokenStaked).toFixed(3)} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText> ${parseFloat(assets?.stakeTotalUstValue).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Pools;
