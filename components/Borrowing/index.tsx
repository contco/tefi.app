import css from '@styled-system/css'
import { BorrowingTitle } from "../../constants";
import { BorrowedList } from "./dummy";
import { Wrapper, Row, Heading, Title, StyledText } from "../dashboardStyles";
const HEADING_TEXT = `Borrowing`;

const CSS_NET_APR = `${props => css({
    fontWeight: 500,
    color: props.theme.colors.secondary
})}`

export interface BorrowingProps { }

const Borrowing: React.SFC<BorrowingProps> = () => {
    return (
        <Wrapper>
            <Heading>
                {HEADING_TEXT}
            </Heading>
            <Row>
                {BorrowingTitle.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            {BorrowedList.map((a, index) =>
                <Row key={index}>
                    <StyledText> {a.collateralValue}</StyledText>
                    <StyledText > {a.borrowedValue}</StyledText>
                    <StyledText css={CSS_NET_APR}> {a.netAPR}
                    </StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Borrowing;