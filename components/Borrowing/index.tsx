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

const getCollateralValue = (borrow) => {
  let totalValue = 0;
  let bEthValue = 0;
  let bLunaValue = 0;
  let bEthPrice = 0;
  let bLunaPrice = 0;
  let bEthSymbol = null;
  let bLunaSymbol = null;
  borrow?.collaterals?.length && borrow?.collaterals?.forEach((item) => {

    totalValue += (parseFloat(item?.balance) / 1000000) * parseFloat(item?.price);
    if(item?.symbol === "bEth"){
      bEthSymbol = item?.symbol;
      bEthPrice = (parseFloat(item?.balance) / 1000000) * parseFloat(item?.price) || 0;
      bEthValue  = parseFloat(item?.balance) / 1000000 || 0;
    }else if(item?.symbol === "bLuna"){
      bLunaSymbol = item?.symbol;
      bLunaPrice = (parseFloat(item?.balance) / 1000000) * parseFloat(item?.price) || 0;
      bLunaValue  = parseFloat(item?.balance) / 1000000 || 0;
    }
  });
  return {totalValue,bEthPrice,bEthValue,bLunaPrice,bLunaValue,bEthSymbol,bLunaSymbol};
};

export interface BorrowingProps {
  ancAssets: AccountAnc;
}

const Borrowing: React.SFC<BorrowingProps> = ({ ancAssets }) => {
  const borrow: BorrowData = ancAssets.debt;
  const collateralValue = getCollateralValue(borrow)?.totalValue?.toString();
  const bEthValue = getCollateralValue(borrow)?.bEthValue?.toString();
  const bLunaValue = getCollateralValue(borrow)?.bLunaValue?.toString();
  const bEthPrice = getCollateralValue(borrow)?.bEthPrice?.toString();
  const bLunaPrice = getCollateralValue(borrow)?.bLunaPrice?.toString();
  const bEthSymbol = getCollateralValue(borrow)?.bEthSymbol;
  const bLunaSymbol = getCollateralValue(borrow)?.bLunaSymbol;

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
          <StyledText> {convertToFloatValue(bEthValue)} {bEthSymbol}</StyledText>
          <SubText>${convertToFloatValue(bEthPrice)}</SubText>
          </div>
          <div>
          <StyledText> {convertToFloatValue(bLunaValue)} {bLunaSymbol}</StyledText>
          <SubText>${convertToFloatValue(bLunaPrice)}</SubText>
          </div>
        <StyledText> ${convertToFloatValue(collateralValue)}</StyledText>
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
