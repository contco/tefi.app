/* eslint-disable no-unused-vars */
import React, { FC, forwardRef, Ref } from 'react';
import styled from 'styled-components';
import { color, ColorProps, typography, TypographyProps } from 'styled-system';
import Box from '../layout/Box';

type HeadingProps = ColorProps & TypographyProps;

const Heading = styled(Box)<HeadingProps>`
  ${color};
  ${typography};
`;

const HeadingComponent: FC<any> = forwardRef((props: any, ref: Ref<HTMLDivElement>) => (
  <Heading ref={ref} as="p" fontSize="36px" fontWeight="bold" textAlign="justify" {...props} />
));

export default HeadingComponent;
