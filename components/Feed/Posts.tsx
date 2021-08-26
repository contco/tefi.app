import React from 'react';
import styled from 'styled-components';

const data = [{ text: 'Post: 1' }, { text: 'Post: 2' }, { text: 'Post: 3' }];

const Container = styled.div``;

const Post: React.FC = ({}: any) => {
  return (
    <Container>
      {data.map(({ text }) => (
        <p>{text}</p>
      ))}
    </Container>
  );
};

export default Post;
