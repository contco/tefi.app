import { Avatar, Flex } from '@contco/core-ui';
import styled from 'styled-components';
import { css } from '@styled-system/css';
import { BarOptions, TopBarContainer } from '../dashboardStyles';
import { LIGHT_THEME } from '../../constants';

const OptionsContainer = styled(Flex)`
  ${css({
    ml: 6,
  })}
`;

interface Props {
  currentBar: string;
  setCurrentBar: any;
  currentTheme: string;
}

export const ACCOUNT = 'Account';
export const NFT = 'NFTs';

const TopBar: React.FC<Props> = ({ currentBar, setCurrentBar, currentTheme }) => {
  const getProfileNft = () => {
    return currentTheme === LIGHT_THEME ? '/images/dp_light.png' : '/images/dp_dark.png';
  };

  return (
    <TopBarContainer>
      <Avatar image={getProfileNft()} name="Hello" height={80} width={80} />
      <OptionsContainer>
        <BarOptions selected={currentBar === ACCOUNT} onClick={() => setCurrentBar(ACCOUNT)}>
          {ACCOUNT}
        </BarOptions>
      </OptionsContainer>
    </TopBarContainer>
  );
};

export default TopBar;
