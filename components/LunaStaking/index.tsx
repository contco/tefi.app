import { Wrapper, Row, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import Header from '../../components/DashboardComponents/Header';
import TitleContainer from '../DashboardComponents/TitleContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';

const TITLES_LIST = ['Validator', 'Balance', 'Rewards', 'Value', 'State'];
const HEADING_TEXT = `Luna Staking`;

export interface AssetsProps {
  core: Core;
}

const Assets: React.FC<AssetsProps> = ({ core }: AssetsProps) => {
  const getStakedTotal = () => {
    const total = core?.total?.stakedSum;
    return convertToFloatValue(total.toString()) ?? '0';
  };

  const getUnStakedTotal = () => {
    const total = core?.total?.unstakedSum;
    return convertToFloatValue(total.toString()) ?? '0';
  };

  if (!core?.staking || core.staking.length === 0) {
    return <> </>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header
          data={[
            { name: 'Staked Total', value: '$' + getStakedTotal() },
            { name: 'Unstaked Total', value: '$' + getUnStakedTotal() },
          ]}
        />
      </HeadingWrapper>
      <TitleContainer titles={TITLES_LIST} />
      {core?.staking.map((asset: LunaStaking) => (
        <Row key={asset?.validator}>
          <StyledText fontWeight={500}> {asset.validator}</StyledText>
          <AssetContainer
            token={convertToFloatValue(asset.balance) + ' Luna'}
            tokenValue={'$' + convertToFloatValue(asset.stakedValue)}
          />
          {asset.state === 'Delegated' ? (
            <AssetContainer
              token={convertToFloatValue(asset.rewards) + ' Luna'}
              tokenValue={'$' + convertToFloatValue(asset.rewardsValue)}
            />
          ) : (
            <StyledText>-</StyledText>
          )}
          <StyledText> ${convertToFloatValue(asset.totalValue)}</StyledText>
          <StyledText>{asset.state}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
