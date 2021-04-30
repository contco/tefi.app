import { PoolsTitle } from "../../constants";
import { PoolList } from "./dummy";
import { Wrapper, Row, Heading, Title, StyledText } from "../dashboardStyles";

const HEADING_TEXT = `Pools`


export interface PoolsProps { }

const Pools: React.SFC<PoolsProps> = () => {
    return (
        <Wrapper>
            <Heading>
                {HEADING_TEXT}
            </Heading>
            <Row>
                {PoolsTitle.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            {PoolList.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {a.name}</StyledText>
                    <StyledText > {a.balance}</StyledText>
                    <StyledText > {a.value}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Pools;