import css from '@styled-system/css';
import { MarketTitles } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, Title, StyledText } from '../dashboardStyles';

const CUTOM_TEXT_CSS = css({ fontWeight: 500, fontSize: [14, null, null, 20, null, null, null, 28] });

export interface AssetsProps {
  allData: any[];
}

const Total: React.FC<AssetsProps> = ({ allData }) => {
  let totalBorrowing = 0;
  let totalAssets = 0;
  let totalRewards = 0;

  allData.forEach((data) => {
    totalBorrowing += data.totalBorrow ? data.totalBorrow : 0;
    totalAssets += data.totalValue ? data.totalValue : 0;
    totalAssets += data.totalGov ? data.totalGov : 0;
    totalRewards += data.totalReward ? data.totalReward : 0;
  });

  const getTotalMarketValue = () => {
    const total = totalAssets + totalRewards - totalBorrowing;

    return total;
  };

  const totalMarketValue = getTotalMarketValue().toFixed(3);

  return (
    <Wrapper>
      <Row>
        {MarketTitles.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      <Row>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalMarketValue.toString())}</StyledText>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalAssets.toString())}</StyledText>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalBorrowing.toString())}</StyledText>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalRewards.toString())}</StyledText>
      </Row>
    </Wrapper>
  );
};

export default Total;
