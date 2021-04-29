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
    fontSize: 50,
    letterSpacing: 2.5,
  })}
`;

export const Tefi = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: 66,
    letterSpacing: 2.75,
  })}
`;

export const ConnectButton = styled(Button)`
  border-radius: 34.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 5%;
  ${css({
    border: 'solid 1px #0221ba',
    bg: 'primary',
    width: 323,
    height: 69,
  })}
`;

export const ConnectText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: 20,
    letterSpacing: '0.83px',
    color: 'secondary',
  })}
`;

export const OrText = styled(Text)`
  font-weight: 500;
  margin-top: 3%;
  ${css({
    fontSize: 20,
    letterSpacing: '0.83px',
    color: '#000',
  })}
`;

export const AddressContainer = styled(Flex)`
  align-items: center;
  margin-top: 3%;
`;

export const AddressInput = styled(Input)`
  border-radius: 36px;
  border: none;
  outline: none;

  ${css({
    mr: '50px',
    bg: '#f5f5f5',
    width: 577,
    height: 72,
    fontSize: 24,
    pl: '5%',
    '&::-webkit-input-placeholder': {
      fontSize: 24,
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
    ml: '50px',
    bg: 'secondary',
    width: 168,
    height: 69,
  })}
`;

export const AddressSubmitText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: 20,
    color: 'primary',
    letterSpacing: '0.83px',
  })};
`;
