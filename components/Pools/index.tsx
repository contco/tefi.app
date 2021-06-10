import { PoolsTitle } from "../../constants";
import { TotalPool, PoolList } from "./dummy";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from "../dashboardStyles";

const HEADING_TEXT = `Pools`


export interface PoolsProps {ancAssets: any  }

const Pools: React.SFC<PoolsProps> = ({ancAssets}) => {

    const name = ancAssets.pool.reward?.name;
    const balance = ancAssets.pool?.balance;
    const staked = ancAssets.pool.reward?.staked;

    // console.log(name, balance, staked)

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
            {PoolList.map((a, index) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {a.name}</StyledText>
                    <StyledText isChildren={true}>
                        {a.balance.LP}
                        <HoverText>
                            {a.balance.mUSO} <br />
                            {a.balance.UST}
                        </HoverText>
                    </StyledText>
                    <StyledText > {a.value}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Pools;