import { AssetsTitle } from "../../constants";
import { TotalAssets, AssetList } from "./dummy";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from "../dashboardStyles";
const HEADING_TEXT = `Assets`

export interface AssetsProps { }

const Assets: React.SFC<AssetsProps> = () => {
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
            {AssetList.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {a.ticker}</StyledText>
                    <StyledText fontWeight={500}> {a.name}</StyledText>
                    <StyledText > {a.balance}</StyledText>
                    <StyledText > {a.price}</StyledText>
                    <StyledText > {a.value}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Assets;