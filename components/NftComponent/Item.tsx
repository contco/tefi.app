import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text, Avatar } from '@contco/core-ui';
import { LIGHT_THEME } from '../../constants';
import useWallet from '../../lib/useWallet';
import { useModalContext, useNftContext } from '../../contexts';
import { sendToken } from '../../transactions/sendToken';
import { SEND_ICON as SendIcon } from '../Icons';
import { StyledHover } from '../Header/Section';
import { NFT_CONTRACTS, TLOOT_CONTRACT} from './contracts';

const GP_CONTRACT_INFO = NFT_CONTRACTS[0];


export const NFTItemContainer = styled(Flex)`
  flex-direction: column;
  overflow: hidden;
  ${(props) =>
    css({
      boxShadow: props.theme.postShadow,
      bg: 'background',
    })}
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const NFTTextContainer = styled(Flex)`
  flex-direction: column;
  height: 99px;
  justify-content: center;
  ${(props) =>
    css({
      p: 3,
      pb: 0,
    })}
`;

export const NFTCollectionName = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.subHeading,
      fontWeight: 500,
      fontSize: ['14px', null, null, '14px'],
    })}
`;

export const NFTItemName = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.Heading,
      fontWeight: 500,
      mt: 2,
      fontSize: ['14px', null, null, '16px'],
    })}
`;

const NFTDescription = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.Heading,
      fontWeight: 500,
      mt: 2,
      fontSize: ['12px', null, null, '14px'],
    })}
`;

const BottomContainer = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  ${css({
    mb: 3,
    pr: 3,
  })}
`;

const AvatarContainer = styled(Flex)`
  ${(props) =>
    css({
      p: props.selected ? 1 : 0,
      border: `1px solid`,
      borderColor: props.selected ? 'secondary' : 'primary',
      borderRadius: '50%',
    })}
`;

const BidButton = styled.div`
  ${(props) =>
    css({
      bg: props.theme.colors.secondary,
    })}
  width: 25%;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BidText = styled.p`
  color: white;
  ${(props) =>
    css({
      color: props.theme.colors.primary,
    })}
  font-size: 11px;
`;

interface Props {
  data: any;
  currentTheme: any;
  address: string;
}

const Item: React.FC<Props> = ({ data, address }) => {
  const { onConnect, useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();
  const { profileNft, saveProfileNft } = useNftContext();
  const { sendNFT } = useModalContext();

  const isNftSelected = () => {
    return data?.tokenId === profileNft?.tokenId;
  };

  const onSetClick = () => {
    const sendData = {collection: data?.collection ?? data?.nftType, name: data?.name, src: data?.src ?? data?.image, tokenId: data.tokenId };
    sendNFT({
      from: connectedWallet.terraAddress,
      isNFT: true,
      tokenId: data?.tokenId,
      contract: 'terra103z9cnqm8psy0nyxqtugg6m7xnwvlkqdzm4s4k',
      data: sendData,
    });
  };

  
  return (
    <NFTItemContainer>
      <Image src={data?.src || data?.image || '/images/blank_nft.png'} />
      <NFTTextContainer>
        <NFTCollectionName>{data?.collection || data?.nftType}</NFTCollectionName>
        <NFTItemName>{data.name}</NFTItemName>
        {data?.nftContract === TLOOT_CONTRACT ? 
         <NFTDescription>{data?.description}</NFTDescription>
         : null
        }  
      </NFTTextContainer>
      <BottomContainer>
        {data?.collection === GP_CONTRACT_INFO.name && connectedWallet?.terraAddress && connectedWallet?.terraAddress === address && (
          <StyledHover
            style={{
              display: 'flex',
              width: '33px',
              height: '33px',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={onSetClick}
          >
            <div>
              <SendIcon />
            </div>
          </StyledHover>
        )}
      </BottomContainer>
    </NFTItemContainer>
  );
};

export default Item;
