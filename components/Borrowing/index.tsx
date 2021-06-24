import css from '@styled-system/css';
import { BorrowingTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, Gap } from '../dashboardStyles';
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
  const collateralValue = borrow.collaterals
    ? (parseFloat(borrow?.collaterals[0]?.balance) / 1000000) * parseFloat(borrow.price)
    : 0;

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
          <StyledText> ${collateralValue.toFixed(3)}</StyledText>
          <StyledText> ${parseFloat(borrow?.value).toFixed(3)}</StyledText>
          <StyledText css={CSS_NET_APR}> {borrow?.reward?.apy}%</StyledText>
        </Row>
      ) : null}

      {borrow?.collaterals ? (
        <StyledPercentage>
          <PercentageBar percentageValue={parseFloat(parseFloat(borrow?.percentage).toFixed(2))} />
        </StyledPercentage>
      ) : (
        <Gap />
      )}
    </Wrapper>
  );
};

export default Borrowing;
