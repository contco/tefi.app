import css from '@styled-system/css'
import { RewardsTitle } from "../../constants";
import { RewardList } from "./dummy";
import { Wrapper, Row, Heading, Title, StyledText } from "../dashboardStyles";

const HEADING_TEXT = `Rewards`
const CSS_APR = `${props => css({
    fontWeight: 500,
    color: props.theme.colors.secondary
})}`

export interface RewardsProps { }

const Rewards: React.SFC<RewardsProps> = () => {
    return (
        <Wrapper>
            <Heading>
                {HEADING_TEXT}
            </Heading>
            <Row>
                {RewardsTitle.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            {RewardList.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight='500'> {a.name}</StyledText>
                    <StyledText > {a.stacked}</StyledText>
                    <StyledText css={CSS_APR}> {a.APR}</StyledText>
                    <StyledText>{a.reward}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Rewards;