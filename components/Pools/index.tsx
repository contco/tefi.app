import { PoolsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  mirrorAssets: any;
  ancAssets: any;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets }) => {
  const pools = [ancAssets.pool];

  const getPoolTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.stakedSum;
    return mirrorTotal ?? 0;
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${parseInt(getPoolTotal()).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
        {PoolsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {pools?.map((a, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {a.reward.name}</StyledText>
          <StyledText isChildren={true}>{parseFloat(a.staked).toFixed(3)}</StyledText>
          <StyledText> {parseFloat(a.balance).toFixed(3)}</StyledText>
        </Row>
      ))}
      {mirrorAssets?.assets.map((assets, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {assets?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseInt(assets?.lpBalance)} LP
            <HoverText>
              {parseInt(assets?.tokenStaked).toFixed(3)} {assets?.symbol} <br />
              {parseInt(assets?.ustStaked).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText> ${parseInt(assets?.stakeTotalUstValue).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Pools;
