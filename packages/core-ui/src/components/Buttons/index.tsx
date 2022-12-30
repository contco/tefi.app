/* eslint-disable no-unused-vars */
import React, { forwardRef, Ref, FC, SVGProps, ReactNode } from 'react';
import styled from 'styled-components';
import { color, space, layout, flexbox } from 'styled-system';
import Flex from '../layout/Flex';

type Props = {
  onClick?: () => void;
  Icon?: React.FC<SVGProps<SVGSVGElement>>;
  name?: string;
  children?: ReactNode;
};

const ButtonStyle = styled(Flex)`
  ${color};
  ${space};
  ${layout};
  ${flexbox};
  as: a;
  background-color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;

const Button: FC<any> = forwardRef(({ children, ...props }: Props, ref: Ref<HTMLDivElement>) => (
  <ButtonStyle ref={ref} p={12} justifyContent="space-between" {...props}>
    {children}
  </ButtonStyle>
));

Button.defaultProps = {
  onClick: null,
  Icon: null,
  name: '',
  children: null,
};
export default Button;
