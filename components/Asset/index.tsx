import { useEffect, useState } from 'react';
import { Wrapper, HeadingWrapper, Heading, CheckBox, StyledText } from '../dashboardStyles';
import { Flex } from '@contco/core-ui';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Assets`;
const HIDE_KEY = 'hide_small';
const HIDDEN_STATE = 'hidden';
const SMALL_VISIBLE_STATE = 'visible';

export interface AssetsProps {
  assets: any;
}

const Assets: React.FC<AssetsProps> = ({ assets }: AssetsProps) => {
  const [data, setData] = useState([]);
  const [hideSmall, setHideSmall] = useState(false);

  useEffect(() => {
    const localHideSmallState = localStorage.getItem(HIDE_KEY);
    setHideSmall(localHideSmallState === HIDDEN_STATE);
    setData(localHideSmallState === HIDDEN_STATE ? assets?.largeData : assets.data);
  }, []);

  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
    const hiddenState = e.target.checked ? HIDDEN_STATE : SMALL_VISIBLE_STATE;
    setData(e.target.checked ? assets.largeData : assets.data);
    localStorage.setItem(HIDE_KEY, hiddenState);
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex alignItems="flex-end">
          <Header data={assets?.total || '0'} />
          <Flex justifyContent="center" alignItems="center">
            <CheckBox type="checkbox" onChange={handleChange} checked={hideSmall} />
            <StyledText pt={1}>Hide small balances</StyledText>
          </Flex>
        </Flex>
      </HeadingWrapper>
      <TitleContainer titles={assets.titles} />
      <Section data={data} />
    </Wrapper>
  );
};

export default Assets;
