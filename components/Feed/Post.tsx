import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

const Container = styled.div`
  border: 1px solid #f2f2f2;
  ${css({
    mt: 3,
    p: 3,
  })}
`;

const Address = styled.p`
  font-size: 15px;
  color: blue;
`;

const Post = ({ data: { text, address } }: any) => {
  return (
    <Container>
      <Address>{address}</Address>
      <p>{text}</p>
    </Container>
  );
};

export default Post;
