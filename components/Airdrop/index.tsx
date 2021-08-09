import {useState, useEffect} from "react";
import { Wrapper, Row, AirdropHeading, Heading, Title, StyledText, ClaimButton } from "../dashboardStyles";
import {Box} from "@contco/core-ui";
import {AirdropModal} from "./airdropModal";
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
    const [airdrops ,setAirdrops] = useState([]);
    const [airdropSum, setAirdropSum] = useState<string>('0');
    const [showModal, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { useConnectedWallet, post } = useWallet();
    const connectedWallet = useConnectedWallet();

    const getAirdropTotal = () => {
        const mirrorTotal = parseFloat(mirrorAssets?.total?.mirrorAirdropSum ?? '0');
        const anchorTotal = parseFloat(anchorAssets?.total?.airdropSum ?? '0');
        const pylonTotal = parseFloat(pylonAssets?.pylonSum?.pylonAirdropSum ?? '0');
        const total = (mirrorTotal+anchorTotal + pylonTotal).toFixed(3)
        return total;
    };

    useEffect(() => {
     let airdropsData = [...mirrorAssets?.airdrops, ... anchorAssets?.airdrops, ...pylonAssets.pylonAirdrops ];
     airdropsData = airdropsData.sort((a,b) => parseFloat(b.value) - parseFloat(a.value));
     const sum = getAirdropTotal();
     setAirdrops(airdropsData);
     setAirdropSum(sum)
    },[]);

    const onClaimAirdrop = async () => {
        if(airdrops.length > 0 && connectedWallet?.terraAddress) {
           setLoading(true);
           const result = await claimAirdrops(airdrops, connectedWallet.terraAddress, post);
           if(result) {
               setAirdrops([]);
               setAirdropSum('0');
           }
           else {
               alert('Error Claiming Airdrops');
           }
           setLoading(false);
           setModalVisible(false);
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
                        ${airdropSum}
                    </StyledText>
                </Box>
               <ClaimButton onClick={() => setModalVisible(true)}>Claim All </ClaimButton>
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
                    <StyledText> {convertToFloatValue(assets?.quantity)} {assets?.symbol}</StyledText>
                    <StyledText> ${convertToFloatValue(assets?.value)}</StyledText>
                </Row>
            )}
            <AirdropModal 
                onClaimClick={onClaimAirdrop}
                loading={loading}
                showModal={showModal}
                setModalVisible={setModalVisible}
                amount={airdropSum}
                airdropLength={airdrops.length}  />
        </Wrapper>
    );
}

export default Airdrops;