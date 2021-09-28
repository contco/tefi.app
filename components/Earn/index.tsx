import React from 'react';
import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, HeadingWrapper, Heading } from '../dashboardStyles';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Anchor Earn`;
export interface EarnProps {
  earn: any;
}

const Earn: React.FC<EarnProps> = ({ earn }) => {
  if (JSON.stringify(earn) === '{}') return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header data={earn.total} />
      </HeadingWrapper>
      <TitleContainer titles={earn.titles} />
      <Section data={earn.data} />
    </Wrapper>
  );
};

export default Earn;
