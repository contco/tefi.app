import styled from "styled-components";
import {Flex, Text} from '@contco/core-ui';
import css from '@styled-system/css';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons';


const Container = styled(Flex)`
  ${props => css({
    color: props.isPositive ? 'green' : 'red',
    mt: 4,
    alignItems: 'center',
    ml:-1
  })}
`;

const StyledText = styled(Text)`
  ${css({
    fontSize: 2,
    fontWeight: 'bold',
    pt:1,
    px:1
  })})
`;

interface PriceChange {
    change: string;
    percentChange: string;
}

interface Props {
    priceChange: PriceChange
}

export const PriceChange: React.FC<Props> = ({priceChange}) => {

const isPositive = parseFloat(priceChange.change) > 0 ? true : false;

  return (
    <Container isPositive={isPositive}>
         {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon /> }
         <StyledText>${priceChange.change}</StyledText>
         <StyledText>({priceChange.percentChange}%)</StyledText>
    </Container>
  );
};