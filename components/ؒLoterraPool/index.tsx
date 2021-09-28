import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `LoTerra Pool`;

export interface Props {
  loterra: any;
}

const Loterra: React.FC<Props> = ({ loterra }) => {
  console.log(loterra, loterra);
  if (loterra === null) {
    return <> </>;
  }
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
      </HeadingWrapper>
      <TitleContainer titles={loterra.titles} />
      <Section data={loterra.data} />
    </Wrapper>
  );
};

export default Loterra;
