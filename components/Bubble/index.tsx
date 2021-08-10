import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, Flex, Box } from '@contco/core-ui';
import { ICON_LUNA_URL, ICON_MIR_URL } from '../../constants';
import { fontSize } from 'styled-system';


const Container = styled(Flex)`
  ${css({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 80,
  paddingBottom: 40,
  boxSizing: 'border-box',
  height: [400, 480, 520, 600, null, 860, '100vh'],
})}
`;

const Row = styled(Flex)`
  ${css({
  width: '98vw',
  justifyContent: 'space-between',
})}
`;

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
  left: position?.left || 0

})}
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
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  color: '#ffffff',
  textAlign: 'center',
  width: 60,
  height: 40,
  fontWeight: 900,
  fontSize: [size / 2, null, size / 1],
  paddingLeft: 1
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
