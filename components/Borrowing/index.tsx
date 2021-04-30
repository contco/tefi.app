import css from '@styled-system/css'
import { BorrowingTitle } from "../../constants";
import { BorrowedList } from "./dummy";
import { Wrapper, Row, Heading, Title, StyledText } from "../dashboardStyles";
import { Box, Flex, Text } from "@contco/core-ui";
import Styled from "styled-components";
import PercentageBar from "../PercentageBar";
const HEADING_TEXT = `Borrowing`;

const StyledPercentage = Styled(Flex)`
 ${css({
    justifyContent: 'center',
    p: 80,
    pb: 20
})}
`;

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
                    <StyledText css={`${props => css({
                        fontWeight: 500,
                        color: props.theme.colors.secondary
                    })}`}> {a.netAPR}
                    </StyledText>
                </Row>
            )}
            <StyledPercentage>
                <PercentageBar percentageValue={50} />
            </StyledPercentage>
        </Wrapper>
    );
}

export default Borrowing;