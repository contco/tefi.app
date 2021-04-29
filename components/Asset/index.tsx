import { Box, Flex, Text } from "@contco/core-ui";
import css from '@styled-system/css'
import Styled from "styled-components";
import { AssetsTitle } from "../../constants";
import { AssetList } from "./dummy";
const HEADING_TEXT = `Assets`

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
export interface AssetsProps {

}

const Assets: React.SFC<AssetsProps> = () => {
    return (
        <Wrapper>
            <Heading>
                {HEADING_TEXT}
            </Heading>
            <Row>
                {
                    AssetsTitle.map((t, index) =>
                        <Title key={index}>{t}</Title>
                    )
                }
            </Row>
            {AssetList.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight='500'> {a.ticker}</StyledText>
                    <StyledText fontWeight='500'> {a.name}</StyledText>
                    <StyledText > {a.balance}</StyledText>
                    <StyledText > {a.price}</StyledText>
                    <StyledText > {a.value}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Assets;