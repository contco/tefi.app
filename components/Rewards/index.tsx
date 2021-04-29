import { Box, Flex, Text } from "@contco/core-ui";
import css from '@styled-system/css'
import Styled from "styled-components";
import { RewardsTitle } from "../../constants";
import { RewardList } from "./dummy";
const HEADING_TEXT = `Rewards`

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
export interface RewardsProps {

}

const Rewards: React.SFC<RewardsProps> = () => {
    return (
        <Wrapper>
            <Heading>
                {HEADING_TEXT}
            </Heading>
            <Row>
                {
                    RewardsTitle.map((t, index) =>
                        <Title key={index}>{t}</Title>
                    )
                }
            </Row>
            {RewardList.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight='500'> {a.name}</StyledText>
                    <StyledText > {a.stacked}</StyledText>
                    <StyledText css={`${props => css({
                        fontWeight: 500,
                        color: props.theme.colors.secondary
                    })}`}> {a.APR}</StyledText>
                    <StyledText>{a.reward}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Rewards;