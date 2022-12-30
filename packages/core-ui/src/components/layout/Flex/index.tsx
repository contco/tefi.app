/* eslint-disable no-unused-vars */
import React, { forwardRef, Ref } from 'react';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  space,
  SpaceProps,
  layout,
  LayoutProps,
  flexbox,
  FlexProps,
  position,
  PositionProps,
} from 'styled-system';

type FlexBoxProps = ColorProps & SpaceProps & LayoutProps & FlexProps & PositionProps;

const Flex = styled.div<FlexBoxProps>`
  boxsizing: 'border-box';
  minwidth: 0;
  display: flex;
  ${color};
  ${space};
  ${layout};
  ${flexbox};
  ${position};
`;

const FlexComponent = forwardRef((props: any, ref: Ref<HTMLDivElement>) => <Flex ref={ref} {...props} />);

export default FlexComponent;
