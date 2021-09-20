import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, HeadingWrapper, Heading, CheckBox, StyledText } from '../dashboardStyles';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';
import { useEffect, useState } from 'react';
import { Flex } from '@contco/core-ui';

const HEADING_TEXT = `Pools`;
const HIDE_KEY = 'hide_small_pool';
const HIDDEN_STATE = 'hidden';
const SMALL_VISIBLE_STATE = 'visible';

export interface PoolsProps {
  pools: any;
}

const Pools: React.FC<PoolsProps> = ({ pools }) => {
  const [data, setData] = useState([]);
  const [hideSmall, setHideSmall] = useState(false);

  useEffect(() => {
    const localHideSmallState = localStorage.getItem(HIDE_KEY);
    setHideSmall(localHideSmallState === HIDDEN_STATE);
    setData(localHideSmallState === HIDDEN_STATE ? pools?.largeData : pools.data);
  }, []);

  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
    const hiddenState = e.target.checked ? HIDDEN_STATE : SMALL_VISIBLE_STATE;
    setData(e.target.checked ? pools.largeData : pools.data);
    localStorage.setItem(HIDE_KEY, hiddenState);
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex alignItems="flex-end">
          <Header data={pools?.total || '0'} />
          <Flex justifyContent="center" alignItems="center">
            <CheckBox type="checkbox" onChange={handleChange} checked={hideSmall} />
            <StyledText pt={1}>Hide small balances</StyledText>
          </Flex>
        </Flex>
      </HeadingWrapper>
      <TitleContainer titles={pools.titles} />
      <Section data={data} />
    </Wrapper>
  );
};

export default Pools;
