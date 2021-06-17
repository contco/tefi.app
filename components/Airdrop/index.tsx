import {useState, useEffect} from "react";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from "../dashboardStyles";

const HEADING_TEXT = `Airdrops`


export interface AirdropsProps {mirrorAssets: MirrorAccount, anchorAssets: AccountAnc};

const Airdrops: React.FC<AirdropsProps> = ({mirrorAssets, anchorAssets}) => {

    const [airdrops ,setAidrops] = useState([]);

    useEffect(() => {

     const airdropsData = [...mirrorAssets?.airdrops, ... anchorAssets?.airdrops ];
     setAidrops(airdropsData);

    },[]);

    const getAirdropTotal = () => {
        const mirrorTotal = parseFloat(mirrorAssets?.total?.airdropSum ?? '0');
        const anchorTotal = parseFloat(anchorAssets?.total?.airdropSum ?? '0');
        const total = (mirrorTotal+anchorTotal).toFixed(3)
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
                    <StyledText>{assets?.round} </StyledText>
                    <StyledText > ${parseFloat(assets?.quantity).toFixed(3)}</StyledText>
                    <StyledText > ${parseFloat(assets?.price).toFixed(3)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Airdrops;