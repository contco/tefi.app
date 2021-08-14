import styled, {useTheme} from 'styled-components';
import { Flex } from '@contco/core-ui';
import { animated, config, useTransition } from 'react-spring';

const Container = styled(Flex)`
  height: 30px;
`;


const StyledPrice = styled(animated.p)`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 20,
    fontWeight: 600,
  })}
`;

interface Props {
  isPositive: boolean;
  shouldChangePriceColor: boolean;
  price: number;
}

export const AnimatedPrice: React.FC<Props> = ({ price, isPositive, shouldChangePriceColor }) => {
    const theme: any = useTheme();
    
    const colorChange = shouldChangePriceColor ? (isPositive ? 'green' : 'red') : theme.colors.secondary;
  
    const transitions = useTransition([`${price}`], {
      initial: null,
      from: { opacity: 0, y: -10, color: colorChange, fontWeight: shouldChangePriceColor ? 900 : 600 },
      enter: { opacity: 1, y: 0, color: theme.colors.secondary, fontWeight: 600 },
      leave: { opacity: 0, y: 10, color: colorChange, fontWeight: shouldChangePriceColor ? 900 : 600 },
      delay: shouldChangePriceColor ? 1000 : 50,
      config: config.wobbly,
    });
  
    return (
        <Container>
          <StyledPrice>$</StyledPrice>
          {transitions(({ opacity, y, color, fontWeight }, item) => (
            <StyledPrice
              style={{
                position: 'absolute',
                opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
                y,
                color,
                x: 16,
                fontWeight,
              }}
            >
              {item}
            </StyledPrice>
          ))}
        </Container>
    );
  };