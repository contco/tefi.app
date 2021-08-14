import React from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { HoverContainer } from './style';

const Container = styled.div`
  ${css({
    py: 3,
  })}
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 0.5rem;
`;

const StyledHover = styled(HoverContainer)`
  ${css({
    mx: '14px',
    color: 'secondary',
  })}
  place-self: center;
`;

interface Props {
  data: any;
  onItemClick: any;
}

const Section: React.FC<Props> = ({ data, onItemClick }) => {
  return (
    <Container>
      {data.map(({ component: Component, src, alt, url }) => (
        <StyledHover onClick={() => onItemClick(url)}>
          {Component && <Component />}
          {src && <img src={src} alt={alt} height={26} width={26} />}
        </StyledHover>
      ))}
    </Container>
  );
};

export default Section;
