import css from '@styled-system/css';
import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import { Flex } from '@contco/core-ui';
import Styled from 'styled-components';
import PercentageBar from '../PercentageBar';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Anchor Borrow`;

const StyledPercentage = Styled(Flex)`
 ${css({
   justifyContent: ['flex-start', null, null, null, null, 'center'],
   py: [20, 30, null, 80],
   px: [20, 40, null, 60],
   ml: [55, 30, '5px', null, 15, '0px'],
 })}
`;

export interface BorrowingProps {
  borrow: any;
}

const Borrowing: React.FC<BorrowingProps> = ({ borrow }) => {
  if (JSON.stringify(borrow) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={borrow.total} />
      </HeadingWrapper>
      <TitleContainer titles={borrow.titles} />
      <Section data={borrow.data} />

      <StyledPercentage>
        <PercentageBar percentageValue={borrow.percentage} />
      </StyledPercentage>
    </Wrapper>
  );
};

export default Borrowing;
