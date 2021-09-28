import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Header from '../../components/DashboardComponents/Header';
import Section from '../../components/DashboardComponents/Section';

const HEADING_TEXT = `StarTerra Farms`;

export interface StarProps {
  farm: any;
}

const StarTerraFarms: React.FC<StarProps> = ({ farm }) => {
  if (JSON.stringify(farm) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={farm.total} />
      </HeadingWrapper>
      <TitleContainer titles={farm.titles} />
      <Section data={farm.data} />
    </Wrapper>
  );
};

export default StarTerraFarms;
