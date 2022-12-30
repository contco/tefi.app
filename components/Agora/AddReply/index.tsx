import React, { useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text } from '@contco/core-ui';
import { Editor } from '@contco/editor';
import { PostCommentModal } from '../PostCommentModal';
import { ButtonRound } from '../../UIComponents';

const TITLE = 'Reply';
const EDITOR_PLACEHOLDER = 'Type here to add a reply!';
const ADD_REPLY_BTN_TEXT = 'Add Reply';
const EMPTY_CONTENT = [{ type: 'paragraph', children: [{ text: '' }] }];
const INITIAL_CONTENT = [{ type: 'text', document: [{ text: '' }] }];

const Container = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    color: 'secondary',
    px: 4,
  })}
`;

const Title = styled(Text)`
  ${css({
    fontSize: [3, null, null, null, null, null, null, 4],
    fontWeight: 'bold',
    py: 3,
    mr: [4, null, null, null, null, null, null, 2],
    ml: [4, null, null, null, null, null, null, 0],
  })}
`;

const ReplyInputContainer = styled(Box)`
  ${css({
    maxWidth: 900,
    width: '100%',
  })}
`;

const EditorContainer = styled(Box)`
  ${css({
    width: '100%',
    color: 'text3',
    bg: 'postBg',
    px: 3,
    pt: 1,
  })}
`;

const ButtonContainer = styled(Flex)`
  ${css({
    width: '100%',
    justifyContent: 'flex-end',
    my: 3,
  })}
`;

const StyledEditor = styled(Editor)`
  ${css({
    height: '100%',
    minHeight: [120, null, null, 140],
    width: '100%',
  })}
`;

interface Props {
  threadId: number;
}

export const AddReply: React.FC<Props> = ({ threadId }) => {
  const [content, setContent] = useState<any>(INITIAL_CONTENT);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const isEmptyContent = useMemo(
    () =>
      Object.keys(content).length === 0 ||
      !content?.raw ||
      JSON.stringify(content?.raw) === JSON.stringify(EMPTY_CONTENT),
    [content?.raw],
  );

  const onContentUpdate = (newContent: any) => {
    setContent(newContent);
    if (editorRef?.current?.scrollHeight && window?.scroll) {
      window.scroll(0, editorRef.current.scrollHeight);
    }
  };

  const onSubmitClick = () => {
    if (!isEmptyContent) {
      setIsModalVisible(true);
    }
  };
  return (
    <Container>
      <Title>{TITLE}</Title>
      <ReplyInputContainer>
        <EditorContainer ref={editorRef}>
          <StyledEditor placeholder={EDITOR_PLACEHOLDER} data={content} onContentUpdate={onContentUpdate} />
        </EditorContainer>
        <ButtonContainer>
          <ButtonRound onClick={onSubmitClick} disabled={isEmptyContent}>
            {ADD_REPLY_BTN_TEXT}
          </ButtonRound>
        </ButtonContainer>
      </ReplyInputContainer>
      <PostCommentModal
        threadId={threadId}
        replyContent={content}
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
      />
    </Container>
  );
};
