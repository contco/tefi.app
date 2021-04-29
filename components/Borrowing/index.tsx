import { Box, Flex, Text } from "@contco/core-ui";
import css from '@styled-system/css'
import Styled from "styled-components";
import { BorrowingTitle } from "../../constants";
import { BorrowedList } from "./dummy";
const HEADING_TEXT = `Borrowing`

const Wrapper = Styled(Box)`
${css({
    mb: 40
})}
`;
const Heading = Styled(Text)`
${props => css({
    color: props.theme.colors.Heading,
    letterSpacing: 2,
    fontSize: 28,
    fontWeight: 900,
    mb: 20
})}
`;

const Row = Styled(Flex)`
${css({
    justifyContent: 'space-between',
    py: 3,
})}
`;
const Title = Styled(Text)`
${props => css({
    color: props.theme.colors.subHeading,
    fontWeight: 500,
    letterSpacing: 1,
    fontSize: 18,
    width: 200,
    textAlign: 'left'
})}
`;

const StyledText = Styled(Text)`
${props => css({
    color: props.theme.colors.detailsText,
    letterSpacing: 1,
    fontSize: 16,
    width: 200,
    textAlign: 'left'

})}
`;
export interface BorrowingProps {

}

const Borrowing: React.SFC<BorrowingProps> = () => {
    return (
        <Wrapper>
            <Heading>
                {HEADING_TEXT}
            </Heading>
            <Row>
                {
                    BorrowingTitle.map((t, index) =>
                        <Title key={index}>{t}</Title>
                    )
                }
            </Row>
            {BorrowedList.map((a, index) =>
                <Row key={index}>
                    <StyledText> {a.collateralValue}</StyledText>
                    <StyledText > {a.borrowedValue}</StyledText>
                    <StyledText css={`${props => css({
                        fontWeight: 500,
                        color: props.theme.colors.secondary
                    })}`}> {a.netAPR}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Borrowing;