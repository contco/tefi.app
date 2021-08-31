import css from '@styled-system/css';
import { BorrowingTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, SubText } from '../dashboardStyles';
import { Flex } from '@contco/core-ui';
import Styled from 'styled-components';
import PercentageBar from '../PercentageBar';
import { convertToFloatValue } from '../../utils/convertFloat';

const HEADING_TEXT = `Anchor Borrow`;

const CSS_NET_APR = (props) =>
  css({
    fontWeight: 500,
    color: props.theme.colors.secondary,
    fontSize: ['11px', null, null, '14px', null, null, 16],
  });

const StyledPercentage = Styled(Flex)`
 ${css({
   justifyContent: ['flex-start', null, null, null, null, 'center'],
   py: [20, 30, null, 80],
   px: [20, 40, null, 60],
   ml: [55, 30, '5px', null, 15, '0px'],
 })}
`;

export interface BorrowingProps {
  ancAssets: AccountAnc;
}

const Borrowing: React.SFC<BorrowingProps> = ({ ancAssets }) => {
  const borrow: BorrowData = ancAssets.debt;


  if (!borrow?.collaterals) return <></>;

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${convertToFloatValue(borrow?.value)}</StyledText>
      </HeadingWrapper>
      <Row>
        {BorrowingTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>

      <Row>
          <div>
            { borrow.collaterals.map((item, index)=>(
                <>
                <StyledText> {convertToFloatValue(item.balance)} {item.symbol}</StyledText>
                <SubText>${convertToFloatValue(item.value)}</SubText>
                {index < borrow.collaterals.length - 1 ? <br></br> : null }
                </>
            ))}
          </div>
        <StyledText> ${convertToFloatValue(borrow?.totalCollateralValue)}</StyledText>
        <StyledText> ${convertToFloatValue(borrow?.value)}</StyledText>
        <StyledText css={CSS_NET_APR}> {convertToFloatValue(borrow?.netApy)}%</StyledText>
      </Row>

      <StyledPercentage>
        <PercentageBar percentageValue={parseFloat(parseFloat(borrow?.percentage).toFixed(2))} />
      </StyledPercentage>
    </Wrapper>
  );
};

export default Borrowing;
