import { useEffect ,useState } from 'react';
import { PoolsTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { CheckBox, Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';
import { Flex } from '@contco/core-ui';
const HEADING_TEXT = `Pools`;
const HIDE_KEY = "hide_small_pool";
const HIDDEN_STATE = "hidden";
const SMALL_VISIBLE_STATE = "visible";

export interface PoolsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  pylonAssets: PylonAccount;
  terraSwapAssets: terrSwapAccount;
}

const Pools: React.FC<PoolsProps> = ({ mirrorAssets, ancAssets, pylonAssets, terraSwapAssets }) => {
  const [hideSmall, setHideSmall] = useState(false);
  const [poolsHoldings, setPoolsHoldings] = useState([]);

  useEffect(() => {
    const localHideSmallState = localStorage.getItem(HIDE_KEY);
    setHideSmall(localHideSmallState === HIDDEN_STATE);
  }, []);
  useEffect(() => {
    const pool = [...pylonAssets?.pylonPool, ...mirrorAssets?.mirrorStaking, ...ancAssets.pool, ...terraSwapAssets.list].sort(
      (a, b) =>
        parseFloat(b.stakeableLpUstValue) +
        parseFloat(b.stakedLpUstValue) -
        (parseFloat(a.stakeableLpUstValue) + parseFloat(a.stakedLpUstValue)),
    );
    if (hideSmall) {
       const hidePoolsHoldings = pool.filter((a: Pool) => (parseFloat(a.stakeableLpUstValue) + parseFloat(a.stakedLpUstValue)) >= 1);
       setPoolsHoldings(hidePoolsHoldings);
    }
    else{
      setPoolsHoldings(pool);
    }
  }, [mirrorAssets,ancAssets,pylonAssets,terraSwapAssets,hideSmall]);

  const getPoolTotal = () => {
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolSum;
    const total = (
      parseFloat(pylonPoolTotal) +
      parseFloat(mirrorAssets?.total?.mirrorPoolSum) +
      parseFloat(ancAssets?.total?.anchorPoolSum) +
      parseFloat(terraSwapAssets.total)
    )
    return convertToFloatValue(total.toString()) ?? '0';
  };
  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
    const hiddenState = e.target.checked ? HIDDEN_STATE : SMALL_VISIBLE_STATE;
    localStorage.setItem(HIDE_KEY, hiddenState);
  };

  const getPool = () => {
    
    return poolsHoldings.map((assets: Pool, index) => (
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
              {convertToFloatValue(assets?.token1UnStaked)} {assets.symbol1}
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
        <Flex alignItems="flex-end">
          <StyledText>${getPoolTotal()}</StyledText>
          <Flex justifyContent="center" alignItems="center">
              <CheckBox type="checkbox" onChange={handleChange} checked={hideSmall} />
              <StyledText pt={1}>Hide small balances</StyledText>
          </Flex>
        </Flex>
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
