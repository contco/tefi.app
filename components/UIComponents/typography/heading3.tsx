import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '@contco/core-ui';

export const Heading3 = styled(Text)`
  ${css({
    color: 'secondary',
    pt: [4, null, null, 5],
    pb: [2, null, null, 0],
    textAlign: 'center',
    width: '100%',
    fontSize: [3, null, 5],
    fontWeight: 500,
    letterSpacing: 1.5,
  })}
`;
