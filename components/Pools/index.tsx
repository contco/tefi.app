import { PoolsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets }) => {
  const pool = ancAssets?.pool;

  const getPoolTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.stakedSum;
    return mirrorTotal ?? '0';
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${(parseFloat(getPoolTotal()) + parseFloat(pool?.value)).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
        {PoolsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>

      {pool?.reward?.staked ? (
        <Row>
          <StyledText fontWeight={500}> {pool?.reward?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(pool?.reward.staked).toFixed(3)} {'LP'}
            <HoverText>
              {parseFloat(pool?.anc).toFixed(3)} {'ANC'} <br />
              {parseFloat(pool?.ust).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText>${parseFloat(pool?.value).toFixed(3)}</StyledText>
        </Row>
      ) : null}

      {mirrorAssets?.mirrorStaking.map((assets: MirrorStaking, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {assets?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(assets?.lpBalance)} LP
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
