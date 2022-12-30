import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text } from '@contco/core-ui';
import { RawViewer } from '@contco/editor';
import { EDIT_ICON } from '../../Icons';
import useWallet from '../../../lib/useWallet';
import { EditThreadModal } from '../EditThreadModal';

const Container = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    color: 'secondary',
  })}
`;

const ThreadHeader = styled(Flex)`
  ${({ theme }) =>
    css({
      justifyContent: 'space-between',
      alignItems: 'center',
      mr: [4, null, null, null, null, null, null, 2],
      ml: [4, null, null, null, null, null, null, 2],
      py: 3,
      px: 2,
      borderBottom: `0.5px solid ${theme.colors.background2}`,
    })}
`;

const ThreadTitle = styled(Text)`
  ${css({
    width: '90%',
    fontSize: [3, null, null, null, null, null, null, 4],
    fontWeight: 'bold',
  })}
`;

const ThreadContent = styled(Text)`
  ${css({
    my: 4,
    letterSpacing: 2,
    lineHeight: 1.5,
    px: [4, null, null, null, null, null, null, 0],
    fontSize: [1, null, null, null, null, null, null, 3],
  })}
`;

const StyledViewer = styled(RawViewer)`
  ${css({
    minHeight: 300,
    color: 'text3',
    px: 2,
  })}
`;

const EditIcon = styled(EDIT_ICON)`
  ${css({
    transform: 'scale(1.4)',
    cursor: 'pointer',
    mr: 3,
    '&:hover': {
      opacity: 0.7,
    },
  })}
`;

interface Props {
  thread: Thread;
}

export const ThreadDetail: React.FC<Props> = ({ thread }) => {
  const rawContent = useMemo(() => JSON.parse(thread.content), [thread.content]);
  const { useConnectedWallet } = useWallet();
  const [showEditModal, setShowEditModal] = useState(false);

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;
  const isEditable = walletAddress === thread?.author;

  const onEditClick = () => {
    if (isEditable) {
      setShowEditModal(true);
    }
  };

  return (
    <Container>
      <ThreadHeader>
        <ThreadTitle>{thread.title}</ThreadTitle>
        {isEditable ? <EditIcon onClick={onEditClick} /> : null}
      </ThreadHeader>
      <ThreadContent>
        <StyledViewer data={rawContent} />
      </ThreadContent>
      <EditThreadModal isVisible={showEditModal} setVisible={setShowEditModal} thread={thread} />
    </Container>
  );
};
