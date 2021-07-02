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
    const total = (parseFloat(mirrorAssets?.total?.stakedSum) + parseFloat(pool?.stakedValue) + parseFloat(pool?.stakableValue)).toFixed(3);
    return total ?? '0';
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
