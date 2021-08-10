import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '@contco/core-ui';


const OvalShap = styled.div<BubbleProps>`
  ${({ size, position, color }) => css({
  borderRadius: '50%',
  width: [50 * size, 60 * size, 70 * size, 84 * size, 90 * size, 110 * size, 120 * size, null, 130 * size, 150 * size],
  height: [50 * size, 60 * size, 70 * size, 84 * size, 90 * size, 110 * size, 120 * size, null, 130 * size, 150 * size],
  background: color,
  position: 'absolute',
  top: position?.top || 0,
  bottom: position?.bottom || 0,
  right: position?.right || 0,
  left: position?.left || 0,
})}
&:hover {
  border:3px solid ${({ theme }) => theme.colors.secondary} 
}
`;

const StyleImage = styled.img<BubbleProps>`
  ${({ size }) => css({
  borderRadius: '50%',
  width: [50 / 3 * size, 60 / 3 * size, 70 / 3 * size, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],
  height: [50 / 3 * size, 60 / 3 * size, 70 / 3 * size, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],
  position: 'relative',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  background: '#ffffff',
  padding: [0.5, null, 1],
})}
`;


const StyleText = styled(Text)`
  ${({ size }) => css({
  position: 'relative',
  top: '55%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  color: '#ffffff',
  textAlign: 'center',
  fontWeight: 900,
  fontSize: [5 * size + 'px', null, 12 * size + 'px'],
  paddingLeft: 1,
  width: [50 / 3 * size, 60 / 3 * size, 70 / 3 * size, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],
  height: [50 / 3 * size, 60 / 3 * size, 70 / 3 * size, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],

})}
`;

type Position = {
  top?: string,
  bottom?: string,
  right?: string,
  left?: string
}

export type BubbleProps = {
  price: string,
  symbol?: string,
  imageUrl: string,
  size: number,
  position: Position,
  color: string
}


const Bubble: React.FC<BubbleProps> = ({ ...BubbleProps }) => {
  const { size } = BubbleProps
  return (
    <OvalShap {...BubbleProps}>
      <StyleImage src={BubbleProps.imageUrl} {...BubbleProps} />
      <StyleText {...BubbleProps}>{BubbleProps.price}</StyleText>
    </OvalShap>
  );
};

export default Bubble;
