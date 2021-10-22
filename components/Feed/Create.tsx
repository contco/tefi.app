import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';

const INPUT_PLACEHOLDER = 'Start Typing..';

const Container = styled(Box)`
  ${css({
    width: '100%',
    height: [200, null, null, 200, null, 250],
    bg: 'postBg',
    position: 'relative',
    borderRadius: 20,
  })}
`;

const Input = styled.textarea`
  resize: none;
  outline: 0px;
  height: 70%;
  line-height: 20px;
  width: 93%;
  ${css({
    mr: 2,
    mt: 3,
    mx: [3, null, 5],
    py: 3,
    pr: [4, null, 9],
    border: 0,
    bg: 'rgba(0,0,0,0)',
    color: 'postPrimary',
    fontSize: [0, null, 2],
    letterSpacing: 1,
    '&::placeholder': {
      color: 'postPrimary',
      fontSize: [0, null, 2],
    },
  })}
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

const StyledText = styled(Text)`
  ${css({
    color: 'postPrimary',
    fontSize: 0,
    fontWeight: 500,
  })}
`;

const CharText = styled(StyledText)`
  ${css({
    position: 'absolute',
    top: [2, 3],
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
    alignItems: 'center',
  })}
`;

const Submit = styled.button`
  display: flex;
  ${css({
    borderRadius: 25,
    width: [80, null, 120],
    height: [40],
    bg: 'postButtonBg',
    color: 'postSecondry',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    fontWeight: 500,
    fontSize: [0, null, 1],
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: 1,
    '&:hover': {
      opacity: 0.8,
    },
  })}
`;

const Loader = styled.div`
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  width: 19px;
  height: 19px;
  animation: spin 2s linear infinite;
  ${(props) =>
    css({
      borderTop: `2px solid ${props.theme.colors.postSecondry}`,
    })}
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const MAXT_TEXT = 250;

const getTextLength = (text) => {
  const textArr = Array.from(text);
  let actualLength = 0;

  textArr.map((item: any) => {
    const encoded = encodeURI(item);
    const encodedArr = encoded.split('%');
    let length = encodedArr.length;
    length = encodedArr[0].length ? length : length - 1;
    actualLength = length + actualLength;
  });

  return actualLength;
};

const Create = ({ onPost }: any) => {
  const [text, setText] = useState<string>('');
  const [textLength, setTextLength] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef();

  const handleChangeText = (event) => {
    const { value } = event.target;
    const newLen = getTextLength(value);
    if (newLen > MAXT_TEXT) return;
    setTextLength(newLen);
    setText(value);
  };

  const onSubmit = async () => {
    setLoading(true);
    const { error } = await onPost({ text });
    setLoading(false);
    if (!error) {
      setText('');
      setTextLength(0);
    }
  };

  return (
    <Container>
      <Input placeholder={INPUT_PLACEHOLDER} ref={inputRef} onChange={handleChangeText} value={text} />
      <CharText>{`${textLength} / ${MAXT_TEXT}`}</CharText>
      <BottomContainer>
        <AmountText>0.1 UST</AmountText>
        <Submit disabled={!text.length} onClick={onSubmit}>
          {loading ? <Loader /> : 'Submit'}
        </Submit>
      </BottomContainer>
    </Container>
  );
};

export default Create;
