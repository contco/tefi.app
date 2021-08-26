import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Input = styled.input``;
const Submit = styled.button``;

const Create: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  return (
    <Container>
      <p>Create Post</p>
      <Input />
      <Submit>Submit</Submit>
    </Container>
  );
};

export default Create;
