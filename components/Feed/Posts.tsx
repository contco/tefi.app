import React from 'react';
import styled from 'styled-components';
import Post from './Post';

const Container = styled.div``;

const Posts = ({ data }: any) => {
  return (
    <Container>
      {data.map((item) => (
        <Post data={item} key={item.tx} />
      ))}
    </Container>
  );
};

export default Posts;
