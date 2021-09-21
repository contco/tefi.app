import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Spectrum Rewards`;

export interface SpectrumProps {
  reward: any;
}

const SpectrumRewards: React.FC<SpectrumProps> = ({ reward }) => {
  if (JSON.stringify(reward) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={reward.total} />
      </HeadingWrapper>
      <TitleContainer titles={reward.titles} />
      <Section data={reward.data} />
    </Wrapper>
  );
};

export default SpectrumRewards;
