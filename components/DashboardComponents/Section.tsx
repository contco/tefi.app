import { StyledText, Row, CSS_APR, SubText } from '../dashboardStyles';
import AssetContainer from './AssetContainer';
import LpContainer from './LpContainer';
import Link from 'next/link';
import { assets } from '../../constants/assets';
import { NewOpenIcon } from '../Icons';

interface Props {
  data: any;
}

const LINK_ICON_WIDTH = 16;
const LINK_ICON_HEIGHT = 12;

const Section: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }
  return data.map((items: any, index) => {
    return (
      <Row key={index}>
        {items.map((item: any, index) => {
          if (Object.keys(item)[0] === 'name') {
            return (
              <div>
              <StyledText fontWeight={500} key={index}>
                {Object.values(item)[0]}
              </StyledText>
               {item?.info ?  
                <SubText>{item.info}</SubText> : null
               }
              </div>
            );
          } else if (Object.keys(item)[0] === 'apr' || Object.keys(item)[0] === 'ratio') {
            return (
              <StyledText key={index} css={CSS_APR}>
                {Object.values(item)[0]}
              </StyledText>
            );
          } else if (Object.keys(item)[0] === 'apy') {
            return (
              <div>
                <StyledText key={index} css={CSS_APR}>
                  {Object.values(item)[0]}
                </StyledText>
                <SubText> (APY)</SubText>
              </div>
            );
          } else if (Object.keys(item)[0] === 'url') {
            const symbol: any = Object.values(item)[0];
            return (
              <StyledText fontWeight={500} isURL={assets[symbol.toLowerCase()]}>
                <Link href={assets[symbol.toLowerCase()] ? `/market/${symbol.toLowerCase()}/` : '#'}>
                  <a target="_blank">{symbol}</a>
                </Link>

                {assets[symbol.toLowerCase()] && (
                  <NewOpenIcon visibility="hidden" width={LINK_ICON_WIDTH} height={LINK_ICON_HEIGHT} />
                )}
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
            return (
              <div>
                {collaterals.map((item, index) => (
                  <div key={index}>
                    <StyledText>{item.token}</StyledText>
                    <SubText>{item.tokenValue}</SubText>
                    {index < collaterals.length - 1 ? <br></br> : null}
                  </div>
                ))}
              </div>
            );
          } else if (Object.keys(item)[0] === 'drawTime') {
            const timestamp: any = Object.values(item)[0];
            return <StyledText>{timestamp}</StyledText>;
          } else return <StyledText key={index}>{Object.values(item)[0]}</StyledText>;
        })}
      </Row>
    );
  });
};

export default Section;
