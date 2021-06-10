import css from '@styled-system/css'
import { RewardsTitle } from "../../constants";
import { TotalRewards, RewardList } from "./dummy";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from "../dashboardStyles";

const HEADING_TEXT = `Rewards`

const CSS_APR = props => css({
    fontWeight: 500,
    color: props.theme.colors.secondary
});
export interface RewardsProps { ancAssets: any }

const Rewards: React.SFC<RewardsProps> = ({ancAssets}) => {

    const poolRewards = ancAssets.pool.reward;
    const borrowRewards = ancAssets.debt.reward;
    const govRewards = ancAssets.gov.reward;

    // console.log(poolRewards, borrowRewards, govRewards);

    return (
        <Wrapper>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                    {TotalRewards}
                </StyledText>
            </HeadingWrapper>
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
                    <StyledText css={CSS_APR}> {a.APR}</StyledText>
                    <StyledText>{a.reward}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Rewards;