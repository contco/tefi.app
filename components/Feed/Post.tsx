import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Post: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  return (
    <Container>
      <p>Post</p>
    </Container>
  );
};

export default Post;
