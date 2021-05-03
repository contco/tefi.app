import css from '@styled-system/css'
import { BorrowingTitle } from "../../constants";
import { TotalBorrowed, BorrowedList } from "./dummy";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from "../dashboardStyles";
import { Flex } from "@contco/core-ui";
import Styled from "styled-components";
import PercentageBar from "../PercentageBar";
const HEADING_TEXT = `Borrowing`;

const CSS_NET_APR = props => css({
    fontWeight: 500,
    color: props.theme.colors.secondary
});

const StyledPercentage = Styled(Flex)`
 ${css({
    justifyContent: 'center',
    py: [20, 30, null, 80],
    px: [20, 40, null, 60],
})}
`;

export interface BorrowingProps { }

const Borrowing: React.SFC<BorrowingProps> = () => {
    return (
        <Wrapper css={`${css({ mb: 0 })}`}>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                    {TotalBorrowed}
                </StyledText>
            </HeadingWrapper>
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
            <StyledPercentage>
                <PercentageBar percentageValue={52.21} />
            </StyledPercentage>
        </Wrapper>
    );
}

export default Borrowing;