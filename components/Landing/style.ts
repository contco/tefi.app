import { Flex, Text, Button, Input } from '@contco/core-ui';
import css from '@styled-system/css';
import styled from 'styled-components';

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

export const Title = styled(Text)`
  font-weight: 900;
  display: flex;
  align-items: flex-end;
  ${css({
    color: '#000',
    fontSize: [20, 28, 50],
    letterSpacing: 2.5,
  })}
`;

export const Tefi = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: [28, 36, 66],
    letterSpacing: 2.75,
  })}
`;

export const ConnectButton = styled(Button)`
  border-radius: 34.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${css({
    mt: ['10%', null, '5%'],
    border: 'solid 1px #0221ba',
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
    mt: ['2%', null, '3%'],
    flexDirection: ['column', null, 'row'],
  })}
`;

export const AddressInput = styled(Input)`
  border-radius: 36px;
  border: none;
  outline: none;

  ${css({
    mr: [null, null, 50],
    bg: '#f5f5f5',
    width: [260, 320, 577],
    height: [40, null, 72],
    fontSize: ['16px', null, 24],
    pl: '5%',
    '&::-webkit-input-placeholder': {
      fontSize: ['16px', null, 24],
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
  ${css({
    mt: ['10px', null, '0px'],
    ml: [null, null, 50],
    bg: 'secondary',
    width: 168,
    height: [45, null, 69],
  })}
`;

export const AddressSubmitText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: [14, null, 20],
    color: 'primary',
    letterSpacing: '0.83px',
  })};
`;
