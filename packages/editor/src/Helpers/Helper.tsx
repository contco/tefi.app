import React, { FC, SVGProps, ReactChild, ReactChildren, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { StyledButton, StyledIcon, Container, Triangle, StyledMenu } from './HelperStyle';

// Button
export interface ButtonProps {
  active?: boolean;
  reversed?: boolean;
  children?: ReactChild | ReactChildren;
  onMouseDown?: (event: MouseEvent) => void;
}

export const Button = React.forwardRef<HTMLSpanElement, ButtonProps>(
  ({ active, reversed, onMouseDown, children, ...props }, ref) => (
    <StyledButton {...props} active={active} reversed={reversed} onMouseDown={onMouseDown} ref={ref}>
      {children}
    </StyledButton>
  ),
);

// icon
interface IconProps extends ButtonProps {
  svg: FC<SVGProps<SVGSVGElement>>;
  color?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ svg, ...props }, ref) => (
  <StyledIcon as={svg} {...props} ref={ref} width="11px" height="14px" />
));

// Menu
export const Menu: any = React.forwardRef(({ ...props }, ref: React.Ref<HTMLDivElement>) => (
  <Container ref={ref}>
    <Triangle />
    <StyledMenu {...props} />
  </Container>
));

interface PortalProps {
  children: React.ReactNode;
}
export const Portal: React.SFC<PortalProps> = ({ children }: PortalProps) => {
  let container;
  if (typeof window !== 'undefined') {
    const rootContainer = document.createElement('div');
    const parentElemNext = document.querySelector('#__next');
    const parentElemReact = document.getElementById('root');
    let parentElem: any;

    if (parentElemNext !== null) parentElem = parentElemNext;
    else parentElem = parentElemReact;

    parentElem?.appendChild(rootContainer);
    container = rootContainer;
  }
  return container ? ReactDOM.createPortal(children, container) : null;
};

// Link Input
export { LinkInput } from './HelperStyle';
