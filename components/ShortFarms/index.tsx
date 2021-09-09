import { Heading, HeadingWrapper, Wrapper } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import Section from '../../components/DashboardComponents/Section';
import TitleContainer from '../DashboardComponents/TitleContainer';

const HEADING_TEXT = 'Mirror Short Farms';
export interface ShortFarmProps {
  short: any;
}

const ShortFarms: React.FC<ShortFarmProps> = ({ short }) => {
  if (JSON.stringify(short) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={short.total} />
      </HeadingWrapper>
      <TitleContainer titles={short.titles} />
      <Section data={short.data} />
    </Wrapper>
  );
};

export default ShortFarms;
