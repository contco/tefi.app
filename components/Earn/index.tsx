import React from 'react';
import { css } from 'styled-components';
import { EarnTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import TitleContainer from '../DashboardComponents/TitleContainer';
import { Wrapper, Row, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';

const HEADING_TEXT = `Anchor Earn`;

const CSS_NET_APR = (props) =>
  css({
    fontWeight: 500,
    color: props.theme.colors.secondary,
  });

export interface EarnProps {
  ancAssets: AccountAnc;
}

const Earn: React.FC<EarnProps> = ({ ancAssets }) => {
  const earn: EarnData = ancAssets?.earn;

  if (parseFloat(earn?.reward?.staked) <= 0) return <></>;

  return (
    <Wrapper
      css={`
        ${css({ mb: 0 })}
      `}
    >
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${convertToFloatValue(earn?.reward?.staked) || 0}</StyledText>
      </HeadingWrapper>
      <TitleContainer titles={EarnTitle} />

      <Row>
        <StyledText>{convertToFloatValue(earn?.reward?.staked)} UST</StyledText>
        <StyledText css={CSS_NET_APR}>{convertToFloatValue(earn?.reward?.apy)}%</StyledText>
      </Row>
    </Wrapper>
  );
};

export default Earn;
