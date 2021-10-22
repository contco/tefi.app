import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box } from '@contco/core-ui';
import { Logo } from './AnimatedCircle';
import Collection from './Collection';

const MainContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  ${css({
    height: ['calc(100vh - 300px)'],
  })}
`;

const Container = styled(Box)`
  align-items: center;
  justify-content: center;
`;

const BigCircle = styled(Flex)`
  border-radius: 50%;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;
  ${(props) =>
    css({
      width: props.isBig ? ['170px', null, '300px'] : ['170px', null, '200px'],
      height: props.isBig ? ['170px', null, '300px'] : ['170px', null, '200px'],
      bg: 'secondary',
    })};
`;

interface Props {
  currentTheme: string;
  text?: string;
  isBig?: boolean;
  address?: string;
}

interface NftProps extends Props {
  nftAssets: any | null;
  loading: boolean;
}

export const AnimatedCircle: React.FC<Props> = ({ currentTheme, isBig = false }) => {
  return (
    <BigCircle isBig={isBig}>
      <Logo width="100%" currentTheme={currentTheme} />
    </BigCircle>
  );
};

const NftComponent: React.FC<NftProps> = ({ currentTheme, isBig = false, address, nftAssets, loading }) => {
  return (
    <div>
      {!loading ? (
        <Collection data={nftAssets} currentTheme={currentTheme} address={address} />
      ) : (
        <MainContainer>
          <Container>
            <AnimatedCircle currentTheme={currentTheme} isBig={isBig} />
          </Container>
        </MainContainer>
      )}
    </div>
  );
};

export default NftComponent;
