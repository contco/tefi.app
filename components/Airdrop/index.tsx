
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from "../dashboardStyles";

const HEADING_TEXT = `Airdrops`


export interface AirdropsProps {mirrorAssets: any};

const Airdrops: React.FC<AirdropsProps> = ({mirrorAssets}) => {

    const getAirdropTotal = () => {
        const mirrorTotal = mirrorAssets?.total?.stakedSum;
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
              <Title>Token</Title>
              <Title>Round</Title>
              <Title>Reward</Title>
              <Title>Value</Title>
            </Row>
            {mirrorAssets?.airdrops.map((assets, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {assets?.symbol}</StyledText>
                    <StyledText>{parseInt(assets?.round)} </StyledText>
                    <StyledText > ${parseFloat(assets?.quantity).toFixed(3)}</StyledText>
                    <StyledText > ${parseFloat(assets?.price).toFixed(3)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Airdrops;