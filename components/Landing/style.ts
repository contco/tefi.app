import { Flex, Text, Button, Input } from '@contco/core-ui';
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

export const ConnectButton = styled(Button)`
  border-radius: 34.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    css({
      mt: ['10%', null, '5%'],
      border: props.theme.colors.connectborder,
      bg: 'primary',
      width: [250, null, 323],
      height: [45, null, 69],
    })}
`;

export const ConnectText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: [14, null, 20],
    letterSpacing: '0.83px',
    color: 'secondary',
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
    height: [40, null, 55, null, 72],
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
      height: [45, null, 55, null, 69],
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
