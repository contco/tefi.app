import { useState, useEffect } from 'react';
import { Wrapper, Heading, ClaimButton, AirdropHeading } from '../dashboardStyles';
import { Box } from '@contco/core-ui';
import { AirdropModal } from './airdropModal';
import { claimAirdrops } from './claim';
import useWallet from '../../lib/useWallet';
import TitleContainer from '../DashboardComponents/TitleContainer';
import Header from '../DashboardComponents/Header';
import Section from '../DashboardComponents/Section';

const HEADING_TEXT = `Airdrops`;

export interface AirdropsProps {
  airdrops: any;
  isViewOnly?: boolean;
}

const Airdrops: React.FC<AirdropsProps> = ({ airdrops, isViewOnly = false }) => {
  const [drops, setDrops] = useState([]);
  const [airdropSum, setAirdropSum] = useState<string>('0');
  const [showModal, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    setDrops(airdrops?.data);
    setAirdropSum(airdrops?.total || '0');
  }, []);

  const onClaimAirdrop = async () => {
    if (airdrops.length > 0 && connectedWallet?.terraAddress) {
      setLoading(true);
      const result = await claimAirdrops(airdrops, connectedWallet.terraAddress, post);
      if (result) {
        setDrops([]);
        setAirdropSum('0');
      } else {
        alert('Error Claiming Airdrops');
      }
      setLoading(false);
      setModalVisible(false);
    }
  };
  return (
    <Wrapper>
      <AirdropHeading>
        <Box>
          <Heading>{HEADING_TEXT}</Heading>
          <Header data={airdropSum} />
        </Box>
        {JSON.stringify(airdrops) !== '{}' && !isViewOnly ? (
          <ClaimButton onClick={() => setModalVisible(true)}>Claim All </ClaimButton>
        ) : null}
      </AirdropHeading>
      <TitleContainer titles={airdrops.titles} />
      <Section data={drops} />
      <AirdropModal
        onClaimClick={onClaimAirdrop}
        loading={loading}
        showModal={showModal}
        setModalVisible={setModalVisible}
        amount={airdrops.total}
        airdropLength={airdrops.length}
      />
    </Wrapper>
  );
};

export default Airdrops;
