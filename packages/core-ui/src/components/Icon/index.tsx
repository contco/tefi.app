/* eslint-disable no-unused-vars */
import React, { FC, SVGProps, forwardRef, Ref } from 'react';
import styled from 'styled-components';

type Props = {
  svg: FC<SVGProps<SVGSVGElement>>;
  color?: string;
  className?: string;
};

const IconStyle = styled.svg``;

const IconComponent: FC<Props> = forwardRef(({ svg, color = '#000', className, ...props }, ref: Ref<SVGSVGElement>) => (
  <IconStyle ref={ref} as={svg} color={color} className={className} {...props} />
));

export default IconComponent;
