import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Spectrum Farms`;

export interface SpectrumProps {
  farm: any;
}

const SpectrumFarms: React.FC<SpectrumProps> = ({ farm }) => {
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

export default SpectrumFarms;
