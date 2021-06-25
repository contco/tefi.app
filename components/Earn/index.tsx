import React from 'react';
import { css } from 'styled-components';
import { EarnTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';

const HEADING_TEXT = `Earn`;

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
        <StyledText>${earn?.reward?.staked || 0}</StyledText>
      </HeadingWrapper>
      <Row>
        {EarnTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>

      <Row>
        <StyledText>{earn?.reward?.staked} UST</StyledText>
        <StyledText css={CSS_NET_APR}>{earn?.reward?.apy}%</StyledText>
      </Row>
    </Wrapper>
  );
};

export default Earn;
