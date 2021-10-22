import { useEffect, useState } from 'react';
import { CheckBox, Wrapper, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';
import { Flex } from '@contco/core-ui';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';
import TitleContainer from '../DashboardComponents/TitleContainer';

const HEADING_TEXT = `Apollo Vaults`;
const HIDE_KEY = 'hide_small_pool';
const HIDDEN_STATE = 'hidden';
const SMALL_VISIBLE_STATE = 'visible';

export interface VaultProps {
  apolloAssets: any;
}

const ApolloVaults: React.FC<VaultProps> = ({ apolloAssets }) => {
  const [apolloVaults, setApolloVaultsData] = useState([]);
  const [hideSmall, setHideSmall] = useState(false);

  useEffect(() => {
    const localHideSmallState = localStorage.getItem(HIDE_KEY);
    setHideSmall(localHideSmallState === HIDDEN_STATE);
    setApolloVaultsData(localHideSmallState === HIDDEN_STATE ? apolloAssets?.largeData : apolloAssets.data);
  }, []);

  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
    const hiddenState = e.target.checked ? HIDDEN_STATE : SMALL_VISIBLE_STATE;
    setApolloVaultsData(e.target.checked ? apolloAssets.largeData : apolloAssets.data);
    localStorage.setItem(HIDE_KEY, hiddenState);
  };

  if (apolloAssets?.data?.length === 0) {
    return <> </>;
  }
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex alignItems="flex-end">
          <Header data={apolloAssets?.total || '0'} />
          <Flex justifyContent="center" alignItems="center">
            <CheckBox type="checkbox" onChange={handleChange} checked={hideSmall} />
            <StyledText pt={1}>Hide small balances</StyledText>
          </Flex>
        </Flex>
      </HeadingWrapper>
      <TitleContainer titles={apolloAssets.titles} />
      <Section data={apolloVaults} />
    </Wrapper>
  );
};

export default ApolloVaults;
