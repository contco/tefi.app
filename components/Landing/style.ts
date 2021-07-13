import { Flex, Text, Button, Input, Box } from '@contco/core-ui';
import css from '@styled-system/css';
import styled from 'styled-components';

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  height: 88vh;
  padding: 3%;
  justify-content: center;
  ${css({
  alignItems: ['stretch', 'stretch', 'stretch', 'center'],
})}
`;

export const Title = styled(Text)`
  font-weight: 900;
  display: flex;
  align-items: flex-end;
  ${css({
  color: 'title',
  fontSize: [3, 6, 8, null, '50px'],
  letterSpacing: 2.5,
  alignSelf: 'center'
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
  ${css({
  fontSize: [14, null, 19],
  letterSpacing: '0.83px',
  color: 'secondary'
})}
`;

export const ConnectButton = styled(Button)`
  border-radius: 30.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover ${ConnectText}{
   color: ${props => props.theme.colors.background}
  }
  ${(props) =>
    css({
      mt: [null, null, '80px', '5%'],
      border: props.theme.colors.connectborder,
      bg: 'transparent',
      width: ['100%', null, null, 303],
      height: [40, null, 48],
      '&:hover': {
        bg: 'secondary',
      }

    })}
`;

export const OrText = styled(Text)`
  font-weight: 500;
  ${css({
  mt: '33px',
  mb: '33px',
  fontSize: [14, null, 20],
  letterSpacing: '0.83px',
  color: 'title',
  textAlign: 'center'
})}
`;

export const AddressContainer = styled(Flex)`
  align-items: center;
  ${css({
  mt: ['2%', null, '1%', null, '3%'],
  flexDirection: ['column', null, null, 'row'],
})}
`;

export const AddressInput = styled(Input)`
  border-radius: 23px;
  border: none;
  outline: none;
  margin: 0;

  ${css({
  bg: '#f5f5f5',
  width: ['100%', null, null, 499],
  height: 56,
  fontSize: [2, null, '16px'],
  pl: '3.33%',
  pr: '3.33%',
  '&::-webkit-input-placeholder': {
    fontSize: [2, null, '18px'],
    fontWeight: 400,
    letterSpacing: '1px',
    color: '##687792',
  },
})}
`;

export const AddressSubmit = styled(Button)`
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    css({
      mt: ['9.3%', null, null, '0px'],
      ml: [null, null, null, '9.3%'],
      bg: 'secondary',
      width: ['100%', null, null, 168],
      height: 56,
      opacity: props.disabled ? 0.7 : 1,
      pointerEvents: props.disabled ? 'none' : null,
      '&:hover': {
        opacity: 0.7,
      }
    })}
`;

export const AddressSubmitText = styled(Text)`
  font-weight: 500;
  ${css({
  fontSize: [1, null, 3],
  color: 'background',
  letterSpacing: '0.83px',
})};
`;

export const ModalBox = styled(Box)`
 ${css({
  bg: 'background',
  height: [200, null, null, 280],
  width: [300, null, null, 600]
})}
`;

export const ModalTitle = styled(Text)`
 ${css({
  color: 'secondary',
  pt: [4, null, null, 5],
  pb: [2, null, null, 0],
  textAlign: 'center',
  width: '100%',
  fontWeight: 'bold',
  fontSize: [1, null, 3],
})}
`;

export const ModalSection = styled(Flex)`
  ${css({
  height: [40, null, null, 60],
  px: [3, null, null, 5],
  bg: 'secondary',
  fontWeight: 'bold',
  opacity: 5,
  color: 'background',
  fontSize: [0, null, null, 2],
  alignItems: 'center',
  my: [3, null, null, 4],
  mx: [3, null, null, 5],
  borderRadius: '15px',
  cursor: 'pointer',
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  }
})}
`;