import styled from 'styled-components';
import css from '@styled-system/css';
import {Flex, Box, Text} from '@contco/core-ui';

export const ModalSmall = styled(Box)`
  ${css({
    height: [260, null, null, 400],
    width: ['80vw', null, null, null, 680],
    maxHeight: 400,
    boxSizing: 'borderBox',
    px: 4,
  })}
`;

export const ContentContainer = styled(Flex)`
  ${css({
      height: [160, null, null, 240],
      flexDirection: 'column',
      justifyContent:'flex-end',
      py: [3, null, null, 4],
  })}
`;

export const IconContainer = styled(Flex)`
${css({
  mb: [0, null, null, 2],
  minHeight: 90,
  justifyContent: 'center',
  alignItems:'center',
  svg: {
    transform: ['scale(1.8)', null, null, 'scale(3)'],
    color: 'secondary',
  }
})}
`;

export const Title = styled(Text)`
  ${css({
    color: 'secondary',
    textAlign: 'center',
    width: '100%',
    fontSize: [2, null, null, 5],
    fontWeight: 500,
    letterSpacing: 1.5
  })}
`;

export const SmallText = styled(Text)`
${props => css({
  color: props.isError ? 'red' : 'secondary',
  fontSize: ['8px', null, null, 0],
  letterSpacing: 1,
  lineHeight: ['10px', null, null, '15px'],
})}
`;