
import { Box, Flex, Text } from "@contco/core-ui";
import css from '@styled-system/css'
import Styled from "styled-components";

export const Wrapper = Styled(Box)`
${css({
    mb: 40
})}
`;
export const Row = Styled(Flex)`
${css({
    justifyContent: 'space-between',
    py: 3,
})}
`;
export const Heading = Styled(Text)`
${props => css({
    color: props.theme.colors.Heading,
    letterSpacing: 2,
    fontSize: 28,
    fontWeight: 900,
    mb: 20
})}
`;

export const Title = Styled(Text)`
${props => css({
    color: props.theme.colors.subHeading,
    fontWeight: 500,
    letterSpacing: 1,
    fontSize: 18,
    width: 200,
    textAlign: 'left'
})}
`;

export const StyledText = Styled(Text)`
${props => css({
    color: props.theme.colors.detailsText,
    letterSpacing: 1,
    fontSize: 16,
    width: 200,
    textAlign: 'left'

})}
`;
