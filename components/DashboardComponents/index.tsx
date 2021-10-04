import Assets from '../../components/Asset';
import LunaStaking from '../../components/LunaStaking';
import MarketValue from '../../components/MarketValue';
import Borrowing from '../../components/Borrowing';
import PylonGateway from '../../components/PylonGateway';
import Pools from '../../components/Pools';
import SpectrumFarms from '../../components/SpectrumFarms';
import SpectrumRewards from '../../components/SpectrumRewards';
import Rewards from '../../components/Rewards';
import Loterra from '../../components/ؒLoterra';
import Earn from '../../components/Earn';
import Burn from '../../components/Burn';
import ShortFarms from '../../components/ShortFarms';
import MirrorBorrowing from '../../components/MirrorBorrowing';
import StarTerraFarms from '../../components/StarTerraFarms';
import ApolloVaults from '../../components/ApolloVaults';
import Airdrops from '../../components/Airdrop';

import { Box } from '@contco/core-ui';

interface Props {
  assets: any;
}

const DashboardComponents: React.FC<Props> = ({ assets }) => {
  return (
    <Box>
      <MarketValue
        allData={[
          assets?.assets,
          assets?.pylon,
          assets?.anchorEarn,
          assets?.anchorBond,
          assets?.anchorBorrow,
          assets?.rewards,
          assets?.pools,
          assets?.mirrorBorrow,
          assets?.mirrorShortFarm,
          assets?.specFarm,
          assets?.specReward,
          assets?.starterraFarms,
          assets?.loterra,
          assets?.lunaStaking,
          assets?.airdrops,
          assets?.apollo
        ]}
      />
      <Assets assets={assets?.assets} />
      <PylonGateway pylon={assets?.pylon || {}} />
      <Earn earn={assets?.anchorEarn || {}} />
      <Burn burn={assets?.anchorBond || {}} />
      <Borrowing borrow={assets?.anchorBorrow || {}} />
      <Rewards rewards={assets?.rewards} />
      <Pools pools={assets?.pools} />
      <ApolloVaults apolloAssets={assets?.apollo} />
      <MirrorBorrowing borrow={assets?.mirrorBorrow || {}} />
      <ShortFarms short={assets?.mirrorShortFarm || {}} />
      <SpectrumFarms farm={assets?.specFarm} />
      <SpectrumRewards reward={assets?.specReward} />
      <StarTerraFarms farm={assets?.starterraFarms} />
      <Loterra loterra={assets?.loterra} />
      <LunaStaking staking={assets?.lunaStaking || {}} />
      <Airdrops airdrops={assets?.airdrops} />
    </Box>
  );
};

export default DashboardComponents;
