import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

interface ImageProps {
  loaded: boolean;
  srcset?: string;
}

const StyledImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  object-fit: cover;
  object-position: center;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
`;

interface LowImageProps {
  blur: string;
}

const LowImage = styled(StyledImage)<LowImageProps>`
  filter: blur(${(props) => props.blur});
`;

interface MainImageAttrs {
  srcset?: string;
}

const MainImage = styled(StyledImage).attrs((props: MainImageAttrs) => ({
  srcSet: props?.srcset,
}))<ImageProps>`
  transition: opacity 1s;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
`;

interface Props {
  className?: string;
  base64Image?: string;
  alt?: string;
  srcset?: string;
  src: string;
  sizes?: string;
  blur?: string;
}
const LazyImage: React.FC<Props> = ({ className, base64Image, alt, src, srcset, sizes, blur = '3px' }: Props) => {
  const [loaded, setLoaded] = useState<boolean>(true);
  const imageRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (imageRef && imageRef.current && imageRef?.current?.complete) {
      setLoaded(true);
    }
  }, []);
  return (
    <Wrapper className={className}>
      <LowImage blur={blur} src={base64Image} aria-hidden="true" />
      <MainImage
        srcset={srcset}
        sizes={sizes}
        src={src}
        alt={alt}
        ref={imageRef}
        onLoad={() => setLoaded(true)}
        loaded={loaded}
      />
    </Wrapper>
  );
};

export default LazyImage;
