import { Box, Flex, Text } from "@contco/core-ui";
import css from '@styled-system/css'
import Styled from "styled-components";
import { MarketTitles, MarketData } from "../../constants";

const Wrapper = Styled(Box)`
${css({
    mb: 40
})}
`;

const Row = Styled(Flex)`
${css({
    justifyContent: 'space-between',
    py: 2,
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
export interface AssetsProps {

}

const Total: React.SFC<AssetsProps> = () => {
    return (
        <Wrapper>

            <Row>
                {
                    MarketTitles.map((t, index) =>
                        <Title key={index}>{t}</Title>
                    )
                }
            </Row>
            <Row>
                {
                    MarketData.map((d, index) =>
                        <StyledText key={index}>{d}</StyledText>
                    )
                }
            </Row>
        </Wrapper>
    );
}

export default Total;