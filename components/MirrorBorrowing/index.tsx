import { Heading, HeadingWrapper, Wrapper } from '../dashboardStyles';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Header from '../../components/DashboardComponents/Header';
import Section from '../../components/DashboardComponents/Section';

const HEADING_TEXT = 'Mirror Borrow';

export interface ShortFarmProps {
  borrow: any;
}

const ShortFarms: React.FC<ShortFarmProps> = ({ borrow }) => {
  if (JSON.stringify(borrow) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={borrow.total} />
      </HeadingWrapper>
      <TitleContainer titles={borrow.titles} />
      <Section data={borrow.data} />
    </Wrapper>
  );
};

export default ShortFarms;
