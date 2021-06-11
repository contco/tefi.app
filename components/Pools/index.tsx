import { PoolsTitle } from "../../constants";
import { TotalPool } from "./dummy";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from "../dashboardStyles";

const HEADING_TEXT = `Pools`


export interface PoolsProps {ancAssets: any  }

const Pools: React.SFC<PoolsProps> = ({ancAssets}) => {

    const pools = [ancAssets.pool]

    return (
        <Wrapper>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                    {TotalPool}
                </StyledText>
            </HeadingWrapper>
            <Row>
                {PoolsTitle.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            {pools.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {a.reward.name}</StyledText>
                    <StyledText isChildren={true}>
                        {parseFloat(a.staked).toFixed(3)}
                        <HoverText>
                            {a.balance.mUSO} <br />
                            {a.balance.UST}
                        </HoverText>
                    </StyledText>
                    <StyledText > {parseFloat(a.balance).toFixed(3)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Pools;