import React, { useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

const Container = styled.div`
  border: 1px solid #f2f2f2;
  ${css({
    p: 3,
  })}
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  ${css({})}
`;

const Input = styled.textarea`
  resize: none;
  width: 100%;
  height: 60px;
  ${css({
    mr: 2,
    p: 2,
  })}
`;
const Submit = styled.button``;

const MAXT_TEXT = 250;

const Create = ({ onPost }: any) => {
  const [text, setText] = useState<string>('');

  const handleChnageText = (event) => {
    const { value } = event.target;
    const newText = value.slice(0, MAXT_TEXT);
    setText(newText);
  };

  return (
    <Container>
      <InnerContainer>
        <Input onChange={handleChnageText} value={text} />
        <Submit onClick={() => onPost({ text })}>Submit</Submit>
      </InnerContainer>
    </Container>
  );
};

export default Create;
