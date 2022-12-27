/* eslint-disable no-unused-vars */
import React, { forwardRef, Ref, FC } from 'react';
import styled from 'styled-components';
import { color, ColorProps, typography, TypographyProps, SpaceProps, LayoutProps } from 'styled-system';
import Box from '../layout/Box';

type TextProps = ColorProps & SpaceProps & LayoutProps & TypographyProps;

const Text = styled(Box)<TextProps>`
  ${color};
  ${typography};
`;

const TextComponent: FC<any> = forwardRef((props: any, ref: Ref<HTMLDivElement>) => <Text {...props} ref={ref} />);

export default TextComponent;
