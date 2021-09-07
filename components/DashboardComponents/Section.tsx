import { StyledText, Row, CSS_APR, SubText } from '../dashboardStyles';
import AssetContainer from './AssetContainer';
import LpContainer from './LpContainer';

interface Props {
  data: any;
}

const Section: React.FC<Props> = ({ data }) => {
  return data.map((items: any, index) => {
    return (
      <Row key={index}>
        {items.map((item: any, index) => {
          if (Object.keys(item)[0] === 'name') {
            return (
              <StyledText fontWeight={500} key={index}>
                {Object.values(item)[0]}
              </StyledText>
            );
          } else if (Object.keys(item)[0] === 'apy' || Object.keys(item)[0] === 'ratio') {
            return (
              <StyledText key={index} css={CSS_APR}>
                {Object.values(item)[0]}
              </StyledText>
            );
          } else if (Object.keys(item)[0] === 'balance' || Object.keys(item)[0] === 'reward') {
            const value: any = Object.values(item)[0];
            return <AssetContainer key={index} token={value.token} tokenValue={value.tokenValue} />;
          } else if (Object.keys(item)[0] === 'lpData') {
            const lpData: any = Object.values(item)[0];
            return <LpContainer lp={lpData.lp} token1={lpData.token1} token2={lpData.token2} />;
          } else if (Object.keys(item)[0] === 'collateralList') {
            const collaterals: any = Object.values(item)[0];
            return collaterals.map((item, index) => (
              <div key={index}>
                <StyledText>{item.token}</StyledText>
                <SubText>{item.tokenValue}</SubText>
                {index < collaterals.length - 1 ? <br></br> : null}
              </div>
            ));
          } else return <StyledText key={index}>{Object.values(item)[0]}</StyledText>;
        })}
      </Row>
    );
  });
};

export default Section;
