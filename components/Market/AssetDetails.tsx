import styled from 'styled-components';
import {Box} from "@contco/core-ui";
import { NewOpenIcon } from '../Icons';
import {AnimatedPrice} from './AnimatedPrice';
import { PriceChange } from './PriceChange';

const NamePriceContainer = styled(Box)`
width: 55%;
@media (max-width: 768px) {
  width: 85%;
}
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

interface Props {
  isPositive: boolean;
  shouldChangePriceColor: boolean;
  price: number;
  name: string;
  url?: string;
  priceChange: PriceChange
}

export const AssetDetails: React.FC<Props> = ({price, name, url, isPositive, shouldChangePriceColor, priceChange }) => {
  return(
    <NamePriceContainer>
      <StyledName href={url} target="_blank">
        {name} 
        <NewOpenIcon />
    </StyledName>
    <AnimatedPrice 
      price={price} 
      isPositive={isPositive} 
      shouldChangePriceColor={shouldChangePriceColor} />
      <PriceChange priceChange={priceChange}/>
    </NamePriceContainer>
  )
}