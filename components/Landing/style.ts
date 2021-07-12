import { Flex, Text, Button, Input, Box } from '@contco/core-ui';
import css from '@styled-system/css';
import styled from 'styled-components';

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 88vh;
`;

export const Title = styled(Text)`
  font-weight: 900;
  display: flex;
  align-items: flex-end;
  ${css({
    color: '#000',
    fontSize: [3, 6, 8, null, '50px'],
    letterSpacing: 2.5,
  })}
`;

export const Tefi = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: [6, 8, 10, null, '66px'],
    letterSpacing: 2.75,
  })}
`;

export const ConnectText = styled(Text)`
  font-weight: 500;
  transition: all 0.3s ease-in;
  ${css({
    fontSize: [14, null, 20],
    letterSpacing: '0.83px',
    color: 'secondary'
  })}
`;

export const ConnectButton = styled(Button)`
  border-radius: 34.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in;
  &:hover ${ConnectText}{
   color: ${props => props.theme.colors.primary}
  }
  ${(props) =>
    css({
      mt: ['10%', null, '5%'],
      border: props.theme.colors.connectborder,
      bg: 'primary',
      width: [250, null, 323],
      height: [45, null, 62],
      '&:hover': {
        bg: 'secondary',
      }

    })}
`;

export const OrText = styled(Text)`
  font-weight: 500;
  ${css({
    mt: ['6%', null, '3%'],
    fontSize: [14, null, 20],
    letterSpacing: '0.83px',
    color: '#000',
  })}
`;

export const AddressContainer = styled(Flex)`
  align-items: center;
  ${css({
    mt: ['2%', null, '1%', null, '3%'],
    flexDirection: ['column', null, 'row'],
  })}
`;

export const AddressInput = styled(Input)`
  border-radius: 36px;
  border: none;
  outline: none;

  ${css({
    mr: [null, null, 7],
    bg: '#f5f5f5',
    width: [260, 320, null, 450, null, null, 577],
    height: [40, null, 55, null, 62],
    fontSize: [2, null, 5],
    pl: '5%',
    '&::-webkit-input-placeholder': {
      fontSize: [2, null, 5],
      fontWeight: 500,
      letterSpacing: '1px',
      color: '#c1c1c1',
    },
  })}
`;

export const AddressSubmit = styled(Button)`
  border-radius: 34.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    css({
      mt: ['10px', null, '0px'],
      ml: [null, null, null, null, 15, null, 50],
      bg: 'secondary',
      width: [168, null, 140, null, 168],
      height: [45, null, 55, null, 62],
      opacity: props.disabled ? 0.7 : 1,
      pointerEvents: props.disabled ? 'none' : null,
    })}
`;

export const AddressSubmitText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: [1, null, 3],
    color: 'primary',
    letterSpacing: '0.83px',
  })};
`;

export const ModalBox = styled(Box)`
 ${css({
   bg: 'primary',
   height: [200, null,null,280],
   width: [300, null, null,600]
 })}
`;

export const ModalTitle = styled(Text)`
 ${css({
   color: 'secondary',
   pt: [4, null, null, 5],
   pb: [2, null, null,  0], 
   textAlign:'center',
   width: '100%',
   fontWeight: 'bold',
   fontSize: [1, null,3],
 })}}
`;

export const ModalSection = styled(Flex)`
  ${css({
    height:[40, null,null, 60],
    px:[3,null,null,5],
    bg: 'secondary',
    fontWeight: 'bold',
    opacity: 5,
    color:'primary',
    fontSize: [0, null, null,2],
    alignItems: 'center',
    my: [3,null, null,4],
    mx:[3, null,null,5],
    borderRadius: '15px',
    cursor: 'pointer',
    transition:'opacity 0.3s',
    '&:hover': {
      opacity: 0.7,
    }
  })}
`;