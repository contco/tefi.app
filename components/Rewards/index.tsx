import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

import TitleContainer from '../DashboardComponents/TitleContainer';

const HEADING_TEXT = `Rewards`;
export interface RewardsProps {
  rewards: any;
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={rewards.total} />
      </HeadingWrapper>
      <TitleContainer titles={rewards.titles} />
      <Section data={rewards.data} />
    </Wrapper>
  );
};

export default Rewards;
