import { PoolsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets }) => {
  const pools = [ancAssets?.pool];

  const getPoolTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.stakedSum;
    return mirrorTotal ?? '0';
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${parseFloat(getPoolTotal()).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
        {PoolsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {pools?.map((a: LpData, index: number) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {a?.reward?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(a?.reward.staked).toFixed(3)} LP
            <HoverText>
              {parseFloat(a?.anc).toFixed(3)} {'ANC'} <br />
              {parseFloat(a?.ust).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText>${parseFloat(a?.value).toFixed(3)}</StyledText>
        </Row>
      ))}
      {mirrorAssets?.assets.map((assets: MirrorAccountAssets, index) => (
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
