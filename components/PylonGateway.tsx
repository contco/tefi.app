import { Wrapper, HeadingWrapper, Heading } from './dashboardStyles';
import TitleContainer from './DashboardComponents/TitleContainer';
import Header from '../components/DashboardComponents/Header';
import Section from '../components/DashboardComponents/Section';

const HEADING_TEXT = `Pylon Gateway`;
interface Props {
  pylon: any;
}

const PylonGateway: React.FC<Props> = ({ pylon }: Props) => {
  if (JSON.stringify(pylon) === '{}') return <></>;
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={pylon.total} />
      </HeadingWrapper>
      <TitleContainer titles={pylon.titles} />
      <Section data={pylon.data} />
    </Wrapper>
  );
};

export default PylonGateway;
