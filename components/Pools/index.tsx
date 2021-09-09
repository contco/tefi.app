import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Pools`;

export interface PoolsProps {
  pools: any;
}

const Pools: React.FC<PoolsProps> = ({ pools }) => {
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={pools.total} />
      </HeadingWrapper>
      <TitleContainer titles={pools.titles} />
      <Section data={pools.data} />
    </Wrapper>
  );
};

export default Pools;
