import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
import { RawViewer } from '@contco/editor';
import { EditReplyModal } from '../EditReplyModal';
import useWallet from '../../../lib/useWallet';
import { EDIT_ICON } from '../../Icons';

const Container = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    px: 4,
  })}
`;

const ContentBox = styled(Box)`
  ${css({
    width: '100%',
    maxWidth: 900,
    bg: 'postBg',
    color: 'secondary',
    px: 3,
    py: 1,
    my: 4,
    letterSpacing: 2,
    lineHeight: 1.5,
    fontSize: [1, null, null, null, null, null, null, 3],
  })}
`;

const StyledViewer = styled(RawViewer)`
  ${css({
    minHeight: 100,
    color: 'text3',
    px: 2,
  })}
`;

const OptionsContainer = styled(Flex)`
  ${(props) =>
    css({
      justifyContent: props.isEditable ? 'space-between' : 'flex-end',
      alignItems: 'center',
    })}
`;

const AddressText = styled(Text)`
  ${css({
    p: 2,
    color: 'text3',
    textAlign: 'right',
    fontSize: [1, null, null, null, null, null, null, 1],
  })}
`;

const EditIcon = styled(EDIT_ICON)`
  ${css({
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  })}
`;

interface Props {
  reply: Reply;
}

export const ReplyView: React.FC<Props> = ({ reply }) => {
  const [isUpdateReplyModalVisible, setUpdateReplyModalVisible] = useState(false);
  const rawContent = useMemo(() => JSON.parse(reply?.comment), [reply?.comment]);

  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;
  const isEditable = walletAddress === reply?.author;

  const onEditClick = () => {
    setUpdateReplyModalVisible(true);
  };

  return (
    <Container>
      <ContentBox>
        <StyledViewer data={rawContent} />
        <OptionsContainer isEditable={isEditable}>
          {isEditable ? <EditIcon onClick={onEditClick} /> : null}
          <AddressText>
            {' '}
            {reply.author.substring(0, 15) +
              '....' +
              reply.author.substring(reply.author.length - 4, reply.author.length - 1)}
          </AddressText>
        </OptionsContainer>
      </ContentBox>
      <EditReplyModal reply={reply} isVisible={isUpdateReplyModalVisible} setVisible={setUpdateReplyModalVisible} />
    </Container>
  );
};
