import { Avatar } from '@contco/core-ui';
import { BarOptions, TopBarContainer } from '../dashboardStyles';
import { LIGHT_THEME } from '../../constants';

interface Props {
  currentBar: string;
  setCurrentBar: any;
  currentTheme: string;
}

export const ACCOUNT = 'Account';
export const NFT = 'NFTs';

const TopBar: React.FC<Props> = ({ currentBar, setCurrentBar, currentTheme }) => {
  return (
    <TopBarContainer>
      <Avatar
        image={currentTheme === LIGHT_THEME ? '/images/dp_light.png' : '/images/dp_dark.png'}
        name="Hello"
        height={80}
        width={80}
      />
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
