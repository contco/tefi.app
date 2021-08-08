import {useState, useEffect} from "react";
import { Wrapper, Row, AirdropHeading, Heading, Title, StyledText, ClaimButton } from "../dashboardStyles";
import {Box} from "@contco/core-ui";
import { convertToFloatValue } from "../../utils/convertFloat";
import {claimAirdrops} from "./claim";
import useWallet  from "../../lib/useWallet";
const HEADING_TEXT = `Airdrops`


export interface AirdropsProps {
    mirrorAssets: MirrorAccount,
    anchorAssets: AccountAnc,
    pylonAssets: PylonAccount,
};

const Airdrops: React.FC<AirdropsProps> = ({mirrorAssets, anchorAssets, pylonAssets}) => {
    const [airdrops ,setAidrops] = useState([]);

    const { useConnectedWallet, post } = useWallet();
    const connectedWallet = useConnectedWallet();


    useEffect(() => {
     let airdropsData = [...mirrorAssets?.airdrops, ... anchorAssets?.airdrops, ...pylonAssets.pylonAirdrops ];
     airdropsData = airdropsData.sort((a,b) => parseFloat(b.value) - parseFloat(a.value));
     setAidrops(airdropsData);

    },[]);

    const getAirdropTotal = () => {
        const mirrorTotal = parseFloat(mirrorAssets?.total?.mirrorAirdropSum ?? '0');
        const anchorTotal = parseFloat(anchorAssets?.total?.airdropSum ?? '0');
        const pylonTotal = parseFloat(pylonAssets?.pylonSum?.pylonAirdropSum ?? '0');
        const total = (mirrorTotal+anchorTotal + pylonTotal).toFixed(3)
        return total;
    };

    const onClaimAirdrop = async () => {
        if(airdrops.length > 0 && connectedWallet?.terraAddress) {
           await claimAirdrops(airdrops, connectedWallet.terraAddress, post);
        }
    }
    

    return (
        <Wrapper>
            <AirdropHeading>
                <Box>
                    <Heading>
                        {HEADING_TEXT}
                    </Heading>
                    <StyledText>
                        ${getAirdropTotal()}
                    </StyledText>
                </Box>
               <ClaimButton onClick={onClaimAirdrop}>Claim All </ClaimButton>
            </AirdropHeading>
            <Row>
              <Title>Name</Title>
              <Title>Round</Title>
              <Title>Reward</Title>
              <Title>Value</Title>
            </Row>
            {airdrops.map((assets:Airdrops, index: number) =>
                <Row key={index}>
                    <StyledText fontWeight={500}> {assets?.name}</StyledText>
                    <StyledText>{assets?.round ?? "N/A"} </StyledText>
                    <StyledText > {convertToFloatValue(assets?.quantity)} {assets?.symbol}</StyledText>
                    <StyledText > ${convertToFloatValue(assets?.value)}</StyledText>
                </Row>
            )}
        </Wrapper>
    );
}

export default Airdrops;