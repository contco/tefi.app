import React from 'react';
import styled from 'styled-components';
import Post from './Post';

const data = [
  { address: 'terra1....8jppll', text: '$LUNA -tics have your voice heard.', tx: '3' },
  { address: 'terra1....8jppll', text: 'introducing: decentralized, censorship-resistant social feeds. 🌕', tx: '2' },
  { address: 'terra1....8jppll', text: 'Hello, Terra! 🌎', tx: '1' },
];

const Container = styled.div``;

const Posts = ({}: any) => {
  return (
    <Container>
      {data.map((item) => (
        <Post data={item} key={item.tx} />
      ))}
    </Container>
  );
};

export default Posts;
