import { useEffect ,useState } from 'react';
import { convertToFloatValue } from '../../utils/convertFloat';
import { CheckBox, Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText} from '../dashboardStyles';
import { Flex } from '@contco/core-ui';

const HEADING_TEXT = `Apollo Vaults`;
const HIDE_KEY = "hide_small_pool";
const HIDDEN_STATE = "hidden";
const SMALL_VISIBLE_STATE = "visible";

const VaultTitles = ['Name', 'Staked', 'Value'];

export interface VaultProps {
  apolloAssets: ApolloAccount;
}

const ApolloVaults: React.FC<VaultProps> = ({apolloAssets}) => {
  const [hideSmall, setHideSmall] = useState(false);
  const [apolloVaults, setApolloVaults] = useState([]);

  useEffect(() => {
    const localHideSmallState = localStorage.getItem(HIDE_KEY);
    setHideSmall(localHideSmallState === HIDDEN_STATE);
  }, []);


  useEffect(() => {
    const vaults = apolloAssets.vaults.sort((a, b) => parseFloat(b.stakedLpUstValue) - (parseFloat(a.stakedLpUstValue)));
    if (hideSmall) {
       const hidePoolsHoldings = vaults.filter((a: ApolloVault) => parseFloat(a.stakedLpUstValue) >= 1);
       setApolloVaults(hidePoolsHoldings);
    }
    else{
        setApolloVaults(vaults);
    }
  }, [apolloAssets?.vaults, hideSmall]);


  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
    const hiddenState = e.target.checked ? HIDDEN_STATE : SMALL_VISIBLE_STATE;
    localStorage.setItem(HIDE_KEY, hiddenState);
  };

  const getVaults = () => {
    return apolloVaults.map((assets: ApolloVault, index) => (
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
        <StyledText> ${convertToFloatValue(assets?.stakedLpUstValue)}</StyledText>
      </Row>
    ));
  };

  if(apolloAssets?.vaults.length === 0) {
      return <> </>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex alignItems="flex-end">
          <StyledText>${convertToFloatValue(apolloAssets.total)}</StyledText>
          <Flex justifyContent="center" alignItems="center">
              <CheckBox type="checkbox" onChange={handleChange} checked={hideSmall} />
              <StyledText pt={1}>Hide small balances</StyledText>
          </Flex>
        </Flex>
      </HeadingWrapper>
      <Row>
        {VaultTitles.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getVaults()}
    </Wrapper>
  );
};

export default ApolloVaults;
