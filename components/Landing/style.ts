import { Flex, Text, Button, Input, Box } from '@contco/core-ui';
import css from '@styled-system/css';
import styled from 'styled-components';

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  height: 88vh;
  padding: 16px;
  ${css({
    justifyContent: ['space-around', 'space-around', 'space-around', 'center'],
    padding: ['25% 3%', '25% 3%', '25% 16px', '0'],
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
    alignSelf: 'center',
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
    color: 'secondary',
  })}
`;

export const ConnectButton = styled(Button)`
  border-radius: 30.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover ${ConnectText} {
    color: ${(props) => props.theme.colors.background};
  }
  ${(props) =>
    css({
      mt: ['10%', null, '5%'],
      border: props.theme.colors.connectborder,
      bg: 'transparent',
      width: ['100%', null, null, 303],
      height: 56,
      '&:hover': {
        bg: 'secondary',
      },
    })}
`;

export const OrText = styled(Text)`
  font-weight: 500;
  ${css({
    mt: ['6%', null, '3%'],
    fontSize: [14, null, 20],
    letterSpacing: '0.83px',
    color: 'title',
    textAlign: 'center',
  })}
`;

export const AddressContainer = styled(Flex)`
  align-items: center;
  ${css({
    mt: ['2%', null, '1%', '3%'],
    flexDirection: ['column', null, null, 'row'],
  })}
`;

export const AddressInput = styled(Input)`
  border-radius: 9px;
  border: none;
  outline: none;
  margin: 0;

  ${css({
    bg: '#f5f5f5',
    width: ['100%', null, null, 400, null, 600],
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
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    css({
      mt: ['5%', null, '3%', '0px'],
      ml: [null, null, null, '9.3%'],
      bg: 'secondary',
      width: ['100%', null, null, 168],
      height: 56,
      opacity: props.disabled ? 0.7 : 1,
      pointerEvents: props.disabled ? 'none' : null,
      '&:hover': {
        opacity: 0.7,
      },
    })}
`;

export const AddressSubmitText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: [1, null, 4, 3],
    color: 'background',
    letterSpacing: '0.83px',
  })};
`;

export const WarningText = styled(Text)`
  ${(props) =>
    css({
      color: props.valid ? props.theme.colors.green : '#f39c12',
      fontSize: 0,
      minHeight: 12,
      m: 2,
    })}
`;

export const Row = styled(Box)`
  ${css({
    width: ['100%', null, null, 'auto'],
    minHeight: ['auto', null, null, 100, null],
  })}
`;
