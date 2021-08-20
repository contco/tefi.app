import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Image from 'next/image';
import css from "@styled-system/css";
import {Box, Flex} from "@contco/core-ui";
import { useAlertContext } from '../../providers/AlertProvider';
import { NewOpenIcon, AlertIcon} from '../Icons';
import { PriceChange } from './PriceChange';
import {AlertSelect} from './AlertSelect';

const NamePriceContainer = styled(Box)`
width: 55%;
@media (max-width: 768px) {
  width: 85%;
}
margin-bottom: ${(props: any) => (props.useTV ? '30px' : 0)};
`;

const StyledName = styled.a`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 26,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    width: 'max-content',
  })}
  cursor: pointer;
`;

const StyledPrice = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 20,
    fontWeight: 600,
    bg:'green',
    mb: 0
  })}
`;

const PriceContainer = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: space-between; */
  /* align-items: center; */
  /* background-color: red; */
  /* height: 30px; */
`;


const ImageContainer: any = styled.div`
  background-color: ${(props: any) => (props.useTV ? 'black' : 'white')};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props: any) => (props.useTV ? 'black' : '#f5f5f5')};
    width: 52px;
    height: 52px;
    border-radius: 26px;
  }
  border: ${(props: any) => `1px solid ${props.theme.colors.secondary}`};
  ${css({
    mx:2,
  })}
`;

const NameTopBar = styled.div`
  height: 53px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionContainer = styled(Flex)`
  align-items: center;
`;

const AlertContainer = styled(ImageContainer)`
  position: relative;
`;

const StyledAlert = styled(AlertIcon)`
 ${props => css({
   color: props.isActive ? '#e67e22' : '#0221ba',
   transform: 'scale(1.1)',
 })}
`;

interface Props {
  price: number;
  name: string;
  url?: string;
  priceChange: PriceChange;
  useTV: any;
  onSwitchTV: any;
}

export const AssetDetails: React.FC<Props> = ({price, name, url, useTV, onSwitchTV, priceChange }) => {

  const [showAlertModal, setAlertModalVisible] = useState<boolean>(false);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(true);
  const router = useRouter();

  const {alerts} = useAlertContext();


  useEffect(() => { 
    const symbol = router.query.symbol as string;
    if(alerts[symbol]) {
      setIsAlertActive(true);
    }
    else if(!alerts[symbol] && isAlertActive) {
      setIsAlertActive(false);
    }
       
  }, [alerts, router.query.symbol]);
  
  return(
    <NamePriceContainer useTV={useTV}>
    <NameTopBar>
      <StyledName href={url} target="_blank">
        {name} 
        <NewOpenIcon />
      </StyledName>
      <ActionContainer>
        <ImageContainer onClick={onSwitchTV} useTV={useTV}>
          <Image width="30" height="16" src={useTV ? '/tv-white.png' : '/tv.png'} alt="Picture of the author" />
        </ImageContainer>
        <AlertContainer onClick={() => setAlertModalVisible(true)}>
          <StyledAlert isActive={isAlertActive} />
        </AlertContainer>
      </ActionContainer>
    </NameTopBar>
    {!useTV && (
        <PriceContainer>
          <StyledPrice>{`$${price}`}</StyledPrice>
          <PriceChange priceChange={priceChange}/>
         </PriceContainer>
      )}
    <AlertSelect isActive={isAlertActive} currentPrice={`${price}`} showAlertModal={showAlertModal} setAlertModalVisible={setAlertModalVisible} />
    </NamePriceContainer>
  )
}