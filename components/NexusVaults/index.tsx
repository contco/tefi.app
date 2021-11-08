import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';
import TitleContainer from '../DashboardComponents/TitleContainer';

const HEADING_TEXT = `Nexus Vaults`;

export interface VaultProps {
  nexus: any;
}

const NexusVaults: React.FC<VaultProps> = ({ nexus }) => {
  if (!nexus || nexus?.data?.length === 0) {
    return <> </>;
  }
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={nexus.total} />
      </HeadingWrapper>
      <TitleContainer titles={nexus.titles} />
      <Section data={nexus.data} />
    </Wrapper>
  );
};

export default NexusVaults;
