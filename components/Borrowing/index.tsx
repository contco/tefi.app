import css from '@styled-system/css';
import { BorrowingTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { Flex } from '@contco/core-ui';
import Styled from 'styled-components';
import PercentageBar from '../PercentageBar';

const HEADING_TEXT = `Borrowing`;

const CSS_NET_APR = (props) =>
  css({
    fontWeight: 500,
    color: props.theme.colors.secondary,
  });

const StyledPercentage = Styled(Flex)`
 ${css({
   justifyContent: 'center',
   py: [20, 30, null, 80],
   px: [20, 40, null, 60],
 })}
`;

export interface BorrowingProps {
  ancAssets: AccountAnc;
}

const Borrowing: React.SFC<BorrowingProps> = ({ ancAssets }) => {
  const borrow: BorrowData = ancAssets.debt;

  return (
    <Wrapper
      css={`
        ${css({ mb: 0 })}
      `}
    >
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${parseFloat(borrow?.value).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
        {BorrowingTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>

      {borrow?.collaterals ? (
        <Row>
          <StyledText> {(parseFloat(borrow?.collaterals[0]?.balance) / 1000000).toFixed(3)} LUNA</StyledText>
          <StyledText> ${parseFloat(borrow?.value).toFixed(3)}</StyledText>
          <StyledText css={CSS_NET_APR}> {borrow?.reward?.apy}%</StyledText>
        </Row>
      ) : null}

      <StyledPercentage>
        <PercentageBar percentageValue={52.21} />
      </StyledPercentage>
    </Wrapper>
  );
};

export default Borrowing;
