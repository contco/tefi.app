import { Avatar } from '@contco/core-ui';
import { BarOptions, TopBarContainer } from '../dashboardStyles';

interface Props {
  currentBar: string;
  setCurrentBar: any;
}

export const ACCOUNT = 'Account';
export const NFT = 'NFTs';

const TopBar: React.FC<Props> = ({ currentBar, setCurrentBar }) => {
  return (
    <TopBarContainer>
      <Avatar name="Hello" height={80} width={80} />
      <BarOptions selected={currentBar === ACCOUNT} onClick={() => setCurrentBar(ACCOUNT)}>
        {ACCOUNT}
      </BarOptions>
      <BarOptions selected={currentBar === NFT} onClick={() => setCurrentBar(NFT)}>
        {NFT}
      </BarOptions>
    </TopBarContainer>
  );
};

export default TopBar;
