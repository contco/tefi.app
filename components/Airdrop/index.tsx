import {useState, useEffect} from "react";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from "../dashboardStyles";

const HEADING_TEXT = `Airdrops`


export interface AirdropsProps {mirrorAssets: any, anchorAssets: any};

const Airdrops: React.FC<AirdropsProps> = ({mirrorAssets, anchorAssets}) => {

    const [airdrops ,setAidrops] = useState([]);

    useEffect(() => {

     let airdropsData = [...mirrorAssets?.airdrops, ... anchorAssets?.airdrops ];
     setAidrops(airdropsData);

    },[]);

    const getAirdropTotal = () => {
        const mirrorTotal = mirrorAssets?.total?.airdropSum;
        return mirrorTotal ?? 0;
    };
    

    return (
        <Wrapper>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                ${parseFloat(getAirdropTotal()).toFixed(3)}
                </StyledText>
            </HeadingWrapper>
            <Row>
              <Title>Name</Title>
              <Title>Round</Title>
              <Title>Reward</Title>
              <Title>Value</Title>
            </Row>
            {airdrops.map((assets, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {assets?.name}</StyledText>
                    <StyledText>{parseInt(assets?.round)} </StyledText>
                    <StyledText > ${parseFloat(assets?.quantity).toFixed(3)}</StyledText>
                    <StyledText > ${parseFloat(assets?.price).toFixed(3)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Airdrops;