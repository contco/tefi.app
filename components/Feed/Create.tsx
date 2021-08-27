import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import {Flex, Box, Text} from '@contco/core-ui';

const INPUT_PLACEHOLDER = 'Start Typing..';

const Container = styled(Box)`
  ${css({
    width: '100%',
    height: [250],
    bg: 'lightBackground',
    position: 'relative',
  })}
`;


const Input = styled.textarea`
  resize: none;
  outline: 0px;
  height: 100%;
  width: 100%;
  ${css({
    mr: 2,
    px: [3, null, 5],
    py: [4, null, 5],
    pr: [4, null, 9],
    border: 0,
    bg: 'lightBackground',
    color: '#0e0e0e',
    fontSize: [0, null, 2],
    letterSpacing: 1,
    "&::placeholder": {
      color: '#0e0e0e',
      fontSize: [0, null, 2],
    }
  })}
`;

const StyledText = styled(Text)`
  ${css({
    color: '#0221ba',
    fontSize: 0,
    fontWeight: 500,
  })}
`;

const CharText = styled(StyledText)`
  ${css({
    position: 'absolute',
    top: [2, 3] , 
    right: 4,
  })}
`;

const AmountText = styled(StyledText)`
  ${css({
    bottom: 4, 
    right: 60,
    mr: 3,
  })}
`;


const BottomContainer = styled(Flex)`
  ${css({
    position: 'absolute',
    bottom: 3,
    right: 3,
    alignItems: 'center'
  })}
`;

const Submit = styled(Flex)`
 ${css({
   borderRadius: 25,
   width: [80, null, 120],
   height: [40],
   bg:'#0221ba',
   color: 'white',
   cursor: 'pointer',
   transition: 'all 0.3s ease-out',
   fontWeight: 500,
   fontSize: [0, null, 1],
   justifyContent: 'center',
   alignItems:'center',
   letterSpacing: 1,
   '&:hover': {
     opacity: 0.8,
   }
 })}
`;
const MAXT_TEXT = 250;

const Create = ({ onPost }: any) => {
  const [text, setText] = useState<string>('');
  const inputRef = useRef();

  const handleChangeText = (event) => {
    const { value } = event.target;
    const newText = value.slice(0, MAXT_TEXT);
    setText(newText);
  };

  const onSubmit = () => {
    onPost({ text });
    setText('');
  }
  return (
    <Container>
      <Input placeholder={INPUT_PLACEHOLDER} ref={inputRef} onChange={handleChangeText} value={text} />
      <CharText>{text.length} / 250</CharText>
      <BottomContainer>
          <AmountText>0.1 UST</AmountText>
          <Submit onClick={onSubmit}>Submit</Submit>
      </BottomContainer>
    </Container>
  );
};

export default Create;
