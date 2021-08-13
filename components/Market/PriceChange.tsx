import styled from "styled-components";
import {Flex, Text} from '@contco/core-ui';
import css from '@styled-system/css';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons';


const Container = styled(Flex)`
  ${props => css({
    color: props.isPositive ? 'green' : 'red',
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

interface Props {
    priceChange: PriceChange
}

export const PriceChange: React.FC<Props> = ({priceChange}) => {


if(!priceChange) {
    return <> </>;
}
    
const isPositive = priceChange.change > 0 ? true : false;

  return (
    <Container isPositive={isPositive}>
        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon /> }
         <StyledText>${Math.abs(priceChange.change).toFixed(3)}</StyledText>
         <StyledText>({Math.abs(priceChange.percentChange).toFixed(2)}%)</StyledText>
    </Container>
  );
};