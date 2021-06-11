import { AssetsTitle } from "../../constants";
import { TotalAssets } from "./dummy";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from "../dashboardStyles";
const HEADING_TEXT = `Assets`

export interface AssetsProps {ancAssets: any }

const Assets: React.SFC<AssetsProps> = ({ancAssets}) => {

    return (
        <Wrapper>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                    {TotalAssets}
                </StyledText>
            </HeadingWrapper>
            <Row>
                {AssetsTitle.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            {ancAssets.assets.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {a.symbol}</StyledText>
                    <StyledText fontWeight={500}> {a.symbol}</StyledText>
                    <StyledText > {parseFloat(a.amount).toFixed(3)}</StyledText>
                    <StyledText > {parseFloat(a.price).toFixed(3)}</StyledText>
                    <StyledText > {a.value}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Assets;