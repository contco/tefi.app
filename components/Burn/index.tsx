import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import Section from '../../components/DashboardComponents/Section';
import TitleContainer from '../DashboardComponents/TitleContainer';
const HEADING_TEXT = `Anchor Bond`;

export interface BurnProps {
  burn: any;
}

const Earn: React.FC<BurnProps> = ({ burn }) => {
  if (JSON.stringify(burn) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={burn.total} />
      </HeadingWrapper>
      <TitleContainer titles={burn.titles} />
      <Section data={burn.data} />
    </Wrapper>
  );
};

export default Earn;
