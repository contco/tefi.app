import React, { forwardRef, Ref } from 'react';
import styled from 'styled-components';

import {
  color,
  ColorProps,
  space,
  SpaceProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  border,
  BorderProps,
} from 'styled-system';

type BoxProps = ColorProps & SpaceProps & LayoutProps & PositionProps & BorderProps;

const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  min-width: 0;
  ${space};
  ${color};
  ${layout};
  ${position};
  ${border};
`;

const BoxComponent = forwardRef((props: any, ref: Ref<HTMLDivElement>) => <Box ref={ref} {...props} />);

export default BoxComponent;
