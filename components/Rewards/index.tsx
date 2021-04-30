import css from '@styled-system/css'
import { RewardsTitle } from "../../constants";
import { RewardList } from "./dummy";
import { Wrapper, Row, Heading, Title, StyledText, HoverText } from "../dashboardStyles";

const HEADING_TEXT = `Rewards`

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
                    <StyledText isChildren={true}> {a.stacked?.LP}
                        <HoverText>
                            {a.stacked?.mUSO} <br />
                            {a.stacked?.UST}
                        </HoverText>
                    </StyledText>
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