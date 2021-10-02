import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, Flex, Box } from '@contco/core-ui';
import { Logo } from './AnimatedCircle';
import * as data from './data.json';
import Collection from './Collection';
import { useMutation } from '@apollo/client';
import { useDgraphClient } from '../../lib/dgraphClient';
import { ADD_PROFILE_NFT } from '../../graphql/mutations/addProfileNft';
import { UPDATE_PROFILE_NFT } from '../../graphql/mutations/updateProfileNft'; 
import { update } from '@react-spring/core';

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

const BigText = styled(Text)`
  font-weight: 900;
  letter-spacing: 0.77px;
  ${css({
    fontSize: ['30px', null, '40px', '60px', null, null, null, '60px'],
    mt: [8],
    color: 'Heading',
  })}
`;

interface Props {
  currentTheme: string;
  text?: string;
  isBig?: boolean;
  profileNftLoading?: boolean;
  profileNft?: ProfileNft
  address?: string;
}

const DEFAULT_TEXT = 'COMING SOON';

export const AnimatedCircle: React.FC<Props> = ({ currentTheme, isBig = false }) => {
  return (
    <BigCircle isBig={isBig}>
      <Logo width="100%" currentTheme={currentTheme} />
    </BigCircle>
  );
};

const NftComponent: React.FC<Props> = ({ currentTheme, text = DEFAULT_TEXT, isBig = false, profileNft, profileNftLoading, address }) => {
   
  const [addProfileNft] = useMutation(ADD_PROFILE_NFT, {client: useDgraphClient()});
  const [updateProfileNft] = useMutation(UPDATE_PROFILE_NFT, {client: useDgraphClient()});

  const setProfileNft = (url: string) => {
    if(!profileNftLoading) {
       if(profileNft && profileNft?.address) {
         updateProfileNft({variables: {filter: {address: {eq: profileNft.address }},set: {url}}})
       }
       else {
         addProfileNft({variables: {address: address, url}});
       }
    }
  }
  

  return (
    <MainContainer>
      {data ? (
        <Collection data={data.items} />
      ) : (
        <Container>
          <AnimatedCircle currentTheme={currentTheme} isBig={isBig} />
          <Box>
            <BigText>{text}</BigText>
          </Box>
        </Container>
      )}
    </MainContainer>
  );
};

export default NftComponent;
