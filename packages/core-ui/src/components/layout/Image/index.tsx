import React, { forwardRef, Ref } from 'react';
import styled from 'styled-components';
import { layout, LayoutProps, space, SpaceProps } from 'styled-system';

type ImageProps = SpaceProps & LayoutProps;

const Image = styled.img<ImageProps>`
  box-sizing: border-box;
  min-width: 0;
  ${space};
  ${layout};
`;

const ImageComponent = forwardRef((props: any, ref: Ref<HTMLDivElement>) => <Image ref={ref} {...props} />);

export default ImageComponent;
