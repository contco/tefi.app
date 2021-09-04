import { PoolsTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import LpContainer from '../DashboardComponents/LpContainer';
import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, Row, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  pylonAssets: PylonAccount;
  terraSwapAssets: terrSwapAccount;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets, pylonAssets, terraSwapAssets }) => {
  const getPoolTotal = () => {
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolSum;
    const total =
      parseFloat(pylonPoolTotal) +
      parseFloat(mirrorAssets?.total?.mirrorPoolSum) +
      parseFloat(ancAssets?.total?.anchorPoolSum) +
      parseFloat(terraSwapAssets.total);
    return convertToFloatValue(total.toString()) ?? '0';
  };

  const getPool = () => {
    const pool = [
      ...pylonAssets?.pylonPool,
      ...mirrorAssets?.mirrorStaking,
      ...ancAssets.pool,
      ...terraSwapAssets.list,
    ].sort(
      (a, b) =>
        parseFloat(b.stakeableLpUstValue) +
        parseFloat(b.stakedLpUstValue) -
        (parseFloat(a.stakeableLpUstValue) + parseFloat(a.stakedLpUstValue)),
    );
    return pool.map((assets: Pool, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {assets?.lpName}</StyledText>
        {assets?.stakedLp !== '0' ? (
          <LpContainer
            lp={convertToFloatValue(assets?.stakedLp) + ' LP'}
            token1={convertToFloatValue(assets?.token2Staked) + ' ' + assets?.symbol2}
            token2={convertToFloatValue(assets?.token1Staked) + ' ' + assets.symbol1}
          />
        ) : (
          <StyledText>-</StyledText>
        )}
        {assets?.stakeableLp !== '0' ? (
          <LpContainer
            lp={convertToFloatValue(assets?.stakeableLp) + ' LP'}
            token1={convertToFloatValue(assets?.token2UnStaked) + ' ' + assets?.symbol2}
            token2={convertToFloatValue(assets?.token1UnStaked) + ' ' + assets.symbol1}
          />
        ) : (
          <StyledText>-</StyledText>
        )}
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
      <TitleContainer titles={PoolsTitle} />
      {getPool()}
    </Wrapper>
  );
};

export default Pools;
