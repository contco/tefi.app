import styled from 'styled-components';
import css from '@styled-system/css';
import {Flex} from '@contco/core-ui';


export const ButtonRound = styled(Flex)`
  ${props => css({
    py: 3,
    width: [120, null, null, 240],
    borderRadius: 25,
    bg: 'secondary',
    color: 'postSecondry',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: props.disabled ? 'none' : 'all 0.3s ease-out',
    fontWeight: 500,
    fontSize: [1, null, null, 2],
    letterSpacing: 1,
    opacity: props.disabled ? 0.5 : 1,
    '&:hover': {
      opacity: props.disabled ? 0.5 : 0.8,
    },
  })}
`;