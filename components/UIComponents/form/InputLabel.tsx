import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '@contco/core-ui';

export const InputLabel = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: [1, null, null, null, 2],
    letterSpacing: 1,
    fontWeight: 500,
    mb: 2,
  })}
`;
