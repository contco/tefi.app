import styled from 'styled-components';
import { TWITTER_ICON, TELEGRAM_ICON } from '../Icons';
import { Flex, Box } from '@contco/core-ui';
import css from '@styled-system/css';


export const Link = styled.a`
  
`;


export const Wrapper = styled(Box)`
  height: 38px;
  align-self: center;
  width: '100%';
  bottom: 1.3%;
  position: absolute;
  right: 0;
  flex-direction: row;
  padding-right: 16px;
  

`;

export const TelegramIcon = styled(TELEGRAM_ICON)`

margin-top: 4px;

  ${css({
    color: 'secondary',
  })}
`;

export const TwitterIcon = styled(TWITTER_ICON)`
margin-top: 4px;
  ${css({
    color: 'secondary',
  })}
`;

export const HoverContainer = styled(Flex)`
  ${(props) =>
    css({
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: '50%',
      float: 'left',
      transition: 'all ease-in 0.3s',
      cursor: 'pointer',
      bg: props.isActive ? 'focused' : 'transparent',
      '&:hover': {
        bg: 'focused',
      },
    })}
`;