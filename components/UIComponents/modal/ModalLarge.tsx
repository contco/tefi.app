import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from '@contco/core-ui';

export const ModalLarge = styled(Box)`
  ${css({
    height: [530, null, 550, 600],
    width: ['80vw', null, null, null, 680],
    maxHeight: 600,
  })}
`;
