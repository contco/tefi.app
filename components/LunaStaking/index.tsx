import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Section from '../../components/DashboardComponents/Section';

const HEADING_TEXT = `Luna Staking`;
export interface AssetsProps {
  staking: any;
}

const Assets: React.FC<AssetsProps> = ({ staking }: AssetsProps) => {
  if (JSON.stringify(staking) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={staking.total} />
      </HeadingWrapper>
      <TitleContainer titles={staking.titles} />
      <Section data={staking.data} />
    </Wrapper>
  );
};

export default Assets;
