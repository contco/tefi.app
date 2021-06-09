import { AssetsTitle } from "../../constants";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from "../dashboardStyles";
const HEADING_TEXT = `Assets`

export interface AssetsProps {mirrorAssets: any}

const Assets: React.FC<AssetsProps> = ({mirrorAssets} : AssetsProps) => {
    const getAssetsTotal = () => {
        let mirrorTotal = mirrorAssets?.total.unstakedSum;
        return mirrorTotal ?? 0;
    }
    return (
        <Wrapper>
            <HeadingWrapper>
                <Heading>
                    {HEADING_TEXT}
                </Heading>
                <StyledText>
                    ${parseInt(getAssetsTotal()).toFixed(3)}
                </StyledText>
            </HeadingWrapper>
            <Row>
                {AssetsTitle.map((t, index) =>
                    <Title key={index}>{t}</Title>
                )}
            </Row>
            {mirrorAssets?.assets.map((asset, index) =>
                <Row key={asset.symbol}>
                    <StyledText fontWeight={500}> {asset.symbol}</StyledText>
                    <StyledText fontWeight={500}> {asset.name}</StyledText>
                    <StyledText > {asset.unstakedToken}</StyledText>
                    <StyledText > {parseInt(asset.price).toFixed(3)}</StyledText>
                    <StyledText > {parseInt(asset.unstakedUstValue).toFixed(3)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Assets;