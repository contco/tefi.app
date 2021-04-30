import { MarketTitles, MarketData } from "../../constants";
import { Wrapper, Row, Title, StyledText } from "../dashboardStyles";


export interface AssetsProps { }

const Total: React.SFC<AssetsProps> = () => {
    return (
        <Wrapper>
            <Row>
                {MarketTitles.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            <Row>
                {MarketData.map((d, index) =>
                    <StyledText key={index}>{d}</StyledText>
                )}
            </Row>
        </Wrapper>
    );
}

export default Total;