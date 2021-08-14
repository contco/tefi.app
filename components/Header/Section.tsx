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
  gap: 1rem 0;
`;

const StyledHover = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props: any) =>
    css({
      mx: '14px',
      color: 'secondary',
      borderRadius: '5px',
      transition: 'all ease-in 0.3s',
      cursor: 'pointer',
      bg: props.isActive ? 'focused' : 'transparent',
      '&:hover': {
        bg: 'focused',
      },
      pt: 2,
    })}
  place-self: stretch;
`;

interface Props {
  data: any;
  onItemClick: any;
}

const Section: React.FC<Props> = ({ data, onItemClick }) => {
  return (
    <Container>
      {data.map(({ component: Component, src, alt, url, name }) => (
        <StyledHover onClick={() => onItemClick(url)}>
          {Component && <Component />}
          {src && <img src={src} alt={alt} height={26} width={26} />}
          {name && <p style={{ fontSize: '9px', placeSelf: 'center' }}>{name}</p>}
        </StyledHover>
      ))}
    </Container>
  );
};

export default Section;
