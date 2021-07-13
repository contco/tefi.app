import {useState, useEffect} from "react";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from "../dashboardStyles";
import { convertToFloatValue } from "../../utils/convertFloat";
const HEADING_TEXT = `Airdrops`


export interface AirdropsProps {
    mirrorAssets: MirrorAccount,
    anchorAssets: AccountAnc,
    pylonAssets: PylonAccount,
};

const Airdrops: React.FC<AirdropsProps> = ({mirrorAssets, anchorAssets, pylonAssets}) => {

    const [airdrops ,setAidrops] = useState([]);

    useEffect(() => {

     let airdropsData = [...mirrorAssets?.airdrops, ... anchorAssets?.airdrops ];
     if(pylonAssets?.pylonAirdrops) {
         airdropsData = [pylonAssets.pylonAirdrops, ...airdropsData];
     }
     airdropsData = airdropsData.sort((a,b) => parseFloat(b.price) - parseFloat(a.price));
     setAidrops(airdropsData);

    },[]);

    const getAirdropTotal = () => {
        const mirrorTotal = parseFloat(mirrorAssets?.total?.mirrorAirdropSum ?? '0');
        const anchorTotal = parseFloat(anchorAssets?.total?.airdropSum ?? '0');
        const pylonTotal = parseFloat(pylonAssets?.pylonSum?.pylonAirdropSum ?? '0');
        const total = (mirrorTotal+anchorTotal + pylonTotal).toFixed(3)
        return total;
    };
    

    return (
        <Wrapper>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                ${getAirdropTotal()}
                </StyledText>
            </HeadingWrapper>
            <Row>
              <Title>Name</Title>
              <Title>Round</Title>
              <Title>Reward</Title>
              <Title>Value</Title>
            </Row>
            {airdrops.map((assets:Airdrops, index: number) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {assets?.name}</StyledText>
                    <StyledText>{assets?.round ?? "N/A"} </StyledText>
                    <StyledText > {convertToFloatValue(assets?.quantity)} {assets?.symbol}</StyledText>
                    <StyledText > ${convertToFloatValue(assets?.price)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Airdrops;